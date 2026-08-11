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
            <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 shadow-2xl shadow-violet-500/10">
              <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="p-8 sm:p-10 lg:p-14">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-violet-200">
                    <NotebookPen className="h-3.5 w-3.5" />
                    {t("qcms_badge", "Smart assessments")}
                  </div>
                  <h2 className="mb-4 text-4xl font-black text-white sm:text-5xl">{t("qcms_title", "QCMs section")}</h2>
                  <p className="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                    {t("qcms_description", "A specialized training platform for short tests, designed to strengthen understanding and track the student's level professionally.")}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-sm font-bold text-violet-200">{t("qcms_qc_tag", "Questions")}</span>
                    <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-200">{t("qcms_finstant_tag", "Instant assessment")}</span>
                    <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-200">{t("qcms_content_tag", "Updated content")}</span>
                  </div>

                  {selectedQcmsSubject ? (
                    <div className="mt-10 rounded-[2rem] bg-slate-900/80 p-4 sm:p-8">
                      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <button
                            onClick={() => {
                              setSelectedQcmsSubjectId(null);
                            }}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-600 px-4 py-2 text-xs font-black text-slate-300 transition hover:bg-slate-700"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            {t("qcms_back_to_subjects", "Back to subjects")}
                          </button>
                          <h3 className="mt-4 text-2xl font-black text-white sm:text-3xl">{selectedQcmsSubject.name}</h3>
                          <p className="mt-2 text-sm font-bold text-slate-400">{t("qcms_year_label", "Year")}: {selectedQcmsYear?.name}</p>
                        </div>
                        <span className="inline-flex w-fit rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-xs font-black text-violet-200">
                          {selectedQcmsSubject.code || t("qcms_code_default", "QCM")}
                        </span>
                      </div>
                      <div className="rounded-[2rem] bg-violet-500/5 p-4 sm:p-10">
                        <div className="mb-4 flex justify-center">
                          <NotebookPen className="h-12 w-12 text-violet-300" />
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          <div className="rounded-[1.6rem] bg-slate-900/50 p-4 sm:p-5">
                            <h4 className="text-xl font-black text-white">روابط الامتحانات</h4>
                            <div className="mt-4 space-y-3">
                              {(selectedQcmsSubject.examLinks || []).length > 0 ? (
                                (selectedQcmsSubject.examLinks || []).map((link: any) => (
                                  <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="block min-w-0 overflow-hidden rounded-2xl bg-violet-500/10 px-4 py-3 transition hover:bg-violet-500/20">
                                    <span className="block break-words text-sm font-black text-violet-200">{link.label}</span>
                                    <span className="mt-1 block max-w-full truncate text-[10px] font-bold text-slate-400">{link.url}</span>
                                  </a>
                                ))
                              ) : (
                                <p className="text-sm font-bold text-slate-500">لا توجد روابط امتحانات لهذا المساق</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedQcmsYear ? (
                    <div className="mt-10">
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <button
                            onClick={() => {
                              setSelectedQcmsYearId(null);
                              setSelectedQcmsSubjectId(null);
                            }}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-600 px-4 py-2 text-xs font-black text-slate-300 transition hover:bg-slate-700"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            {t("qcms_back_to_years", "Back to years")}
                          </button>
                          <h3 className="mt-4 text-3xl font-black text-white">{selectedQcmsYear.name}</h3>
                        </div>
                        <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-xs font-black text-violet-200">
                          {selectedQcmsYear.subjects?.length || 0} {t("qcms_subject_count_suffix", "subjects")}
                        </span>
                      </div>

                      {selectedQcmsYear.subjects?.length ? (
                        <div className="grid gap-4 md:grid-cols-2">
                          {selectedQcmsYear.subjects.map((subject: any) => (
                            <button
                              key={subject.id}
                              onClick={() => {
                                setSelectedQcmsSubjectId(subject.id);
                              }}
                              className="rounded-[2rem] bg-white/5 p-6 text-right transition hover:bg-violet-500/15 hover:-translate-y-1"
                            >
                              <div className="mb-4 flex items-center justify-between">
                                <span className="rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-[10px] font-black text-violet-200">
                                  {subject.code || t("qcms_code_default", "QCM")}
                                </span>
                                <NotebookPen className="h-6 w-6 text-violet-300" />
                              </div>
                              <h4 className="text-xl font-black text-white">{subject.name}</h4>
                              <p className="mt-3 text-xs font-bold text-slate-400">{t("qcms_open_subject", "Open subject")}</p>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-[2rem] bg-violet-500/5 p-8 text-center text-slate-300">
                          {t("qcms_no_subjects_in_year", "No subjects have been added to this year yet.")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-10 grid gap-5 md:grid-cols-2">
                      {(qcmsYears || []).map((year: any) => (
                        <button
                          key={year.id}
                          onClick={() => {
                            setSelectedQcmsYearId(year.id);
                            setSelectedQcmsSubjectId(null);
                          }}
                          className="min-h-[220px] rounded-[2rem] bg-gradient-to-br from-violet-500/20 to-slate-900/60 p-8 text-right transition hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/25"
                        >
                          <div className="mb-10 flex items-center justify-between">
                            <span className="rounded-full border border-violet-400/45 bg-violet-500/10 px-4 py-2 text-[10px] font-black text-violet-200">
                              {year.subjects?.length || 0} {t("qcms_subject_count_suffix", "subjects")}
                            </span>
                            <NotebookPen className="h-8 w-8 text-violet-300" />
                          </div>
                          <h3 className="text-3xl font-black text-white">{year.name}</h3>
                          <p className="mt-4 text-sm font-bold text-slate-300">{t("qcms_click_view_subjects", "Open subjects")}</p>
                        </button>
                      ))}

                      {(!qcmsYears || qcmsYears.length === 0) && (
                        <div className="rounded-[2rem] bg-violet-500/5 p-8 text-center text-slate-300 md:col-span-2">
                          {t("qcms_no_years_for_now", "No QCM years have been added yet.")}
                        </div>
                      )}
                    </div>
                  )}
                </div>


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
