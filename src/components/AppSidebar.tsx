import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  MapPin,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Tiket", path: "/tiket", icon: Ticket },
  { title: "Pengemudi", path: "/pengemudi", icon: UserPlus },
  { title: "Armada", path: "/armada", icon: Truck },
  { title: "Live Tracking", path: "/live-tracking", icon: MapPin },
  { title: "Penumpang Gelap", path: "/penumpang-gelap", icon: ShieldAlert },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 z-30",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <img
          src="/3rhiace logo.png"
          alt="3RHiace Logo"
          className="w-9 h-9 rounded-xl object-contain flex-shrink-0"
        />
        {!collapsed && (
          <span className="font-bold text-lg text-foreground tracking-tight animate-fade-in">
            3RHiace
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "sidebar-item",
                isActive && "sidebar-item-active"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-3 mb-4 p-2 rounded-xl hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-foreground flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
