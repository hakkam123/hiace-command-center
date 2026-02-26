import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { Search, Download, Eye, ChevronLeft, ChevronRight, X, Printer, Mail, Plus, Upload, CheckCircle, Bus, User, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type TicketStatus = "menunggu" | "lunas" | "checkedin" | "dibatalkan";

interface Passenger {
  nama: string;
  hp: string;
  email: string;
  gender: string;
  tglLahir: string;
  seat: string;
  selfieUrl?: string;
}

interface BookingData {
  kode: string;
  jurusan: string;
  tipeHiace: string;
  tanggal: string;
  jam: string;
  status: TicketStatus;
  pembayaran: string;
  passengers: Passenger[];
}

const dummyBookings: BookingData[] = [
  {
    kode: "BK-20250225-001", jurusan: "Jakarta → Bandung", tipeHiace: "Executive", tanggal: "2025-02-25", jam: "08:30", status: "lunas", pembayaran: "Transfer Bank",
    passengers: [
      { nama: "Ahmad Fauzi", hp: "081234567890", email: "ahmad@mail.com", gender: "L", tglLahir: "1990-01-15", seat: "A1" },
      { nama: "Siti Aisyah", hp: "081234567891", email: "", gender: "P", tglLahir: "1992-05-20", seat: "A2" },
    ],
  },
  {
    kode: "BK-20250225-002", jurusan: "Jakarta → Semarang", tipeHiace: "Standard", tanggal: "2025-02-25", jam: "09:15", status: "checkedin", pembayaran: "E-Wallet",
    passengers: [
      { nama: "Siti Nurhaliza", hp: "081298765432", email: "siti@mail.com", gender: "P", tglLahir: "1988-03-10", seat: "B3" },
    ],
  },
  {
    kode: "BK-20250225-003", jurusan: "Bandung → Surabaya", tipeHiace: "VIP", tanggal: "2025-02-25", jam: "10:00", status: "menunggu", pembayaran: "Cash",
    passengers: [
      { nama: "Budi Santoso", hp: "081377788899", email: "", gender: "L", tglLahir: "1985-07-22", seat: "A2" },
      { nama: "Rina Wati", hp: "081377788800", email: "rina@mail.com", gender: "P", tglLahir: "1991-11-05", seat: "A3" },
      { nama: "Doni Prasetyo", hp: "081377788801", email: "", gender: "L", tglLahir: "1993-02-18", seat: "B1" },
    ],
  },
  {
    kode: "BK-20250225-004", jurusan: "Jakarta → Bandung", tipeHiace: "Executive", tanggal: "2025-02-25", jam: "11:20", status: "dibatalkan", pembayaran: "Transfer Bank",
    passengers: [{ nama: "Dewi Lestari", hp: "081455566677", email: "dewi@mail.com", gender: "P", tglLahir: "1995-09-30", seat: "C1" }],
  },
  {
    kode: "BK-20250225-005", jurusan: "Semarang → Jakarta", tipeHiace: "Standard", tanggal: "2025-02-25", jam: "07:45", status: "lunas", pembayaran: "E-Wallet",
    passengers: [{ nama: "Rudi Hartono", hp: "081533344455", email: "", gender: "L", tglLahir: "1987-04-12", seat: "B2" }],
  },
  {
    kode: "BK-20250225-006", jurusan: "Jakarta → Cirebon", tipeHiace: "Executive", tanggal: "2025-02-25", jam: "06:30", status: "checkedin", pembayaran: "QRIS",
    passengers: [
      { nama: "Maya Sari", hp: "081611122233", email: "maya@mail.com", gender: "P", tglLahir: "1994-06-08", seat: "A3" },
      { nama: "Andi Wijaya", hp: "081611122234", email: "", gender: "L", tglLahir: "1989-12-25", seat: "B1" },
    ],
  },
];

const cities = ["Jakarta", "Bandung", "Semarang", "Surabaya", "Cirebon", "Yogyakarta", "Depok", "Bekasi", "Tangerang"];
const hiaceTypes = [
  { id: "standard", name: "Standard", seats: 15, price: "Rp 150.000" },
  { id: "executive", name: "Executive", seats: 12, price: "Rp 250.000" },
  { id: "vip", name: "VIP", seats: 8, price: "Rp 400.000" },
];
const paymentMethods = ["Transfer Bank", "E-Wallet", "QRIS", "Cash"];

export default function TiketPage() {
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [showTambah, setShowTambah] = useState(false);
  const perPage = 6;

  // Tambah tiket form state
  const [step, setStep] = useState(1);
  const [tripForm, setTripForm] = useState({ asal: "", tujuan: "", tanggal: "", jam: "", tipeHiace: "", pembayaran: "" });
  const [passengers, setPassengers] = useState<Array<{ nama: string; hp: string; email: string; gender: string; tglLahir: string; seat: string }>>([
    { nama: "", hp: "", email: "", gender: "", tglLahir: "", seat: "" },
  ]);

  const selectedType = hiaceTypes.find((t) => t.id === tripForm.tipeHiace);
  const totalSeats = selectedType?.seats || 12;

  const updateTrip = (key: string, value: string) => setTripForm((prev) => ({ ...prev, [key]: value }));

  const updatePassenger = (index: number, key: string, value: string) => {
    setPassengers((prev) => prev.map((p, i) => (i === index ? { ...p, [key]: value } : p)));
  };

  const addPassenger = () => setPassengers((prev) => [...prev, { nama: "", hp: "", email: "", gender: "", tglLahir: "", seat: "" }]);
  const removePassenger = (index: number) => setPassengers((prev) => prev.filter((_, i) => i !== index));

  const selectedSeats = passengers.map((p) => p.seat).filter(Boolean);

  const handleTambahSubmit = () => {
    toast({ title: "Tiket berhasil dibuat", description: `${passengers.length} tiket untuk booking baru.` });
    setShowTambah(false);
    setStep(1);
    setTripForm({ asal: "", tujuan: "", tanggal: "", jam: "", tipeHiace: "", pembayaran: "" });
    setPassengers([{ nama: "", hp: "", email: "", gender: "", tglLahir: "", seat: "" }]);
  };

  const filtered = dummyBookings.filter((b) => {
    const matchSearch =
      b.passengers.some((p) => p.nama.toLowerCase().includes(search.toLowerCase())) ||
      b.kode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Tiket</h1>
            <p className="text-muted-foreground text-sm mt-1">Kelola semua tiket online & manual</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button
              onClick={() => setShowTambah(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" /> Tambah Tiket
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari kode booking atau penumpang..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "lunas", "checkedin", "menunggu", "dibatalkan"].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                  statusFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {s === "all" ? "Semua" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Kode Booking", "Penumpang", "Jumlah Tiket", "Jurusan", "Tipe", "Status", "Pembayaran", "Waktu", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((booking, idx) => (
                  <tr key={booking.kode} className="border-b border-border/50 hover:bg-secondary/50 transition-colors animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                    <td className="px-4 py-3 text-sm font-mono text-foreground">{booking.kode}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {booking.passengers.slice(0, 3).map((p, i) => (
                            <div key={i} className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border-2 border-card">
                              {p.nama.charAt(0)}
                            </div>
                          ))}
                        </div>
                        <span className="text-sm text-foreground">
                          {booking.passengers[0].nama}
                          {booking.passengers.length > 1 && <span className="text-muted-foreground"> +{booking.passengers.length - 1}</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">{booking.passengers.length} tiket</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{booking.jurusan}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{booking.tipeHiace}</td>
                    <td className="px-4 py-3"><StatusBadge variant={booking.status} /></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{booking.pembayaran}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{booking.jam}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedBooking(booking)} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Menampilkan {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} dari {filtered.length}</span>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 text-muted-foreground"><ChevronLeft className="h-4 w-4" /></button>
              <span className="px-3 text-sm font-medium text-foreground">{page}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 text-muted-foreground"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={() => setSelectedBooking(null)}>
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl mx-4 animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div>
                  <h2 className="text-lg font-bold text-card-foreground">Detail Booking</h2>
                  <p className="text-sm text-muted-foreground">{selectedBooking.kode}</p>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="p-5 space-y-5">
                {/* Booking info */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    ["Jurusan", selectedBooking.jurusan],
                    ["Tipe Hiace", selectedBooking.tipeHiace],
                    ["Tanggal", selectedBooking.tanggal],
                    ["Jam", selectedBooking.jam],
                    ["Pembayaran", selectedBooking.pembayaran],
                  ].map(([label, val]) => (
                    <div key={label} className="p-3 rounded-xl bg-secondary">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium text-foreground">{val}</p>
                    </div>
                  ))}
                  <div className="p-3 rounded-xl bg-secondary">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="mt-1"><StatusBadge variant={selectedBooking.status} /></div>
                  </div>
                </div>

                {/* Passengers */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Penumpang ({selectedBooking.passengers.length})</h3>
                  <div className="space-y-3">
                    {selectedBooking.passengers.map((p, i) => (
                      <div key={i} className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{p.nama.charAt(0)}</div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{p.nama}</p>
                              <p className="text-xs text-muted-foreground">Seat {p.seat} · {p.gender === "L" ? "Laki-laki" : "Perempuan"}</p>
                            </div>
                          </div>
                          {p.selfieUrl ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-border">
                              <img src={p.selfieUrl} alt="selfie" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <label className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium cursor-pointer hover:bg-primary/20 transition-colors">
                              Upload Selfie
                              <input type="file" accept="image/*" className="hidden" />
                            </label>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><span className="text-muted-foreground">HP:</span> <span className="text-foreground">{p.hp}</span></div>
                          <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{p.email || "-"}</span></div>
                          <div><span className="text-muted-foreground">Tgl Lahir:</span> <span className="text-foreground">{p.tglLahir}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-xl bg-secondary border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">QR Code</div>
                </div>
              </div>
              <div className="flex gap-2 p-5 border-t border-border">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  <Printer className="h-4 w-4" /> Print
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <Mail className="h-4 w-4" /> Kirim Email
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tambah Tiket Modal */}
        {showTambah && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={() => setShowTambah(false)}>
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl mx-4 animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="text-lg font-bold text-card-foreground">Tambah Tiket Manual</h2>
                <button onClick={() => setShowTambah(false)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>

              <div className="p-5">
                {/* Steps */}
                <div className="flex items-center gap-2 mb-6">
                  {[
                    { n: 1, label: "Perjalanan" },
                    { n: 2, label: "Penumpang" },
                    { n: 3, label: "Pembayaran" },
                  ].map((s, i) => (
                    <div key={s.n} className="flex items-center gap-2">
                      <button
                        onClick={() => setStep(s.n)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                          step === s.n ? "bg-primary text-primary-foreground" : step > s.n ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                        )}
                      >
                        <span>{s.n}</span>
                        <span className="hidden sm:inline">{s.label}</span>
                      </button>
                      {i < 2 && <div className="w-8 h-px bg-border hidden sm:block" />}
                    </div>
                  ))}
                </div>

                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Kota Asal</label>
                        <select value={tripForm.asal} onChange={(e) => updateTrip("asal", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30">
                          <option value="">Pilih kota</option>
                          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Kota Tujuan</label>
                        <select value={tripForm.tujuan} onChange={(e) => updateTrip("tujuan", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30">
                          <option value="">Pilih kota</option>
                          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tanggal</label>
                        <input type="date" value={tripForm.tanggal} onChange={(e) => updateTrip("tanggal", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Jam</label>
                        <input type="time" value={tripForm.jam} onChange={(e) => updateTrip("jam", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">Tipe Hiace</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {hiaceTypes.map((type) => (
                          <button key={type.id} onClick={() => updateTrip("tipeHiace", type.id)} className={cn("p-4 rounded-xl border-2 text-left transition-all", tripForm.tipeHiace === type.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")}>
                            <p className="text-sm font-semibold text-foreground">{type.name}</p>
                            <p className="text-xs text-muted-foreground">{type.seats} Seat · {type.price}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">Data Penumpang ({passengers.length})</h3>
                      <button onClick={addPassenger} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                        <Plus className="h-3 w-3" /> Tambah Penumpang
                      </button>
                    </div>
                    {passengers.map((p, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">Penumpang {idx + 1}</span>
                          {passengers.length > 1 && (
                            <button onClick={() => removePassenger(idx)} className="text-xs text-destructive hover:underline">Hapus</button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Nama Lengkap</label>
                            <input type="text" value={p.nama} onChange={(e) => updatePassenger(idx, "nama", e.target.value)} placeholder="Nama lengkap" className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Nomor HP</label>
                            <input type="tel" value={p.hp} onChange={(e) => updatePassenger(idx, "hp", e.target.value)} placeholder="08xxxxxxxxxx" className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Email (optional)</label>
                            <input type="email" value={p.email} onChange={(e) => updatePassenger(idx, "email", e.target.value)} placeholder="email@domain.com" className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Jenis Kelamin</label>
                            <select value={p.gender} onChange={(e) => updatePassenger(idx, "gender", e.target.value)} className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30">
                              <option value="">Pilih</option>
                              <option value="L">Laki-laki</option>
                              <option value="P">Perempuan</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Tanggal Lahir</label>
                            <input type="date" value={p.tglLahir} onChange={(e) => updatePassenger(idx, "tglLahir", e.target.value)} className="w-full px-3 py-2 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          </div>
                          {/* Seat picker */}
                          {tripForm.tipeHiace && (
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Pilih Seat</label>
                              <div className="flex flex-wrap gap-1.5">
                                {Array.from({ length: totalSeats }, (_, i) => {
                                  const seatId = `${String.fromCharCode(65 + Math.floor(i / 4))}${(i % 4) + 1}`;
                                  const isOccupied = ["A2", "B1", "C3"].includes(seatId);
                                  const isSelectedByOther = selectedSeats.includes(seatId) && p.seat !== seatId;
                                  const isSelected = p.seat === seatId;
                                  return (
                                    <button
                                      key={seatId}
                                      type="button"
                                      disabled={isOccupied || isSelectedByOther}
                                      onClick={() => updatePassenger(idx, "seat", seatId)}
                                      className={cn(
                                        "w-8 h-8 rounded text-xs font-medium transition-all",
                                        isOccupied || isSelectedByOther ? "bg-muted text-muted-foreground cursor-not-allowed opacity-40"
                                          : isSelected ? "bg-primary text-primary-foreground"
                                          : "bg-secondary text-foreground hover:bg-primary/10"
                                      )}
                                    >
                                      {seatId}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {paymentMethods.map((m) => (
                        <button key={m} onClick={() => updateTrip("pembayaran", m)} className={cn("p-4 rounded-xl border-2 text-left transition-all text-sm font-medium", tripForm.pembayaran === m ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/30")}>
                          {m}
                        </button>
                      ))}
                    </div>
                    {tripForm.pembayaran && (
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 animate-fade-in">
                        <p className="text-sm font-medium text-primary">Status: LUNAS</p>
                      </div>
                    )}
                    {/* Summary */}
                    <div className="p-4 rounded-xl bg-secondary space-y-2">
                      <h4 className="text-sm font-semibold text-foreground">Ringkasan</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between"><span className="text-muted-foreground">Rute</span><span className="text-foreground">{tripForm.asal} → {tripForm.tujuan}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Tanggal</span><span className="text-foreground">{tripForm.tanggal} {tripForm.jam}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Tipe</span><span className="text-foreground">{selectedType?.name || "-"}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Jumlah Tiket</span><span className="text-foreground">{passengers.length}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Penumpang</span><span className="text-foreground">{passengers.map((p) => p.nama || "-").join(", ")}</span></div>
                        {selectedType && (
                          <div className="flex justify-between pt-2 border-t border-border font-semibold">
                            <span className="text-foreground">Total</span>
                            <span className="text-primary">Rp {(parseInt(selectedType.price.replace(/\D/g, "")) * passengers.length).toLocaleString("id-ID")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-5 border-t border-border mt-5">
                  <button disabled={step <= 1} onClick={() => setStep(step - 1)} className="px-4 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-30">
                    Kembali
                  </button>
                  {step < 3 ? (
                    <button onClick={() => setStep(step + 1)} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                      Lanjut
                    </button>
                  ) : (
                    <button onClick={handleTambahSubmit} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                      Cetak Tiket
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
