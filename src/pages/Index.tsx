import {
  Ticket,
  Bus,
  Navigation,
  ShieldAlert,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import DashboardLayout from "@/components/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const revenueData = [
  { name: "Sen", value: 45 },
  { name: "Sel", value: 52 },
  { name: "Rab", value: 38 },
  { name: "Kam", value: 65 },
  { name: "Jum", value: 72 },
  { name: "Sab", value: 88 },
  { name: "Min", value: 64 },
];

const ticketTrend = [
  { name: "Jan", tiket: 120 },
  { name: "Feb", tiket: 150 },
  { name: "Mar", tiket: 180 },
  { name: "Apr", tiket: 160 },
  { name: "Mei", tiket: 210 },
  { name: "Jun", tiket: 240 },
];

const recentAlerts = [
  { id: 1, hiace: "H-02", lokasi: "Depok", jam: "14:35", selisih: "+2 orang" },
  { id: 2, hiace: "H-05", lokasi: "Bekasi", jam: "15:20", selisih: "+1 orang" },
  { id: 3, hiace: "H-01", lokasi: "Tangerang", jam: "16:05", selisih: "+3 orang" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Ringkasan operasional hari ini</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard title="Total Tiket Hari Ini" value={156} icon={Ticket} trend="+12% dari kemarin" trendUp variant="default" delay={0} />
          <StatCard title="Hiace Aktif" value={12} icon={Bus} variant="info" delay={50} />
          <StatCard title="Dalam Perjalanan" value={8} icon={Navigation} variant="success" delay={100} />
          <StatCard title="Alert Aktif" value={3} icon={AlertTriangle} variant="warning" delay={150} />
          <StatCard title="Penumpang Gelap" value={7} icon={ShieldAlert} trend="Bulan ini" variant="destructive" delay={200} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="stat-card opacity-0 animate-fade-in-up" style={{ animationDelay: "250ms" }}>
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Tiket Mingguan</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    color: "hsl(var(--popover-foreground))",
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trend Chart */}
          <div className="stat-card opacity-0 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Tren Tiket Bulanan</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={ticketTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    color: "hsl(var(--popover-foreground))",
                  }}
                />
                <Line type="monotone" dataKey="tiket" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="stat-card opacity-0 animate-fade-in-up" style={{ animationDelay: "350ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-card-foreground">Alert Terbaru</h3>
            <span className="text-xs text-muted-foreground">Penumpang Gelap</span>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-destructive/5 border border-destructive/10 hover:bg-destructive/10 transition-colors cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-destructive/10">
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">
                    Penumpang tidak terdaftar terdeteksi
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Hiace: {alert.hiace} · Lokasi: {alert.lokasi} · {alert.jam}
                  </p>
                </div>
                <span className="text-sm font-bold text-destructive whitespace-nowrap">{alert.selisih}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
