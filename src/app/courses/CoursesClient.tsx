"use client";

import Link from "next/link";
import { Search as SearchIcon, PlayCircle, Clock, BookOpen, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function getYoutubeThumbnail(lesson: any) {
  const url = lesson.videoUrl || lesson.resources?.find((r: any) => r.type === "VIDEO")?.url;
  
  // Use a dynamic placeholder based on the lesson title to make it look "real" and varied
  const fallback = `https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?q=80&w=800&auto=format&fit=crop&sig=${encodeURIComponent(lesson.title)}`;
  
  if (!url) return fallback;
  
  try {
    const cleanUrl = url.trim();
    if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) {
      // Priority 1: Extract Video ID from URL
      const videoRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
      const videoMatch = cleanUrl.match(videoRegExp);
      
      if (videoMatch && videoMatch[2] && videoMatch[2].length === 11) {
        return `https://img.youtube.com/vi/${videoMatch[2]}/hqdefault.jpg`;
      }

      // Priority 2: If it's a playlist but has a video ID inside it
      if (cleanUrl.includes("list=") && cleanUrl.includes("v=")) {
         const vMatch = cleanUrl.match(/[?&]v=([^&#]+)/);
         if (vMatch && vMatch[1]) {
            return `https://img.youtube.com/vi/${vMatch[1]}/hqdefault.jpg`;
         }
      }
    }
  } catch (e) {}
  
  return fallback;
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
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-l from-medical-700 to-medical-500 dark:from-medical-400 dark:to-medical-300">السنوات الدراسية</h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">تصفح المحاضرات والدروس المخصصة لسنتك الدراسية</p>
        </motion.div>
        
        {/* Search - Mobile Friendly */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full md:w-auto"
        >
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="ابحث عن درس..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card focus:ring-2 focus:ring-medical-500 outline-none transition-all shadow-sm text-sm"
            />
            <SearchIcon className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
          </div>
        </motion.div>
      </div>

      {/* Categories Filter - Scrollable on Mobile */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        <button 
          onClick={() => setActiveYear("الكل")}
          className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border ${
            activeYear === "الكل" 
              ? 'bg-medical-600 text-white border-transparent' 
              : 'bg-white dark:bg-dark-card border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          الكل
        </button>
        {categories.map((cat) => (
          <button 
            key={cat.id} 
            onClick={() => setActiveYear(cat.name)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border ${
              activeYear === cat.name 
                ? 'bg-medical-600 text-white border-transparent' 
                : 'bg-white dark:bg-dark-card border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
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
          <AnimatePresence>
            {filteredLessons.map((lesson, idx) => {
              const thumbnailUrl = getYoutubeThumbnail(lesson);
              return (
                <motion.div
                  key={lesson.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Link href={`/courses/${lesson.slug}`} className="group flex flex-col h-full bg-white dark:bg-dark-card rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="h-48 sm:h-56 relative overflow-hidden bg-slate-900">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80" style={{ backgroundImage: `url(${thumbnailUrl})` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10" />
                      
                      {/* Large Center Playlist Label */}
                      {(lesson.videoUrl?.includes("list=") || lesson.resources?.some((r: any) => r.url.includes("list="))) && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                          <div className="bg-red-600/90 text-white text-lg sm:text-2xl font-black px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl shadow-2xl border-4 border-white/20 backdrop-blur-sm transform -rotate-12 tracking-widest animate-pulse">
                            PLAY LIST
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-medical-600/90 p-3 sm:p-4 rounded-full text-white backdrop-blur-md shadow-lg scale-90 group-hover:scale-100 transition-transform">
                          <PlayCircle className="w-8 h-8 sm:w-10 sm:h-10 ml-1" />
                        </div>
                      </div>

                      <div className="absolute top-3 right-3 z-20">
                        <span className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-md text-medical-700 dark:text-medical-400 text-[10px] px-2.5 py-1 rounded-lg font-bold shadow-sm border border-slate-100 dark:border-slate-800">
                          {lesson.subject?.category?.name || "عام"}
                        </span>
                      </div>
                    </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col relative z-20">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2 leading-snug group-hover:text-medical-600 transition-colors">
                      {lesson.title}
                    </h3>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 break-words whitespace-normal">
                      {lesson.description || "لا يوجد وصف متاح لهذا الدرس."}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end">
                      <div className="flex items-center gap-1.5 text-medical-600 dark:text-medical-500 text-sm font-bold bg-medical-50 dark:bg-medical-900/20 px-3 py-1.5 rounded-lg">
                        <PlayCircle className="w-4 h-4" />
                        <span>شاهد الآن</span>
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
          className="text-center py-24 bg-white dark:bg-dark-card rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 shadow-sm"
        >
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold mb-3">لا توجد دروس في {activeYear} حالياً</h3>
          <p className="text-slate-500 max-w-md mx-auto">سيتم إضافة المحاضرات المخصصة قريباً من قبل إدارة المنصة. يرجى التحقق لاحقاً.</p>
        </motion.div>
      )}
    </div>
  );
}
