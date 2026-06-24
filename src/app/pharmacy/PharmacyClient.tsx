"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, ChevronRight, Search, FolderOpen } from "lucide-react";
import Link from "next/link";

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

export default function PharmacyClient({ sections }: { sections: PharmacySection[] }) {
  const [search, setSearch] = useState("");

  const filteredSections = sections.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[var(--dark-bg)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 py-20 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5 bg-grid-pattern-light" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2.5 text-white/90 text-sm font-bold mb-6"
          >
            <FlaskConical className="w-4 h-4" />
            AuraMed Elite — قسم الصيدلة
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight"
          >
            الصيدلة
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10"
          >
            استعرض الأقسام والمواد الدوائية المتاحة — اضغط على أي قسم لمشاهدة صوره
          </motion.p>

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
              placeholder="ابحث عن قسم..."
              className="w-full pr-14 pl-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 outline-none focus:border-white/40 focus:bg-white/15 transition-all font-medium"
            />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {filteredSections.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <FlaskConical className="w-20 h-20 mx-auto text-slate-300 dark:text-slate-600 mb-6" />
            <h2 className="text-2xl font-black text-slate-400 dark:text-slate-500">
              {search ? "لا توجد نتائج مطابقة" : "لا توجد أقسام بعد"}
            </h2>
            <p className="text-slate-400 dark:text-slate-600 mt-2">
              {search ? "جرب البحث بكلمة مختلفة" : "سيتم إضافة المحتوى قريباً"}
            </p>
          </motion.div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {filteredSections.length} قسم متاح
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSections.map((section, idx) => (
                <Link key={section.id} href={`/pharmacy/${section.id}`} className="block">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="group text-right bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden h-full flex flex-col"
                  >
                  {/* Thumbnail grid preview */}
                  <div className="relative h-44 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 overflow-hidden">
                    {section.imageUrl ? (
                      <div className="w-full h-full">
                        <img
                          src={section.imageUrl}
                          alt={section.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : section.images.length > 0 ? (
                      <div className={`grid h-full gap-0.5 ${
                        section.images.length === 1 ? "grid-cols-1" :
                        section.images.length === 2 ? "grid-cols-2" :
                        "grid-cols-2"
                      }`}>
                        {section.images.slice(0, 4).map((img, i) => (
                          <div key={img.id} className={`relative overflow-hidden ${
                            section.images.length === 3 && i === 0 ? "row-span-2" : ""
                          }`}>
                            <img
                              src={img.url}
                              alt={img.title || ""}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ))}
                        {section.images.length > 4 && (
                          <div className="absolute bottom-2 left-2 bg-slate-900/70 backdrop-blur-sm text-white text-xs font-black px-2 py-1 rounded-lg">
                            +{section.images.length - 4}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center">
                          <FlaskConical className="w-10 h-10 text-emerald-400 dark:text-emerald-600" />
                        </div>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/30 dark:from-slate-900/30 to-transparent" />
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {section.name}
                        </h3>
                        {section.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 font-medium">
                            {section.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-6 h-6 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                        <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {section.images.length} دواء متاح
                      </span>
                    </div>
                  </div>
                </motion.div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
