import { NavLink, useLocation } from "react-router-dom";
import { Home, Calculator, Package, History, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/app/home", icon: Home, label: "Início" },
  { path: "/app/produtos", icon: Package, label: "Produtos" },
  { path: "/app/calc", icon: Plus, label: "Calcular", isCenter: true },
  { path: "/app/favoritos", icon: History, label: "Histórico" },
  { path: "/app/perfil", icon: User, label: "Perfil" },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 pb-8 pt-3 safe-area-bottom z-50">
      <nav className="flex items-center justify-between max-w-lg mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.isCenter) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative -top-8"
              >
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90",
                  isActive 
                    ? "bg-primary text-white scale-110" 
                    : "bg-[#1a1a1a] text-white hover:bg-primary"
                )}>
                  <Icon size={32} strokeWidth={2.5} />
                </div>
                <span className={cn(
                  "absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-bold transition-colors duration-200 whitespace-nowrap",
                  isActive ? "text-primary" : "text-[#8a8a8a]"
                )}>
                  {item.label}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 group transition-all active:scale-95"
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-[#8a8a8a] group-hover:text-[#1a1a1a]"
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[11px] font-bold transition-colors duration-200",
                isActive ? "text-primary" : "text-[#8a8a8a]"
              )}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
