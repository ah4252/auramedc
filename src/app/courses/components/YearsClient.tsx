"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, Sparkles, ChevronRight, FlaskConical, Search, Pill, Layers, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  pharmacyCategories 
}: { 
  yearCategories: any[]; 
  pharmacyCategories: PharmacySection[]; 
}) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "pharmacy" ? "pharmacy" : "years";
  const [activeTab, setActiveTab] = useState<"years" | "pharmacy">(initialTab);
  const [pharmacySearch, setPharmacySearch] = useState("");

  const filteredPharmacy = pharmacyCategories.filter(s =>
    s.name.toLowerCase().includes(pharmacySearch.toLowerCase()) ||
    (s.description || "").toLowerCase().includes(pharmacySearch.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-16">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-medical-500/10 text-medical-600 dark:text-medical-400 text-xs font-black uppercase tracking-widest mb-6"
        >
          <Sparkles className="w-4 h-4" />
          بوابة التعليم الطبي النخبوية
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black mb-6 text-slate-900 dark:text-white leading-tight"
        >
          {activeTab === "years" ? (
            <>اختر <span className="text-transparent bg-clip-text bg-gradient-to-l from-medical-600 to-medical-400">سنتك الدراسية</span></>
          ) : (
            <>دليل <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 via-teal-500 to-emerald-400">الأقسام الصيدلانية</span></>
          )}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-500 dark:text-slate-400 font-medium"
        >
          {activeTab === "years" 
            ? "نظمنا لك المحتوى بدقة متناهية لِيتناسب مع متطلبات كل مرحلة في رحلتك الطبية."
            : "الموسوعة الصيدلانية الموحدة — تصفح الأقسام والمستندات والأدوية بكل سهولة."}
        </motion.p>
      </div>

      {/* Unified Seamless Switcher */}
      <div className="flex items-center p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-[1.8rem] w-fit mx-auto mb-12 shadow-inner border border-slate-200/50 dark:border-slate-700/50" dir="rtl">
        <Link 
          href="/courses"
          onClick={() => setActiveTab("years")}
          className={`flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 ${
            activeTab === "years" 
              ? "bg-white dark:bg-dark-card shadow-lg text-medical-600 scale-[1.02]" 
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          السنوات الدراسية
        </Link>
        <Link 
          href="/courses?tab=pharmacy"
          onClick={() => setActiveTab("pharmacy")}
          className={`flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 ${
            activeTab === "pharmacy" 
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 scale-[1.02]" 
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <FlaskConical className="w-5 h-5" />
          قسم الصيدلة
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
                        {cat.description || `استكشف كافة المواد والدروس المخصصة لطلاب ${cat.name}.`}
                      </p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/60">
                        <span className="text-sm font-black text-medical-600 dark:text-medical-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                          عرض المواد الدراسية
                          <ChevronRight className="w-4 h-4 rotate-180" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800" dir="rtl">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-400">لا توجد سنوات دراسية مضافة حالياً</h3>
                <p className="text-slate-500 mt-2">سيتم تفعيل هذا القسم قريباً جداً.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ===== PHARMACY TAB CONTENT ===== */}
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
                  placeholder="ابحث عن قسم صيدلاني أو علاج محدد..."
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
                  {pharmacySearch ? "لا توجد نتائج مطابقة لبحثك" : "لا توجد أقسام صيدلانية حالياً"}
                </h3>
                <p className="text-slate-400 text-sm mt-1">جرّب البحث بكلمات أخرى أو تصفح باقي الأقسام.</p>
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
                            <span>{section.images?.length || 0} عنصر</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {section.name}
                        </h3>

                        {/* Description */}
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6 line-clamp-2 flex-1">
                          {section.description || "تصفح الصور والأدوية والوثائق الطبية الخاصة بهذا القسم الصيدلاني."}
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
                            استكشف المحتوى الصيدلاني
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
