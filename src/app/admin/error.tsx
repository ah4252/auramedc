"use client";

import { useEffect } from "react";
import { ShieldAlert, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Error Boundary للوحة تحكم الأدمن /admin
 * يُعرض فقط بعد تجاوز AuthGuard، أي للمشاكل التقنية
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Panel Error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-10 min-h-[60vh]">
      <div className="max-w-md w-full bg-white dark:bg-dark-card rounded-[3rem] p-10 border border-red-200 dark:border-red-900/30 shadow-xl text-center space-y-6">

        {/* Icon */}
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            خطأ في لوحة التحكم
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            حدث خطأ تقني في هذا القسم. جميع البيانات محفوظة وآمنة.
          </p>
        </div>

        {error.digest && (
          <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl px-4 py-2 text-xs font-mono text-red-400 border border-red-200 dark:border-red-900/30">
            خطأ رقم: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 bg-medical-600 hover:bg-medical-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-medical-600/20 hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </button>
          <Link
            href="/admin"
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4" />
            لوحة التحكم
          </Link>
        </div>
      </div>
    </div>
  );
}
