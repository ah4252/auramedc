import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Video } from "lucide-react";
import { cookies } from "next/headers";
import AdminLogin from "./AdminLogin";
import LogoutButton from "./LogoutButton";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAdmin = !!cookieStore.get("admin_token");

  if (!isAdmin) {
    return <AdminLogin />;
  }
  
  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-100 dark:bg-dark-bg text-slate-900 dark:text-white overflow-hidden">
      {/* Admin Sidebar & Header */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
