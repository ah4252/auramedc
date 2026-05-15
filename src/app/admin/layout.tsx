import { cookies } from "next/headers";
import AdminLogin from "./AdminLogin";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { getSettings } from "@/app/actions/settings";

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
  
  const settings = await getSettings();

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-white overflow-hidden font-sans">
      {/* Sidebar Component */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Functional Top Header */}
        <AdminHeader siteName={settings.siteName} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
