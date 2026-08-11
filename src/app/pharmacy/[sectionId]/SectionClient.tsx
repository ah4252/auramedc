"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Search, ArrowRight, Image as ImageIcon } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const { t, lang } = useLocale();
  const isRtl = lang === "ar";

  const filteredImages = section.images.filter(img =>
    (img.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (img.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 relative" dir={isRtl ? "rtl" : "ltr"}>
      <div className={`fixed top-4 ${isRtl ? "right-4 sm:right-6" : "left-4 sm:left-6"} z-[60]`}>
        <Link
          href="/courses?tab=pharmacy"
          className="group flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-lg border border-white/20"
        >
          <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isRtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
          <span>{t("pharmacy_back_to_sections", "Back to sections")}</span>
        </Link>
      </div>

      <div className="mb-8 flex items-center justify-end">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>{t("pharmacy_section_badge", "Pharmacy section")}</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2.8rem] border border-emerald-500/20 bg-white dark:bg-slate-900/80 p-8 sm:p-12 mb-10 shadow-xl shadow-emerald-500/5 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full -mr-28 -mt-28 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/5 rounded-full -ml-28 -mb-28 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-black uppercase tracking-wider">
              {t("pharmacy_section_banner_label", "Medical encyclopedia")}
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
            {section.name}
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium leading-relaxed mb-8">
            {section.description || t("pharmacy_section_default_description", "Browse medicines, files, and images in this section with fast search and zoom.")}
          </p>

          <div className="relative max-w-xl">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("pharmacy_section_search_placeholder", "Quick search for a medicine in this section...")}
              className="w-full pr-14 pl-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        {filteredImages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/50 dark:bg-slate-900/30 rounded-[3rem] border border-dashed border-emerald-500/20"
          >
            <ImageIcon className="w-16 h-16 mx-auto text-emerald-500/30 mb-4" />
            <h2 className="text-xl font-black text-slate-600 dark:text-slate-400">
              {search ? t("pharmacy_section_no_results_title", "No matching medicine found") : t("pharmacy_section_no_images_title", "No medicines in this section yet")}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {search ? t("pharmacy_section_no_results_description", "Try another search") : t("pharmacy_section_no_images_description", "Medicines will be added soon")}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-emerald-600 dark:text-emerald-400 font-black text-sm hover:underline"
              >
                {t("pharmacy_reset_search", "Reset search")}
              </button>
            )}
          </motion.div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                {t("pharmacy_items_found", "Found")} {filteredImages.length} {t("pharmacy_item_label_plural", "medicine/file")}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pb-16">
              {filteredImages.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group text-right relative bg-white dark:bg-dark-card rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 transition-all duration-300 border border-slate-200/80 dark:border-slate-800 flex flex-col hover:-translate-y-1"
                >
                  <Link href={`/pharmacy/${section.id}/${img.id}`} className="block h-full">
                    <div className="relative aspect-[4/5] w-full bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center p-3">
                      <img
                        src={img.url}
                        alt={img.title || "Medicine image"}
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
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
