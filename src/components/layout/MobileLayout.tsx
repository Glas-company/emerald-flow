import { Outlet } from "react-router-dom";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export function MobileLayout() {
  return (
    <div className="min-h-[100svh] h-[100svh] w-full bg-background flex flex-col items-center overflow-hidden">
      {/* Container principal: 100% no mobile, largura fixa no desktop */}
      <div className="flex-1 flex flex-col w-full md:max-w-[430px] bg-white h-full md:shadow-2xl overflow-hidden relative">
        {/* Main content area - scroll interno */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-safe safe-area-top" style={{ paddingBottom: 'calc(6.5rem + env(safe-area-inset-bottom, 0px))' }}>
          <Outlet />
        </main>
        
        {/* Bottom Navigation - fixa */}
        <BottomNavigation />
      </div>
    </div>
  );
}
