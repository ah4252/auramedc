"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Layers3, NotebookPen, Sparkles } from "lucide-react";
import { useLocale } from "@/context/LocaleProvider.client";

export default function QcmsClient() {
  const { lang, t } = useLocale();
  const isRtl = lang === "ar";

  const features = [
    { icon: NotebookPen, title: t("qcms_qc_tag", "أسئلة تدريبية"), desc: t("qcms_feature_questions", "مجموعة من الأسئلة المصممة لتقييم الفهم بشكل سريع وفعال.") },
    { icon: Layers3, title: t("qcms_feature_sections", "أقسام منظمة"), desc: t("qcms_feature_sections_desc", "تصنيفات واضحة حسب المقرر أو الموضوع أو السنة الدراسية.") },
    { icon: CheckCircle2, title: t("qcms_finstant_tag", "تقييم فوري"), desc: t("qcms_feature_assessment", "نمط احترافي يساعد على متابعة الأداء وتحديد نقاط القوة والضعف.") },
  ];

  return (
    <div className="relative min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white" dir={isRtl ? "rtl" : "ltr"}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(45,212,191,0.16),transparent_30%)] dark:bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.20),transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(45,212,191,0.18),transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/courses?tab=qcms"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 dark:border-white/10 dark:bg-white/5 dark:text-emerald-200 dark:hover:bg-emerald-500/10"
          >
            <ArrowLeft className="h-4 w-4" />
            {isRtl ? "العودة إلى الأقسام" : "Back to sections"}
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-violet-700 dark:border-white/10 dark:bg-white/5 dark:text-emerald-200">
            <Sparkles className="h-3.5 w-3.5" />
            QCMs
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 shadow-[0_30px_80px_-35px_rgba(109,40,217,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-emerald-500/10"
        >
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 sm:p-8 lg:p-12">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-violet-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                {t("qcms_badge", "Smart assessments")}
              </div>
              <h1 className="mb-4 text-4xl font-black leading-tight text-slate-900 dark:text-white sm:text-5xl">
                {t("qcms_title", "QCMs section")}
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                {t("qcms_description", "A specialized training platform for short tests, designed to strengthen understanding and track the student's level professionally.")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-200">
                  {t("qcms_multi_questions_tag", "أسئلة متعددة")}
                </div>
                <div className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-700 dark:border-cyan-400/40 dark:bg-cyan-500/10 dark:text-cyan-200">
                  {t("qcms_finstant_tag", "تقييم مستمر")}
                </div>
                <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 dark:border-violet-400/40 dark:bg-violet-500/10 dark:text-violet-200">
                  {t("qcms_content_tag", "محتوى متجدد")}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center border-t border-slate-200 bg-gradient-to-br from-violet-500/10 via-white to-cyan-500/10 p-6 lg:border-l lg:border-t-0 lg:p-10 dark:border-white/10 dark:from-emerald-500/10 dark:to-cyan-500/10">
              <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-inner shadow-violet-500/5 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-emerald-500/10">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Status</span>
                  <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                    LIVE
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{isRtl ? "القسم" : "Section"}</p>
                    <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">QCMs</p>
                  </div>
                  <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/80 p-4 text-sm leading-7 text-slate-700 dark:border-emerald-500/30 dark:bg-emerald-500/5 dark:text-slate-200">
                    {isRtl
                      ? "هذا القسم جاهز لاستقبال الاختبارات والاسئلة، وسيتم تعبئته لاحقاً من لوحة التحكم الخاصة به."
                      : "This section is ready to host quizzes and questions and will be filled later from its control panel."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[1.8rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mb-3 text-xl font-black text-slate-900 dark:text-white">{title}</h2>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
