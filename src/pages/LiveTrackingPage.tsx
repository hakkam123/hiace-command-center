import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { Users, Radio, X, Bus, Navigation2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Types ──────────────────────────────────────────────────────────────
interface VehicleData {
  id: string;
  driver: string;
  plat: string;
  tipe: string;
  totalSeat: number;
  terdaftar: number;
  onboard: number;
  status: "normal" | "warning" | "alert";
  lat: number;
  lng: number;
  route: string;
  routeCoords: [number, number][];
  origin: [number, number];
  destination: [number, number];
  speed: number; // km/h, 0 = idle
  heading: number; // degrees
  routeIndex: number; // current position index along the route
}

// ─── OSRM route fetcher (follows real roads) ────────────────────────────
async function fetchOSRMRoute(
  origin: [number, number],
  destination: [number, number]
): Promise<[number, number][]> {
  // OSRM uses lng,lat order
  const url = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === "Ok" && data.routes?.[0]) {
      // GeoJSON coords are [lng, lat], convert to [lat, lng] for Leaflet
      return data.routes[0].geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]] as [number, number]
      );
    }
  } catch (e) {
    console.warn("OSRM fetch failed, using fallback straight line", e);
  }
  return [origin, destination];
}

// ─── Downsample route to max N points (performance) ─────────────────────
function downsampleRoute(coords: [number, number][], maxPoints: number): [number, number][] {
  if (coords.length <= maxPoints) return coords;
  const step = (coords.length - 1) / (maxPoints - 1);
  const result: [number, number][] = [];
  for (let i = 0; i < maxPoints; i++) {
    result.push(coords[Math.round(i * step)]);
  }
  return result;
}

// ─── Route definitions: only origin & destination ───────────────────────
interface RouteDefinition {
  id: string;
  driver: string;
  plat: string;
  tipe: string;
  totalSeat: number;
  terdaftar: number;
  onboard: number;
  status: "normal" | "warning" | "alert";
  route: string;
  origin: [number, number];
  destination: [number, number];
  speed: number;
  heading: number;
  startProgress: number; // 0-1, where along the route the bus starts
}

const vehicleDefinitions: RouteDefinition[] = [
  { id: "H-01", driver: "Pak Agus", plat: "B 1234 XY", tipe: "Executive", totalSeat: 12, terdaftar: 10, onboard: 10, status: "normal", route: "Jakarta → Bandung", origin: [-6.2088, 106.8456], destination: [-6.9175, 107.6191], speed: 65, heading: 135, startProgress: 0.35 },
  { id: "H-02", driver: "Pak Budi", plat: "B 5678 AB", tipe: "Standard", totalSeat: 15, terdaftar: 12, onboard: 14, status: "alert", route: "Jakarta → Semarang", origin: [-6.2088, 106.8456], destination: [-6.9667, 110.4196], speed: 80, heading: 90, startProgress: 0.25 },
  { id: "H-03", driver: "Pak Cahyo", plat: "B 9012 CD", tipe: "VIP", totalSeat: 8, terdaftar: 7, onboard: 7, status: "normal", route: "Bandung → Surabaya", origin: [-6.9175, 107.6191], destination: [-7.2575, 112.7521], speed: 72, heading: 75, startProgress: 0.2 },
  { id: "H-04", driver: "Pak Dedi", plat: "B 3456 EF", tipe: "Executive", totalSeat: 12, terdaftar: 11, onboard: 12, status: "warning", route: "Jakarta → Cirebon", origin: [-6.2088, 106.8456], destination: [-6.7063, 108.5570], speed: 0, heading: 90, startProgress: 0.5 },
  { id: "H-05", driver: "Pak Eko", plat: "B 7890 GH", tipe: "Standard", totalSeat: 15, terdaftar: 13, onboard: 14, status: "alert", route: "Depok → Bandung", origin: [-6.4025, 106.7942], destination: [-6.9175, 107.6191], speed: 55, heading: 150, startProgress: 0.4 },
];

