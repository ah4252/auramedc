import { prisma } from "@/lib/db";
import UsersTable from "./UsersTable";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">إدارة شؤون الطلاب</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">عرض وإدارة جميع الطلاب المسجلين والتحكم في صلاحياتهم.</p>
        </div>
      </div>

      <UsersTable initialUsers={JSON.parse(JSON.stringify(users))} />
    </div>
  );
}
