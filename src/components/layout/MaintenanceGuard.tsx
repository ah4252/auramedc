"use client";

import { usePathname } from "next/navigation";
import MaintenanceScreen from "./MaintenanceScreen";

export default function MaintenanceGuard({ 
  children, 
  maintenanceMode,
  userEmail
}: { 
  children: React.ReactNode, 
  maintenanceMode: boolean,
  userEmail?: string | null
}) {
  const pathname = usePathname();
  
  // Never block admin routes or specific owner email
  if (pathname?.startsWith("/admin") || userEmail === "abendakfal07@gmail.com") {
    return <>{children}</>;
  }

  // If maintenance is on, show the screen for all other routes
  if (maintenanceMode) {
    return <MaintenanceScreen />;
  }

  return <>{children}</>;
}
