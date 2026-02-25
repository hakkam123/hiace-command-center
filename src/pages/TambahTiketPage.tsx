import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { cn } from "@/lib/utils";
import { User, Upload, CreditCard, CheckCircle, Bus } from "lucide-react";

const cities = ["Jakarta", "Bandung", "Semarang", "Surabaya", "Cirebon", "Yogyakarta", "Depok", "Bekasi", "Tangerang"];
const hiaceTypes = [
  { id: "standard", name: "Standard", seats: 15, price: "Rp 150.000" },
  { id: "executive", name: "Executive", seats: 12, price: "Rp 250.000" },
  { id: "vip", name: "VIP", seats: 8, price: "Rp 400.000" },
];
const paymentMethods = ["Transfer Bank", "E-Wallet", "QRIS", "Cash"];

export default function TambahTiketPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    asal: "", tujuan: "", tanggal: "", jam: "",
    tipeHiace: "", seat: "",
    nama: "", hp: "", email: "", gender: "", tglLahir: "",
    pembayaran: "",
  });

  const selectedType = hiaceTypes.find((t) => t.id === form.tipeHiace);
  const totalSeats = selectedType?.seats || 12;

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Tambah Tiket Manual</h1>
          <p className="text-muted-foreground text-sm mt-1">Buat tiket untuk penumpang walk-in</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2">
          {[
            { n: 1, label: "Perjalanan", icon: Bus },
            { n: 2, label: "Penumpang", icon: User },
            { n: 3, label: "Verifikasi", icon: Upload },
            { n: 4, label: "Pembayaran", icon: CreditCard },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <button
                onClick={() => setStep(s.n)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  step === s.n
                    ? "bg-primary text-primary-foreground"
                    : step > s.n
                    ? "bg-success/10 text-success"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {step > s.n ? <CheckCircle className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < 3 && <div className="w-8 h-px bg-border hidden sm:block" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-5 animate-fade-in">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Bus className="h-4 w-4 text-primary" /> Detail Perjalanan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Kota Asal</label>
                    <select value={form.asal} onChange={(e) => update("asal", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="">Pilih kota</option>
                      {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Kota Tujuan</label>
                    <select value={form.tujuan} onChange={(e) => update("tujuan", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="">Pilih kota</option>
                      {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tanggal</label>
                    <input type="date" value={form.tanggal} onChange={(e) => update("tanggal", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Jam</label>
                    <input type="time" value={form.jam} onChange={(e) => update("jam", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>

                {/* Hiace Type */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Tipe Hiace</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {hiaceTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => update("tipeHiace", type.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-left transition-all",
                          form.tipeHiace === type.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        )}
                      >
                        <p className="text-sm font-semibold text-foreground">{type.name}</p>
                        <p className="text-xs text-muted-foreground">{type.seats} Seat · {type.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seat Map */}
                {form.tipeHiace && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Pilih Seat</label>
                    <div className="grid grid-cols-4 gap-2 max-w-xs">
                      {Array.from({ length: totalSeats }, (_, i) => {
                        const seatId = `${String.fromCharCode(65 + Math.floor(i / 4))}${(i % 4) + 1}`;
                        const isOccupied = ["A2", "B1", "C3"].includes(seatId);
                        const isSelected = form.seat === seatId;
                        return (
                          <button
                            key={seatId}
                            disabled={isOccupied}
                            onClick={() => update("seat", seatId)}
                            className={cn(
                              "p-2 rounded-lg text-xs font-medium transition-all",
                              isOccupied
                                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-40"
                                : isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-foreground hover:bg-primary/10"
                            )}
                          >
                            {seatId}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-secondary inline-block" /> Tersedia</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary inline-block" /> Dipilih</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-muted opacity-40 inline-block" /> Terisi</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Data Penumpang
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nama Lengkap</label>
                    <input type="text" value={form.nama} onChange={(e) => update("nama", e.target.value)} placeholder="Masukkan nama lengkap" className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nomor HP</label>
                    <input type="tel" value={form.hp} onChange={(e) => update("hp", e.target.value)} placeholder="08xxxxxxxxxx" className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email (optional)</label>
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@domain.com" className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Jenis Kelamin</label>
                    <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="">Pilih</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tanggal Lahir</label>
                    <input type="date" value={form.tglLahir} onChange={(e) => update("tglLahir", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Upload className="h-4 w-4 text-primary" /> Verifikasi Identitas
                </h3>
                <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Upload Selfie</p>
                  <p className="text-xs text-muted-foreground">Klik atau drag foto di sini</p>
                  <input type="file" accept="image/*" className="hidden" />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" /> Pembayaran
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((m) => (
                    <button
                      key={m}
                      onClick={() => update("pembayaran", m)}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all text-sm font-medium",
                        form.pembayaran === m
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                {form.pembayaran && (
                  <div className="p-4 rounded-xl bg-success/10 border border-success/20 flex items-center gap-3 animate-fade-in">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <p className="text-sm font-medium text-success">Status: LUNAS</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t border-border">
              <button
                disabled={step <= 1}
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-30"
              >
                Kembali
              </button>
              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Lanjut
                </button>
              ) : (
                <button className="px-6 py-2.5 rounded-xl bg-success text-success-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  Cetak Tiket
                </button>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="glass-card rounded-2xl p-5 h-fit space-y-4 animate-slide-in-left">
            <h3 className="text-sm font-semibold text-foreground">Ringkasan Booking</h3>
            <div className="space-y-3">
              {[
                ["Rute", form.asal && form.tujuan ? `${form.asal} → ${form.tujuan}` : "-"],
                ["Tanggal", form.tanggal || "-"],
                ["Jam", form.jam || "-"],
                ["Tipe", selectedType?.name || "-"],
                ["Seat", form.seat || "-"],
                ["Penumpang", form.nama || "-"],
                ["HP", form.hp || "-"],
                ["Pembayaran", form.pembayaran || "-"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{val}</span>
                </div>
              ))}
            </div>
            {selectedType && (
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">{selectedType.price}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
