"use client";

import Link from "next/link";
import { PlayCircle, FileText, Download, Clock, ArrowRight, ChevronLeft, Sparkles, BookOpen, Layers, CheckCircle, Search, X, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

function getYoutubeThumbnail(lesson: any) {
  const url = lesson.videoUrl || lesson.resources?.find((r: any) => r.type === "VIDEO")?.url;
  
  if (!url) return null;
  
  try {
    const cleanUrl = url.trim();
    if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) {
      const videoRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
      const videoMatch = cleanUrl.match(videoRegExp);
      if (videoMatch && videoMatch[2] && videoMatch[2].length === 11) {
        return `https://img.youtube.com/vi/${videoMatch[2]}/hqdefault.jpg`;
      }
    }
  } catch (e) {}
  return null;
}

export default function SubjectContentClient({ subject }: { subject: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const lessons = subject.lessons || [];

  const filteredLessons = lessons.filter((lesson: any) => 
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lesson.description && lesson.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12" dir="rtl">
      {/* Breadcrumbs / Back */}
      <div className="mb-10 flex items-center gap-4 text-sm font-bold">
        <Link href={`/courses/y/${subject.category.slug}`} className="text-slate-500 hover:text-medical-600 flex items-center gap-2 transition-colors">
          <ArrowRight className="w-4 h-4" />
          العودة لِـ {subject.category.name}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Subject Info & Resources Summary */}
        <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
           <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
              <div className="w-16 h-16 bg-medical-500/10 text-medical-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                 <BookOpen className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">
                 {subject.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed italic">
                 {subject.description || "أهلاً بك في المحتوى التعليمي لهذه المادة. هنا تجد كل ما تحتاجه من محاضرات وملفات منظمة."}
              </p>
              
              <div className="space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-bold">إجمالي الدروس</span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-slate-900 dark:text-white font-black">{lessons.length}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-bold">الحالة</span>
                    <span className="text-emerald-500 flex items-center gap-1 font-black">
                       <CheckCircle className="w-4 h-4" />
                       مكتملة
                    </span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Lessons List */}
        <div className="lg:col-span-8 order-1 lg:order-2">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
              <h2 className="text-2xl font-black flex items-center gap-3">
                 <Layers className="w-6 h-6 text-medical-600" />
                 الدروس والمحاضرات
              </h2>

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
                   className="w-full pr-12 pl-10 py-3.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-bold text-sm shadow-sm"
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
                {filteredLessons.map((lesson: any, idx: number) => {
                  const thumb = getYoutubeThumbnail(lesson);
                  const hasVideo = !!thumb;

                  return (
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
                        className="group flex flex-col sm:flex-row gap-6 bg-white dark:bg-dark-card p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-medical-500/50 shadow-sm hover:shadow-2xl transition-all duration-500"
                      >
                         <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden relative shrink-0 bg-slate-100 dark:bg-slate-900 shadow-lg">
                            {hasVideo ? (
                               <>
                                 <img src={thumb} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-medical-900/20 backdrop-blur-[2px]">
                                    <PlayCircle className="w-12 h-12 text-white drop-shadow-2xl" />
                                 </div>
                               </>
                            ) : (
                               <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600 gap-2 border-2 border-dashed border-slate-100 dark:border-slate-800/50 rounded-2xl">
                                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-1">
                                     <Video className="w-5 h-5 opacity-40" />
                                  </div>
                                  <span className="text-xs font-black uppercase tracking-tighter text-slate-400 dark:text-slate-500">لا يوجد فيديو</span>
                               </div>
                            )}
                            <div className="absolute top-3 right-3 bg-medical-600 text-white text-[9px] font-black px-2 py-1 rounded-lg z-10 shadow-md">
                               المحاضرة {idx + 1}
                            </div>
                         </div>
                         
                         <div className="flex-1 py-2">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-medical-600 transition-colors line-clamp-1 tracking-tight">
                               {lesson.title}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 font-medium leading-relaxed">
                               {lesson.description || "لا يوجد وصف متاح لهذا الدرس حالياً."}
                            </p>
                            
                            <div className="flex items-center gap-6 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                               <div className="flex items-center gap-1.5 text-xs text-slate-400 font-black">
                                  <FileText className="w-4 h-4 text-medical-500" />
                                  {lesson.resources?.filter((r: any) => r.type !== "VIDEO").length || 0} مرفقات
                               </div>
                               <div className="flex items-center gap-1.5 text-xs text-slate-400 font-black">
                                  <Clock className="w-4 h-4" />
                                  {new Date(lesson.createdAt).toLocaleDateString('ar-EG')}
                               </div>
                               <span className="text-xs font-black text-medical-600 dark:text-medical-400 flex items-center gap-1 mr-auto opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                                  {hasVideo ? "دخول المحتوى" : "تحميل المرفقات"}
                                  <ChevronLeft className="w-3 h-3" />
                               </span>
                            </div>
                         </div>
                      </Link>
                    </motion.div>
                  );
                })}
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
                <h3 className="text-2xl font-black text-slate-400">لا توجد نتائج لـ "{searchTerm}"</h3>
                <p className="text-slate-500 mt-2 font-medium">جرب البحث بِكلمة أخرى أو تحقق من العنوان.</p>
                <button onClick={() => setSearchTerm("")} className="mt-6 text-medical-600 font-black hover:underline">إلغاء التصفية</button>
             </motion.div>
           )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
