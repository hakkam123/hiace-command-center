import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { MapPin, Users, Radio, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

const initialVehicles: VehicleData[] = [
  { id: "H-01", driver: "Pak Agus", plat: "B 1234 XY", tipe: "Executive", totalSeat: 12, terdaftar: 10, onboard: 10, status: "normal", lat: -6.2, lng: 106.8, route: "Jakarta → Bandung" },
  { id: "H-02", driver: "Pak Budi", plat: "B 5678 AB", tipe: "Standard", totalSeat: 15, terdaftar: 12, onboard: 14, status: "alert", lat: -6.4, lng: 106.8, route: "Jakarta → Semarang" },
  { id: "H-03", driver: "Pak Cahyo", plat: "B 9012 CD", tipe: "VIP", totalSeat: 8, terdaftar: 7, onboard: 7, status: "normal", lat: -6.9, lng: 107.6, route: "Bandung → Surabaya" },
  { id: "H-04", driver: "Pak Dedi", plat: "B 3456 EF", tipe: "Executive", totalSeat: 12, terdaftar: 11, onboard: 12, status: "warning", lat: -6.6, lng: 106.9, route: "Jakarta → Cirebon" },
  { id: "H-05", driver: "Pak Eko", plat: "B 7890 GH", tipe: "Standard", totalSeat: 15, terdaftar: 13, onboard: 14, status: "alert", lat: -6.3, lng: 106.7, route: "Depok → Bandung" },
];

const statusColor = {
  normal: "bg-success",
  warning: "bg-warning",
  alert: "bg-destructive",
};

export default function LiveTrackingPage() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [selected, setSelected] = useState<VehicleData | null>(null);
  const [isLive, setIsLive] = useState(true);

  // Simulated real-time updates
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => ({
          ...v,
          onboard: v.onboard + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0),
          lat: v.lat + (Math.random() - 0.5) * 0.01,
          lng: v.lng + (Math.random() - 0.5) * 0.01,
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <DashboardLayout>
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
          {/* Map area */}
          <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden relative" style={{ minHeight: "500px" }}>
            {/* Dummy map background */}
            <div className="absolute inset-0 bg-secondary">
              <div className="w-full h-full relative" style={{ background: "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--muted)) 100%)" }}>
                {/* Grid lines to simulate map */}
                <svg className="w-full h-full absolute inset-0 opacity-20" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Vehicle markers */}
                {vehicles.map((v, i) => {
                  const x = 15 + (i * 18);
                  const y = 20 + (i % 3) * 25;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelected(v)}
                      className={cn(
                        "absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-all hover:scale-110 cursor-pointer",
                        v.status === "normal" ? "bg-success text-success-foreground" :
                        v.status === "warning" ? "bg-warning text-warning-foreground" :
                        "bg-destructive text-destructive-foreground animate-pulse-soft"
                      )}
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <MapPin className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Map legend */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              {(["normal", "warning", "alert"] as const).map((s) => (
                <span key={s} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/90 backdrop-blur text-xs font-medium text-card-foreground">
                  <span className={cn("w-2.5 h-2.5 rounded-full", statusColor[s])} />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              ))}
            </div>
          </div>

          {/* Vehicle list + detail panel */}
          <div className="space-y-4">
            {selected ? (
              <div className="glass-card rounded-2xl p-5 animate-scale-in space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">{selected.id}</h3>
                  <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    ["Driver", selected.driver],
                    ["Plat Nomor", selected.plat],
                    ["Tipe", selected.tipe],
                    ["Rute", selected.route],
                    ["Total Seat", String(selected.totalSeat)],
                    ["Terdaftar", String(selected.terdaftar)],
                    ["Onboard", String(selected.onboard)],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-foreground">{val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <StatusBadge variant={selected.status} />
                  </div>
                  {selected.onboard > selected.terdaftar && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium animate-fade-in">
                      ⚠️ Selisih: +{selected.onboard - selected.terdaftar} penumpang tidak terdaftar
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Vehicle List */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Semua Kendaraan</h3>
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelected(v)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                    selected?.id === v.id ? "bg-primary/10 border border-primary/20" : "glass-card hover:bg-secondary"
                  )}
                >
                  <div className={cn("w-3 h-3 rounded-full flex-shrink-0", statusColor[v.status])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{v.id} · {v.driver}</p>
                    <p className="text-xs text-muted-foreground">{v.route}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> {v.onboard}/{v.totalSeat}
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
