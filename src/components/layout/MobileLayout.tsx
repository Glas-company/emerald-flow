import { Outlet } from "react-router-dom";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export function MobileLayout() {
  return (
    <div className="min-h-screen-safe w-full bg-background flex flex-col items-center overflow-x-hidden">
      {/* Container principal: 100% no mobile, largura fixa no desktop */}
      <div className="flex-1 flex flex-col w-full md:max-w-[430px] bg-white min-h-screen-safe relative md:shadow-2xl overflow-x-hidden">
        <main className="flex-1 overflow-y-auto px-4 pb-32 pt-safe safe-area-top w-full overflow-x-hidden">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}
