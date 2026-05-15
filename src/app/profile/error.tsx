"use client";

import { useEffect } from "react";
import { UserX, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Error Boundary لصفحة الملف الشخصي /profile
 */
export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Profile Error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-20 max-w-md">
      <div className="bg-white dark:bg-dark-card rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">

        {/* Icon */}
        <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-3xl flex items-center justify-center mx-auto">
          <UserX className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            خطأ في تحميل الملف الشخصي
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            تعذّر تحميل بيانات حسابك. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-medical-600 hover:bg-medical-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-medical-600/20 hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4" />
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
