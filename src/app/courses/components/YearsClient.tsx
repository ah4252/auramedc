"use client";

import { useEffect, useState } from "react";
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
  canViewQcms = true,
  canViewDeveloperQcms = false,
}: { 
  yearCategories: any[]; 
  pharmacyCategories: PharmacySection[]; 
  qcmsYears?: any[];
  devFeaturedYears?: any[];
  canViewPharmacy?: boolean;
  canViewQcms?: boolean;
  canViewDeveloperQcms?: boolean;
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

  const yearsContentKey = `${devMode ? "dev" : "qcm"}-${selectedDevYearId ?? "none"}-${selectedDevSubjectId ?? "none"}-${selectedQcmsYearId ?? "none"}-${selectedQcmsSubjectId ?? "none"}`;
  const qcmsViewKey = `${devMode ? "dev" : "qcm"}-${selectedDevYearId ?? "none"}-${selectedDevSubjectId ?? "none"}-${selectedQcmsYearId ?? "none"}-${selectedQcmsSubjectId ?? "none"}`;



  const filteredPharmacy = pharmacyCategories.filter(s =>
    s.name.toLowerCase().includes(pharmacySearch.toLowerCase()) ||
    (s.description || "").toLowerCase().includes(pharmacySearch.toLowerCase())
  );

  const selectedQcmsYear = qcmsYears.find((y: any) => y.id === selectedQcmsYearId) || null;
  const selectedQcmsSubject = selectedQcmsYear?.subjects?.find((s: any) => s.id === selectedQcmsSubjectId) || null;

  const selectedDevYear = devFeaturedYears.find((y: any) => y.id === selectedDevYearId) || null;
  const selectedDevSubject = selectedDevYear?.subjects?.find((s: any) => s.id === selectedDevSubjectId) || null;

  const localeText = (ar: string, fr: string, en: string) => (lang === "ar" ? ar : lang === "fr" ? fr : en);

  const syncQcmHistory = (next: {
    devMode: boolean;
    selectedQcmsYearId: string | null;
    selectedQcmsSubjectId: string | null;
    selectedDevYearId: string | null;
    selectedDevSubjectId: string | null;
  }) => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    url.searchParams.set("tab", "qcms");

    if (next.devMode) {
      url.searchParams.set("devMode", "1");
    } else {
      url.searchParams.delete("devMode");
    }

    if (next.selectedQcmsYearId) {
      url.searchParams.set("qcmsYearId", next.selectedQcmsYearId);
    } else {
      url.searchParams.delete("qcmsYearId");
    }

    if (next.selectedQcmsSubjectId) {
      url.searchParams.set("qcmsSubjectId", next.selectedQcmsSubjectId);
    } else {
      url.searchParams.delete("qcmsSubjectId");
    }

    if (next.selectedDevYearId) {
      url.searchParams.set("devYearId", next.selectedDevYearId);
    } else {
      url.searchParams.delete("devYearId");
    }

    if (next.selectedDevSubjectId) {
      url.searchParams.set("devSubjectId", next.selectedDevSubjectId);
    } else {
      url.searchParams.delete("devSubjectId");
    }

    window.history.pushState({ qcmsState: next }, "", `${url.pathname}${url.search}`);
  };

  const scrollQcmToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const applyQcmNavigationState = (next: {
    devMode: boolean;
    selectedQcmsYearId: string | null;
    selectedQcmsSubjectId: string | null;
    selectedDevYearId: string | null;
    selectedDevSubjectId: string | null;
  }) => {
    setDevMode(next.devMode);
    setSelectedQcmsYearId(next.selectedQcmsYearId);
    setSelectedQcmsSubjectId(next.selectedQcmsSubjectId);
    setSelectedDevYearId(next.selectedDevYearId);
    setSelectedDevSubjectId(next.selectedDevSubjectId);
    syncQcmHistory(next);
    setTimeout(() => scrollQcmToTop(), 80);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const restoreQcmStateFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const hasDevMode = params.get("devMode") === "1";
      const nextQcmsYearId = params.get("qcmsYearId");
      const nextQcmsSubjectId = params.get("qcmsSubjectId");
      const nextDevYearId = params.get("devYearId");
      const nextDevSubjectId = params.get("devSubjectId");

      setDevMode(hasDevMode);
      setSelectedQcmsYearId(nextQcmsYearId);
      setSelectedQcmsSubjectId(nextQcmsSubjectId);
      setSelectedDevYearId(nextDevYearId);
      setSelectedDevSubjectId(nextDevSubjectId);
    };

    restoreQcmStateFromUrl();
    window.addEventListener("popstate", restoreQcmStateFromUrl);

    return () => {
      window.removeEventListener("popstate", restoreQcmStateFromUrl);
    };
  }, []);

  const devHeroBadge = localeText("اختبارات المطور المميزة", "Tests du développeur", "Developer-created tests");
  const devHeroTitle = localeText("اختبارات أنشأها المطور", "Tests créés par le développeur", "Developer-created tests");
  const devHeroDescription = localeText("مجموعة مختارة من الاختبارات ونماذج التقييم الطبي التي أعدها مطورو المنصة.", "Collection sélectionnée de tests et de modèles d'évaluation médicale préparés par les développeurs de la plateforme.", "A curated collection of medical tests and assessment models prepared by the platform developers.");
  const devExclusiveLabel = localeText("محتوى خاص ومعتمد", "Contenu exclusif approuvé", "Exclusive approved content");
  const devYearCoverageLabel = localeText("تغطية مخصصة للسنوات", "Couverture adaptée aux années d'étude", "Coverage tailored to study years");
  const devSectionLabel = localeText("اختبارات المطور", "Tests du développeur", "Developer tests");

  const devRemainingText = (remaining: number) => localeText(
    `تبقى لك ${remaining} ملف${remaining === 1 ? "" : "ات"} من 5`,
    `Il reste ${remaining} fichier${remaining === 1 ? "" : "s"} sur 5`,
    `${remaining} files remaining out of 5`
  );


  const devBreadcrumbLabel = localeText("اختبارات أنشأها المطور", "Tests créés par le développeur", "Developer-created tests");
  const devBrowseLabel = localeText("تصفح الاختبارات المميزة", "Parcourir les tests premium", "Browse premium tests");
  const devSubjectStream = localeText("نماذج الاختبارات المتاحة", "Modèles d'examens disponibles", "Available developer exam models");
  const devStartNow = localeText("ابدأ الاختبار الآن", "Commencer l'examen maintenant", "Start developer exam now");
  const devEmptySubject = localeText("لا توجد اختبارات منشأة من المطور لهذه المادة بعد.", "Aucun test créé par le développeur n'est disponible pour cette matière pour le moment.", "No developer-created tests are available for this subject yet.");
  const devEmptySubjectDesc = localeText("سيتم إضافة النماذج الحصرية فور نشرها من لوحة التحكم.", "Les modèles exclusifs seront ajoutés dès leur publication depuis le panneau d'administration.", "Exclusive models will be added as soon as they are published from the admin panel.");
  const devSelectSubjectText = localeText("اختر المادة للوصول إلى الاختبارات التي أنشأها المطور.", "Choisissez la matière pour accéder aux tests créés par le développeur.", "Choose the subject to access the developer-created tests.");
  const devAvailableSubjects = localeText("المواد المتاحة", "Matières disponibles", "Available subjects");
  const devTestCount = localeText("اختبارات المطور", "Tests du développeur", "Developer tests");
  const devOpenTests = localeText("فتح الاختبارات", "Ouvrir les tests", "Open tests");
  const devNoSubjectsYear = localeText("لا توجد مواد ذات اختبارات مطور لهذه السنة بعد.", "Aucune matière avec tests du développeur n'est disponible pour cette année pour le moment.", "No subjects with developer tests are available for this year yet.");
  const devYearsTitle = localeText("سنوات الدراسة التي تحتوي على اختبارات المطور", "Années d'étude avec tests du développeur", "Study years with developer tests");
  const devYearsCount = localeText("سنوات متاحة", "années disponibles", "available years");
  const devYearBadge = localeText("اختبارات المطور", "Tests du développeur", "Developer tests");
  const devSubjectsCount = localeText("مواد ذات اختبارات حصرية", "matières avec tests exclusifs", "Subjects with exclusive tests");
  const devViewMaterials = localeText("استعراض المواد والاختبارات", "Parcourir les matières et les tests", "Browse subjects and tests");
  const devNoYearsYet = localeText("لا توجد اختبارات منشأة من المطور مميزة بعد.", "Aucun test créé par le développeur n'a encore été marqué.", "No developer-created tests have been marked yet.");
  const devNoYearsHint = localeText("يمكن تمييز الاختبارات بنجمة ⭐ في لوحة التحكم ليظهر هذا القسم فوراً.", "Vous pouvez marquer les tests avec l'étoile ⭐ dans le panneau d'administration pour les afficher ici immédiatement.", "You can mark tests with the star icon in the admin panel to display them here immediately.");

  const normalizeDrivePreviewUrl = (rawUrl: string | null | undefined) => {
    const value = (rawUrl || "").trim();
    if (!value) return "";

    const clean = value.replace(/&amp;/g, "&");
    const directFileMatch = clean.match(/\/file\/d\/([^\/\?]+)/i);
    if (directFileMatch?.[1]) {
      return `https://drive.google.com/file/d/${directFileMatch[1]}/preview`;
    }

    const idMatch = clean.match(/[?&]id=([^&]+)/i);
    if (idMatch?.[1]) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }

    return clean;
  };

  const getFriendlyLinkLabel = (label?: string | null, url?: string | null) => {
    const rawLabel = (label || "").trim();
    const safeUrl = normalizeDrivePreviewUrl(url);

    if (rawLabel && !/^https?:\/\//i.test(rawLabel)) {
      return rawLabel;
    }

    if (!safeUrl) {
      return localeText("رابط الامتحان", "Lien d'examen", "Exam link");
    }

    try {
      const parsed = new URL(safeUrl);
      if (parsed.hostname.includes("drive.google.com")) return "Google Drive File";
      return parsed.hostname.replace(/^www\./i, "");
    } catch {
      return localeText("رابط الامتحان", "Lien d'examen", "Exam link");
    }
  };

  const handleStandardExamLinkClick = async (event: any) => {
    event.preventDefault();
    window.open(event.currentTarget.href, "_blank", "noopener,noreferrer");
  };

  const handleDeveloperExamLinkClick = async (event: any) => {
    event.preventDefault();
    window.open(event.currentTarget.href, "_blank", "noopener,noreferrer");
  };

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
            style={{ touchAction: "auto", overscrollBehavior: "contain" }}
          >
            <div className="mx-auto max-w-7xl overflow-hidden rounded-[3rem] border border-violet-500/25 bg-gradient-to-b from-[#08111e] via-[#0a1628] to-[#060c16] text-white shadow-[0_0_80px_-20px_rgba(139,92,246,0.3)] backdrop-blur-2xl">
              <motion.div
                key={qcmsViewKey}
                initial={{ opacity: 0, x: isRtl ? 20 : -20, scale: 0.985 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: isRtl ? -18 : 18, scale: 0.985 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className={`grid gap-0 ${selectedQcmsSubject ? "lg:grid-cols-1" : "lg:grid-cols-[1.18fr_0.82fr]"}`}
              >
                
                {/* Main Content Area */}
                <div className="relative p-6 sm:p-10 lg:p-12 xl:p-14" style={{ touchAction: "auto", overscrollBehavior: "contain" }}>
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.09),transparent_42%),radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.08),transparent_40%)]" />
                  
                  <div className="relative z-10">
                    
                    {/* TOP NAVIGATION BREADCRUMBS BAR */}
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/90 pb-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400">
                        <button
                          onClick={() => {
                            if (devMode) {
                              applyQcmNavigationState({
                                devMode: false,
                                selectedQcmsYearId: null,
                                selectedQcmsSubjectId: null,
                                selectedDevYearId: null,
                                selectedDevSubjectId: null,
                              });
                            } else {
                              applyQcmNavigationState({
                                devMode: false,
                                selectedQcmsYearId: null,
                                selectedQcmsSubjectId: null,
                                selectedDevYearId: null,
                                selectedDevSubjectId: null,
                              });
                            }
                          }}
                          className="flex items-center gap-1.5 hover:text-violet-300 transition-colors"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                          <span>{localeText("مركز QCMs الطبي", "Centre QCM médical", "QCM Center")}</span>
                        </button>

                        {devMode && (
                          <>
                            <ChevronRight className={`h-3.5 w-3.5 text-slate-600 ${isRtl ? "rotate-180" : ""}`} />
                            <button
                              onClick={() => {
                                applyQcmNavigationState({
                                  devMode: true,
                                  selectedQcmsYearId: null,
                                  selectedQcmsSubjectId: null,
                                  selectedDevYearId: null,
                                  selectedDevSubjectId: null,
                                });
                              }}
                              className="text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-1"
                            >
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>{devBreadcrumbLabel}</span>
                            </button>
                          </>
                        )}

                        {devMode && selectedDevYear && (
                          <>
                            <ChevronRight className={`h-3.5 w-3.5 text-slate-600 ${isRtl ? "rotate-180" : ""}`} />
                            <button
                              onClick={() =>
                                applyQcmNavigationState({
                                  devMode: true,
                                  selectedQcmsYearId: null,
                                  selectedQcmsSubjectId: null,
                                  selectedDevYearId: selectedDevYearId,
                                  selectedDevSubjectId: null,
                                })
                              }
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
                              onClick={() =>
                                applyQcmNavigationState({
                                  devMode: false,
                                  selectedQcmsYearId: selectedQcmsYearId,
                                  selectedQcmsSubjectId: null,
                                  selectedDevYearId: null,
                                  selectedDevSubjectId: null,
                                })
                              }
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
                                applyQcmNavigationState({
                                  devMode: true,
                                  selectedQcmsYearId: null,
                                  selectedQcmsSubjectId: null,
                                  selectedDevYearId: selectedDevYearId,
                                  selectedDevSubjectId: null,
                                });
                              } else if (selectedDevYear) {
                                applyQcmNavigationState({
                                  devMode: true,
                                  selectedQcmsYearId: null,
                                  selectedQcmsSubjectId: null,
                                  selectedDevYearId: null,
                                  selectedDevSubjectId: null,
                                });
                              } else {
                                applyQcmNavigationState({
                                  devMode: false,
                                  selectedQcmsYearId: null,
                                  selectedQcmsSubjectId: null,
                                  selectedDevYearId: null,
                                  selectedDevSubjectId: null,
                                });
                              }
                            } else {
                              if (selectedQcmsSubject) {
                                applyQcmNavigationState({
                                  devMode: false,
                                  selectedQcmsYearId: selectedQcmsYearId,
                                  selectedQcmsSubjectId: null,
                                  selectedDevYearId: null,
                                  selectedDevSubjectId: null,
                                });
                              } else {
                                applyQcmNavigationState({
                                  devMode: false,
                                  selectedQcmsYearId: null,
                                  selectedQcmsSubjectId: null,
                                  selectedDevYearId: null,
                                  selectedDevSubjectId: null,
                                });
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
                              ? (selectedDevSubject ? localeText("العودة لمواد السنة", "Retour aux matières", "Back to Subjects") : selectedDevYear ? localeText("العودة للسنوات", "Retour aux années", "Back to Years") : localeText("العودة للمركز", "Retour au centre", "Back to Hub"))
                              : (selectedQcmsSubject ? localeText("العودة لمواد السنة", "Retour aux matières", "Back to Subjects") : localeText("العودة للسنوات الدراسية", "Retour aux années", "Back to Years"))}
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
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-50 text-amber-700 shadow-inner dark:bg-amber-500/15 dark:text-amber-300 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em]">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span>{devHeroBadge}</span>
                        </div>

                        <h2 className="mb-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-500 dark:from-amber-300 dark:via-yellow-200 dark:to-amber-500">
                          {devHeroTitle}
                        </h2>
                        
                        <p className="text-base leading-8 text-slate-700 dark:text-amber-100/80 font-medium">
                          {devHeroDescription}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2.5">
                          <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-100/80 px-4 py-2 text-xs font-bold text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-300">
                            <Crown className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                            {devExclusiveLabel}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-xl border border-yellow-300 bg-yellow-100/80 px-4 py-2 text-xs font-bold text-yellow-700 dark:border-yellow-400/30 dark:bg-yellow-500/10 dark:text-yellow-300">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {devYearCoverageLabel}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* ========================================================================= */}
                    {/* DEV MODE LEVEL 3: EXAM DASHBOARD VIEW (Selected Dev Subject)              */}
                    {/* ========================================================================= */}
                    {devMode && selectedDevSubject ? (
                      <div className="rounded-[2.5rem] border border-amber-300 bg-[#fffaf3] p-6 sm:p-10 shadow-2xl shadow-amber-200/40 dark:border-amber-500/30 dark:bg-[#140e02]/95 dark:shadow-amber-950/30">
                        {/* Subject Header Banner */}
                        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between border-b border-amber-200 pb-6 dark:border-amber-500/20">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-2 dark:text-amber-400">
                              <span>{selectedDevYear?.name}</span>
                              <ChevronRight className={`h-3 w-3 ${isRtl ? "rotate-180" : ""}`} />
                              <span>{devSectionLabel}</span>
                            </div>
                            <h3 className="text-3xl font-black text-amber-900 sm:text-4xl dark:text-amber-100">{selectedDevSubject.name}</h3>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="rounded-2xl border border-amber-300 bg-amber-100 px-4 py-2 text-xs font-black text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-200">
                              {selectedDevSubject.code || "DEV-QCM"}
                            </span>
                            <span className="rounded-2xl border border-yellow-300 bg-yellow-100 px-4 py-2 text-xs font-black text-yellow-700 flex items-center gap-1.5 dark:border-yellow-400/30 dark:bg-yellow-500/15 dark:text-yellow-300">
                              <Star className="w-3.5 h-3.5 fill-yellow-400" />
                              {(selectedDevSubject.examLinks || []).length} {localeText("اختبارات مطور", "tests développeur", "Dev exams")}
                            </span>
                          </div>
                        </div>

                        {/* Exam Cards Grid */}
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xl font-black text-amber-800 flex items-center gap-2.5 dark:text-amber-200">
                              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                              <span>{devSubjectStream}</span>
                            </h4>
                          </div>



                          {(selectedDevSubject.examLinks || []).length > 0 ? (
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                              {(selectedDevSubject.examLinks || []).map((link: any, idx: number) => (
                                <div
                                  key={link.id}
                                  className="group relative flex flex-col justify-between rounded-3xl border border-amber-200 bg-gradient-to-b from-[#fffaf0] to-[#fef3c7] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/60 hover:shadow-2xl hover:shadow-amber-500/20 dark:border-amber-500/30 dark:from-[#211603] dark:to-[#120c01]"
                                  onClick={() => scrollQcmToTop()}
                                >
                                  <div>
                                    <div className="mb-4 flex items-center justify-between">
                                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 to-yellow-100 text-amber-700 group-hover:scale-110 transition-all border border-amber-300 dark:from-amber-500/30 dark:to-yellow-500/20 dark:text-amber-300 dark:border-amber-500/30">
                                        <Star className="h-5.5 w-5.5 fill-amber-400 text-amber-400" />
                                      </div>
                                      <span className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-700 dark:border-amber-500/30 dark:bg-amber-950/80 dark:text-amber-300">
                                        DEV #{idx + 1}
                                      </span>
                                    </div>

                                    <h5 className="my-3 text-lg font-black leading-snug text-amber-900 group-hover:text-yellow-700 transition-colors dark:text-amber-100 dark:group-hover:text-yellow-200">
                                      {link.label}
                                    </h5>
                                  </div>

                                  <div className="mt-6 pt-4 border-t border-amber-200 dark:border-amber-500/20">
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      onClick={handleDeveloperExamLinkClick}
                                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 py-3.5 px-4 text-xs font-black text-slate-950 shadow-lg shadow-amber-600/30 transition-all hover:scale-[1.02] hover:shadow-amber-500/50 active:scale-[0.98]"
                                    >
                                      <span>{devStartNow}</span>
                                      <ChevronRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-3xl border border-dashed border-amber-300 bg-amber-50 p-12 text-center dark:border-amber-500/30 dark:bg-amber-950/30">
                              <Star className="h-14 w-14 text-amber-600 mx-auto mb-4" />
                              <h5 className="text-lg font-black text-amber-800 dark:text-amber-200">
                                {devEmptySubject}
                              </h5>
                              <p className="text-xs text-amber-700/75 mt-2 font-medium dark:text-amber-400/60">
                                {devEmptySubjectDesc}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                    ) : devMode && selectedDevYear ? (
                      <div className="mt-4">
                        <div className="mb-8 rounded-3xl border border-amber-300 bg-gradient-to-r from-[#fff7ed] via-[#fff1d6] to-[#fef3c7] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-xl dark:border-amber-500/30 dark:from-[#201402] dark:via-[#2c1b03] dark:to-[#180f01]">
                          <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-1 dark:text-amber-400">
                              <Crown className="h-4 w-4" />
                              <span>{localeText(`اختبارات المطور — ${selectedDevYear.name}`, `Tests du développeur — ${selectedDevYear.name}`, `Developer tests — ${selectedDevYear.name}`)}</span>
                            </div>
                            <h3 className="text-3xl font-black text-amber-900 sm:text-4xl dark:text-amber-100">{selectedDevYear.name}</h3>
                            <p className="mt-1 text-xs font-bold text-amber-700/80 dark:text-amber-200/70">
                              {devSelectSubjectText}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="rounded-2xl border border-amber-300 bg-amber-100 px-5 py-3 text-center dark:border-amber-500/40 dark:bg-amber-950/80">
                              <p className="text-2xl font-black text-amber-700 dark:text-amber-300">{selectedDevYear.subjects?.length || 0}</p>
                              <p className="text-[10px] font-bold text-amber-700/80 dark:text-amber-400/80">{localeText("مواد ذات اختبارات خاصة", "Matières avec tests spéciaux", "Subjects with special tests")}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-black text-amber-800 flex items-center gap-2 dark:text-amber-200">
                            <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            <span>{devAvailableSubjects}</span>
                          </h4>

                          {selectedDevYear.subjects?.length ? (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                              {selectedDevYear.subjects.map((subject: any) => (
                                <button
                                  key={subject.id}
                                  onClick={() =>
                                    applyQcmNavigationState({
                                      devMode: true,
                                      selectedQcmsYearId: null,
                                      selectedQcmsSubjectId: null,
                                      selectedDevYearId: selectedDevYearId,
                                      selectedDevSubjectId: subject.id,
                                    })
                                  }
                                  className="group relative flex flex-col justify-between rounded-3xl border border-amber-200 bg-[#fffaf3] p-6 text-start shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400 hover:bg-[#fff1d6] hover:shadow-2xl hover:shadow-amber-500/20 dark:border-amber-500/30 dark:bg-[#160f02] dark:hover:bg-[#201503]"
                                >
                                  <div>
                                    <div className="mb-5 flex items-center justify-between">
                                      <span className="rounded-xl border border-amber-300 bg-amber-100 px-3 py-1 text-[11px] font-black text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-300">
                                        {subject.code || "DEV"}
                                      </span>
                                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all dark:bg-amber-500/20 dark:text-amber-300">
                                        <Star className="h-5 w-5 fill-current" />
                                      </div>
                                    </div>

                                    <h4 className="text-xl font-black text-amber-900 group-hover:text-yellow-700 transition-colors leading-tight dark:text-amber-100 dark:group-hover:text-yellow-200">
                                      {subject.name}
                                    </h4>
                                  </div>

                                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-amber-200 dark:border-amber-500/20">
                                    <span className="text-xs font-bold text-amber-700/80 dark:text-amber-300/80">
                                      {(subject.examLinks || []).length} {devTestCount}
                                    </span>
                                    <span className="text-xs font-black text-amber-700 flex items-center gap-1 group-hover:gap-2 transition-all dark:text-amber-400">
                                      <span>{devOpenTests}</span>
                                      <ChevronRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-3xl border border-dashed border-amber-300 bg-amber-50 p-12 text-center text-amber-700/80 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-400/70">
                              <BookOpen className="h-14 w-14 text-amber-600 mx-auto mb-3" />
                              <p className="text-base font-bold">{devNoSubjectsYear}</p>
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
                          <h3 className="text-xl font-black text-amber-800 flex items-center gap-2.5 dark:text-amber-200">
                            <Crown className="h-5.5 w-5.5 text-amber-600 dark:text-amber-400" />
                            <span>{devYearsTitle}</span>
                          </h3>
                          <span className="text-xs font-bold text-amber-700/80 dark:text-amber-400/80">
                            {(devFeaturedYears || []).length} {devYearsCount}
                          </span>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                          {(devFeaturedYears || []).map((year: any, idx: number) => {
                            const totalDevExams = (year.subjects || []).reduce((acc: number, s: any) => acc + (s.examLinks || []).length, 0);
                            return (
                              <button
                                key={year.id}
                                onClick={() => {
                                  applyQcmNavigationState({
                                    devMode: true,
                                    selectedQcmsYearId: null,
                                    selectedQcmsSubjectId: null,
                                    selectedDevYearId: year.id,
                                    selectedDevSubjectId: null,
                                  });
                                }}
                                className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[2.2rem] border border-amber-300 bg-gradient-to-br from-[#fffaf0] via-[#fff1d6] to-[#fef3c7] p-7 text-start shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/30 dark:border-amber-500/40 dark:from-[#1a1202] dark:via-[#241804] dark:to-[#120c01]"
                              >
                                <div className="relative z-10 flex items-center justify-between gap-3">
                                  <span className="rounded-xl border border-amber-300 bg-amber-100 px-3.5 py-1.5 text-xs font-black text-amber-700 flex items-center gap-1.5 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300">
                                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                                    {totalDevExams} {devYearBadge}
                                  </span>
                                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 to-yellow-100 text-amber-700 border border-amber-300 shadow-inner group-hover:scale-110 transition-all dark:from-amber-500/30 dark:to-yellow-500/20 dark:text-amber-300 dark:border-amber-500/30">
                                    <Crown className="h-6 w-6" />
                                  </div>
                                </div>

                                <div className="relative z-10 mt-6">
                                  <h4 className="text-2xl font-black leading-tight text-amber-900 group-hover:text-yellow-700 transition-colors dark:text-amber-100 dark:group-hover:text-yellow-200">
                                    {year.name}
                                  </h4>
                                  <p className="mt-2 text-xs font-bold text-amber-700/80 dark:text-amber-400/70">
                                    {year.subjects?.length || 0} {devSubjectsCount}
                                  </p>
                                </div>

                                <div className="relative z-10 mt-6 flex items-center justify-between pt-4 border-t border-amber-200 dark:border-amber-500/20">
                                  <span className="text-xs font-black text-amber-700 group-hover:text-yellow-700 transition-colors dark:text-amber-400 dark:group-hover:text-yellow-300">
                                    {devViewMaterials}
                                  </span>
                                  <ChevronRight className={`h-4 w-4 text-amber-700 transition-transform dark:text-amber-400 ${isRtl ? "rotate-180 group-hover:-translate-x-1.5" : "group-hover:translate-x-1.5"}`} />
                                </div>
                              </button>
                            );
                          })}

                          {(!devFeaturedYears || devFeaturedYears.length === 0) && (
                            <div className="rounded-3xl border border-dashed border-amber-300 bg-amber-50 p-12 text-center text-amber-700 md:col-span-2 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-400">
                              <Star className="h-14 w-14 text-amber-600 mx-auto mb-3" />
                              <p className="text-base font-bold">{devNoYearsYet}</p>
                              <p className="text-xs text-amber-700/75 mt-2 dark:text-amber-400/60">
                                {devNoYearsHint}
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
                              <span>{localeText("بنك امتحانات المادة", "Banque d'examens de la matière", "Exams Bank")}</span>
                            </div>
                            <h3 className="text-3xl font-black text-white sm:text-4xl">{selectedQcmsSubject.name}</h3>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="rounded-2xl border border-violet-400/30 bg-violet-500/15 px-4 py-2 text-xs font-black text-violet-200">
                              {selectedQcmsSubject.code || "QCM"}
                            </span>
                            <span className="rounded-2xl border border-cyan-400/30 bg-cyan-500/15 px-4 py-2 text-xs font-black text-cyan-200">
                              {(selectedQcmsSubject.examLinks || []).length} {localeText("امتحان متاح", "examens disponibles", "Exams")}
                            </span>
                          </div>
                        </div>

                        {/* Exam Cards Grid */}
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xl font-black text-white flex items-center gap-2.5">
                              <NotebookPen className="h-5 w-5 text-violet-400" />
                              <span>{localeText("قائمة نماذج الامتحانات المتاحة", "Liste des modèles d'examens disponibles", "Available Exam Papers")}</span>
                            </h4>
                          </div>

                          {qcmRemaining !== null && qcmRemaining >= 0 && (
                            <div className="mb-5 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm font-black text-violet-200" dir="rtl">
                              {devRemainingText(qcmRemaining)}
                            </div>
                          )}

                          {(selectedQcmsSubject.examLinks || []).length > 0 ? (
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                              {(selectedQcmsSubject.examLinks || []).map((link: any, idx: number) => {
                                const safeUrl = normalizeDrivePreviewUrl(link?.url);
                                const displayLabel = getFriendlyLinkLabel(link?.label, safeUrl);

                                return (
                                  <div
                                    key={link.id}
                                    className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-gradient-to-b from-[#102138] to-[#0c182b] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-400/50 hover:shadow-2xl hover:shadow-violet-500/20"
                                    onClick={() => scrollQcmToTop()}
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
                                        {displayLabel}
                                      </h5>
                                    </div>

                                    {/* Bottom Action CTA Button */}
                                    <div className="mt-6 pt-4 border-t border-slate-800/80">
                                      <a
                                        href={safeUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={handleStandardExamLinkClick}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 py-3.5 px-4 text-xs font-black text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] hover:shadow-violet-600/50 active:scale-[0.98]"
                                      >
                                        <span>{localeText("بدء الامتحان الآن", "Commencer l'examen maintenant", "Start Exam Now")}</span>
                                        <ChevronRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
                                      </a>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            /* Empty Exam Links State */
                            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-12 text-center">
                              <NotebookPen className="h-14 w-14 text-slate-600 mx-auto mb-4" />
                              <h5 className="text-lg font-black text-slate-300">
                                {localeText("لا توجد روابط امتحانات لهذا المساق حالياً", "Aucun document d'examen disponible pour ce cours pour le moment.", "No exam papers available for this subject yet.")}
                              </h5>
                              <p className="text-xs text-slate-500 mt-2 font-medium">
                                {localeText("سيتم رفع النماذج الجديدة فور اعتمادها من قبل الإدارة.", "Les nouveaux modèles seront ajoutés dès leur validation par l'administration.", "Exams will be uploaded soon.")}
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
                                  onClick={() =>
                                    applyQcmNavigationState({
                                      devMode: false,
                                      selectedQcmsYearId: selectedQcmsYearId,
                                      selectedQcmsSubjectId: subject.id,
                                      selectedDevYearId: null,
                                      selectedDevSubjectId: null,
                                    })
                                  }
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
                                  applyQcmNavigationState({
                                    devMode: false,
                                    selectedQcmsYearId: year.id,
                                    selectedQcmsSubjectId: null,
                                    selectedDevYearId: null,
                                    selectedDevSubjectId: null,
                                  });
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


                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SIDEBAR DASHBOARD OVERVIEW PANEL (Visible when no subject selected) */}
                {!selectedQcmsSubject && (
                  <aside className="relative overflow-visible border-t border-slate-800 bg-[#060e19] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10" style={{ touchAction: "auto", overscrollBehavior: "contain" }}>
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.08),transparent_58%)]" />
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

                          {!devMode && (
                            <div className="mt-4">
                              <button
                                onClick={() => {
                                  if (!canViewDeveloperQcms) {
                                    setShowQcmLockModal(true);
                                    return;
                                  }
                                  applyQcmNavigationState({
                                    devMode: true,
                                    selectedQcmsYearId: null,
                                    selectedQcmsSubjectId: null,
                                    selectedDevYearId: null,
                                    selectedDevSubjectId: null,
                                  });
                                }}
                                className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl p-4 text-start shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-500/20"
                                style={{
                                  background: "linear-gradient(135deg, #1a1200 0%, #2d1f00 50%, #1a1200 100%)",
                                  border: "1px solid rgba(245,158,11,0.4)",
                                }}
                              >
                                {/* Shimmer */}
                                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                  style={{
                                    background: "linear-gradient(105deg, transparent 30%, rgba(255,215,0,0.08) 50%, transparent 70%)",
                                    backgroundSize: "200% 100%",
                                    animation: "shimmer 2s infinite"
                                  }}
                                />
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                                  style={{
                                    background: "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(251,191,36,0.15))",
                                    border: "1px solid rgba(245,158,11,0.4)"
                                  }}
                                >
                                  <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-black leading-tight text-amber-200">
                                    {devBreadcrumbLabel}
                                  </h4>
                                  <p className="mt-1 text-[10px] font-bold text-amber-500/80">
                                    {devBrowseLabel}
                                  </p>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Medical Study Tip Box */}
                      <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-cyan-500/10 p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <GraduationCap className="h-5 w-5 text-violet-400" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-white">{localeText("نصيحة المراجعة الطبية", "Conseil d'examen", "EXAM TIP")}</h4>
                        </div>
                        <p className="text-xs font-medium leading-relaxed text-slate-300">
                          {localeText(
                            "يُنصح بحل نماذج الـ QCMs بانتظام بعد دراسة كل موضوع لتعزيز التذكر طويل المدى.",
                            "Résoudre régulièrement des sujets d'examen QCM après avoir étudié chaque sujet pour renforcer la mémoire à long terme.",
                            "Solve QCM exam papers regularly after studying each topic to reinforce long-term recall."
                          )}
                        </p>
                      </div>

                    </div>
                  </aside>
                )}
              </motion.div>
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
