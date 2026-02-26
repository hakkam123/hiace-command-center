import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Pengemudi {
  id: string;
  nama: string;
  noHP: string;
  noKTP: string;
  alamat: string;
  jenisKelamin: string;
  tanggalLahir: string;
  noSIM: string;
  jenisSIM: string;
}

const dummyPengemudi: Pengemudi[] = [
  { id: "D-001", nama: "Agus Salim", noHP: "081234567890", noKTP: "3201010101010001", alamat: "Jakarta Selatan", jenisKelamin: "Laki-laki", tanggalLahir: "1985-03-15", noSIM: "SIM-001", jenisSIM: "B2" },
  { id: "D-002", nama: "Bambang Susanto", noHP: "081298765432", noKTP: "3201010101010002", alamat: "Bandung", jenisKelamin: "Laki-laki", tanggalLahir: "1990-07-22", noSIM: "SIM-002", jenisSIM: "B1" },
  { id: "D-003", nama: "Candra Wijaya", noHP: "081377788899", noKTP: "3201010101010003", alamat: "Depok", jenisKelamin: "Laki-laki", tanggalLahir: "1988-11-05", noSIM: "SIM-003", jenisSIM: "B2" },
  { id: "D-004", nama: "Dian Purnama", noHP: "081455566677", noKTP: "3201010101010004", alamat: "Bekasi", jenisKelamin: "Perempuan", tanggalLahir: "1992-01-18", noSIM: "SIM-004", jenisSIM: "B1" },
  { id: "D-005", nama: "Eko Prasetyo", noHP: "081533344455", noKTP: "3201010101010005", alamat: "Tangerang", jenisKelamin: "Laki-laki", tanggalLahir: "1987-09-30", noSIM: "SIM-005", jenisSIM: "B2" },
];

export default function PengemudiPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Pengemudi | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [form, setForm] = useState({
    nama: "", noHP: "", noKTP: "", alamat: "", jenisKelamin: "", tanggalLahir: "", noSIM: "", jenisSIM: "",
  });

  const handleChange = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Pengemudi berhasil ditambahkan", description: `${form.nama} telah terdaftar.` });
    setForm({ nama: "", noHP: "", noKTP: "", alamat: "", jenisKelamin: "", tanggalLahir: "", noSIM: "", jenisSIM: "" });
    setShowForm(false);
  };

  const filtered = dummyPengemudi.filter((d) =>
    d.nama.toLowerCase().includes(search.toLowerCase()) ||
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Pengemudi</h1>
            <p className="text-muted-foreground text-sm mt-1">Kelola data pengemudi armada</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Tambah Pengemudi
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari pengemudi..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["ID", "Nama", "No. HP", "Jenis SIM", "No. SIM", "Alamat", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((d, idx) => (
                  <tr key={d.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                    <td className="px-4 py-3 text-sm font-mono text-foreground">{d.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{d.nama.charAt(0)}</div>
                        <span className="text-sm font-medium text-foreground">{d.nama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{d.noHP}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{d.jenisSIM}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{d.noSIM}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{d.alamat}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedDriver(d)} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Total: {filtered.length} pengemudi</span>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 text-muted-foreground"><ChevronLeft className="h-4 w-4" /></button>
              <span className="px-3 text-sm font-medium text-foreground">{page}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 text-muted-foreground"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedDriver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={() => setSelectedDriver(null)}>
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="text-lg font-bold text-card-foreground">Detail Pengemudi</h2>
                <button onClick={() => setSelectedDriver(null)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">{selectedDriver.nama.charAt(0)}</div>
                  <div>
                    <p className="text-lg font-bold text-card-foreground">{selectedDriver.nama}</p>
                    <p className="text-sm text-muted-foreground">{selectedDriver.id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["No. HP", selectedDriver.noHP],
                    ["No. KTP", selectedDriver.noKTP],
                    ["Jenis Kelamin", selectedDriver.jenisKelamin],
                    ["Tanggal Lahir", selectedDriver.tanggalLahir],
                    ["No. SIM", selectedDriver.noSIM],
                    ["Jenis SIM", selectedDriver.jenisSIM],
                    ["Alamat", selectedDriver.alamat],
                  ].map(([label, val]) => (
                    <div key={label} className="p-3 rounded-xl bg-secondary">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium text-foreground">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tambah Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl mx-4 animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="text-lg font-bold text-card-foreground">Tambah Pengemudi</h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Lengkap</Label>
                    <Input value={form.nama} onChange={(e) => handleChange("nama", e.target.value)} placeholder="Masukkan nama lengkap" required />
                  </div>
                  <div className="space-y-2">
                    <Label>No. HP</Label>
                    <Input value={form.noHP} onChange={(e) => handleChange("noHP", e.target.value)} placeholder="08xxxxxxxxxx" required />
                  </div>
                  <div className="space-y-2">
                    <Label>No. KTP</Label>
                    <Input value={form.noKTP} onChange={(e) => handleChange("noKTP", e.target.value)} placeholder="Masukkan No. KTP" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Jenis Kelamin</Label>
                    <Select value={form.jenisKelamin} onValueChange={(v) => handleChange("jenisKelamin", v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Lahir</Label>
                    <Input type="date" value={form.tanggalLahir} onChange={(e) => handleChange("tanggalLahir", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Alamat</Label>
                    <Input value={form.alamat} onChange={(e) => handleChange("alamat", e.target.value)} placeholder="Masukkan alamat" required />
                  </div>
                  <div className="space-y-2">
                    <Label>No. SIM</Label>
                    <Input value={form.noSIM} onChange={(e) => handleChange("noSIM", e.target.value)} placeholder="Masukkan No. SIM" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Jenis SIM</Label>
                    <Select value={form.jenisSIM} onValueChange={(v) => handleChange("jenisSIM", v)}>
                      <SelectTrigger><SelectValue placeholder="Pilih jenis SIM" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B1">B1</SelectItem>
                        <SelectItem value="B2">B2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
                  <Button type="submit">Simpan Pengemudi</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
