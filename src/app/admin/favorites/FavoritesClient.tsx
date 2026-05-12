"use client";

import { useState } from "react";
import { Heart, User, BookOpen, Clock, X, ExternalLink, PlayCircle, Mail, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getYoutubeThumbnail } from "@/lib/utils";

export default function FavoritesClient({ favorites }: { favorites: any[] }) {
  const [selectedFav, setSelectedFav] = useState<any>(null);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-[2rem] shadow-lg shadow-red-600/10">
          <Heart className="w-10 h-10 fill-current" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">إدارة المفضلة</h1>
          <p className="text-slate-500 font-medium text-lg">مراقبة الدروس التي يحفظها الطلاب في حساباتهم</p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-8 py-6 font-black text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">المستخدم</th>
                <th className="px-8 py-6 font-black text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">الدرس المحفوظ</th>
                <th className="px-8 py-6 font-black text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">المادة</th>
                <th className="px-8 py-6 font-black text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">تاريخ الإضافة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {favorites.map((fav) => (
                <tr 
                  key={fav.id} 
                  onClick={() => setSelectedFav(fav)}
                  className="hover:bg-medical-50/30 dark:hover:bg-medical-900/5 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform">
                        {fav.user.image ? (
                          <img src={fav.user.image} alt={fav.user.name || ""} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white text-base group-hover:text-medical-600 transition-colors">
                          {fav.user.name || "مستخدم"}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{fav.user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-medical-50 dark:bg-medical-900/30 flex items-center justify-center text-medical-600">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{fav.lesson.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-full text-xs font-bold">
                      {fav.lesson.subject.name}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-400 font-bold">
                    {new Date(fav.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flat Professional Admin Modal */}
      <AnimatePresence>
        {selectedFav && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFav(null)}
              className="absolute inset-0 bg-slate-900/50"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white dark:bg-dark-card rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/30">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">تفاصيل المحفوظات</h3>
                <button 
                  onClick={() => setSelectedFav(null)}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="إغلاق"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                
                {/* User Section */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden">
                    {selectedFav.user.image ? (
                      <img src={selectedFav.user.image} alt={selectedFav.user.name || "صورة المستخدم"} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{selectedFav.user.name || "مستخدم"}</div>
                    <div className="text-sm text-slate-500">{selectedFav.user.email}</div>
                  </div>
                </div>

                {/* Details Table */}
                <div className="border border-slate-100 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex items-center justify-between p-4 text-sm">
                    <span className="text-slate-500 font-medium">اسم المادة:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedFav.lesson.subject.name}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 text-sm">
                    <span className="text-slate-500 font-medium">عنوان الدرس:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-left max-w-[200px]">{selectedFav.lesson.title}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 text-sm">
                    <span className="text-slate-500 font-medium">تاريخ الإضافة:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {new Date(selectedFav.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>

                {/* Lesson Preview Card */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase px-1">معاينة المحتوى</div>
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group shadow-sm bg-slate-50 dark:bg-slate-800/30">
                    <div className="aspect-video relative">
                      <img 
                        src={getYoutubeThumbnail(selectedFav.lesson.videoUrl)} 
                        alt={selectedFav.lesson.title || "معاينة الدرس"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="p-4">
                      <a 
                        href={`/courses/${selectedFav.lesson.slug}`}
                        target="_blank"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-lg transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        فتح صفحة الدرس
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[11px] text-slate-400 font-medium">
                  نظام إدارة المفضلة - AuraMed Admin v1.0
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
