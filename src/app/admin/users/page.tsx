import { Users, Mail, Clock, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DeleteUserButton from "./DeleteUserButton";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 rounded-xl">
          <Users className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold">إدارة المستخدمين والطلاب</h1>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-medical-600" />
            الطلاب المسجلين
          </h2>
          <span className="bg-medical-100 dark:bg-medical-900/30 text-medical-700 dark:text-medical-400 text-sm font-bold px-3 py-1 rounded-full">
            {users.length} طالب
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/20 text-slate-500 text-sm">
                <th className="p-4 font-medium">الاسم</th>
                <th className="p-4 font-medium">البريد الإلكتروني</th>
                <th className="p-4 font-medium">كلمة المرور</th>
                <th className="p-4 font-medium">رابط الصورة</th>
                <th className="p-4 font-medium">الصلاحية</th>
                <th className="p-4 font-medium">تاريخ التسجيل</th>
                <th className="p-4 font-medium">الاجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                      {user.image ? (
                        <img src={user.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user.name ? user.name.charAt(0).toUpperCase() : "ط"
                      )}
                    </div>
                    {user.name || "مستخدم جديد"}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">
                    {user.password || "********"}
                  </td>
                  <td className="p-4 text-slate-400 dark:text-slate-500 text-xs truncate max-w-[150px]" dir="ltr">
                    {user.image || "لا يوجد"}
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs font-bold">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span dir="ltr">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <DeleteUserButton id={user.id} />
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                    <p className="text-lg">لا يوجد أي طلاب مسجلين في المنصة حتى الآن.</p>
                    <p className="text-sm mt-1">بمجرد قيام أي شخص بإنشاء حساب، سيظهر هنا مباشرة.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