// ─── Bus icon SVG builder ───────────────────────────────────────────────
function createBusIcon(status: "normal" | "warning" | "alert", isMoving: boolean, isSelected: boolean): L.DivIcon {
  const color = status === "normal" ? "#22c55e" : status === "warning" ? "#f59e0b" : "#ef4444";
  const shadowColor = status === "normal" ? "rgba(34,197,94,0.35)" : status === "warning" ? "rgba(245,158,11,0.35)" : "rgba(239,68,68,0.35)";
  const ringSize = isSelected ? 52 : 44;
  const iconSize = isSelected ? 30 : 24;
  const pulseAnim = isMoving
    ? `<style>@keyframes busping{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.2);opacity:0}}</style><circle cx="${ringSize / 2}" cy="${ringSize / 2}" r="${ringSize / 2 - 2}" fill="none" stroke="${color}" stroke-width="2" style="animation:busping 1.5s ease-out infinite;transform-origin:center"/>`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ringSize}" height="${ringSize}" viewBox="0 0 ${ringSize} ${ringSize}">
    ${pulseAnim}
    <circle cx="${ringSize / 2}" cy="${ringSize / 2}" r="${iconSize / 2 + 4}" fill="${shadowColor}" />
    <circle cx="${ringSize / 2}" cy="${ringSize / 2}" r="${iconSize / 2 + 1}" fill="${color}" />
    <g transform="translate(${(ringSize - 18) / 2}, ${(ringSize - 18) / 2})">
      <rect x="1" y="3" width="16" height="12" rx="2" fill="white" opacity="0.95"/>
      <rect x="2" y="4" width="6" height="4" rx="0.5" fill="${color}" opacity="0.7"/>
      <rect x="10" y="4" width="6" height="4" rx="0.5" fill="${color}" opacity="0.7"/>
      <rect x="1" y="13" width="16" height="2" rx="0.5" fill="white" opacity="0.8"/>
      <circle cx="5" cy="16" r="1.5" fill="white"/>
      <circle cx="13" cy="16" r="1.5" fill="white"/>
    </g>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: "bus-marker-icon",
    iconSize: [ringSize, ringSize],
    iconAnchor: [ringSize / 2, ringSize / 2],
    popupAnchor: [0, -(ringSize / 2)],
  });
}

// ─── Start / End marker icons ───────────────────────────────────────────
const startIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#22c55e;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  className: "route-endpoint-icon",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const endIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  className: "route-endpoint-icon",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// ─── Component to fly map to selected vehicle ──────────────────────────
function FlyToVehicle({ vehicle }: { vehicle: VehicleData | null }) {
  const map = useMap();
  useEffect(() => {
    if (vehicle) {
      map.flyTo([vehicle.lat, vehicle.lng], 11, { duration: 1.2 });
    }
  }, [vehicle?.id, vehicle?.lat, vehicle?.lng, map]);
  return null;
}

// ─── Status color classes ───────────────────────────────────────────────
const statusColor = {
  normal: "bg-success",
  warning: "bg-warning",
  alert: "bg-destructive",
};
const statusTextColor = {
  normal: "text-success",
  warning: "text-warning",
  alert: "text-destructive",
};
const routeLineColor = {
  normal: "#22c55e",
  warning: "#f59e0b",
  alert: "#ef4444",
};

