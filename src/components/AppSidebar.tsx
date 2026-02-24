import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Plus, FileText, Settings, LogOut, Shield } from "lucide-react";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/results" },
  { title: "New Inspection", icon: Plus, path: "/modality" },
  { title: "Reports", icon: FileText, path: "/reports" },
  { title: "Settings", icon: Settings, path: "#" },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-64 min-h-screen bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-foreground leading-tight">NDT AI</p>
            <p className="text-[10px] font-mono text-muted-foreground">Inspection System</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path) && item.path !== "#";
          return (
            <button
              key={item.title}
              onClick={() => item.path !== "#" && navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="font-medium">{item.title}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[hsl(var(--sidebar-border))]">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AppSidebar;
