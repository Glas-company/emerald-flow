import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, User, Settings, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/app" },
  { icon: MessageSquare, label: "Chat", path: "/app/chat" },
  { icon: BarChart3, label: "Métricas", path: "/app/admin/metricas" },
  { icon: User, label: "Perfil", path: "/app/configuracoes" },
];

export function MobileLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === "/app" && location.pathname === "/app");
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "bottom-nav-item flex-1",
                  isActive && "active"
                )}
              >
                <item.icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn(
                    "transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                />
                <span className={cn(
                  "text-xs mt-1 font-medium",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
