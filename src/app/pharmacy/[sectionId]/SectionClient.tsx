"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, X, Search, ArrowRight, Image as ImageIcon } from "lucide-react";
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
  const [lightboxImage, setLightboxImage] = useState<PharmacyImage | null>(null);
  const [search, setSearch] = useState("");
  const { t } = useLocale();

  const filteredImages = section.images.filter(img =>
    (img.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (img.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[var(--dark-bg)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 py-20 px-4">
        {/* Background Image/Gradient */}
        {section.imageUrl ? (
          <div className="absolute inset-0">
            <img src={section.imageUrl} alt={section.name} className="w-full h-full object-cover opacity-40 blur-sm scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800" />
        )}

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center pt-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-0 right-0"
          >
            <Link
              href="/pharmacy"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5 text-white/90 text-sm font-bold transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              {t("pharmacy_back_to_sections", "Retour aux sections")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2.5 text-white/90 text-sm font-bold mb-6 mt-8 md:mt-0"
          >
            <FlaskConical className="w-4 h-4" />
            {section.images.length} دواء
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight"
          >
            {section.name}
          </motion.h1>

          {section.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10"
            >
              {section.description}
            </motion.p>
          )}

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("pharmacy_section_search_placeholder", "Recherche rapide de médicament dans la section...")}
              className="w-full pr-14 pl-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 outline-none focus:border-white/40 focus:bg-white/15 transition-all font-medium shadow-lg"
            />
          </motion.div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {filteredImages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <ImageIcon className="w-20 h-20 mx-auto text-slate-300 dark:text-slate-600 mb-6" />
            <h2 className="text-2xl font-black text-slate-400 dark:text-slate-500">
              {search ? t("pharmacy_section_no_results_title", "Aucun médicament correspondant trouvé") : t("pharmacy_section_no_images_title", "Aucun médicament dans cette section pour le moment")}
            </h2>
            <p className="text-slate-400 dark:text-slate-600 mt-2">
              {search ? t("pharmacy_section_no_results_description", "Essayez une autre recherche") : t("pharmacy_section_no_images_description", "Les médicaments seront ajoutés bientôt")}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredImages.map((img, i) => (
              <motion.button
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setLightboxImage(img)}
                className="group text-right relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 transition-all duration-300 border border-slate-200/60 dark:border-slate-700/60 flex flex-col"
              >
                <div className="relative aspect-[4/5] w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-4">
                  <img
                    src={img.url}
                    alt={img.title || "دواء"}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-900 shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <Search className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                {(img.title || img.description) && (
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    {img.title && (
                      <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-1 group-hover:text-emerald-500 transition-colors">{img.title}</h3>
                    )}
                    {img.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{img.description}</p>
                    )}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-4xl"
            >
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-white/10">
                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.title || ""}
                  className="w-full max-h-[80vh] object-contain"
                />
              </div>
              
              {(lightboxImage.title || lightboxImage.description) && (
                <div className="mt-6 text-center max-w-2xl mx-auto">
                  {lightboxImage.title && (
                    <h3 className="text-white font-black text-2xl mb-2">{lightboxImage.title}</h3>
                  )}
                  {lightboxImage.description && (
                    <p className="text-slate-300 text-base leading-relaxed">{lightboxImage.description}</p>
                  )}
                </div>
              )}
              
              <button
                onClick={() => setLightboxImage(null)}
                title={t("pharmacy_section_close_button", "Fermer")}
                className="absolute -top-12 right-0 md:-right-12 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
