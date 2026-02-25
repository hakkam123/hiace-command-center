import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { Search, Filter, Download, Eye, ChevronLeft, ChevronRight, X, Printer, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type TicketStatus = "menunggu" | "lunas" | "checkedin" | "dibatalkan";

interface TicketData {
  kode: string;
  nama: string;
  jurusan: string;
  tipeHiace: string;
  seat: string;
  status: TicketStatus;
  pembayaran: string;
  waktu: string;
}

const dummyTickets: TicketData[] = [
  { kode: "BK-20250225-001", nama: "Ahmad Fauzi", jurusan: "Jakarta → Bandung", tipeHiace: "Executive", seat: "A1", status: "lunas", pembayaran: "Transfer Bank", waktu: "08:30" },
  { kode: "BK-20250225-002", nama: "Siti Nurhaliza", jurusan: "Jakarta → Semarang", tipeHiace: "Standard", seat: "B3", status: "checkedin", pembayaran: "E-Wallet", waktu: "09:15" },
  { kode: "BK-20250225-003", nama: "Budi Santoso", jurusan: "Bandung → Surabaya", tipeHiace: "VIP", seat: "A2", status: "menunggu", pembayaran: "Cash", waktu: "10:00" },
  { kode: "BK-20250225-004", nama: "Dewi Lestari", jurusan: "Jakarta → Bandung", tipeHiace: "Executive", seat: "C1", status: "dibatalkan", pembayaran: "Transfer Bank", waktu: "11:20" },
  { kode: "BK-20250225-005", nama: "Rudi Hartono", jurusan: "Semarang → Jakarta", tipeHiace: "Standard", seat: "B2", status: "lunas", pembayaran: "E-Wallet", waktu: "07:45" },
  { kode: "BK-20250225-006", nama: "Maya Sari", jurusan: "Jakarta → Cirebon", tipeHiace: "Executive", seat: "A3", status: "checkedin", pembayaran: "QRIS", waktu: "06:30" },
  { kode: "BK-20250225-007", nama: "Hendra Wijaya", jurusan: "Bandung → Jakarta", tipeHiace: "VIP", seat: "A1", status: "lunas", pembayaran: "Transfer Bank", waktu: "12:00" },
  { kode: "BK-20250225-008", nama: "Lina Marlina", jurusan: "Jakarta → Bandung", tipeHiace: "Standard", seat: "C2", status: "menunggu", pembayaran: "Cash", waktu: "13:15" },
];

export default function TiketPage() {
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = dummyTickets.filter((t) => {
    const matchSearch =
      t.nama.toLowerCase().includes(search.toLowerCase()) ||
      t.kode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
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
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari tiket atau penumpang..."
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
                  statusFilter === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
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
                  {["Kode Booking", "Penumpang", "Jurusan", "Tipe", "Seat", "Status", "Pembayaran", "Waktu", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((ticket, idx) => (
                  <tr
                    key={ticket.kode}
                    className="border-b border-border/50 hover:bg-secondary/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <td className="px-4 py-3 text-sm font-mono text-foreground">{ticket.kode}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {ticket.nama.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground">{ticket.nama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{ticket.jurusan}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{ticket.tipeHiace}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{ticket.seat}</td>
                    <td className="px-4 py-3"><StatusBadge variant={ticket.status} /></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{ticket.pembayaran}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{ticket.waktu}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Menampilkan {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} dari {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 text-sm font-medium text-foreground">{page}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 text-muted-foreground">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}>
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="text-lg font-bold text-card-foreground">Detail Tiket</h2>
                <button onClick={() => setSelectedTicket(null)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                    {selectedTicket.nama.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-card-foreground">{selectedTicket.nama}</p>
                    <p className="text-sm text-muted-foreground">{selectedTicket.kode}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Jurusan", selectedTicket.jurusan],
                    ["Tipe Hiace", selectedTicket.tipeHiace],
                    ["Seat", selectedTicket.seat],
                    ["Pembayaran", selectedTicket.pembayaran],
                    ["Waktu", selectedTicket.waktu],
                  ].map(([label, val]) => (
                    <div key={label} className="p-3 rounded-xl bg-secondary">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium text-foreground">{val}</p>
                    </div>
                  ))}
                  <div className="p-3 rounded-xl bg-secondary">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="mt-1"><StatusBadge variant={selectedTicket.status} /></div>
                  </div>
                </div>
                {/* QR Code placeholder */}
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-xl bg-secondary border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
                    QR Code
                  </div>
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
      </div>
    </DashboardLayout>
  );
}
