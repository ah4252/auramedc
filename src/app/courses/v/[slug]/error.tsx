"use client";

import { useEffect } from "react";
import { VideoOff, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Error Boundary لصفحة مشاهدة الدرس /courses/v/[slug]
 */
export default function LessonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lesson Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white dark:bg-dark-card rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">

        {/* Icon */}
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto">
          <VideoOff className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            تعذّر تحميل الدرس
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            حدث خطأ أثناء تحميل هذا الدرس. قد يكون الدرس غير متاح أو حدثت مشكلة في الاتصال.
          </p>
        </div>

        {error.digest && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-4 py-2 text-xs font-mono text-slate-400 border border-slate-200 dark:border-slate-800">
            {error.digest}
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
            href="/courses"
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-4 rounded-2xl transition-all hover:scale-105 active:scale-95"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للدروس
          </Link>
        </div>
      </div>
    </div>
  );
}
