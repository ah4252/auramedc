"use client";

import Link from "next/link";
import { BookOpen, GraduationCap, ArrowLeft, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function YearsClient({ categories }: { categories: any[] }) {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-16">
      <div className="max-w-4xl mx-auto mb-16 text-center">
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
          اختر <span className="text-transparent bg-clip-text bg-gradient-to-l from-medical-600 to-medical-400">سنتك الدراسية</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-500 dark:text-slate-400 font-medium"
        >
          نظمنا لك المحتوى بدقة متناهية لِيتناسب مع متطلبات كل مرحلة في رحلتك الطبية.
        </motion.p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
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
                      <ChevronRight className="w-4 h-4" />
                   </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
           <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-6" />
           <h3 className="text-2xl font-black text-slate-400">لا توجد سنوات دراسية مضافة حالياً</h3>
           <p className="text-slate-500 mt-2">سيتم تفعيل هذا القسم قريباً جداً.</p>
        </div>
      )}
    </div>
  );
}
