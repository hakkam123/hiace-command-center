import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function TambahPengemudiPage() {
  const [form, setForm] = useState({
    nama: "",
    noHP: "",
    noKTP: "",
    alamat: "",
    jenisKelamin: "",
    tanggalLahir: "",
    noSIM: "",
    jenisSIM: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Pengemudi berhasil ditambahkan", description: `${form.nama} telah terdaftar.` });
    setForm({ nama: "", noHP: "", noKTP: "", alamat: "", jenisKelamin: "", tanggalLahir: "", noSIM: "", jenisSIM: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Tambah Pengemudi</h1>
          <p className="text-muted-foreground text-sm mt-1">Daftarkan pengemudi baru ke sistem</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5 animate-fade-in-up">
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
          <Button type="submit" className="w-full sm:w-auto">Simpan Pengemudi</Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
