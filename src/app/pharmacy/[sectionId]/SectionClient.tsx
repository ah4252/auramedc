"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, X, Search, ArrowRight, Image as ImageIcon, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleProvider.client";

type PharmacyImage = {
  id: string;
  title: string | null;
  url: string;
  description: string | null;
  order: number;
};

type PharmacySection = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  order: number;
  images: PharmacyImage[];
};

export default function SectionClient({ section }: { section: PharmacySection }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const { t } = useLocale();

  const filteredImages = section.images.filter(img =>
    (img.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (img.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const activeImage = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setZoomLevel(1);
    setLightboxIndex(prev => (prev! > 0 ? prev! - 1 : filteredImages.length - 1));
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setZoomLevel(1);
    setLightboxIndex(prev => (prev! < filteredImages.length - 1 ? prev! + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") handlePrev();
      if (e.key === "ArrowLeft") handleNext();
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredImages.length]);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 relative" dir="rtl">
      {/* Floating Sticky Back Button - visible on all screens including mobile */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[60]">
        <Link
          href="/courses?tab=pharmacy"
          className="group flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-lg border border-white/20"
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          <span>العودة إلى قسم الصيدلة</span>
        </Link>
      </div>

      {/* Static Top Header Badge */}
      <div className="mb-8 flex items-center justify-end">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>قسم صيدلاني</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.8rem] border border-emerald-500/20 bg-white dark:bg-slate-900/80 p-8 sm:p-12 mb-10 shadow-xl shadow-emerald-500/5 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full -mr-28 -mt-28 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/5 rounded-full -ml-28 -mb-28 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-black uppercase tracking-wider">
              الموسوعة الصيدلانية
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
            {section.name}
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium leading-relaxed mb-8">
            {section.description || "استعرض الأدوية والملفات والصور التوضيحية الخاصة بهذا القسم مع إمكانية التكبير والبحث السريع."}
          </p>

          {/* Embedded Search Control Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="بحث سريع عن دواء أو ملف داخل هذا القسم..."
              className="w-full pr-14 pl-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Display of Items */}
      <div>
        {filteredImages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/50 dark:bg-slate-900/30 rounded-[3rem] border border-dashed border-emerald-500/20"
          >
            <ImageIcon className="w-16 h-16 mx-auto text-emerald-500/30 mb-4" />
            <h2 className="text-xl font-black text-slate-600 dark:text-slate-400">
              {search ? "لا يوجد دواء أو ملف مطابق لبحثك" : "لا توجد أدوية مضافة في هذا القسم حالياً"}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {search ? "جرّب البحث بكلمة أخرى" : "سيتم إضافة المزيد من الملفات قريباً"}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-emerald-600 dark:text-emerald-400 font-black text-sm hover:underline"
              >
                إعادة ضبط البحث
              </button>
            )}
          </motion.div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                تم العثور على {filteredImages.length} دواء / ملف
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pb-16">
              {filteredImages.map((img, i) => (
                <motion.button
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => {
                    setZoomLevel(1);
                    setLightboxIndex(i);
                  }}
                  className="group text-right relative bg-white dark:bg-dark-card rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 transition-all duration-300 border border-slate-200/80 dark:border-slate-800 flex flex-col hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/5] w-full bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center p-3">
                    <img
                      src={img.url}
                      alt={img.title || "صورة دواء"}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center justify-center text-emerald-600 shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <Search className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {(img.title || img.description) && (
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-dark-card flex-1 flex flex-col justify-between">
                      {img.title && (
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {img.title}
                        </h3>
                      )}
                      {img.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium">
                          {img.description}
                        </p>
                      )}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clean Single Card Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md select-none"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Modal Card Box */}
            <motion.div
              key={activeImage.id}
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-emerald-400 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    {lightboxIndex! + 1} / {filteredImages.length}
                  </span>
                  {activeImage.title && (
                    <h3 className="text-white font-bold text-base line-clamp-1">{activeImage.title}</h3>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50 text-white">
                    <button
                      onClick={() => setZoomLevel(prev => Math.min(prev + 0.3, 2.5))}
                      title="تكبير"
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(prev => Math.max(prev - 0.3, 0.6))}
                      title="تصغير"
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    {zoomLevel !== 1 && (
                      <button
                        onClick={() => setZoomLevel(1)}
                        title="إعادة الضبط"
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-emerald-400"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setLightboxIndex(null)}
                    title="إغلاق"
                    className="w-9 h-9 bg-slate-800 hover:bg-rose-600/80 rounded-xl flex items-center justify-center text-white transition-colors border border-slate-700/50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Image Area with Navigation Buttons */}
              <div className="relative flex-1 bg-slate-950/60 overflow-hidden flex items-center justify-center p-4 min-h-[300px]">
                {/* Navigation Arrows inside Card */}
                {filteredImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                      title="السابق"
                      className="absolute right-4 z-10 w-11 h-11 bg-slate-900/80 hover:bg-emerald-600 text-white border border-slate-700/80 rounded-2xl flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      title="التالي"
                      className="absolute left-4 z-10 w-11 h-11 bg-slate-900/80 hover:bg-emerald-600 text-white border border-slate-700/80 rounded-2xl flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  </>
                )}

                <div className="w-full h-full max-h-[55vh] flex items-center justify-center overflow-auto custom-scrollbar p-2">
                  <img
                    src={activeImage.url}
                    alt={activeImage.title || ""}
                    style={{ transform: `scale(${zoomLevel})` }}
                    className="max-h-[52vh] max-w-full object-contain transition-transform duration-200 ease-out"
                  />
                </div>
              </div>

              {/* Description Box inside Card */}
              {activeImage.description && (
                <div className="p-4 bg-slate-900 border-t border-slate-800/80 max-h-32 overflow-y-auto custom-scrollbar">
                  <p className="text-slate-300 text-sm font-medium leading-relaxed text-right">
                    {activeImage.description}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
