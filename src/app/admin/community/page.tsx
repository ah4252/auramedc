import { getCategories } from "@/app/actions/content";
import Link from "next/link";
import { MessageSquare, GraduationCap, ChevronLeft, LayoutGrid, Lock } from "lucide-react";
import PasswordManager from "./PasswordManager";

export const dynamic = "force-dynamic";

export default async function CommunityAdminPortal() {
  const categories = await getCategories("YEAR");

  return (
    <div className="space-y-8 animate-fade-in p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-medical-600" />
            إدارة المجتمع
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">اختر السنة الدراسية لإدارة النقاشات أو تعديل الخصوصية</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-medical-50 dark:bg-medical-900/20 text-medical-600 dark:text-medical-400 rounded-xl text-xs font-black uppercase border border-medical-100 dark:border-medical-500/20">
              {categories.length} سنوات متاحة
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            className="group relative bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-medical-500 hover:shadow-xl hover:shadow-medical-600/10 transition-all duration-300"
          >
            {/* Subtle Gradient Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-medical-500/5 blur-3xl group-hover:bg-medical-500/10 transition-colors" />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <Link href={`/admin/community/y/${cat.slug}`} className="w-14 h-14 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-medical-600 group-hover:text-white transition-all duration-500 shadow-inner">
                <GraduationCap className="w-7 h-7" />
              </Link>
              <div className="flex items-center gap-2">
                {cat.communityPassword && (
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20" title="محمي بكلمة مرور">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                <PasswordManager category={{ id: cat.id, name: cat.name, communityPassword: cat.communityPassword }} />
              </div>
            </div>

            <Link href={`/admin/community/y/${cat.slug}`} className="block relative z-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-medical-600 transition-colors">
                {cat.name}
              </h3>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed italic">
                {cat.description || `إدارة جميع النقاشات والتعليقات الخاصة بطلاب ${cat.name}.`}
              </p>

              <div className="mt-8 flex items-center gap-2 text-xs font-black text-medical-600 dark:text-medical-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                <span>دخول الإدارة</span>
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </div>
            </Link>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
           <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4 opacity-20" />
           <h3 className="text-xl font-bold text-slate-500 italic">لا توجد سنوات دراسية مضافة حالياً.</h3>
           <Link href="/admin/subjects" className="text-medical-600 font-black mt-4 inline-block hover:underline">أضف سنة دراسية جديدة</Link>
        </div>
      )}
    </div>
  );
}
