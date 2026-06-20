import { cookies } from "next/headers";
import AdminLogin from "./AdminLogin";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { getSettings, isToolsUnlocked } from "@/app/actions/settings";
import ToolsGate from "./ToolsGate";
import { verifyAdminToken } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;
  // ✅ التحقق الآمن من التوكن — يرفض أي توكن مزوّر أو منتهي الصلاحية
  const isAdmin = !!adminToken && verifyAdminToken(adminToken);

  if (!isAdmin) {
    return <AdminLogin />;
  }
  
  const settings = await getSettings();
  const toolsUnlocked = await isToolsUnlocked();

  // جلب عدد طلبات استعادة الحساب المعلقة
  const pendingRecoveryCount = await prisma.forgotPasswordRequest.count({
    where: { status: "PENDING" }
  });

  // جلب عدد طلبات الاشتراك المعلقة
  let pendingSubscriptionCount = 0;
  try {
    pendingSubscriptionCount = await (prisma as any).subscriptionRequest.count({
      where: { status: "PENDING" }
    });
  } catch (error) {
    // Ignore error if table doesn't exist yet
  }

  // جلب إجمالي المستخدمين لمعرفة المستخدمين الجدد
  const totalUsersCount = await prisma.user.count();

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-white overflow-hidden font-sans">
      {/* Sidebar Component */}
      <AdminSidebar 
        toolsProtected={settings.toolsProtectionEnabled} 
        toolsUnlocked={toolsUnlocked} 
        pendingRecoveryCount={pendingRecoveryCount}
        pendingSubscriptionCount={pendingSubscriptionCount}
        totalUsersCount={totalUsersCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Functional Top Header */}
        <AdminHeader siteName={settings.siteName} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto">
            <ToolsGate toolsProtected={settings.toolsProtectionEnabled} initialUnlocked={toolsUnlocked}>
              {children}
            </ToolsGate>
          </div>
        </main>
      </div>
    </div>
  );
}
