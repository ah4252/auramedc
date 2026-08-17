"use client";

import { useState, useRef, useEffect } from "react";
import { Calculator, ArrowRight, RotateCcw, GraduationCap, Award, Info, Download, Loader2, FileText, CheckCircle2, Star, Calendar, UserCheck, Database, ChevronLeft, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { saveGPA } from "@/app/actions/content";

interface Subject {
  id: string | number;
  name: string;
  grade: number;
  coefficient: number;
}

import html2canvas from "html2canvas";
import { useAuraDownloader } from "@/hooks/useAuraDownloader";
import { useLocale } from "@/context/LocaleProvider.client";

export default function GPACalculatorClient({ userId, userEmail, hasActiveSubscription = false, activeSubscriptionsCount = 0, initialData, gpaYears }: { userId: string | null, userEmail?: string | null, hasActiveSubscription?: boolean, activeSubscriptionsCount?: number, initialData: any, gpaYears: any[] }) {
  const [selectedYear, setSelectedYear] = useState<any>(null);
  const { saveFile } = useAuraDownloader();
  const { t, lang } = useLocale();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [showUsageModal, setShowUsageModal] = useState(false);
  const [didRedirect, setDidRedirect] = useState(false);
  const [reportId, setReportId] = useState("MP-00000");

  useEffect(() => {
    setDidRedirect(localStorage.getItem("gpa_payment_redirected") === "true");
  }, []);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReportId(`MP-${Math.floor(Math.random() * 100000)}`);
  }, []);

  // Load saved data for the selected year
  useEffect(() => {
    if (selectedYear && initialData && Array.isArray(initialData)) {
      const yearData = initialData.find((d: any) => 
        (d.data?.yearName === selectedYear.name) || 
        // Fallback for older data format
        (!d.data?.yearName && d.data?.subjects?.length === selectedYear.subjects?.length)
      );

      if (yearData) {
        const savedSubjects = yearData.data.subjects || yearData.data;
        if (Array.isArray(savedSubjects)) {
          // Merge saved grades with system subjects
          const merged = selectedYear.subjects.map((sysSub: any) => {
            const saved = savedSubjects.find((s: any) => s.id === sysSub.id || s.name === sysSub.name);
            return {
              id: sysSub.id,
              name: sysSub.name,
              grade: saved ? saved.grade : 0,
              coefficient: sysSub.coefficient
            };
          });
          setSubjects(merged);
        }
      }
    }
  }, [selectedYear, initialData]);

  const handleSelectYear = (year: any) => {
    setSelectedYear(year);
    // Pre-fill subjects from the selected year
    if (year.subjects && year.subjects.length > 0) {
      setSubjects(year.subjects.map((sub: any) => ({
        id: sub.id,
        name: sub.name,
        grade: 0,
        coefficient: sub.coefficient
      })));
    } else {
      setSubjects([]);
    }
  };

  const updateSubjectGrade = (id: string | number, grade: number) => {
    // Cap grade at 20
    const cappedGrade = Math.min(20, Math.max(0, grade));
    setSubjects(subjects.map(s => s.id === id ? { ...s, grade: cappedGrade } : s));
  };

  const reset = () => {
    if (selectedYear) {
      handleSelectYear(selectedYear);
    }
  };

  const calculateGPA = () => {
    let weightedSum = 0;
    let totalCoefficients = 0;
    subjects.forEach(s => {
      weightedSum += s.grade * s.coefficient;
      totalCoefficients += s.coefficient;
    });
    return totalCoefficients === 0 ? "0.00" : (weightedSum / totalCoefficients).toFixed(2);
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaveLoading(true);
    const res = await saveGPA(userId, calculateGPA(), subjects, selectedYear?.name);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert(res.error);
    }
    setSaveLoading(false);
  };

  const handleExport = async () => {
    if (!certificateRef.current || !selectedYear) return;

    setExportLoading(true);
    
    try {
      const element = certificateRef.current;
      
      // Temporarily ensure it is visible and positioned offscreen
      element.classList.remove("hidden");
      element.style.display = "block";
      
      // Allow browser to apply styles before rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: true, // helpful for debugging if it fails again
      });
      
      element.style.display = "none";
      element.classList.add("hidden");
      
      const image = canvas.toDataURL("image/png", 1.0);
      await saveFile(image, `AuraMed_Result_${new Date().getTime()}.png`, "image/png");
      

    } catch (error) {
      console.error("Export failed:", error);
      alert(t("gpa_export_error"));
    } finally {
      setExportLoading(false);
    }
  };

  const gpa = calculateGPA();
  const gpaValue = parseFloat(gpa);
  const dateLocale = lang === "fr" ? "fr-FR" : lang === "en" ? "en-US" : "ar-DZ";

  const translateYearName = (year: any) => {
    const value = (year?.name || "").trim();
    if (lang === "ar") return value;

    const normalized = value
      .replace(/[أإآ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/[ًٌٍَُِّْ]/g, "")
      .replace(/ +/g, " ")
      .trim()
      .toLowerCase();

    const translations: Array<[RegExp, string]> = [
      [/(?:السنة|السنه)\s*(?:ال)?اول(?:ى|ي|ه)?/, lang === "fr" ? "1re année" : "1st year"],
      [/(?:السنة|السنه)\s*(?:ال)?ثان(?:ية|ي|ه)?/, lang === "fr" ? "2e année" : "2nd year"],
      [/(?:السنة|السنه)\s*(?:ال)?ثال(?:ثة|ثه|ته)?/, lang === "fr" ? "3e année" : "3rd year"],
      [/(?:السنة|السنه)\s*(?:ال)?راب(?:عة|عه|ته)?/, lang === "fr" ? "4e année" : "4th year"],
      [/(?:السنة|السنه)\s*(?:ال)?خامس(?:ة|ه)?/, lang === "fr" ? "5e année" : "5th year"],
      [/(?:السنة|السنه)\s*(?:ال)?سادس(?:ة|ه)?/, lang === "fr" ? "6e année" : "6th year"],
      [/(?:السنة|السنه)\s*(?:ال)?سابع(?:ة|ه)?/, lang === "fr" ? "7e année" : "7th year"],
      [/(?:السنة|السنه)\s*(?:ال)?ثامن(?:ة|ه)?/, lang === "fr" ? "8e année" : "8th year"],
      [/(?:السنة|السنه)\s*(?:ال)?تاسع(?:ة|ه)?/, lang === "fr" ? "9e année" : "9th year"],
      [/(?:السنة|السنه)\s*(?:ال)?عاشر(?:ة|ه)?/, lang === "fr" ? "10e année" : "10th year"],
    ];

    for (const [pattern, translation] of translations) {
      if (pattern.test(normalized)) return translation;
    }

    if (year?.slug) {
      const slug = year.slug.toLowerCase();
      if (slug.includes("premiere") || slug.includes("1re") || slug.includes("year-1")) return "1re année";
      if (slug.includes("deuxieme") || slug.includes("2e") || slug.includes("year-2")) return "2e année";
      if (slug.includes("troisieme") || slug.includes("3e") || slug.includes("year-3")) return "3e année";
      if (slug.includes("quatrieme") || slug.includes("4e") || slug.includes("year-4")) return "4e année";
      if (slug.includes("cinquieme") || slug.includes("5e") || slug.includes("year-5")) return "5e année";
      if (slug.includes("sixieme") || slug.includes("6e") || slug.includes("year-6")) return "6e année";
    }

    return value;
  };

  const getDisplayedYearName = (year: any) => {
    if (!year) return "";
    return translateYearName(year);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg py-12 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-medical-500/5 rounded-full -mr-64 -mt-64 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full -ml-64 -mb-64 blur-3xl"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-medical-600 to-medical-400 text-white shadow-xl shadow-medical-600/30 mb-6"
          >
            <Calculator className="w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{t("gpa_page_title")}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">{t("gpa_page_description")}</p>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowUsageModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-amber-500/30 transition-all hover:scale-[1.02] hover:shadow-amber-600/40 active:scale-95"
            >
              <Info className="h-4 w-4" />
              دليل الاستخدام
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!selectedYear ? (
            // Year Selection View
            <motion.div
              key="years"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
                <Calendar className="w-6 h-6 text-medical-600" />
                {t("gpa_select_year")}
              </h2>
              
              {gpaYears && gpaYears.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gpaYears.map(year => (
                    <button
                      key={year.id}
                      onClick={() => handleSelectYear(year)}
                      className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-medical-500 hover:-translate-y-1 transition-all group flex items-center justify-between text-right"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-medical-50 dark:bg-medical-900/20 text-medical-600 rounded-2xl flex items-center justify-center group-hover:bg-medical-600 group-hover:text-white transition-colors">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-medical-600 transition-colors">{getDisplayedYearName(year)}</h3>
                          <p className="text-sm text-slate-500">{year.subjects?.length || 0} {t("gpa_subjects_count_label")}</p>
                        </div>
                      </div>
                      <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-medical-600 transform group-hover:-translate-x-2 transition-all" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center bg-white dark:bg-dark-card p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
                  <Calculator className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-600">{t("gpa_no_years_title")}</h3>
                  <p className="text-slate-500 mt-2">{t("gpa_no_years_subtitle")}</p>
                </div>
              )}
            </motion.div>
          ) : (
            // Calculator View
            <motion.div
              key="calculator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSelectedYear(null)}
                        className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-medical-100 hover:text-medical-600 text-slate-600 dark:text-slate-400 rounded-xl transition-colors"
                        title={t("gpa_back_button")}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-medical-600" />
                        {t("gpa_points_label")} {getDisplayedYearName(selectedYear)}
                      </h2>
                    </div>
                    <button 
                      onClick={reset}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                      title={t("gpa_reset_button")}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {subjects.length === 0 ? (
                      <div className="text-center py-10 text-slate-400">{t("gpa_no_subjects")}</div>
                    ) : (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-right">
                          <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                      <th className="p-4 font-bold text-slate-600 dark:text-slate-300">{t("gpa_table_subject")}</th>
                              <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-center w-24 hidden md:table-cell">{t("gpa_table_coefficient")}</th>
                              <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-center w-32">{t("gpa_table_grade")}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {subjects.map((subject, index) => (
                              <tr key={subject.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="p-4">
                                  <div className="font-bold text-slate-800 dark:text-slate-200">{subject.name}</div>
                                  <div className="md:hidden text-xs text-medical-600 mt-1 font-bold">{t("gpa_coefficient_label")} : {subject.coefficient}</div>
                                </td>
                                <td className="p-4 text-center hidden md:table-cell">
                                  <span className="bg-medical-50 dark:bg-medical-900/30 text-medical-700 px-3 py-1 rounded-lg font-black inline-block min-w-[3rem]">
                                    {subject.coefficient}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <input 
                                    type="number"
                                    min="0"
                                    max="20"
                                    step="0.25"
                                    placeholder={t("gpa_input_placeholder")}
                                    className={`w-full bg-slate-100 dark:bg-slate-900 border-2 border-transparent focus:border-medical-500 p-3 rounded-xl outline-none transition-all text-center font-bold text-lg ${
                                      subject.grade >= 10 
                                      ? "text-green-600 dark:text-green-400" 
                                      : "text-red-600 dark:text-red-400"
                                    }`}
                                    value={subject.grade === 0 ? "" : subject.grade}
                                    onChange={(e) => updateSubjectGrade(subject.id, parseFloat(e.target.value) || 0)}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Result Card */}
              <div className="space-y-6">
                <div className="bg-white/10 dark:bg-slate-950/40 rounded-[2.5rem] p-8 border border-white/10 dark:border-white/10 shadow-2xl shadow-slate-900/30 backdrop-blur-3xl backdrop-saturate-150 sticky top-24 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/25 via-white/5 to-transparent dark:from-slate-100/10 dark:via-slate-950/10 dark:to-transparent pointer-events-none" />
                  <h3 className="relative text-xl font-black mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-3xl bg-white/15 dark:bg-slate-900/30 border border-white/10 dark:border-white/10 text-medical-500 shadow-lg shadow-medical-500/10">
                      <Award className="w-5 h-5" />
                    </span>
                    {t("gpa_result_title")}
                  </h3>

                  <div className="relative flex flex-col items-center py-10">
                    {/* GPA Ring Decor */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-56 h-56 rounded-full border-[10px] border-white/10 bg-white/0 dark:border-white/5 blur-sm" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <motion.div 
                         initial={{ rotate: -90 }}
                         animate={{ rotate: (gpaValue / 20) * 360 - 90 }}
                         className="w-48 h-48 rounded-full border-[12px] border-medical-500/50 border-t-transparent border-l-transparent transition-all duration-700"
                       ></motion.div>
                    </div>
                    
                    <span className="relative text-5xl font-black text-slate-900 dark:text-white z-10">{gpa}</span>
                    <span className="relative text-sm font-bold text-slate-500 dark:text-slate-300 mt-2 z-10 uppercase tracking-widest">{t("gpa_overall_label")}</span>
                  </div>


                  {!userId && (
                    <div className="mt-8 p-6 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-medical-500/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-medical-500/30 transition-all"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-2 bg-medical-500 rounded-lg">
                            <Star className="w-4 h-4 text-white fill-current" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-wider text-medical-400">{t("gpa_promo_title")}</span>
                        </div>
                        
                        <h4 className="text-lg font-bold mb-4 leading-tight">{t("gpa_promo_cta")}</h4>
                        
                        <ul className="space-y-3 mb-6">
                          {[
                            { icon: Database, text: t("gpa_promo_save") },
                            { icon: Download, text: t("gpa_promo_export") },
                            { icon: Calendar, text: t("gpa_promo_progress") },
                          ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                              <item.icon className="w-4 h-4 text-medical-500" />
                              <span className="font-medium">{item.text}</span>
                            </li>
                          ))}
                        </ul>

                        <Link href="/register" className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-center block hover:bg-medical-500 hover:text-white transition-all shadow-lg active:scale-95">
                          {t("gpa_promo_register")}
                        </Link>
                      </div>
                    </div>
                  )}

                  {userId && subjects.length > 0 && (
                    <div className="space-y-4 mt-6">
                      <button 
                        onClick={handleSave}
                        disabled={saveLoading}
                        className={`w-full py-3 rounded-[2rem] font-bold transition-all flex items-center justify-center gap-2 ${
                          saveSuccess 
                          ? "bg-emerald-500/15 text-emerald-900 border border-emerald-500/20 shadow-[0_18px_70px_rgba(16,185,129,0.14)]" 
                          : "bg-white/15 dark:bg-slate-900/35 text-slate-900 dark:text-white border border-white/10 dark:border-white/10 backdrop-blur-xl hover:bg-white/20 dark:hover:bg-slate-900/55 shadow-lg shadow-slate-900/10 disabled:opacity-50"
                        }`}
                      >
                        {saveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : saveSuccess ? t("gpa_save_success") : t("gpa_save_button")}
                      </button>

                      <button 
                        onClick={handleExport}
                        disabled={exportLoading}
                        className="w-full py-3 rounded-[2rem] font-bold bg-white/15 dark:bg-slate-900/35 text-slate-900 dark:text-white border border-white/10 dark:border-white/10 hover:bg-white/25 dark:hover:bg-slate-900/55 transition-all backdrop-blur-xl flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {exportLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Download className="w-5 h-5 text-medical-600" />
                        )}
                        {t("gpa_export_button")}
                      </button>
                    </div>
                  )}

                  <div className="mt-10 p-6 rounded-[2.5rem] bg-white/10 dark:bg-slate-950/30 border border-white/10 dark:border-white/10 backdrop-blur-xl text-slate-900 dark:text-white text-center shadow-lg shadow-slate-900/10">
                    <p className="text-sm font-bold">
                      {gpaValue >= 16 ? t("gpa_rating_excellent") :
                       gpaValue >= 14 ? t("gpa_rating_very_good") :
                       gpaValue >= 12 ? t("gpa_rating_good") :
                       gpaValue >= 10 ? t("gpa_rating_pass") :
                       t("gpa_rating_fail")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- REFINED CERTIFICATE (COMPACT & STRUCTURED) --- */}
      <div 
        ref={certificateRef}
        className="hidden-certificate fixed top-[-9999px] left-[-9999px] w-[800px] bg-white p-8 text-right rtl hidden"
      >
        <div className="border-[4px] border-medical-600 p-8 h-full relative bg-white shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center border-b-2 border-medical-100 pb-6 mb-8">
            <div className="flex items-center gap-4">
              {/* Logo Emblem (Inline for guaranteed export rendering) */}
              <div className="w-16 h-16 shrink-0">
                <img 
                  src="/logo.png" 
                  alt="AuraMed Elite" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-black text-medical-600 tracking-wider italic leading-none">Aura<span className="not-italic font-light">Med</span></h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Elite Medical Education Systems</p>
              </div>
            </div>
            <div className="text-left text-xs text-slate-500 font-medium">
              <p>{t("gpa_certificate_year")} {selectedYear?.name || t("gpa_certificate_year_unknown")}</p>
              <p>{t("gpa_certificate_date")} {new Date().toLocaleDateString(dateLocale)}</p>
              <p>{t("gpa_certificate_number")} {reportId}</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">{t("gpa_certificate_heading")}</h2>
            <div className="w-24 h-1 bg-medical-500 mx-auto mt-2 rounded-full opacity-20"></div>
          </div>

          {/* 1. Subject Table */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-medical-600" />
              {t("gpa_certificate_subjects_heading")}
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm">
                  <th className="border border-slate-100 p-4 text-right rounded-tr-xl">{t("gpa_certificate_table_subject")}</th>
                  <th className="border border-slate-100 p-4 text-center">{t("gpa_certificate_table_coefficient")}</th>
                  <th className="border border-slate-100 p-4 text-center">{t("gpa_certificate_table_grade")}</th>
                  <th className="border border-slate-100 p-4 text-center rounded-tl-xl">{t("gpa_certificate_table_total")}</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s, i) => (
                  <tr key={i} className="text-slate-800 border-b border-slate-50">
                    <td className="p-4 font-medium">{s.name || `${t("gpa_subject_fallback")} ${i+1}`}</td>
                    <td className="p-4 text-center">{s.coefficient}</td>
                    <td className="p-4 text-center font-bold text-medical-600">{s.grade}</td>
                    <td className="p-4 text-center font-bold">{(s.grade * s.coefficient).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. Final Result (Nuclear Fix for Arabic Rendering) */}
          {/* 2. Final Result (Nuclear Fix for Arabic Rendering) */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-medical-900 to-slate-900 p-10 shadow-2xl mb-10 border border-white/10 text-right" dir="rtl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-medical-500/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center border border-white/20 shadow-inner shrink-0">
                  <Award className="w-10 h-10 text-medical-400" />
                </div>
                <div>
                  <p className="text-medical-400 text-xs font-bold mb-2">{t("gpa_certificate_final_result_label")}</p>
                  <h3 className="text-7xl font-black text-white tracking-tighter leading-none">{gpa}</h3>
                </div>
              </div>
              
              <div className="text-left">
                <div className="inline-block px-8 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl min-w-[200px]">
                  <span className="block text-[10px] text-slate-400 font-bold mb-1 text-right">{t("gpa_certificate_overall_label")}</span>
                  <p className="text-3xl font-black text-medical-400 text-right">
                    {gpaValue >= 16 ? t("gpa_certificate_rating_excellent") :
                     gpaValue >= 14 ? t("gpa_certificate_rating_very_good") :
                     gpaValue >= 12 ? t("gpa_certificate_rating_good") :
                     gpaValue >= 10 ? t("gpa_certificate_rating_pass") :
                     t("gpa_certificate_rating_fail")}
                  </p>
                </div>
              </div>
            </div>
            
            {/* 
               CRITICAL FIX: We use a special style to prevent html2canvas 
               from mirroring or splitting the text by using standard web fonts 
               and avoiding complex layout for text-only nodes.
            */}
            <style jsx>{`
              .relative * {
                font-family: 'Arial', sans-serif !important;
                letter-spacing: normal !important;
                word-spacing: normal !important;
              }
            `}</style>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 pt-8 mt-12 text-right" dir="rtl">
            <p className="text-slate-400 text-[10px] font-bold">
              {t("gpa_certificate_disclaimer_line1")}
              <br />{t("gpa_certificate_disclaimer_line2")}
            </p>
          </div>
        </div>
      </div>

      {/* Usage Guide Modal */}
      <AnimatePresence>
        {showUsageModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUsageModal(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              className="relative z-10 w-[min(92vw,42rem)] max-h-[85vh] overflow-hidden rounded-[1.75rem] border border-amber-400/30 bg-[#111827] text-white shadow-[0_0_60px_rgba(251,146,60,0.2)]"
              dir="rtl"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 sm:h-11 sm:w-11">
                      <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-100/80 sm:text-xs">Guide</p>
                      <h3 className="text-lg font-black sm:text-2xl">دليل الاستخدام</h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUsageModal(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg font-black transition hover:bg-white/20 sm:h-10 sm:w-10"
                    aria-label="إغلاق"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div
                className="gpa-guide-scroll max-h-[calc(85vh-96px)] min-h-0 space-y-4 overflow-y-auto p-4 pr-3 text-sm leading-7 text-slate-200 sm:p-6 sm:pr-5"
                style={{
                  WebkitOverflowScrolling: "touch",
                  overflowY: "auto",
                }}
              >
                <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-5">
                  <h4 className="mb-2 text-base font-black text-amber-300">كيف تستخدم الحاسبة؟</h4>
                  <p>
                    اختر السنة الدراسية أولاً، ثم أدخل علامة كل مادة في الخانة المخصصة لها. الحاسبة تجمع العلامات مع معامل المادة تلقائيًا وتظهر لك المعدل النهائي فوراً.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-5">
                  <h4 className="mb-2 text-base font-black text-amber-300">الحد المسموح به</h4>
                  <p>
                    الحد المسموح للتنزيل أو التصدير هو <span className="font-black text-white">2 تنزيلات</span> لكل سنة إذا لم يكن لديك اشتراك فعّال. إذا كان لديك اشتراك، يضاف إلى الحد عدد إضافي بحسب عدد الاشتراكات الفعالة.
                  </p>
                  <p className="mt-2 text-amber-200">
                    مثال: بدون اشتراك = 2 تنزيلات، مع اشتراك = 2 + 5 × عدد الاشتراكات.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-5">
                  <h4 className="mb-2 text-base font-black text-amber-300">كيفية الاشتراك</h4>
                  <p>
                    يمكنك الاشتراك من صفحة الملف الشخصي داخل قسم الاشتراكات، ثم اختيار نوع اشتراك المعدل المناسب. بعد الموافقة، ستتمكن من استخدام ميزات إضافية مثل التنزيلات المتعددة وحفظ النتيجات.
                  </p>
                </div>

                <div className="pt-1">
                  <Link
                    href="/profile?tab=subscription&subscriptionType=GPA"
                    onClick={() => setShowUsageModal(false)}
                    className="block w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-center font-black text-white shadow-lg shadow-amber-600/20 transition hover:brightness-110"
                  >
                    الاشتراك الآن
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
