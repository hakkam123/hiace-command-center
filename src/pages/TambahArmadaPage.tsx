import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const tipeOptions = ["Standard", "VIP", "Executive"];

export default function TambahArmadaPage() {
  const [form, setForm] = useState({
    kodeArmada: "",
    platNomor: "",
    tipe: "",
    jumlahSeat: "",
    tahun: "",
    merk: "",
    warna: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Armada berhasil ditambahkan", description: `${form.kodeArmada} (${form.platNomor}) telah terdaftar.` });
    setForm({ kodeArmada: "", platNomor: "", tipe: "", jumlahSeat: "", tahun: "", merk: "", warna: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Tambah Armada</h1>
          <p className="text-muted-foreground text-sm mt-1">Daftarkan armada / jenis Hiace baru</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5 animate-fade-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kode Armada</Label>
              <Input value={form.kodeArmada} onChange={(e) => handleChange("kodeArmada", e.target.value)} placeholder="Contoh: H-06" required />
            </div>
            <div className="space-y-2">
              <Label>Plat Nomor</Label>
              <Input value={form.platNomor} onChange={(e) => handleChange("platNomor", e.target.value)} placeholder="B 1234 XX" required />
            </div>
            <div className="space-y-2">
              <Label>Tipe Hiace</Label>
              <Select value={form.tipe} onValueChange={(v) => handleChange("tipe", v)}>
                <SelectTrigger><SelectValue placeholder="Pilih tipe" /></SelectTrigger>
                <SelectContent>
                  {tipeOptions.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jumlah Seat</Label>
              <Input type="number" value={form.jumlahSeat} onChange={(e) => handleChange("jumlahSeat", e.target.value)} placeholder="12" required />
            </div>
            <div className="space-y-2">
              <Label>Merk / Model</Label>
              <Input value={form.merk} onChange={(e) => handleChange("merk", e.target.value)} placeholder="Toyota HiAce Premio" required />
            </div>
            <div className="space-y-2">
              <Label>Tahun</Label>
              <Input type="number" value={form.tahun} onChange={(e) => handleChange("tahun", e.target.value)} placeholder="2024" required />
            </div>
            <div className="space-y-2">
              <Label>Warna</Label>
              <Input value={form.warna} onChange={(e) => handleChange("warna", e.target.value)} placeholder="Putih" required />
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto">Simpan Armada</Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
