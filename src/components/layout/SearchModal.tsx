"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon, X, Video, BookOpen, ArrowLeft, Loader2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchContent } from "@/app/actions/content";
import Link from "next/link";

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ lessons: any[], categories: any[], subjects: any[] }>({ lessons: [], categories: [], subjects: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        const data = await searchContent(query);
        setResults(data);
        setLoading(false);
      } else {
        setResults({ lessons: [], categories: [], subjects: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="bg-white dark:bg-dark-card w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <SearchIcon className="w-6 h-6 text-medical-600" />
          <input 
            autoFocus
            placeholder="ابحث عن محاضرات، سنوات دراسية، أو تخصصات..."
            className="flex-1 bg-transparent border-none outline-none text-xl font-medium placeholder:text-slate-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin text-medical-500 mb-4" />
              <p className="font-bold">جاري البحث عن المحتوى...</p>
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="text-center py-20 text-slate-400">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-10 h-10 opacity-20" />
              </div>
              <p className="text-lg">اكتب حرفين على الأقل للبدء في البحث</p>
            </div>
          )}

          {!loading && query.length >= 2 && results.lessons.length === 0 && results.categories.length === 0 && results.subjects.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <p className="text-lg font-bold">لم نجد أي نتائج لـ "{query}"</p>
              <p className="text-sm mt-1">جرب كلمات بحث مختلفة</p>
            </div>
          )}

          {/* Subjects Results */}
          {results.subjects.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-400 px-4 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                المواد الأكاديمية
              </h3>
              <div className="space-y-1">
                {results.subjects.map((sub) => (
                  <Link 
                    key={sub.id} 
                    href={sub.category?.type === "YEAR" ? "/courses" : "/subjects"}
                    onClick={onClose}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-medical-600">{sub.name}</p>
                        <p className="text-xs text-slate-500 truncate max-w-xs">{sub.category?.name || "مادة دراسية"}</p>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Categories Results */}
          {results.categories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-400 px-4 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                السنوات والتخصصات
              </h3>
              <div className="space-y-1">
                {results.categories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    href={cat.type === "YEAR" ? "/courses" : "/subjects"}
                    onClick={onClose}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-medical-600">{cat.name}</p>
                        <p className="text-xs text-slate-500 truncate max-w-xs">{cat.description || "قسم أكاديمي"}</p>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Lessons Results */}
          {results.lessons.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-400 px-4 mb-3 flex items-center gap-2">
                <Video className="w-4 h-4" />
                المحاضرات والدروس
              </h3>
              <div className="space-y-1">
                {results.lessons.map((lesson) => (
                  <Link 
                    key={lesson.id} 
                    href={`/courses/${lesson.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 flex items-center justify-center">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-medical-600">{lesson.title}</p>
                        <p className="text-xs text-slate-500">{lesson.subject?.category?.name || "عام"}</p>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-slate-300 bg-white dark:bg-slate-700 font-sans shadow-sm">ESC</kbd> للإغلاق
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-slate-300 bg-white dark:bg-slate-700 font-sans shadow-sm">↵</kbd> للاختيار
          </span>
        </div>
      </motion.div>
    </div>
  );
}
