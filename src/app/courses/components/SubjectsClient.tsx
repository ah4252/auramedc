"use client";

import Link from "next/link";
import { Book, ChevronLeft, ArrowRight, PlayCircle, Sparkles, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function SubjectsClient({ category }: { category: any }) {
  const [search, setSearch] = useState("");
  const subjects = category.subjects || [];

  const filteredSubjects = subjects.filter((s: any) => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12" dir="rtl">
      {/* Back Button */}
      <div className="mb-10">
        <Link 
          href="/courses"
          className="group inline-flex items-center gap-2 text-slate-500 hover:text-medical-600 transition-colors font-bold"
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          العودة للسنوات الدراسية
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
           <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-medical-500/10 text-medical-600 dark:text-medical-400 rounded-lg text-xs font-black uppercase">
                 السنة الدراسية
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
           </div>
           <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
              مواد <span className="text-medical-600">{category.name}</span>
           </h1>
           <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {category.description || `قائمة شاملة بجميع المواد الدراسية والمناهج المقررة لطلاب ${category.name}.`}
           </p>
        </div>

        {/* Quick Search Box */}
        <div className="w-full lg:max-w-md relative group">
           <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <Search className={`w-5 h-5 transition-colors ${search ? 'text-medical-600' : 'text-slate-400 group-focus-within:text-medical-600'}`} />
           </div>
           <input 
             type="text"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder="ابحث عن مادة محددة..."
             className="w-full pr-12 pl-12 py-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-[1.5rem] focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 shadow-sm group-hover:shadow-md"
           />
           {search && (
             <button 
               title="مسح البحث" aria-label="مسح البحث"
               onClick={() => setSearch("")}
               className="absolute inset-y-0 left-4 flex items-center text-slate-400 hover:text-rose-500 transition-colors"
             >
               <X className="w-5 h-5" />
             </button>
           )}
           <div className="absolute -bottom-6 right-2 text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity">
              البحث الذكي في مواد {category.name}
           </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredSubjects.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {filteredSubjects.map((subject: any, idx: number) => (
              <motion.div
                key={subject.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link 
                  href={`/courses/s/${subject.slug}`}
                  className="group flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-dark-card p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-medical-500 transition-all duration-500"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center shrink-0 group-hover:bg-medical-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <Book className="w-10 h-10 sm:w-14 sm:h-14 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-right">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-medical-600 transition-colors">
                        {subject.name}
                      </h3>
                      {search && subject.name.toLowerCase().includes(search.toLowerCase()) && (
                        <span className="text-[9px] bg-medical-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">تطابق</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 font-medium leading-relaxed">
                      {subject.description || "استكشف الدروس والمحاضرات والمصادر التعليمية الخاصة بهذه المادة."}
                    </p>
                    
                    <div className="flex items-center justify-center md:justify-start gap-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <PlayCircle className="w-4 h-4 text-medical-500" />
                        {subject.lessons?.length || 0} درس
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                      <span className="text-xs font-black text-medical-600 dark:text-medical-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        دخول المحتوى
                        <ChevronLeft className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-slate-50/50 dark:bg-slate-900/10 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800"
          >
             <div className="w-20 h-20 bg-white dark:bg-dark-card rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Search className="w-10 h-10 text-slate-300" />
             </div>
             <h3 className="text-2xl font-black text-slate-400">لم يتم العثور على نتائج لـ "{search}"</h3>
             <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">جرب البحث بكلمات أخرى أو تحقق من المسمى الصحيح للمادة.</p>
             <button onClick={() => setSearch("")} className="mt-6 text-medical-600 font-black hover:underline">إعادة ضبط البحث</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