export default function LiveTrackingPage() {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [selected, setSelected] = useState<VehicleData | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [routesLoading, setRoutesLoading] = useState(true);
  const mapRef = useRef<L.Map | null>(null);

  // Keep selected vehicle in sync with updates
  const selectedVehicle = useMemo(
    () => (selected ? vehicles.find((v) => v.id === selected.id) ?? null : null),
    [selected, vehicles]
  );

  // Fetch real road routes from OSRM on mount
  useEffect(() => {
    let cancelled = false;
    async function loadRoutes() {
      setRoutesLoading(true);
      const results = await Promise.all(
        vehicleDefinitions.map(async (def) => {
          const fullRoute = await fetchOSRMRoute(def.origin, def.destination);
          // Downsample for movement simulation (keep full for display)
          const movementRoute = downsampleRoute(fullRoute, 500);
          const startIdx = Math.floor(def.startProgress * (movementRoute.length - 1));
          const startPos = movementRoute[startIdx];
          return {
            id: def.id,
            driver: def.driver,
            plat: def.plat,
            tipe: def.tipe,
            totalSeat: def.totalSeat,
            terdaftar: def.terdaftar,
            onboard: def.onboard,
            status: def.status,
            lat: startPos[0],
            lng: startPos[1],
            route: def.route,
            routeCoords: fullRoute,
            origin: def.origin,
            destination: def.destination,
            speed: def.speed,
            heading: def.heading,
            routeIndex: startIdx,
          } as VehicleData;
        })
      );
      if (!cancelled) {
        setVehicles(results);
        setRoutesLoading(false);
      }
    }
    loadRoutes();
    return () => { cancelled = true; };
  }, []);

  // Simulated real-time movement along the real road route
  useEffect(() => {
    if (!isLive || vehicles.length === 0) return;
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          const route = v.routeCoords;
          if (route.length < 2) return v;

          const isMoving = v.speed > 0;
          // Move 1-3 route points forward per tick
          const step = isMoving ? Math.floor(1 + Math.random() * 2) : 0;
          let newIdx = Math.min(v.routeIndex + step, route.length - 1);
          // If reached end, loop back to start
          if (newIdx >= route.length - 1) newIdx = 0;

          const newPos = route[newIdx];
          // Calculate heading from previous to current point
          const prevIdx = Math.max(newIdx - 1, 0);
          const prevPos = route[prevIdx];
          const dx = newPos[1] - prevPos[1];
          const dy = newPos[0] - prevPos[0];
          const newHeading = isMoving ? (Math.atan2(dx, -dy) * 180) / Math.PI : v.heading;

          // Randomly toggle speed occasionally
          const newSpeed = Math.random() > 0.92
            ? (v.speed === 0 ? 40 + Math.random() * 50 : 0)
            : v.speed === 0 ? 0 : 30 + Math.random() * 60;

          return {
            ...v,
            lat: newPos[0],
            lng: newPos[1],
            routeIndex: newIdx,
            heading: newHeading,
            speed: Math.round(newSpeed),
            onboard: Math.max(0, Math.min(v.totalSeat + 2, v.onboard + (Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [isLive, vehicles.length]);

  function handleSelect(v: VehicleData) {
    setSelected((prev) => (prev?.id === v.id ? null : v));
  }

  return (
    <DashboardLayout>
      {/* Extra styles for leaflet markers */}
      <style>{`
        .bus-marker-icon { background: none !important; border: none !important; }
        .route-endpoint-icon { background: none !important; border: none !important; }
        .leaflet-popup-content-wrapper { border-radius: 12px !important; padding: 0 !important; }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip { display: none !important; }
      `}</style>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Live Tracking</h1>
            <p className="text-muted-foreground text-sm mt-1">Pantau posisi Hiace secara real-time</p>
          </div>
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-semibold animate-pulse-soft">
                <Radio className="h-3 w-3" /> LIVE
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Map ────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden relative" style={{ minHeight: "540px" }}>
            {routesLoading && (
              <div className="absolute inset-0 z-[1001] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm font-medium text-muted-foreground">Memuat rute jalan...</p>
              </div>
            )}
            <MapContainer
              center={[-6.6, 107.4]}
              zoom={8}
              scrollWheelZoom
              className="w-full h-full z-0"
              style={{ minHeight: "540px" }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <FlyToVehicle vehicle={selectedVehicle} />

              {/* Show route polyline for selected vehicle */}
              {selectedVehicle && (
                <>
                  <Polyline
                    positions={selectedVehicle.routeCoords}
                    pathOptions={{
                      color: routeLineColor[selectedVehicle.status],
                      weight: 4,
                      opacity: 0.7,
                      dashArray: selectedVehicle.speed === 0 ? "8 8" : undefined,
                    }}
                  />
                  {/* Start marker */}
                  <Marker position={selectedVehicle.routeCoords[0]} icon={startIcon} />
                  {/* End marker */}
                  <Marker position={selectedVehicle.routeCoords[selectedVehicle.routeCoords.length - 1]} icon={endIcon} />
                </>
              )}

              {/* Vehicle markers */}
              {vehicles.map((v) => (
                <Marker
                  key={v.id}
                  position={[v.lat, v.lng]}
                  icon={createBusIcon(v.status, v.speed > 0, selectedVehicle?.id === v.id)}
                  eventHandlers={{
                    click: () => handleSelect(v),
                  }}
                >
                  <Popup>
                    <div className="p-3 min-w-[180px]">
                      <div className="flex items-center gap-2 mb-2">
                        <Bus className="h-4 w-4" style={{ color: routeLineColor[v.status] }} />
                        <span className="font-bold text-sm">{v.id}</span>
                        <span className={cn("ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full", v.speed > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                          {v.speed > 0 ? `${v.speed} km/h` : "Berhenti"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{v.driver} · {v.plat}</p>
                      <p className="text-xs text-gray-500 mt-1">{v.route}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Floating legend */}
            <div className="absolute bottom-4 left-4 z-[1000] flex gap-2">
              {(["normal", "warning", "alert"] as const).map((s) => (
                <span key={s} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/90 backdrop-blur text-xs font-medium text-card-foreground shadow-sm">
                  <span className={cn("w-2.5 h-2.5 rounded-full", statusColor[s])} />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              ))}
            </div>
          </div>

          {/* ── Vehicle list + detail panel ────────────────────────── */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {selectedVehicle ? (
              <div className="glass-card rounded-2xl p-5 animate-scale-in space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", statusColor[selectedVehicle.status])}>
                      <Bus className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{selectedVehicle.id}</h3>
                      <p className="text-xs text-muted-foreground">{selectedVehicle.driver}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Speed / heading indicator */}
                <div className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border",
                  selectedVehicle.speed > 0
                    ? "bg-success/5 border-success/20"
                    : "bg-muted/50 border-border"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    selectedVehicle.speed > 0 ? "bg-success/20" : "bg-muted"
                  )}>
                    <Navigation2
                      className={cn("h-5 w-5", selectedVehicle.speed > 0 ? "text-success" : "text-muted-foreground")}
                      style={{ transform: `rotate(${selectedVehicle.heading}deg)` }}
                    />
                  </div>
                  <div>
                    <p className={cn("text-lg font-bold", selectedVehicle.speed > 0 ? "text-success" : "text-muted-foreground")}>
                      {selectedVehicle.speed > 0 ? `${selectedVehicle.speed} km/h` : "Berhenti"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedVehicle.speed > 0 ? "Sedang bergerak" : "Kendaraan sedang diam"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    ["Plat Nomor", selectedVehicle.plat],
                    ["Tipe", selectedVehicle.tipe],
                    ["Rute", selectedVehicle.route],
                    ["Total Seat", String(selectedVehicle.totalSeat)],
                    ["Terdaftar", String(selectedVehicle.terdaftar)],
                    ["Onboard", String(selectedVehicle.onboard)],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-foreground">{val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <StatusBadge variant={selectedVehicle.status} />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Koordinat</span>
                    <span className="font-mono text-xs text-foreground">{selectedVehicle.lat.toFixed(4)}, {selectedVehicle.lng.toFixed(4)}</span>
                  </div>
                  {selectedVehicle.onboard > selectedVehicle.terdaftar && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium animate-fade-in">
                      ⚠️ Selisih: +{selectedVehicle.onboard - selectedVehicle.terdaftar} penumpang tidak terdaftar
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-5 text-center space-y-2">
                <Bus className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Pilih kendaraan untuk melihat detail & rute</p>
              </div>
            )}

            {/* Vehicle List */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Semua Kendaraan</h3>
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleSelect(v)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                    selectedVehicle?.id === v.id ? "bg-primary/10 border border-primary/20" : "glass-card hover:bg-secondary"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", statusColor[v.status])}>
                    <Bus className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{v.id} · {v.driver}</p>
                    <p className="text-xs text-muted-foreground">{v.route}</p>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-0.5">
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <Users className="h-3 w-3" /> {v.onboard}/{v.totalSeat}
                    </p>
                    <p className={cn("text-[10px] font-semibold", v.speed > 0 ? "text-success" : "text-muted-foreground")}>
                      {v.speed > 0 ? `${v.speed} km/h` : "Idle"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
