import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Armada {
  id: string;
  kodeArmada: string;
  platNomor: string;
  tipe: string;
  jumlahSeat: number;
  tahun: number;
  merk: string;
  warna: string;
}

const dummyArmada: Armada[] = [
  { id: "1", kodeArmada: "H-01", platNomor: "B 1234 XYZ", tipe: "Executive", jumlahSeat: 12, tahun: 2024, merk: "Toyota HiAce Premio", warna: "Putih" },
  { id: "2", kodeArmada: "H-02", platNomor: "B 5678 ABC", tipe: "Standard", jumlahSeat: 15, tahun: 2023, merk: "Toyota HiAce Commuter", warna: "Silver" },
  { id: "3", kodeArmada: "H-03", platNomor: "B 9012 DEF", tipe: "VIP", jumlahSeat: 8, tahun: 2024, merk: "Toyota HiAce Premio", warna: "Hitam" },
  { id: "4", kodeArmada: "H-04", platNomor: "D 3456 GHI", tipe: "Executive", jumlahSeat: 12, tahun: 2022, merk: "Toyota HiAce Premio", warna: "Putih" },
  { id: "5", kodeArmada: "H-05", platNomor: "D 7890 JKL", tipe: "Standard", jumlahSeat: 15, tahun: 2023, merk: "Toyota HiAce Commuter", warna: "Abu-abu" },
];

const tipeOptions = ["Standard", "VIP", "Executive"];

export default function ArmadaPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedArmada, setSelectedArmada] = useState<Armada | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [form, setForm] = useState({ kodeArmada: "", platNomor: "", tipe: "", jumlahSeat: "", tahun: "", merk: "", warna: "" });
  const handleChange = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Armada berhasil ditambahkan", description: `${form.kodeArmada} (${form.platNomor}) telah terdaftar.` });
    setForm({ kodeArmada: "", platNomor: "", tipe: "", jumlahSeat: "", tahun: "", merk: "", warna: "" });
    setShowForm(false);
  };

  const filtered = dummyArmada.filter((a) =>
    a.kodeArmada.toLowerCase().includes(search.toLowerCase()) ||
    a.platNomor.toLowerCase().includes(search.toLowerCase()) ||
    a.merk.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Armada</h1>
            <p className="text-muted-foreground text-sm mt-1">Kelola armada dan jenis Hiace</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Tambah Armada
          </button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari armada..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Kode", "Plat Nomor", "Tipe", "Seat", "Merk", "Tahun", "Warna", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((a, idx) => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                    <td className="px-4 py-3 text-sm font-mono font-medium text-foreground">{a.kodeArmada}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{a.platNomor}</td>
                    <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">{a.tipe}</span></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{a.jumlahSeat}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{a.merk}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{a.tahun}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{a.warna}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedArmada(a)} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Total: {filtered.length} armada</span>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 text-muted-foreground"><ChevronLeft className="h-4 w-4" /></button>
              <span className="px-3 text-sm font-medium text-foreground">{page}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 text-muted-foreground"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedArmada && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={() => setSelectedArmada(null)}>
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="text-lg font-bold text-card-foreground">Detail Armada</h2>
                <button onClick={() => setSelectedArmada(null)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                {[
                  ["Kode Armada", selectedArmada.kodeArmada],
                  ["Plat Nomor", selectedArmada.platNomor],
                  ["Tipe", selectedArmada.tipe],
                  ["Jumlah Seat", String(selectedArmada.jumlahSeat)],
                  ["Merk / Model", selectedArmada.merk],
                  ["Tahun", String(selectedArmada.tahun)],
                  ["Warna", selectedArmada.warna],
                ].map(([label, val]) => (
                  <div key={label} className="p-3 rounded-xl bg-secondary">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium text-foreground">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tambah Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl mx-4 animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="text-lg font-bold text-card-foreground">Tambah Armada</h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Kode Armada</Label><Input value={form.kodeArmada} onChange={(e) => handleChange("kodeArmada", e.target.value)} placeholder="H-06" required /></div>
                  <div className="space-y-2"><Label>Plat Nomor</Label><Input value={form.platNomor} onChange={(e) => handleChange("platNomor", e.target.value)} placeholder="B 1234 XX" required /></div>
                  <div className="space-y-2">
                    <Label>Tipe Hiace</Label>
                    <Select value={form.tipe} onValueChange={(v) => handleChange("tipe", v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih tipe" /></SelectTrigger>
                      <SelectContent>{tipeOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Jumlah Seat</Label><Input type="number" value={form.jumlahSeat} onChange={(e) => handleChange("jumlahSeat", e.target.value)} placeholder="12" required /></div>
                  <div className="space-y-2"><Label>Merk / Model</Label><Input value={form.merk} onChange={(e) => handleChange("merk", e.target.value)} placeholder="Toyota HiAce Premio" required /></div>
                  <div className="space-y-2"><Label>Tahun</Label><Input type="number" value={form.tahun} onChange={(e) => handleChange("tahun", e.target.value)} placeholder="2024" required /></div>
                  <div className="space-y-2"><Label>Warna</Label><Input value={form.warna} onChange={(e) => handleChange("warna", e.target.value)} placeholder="Putih" required /></div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
                  <Button type="submit">Simpan Armada</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
