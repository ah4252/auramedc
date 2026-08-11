"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Layers3, NotebookPen, Sparkles } from "lucide-react";

export default function QcmsClient() {
  const features = [
    { icon: NotebookPen, title: "أسئلة تدريبية", desc: "مجموعة من الأسئلة المصممة لتقييم الفهم بشكل سريع وفعال." },
    { icon: Layers3, title: "أقسام منظمة", desc: "تصنيفات واضحة حسب المقرر أو الموضوع أو السنة الدراسية." },
    { icon: CheckCircle2, title: "تقييم فوري", desc: "نمط احترافي يساعد على متابعة الأداء وتحديد نقاط القوة والضعف." },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(45,212,191,0.18),transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/courses?tab=qcms"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-200 transition hover:bg-emerald-500/20"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة إلى الأقسام
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">
            <Sparkles className="h-3.5 w-3.5" />
            QCMs
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl"
        >
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 sm:p-8 lg:p-12">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
                اختبارات ذكية
              </div>
              <h1 className="mb-4 text-4xl font-black leading-tight text-white sm:text-5xl">
                قسم QCMs
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                منصة مخصصة للاختبارات القصيرة والتدريبية، مصممة لتقوية الفهم وتقييم مستوى الطالب بطريقة احترافية وسريعة، مع واجهة متميزة عن بقية الأقسام.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-200">
                  أسئلة متعددة
                </div>
                <div className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-200">
                  تقييم مستمر
                </div>
                <div className="rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-sm font-bold text-violet-200">
                  محتوى متجدد
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center border-t border-white/10 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-6 lg:border-l lg:border-t-0 lg:p-10">
              <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-inner shadow-emerald-500/10">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Status</span>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-200">
                    QUARANTINE
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">القسم</p>
                    <p className="mt-2 text-2xl font-black text-white">QCMs</p>
                  </div>
                  <div className="rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 p-4 text-sm leading-7 text-slate-200">
                    هذا القسم جاهز لاستقبال الاختبارات والاسئلة، وسيتم تعبئته لاحقاً من لوحة التحكم الخاصة به.
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
              className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mb-3 text-xl font-black text-white">{title}</h2>
              <p className="text-sm leading-7 text-slate-300">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
