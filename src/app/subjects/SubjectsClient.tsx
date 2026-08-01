"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BookOpen, Stethoscope, ArrowLeft, Dna, Activity, Brain, Bone, Eye, Heart, Search, X } from "lucide-react";
import { useLocale } from "@/context/LocaleProvider.client";

// Helper function to safely parse description JSON
function parseDescription(desc: string | null) {
  if (!desc) return { brief: "", content: "", videoUrl: "", iconName: "Stethoscope", links: [] };
  try {
    if (desc.trim().startsWith("{")) {
      const parsed = JSON.parse(desc);
      return {
        brief: parsed.brief || "",
        content: parsed.content || "",
        videoUrl: parsed.videoUrl || "",
        iconName: parsed.iconName || "Stethoscope",
        links: parsed.links || []
      };
    }
  } catch (e) {}
  return { brief: desc, content: "", videoUrl: "", iconName: "Stethoscope", links: [] };
}

// Helper function to map icon string to Lucide component
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = { 
    Stethoscope, Dna, Activity, Brain, Bone, Eye, BookOpen, Heart 
  };
  return icons[iconName] || Stethoscope;
};

// Helper function to get gradient colors based on index
const getCategoryGradient = (idx: number) => {
  const gradients = [
    "from-blue-500 to-cyan-400",
    "from-emerald-500 to-teal-400",
    "from-violet-500 to-purple-400",
    "from-rose-500 to-pink-400",
    "from-amber-500 to-orange-400",
    "from-indigo-500 to-blue-400",
  ];
  return gradients[idx % gradients.length];
};

export default function SubjectsClient({ categories }: { categories: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLocale();

  function SubjectHeader() {
    const { t } = useLocale();
    return (
      <>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
          {t("subjects_headline_part1", "Your guide to")} <span className="text-transparent bg-clip-text bg-gradient-to-l from-medical-600 to-blue-500">{t("subjects_headline_highlight", "specialties")}</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          {t("subjects_description", "Explore the world of medicine and its specialties. We carefully organized these sections to provide a clear educational path for every stage of your studies.")}
        </p>
      </>
    );
  }

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((cat) => {
      const parsed = parseDescription(cat.description);
      return (
        cat.name?.toLowerCase().includes(q) ||
        parsed.brief?.toLowerCase().includes(q) ||
        parsed.content?.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, categories]);

  return (
    <div className="relative min-h-screen py-20 overflow-hidden bg-slate-50 dark:bg-dark-bg">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-medical-400/20 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-1/2 -left-40 w-[30rem] h-[30rem] bg-blue-400/20 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse-slow [animation-delay:2s]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-dark-card shadow-xl shadow-medical-600/10 rounded-2xl mb-8 border border-slate-100 dark:border-slate-800 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Activity className="w-10 h-10 text-medical-600 dark:text-medical-400" />
          </div>
          <SubjectHeader />
        </motion.div>

        {/* ── Search Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
          dir="rtl"
        >
          <div className="relative group">
            {/* Glow ring on focus */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-medical-500/20 to-blue-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative flex items-center bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg shadow-slate-200/60 dark:shadow-black/20 overflow-hidden transition-all duration-300 group-focus-within:border-medical-400 dark:group-focus-within:border-medical-500 group-focus-within:shadow-xl">
              {/* Search Icon */}
              <div className="flex items-center justify-center w-14 h-14 shrink-0 text-slate-400 group-focus-within:text-medical-500 transition-colors">
                <Search className="w-5 h-5" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("subjects_search_placeholder", "Search for a specialty...")}
                className="flex-1 h-14 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 text-base font-medium outline-none pr-2"
                id="specialty-search"
                aria-label={t("subjects_search_aria", "Search for a specialty")}
                autoComplete="off"
              />

              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    key="clear-search"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    type="button"
                    title={t("subjects_clear_search", "Clear search")}
                    onClick={() => setSearchQuery("")}
                    className="flex items-center justify-center w-9 h-9 ml-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-medical-50 hover:text-medical-600 dark:hover:bg-medical-900/30 transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Results counter */}
          <AnimatePresence>
            {searchQuery && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-center mt-3 text-sm text-slate-500 dark:text-slate-400 font-medium"
              >
                {filteredCategories.length > 0
                  ? <>{t("subjects_results_found_prefix", "Found")} <span className="text-medical-600 dark:text-medical-400 font-black">{filteredCategories.length}</span> {filteredCategories.length === 1 ? t("subjects_singular", "specialty") : t("subjects_plural", "specialties")} {t("subjects_results_found_suffix", "for")} «<span className="text-slate-700 dark:text-slate-300 font-bold">{searchQuery}</span>»</>
                  : <>{t("subjects_no_results_for", "No results for")} «<span className="text-slate-700 dark:text-slate-300 font-bold">{searchQuery}</span>»</>
                }
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Cards Grid ── */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((cat, idx) => {
              const parsed = parseDescription(cat.description);
              const Icon = getIconComponent(parsed.iconName);
              const gradient = getCategoryGradient(idx);

              return (
                <motion.div
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Link 
                    href={`/subjects/${cat.slug}`}
                    className="group relative block bg-white dark:bg-dark-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden"
                  >
                    {/* Glowing Hover Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    {/* Top Bar with Icon and Stats */}
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-medical-50 group-hover:text-medical-600 transition-colors">
                          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 text-right">
                      <h3 className="text-3xl font-extrabold mb-4 text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-l group-hover:from-medical-600 group-hover:to-blue-500 transition-all">
                        {cat.name}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {parsed.brief || t("subjects_fallback_brief","A complete educational path containing all references, explanations, and academic videos designed especially for students of this specialty.")}
                      </p>
                    </div>

                    {/* Decorative faint icon in background */}
                    <Icon className="absolute -bottom-10 -left-10 w-48 h-48 text-slate-50 dark:text-slate-800/50 opacity-0 group-hover:opacity-100 transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none" />
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* No results state */}
          {filteredCategories.length === 0 && searchQuery && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full text-center py-24 bg-white dark:bg-dark-card rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-700 shadow-sm"
            >
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-700 dark:text-slate-300">{t("subjects_no_results_title", "No results")}</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">{t("subjects_no_results_msg", "No specialty matches")} «<span className="font-bold text-slate-700 dark:text-slate-300">{searchQuery}</span>»</p>
              <button onClick={() => setSearchQuery("")} className="inline-flex items-center gap-2 px-6 py-3 bg-medical-600 text-white font-bold rounded-xl hover:bg-medical-700 transition-colors shadow-lg shadow-medical-600/25">
                <X className="w-4 h-4" />
                {t("subjects_clear_search", "Clear search")}
              </button>
            </motion.div>
          )}

          {/* Empty state (no categories at all) */}
          {categories.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-24 bg-white dark:bg-dark-card rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-700 shadow-sm"
            >
              <div className="w-24 h-24 bg-medical-50 dark:bg-medical-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-12 h-12 text-medical-600" />
              </div>
              <h3 className="text-3xl font-bold mb-4">{t("subjects_empty_title", "Medical specialties section")}</h3>
              <p className="text-xl text-slate-500 max-w-lg mx-auto">{t("subjects_empty_description", "Detailed medical specialties will be added to this section soon.")}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
