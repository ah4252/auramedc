"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Trash2, User, Clock, ExternalLink, ShieldAlert, ArrowRight } from "lucide-react";
import { deleteDiscussion } from "@/app/actions/community";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export default function CommunityAdminClient({ initialDiscussions, categoryName, userId }: { initialDiscussions: any[], categoryName?: string, userId?: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!userId) return;
    if (confirm("هل أنت متأكد من حذف هذا المنشور وجميع تعليقاته نهائياً؟")) {
      setLoading(id);
      const res = await deleteDiscussion(id, userId);
      if (res.success) {
        router.refresh();
      }
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-medical-100 dark:bg-medical-900/30 text-medical-600 rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
               {categoryName && (
                 <Link href="/admin/community" className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                 </Link>
               )}
               <h1 className="text-2xl font-bold">إدارة المجتمع {categoryName ? `- ${categoryName}` : ""}</h1>
            </div>
            <p className="text-slate-500 text-sm font-medium">مراقبة وحذف المنشورات المخالفة {categoryName ? `لطلاب ${categoryName}` : ""}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-6 text-sm font-black text-slate-500 uppercase tracking-wider">المنشور</th>
                <th className="p-6 text-sm font-black text-slate-500 uppercase tracking-wider">الكاتب</th>
                <th className="p-6 text-sm font-black text-slate-500 uppercase tracking-wider">التاريخ</th>
                <th className="p-6 text-sm font-black text-slate-500 uppercase tracking-wider">التعليقات</th>
                <th className="p-6 text-sm font-black text-slate-500 uppercase tracking-wider text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {initialDiscussions.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                  <td className="p-6">
                    <div className="max-w-md">
                       <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{d.title}</h4>
                       {d.subject && (
                         <span className="text-[10px] text-medical-600 font-bold bg-medical-50 dark:bg-medical-900/30 px-2 py-0.5 rounded-full mt-1 inline-block">
                           {d.subject.name}
                         </span>
                       )}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                          {d.user?.image ? <img src={d.user.image} alt={d.user.name || "مستخدم"} className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-slate-400" />}
                       </div>
                       <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{d.user?.name || "مستخدم"}</span>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-slate-500 font-medium">
                    {formatDistanceToNow(new Date(d.createdAt), { addSuffix: true, locale: ar })}
                  </td>
                  <td className="p-6 text-center">
                     <span className="font-black text-slate-900 dark:text-white">{d._count?.comments || 0}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        href={`/community/d/${d.id}`}
                        target="_blank"
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="عرض المنشور"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(d.id)}
                        disabled={loading === d.id}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        title="حذف نهائي"
                      >
                        {loading === d.id ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-5 h-5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {initialDiscussions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-400 font-bold">
                     لا توجد منشورات في المجتمع حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-3xl border border-amber-100 dark:border-amber-900/30 flex items-start gap-4">
         <ShieldAlert className="w-6 h-6 text-amber-600 mt-1" />
         <div>
            <h4 className="font-bold text-amber-900 dark:text-amber-400">تنبيه الإدارة</h4>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1 font-medium">
               حذف أي منشور سيؤدي إلى حذف جميع التعليقات المرتبطة به نهائياً من قاعدة البيانات. يرجى الحذر عند استخدام هذه الصلاحية.
            </p>
         </div>
      </div>
    </div>
  );
}
