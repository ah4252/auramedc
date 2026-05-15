"use client";

import Link from "next/link";
import { 
  ArrowRight, Video, FileText, Play, Clock, 
  ChevronLeft, Search, X, Layers, Sparkles, BookOpen 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function LessonsClient({ subject }: { subject: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const lessons = subject.lessons || [];

  const filteredLessons = lessons.filter((lesson: any) => 
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lesson.description && lesson.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12" dir="rtl">
      {/* Back Button */}
      <div className="mb-10 flex items-center justify-between">
        <Link 
          href={`/courses/y/${subject.category?.slug || ""}`}
          className="group inline-flex items-center gap-2 text-slate-500 hover:text-medical-600 transition-colors font-bold"
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          العودة لِ{subject.category?.name || "السنة الدراسية"}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-medical-500/10 text-medical-600 rounded-xl flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">الدروس والمحاضرات</h2>
            </div>

            {/* Smart Search Bar */}
            <div className="relative group w-full sm:max-w-xs">
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <Search className={`w-4 h-4 transition-colors ${searchTerm ? 'text-medical-600' : 'text-slate-400 group-focus-within:text-medical-600'}`} />
              </div>
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث في المحاضرات..."
                className="w-full pr-12 pl-10 py-3 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-bold text-sm shadow-sm"
              />
              {searchTerm && (
                <button 
                  title="مسح البحث" aria-label="مسح البحث"
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 left-4 flex items-center text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredLessons.length > 0 ? (
              <div className="space-y-6">
                {filteredLessons.map((lesson: any, idx: number) => (
                  <motion.div
                    key={lesson.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link 
                      href={`/courses/v/${lesson.slug}`}
                      className="group block bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-4 sm:p-6 hover:shadow-2xl hover:border-medical-500 transition-all duration-500"
                    >
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative w-full sm:w-48 h-32 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                          {lesson.resources?.some((r: any) => r.type === "VIDEO") ? (
                            <img 
                              src={`https://img.youtube.com/vi/${lesson.resources.find((r: any) => r.type === "VIDEO")?.url.split('v=')[1]}/maxresdefault.jpg`} 
                              alt={lesson.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <Video className="w-10 h-10 text-slate-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-12 h-12 bg-white text-medical-600 rounded-full flex items-center justify-center shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                               <Play className="w-5 h-5 fill-current" />
                            </div>
                          </div>
                          <div className="absolute top-3 right-3 bg-medical-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                             المحاضرة {idx + 1}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-medical-600 transition-colors">
                            {lesson.title}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed mb-4">
                            {lesson.description || "لا يوجد وصف متاح لهذا الدرس حالياً."}
                          </p>
                          <div className="flex items-center gap-6 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                            <div className="flex items-center gap-1.5 text-xs font-black text-slate-400">
                               <FileText className="w-4 h-4" />
                               {lesson.resources?.filter((r: any) => r.type !== "VIDEO").length || 0} مرفقات
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-black text-slate-400">
                               <Clock className="w-4 h-4" />
                               {new Date(lesson.createdAt).toLocaleDateString('ar-DZ')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-slate-50/50 dark:bg-slate-900/10 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800"
              >
                 <div className="w-20 h-20 bg-white dark:bg-dark-card rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Search className="w-10 h-10 text-slate-300" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-400">لا توجد نتائج مطابقة لـ "{searchTerm}"</h3>
                 <p className="text-slate-500 mt-2 font-medium">تأكد من كتابة عنوان الدرس بِشكل صحيح.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Subject Info */}
        <div className="lg:col-span-4 order-1 lg:order-2 sticky top-24">
           <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-medical-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-medical-500/10 transition-colors" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                 <div className="w-20 h-20 bg-medical-50 dark:bg-medical-500/10 text-medical-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
                    <BookOpen className="w-10 h-10" />
                 </div>
                 <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                    {subject.name}
                 </h1>
                 <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10 italic">
                    أهلاً بك في المحتوى التعليمي لهذه المادة. هنا تجد كل ما تحتاجه من محاضرات وملفات منظمة.
                 </p>

                 <div className="w-full space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400 font-bold">إجمالي الدروس</span>
                       <span className="font-black text-slate-900 dark:text-white">{lessons.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-400 font-bold">الحالة</span>
                       <span className="text-emerald-500 font-black flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> مكتملة
                       </span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
