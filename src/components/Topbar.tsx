import { useState } from "react";
import { Search, Bell, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/hooks/useTheme";

export default function Topbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [alertCount] = useState(3);

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-6 gap-4">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari tiket, penumpang, driver..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          {alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-soft">
              {alertCount}
            </span>
          )}
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">Admin</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-xl shadow-lg py-1 animate-scale-in">
              <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-popover-foreground hover:bg-secondary transition-colors">
                <Settings className="h-4 w-4" /> Settings
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-secondary transition-colors">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
