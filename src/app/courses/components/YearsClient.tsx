"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, Sparkles, ChevronRight, FlaskConical, Search, Pill, Layers, Image as ImageIcon, ArrowLeft, ArrowRight, NotebookPen, Star, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/context/LocaleProvider.client";

import { useSearchParams } from "next/navigation";

type PharmacySection = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  order: number;
  images: { id: string; title: string | null; url: string; description: string | null; order: number }[];
};

export default function YearsClient({ 
  yearCategories, 
  pharmacyCategories,
  qcmsYears = [],
  devFeaturedYears = [],
  canViewPharmacy = false,
}: { 
  yearCategories: any[]; 
  pharmacyCategories: PharmacySection[]; 
  qcmsYears?: any[];
  devFeaturedYears?: any[];
  canViewPharmacy?: boolean;
}) {
  const searchParams = useSearchParams();
  const { t, lang } = useLocale();
  const isRtl = lang === "ar";
  const rawTab = searchParams.get("tab");
  const initialTab = rawTab === "pharmacy" && canViewPharmacy ? "pharmacy" : rawTab === "qcms" ? "qcms" : "years";
  const [activeTab, setActiveTab] = useState<"years" | "pharmacy" | "qcms">(initialTab);
  const [pharmacySearch, setPharmacySearch] = useState("");
  const [selectedQcmsYearId, setSelectedQcmsYearId] = useState<string | null>(null);
  const [selectedQcmsSubjectId, setSelectedQcmsSubjectId] = useState<string | null>(null);

  // Developer mode state
  const [devMode, setDevMode] = useState(false);
  const [selectedDevYearId, setSelectedDevYearId] = useState<string | null>(null);
  const [selectedDevSubjectId, setSelectedDevSubjectId] = useState<string | null>(null);

  const filteredPharmacy = pharmacyCategories.filter(s =>
    s.name.toLowerCase().includes(pharmacySearch.toLowerCase()) ||
    (s.description || "").toLowerCase().includes(pharmacySearch.toLowerCase())
  );

  const selectedQcmsYear = qcmsYears.find((y: any) => y.id === selectedQcmsYearId) || null;
  const selectedQcmsSubject = selectedQcmsYear?.subjects?.find((s: any) => s.id === selectedQcmsSubjectId) || null;

  const selectedDevYear = devFeaturedYears.find((y: any) => y.id === selectedDevYearId) || null;
  const selectedDevSubject = selectedDevYear?.subjects?.find((s: any) => s.id === selectedDevSubjectId) || null;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-16" dir={isRtl ? "rtl" : "ltr"}>
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-medical-500/10 text-medical-600 dark:text-medical-400 text-xs font-black uppercase tracking-widest mb-6"
        >
          <Sparkles className="w-4 h-4" />
          {t("courses_portal_badge", "Elite medical learning portal")}
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black mb-6 text-slate-900 dark:text-white leading-tight"
        >
          {activeTab === "years" ? (
            <>
              {t("courses_years_prompt", "اختر")} <span className="text-transparent bg-clip-text bg-gradient-to-l from-medical-600 to-medical-400">{t("courses_years_highlight", "سنتك الدراسية")}</span>
            </>
          ) : activeTab === "pharmacy" ? (
            <>
              {t("courses_pharmacy_prompt", "دليل")} <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 via-teal-500 to-emerald-400">{t("courses_pharmacy_highlight", "الأقسام الصيدلانية")}</span>
            </>
          ) : (
            <>
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-violet-500 via-fuchsia-500 to-cyan-400">QCMs</span>
            </>
          )}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-500 dark:text-slate-400 font-medium"
        >
          {activeTab === "years" 
            ? t("courses_years_description", "نظمنا لك المحتوى بدقة متناهية لِيتناسب مع متطلبات كل مرحلة في رحلتك الطبية.")
            : activeTab === "pharmacy"
              ? t("courses_pharmacy_description", "الموسوعة الصيدلانية الموحدة — تصفح الأقسام والمستندات والأدوية بكل سهولة.")
              : "قسم اختبارات QCMs مخصص للتدريب السريع والتقييم الذكي بطريقة احترافية ومميزة."}
        </motion.p>
      </div>

      {/* Unified Seamless Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-[1.8rem] w-fit mx-auto mb-12 shadow-inner border border-slate-200/50 dark:border-slate-700/50" dir={isRtl ? "rtl" : "ltr"}>
        <Link 
          href="/courses"
          onClick={() => setActiveTab("years")}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 ${
            activeTab === "years" 
              ? "bg-white dark:bg-dark-card shadow-lg text-medical-600 scale-[1.02]" 
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          {t("courses_years_tab", "السنوات الدراسية")}
        </Link>
        {canViewPharmacy ? (
          <Link 
            href="/courses?tab=pharmacy"
            onClick={() => setActiveTab("pharmacy")}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 ${
              activeTab === "pharmacy" 
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 scale-[1.02]" 
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FlaskConical className="w-5 h-5" />
            {t("courses_pharmacy_tab", "قسم الصيدلة")}
          </Link>
        ) : null}
        <Link
          href="/courses?tab=qcms"
          onClick={() => setActiveTab("qcms")}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 ${
            activeTab === "qcms"
              ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-600/25 scale-[1.02]"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          QCMs
        </Link>
      </div>

      {/* ===== YEARS TAB CONTENT ===== */}
      <AnimatePresence mode="wait">
        {activeTab === "years" && (
          <motion.div
            key="years"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {yearCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" dir="rtl">
                {yearCategories.map((cat, idx) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link 
                      href={`/courses/y/${cat.slug}`}
                      className="group relative flex flex-col h-full bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-medical-600/10 hover:-translate-y-2 transition-all duration-500"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-medical-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-medical-500/10 transition-colors"></div>
                      
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-medical-600 group-hover:text-white transition-all duration-500 shadow-inner">
                        <GraduationCap className="w-8 h-8" />
                      </div>
                      
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-medical-600 transition-colors">
                        {cat.name}
                      </h3>
                      
                      <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 flex-1 leading-relaxed">
                        {cat.description || t("courses_year_default_description", "Explore all subjects and lessons dedicated to students in").replace("{{year}}", cat.name)}
                      </p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/60">
                        <span className="text-sm font-black text-medical-600 dark:text-medical-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                          {t("courses_view_subjects", "View study subjects")}
                          <ChevronRight className="w-4 h-4 rotate-180" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800" dir={isRtl ? "rtl" : "ltr"}>
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-400">{t("courses_no_years_title", "No study years added yet")}</h3>
                <p className="text-slate-500 mt-2">{t("courses_no_years_description", "This section will be activated soon.")}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ===== QCMS TAB CONTENT ===== */}
        {activeTab === "qcms" && (
          <motion.div
            key="qcms"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <div className="mx-auto max-w-7xl overflow-hidden rounded-[3rem] border border-violet-500/25 bg-gradient-to-b from-[#08111e] via-[#0a1628] to-[#060c16] text-white shadow-[0_0_80px_-20px_rgba(139,92,246,0.3)] backdrop-blur-2xl">
              <div className={`grid gap-0 ${selectedQcmsSubject ? "lg:grid-cols-1" : "lg:grid-cols-[1.18fr_0.82fr]"}`}>
                
                {/* Main Content Area */}
                <div className="relative p-6 sm:p-10 lg:p-12 xl:p-14">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.14),transparent_45%)]" />
                  
                  <div className="relative z-10">
                    
                    {/* TOP NAVIGATION BREADCRUMBS BAR */}
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/90 pb-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400">
                        <button
                          onClick={() => {
                            if (devMode) {
                              setDevMode(false);
                              setSelectedDevYearId(null);
                              setSelectedDevSubjectId(null);
                            } else {
                              setSelectedQcmsYearId(null);
                              setSelectedQcmsSubjectId(null);
                            }
                          }}
                          className="flex items-center gap-1.5 hover:text-violet-300 transition-colors"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                          <span>{isRtl ? "مركز QCMs الطبي" : "QCM Center"}</span>
                        </button>

                        {devMode && (
                          <>
                            <ChevronRight className={`h-3.5 w-3.5 text-slate-600 ${isRtl ? "rotate-180" : ""}`} />
                            <button
                              onClick={() => {
                                setSelectedDevYearId(null);
                                setSelectedDevSubjectId(null);
                              }}
                              className="text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-1"
                            >
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>اختبارات أنشأها المطور</span>
                            </button>
                          </>
                        )}

                        {devMode && selectedDevYear && (
                          <>
                            <ChevronRight className={`h-3.5 w-3.5 text-slate-600 ${isRtl ? "rotate-180" : ""}`} />
                            <button
                              onClick={() => setSelectedDevSubjectId(null)}
                              className="text-amber-300 hover:text-white transition-colors"
                            >
                              {selectedDevYear.name}
                            </button>
                          </>
                        )}

                        {devMode && selectedDevSubject && (
                          <>
                            <ChevronRight className={`h-3.5 w-3.5 text-slate-600 ${isRtl ? "rotate-180" : ""}`} />
                            <span className="text-yellow-300 font-black">{selectedDevSubject.name}</span>
                          </>
                        )}

                        {!devMode && selectedQcmsYear && (
                          <>
                            <ChevronRight className={`h-3.5 w-3.5 text-slate-600 ${isRtl ? "rotate-180" : ""}`} />
                            <button
                              onClick={() => setSelectedQcmsSubjectId(null)}
                              className="text-violet-300 hover:text-white transition-colors"
                            >
                              {selectedQcmsYear.name}
                            </button>
                          </>
                        )}

                        {!devMode && selectedQcmsSubject && (
                          <>
                            <ChevronRight className={`h-3.5 w-3.5 text-slate-600 ${isRtl ? "rotate-180" : ""}`} />
                            <span className="text-cyan-300 font-black">{selectedQcmsSubject.name}</span>
                          </>
                        )}
                      </div>

                      {/* Back Navigation Action Button */}
                      {(devMode || selectedQcmsYear || selectedQcmsSubject) && (
                        <button
                          onClick={() => {
                            if (devMode) {
                              if (selectedDevSubject) {
                                setSelectedDevSubjectId(null);
                              } else if (selectedDevYear) {
                                setSelectedDevYearId(null);
                              } else {
                                setDevMode(false);
                              }
                            } else {
                              if (selectedQcmsSubject) {
                                setSelectedQcmsSubjectId(null);
                              } else {
                                setSelectedQcmsYearId(null);
                              }
                            }
                          }}
                          className={`group inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-black shadow-md transition-all ${
                            devMode 
                              ? "border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 hover:border-amber-400" 
                              : "border-slate-700 bg-slate-800/90 text-slate-200 hover:border-violet-400 hover:bg-slate-800"
                          }`}
                        >
                          {isRtl ? (
                            <ArrowRight className={`h-3.5 w-3.5 ${devMode ? "text-amber-400" : "text-violet-400"} transition-transform group-hover:translate-x-1`} />
                          ) : (
                            <ArrowLeft className={`h-3.5 w-3.5 ${devMode ? "text-amber-400" : "text-violet-400"} transition-transform group-hover:-translate-x-1`} />
                          )}
                          <span>
                            {devMode
                              ? (selectedDevSubject ? (isRtl ? "العودة لمواد السنة" : "Back to Subjects") : selectedDevYear ? (isRtl ? "العودة للسنوات" : "Back to Years") : (isRtl ? "العودة للمركز" : "Back to Hub"))
                              : (selectedQcmsSubject ? (isRtl ? "العودة لمواد السنة" : "Back to Subjects") : (isRtl ? "العودة للسنوات الدراسية" : "Back to Years"))}
                          </span>
                        </button>
                      )}
                    </div>

                    {/* HERO OVERVIEW (Displayed when no year/subject selected and NOT in devMode) */}
                    {!devMode && !selectedQcmsYear && !selectedQcmsSubject && (
                      <div className="mb-10 max-w-2xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-violet-200 shadow-inner">
                          <NotebookPen className="h-4 w-4 text-violet-400" />
                          <span>{t("qcms_badge", "Smart Medical Assessment Hub")}</span>
                        </div>

                        <h2 className="mb-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl tracking-tight">
                          {t("qcms_select_title", "اختر مرحلتك الأكاديمية")}
                        </h2>
                        
                        <p className="text-base leading-8 text-slate-300 font-medium">
                          {t("qcms_description", "تصفح بنك أسئلة ونماذج امتحانات الـ QCMs المنظمة حسب المنهج الدراسي والسنة الجامعية بنظام أكاديمي حديث.")}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2.5">
                          <span className="inline-flex items-center gap-1.5 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-200">
                            {t("qcms_qc_tag", "أسئلة سابقة ونماذج موثقة")}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-200">
                            {t("qcms_finstant_tag", "تصفح حسب المادة")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* HERO OVERVIEW FOR DEVELOPER MODE */}
                    {devMode && !selectedDevYear && !selectedDevSubject && (
                      <div className="mb-10 max-w-2xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/15 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-amber-300 shadow-inner">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span>AuraMed Developer Exclusive Hub</span>
                        </div>

                        <h2 className="mb-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">
                          اختبارات أنشأها المطور
                        </h2>
                        
                        <p className="text-base leading-8 text-amber-100/80 font-medium">
                          مجموعة حصرية من الاختبارات ونماذج التقييم الطبي المُعدة خصيصاً من قِبل مطوري المنصة لتقديم محتوى نوعي ومميز.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2.5">
                          <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300">
                            <Crown className="w-4 h-4 text-amber-400" />
                            محتوى خاص ومعتمد
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-xl border border-yellow-400/30 bg-yellow-500/10 px-4 py-2 text-xs font-bold text-yellow-300">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            تغطية مخصصة للسنوات
                          </span>
                        </div>
                      </div>
                    )}

                    {/* ========================================================================= */}
                    {/* DEV MODE LEVEL 3: EXAM DASHBOARD VIEW (Selected Dev Subject)              */}
                    {/* ========================================================================= */}
                    {devMode && selectedDevSubject ? (
                      <div className="rounded-[2.5rem] border border-amber-500/30 bg-[#140e02]/95 p-6 sm:p-10 shadow-2xl shadow-amber-950/30">
                        {/* Subject Header Banner */}
                        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between border-b border-amber-500/20 pb-6">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
                              <span>{selectedDevYear?.name}</span>
                              <ChevronRight className={`h-3 w-3 ${isRtl ? "rotate-180" : ""}`} />
                              <span>اختبارات المطور</span>
                            </div>
                            <h3 className="text-3xl font-black text-amber-100 sm:text-4xl">{selectedDevSubject.name}</h3>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="rounded-2xl border border-amber-400/30 bg-amber-500/15 px-4 py-2 text-xs font-black text-amber-200">
                              {selectedDevSubject.code || "DEV-QCM"}
                            </span>
                            <span className="rounded-2xl border border-yellow-400/30 bg-yellow-500/15 px-4 py-2 text-xs font-black text-yellow-300 flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 fill-yellow-400" />
                              {(selectedDevSubject.examLinks || []).length} {isRtl ? "اختبار مطور" : "Dev Exams"}
                            </span>
                          </div>
                        </div>

                        {/* Exam Cards Grid */}
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xl font-black text-amber-200 flex items-center gap-2.5">
                              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                              <span>{isRtl ? "نماذج الاختبارات المخصصة للمادة" : "Available Developer Exams"}</span>
                            </h4>
                          </div>

                          {(selectedDevSubject.examLinks || []).length > 0 ? (
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                              {(selectedDevSubject.examLinks || []).map((link: any, idx: number) => (
                                <div
                                  key={link.id}
                                  className="group relative flex flex-col justify-between rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#211603] to-[#120c01] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/60 hover:shadow-2xl hover:shadow-amber-500/20"
                                >
                                  <div>
                                    <div className="mb-4 flex items-center justify-between">
                                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/30 to-yellow-500/20 text-amber-300 group-hover:scale-110 transition-all border border-amber-500/30">
                                        <Star className="h-5.5 w-5.5 fill-amber-400 text-amber-400" />
                                      </div>
                                      <span className="rounded-xl border border-amber-500/30 bg-amber-950/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-300">
                                        DEV #{idx + 1}
                                      </span>
                                    </div>

                                    <h5 className="my-3 text-lg font-black leading-snug text-amber-100 group-hover:text-yellow-200 transition-colors">
                                      {link.label}
                                    </h5>
                                  </div>

                                  <div className="mt-6 pt-4 border-t border-amber-500/20">
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 py-3.5 px-4 text-xs font-black text-slate-950 shadow-lg shadow-amber-600/30 transition-all hover:scale-[1.02] hover:shadow-amber-500/50 active:scale-[0.98]"
                                    >
                                      <span>{isRtl ? "بدء اختبار المطور الآن" : "Start Dev Exam"}</span>
                                      <ChevronRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-3xl border border-dashed border-amber-500/30 bg-amber-950/30 p-12 text-center">
                              <Star className="h-14 w-14 text-amber-600 mx-auto mb-4" />
                              <h5 className="text-lg font-black text-amber-200">
                                لا توجد اختبارات منشأة من المطور لهذه المادة حالياً
                              </h5>
                              <p className="text-xs text-amber-400/60 mt-2 font-medium">
                                سيتم إدراج النماذج الحصرية تباعاً فور نشرها من لوحة التحكم.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                    ) : devMode && selectedDevYear ? (
                      /* ========================================================================= */
                      /* DEV MODE LEVEL 2: SUBJECT EXPLORER VIEW (Selected Dev Year)               */
                      /* ========================================================================= */
                      <div className="mt-4">
                        <div className="mb-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-[#201402] via-[#2c1b03] to-[#180f01] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-xl">
                          <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                              <Crown className="h-4 w-4" />
                              <span>اختبارات المطور — {selectedDevYear.name}</span>
                            </div>
                            <h3 className="text-3xl font-black text-amber-100 sm:text-4xl">{selectedDevYear.name}</h3>
                            <p className="mt-1 text-xs font-bold text-amber-200/70">
                              اختر المادة التعليمية لحل اختباراتها المنشأة خصيصاً من المطور.
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="rounded-2xl border border-amber-500/40 bg-amber-950/80 px-5 py-3 text-center">
                              <p className="text-2xl font-black text-amber-300">{selectedDevYear.subjects?.length || 0}</p>
                              <p className="text-[10px] font-bold text-amber-400/80">مواد باختبارات مميزة</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-black text-amber-200 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-amber-400" />
                            <span>المواد الدراسية المتوفرة</span>
                          </h4>

                          {selectedDevYear.subjects?.length ? (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                              {selectedDevYear.subjects.map((subject: any) => (
                                <button
                                  key={subject.id}
                                  onClick={() => setSelectedDevSubjectId(subject.id)}
                                  className="group relative flex flex-col justify-between rounded-3xl border border-amber-500/30 bg-[#160f02] p-6 text-start shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400 hover:bg-[#201503] hover:shadow-2xl hover:shadow-amber-500/20"
                                >
                                  <div>
                                    <div className="mb-5 flex items-center justify-between">
                                      <span className="rounded-xl border border-amber-400/30 bg-amber-500/15 px-3 py-1 text-[11px] font-black text-amber-300">
                                        {subject.code || "DEV"}
                                      </span>
                                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                                        <Star className="h-5 w-5 fill-current" />
                                      </div>
                                    </div>

                                    <h4 className="text-xl font-black text-amber-100 group-hover:text-yellow-200 transition-colors leading-tight">
                                      {subject.name}
                                    </h4>
                                  </div>

                                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-amber-500/20">
                                    <span className="text-xs font-bold text-amber-300/80">
                                      {(subject.examLinks || []).length} اختبار مطور
                                    </span>
                                    <span className="text-xs font-black text-amber-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                                      <span>فتح الاختبارات</span>
                                      <ChevronRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-3xl border border-dashed border-amber-500/30 bg-amber-950/30 p-12 text-center text-amber-400/70">
                              <BookOpen className="h-14 w-14 text-amber-600 mx-auto mb-3" />
                              <p className="text-base font-bold">لم تتوفر مواد باختبارات مطور بعد لهذه السنة.</p>
                            </div>
                          )}
                        </div>
                      </div>

                    ) : devMode ? (
                      /* ========================================================================= */
                      /* DEV MODE LEVEL 1: ACADEMIC YEARS GRID VIEW                                */
                      /* ========================================================================= */
                      <div className="mt-4">
                        <div className="mb-6 flex items-center justify-between">
                          <h3 className="text-xl font-black text-amber-200 flex items-center gap-2.5">
                            <Crown className="h-5.5 w-5.5 text-amber-400" />
                            <span>السنوات الدراسية التي تتوفر بها اختبارات المطور</span>
                          </h3>
                          <span className="text-xs font-bold text-amber-400/80">
                            {(devFeaturedYears || []).length} سنوات متاحة
                          </span>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                          {(devFeaturedYears || []).map((year: any, idx: number) => {
                            const totalDevExams = (year.subjects || []).reduce((acc: number, s: any) => acc + (s.examLinks || []).length, 0);
                            return (
                              <button
                                key={year.id}
                                onClick={() => {
                                  setSelectedDevYearId(year.id);
                                  setSelectedDevSubjectId(null);
                                }}
                                className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[2.2rem] border border-amber-500/40 bg-gradient-to-br from-[#1a1202] via-[#241804] to-[#120c01] p-7 text-start shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/30"
                              >
                                <div className="relative z-10 flex items-center justify-between gap-3">
                                  <span className="rounded-xl border border-amber-500/30 bg-amber-500/15 px-3.5 py-1.5 text-xs font-black text-amber-300 flex items-center gap-1.5">
                                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                                    {totalDevExams} اختبار مطور
                                  </span>
                                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/30 to-yellow-500/20 text-amber-300 border border-amber-500/30 shadow-inner group-hover:scale-110 transition-all">
                                    <Crown className="h-6 w-6" />
                                  </div>
                                </div>

                                <div className="relative z-10 mt-6">
                                  <h4 className="text-2xl font-black leading-tight text-amber-100 group-hover:text-yellow-200 transition-colors">
                                    {year.name}
                                  </h4>
                                  <p className="mt-2 text-xs font-bold text-amber-400/70">
                                    {year.subjects?.length || 0} مواد تحتوي اختبارات حصرية
                                  </p>
                                </div>

                                <div className="relative z-10 mt-6 flex items-center justify-between pt-4 border-t border-amber-500/20">
                                  <span className="text-xs font-black text-amber-400 group-hover:text-yellow-300 transition-colors">
                                    استعراض المواد والاختبارات
                                  </span>
                                  <ChevronRight className={`h-4 w-4 text-amber-400 transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1.5" : "group-hover:translate-x-1.5"}`} />
                                </div>
                              </button>
                            );
                          })}

                          {(!devFeaturedYears || devFeaturedYears.length === 0) && (
                            <div className="rounded-3xl border border-dashed border-amber-500/30 bg-amber-950/20 p-12 text-center text-amber-400 md:col-span-2">
                              <Star className="h-14 w-14 text-amber-600 mx-auto mb-3" />
                              <p className="text-base font-bold">لم يتم تمييز أي اختبارات منشأة من المطور بعد.</p>
                              <p className="text-xs text-amber-400/60 mt-2">
                                يمكنك تمييز الاختبارات بوضع النجمة ⭐ عليها في لوحة التحكم لتظهر هنا فوراً.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                    ) : selectedQcmsSubject ? (
                      <div className="rounded-[2.5rem] border border-violet-500/25 bg-[#0b172a]/95 p-6 sm:p-10 shadow-2xl">
                        
                        {/* Subject Header Banner */}
                        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/90 pb-6">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs font-bold text-violet-400 mb-2">
                              <span>{selectedQcmsYear?.name}</span>
                              <ChevronRight className={`h-3 w-3 ${isRtl ? "rotate-180" : ""}`} />
                              <span>{isRtl ? "بنك امتحانات المادة" : "Exams Bank"}</span>
                            </div>
                            <h3 className="text-3xl font-black text-white sm:text-4xl">{selectedQcmsSubject.name}</h3>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="rounded-2xl border border-violet-400/30 bg-violet-500/15 px-4 py-2 text-xs font-black text-violet-200">
                              {selectedQcmsSubject.code || "QCM"}
                            </span>
                            <span className="rounded-2xl border border-cyan-400/30 bg-cyan-500/15 px-4 py-2 text-xs font-black text-cyan-200">
                              {(selectedQcmsSubject.examLinks || []).length} {isRtl ? "امتحان متاح" : "Exams"}
                            </span>
                          </div>
                        </div>

                        {/* Exam Cards Grid */}
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xl font-black text-white flex items-center gap-2.5">
                              <NotebookPen className="h-5 w-5 text-violet-400" />
                              <span>{isRtl ? "قائمة نماذج الامتحانات المتاحة" : "Available Exam Papers"}</span>
                            </h4>
                          </div>

                          {(selectedQcmsSubject.examLinks || []).length > 0 ? (
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                              {(selectedQcmsSubject.examLinks || []).map((link: any, idx: number) => (
                                <div
                                  key={link.id}
                                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-gradient-to-b from-[#102138] to-[#0c182b] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-400/50 hover:shadow-2xl hover:shadow-violet-500/20"
                                >
                                  {/* Top Paper Header */}
                                  <div>
                                    <div className="mb-4 flex items-center justify-between">
                                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-violet-300 group-hover:scale-110 group-hover:from-violet-500 group-hover:to-cyan-500 group-hover:text-white transition-all">
                                        <NotebookPen className="h-5.5 w-5.5" />
                                      </div>
                                      <span className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-violet-300 transition-colors">
                                        PAPER #{idx + 1}
                                      </span>
                                    </div>

                                    <h5 className="my-3 text-lg font-black leading-snug text-white group-hover:text-violet-200 transition-colors">
                                      {link.label}
                                    </h5>
                                  </div>

                                  {/* Bottom Action CTA Button */}
                                  <div className="mt-6 pt-4 border-t border-slate-800/80">
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 py-3.5 px-4 text-xs font-black text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] hover:shadow-violet-600/50 active:scale-[0.98]"
                                    >
                                      <span>{isRtl ? "بدء الامتحان الآن" : "Start Exam Now"}</span>
                                      <ChevronRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            /* Empty Exam Links State */
                            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-12 text-center">
                              <NotebookPen className="h-14 w-14 text-slate-600 mx-auto mb-4" />
                              <h5 className="text-lg font-black text-slate-300">
                                {isRtl ? "لا توجد روابط امتحانات لهذا المساق حالياً" : "No exam papers available for this subject yet."}
                              </h5>
                              <p className="text-xs text-slate-500 mt-2 font-medium">
                                {isRtl ? "سيتم رفع النماذج الجديدة فور اعتمادها من قبل الإدارة." : "Exams will be uploaded soon."}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                    ) : selectedQcmsYear ? (
                      /* ========================================================================= */
                      /* LEVEL 2: SUBJECT EXPLORER VIEW (Selected Year)                            */
                      /* ========================================================================= */
                      <div className="mt-4">
                        
                        {/* Year Banner Header */}
                        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-[#0d1e35] via-[#102440] to-[#0b1a2e] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-xl">
                          <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-violet-400 mb-1">
                              <GraduationCap className="h-4 w-4" />
                              <span>{isRtl ? "السنة الدراسية المحددة" : "Selected Year"}</span>
                            </div>
                            <h3 className="text-3xl font-black text-white sm:text-4xl">{selectedQcmsYear.name}</h3>
                            <p className="mt-1 text-xs font-bold text-slate-400">
                              {isRtl ? "استكشف المواد الدراسية واختر المادة المطلوبة لحل اختباراتها." : "Browse subjects and select one to start taking exams."}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-center">
                              <p className="text-2xl font-black text-violet-300">{selectedQcmsYear.subjects?.length || 0}</p>
                              <p className="text-[10px] font-bold text-slate-400">{isRtl ? "مواد متوفرة" : "Subjects"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Subjects Grid */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-black text-white flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-cyan-400" />
                            <span>{isRtl ? "استكشاف المواد الأكاديمية (Subject Explorer)" : "Subject Explorer"}</span>
                          </h4>

                          {selectedQcmsYear.subjects?.length ? (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                              {selectedQcmsYear.subjects.map((subject: any) => (
                                <button
                                  key={subject.id}
                                  onClick={() => setSelectedQcmsSubjectId(subject.id)}
                                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-[#0c182b] p-6 text-start shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/50 hover:bg-[#11223b] hover:shadow-2xl hover:shadow-cyan-500/15"
                                >
                                  <div>
                                    <div className="mb-5 flex items-center justify-between">
                                      <span className="rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-3 py-1 text-[11px] font-black text-cyan-300">
                                        {subject.code || "QCM"}
                                      </span>
                                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                                        <NotebookPen className="h-5 w-5" />
                                      </div>
                                    </div>

                                    <h4 className="text-xl font-black text-white group-hover:text-cyan-200 transition-colors leading-tight">
                                      {subject.name}
                                    </h4>
                                  </div>

                                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/80">
                                    <span className="text-xs font-bold text-slate-400">
                                      {(subject.examLinks || []).length} {isRtl ? "امتحان متاح" : "exams"}
                                    </span>
                                    <span className="text-xs font-black text-cyan-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                                      {t("qcms_open_subject", "استكشاف الاختبارات")}
                                      <ChevronRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            /* Empty Subjects State */
                            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-12 text-center text-slate-400">
                              <BookOpen className="h-14 w-14 text-slate-600 mx-auto mb-3" />
                              <p className="text-base font-bold">{t("qcms_no_subjects_in_year", "لم يتم إضافة مواد لهذه السنة الدراسية بعد.")}</p>
                            </div>
                          )}
                        </div>
                      </div>

                    ) : (
                      /* ========================================================================= */
                      /* LEVEL 1: ACADEMIC YEARS GRID VIEW (Feature Cards with Giant Index)        */
                      /* ========================================================================= */
                      <div className="mt-4">
                        <div className="mb-6 flex items-center justify-between">
                          <h3 className="text-xl font-black text-white flex items-center gap-2.5">
                            <GraduationCap className="h-5.5 w-5.5 text-violet-400" />
                            <span>{isRtl ? "المراحل والسنوات الدراسية" : "Academic Stages"}</span>
                          </h3>
                          <span className="text-xs font-bold text-slate-400">
                            {(qcmsYears || []).length} {isRtl ? "سنوات دراسية ممهدة" : "Years Available"}
                          </span>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                          {(qcmsYears || []).map((year: any, idx: number) => {
                            const indexStr = (idx + 1).toString().padStart(2, '0');
                            return (
                              <button
                                key={year.id}
                                onClick={() => {
                                  setSelectedQcmsYearId(year.id);
                                  setSelectedQcmsSubjectId(null);
                                }}
                                className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[2.2rem] border border-slate-800 bg-gradient-to-br from-[#0c182b] via-[#0f1e35] to-[#091222] p-7 text-start shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-violet-400/50 hover:shadow-2xl hover:shadow-violet-500/20"
                              >
                                {/* Giant Background Index Number */}
                                <span className="pointer-events-none absolute -bottom-10 -right-8 text-7xl font-black tracking-tighter text-slate-700/25 transition-colors group-hover:text-violet-500/15 select-none opacity-40">
                                  {indexStr}
                                </span>

                                {/* Header Tag & Icon */}
                                <div className="relative z-10 flex items-center justify-between gap-3">
                                  <span className="rounded-xl border border-violet-500/25 bg-violet-500/10 px-3.5 py-1.5 text-xs font-black text-violet-300">
                                    {year.subjects?.length || 0} {t("qcms_subject_count_suffix", "مواد دراسية")}
                                  </span>
                                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-violet-300 shadow-inner group-hover:scale-110 group-hover:from-violet-500 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300">
                                    <GraduationCap className="h-6 w-6" />
                                  </div>
                                </div>

                                {/* Body Content */}
                                <div className="relative z-10 mt-6">
                                  <h4 className="text-2xl font-black leading-tight text-white group-hover:text-violet-200 transition-colors">
                                    {year.name}
                                  </h4>
                                  <p className="mt-2 text-xs font-bold text-slate-400">
                                    {isRtl ? "اضغط لاستعراض المواد ونماذج الـ QCMs" : "Click to view subjects and QCM exams"}
                                  </p>
                                </div>

                                {/* Footer Action */}
                                <div className="relative z-10 mt-6 flex items-center justify-between pt-4 border-t border-slate-800/80">
                                  <span className="text-xs font-black text-violet-400 group-hover:text-cyan-300 transition-colors">
                                    {t("qcms_click_view_subjects", "تصفح المواد والأقسام")}
                                  </span>
                                  <ChevronRight className={`h-4 w-4 text-violet-400 transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1.5" : "group-hover:translate-x-1.5"}`} />
                                </div>
                              </button>
                            );
                          })}

                          {(!qcmsYears || qcmsYears.length === 0) && (
                            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-12 text-center text-slate-400 md:col-span-2">
                              <NotebookPen className="h-14 w-14 text-slate-600 mx-auto mb-3" />
                              <p className="text-base font-bold">{t("qcms_no_years_for_now", "لم يتم إضافة سنوات دراسية لـ QCMs بعد.")}</p>
                            </div>
                          )}

                          {/* ===== GOLDEN DEVELOPER CARD ===== */}
                          <button
                            onClick={() => {
                              setDevMode(true);
                              setSelectedDevYearId(null);
                              setSelectedDevSubjectId(null);
                            }}
                            className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[2.2rem] p-7 text-start shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-amber-500/40"
                            style={{
                              background: "linear-gradient(135deg, #1a1200 0%, #2d1f00 35%, #1a1200 70%, #0d0a00 100%)",
                              border: "1.5px solid rgba(245,158,11,0.5)",
                              boxShadow: "0 0 30px -10px rgba(245,158,11,0.25), inset 0 1px 0 rgba(255,215,0,0.15)"
                            }}
                          >
                            {/* Shimmer effect */}
                            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                              style={{
                                background: "linear-gradient(105deg, transparent 30%, rgba(255,215,0,0.08) 50%, transparent 70%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 2s infinite"
                              }}
                            />
                            {/* Glow corners */}
                            <div className="pointer-events-none absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px]" style={{ background: "rgba(245,158,11,0.15)" }} />
                            <div className="pointer-events-none absolute bottom-0 left-0 w-24 h-24 rounded-full blur-[50px]" style={{ background: "rgba(251,191,36,0.12)" }} />

                            {/* Giant background number */}
                            <Crown className="pointer-events-none absolute -bottom-4 -right-4 w-32 h-32 opacity-5 text-amber-400" />

                            {/* Header */}
                            <div className="relative z-10 flex items-center justify-between gap-3">
                              <span className="rounded-xl px-3.5 py-1.5 text-xs font-black"
                                style={{
                                  background: "rgba(245,158,11,0.15)",
                                  border: "1px solid rgba(245,158,11,0.35)",
                                  color: "#fbbf24"
                                }}
                              >
                                {devFeaturedYears.reduce((acc: number, y: any) =>
                                  acc + (y.subjects || []).reduce((a: number, s: any) =>
                                    a + (s.examLinks || []).length, 0), 0)} اختبار متاح
                              </span>
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner group-hover:scale-110 transition-all duration-300"
                                style={{
                                  background: "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(251,191,36,0.15))",
                                  border: "1px solid rgba(245,158,11,0.4)"
                                }}
                              >
                                <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                              </div>
                            </div>

                            {/* Body */}
                            <div className="relative z-10 mt-6">
                              <h4 className="text-2xl font-black leading-tight transition-colors" style={{ color: "#fde68a" }}>
                                اختبارات أنشأها المطور
                              </h4>
                              <p className="mt-2 text-xs font-bold" style={{ color: "rgba(251,191,36,0.6)" }}>
                                محتوى حصري ومميز من لدن فريق AuraMed
                              </p>
                            </div>

                            {/* Footer */}
                            <div className="relative z-10 mt-6 flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(245,158,11,0.2)" }}>
                              <span className="text-xs font-black transition-colors" style={{ color: "#f59e0b" }}>
                                تصفح الاختبارات المميزة
                              </span>
                              <ChevronRight className={`h-4 w-4 transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1.5" : "group-hover:translate-x-1.5"}`} style={{ color: "#f59e0b" }} />
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SIDEBAR DASHBOARD OVERVIEW PANEL (Visible when no subject selected) */}
                {!selectedQcmsSubject && (
                  <aside className="relative overflow-hidden border-t border-slate-800 bg-[#060e19] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),transparent_60%)]" />
                    <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
                      
                      <div>
                        <div className="mb-6 flex items-center justify-between gap-3 border-b border-slate-800 pb-5">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Exam Center</p>
                            <h3 className="mt-1 text-2xl font-black text-white">Dashboard</h3>
                          </div>
                          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                            LIVE HUB
                          </span>
                        </div>

                        {/* Metric Cards */}
                        <div className="space-y-4">
                          <div className={`rounded-2xl border p-5 shadow-inner ${
                            devMode 
                              ? "border-amber-500/30 bg-[#160e02]" 
                              : "border-slate-800 bg-[#0a1628]"
                          }`}>
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                                  {devMode ? "سنوات اختبارات المطور" : (isRtl ? "السنوات الدراسية" : "Academic Years")}
                                </p>
                                <p className="mt-1 text-3xl font-black text-white">
                                  {devMode ? (devFeaturedYears.length || 0) : (qcmsYears.length || 0)}
                                </p>
                              </div>
                              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                                devMode ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-violet-500/15 text-violet-300"
                              }`}>
                                {devMode ? <Crown className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                            <div className={`rounded-2xl border p-4 ${
                              devMode ? "border-amber-500/30 bg-[#160e02]" : "border-slate-800 bg-[#0a1628]"
                            }`}>
                              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                                {devMode ? "مواد تحتوي نماذج مطور" : (isRtl ? "إجمالي المواد" : "Total Subjects")}
                              </p>
                              <p className={`mt-1 text-2xl font-black ${devMode ? "text-amber-300" : "text-violet-300"}`}>
                                {devMode
                                  ? (devFeaturedYears.reduce((total, year: any) => total + (year.subjects?.length || 0), 0) || 0)
                                  : (qcmsYears.reduce((total, year: any) => total + (year.subjects?.length || 0), 0) || 0)}
                              </p>
                            </div>

                            <div className={`rounded-2xl border p-4 ${
                              devMode ? "border-amber-500/30 bg-[#160e02]" : "border-slate-800 bg-[#0a1628]"
                            }`}>
                              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                                {devMode ? "اختبارات منشأة من المطور" : (isRtl ? "نماذج الامتحانات" : "Exam Papers")}
                              </p>
                              <p className={`mt-1 text-2xl font-black ${devMode ? "text-yellow-300" : "text-cyan-300"}`}>
                                {devMode
                                  ? (devFeaturedYears.reduce((total, year: any) => total + (year.subjects?.reduce((sum: number, subject: any) => sum + (subject.examLinks?.length || 0), 0) || 0), 0) || 0)
                                  : (qcmsYears.reduce((total, year: any) => total + (year.subjects?.reduce((sum: number, subject: any) => sum + (subject.examLinks?.length || 0), 0) || 0), 0) || 0)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Medical Study Tip Box */}
                      <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-cyan-500/10 p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <GraduationCap className="h-5 w-5 text-violet-400" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-white">{isRtl ? "نصيحة المراجعة الطبية" : "Exam Tip"}</h4>
                        </div>
                        <p className="text-xs font-medium leading-relaxed text-slate-300">
                          {isRtl 
                            ? "يُنصح بحل نماذج الـ QCMs فور الانتهاء من مراجعة كل فصل تثبيتاً للمعلومات ودعماً للاستحضار السريع في الامتحانات."
                            : "Solve QCM exam papers regularly after studying each topic to reinforce long-term recall."}
                        </p>
                      </div>

                    </div>
                  </aside>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "pharmacy" && (
          <motion.div
            key="pharmacy"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* Embedded Search Control Bar */}
            <div className="max-w-2xl mx-auto" dir="rtl">
              <div className="relative group">
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 transition-colors group-focus-within:text-emerald-400" />
                <input
                  type="text"
                  value={pharmacySearch}
                  onChange={e => setPharmacySearch(e.target.value)}
                  placeholder={t("courses_pharmacy_search_placeholder", "ابحث عن قسم صيدلاني أو علاج محدد...")}
                  className="w-full pr-14 pl-6 py-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-emerald-500/20 dark:border-emerald-500/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm shadow-lg shadow-emerald-500/5 backdrop-blur-xl"
                />
              </div>
            </div>

            {/* Grid Showcase */}
            {filteredPharmacy.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white/50 dark:bg-slate-900/30 rounded-[3rem] border border-dashed border-emerald-500/20"
              >
                <FlaskConical className="w-16 h-16 mx-auto text-emerald-500/40 mb-4" />
                <h3 className="text-xl font-black text-slate-600 dark:text-slate-300">
                  {pharmacySearch ? t("courses_pharmacy_no_results", "لا توجد نتائج مطابقة لبحثك") : t("courses_pharmacy_empty_state", "لا توجد أقسام صيدلانية حالياً")}
                </h3>
                <p className="text-slate-400 text-sm mt-1">{t("courses_pharmacy_empty_hint", "جرّب البحث بكلمات أخرى أو تصفح باقي الأقسام.")}</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" dir="rtl">
                {filteredPharmacy.map((section, idx) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link
                      href={`/pharmacy/${section.id}`}
                      className="group relative flex flex-col h-full bg-white dark:bg-dark-card rounded-[2.2rem] border border-emerald-500/15 dark:border-emerald-500/20 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1.5 transition-all duration-500"
                    >
                      {/* Top Accent Gradient Header */}
                      <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

                      <div className="p-7 flex flex-col flex-1">
                        {/* Section Icon & Items Pill */}
                        <div className="flex items-center justify-between gap-3 mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner">
                            <FlaskConical className="w-7 h-7" />
                          </div>

                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                            <Pill className="w-3.5 h-3.5" />
                            <span>{section.images?.length || 0} {t("courses_pharmacy_item_count", "عنصر")}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {section.name}
                        </h3>

                        {/* Description */}
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6 line-clamp-2 flex-1">
                          {section.description || t("courses_pharmacy_section_default_description", "تصفح الصور والأدوية والوثائق الطبية الخاصة بهذا القسم الصيدلاني.")}
                        </p>

                        {/* Image Previews Strip (if images available) */}
                        {section.images && section.images.length > 0 && (
                          <div className="flex items-center gap-2 mb-6 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            {section.images.slice(0, 4).map((img, i) => (
                              <div key={img.id || i} className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-200 dark:bg-slate-900">
                                <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                              </div>
                            ))}
                            {section.images.length > 4 && (
                              <div className="w-10 h-10 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center justify-center shrink-0">
                                +{section.images.length - 4}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Card Action Link */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-auto">
                          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                            {t("courses_pharmacy_explore", "استكشف المحتوى الصيدلاني")}
                            <ChevronRight className="w-4 h-4 rotate-180" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
