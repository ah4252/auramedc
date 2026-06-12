"use client";

import { useState } from "react";
import { Heart, User, BookOpen, Clock, X, ExternalLink, PlayCircle, Trash2, Loader2, CheckSquare, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getYoutubeThumbnail } from "@/lib/utils";
import { deleteFavorite, bulkDeleteFavorites } from "@/app/actions/bulkDelete";

export default function FavoritesClient({ favorites }: { favorites: any[] }) {
  const [selectedFav, setSelectedFav] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  const allIds = favorites.map(f => f.id);
  const allSelected = allIds.length > 0 && selectedIds.size === allIds.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleAll = () => setSelectedIds(allSelected ? new Set() : new Set(allIds));

  const handleBulkDelete = async () => {
    setBulkLoading(true);
    const res = await bulkDeleteFavorites(Array.from(selectedIds));
    setBulkLoading(false);
    setShowBulkConfirm(false);
    if (res?.error) alert(res.error);
    else setSelectedIds(new Set());
  };

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
        {/* Bulk Toolbar */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between gap-4 px-8 py-3 bg-rose-50 dark:bg-rose-900/20 border-b border-rose-200 dark:border-rose-800/50">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                  <CheckSquare className="w-4 h-4" />
                  <span>تم تحديد <strong>{selectedIds.size}</strong> من {favorites.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedIds(new Set())}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-colors">
                    إلغاء التحديد
                  </button>
                  <button onClick={() => setShowBulkConfirm(true)}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-black rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm">
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف المحدد ({selectedIds.size})
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-6 w-12">
                  <button onClick={toggleAll} className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${allSelected ? "text-medical-600" : "text-slate-300 dark:text-slate-600 hover:text-slate-400"}`}>
                    {allSelected || someSelected ? <CheckSquare className={`w-5 h-5 ${someSelected ? "opacity-50" : ""}`} /> : <Square className="w-5 h-5" />}
                  </button>
                </th>
                <th className="px-8 py-6 font-black text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">المستخدم</th>
                <th className="px-8 py-6 font-black text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">الدرس المحفوظ</th>
                <th className="px-8 py-6 font-black text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">المادة</th>
                <th className="px-8 py-6 font-black text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">تاريخ الإضافة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {favorites.map((fav) => {
                const isSelected = selectedIds.has(fav.id);
                return (
                  <tr key={fav.id}
                    className={`transition-colors group ${isSelected ? "bg-medical-50/60 dark:bg-medical-900/10" : "hover:bg-medical-50/30 dark:hover:bg-medical-900/5"}`}
                  >
                    <td className="px-6 py-5">
                      <button onClick={() => toggleOne(fav.id)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isSelected ? "text-medical-600" : "text-slate-300 dark:text-slate-600 hover:text-slate-400"}`}>
                        {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="px-8 py-5 cursor-pointer" onClick={() => setSelectedFav(fav)}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform">
                          {fav.user.image ? <img src={fav.user.image} alt={fav.user.name || ""} className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-slate-400" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white text-base group-hover:text-medical-600 transition-colors">{fav.user.name || "مستخدم"}</span>
                          <span className="text-xs text-slate-500 font-medium">{fav.user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 cursor-pointer" onClick={() => setSelectedFav(fav)}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-medical-50 dark:bg-medical-900/30 flex items-center justify-center text-medical-600">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{fav.lesson.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 cursor-pointer" onClick={() => setSelectedFav(fav)}>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-full text-xs font-bold">{fav.lesson.subject.name}</span>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-400 font-bold">{new Date(fav.createdAt).toLocaleDateString('ar-EG')}</td>
                  </tr>
                );
              })}
              {favorites.length === 0 && (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold">لا توجد مفضلات محفوظة</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Confirm Modal */}
      <AnimatePresence>
        {showBulkConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !bulkLoading && setShowBulkConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 text-center">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent rounded-t-[2.5rem]" />
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">تأكيد الحذف الجماعي</h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-8 leading-relaxed">
                هل أنت متأكد من حذف <strong className="text-rose-600 dark:text-rose-400">{selectedIds.size}</strong> عنصر محدد؟<br />لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowBulkConfirm(false)} disabled={bulkLoading}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black transition-all hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50">
                  إلغاء
                </button>
                <button onClick={handleBulkDelete} disabled={bulkLoading}
                  className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 disabled:opacity-50">
                  {bulkLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Trash2 className="w-4 h-4" /><span>حذف ({selectedIds.size})</span></>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedFav && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedFav(null)} className="absolute inset-0 bg-slate-900/50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white dark:bg-dark-card rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/30">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">تفاصيل المحفوظات</h3>
                <button onClick={() => setSelectedFav(null)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors" title="إغلاق">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden">
                    {selectedFav.user.image ? <img src={selectedFav.user.image} alt={selectedFav.user.name || "صورة المستخدم"} className="w-full h-full object-cover" /> :
                      <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400"><User className="w-6 h-6" /></div>}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{selectedFav.user.name || "مستخدم"}</div>
                    <div className="text-sm text-slate-500">{selectedFav.user.email}</div>
                  </div>
                </div>
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
                    <span className="font-bold text-slate-800 dark:text-slate-200">{new Date(selectedFav.createdAt).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase px-1">معاينة المحتوى</div>
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group shadow-sm bg-slate-50 dark:bg-slate-800/30">
                      {getYoutubeThumbnail(selectedFav.lesson.videoUrl) && (
                        <div className="aspect-video relative bg-[#05070a]">
                          <img src={getYoutubeThumbnail(selectedFav.lesson.videoUrl) || undefined} alt={selectedFav.lesson.title || "معاينة الدرس"} className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                          </div>
                        </div>
                      )}
                    <div className="p-4">
                      <a href={`/courses/v/${selectedFav.lesson.slug}`} target="_blank"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-lg transition-all">
                        <ExternalLink className="w-4 h-4" />
                        فتح صفحة الدرس
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[11px] text-slate-400 font-medium">نظام إدارة المفضلة - AuraMed Admin v1.0</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
