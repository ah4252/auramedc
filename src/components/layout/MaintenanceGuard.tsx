"use client";

import { usePathname } from "next/navigation";
import MaintenanceScreen from "./MaintenanceScreen";

export default function MaintenanceGuard({ 
  children, 
  maintenanceMode 
}: { 
  children: React.ReactNode, 
  maintenanceMode: boolean 
}) {
  const pathname = usePathname();
  
  // Never block admin routes
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  // If maintenance is on, show the screen for all other routes
  if (maintenanceMode) {
    return <MaintenanceScreen />;
  }

  return <>{children}</>;
}
