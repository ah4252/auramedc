"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, Sparkles, ChevronRight, FlaskConical, Search, Pill, Layers, Image as ImageIcon, ArrowLeft, NotebookPen } from "lucide-react";
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
  canViewPharmacy = false,
}: { 
  yearCategories: any[]; 
  pharmacyCategories: PharmacySection[]; 
  qcmsYears?: any[];
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

  const filteredPharmacy = pharmacyCategories.filter(s =>
    s.name.toLowerCase().includes(pharmacySearch.toLowerCase()) ||
    (s.description || "").toLowerCase().includes(pharmacySearch.toLowerCase())
  );

  const selectedQcmsYear = qcmsYears.find((y: any) => y.id === selectedQcmsYearId) || null;
  const selectedQcmsSubject = selectedQcmsYear?.subjects?.find((s: any) => s.id === selectedQcmsSubjectId) || null;

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

        {/* ===== PHARMACY TAB CONTENT ===== */}
        {activeTab === "qcms" && (
          <motion.div
            key="qcms"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.7rem] border border-violet-400/20 bg-[#071526]/95 shadow-[0_0_0_1px_rgba(139,92,246,0.15),0_30px_80px_-30px_rgba(91,33,182,0.9)] backdrop-blur-xl">
              <div className={`grid gap-0 ${selectedQcmsSubject ? "lg:grid-cols-1" : "lg:grid-cols-[1.12fr_0.88fr]"}`}>
                <div className="relative p-6 sm:p-8 lg:p-10 xl:p-12">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.1),transparent_30%)]" />
                  <div className="relative">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-violet-200">
                      <NotebookPen className="h-3.5 w-3.5" />
                      {t("qcms_badge", "Smart assessments")}
                    </div>

                    <div className="max-w-xl">
                      <h2 className="mb-4 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-[3.2rem]">
                        {t("qcms_title", "QCMs section")}
                      </h2>
                      <p className="text-base leading-8 text-slate-300 sm:text-lg">
                        {t("qcms_description", "A specialized training platform for short tests, designed to strengthen understanding and track the student's level professionally.")}
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <span className="rounded-full border border-violet-300/30 bg-violet-500/10 px-4 py-2 text-sm font-bold text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]">
                        {t("qcms_qc_tag", "Questions")}
                      </span>
                      <span className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]">
                        {t("qcms_finstant_tag", "Instant assessment")}
                      </span>
                      <span className="rounded-full border border-emerald-300/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
                        {t("qcms_content_tag", "Updated content")}
                      </span>
                    </div>

                    {selectedQcmsSubject ? (
                      <div className="mt-10 rounded-[2rem] border border-violet-400/20 bg-[#111c2d]/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_20px_50px_-25px_rgba(91,33,182,0.8)] sm:p-7">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <button
                              onClick={() => setSelectedQcmsSubjectId(null)}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-black text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-violet-400/60 dark:hover:bg-slate-800"
                            >
                              <ArrowLeft className="h-4 w-4" />
                              {t("qcms_back_to_subjects", "Back to subjects")}
                            </button>
                            <h3 className="mt-4 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">{selectedQcmsSubject.name}</h3>
                            <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">{t("qcms_year_label", "Year")}: {selectedQcmsYear?.name}</p>
                          </div>
                          <span className="inline-flex w-fit rounded-full border border-violet-200 bg-violet-100 px-4 py-2 text-xs font-black text-violet-700 dark:border-violet-400/40 dark:bg-violet-500/10 dark:text-violet-200">
                            {selectedQcmsSubject.code || t("qcms_code_default", "QCM")}
                          </span>
                        </div>

                        <div className="p-4 sm:p-8">
                          <div className="mb-6 flex justify-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-200">
                              <NotebookPen className="h-7 w-7" />
                            </div>
                          </div>

                          <div className="rounded-[1.5rem] bg-[#18273f] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-4">
                            <h4 className="px-1 text-xl font-black text-white">{isRtl ? "روابط الامتحانات" : "Exam links"}</h4>

                            {(selectedQcmsSubject.examLinks || []).length > 0 ? (
                              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {(selectedQcmsSubject.examLinks || []).map((link: any) => (
                                  <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex min-h-[150px] items-center justify-center rounded-[1.35rem] border border-violet-300/10 bg-[#2a3b57] p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_10px_20px_-14px_rgba(59,130,246,0.7)] transition duration-200 hover:-translate-y-1 hover:border-violet-300/30 hover:bg-[#30466d]"
                                  >
                                    <span className="block break-words text-sm font-black leading-6 text-white">{link.label}</span>
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <p className="mt-4 text-sm font-bold text-slate-400">
                                {isRtl ? "لا توجد روابط امتحانات لهذا المساق" : "No exam links are available for this subject yet."}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : selectedQcmsYear ? (
                      <div className="mt-10">
                        <div className="mb-5 flex items-center justify-between gap-4">
                          <div>
                            <button
                              onClick={() => {
                                setSelectedQcmsYearId(null);
                                setSelectedQcmsSubjectId(null);
                              }}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-black text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-violet-400/60 dark:hover:bg-slate-800"
                            >
                              <ArrowLeft className="h-4 w-4" />
                              {t("qcms_back_to_years", "Back to years")}
                            </button>
                            <h3 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">{selectedQcmsYear.name}</h3>
                          </div>
                          <span className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-black text-violet-700 dark:border-violet-400/40 dark:bg-violet-500/10 dark:text-violet-200">
                            {selectedQcmsYear.subjects?.length || 0} {t("qcms_subject_count_suffix", "subjects")}
                          </span>
                        </div>

                        {selectedQcmsYear.subjects?.length ? (
                          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {selectedQcmsYear.subjects.map((subject: any) => (
                              <button
                                key={subject.id}
                                onClick={() => setSelectedQcmsSubjectId(subject.id)}
                                className="group rounded-[2rem] border border-slate-200 bg-white p-5 text-start shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-violet-400/50"
                              >
                                <div className="mb-4 flex items-center justify-between gap-3">
                                  <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10px] font-black text-violet-700 dark:border-violet-400/40 dark:bg-violet-500/10 dark:text-violet-200">
                                    {subject.code || t("qcms_code_default", "QCM")}
                                  </span>
                                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-200">
                                    <NotebookPen className="h-5 w-5" />
                                  </div>
                                </div>
                                <h4 className="text-xl font-black text-slate-900 dark:text-white">{subject.name}</h4>
                                <p className="mt-3 text-xs font-bold text-slate-500 dark:text-slate-400">{t("qcms_open_subject", "Open subject")}</p>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-[2rem] border border-dashed border-violet-200 bg-violet-50 p-8 text-center text-slate-600 dark:border-violet-500/20 dark:bg-violet-500/5 dark:text-slate-300">
                            {t("qcms_no_subjects_in_year", "No subjects have been added to this year yet.")}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {(qcmsYears || []).map((year: any) => (
                          <button
                            key={year.id}
                            onClick={() => {
                              setSelectedQcmsYearId(year.id);
                              setSelectedQcmsSubjectId(null);
                            }}
                            className="group flex min-h-[170px] flex-col justify-between rounded-[2rem] border border-violet-200 bg-gradient-to-br from-violet-500/12 via-white to-cyan-500/10 p-5 text-start shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-500/15 dark:border-violet-400/20 dark:from-violet-500/15 dark:via-slate-900 dark:to-cyan-500/10"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="rounded-full border border-violet-200 bg-white/80 px-3 py-1.5 text-[10px] font-black text-violet-700 dark:border-violet-500/20 dark:bg-slate-900/70 dark:text-violet-200">
                                {year.subjects?.length || 0} {t("qcms_subject_count_suffix", "subjects")}
                              </span>
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-200">
                                <NotebookPen className="h-5 w-5" />
                              </div>
                            </div>

                            <div className="mt-4">
                              <h3 className="text-2xl font-black leading-tight text-slate-900 dark:text-white sm:text-3xl">{year.name}</h3>
                              <p className="mt-3 text-sm font-bold text-slate-600 dark:text-slate-300">{t("qcms_click_view_subjects", "Open subjects")}</p>
                            </div>
                          </button>
                        ))}

                        {(!qcmsYears || qcmsYears.length === 0) && (
                          <div className="rounded-[2rem] border border-dashed border-violet-200 bg-violet-50 p-8 text-center text-slate-600 dark:border-violet-500/20 dark:bg-violet-500/5 dark:text-slate-300 md:col-span-2">
                            {t("qcms_no_years_for_now", "No QCM years have been added yet.")}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {!selectedQcmsSubject && (
                  <aside className="relative overflow-hidden border-t border-violet-400/10 bg-[#0c1727] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10 xl:p-12">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(167,139,250,0.25),transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.18),transparent_35%)]" />
                    <div className="relative h-full">
                      <div className="mb-6 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Status</p>
                          <h3 className="mt-2 text-2xl font-black text-white">QCMs</h3>
                        </div>
                        <span className="rounded-full border border-emerald-300/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">
                          live
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-[1.75rem] border border-violet-400/10 bg-[#111f32] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{isRtl ? "المحتوى" : "Content"}</p>
                              <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{qcmsYears.length || 0}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-200">
                              <Sparkles className="h-6 w-6" />
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                          <div className="rounded-[1.5rem] border border-violet-400/10 bg-[#111f32] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{isRtl ? "الأسئلة" : "Questions"}</p>
                            <p className="mt-2 text-2xl font-black text-white">
                              {qcmsYears.reduce((total, year: any) => total + (year.subjects?.reduce((sum: number, subject: any) => sum + (subject.examLinks?.length || 0), 0) || 0), 0) || 0}
                            </p>
                          </div>
                          <div className="rounded-[1.5rem] border border-violet-400/10 bg-[#111f32] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{isRtl ? "المواضيع" : "Subjects"}</p>
                            <p className="mt-2 text-2xl font-black text-white">
                              {qcmsYears.reduce((total, year: any) => total + (year.subjects?.length || 0), 0) || 0}
                            </p>
                          </div>
                        </div>
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
