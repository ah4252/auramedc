"use client";

import Link from "next/link";
import { Search as SearchIcon, PlayCircle, Clock, BookOpen, User, Video } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function getYoutubeThumbnail(url: string) {
  if (!url) return null;
  
  try {
    const cleanUrl = url.trim();
    const videoRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
    const videoMatch = cleanUrl.match(videoRegExp);
    
    if (videoMatch && videoMatch[2] && videoMatch[2].length === 11) {
      return `https://img.youtube.com/vi/${videoMatch[2]}/hqdefault.jpg`;
    }

    if (cleanUrl.includes("list=") && cleanUrl.includes("v=")) {
       const vMatch = cleanUrl.match(/[?&]v=([^&#]+)/);
       if (vMatch && vMatch[1]) {
          return `https://img.youtube.com/vi/${vMatch[1]}/hqdefault.jpg`;
       }
    }
  } catch (e) {}
  
  return null;
}

export default function CoursesClient({ categories, lessons }: { categories: any[], lessons: any[] }) {
  const [activeYear, setActiveYear] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLessons = lessons.filter(lesson => {
    const matchesYear = activeYear === "الكل" || lesson.subject?.category?.name === activeYear;
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lesson.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesYear && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 text-right">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-l from-medical-700 to-medical-500 dark:from-medical-400 dark:to-medical-300 tracking-tight">السنوات الدراسية</h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">تصفح المحاضرات والدروس المخصصة لسنتك الدراسية</p>
        </motion.div>
        
        {/* Search - Mobile Friendly */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full md:w-auto"
        >
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="ابحث عن درس محدد..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card focus:ring-4 focus:ring-medical-500/10 focus:border-medical-500 outline-none transition-all shadow-sm text-sm font-bold"
            />
            <SearchIcon className="w-5 h-5 absolute right-4 top-4 text-slate-400" />
          </div>
        </motion.div>
      </div>

      {/* Categories Filter - Scrollable on Mobile */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2.5 overflow-x-auto pb-4 mb-10 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        <button 
          onClick={() => setActiveYear("الكل")}
          className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-black transition-all shadow-sm border ${
            activeYear === "الكل" 
              ? 'bg-medical-600 text-white border-transparent' 
              : 'bg-white dark:bg-dark-card border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          الكل
        </button>
        {categories.map((cat) => (
          <button 
            key={cat.id} 
            onClick={() => setActiveYear(cat.name)}
            className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-black transition-all shadow-sm border ${
              activeYear === cat.name 
                ? 'bg-medical-600 text-white border-transparent' 
                : 'bg-white dark:bg-dark-card border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
          }`}
          >
            {cat.name}
          </button>
        ))}
      </motion.div>

      {/* Courses Grid - Responsive Columns */}
      {filteredLessons.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredLessons.map((lesson, idx) => {
              const videoUrl = lesson.videoUrl || lesson.resources?.find((r: any) => r.type === "VIDEO")?.url;
              const thumbnailUrl = getYoutubeThumbnail(videoUrl);
              const hasValidVideo = !!thumbnailUrl;

              return (
                <motion.div
                  key={lesson.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Link href={`/courses/v/${lesson.slug}`} className="group flex flex-col h-full bg-white dark:bg-dark-card rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500">
                    <div className="h-48 sm:h-56 relative overflow-hidden bg-[#05070a]">
                      {hasValidVideo ? (
                        <>
                          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80" style={{ backgroundImage: `url(${thumbnailUrl})` }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10" />
                          
                          {/* Large Center Playlist Label */}
                          {(videoUrl?.includes("list=") || lesson.resources?.some((r: any) => r.url.includes("list="))) && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center">
                              <div className="bg-red-600/90 text-white text-lg sm:text-2xl font-black px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl shadow-2xl border-4 border-white/20 backdrop-blur-sm transform -rotate-12 tracking-widest animate-pulse">
                                PLAY LIST
                              </div>
                            </div>
                          )}

                          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-medical-600/90 p-3 sm:p-4 rounded-full text-white backdrop-blur-md shadow-lg scale-90 group-hover:scale-100 transition-transform">
                              <PlayCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white gap-3 border-b border-white/5">
                           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                              <Video className="w-8 h-8 text-white opacity-60" />
                           </div>
                           <span className="text-xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">لا يوجد فيديو</span>
                        </div>
                      )}

                      <div className="absolute top-3 right-3 z-20">
                        <span className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-md text-medical-700 dark:text-medical-400 text-[10px] px-3 py-1.5 rounded-xl font-black shadow-md border border-slate-100 dark:border-slate-800">
                          {lesson.subject?.category?.name || "عام"}
                        </span>
                      </div>
                    </div>

                  <div className="p-6 sm:p-8 flex-1 flex flex-col relative z-20 text-right">
                    <h3 className="text-xl sm:text-2xl font-black mb-3 line-clamp-1 leading-snug group-hover:text-medical-600 transition-colors tracking-tight">
                      {lesson.title}
                    </h3>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-8 font-medium leading-relaxed">
                      {lesson.description || "لا يوجد وصف متاح لهذا الدرس حالياً."}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end">
                      <div className={`flex items-center gap-2 text-sm font-black px-4 py-2 rounded-xl transition-all ${hasValidVideo ? 'bg-medical-50 dark:bg-medical-900/20 text-medical-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                        {hasValidVideo ? <PlayCircle className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                        <span>{hasValidVideo ? 'شاهد الآن' : 'تصفح المحتوى'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 bg-white dark:bg-dark-card rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-700 shadow-sm"
        >
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <BookOpen className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-black mb-3 text-slate-800 dark:text-white">لا توجد دروس حالياً</h3>
          <p className="text-slate-500 max-w-md mx-auto font-medium">سيتم إضافة المحاضرات المخصصة قريباً من قبل إدارة المنصة. يرجى التحقق لاحقاً.</p>
        </motion.div>
      )}
    </div>
  );
}
