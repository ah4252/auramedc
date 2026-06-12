"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FileEdit, BookOpen, Video, Layers, GraduationCap, 
  ChevronLeft, MoreHorizontal, ExternalLink, Filter, Search, X, Trash2, Loader2, CheckSquare, Square
} from "lucide-react";
import DeleteButton from "./DeleteButton";
import EditCategoryModal from "../subjects/EditCategoryModal";
import { motion, AnimatePresence } from "framer-motion";
import { bulkDeleteLessons } from "@/app/actions/bulkDelete";

export default function ContentManagerClient({ 
  initialLessons, 
  categories, 
  initialSubjects 
}: { 
  initialLessons: any[], 
  categories: any[], 
  initialSubjects: any[] 
}) {
  const [selectedYearId, setSelectedYearId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Bulk select state for lessons
  const [selectedLessonIds, setSelectedLessonIds] = useState<Set<string>>(new Set());
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  const filteredLessons = initialLessons.filter(lesson => {
    const yearMatch = selectedYearId === "all" || lesson.subject?.categoryId === selectedYearId;
    const searchMatch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
    return yearMatch && searchMatch;
  });

  const filteredSubjects = initialSubjects.filter(sub => {
    const yearMatch = selectedYearId === "all" || sub.categoryId === selectedYearId;
    const searchMatch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
    return yearMatch && searchMatch;
  });

  const allLessonIds = filteredLessons.map(l => l.id);
  const allLessonsSelected = allLessonIds.length > 0 && allLessonIds.every(id => selectedLessonIds.has(id));
  const someLessonsSelected = allLessonIds.some(id => selectedLessonIds.has(id)) && !allLessonsSelected;

  const toggleLesson = (id: string) => {
    setSelectedLessonIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleAllLessons = () => {
    if (allLessonsSelected) {
      setSelectedLessonIds(prev => { const next = new Set(prev); allLessonIds.forEach(id => next.delete(id)); return next; });
    } else {
      setSelectedLessonIds(prev => new Set([...Array.from(prev), ...allLessonIds]));
    }
  };
  const handleBulkDeleteLessons = async () => {
    setBulkLoading(true);
    const res = await bulkDeleteLessons(Array.from(selectedLessonIds));
    setBulkLoading(false);
    setShowBulkConfirm(false);
    if (res?.error) alert(res.error);
    else setSelectedLessonIds(new Set());
  };

  return (
    <div className="max-w-6xl pb-20 space-y-10 animate-fade-in text-right" dir="rtl">
      {/* Page Header & Top Filters */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">مركز إدارة المحتوى</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium italic">تحكم في المسيرة الأكاديمية بِدقة واحترافية.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:max-w-2xl">
          {/* Year Filter */}
          <div className="w-full sm:w-1/2 relative group">
             <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <Filter className="w-4 h-4 text-medical-600" />
             </div>
             <select 
               title="فلترة حسب السنة"
               value={selectedYearId}
               onChange={(e) => setSelectedYearId(e.target.value)}
               className="admin-input pr-12 appearance-none cursor-pointer"
             >
                <option value="all">جميع السنوات الدراسية</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
             </select>
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-1/2 relative group">
             <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
             </div>
             <input 
               type="text"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="بحث سريع..."
               className="admin-input pr-12"
             />
             {searchTerm && (
               <button aria-label="مسح البحث" title="مسح البحث" onClick={() => setSearchTerm("")} className="absolute inset-y-0 left-4 flex items-center text-slate-400 hover:text-rose-500">
                  <X className="w-4 h-4" />
               </button>
             )}
          </div>
        </div>
      </div>

      {/* 1. Lessons Management Section */}
      <div className="section-card overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-medical-500/10 text-medical-600 rounded-2xl flex items-center justify-center">
                <Video className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">الدروس والمحاضرات</h2>
                <p className="text-xs text-slate-400 font-bold">إجمالي المحتوى المرئي المسجل</p>
             </div>
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className="bg-medical-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg shadow-medical-600/20">
               {filteredLessons.length} عنصر مفلتر
             </span>
             {selectedYearId !== "all" && (
                <span className="text-[9px] text-medical-600 font-black">يتم العرض حسب السنة المختارة</span>
             )}
          </div>
        </div>
        
        {/* Bulk Toolbar for Lessons */}
        <AnimatePresence>
          {selectedLessonIds.size > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex items-center justify-between gap-4 px-8 py-3 bg-rose-50 dark:bg-rose-900/20 border-b border-rose-200 dark:border-rose-800/50">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                  <CheckSquare className="w-4 h-4" />
                  <span>تم تحديد <strong>{selectedLessonIds.size}</strong> من {filteredLessons.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedLessonIds(new Set())} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 transition-colors">إلغاء التحديد</button>
                  <button onClick={() => setShowBulkConfirm(true)} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-black rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm">
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف المحدد ({selectedLessonIds.size})
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                <th className="p-6 w-12">
                  <button onClick={toggleAllLessons} className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${allLessonsSelected ? "text-medical-600" : "text-slate-300 dark:text-slate-600 hover:text-slate-400"}`}>
                    {allLessonsSelected || someLessonsSelected ? <CheckSquare className={`w-5 h-5 ${someLessonsSelected ? "opacity-50" : ""}`} /> : <Square className="w-5 h-5" />}
                  </button>
                </th>
                <th className="p-6">المحاضرة والموقع</th>
                <th className="p-6">السنة / المادة</th>
                <th className="p-6">تاريخ النشر</th>
                <th className="p-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              <AnimatePresence mode="popLayout">
                {filteredLessons.map((lesson: any) => (
                  <motion.tr 
                    layout
                    key={lesson.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`transition-all group ${selectedLessonIds.has(lesson.id) ? "bg-medical-50/40 dark:bg-medical-900/10" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/20"}`}
                  >
                    <td className="p-6">
                      <button onClick={() => toggleLesson(lesson.id)} className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedLessonIds.has(lesson.id) ? "text-medical-600" : "text-slate-300 dark:text-slate-600 hover:text-slate-400"}`}>
                        {selectedLessonIds.has(lesson.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-slate-900 dark:text-white text-lg group-hover:text-medical-600 transition-colors">
                          {lesson.title}
                        </span>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <Video className="w-3 h-3" /> {lesson.resources?.filter((r: any) => r.type === "VIDEO").length || 0} فيديو
                           </span>
                           <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> {lesson.resources?.filter((r: any) => r.type !== "VIDEO").length || 0} مرفقات
                           </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                         <span className="text-[10px] font-black text-medical-600 bg-medical-50 dark:bg-medical-500/10 px-2 py-0.5 rounded-md w-fit">
                            {lesson.subject?.category?.name || "عام"}
                         </span>
                         <span className="text-[10px] font-bold text-slate-400">
                            {lesson.subject?.name}
                         </span>
                      </div>
                    </td>
                    <td className="p-6 text-slate-400 text-xs font-bold" dir="ltr">
                      {new Date(lesson.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-3">
                        <Link 
                          href={`/courses/v/${lesson.slug}`}
                          target="_blank"
                          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-medical-600 transition-all"
                          title="معاينة"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <Link 
                          href={`/admin/posts/edit/${lesson.id}`}
                          className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                          title="تعديل"
                        >
                          <FileEdit className="w-5 h-5" />
                        </Link>
                        <DeleteButton id={lesson.id} type="lesson" />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredLessons.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-400 font-bold italic">
                    لا توجد دروس تطابق خيارات التصفية الحالية.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* 2. Subjects Management Section */}
         <div className="section-card overflow-hidden h-fit">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
               <h2 className="text-xl font-black flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  المواد الدراسية المسجلة
               </h2>
               <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md">{filteredSubjects.length} عنصر</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
               <table className="w-full text-right">
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                     <AnimatePresence mode="popLayout">
                       {filteredSubjects.map(sub => (
                          <motion.tr 
                            layout
                            key={sub.id} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-slate-50/30 group transition-colors"
                          >
                             <td className="p-5">
                                <p className="font-black text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">{sub.name}</p>
                                <div className="flex items-center gap-2">
                                   <span className="text-[9px] font-bold text-slate-400">{sub.category?.name}</span>
                                   <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                   <span className="text-[9px] font-bold text-slate-400">{sub.lessons?.length || 0} درس</span>
                                </div>
                             </td>
                             <td className="p-5 text-left">
                                <DeleteButton id={sub.id} type="subject" />
                             </td>
                          </motion.tr>
                       ))}
                     </AnimatePresence>
                  </tbody>
               </table>
            </div>
         </div>

         {/* 3. Years Management Section */}
         <div className="section-card overflow-hidden h-fit">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
               <h2 className="text-xl font-black flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-amber-500" />
                  السنوات والتخصصات
               </h2>
               <span className="text-[10px] font-black bg-amber-100 text-amber-600 px-2 py-1 rounded-md">{categories.length} قسم</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
               <table className="w-full text-right">
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                     {categories.map(cat => (
                        <tr key={cat.id} className="hover:bg-slate-50/30">
                           <td className="p-5">
                              <p className="font-black text-slate-900 dark:text-white mb-1">{cat.name}</p>
                              <span className="text-[10px] font-bold text-slate-400">{cat.type === "YEAR" ? "سنة أكاديمية" : "تخصص طبي"}</span>
                           </td>
                           <td className="p-5 text-left flex items-center justify-end gap-2">
                              <EditCategoryModal category={cat} />
                              <DeleteButton id={cat.id} type="category" />
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      {/* Bulk Delete Confirm Modal */}
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
                هل أنت متأكد من حذف <strong className="text-rose-600 dark:text-rose-400">{selectedLessonIds.size}</strong> درس/محاضرة؟<br />لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowBulkConfirm(false)} disabled={bulkLoading}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black transition-all hover:bg-slate-200 disabled:opacity-50">إلغاء</button>
                <button onClick={handleBulkDeleteLessons} disabled={bulkLoading}
                  className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 disabled:opacity-50">
                  {bulkLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Trash2 className="w-4 h-4" /><span>حذف ({selectedLessonIds.size})</span></>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
