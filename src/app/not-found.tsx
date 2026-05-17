import { Stethoscope, Home, Search } from "lucide-react";
import Link from "next/link";

/**
 * 404 Not Found — يُعرض عند أي مسار غير موجود في المشروع
 * Next.js 15: not-found.tsx في app/ يطبق على جميع الـ routes
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg px-4">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Large 404 */}
        <div className="relative">
          <span className="text-[10rem] font-black text-slate-100 dark:text-slate-800/60 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-medical-50 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 rounded-3xl flex items-center justify-center shadow-xl">
              <Stethoscope className="w-10 h-10" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            الصفحة غير موجودة
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            يبدو أن هذه الصفحة انتقلت إلى مكان آخر أو لم تُنشأ بعد.
            <br />
            تحقق من الرابط أو ابدأ من الصفحة الرئيسية.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-medical-600 hover:bg-medical-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-medical-600/20 hover:scale-105 active:scale-95"
          >
            <Home className="w-5 h-5" />
            الصفحة الرئيسية
          </Link>
          <Link
            href="/courses"
            className="flex items-center justify-center gap-2 bg-white dark:bg-dark-card hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-medical-500 text-slate-700 dark:text-slate-200 font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
          >
            <Search className="w-5 h-5" />
            تصفح الدروس
          </Link>
        </div>
      </div>
    </div>
  );
}
