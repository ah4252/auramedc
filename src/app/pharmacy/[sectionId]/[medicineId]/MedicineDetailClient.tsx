"use client";

import { useState } from "react";
import { X, Expand } from "lucide-react";

type LessonData = {
  id: string;
  title: string;
  description: string | null;
  indications: string | null;
  sideEffects: string | null;
  ageLimit: string | null;
  pdfUrl: string | null;
  thumbnail: string | null;
  views: number;
  isPublished: boolean;
  subject: {
    id: string;
    name: string;
  };
  resources: Array<{
    id: string;
    title: string;
    url: string;
  }>;
};

export default function MedicineDetailClient({ lesson, sectionId }: { lesson: LessonData; sectionId: string }) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const imageUrl = lesson.thumbnail || lesson.pdfUrl || lesson.resources[0]?.url || "";

  const infoCards = [
    {
      title: "دواعي الاستعمال",
      value: lesson.indications || "لا توجد دواعي استعمال مضافة لهذا الدواء بعد.",
      color: "emerald",
    },
    {
      title: "الأثار الجانبية",
      value: lesson.sideEffects || "لا توجد آثار جانبية مضافة لهذا الدواء بعد.",
      color: "rose",
    },
    {
      title: "السن المحدد",
      value: lesson.ageLimit || "غير محدد",
      color: "amber",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[var(--dark-bg)] text-slate-800 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <a
            href={`/pharmacy/${sectionId}`}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-emerald-300"
          >
            ← العودة إلى القسم
          </a>

          <div className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            {lesson.subject.name}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={lesson.title}
                  className="h-full w-full object-contain p-6"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl text-emerald-500">💊</div>
              )}
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">
                    Product detail
                  </p>
                  {imageUrl ? (
                    <button
                      type="button"
                      onClick={() => setIsViewerOpen(true)}
                      className="text-right text-3xl font-black leading-tight text-slate-900 transition hover:text-emerald-600 dark:text-white dark:hover:text-emerald-400 sm:text-4xl"
                    >
                      {lesson.title}
                    </button>
                  ) : (
                    <h1 className="text-3xl font-black leading-tight sm:text-4xl">{lesson.title}</h1>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                {lesson.description || "لا يوجد وصف مضاف لهذا الدواء بعد، سيتم إضافة التفاصيل قريبًا."}
              </div>

              {lesson.pdfUrl && (
                <a
                  href={lesson.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:scale-[1.01]"
                >
                  عرض الملف / التحميل
                </a>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="grid gap-4">
              {infoCards.map((card) => {
                const palette = {
                  emerald: {
                    panel: "border-emerald-200/80 bg-emerald-500/10 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100",
                    badge: "bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
                    glow: "shadow-emerald-500/10",
                  },
                  rose: {
                    panel: "border-rose-200/80 bg-rose-500/10 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100",
                    badge: "bg-rose-500/20 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",
                    glow: "shadow-rose-500/10",
                  },
                  amber: {
                    panel: "border-amber-200/80 bg-amber-500/10 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100",
                    badge: "bg-amber-500/20 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
                    glow: "shadow-amber-500/10",
                  },
                }[card.color as "emerald" | "rose" | "amber"];

                return (
                  <div
                    key={card.title}
                    className={`rounded-[1.6rem] border backdrop-blur-xl shadow-lg ${palette.panel} ${palette.glow}`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-white/20 px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${palette.badge}`}>
                        {card.title}
                      </span>
                    </div>
                    <div className="px-4 py-4 text-sm font-medium leading-7">
                      {card.value}
                    </div>
                  </div>
                );
              })}
            </div>

          </aside>
        </div>
      </div>

      {isViewerOpen && imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          onClick={() => setIsViewerOpen(false)}
        >
          <div
            className="relative mx-auto w-full max-w-4xl rounded-[2rem] border border-white/10 bg-slate-900/90 p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="إغلاق الصورة"
              onClick={() => setIsViewerOpen(false)}
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-800/80 text-white shadow-lg transition hover:bg-rose-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex max-h-[85vh] items-center justify-center overflow-hidden rounded-[1.5rem] bg-slate-950">
              <img
                src={imageUrl}
                alt={lesson.title}
                className="max-h-[85vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
