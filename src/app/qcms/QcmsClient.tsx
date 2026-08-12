"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Layers3, 
  NotebookPen, 
  Sparkles, 
  Stethoscope, 
  GraduationCap, 
  BrainCircuit, 
  ChevronRight, 
  FileCheck2, 
  Activity,
  ShieldCheck,
  Zap,
  BookOpen,
  Award,
  FileText
} from "lucide-react";
import { useLocale } from "@/context/LocaleProvider.client";

export default function QcmsClient() {
  const { lang, t } = useLocale();
  const isRtl = lang === "ar";

  const stats = [
    { label: isRtl ? "المواد والتخصصات" : "Subjects", val: "+20", icon: BookOpen, color: "from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30" },
    { label: isRtl ? "نماذج الامتحانات" : "Exams Available", val: "+500", icon: FileText, color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30" },
    { label: isRtl ? "دقة المناهج" : "Accuracy Rate", val: "100%", icon: ShieldCheck, color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30" },
    { label: isRtl ? "نمط التقييم" : "Assessment Mode", val: isRtl ? "فوري وتفاعلي" : "Instant", icon: Zap, color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30" },
  ];

  const features = [
    { 
      icon: NotebookPen, 
      tag: t("qcms_qc_tag", "أسئلة تدريبية"), 
      title: t("qcms_feature_questions_title", "بنك أسئلة شمولـي"),
      desc: t("qcms_feature_questions", "نماذج وأسئلة امتحانات سابقة مُعدّة لتقييم الفهم واستحضار المعلومات الطبية بفعالية عالية.") 
    },
    { 
      icon: Layers3, 
      tag: t("qcms_feature_sections", "أقسام منظمة"), 
      title: t("qcms_feature_sections_title", "تصنيف أكاديمي حسب السنوات"),
      desc: t("qcms_feature_sections_desc", "تقسيم دقيق حسب المراحل الدراسية والمواد والتخصصات لسهولة الوصول السريع.") 
    },
    { 
      icon: CheckCircle2, 
      tag: t("qcms_finstant_tag", "تقييم فوري"), 
      title: t("qcms_feature_assessment_title", "محاكاة للامتحانات الجامعة"),
      desc: t("qcms_feature_assessment", "بيئة اختبار احترافية تساعد على قياس الأداء ومعرفة مستوى التحصيل قبل الامتحانات الرسمية.") 
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#060c17] text-white transition-colors duration-300 overflow-hidden font-sans" dir={isRtl ? "rtl" : "ltr"}>
      {/* Background Ambient Glow Effects */}
      <div className="pointer-events-none absolute -top-48 right-0 w-[650px] h-[650px] bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-transparent rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-600/15 via-emerald-600/10 to-transparent rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between gap-4 border-b border-slate-800/80 pb-5"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Link href="/courses" className="hover:text-white transition-colors">{isRtl ? "الرئيسية" : "Home"}</Link>
            <ChevronRight className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
            <span className="text-violet-400 font-black">{isRtl ? "مركز QCMs الطبي" : "QCM Medical Center"}</span>
          </div>

          <Link
            href="/courses?tab=qcms"
            className="group inline-flex items-center gap-2.5 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-xs font-black text-violet-200 shadow-lg shadow-violet-500/10 backdrop-blur-md transition-all hover:border-violet-400 hover:bg-violet-500/20 hover:scale-[1.02]"
          >
            <span>{isRtl ? "دخول بنك الامتحانات والمواضيع" : "Enter Exam Hub"}</span>
            {isRtl ? <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> : <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </Link>
        </motion.div>

        {/* HERO SECTION: MASSIVE MEDICAL EXAM CENTER BANNER */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[3rem] border border-violet-500/20 bg-gradient-to-b from-[#0b172a]/95 via-[#0e1d35]/90 to-[#081222]/95 p-8 sm:p-12 lg:p-16 shadow-[0_0_80px_-20px_rgba(139,92,246,0.35)] backdrop-blur-2xl"
        >
          {/* Subtle Grid Accent */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

          <div className="relative z-10 grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Right Column (RTL) / Left Column (LTR) */}
            <div className="lg:col-span-7">
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-violet-400/30 bg-gradient-to-r from-violet-500/15 to-cyan-500/15 px-4 py-2 text-xs font-black tracking-wider text-violet-200 shadow-inner">
                <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
                <span>{t("qcms_badge", "منصة التقييم الطبي الأكاديمي | AuraMed Medical QCMs")}</span>
              </div>

              <h1 className="mb-6 text-4xl font-black tracking-tight leading-[1.15] text-white sm:text-5xl lg:text-6xl">
                {t("qcms_title", "مركـز اختـبارات")} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400">
                  QCMs الطبي الشامل
                </span>
              </h1>

              <p className="mb-8 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg font-medium">
                {t("qcms_description", "بيئة أكاديمية متخصصة لطلاب الطب والصيدلة، تقدم بنك أسئلة ونماذج امتحانات منظمة بدقة متناهية لمساعدتك على مراجعة وتثبيت المعلومات قبل الامتحانات الرسمية.")}
              </p>

              {/* Tags & Highlights Strip */}
              <div className="mb-10 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-2xl border border-violet-400/25 bg-violet-500/10 px-4 py-2.5 text-xs font-bold text-violet-200">
                  <BrainCircuit className="h-4 w-4 text-violet-400" />
                  {t("qcms_multi_questions_tag", "أسئلة تفاعلية ومباشرة")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-500/10 px-4 py-2.5 text-xs font-bold text-cyan-200">
                  <Stethoscope className="h-4 w-4 text-cyan-400" />
                  {t("qcms_finstant_tag", "تغطية المناهج الجامعية")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-200">
                  <FileCheck2 className="h-4 w-4 text-emerald-400" />
                  {t("qcms_content_tag", "محتوى موثوق ومحين")}
                </span>
              </div>

              {/* Main Action Button */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/courses?tab=qcms"
                  className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 px-9 py-4.5 text-base font-black text-white shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(139,92,246,0.7)] active:scale-[0.98]"
                >
                  <GraduationCap className="h-6 w-6" />
                  <span>{isRtl ? "تصفح امتحانات السنوات الدراسية" : "Explore Exams by Year"}</span>
                  <ChevronRight className={`h-5 w-5 transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
                </Link>

                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 px-7 py-4 text-sm font-bold text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>{isRtl ? "مركز المواد والدروس" : "Courses Portal"}</span>
                </Link>
              </div>
            </div>

            {/* Left Interactive 3D SaaS Card (RTL) */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-violet-500/30 bg-gradient-to-b from-[#0f2038] to-[#0a1526] p-8 shadow-2xl">
                
                {/* Header Badge */}
                <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white">مركز QCMs المعتمد</h4>
                      <p className="text-[11px] font-bold text-slate-400">Medical Exam Hub</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-[10px] font-black tracking-widest text-emerald-300">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    ACTIVE
                  </span>
                </div>

                {/* Simulated Exam Meter */}
                <div className="mb-6 rounded-2xl border border-slate-800 bg-[#091322] p-5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                    <span>جاهزية بنك الأسئلة</span>
                    <span className="text-cyan-400 font-black">100%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-400 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3.5 text-xs">
                    <span className="text-slate-400 font-bold">{isRtl ? "نظام الأسئلة" : "Format"}</span>
                    <span className="font-black text-violet-300">QCM / QCS / QROC</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3.5 text-xs">
                    <span className="text-slate-400 font-bold">{isRtl ? "التنظيم الأكاديمي" : "Organization"}</span>
                    <span className="font-black text-cyan-300">سنة ⬅️ مادة ⬅️ امتحانات</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* DASHBOARD STATS METRICS GRID */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className={`relative overflow-hidden rounded-3xl border ${s.color} bg-gradient-to-b from-[#0b172a] to-[#070e1b] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/50`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-black tracking-widest text-slate-500">METRIC</span>
                </div>
                <p className="text-3xl font-black text-white tracking-tight">{s.val}</p>
                <p className="mt-1 text-xs font-bold text-slate-400">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* FEATURE MATRIX CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, tag, title, desc }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="group relative overflow-hidden rounded-[2.2rem] border border-slate-800 bg-gradient-to-b from-[#0c182b] to-[#070f1d] p-8 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/10"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-violet-300 shadow-inner group-hover:scale-110 group-hover:from-violet-500 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300">
                <Icon className="h-7 w-7" />
              </div>
              <span className="mb-3 inline-block rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-black text-violet-300">
                {tag}
              </span>
              <h2 className="mb-3 text-xl font-black text-white group-hover:text-violet-200 transition-colors">{title}</h2>
              <p className="text-sm leading-7 text-slate-400 font-medium">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM CTA BANNER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-14 rounded-[2.5rem] border border-violet-500/30 bg-gradient-to-r from-violet-900/40 via-purple-900/30 to-cyan-900/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-black text-white mb-4">
              {isRtl ? "جاهز لبدء الاختـبار؟" : "Ready to Start Testing?"}
            </h3>
            <p className="text-sm sm:text-base text-slate-300 font-medium mb-8">
              {isRtl ? "اختر سنتك الدراسية والمادة وابدأ في حل نماذج الـ QCMs مباشرة مع أفضل بنك أسئلة طبي." : "Choose your year and subject to access interactive QCM exams immediately."}
            </p>
            <Link
              href="/courses?tab=qcms"
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 px-9 py-4 text-base font-black text-white shadow-xl shadow-violet-600/40 transition-all hover:scale-105"
            >
              <GraduationCap className="h-5 w-5" />
              <span>{isRtl ? "الانتقال لقسم QCMs الآن" : "Go to QCMs Center Now"}</span>
              <ChevronRight className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}


