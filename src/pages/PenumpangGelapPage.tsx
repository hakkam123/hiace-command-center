import DashboardLayout from "@/components/DashboardLayout";
import { ShieldAlert, TrendingUp, Bus, User } from "lucide-react";
import StatCard from "@/components/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

const alerts = [
  { id: 1, hiace: "H-02", lokasi: "Depok", jam: "14:35", selisih: 2, driver: "Pak Budi", waktu: "25 Feb 2026" },
  { id: 2, hiace: "H-05", lokasi: "Bekasi", jam: "15:20", selisih: 1, driver: "Pak Eko", waktu: "25 Feb 2026" },
  { id: 3, hiace: "H-01", lokasi: "Tangerang", jam: "16:05", selisih: 3, driver: "Pak Agus", waktu: "24 Feb 2026" },
  { id: 4, hiace: "H-04", lokasi: "Cirebon", jam: "09:15", selisih: 1, driver: "Pak Dedi", waktu: "24 Feb 2026" },
  { id: 5, hiace: "H-02", lokasi: "Bogor", jam: "11:30", selisih: 2, driver: "Pak Budi", waktu: "23 Feb 2026" },
];

const monthlyData = [
  { name: "Sep", count: 3 },
  { name: "Okt", count: 5 },
  { name: "Nov", count: 2 },
  { name: "Des", count: 7 },
  { name: "Jan", count: 4 },
  { name: "Feb", count: 7 },
];

const byRoute = [
  { name: "Jakarta-Bandung", value: 12 },
  { name: "Jakarta-Semarang", value: 8 },
  { name: "Depok-Bandung", value: 5 },
  { name: "Jakarta-Cirebon", value: 3 },
];

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--warning))",
  "hsl(var(--info))",
];

const byHiace = [
  { name: "H-02", count: 8 },
  { name: "H-05", count: 5 },
  { name: "H-01", count: 4 },
  { name: "H-04", count: 3 },
  { name: "H-03", count: 1 },
];

const byDriver = [
  { name: "Pak Budi", count: 8 },
  { name: "Pak Eko", count: 5 },
  { name: "Pak Agus", count: 4 },
  { name: "Pak Dedi", count: 3 },
];

export default function PenumpangGelapPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Penumpang Gelap</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitoring & investigasi penumpang tidak terdaftar</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Bulan Ini" value={7} icon={ShieldAlert} variant="destructive" delay={0} />
          <StatCard title="Hiace Terlibat" value={4} icon={Bus} variant="warning" delay={50} />
          <StatCard title="Driver Terlibat" value={4} icon={User} variant="info" delay={100} />
          <StatCard title="Tren" value="+40%" icon={TrendingUp} trend="vs bulan lalu" variant="destructive" delay={150} />
        </div>

        {/* Alert List */}
        <div className="glass-card rounded-2xl p-5 space-y-3 animate-fade-in-up" style={{ animationDelay: "200ms", opacity: 0 }}>
          <h3 className="text-sm font-semibold text-foreground">Alert Terbaru</h3>
          <div className="space-y-2">
            {alerts.map((a, idx) => (
              <div
                key={a.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/10 hover:bg-destructive/10 transition-colors cursor-pointer animate-fade-in"
                style={{ animationDelay: `${250 + idx * 50}ms` }}
              >
                <div className="p-2.5 rounded-xl bg-destructive/10 flex-shrink-0">
                  <ShieldAlert className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Penumpang tidak terdaftar terdeteksi
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Hiace: {a.hiace} · Lokasi: {a.lokasi} · Jam: {a.jam} · Driver: {a.driver}
                  </p>
                  <p className="text-xs text-muted-foreground">{a.waktu}</p>
                </div>
                <span className="text-lg font-bold text-destructive whitespace-nowrap">+{a.selisih}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <div className="glass-card rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: "400ms", opacity: 0 }}>
            <h3 className="text-sm font-semibold text-foreground mb-4">Kejadian per Bulan</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--popover-foreground))" }} />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--destructive))" strokeWidth={2.5} dot={{ fill: "hsl(var(--destructive))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* By Route Pie */}
          <div className="glass-card rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: "450ms", opacity: 0 }}>
            <h3 className="text-sm font-semibold text-foreground mb-4">Per Jurusan</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={byRoute} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} fontSize={11}>
                  {byRoute.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--popover-foreground))" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* By Hiace */}
          <div className="glass-card rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: "500ms", opacity: 0 }}>
            <h3 className="text-sm font-semibold text-foreground mb-4">Hiace Paling Sering</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byHiace} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={50} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--popover-foreground))" }} />
                <Bar dataKey="count" fill="hsl(var(--warning))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* By Driver */}
          <div className="glass-card rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: "550ms", opacity: 0 }}>
            <h3 className="text-sm font-semibold text-foreground mb-4">Driver Paling Sering</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byDriver} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={70} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--popover-foreground))" }} />
                <Bar dataKey="count" fill="hsl(var(--info))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
