"use client";

import { addCategory, getCategories, deleteCategory, addSubject, getSubjects, deleteSubject } from "@/app/actions/content";
import { useState, useEffect } from "react";
import { 
  PlusCircle, Save, GraduationCap, Stethoscope, 
  Trash2, Search, Filter, LayoutGrid, List,
  AlertCircle, CheckCircle2, Loader2, BookOpen, Layers, ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSubjectsPage() {
  const [activeTab, setActiveTab] = useState<"YEARS" | "SUBJECTS">("YEARS");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [filterYearId, setFilterYearId] = useState<string>("all");

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const [cats, subs] = await Promise.all([getCategories(), getSubjects()]);
    setCategories(cats);
    setSubjects(subs);
  };

  async function handleAddCategory(formData: FormData) {
    setLoading(true);
    const res = await addCategory(formData);
    handleResponse(res);
  }

  async function handleAddSubject(formData: FormData) {
    setLoading(true);
    const res = await addSubject(formData);
    handleResponse(res);
  }

  const handleResponse = (res: any) => {
    if (res.error) {
      setMessage(res.error);
      setStatus("error");
    } else {
      setMessage("تم حفظ البيانات بنجاح!");
      setStatus("success");
      refreshData();
    }
    setLoading(false);
    setTimeout(() => { setMessage(""); setStatus(null); }, 4000);
  };

  async function handleDeleteCat(id: string) {
    if (!confirm("حذف السنة سيحذف كل المواد والدروس التابعة لها! هل أنت متأكد؟")) return;
    const res = await deleteCategory(id);
    if (res.success) refreshData();
  }

  async function handleDeleteSub(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه المادة؟")) return;
    const res = await deleteSubject(id);
    if (res.success) refreshData();
  }

  const filteredSubjects = subjects.filter(sub => 
    filterYearId === "all" || sub.categoryId === filterYearId
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl pb-20 space-y-10 text-right"
      dir="rtl"
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">إدارة الهيكل التعليمي</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">نظم السنوات الدراسية والمواد العلمية لِطلاب AuraMed.</p>
      </div>

      {/* Tabs Switching */}
      <div className="flex items-center p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-[1.5rem] w-fit">
         <button 
          onClick={() => setActiveTab("YEARS")}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all ${activeTab === "YEARS" ? "bg-white dark:bg-dark-card shadow-lg text-medical-600" : "text-slate-500 hover:text-slate-700"}`}
         >
           <Layers className="w-4 h-4" />
           السنوات والتخصصات
         </button>
         <button 
          onClick={() => setActiveTab("SUBJECTS")}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all ${activeTab === "SUBJECTS" ? "bg-white dark:bg-dark-card shadow-lg text-medical-600" : "text-slate-500 hover:text-slate-700"}`}
         >
           <BookOpen className="w-4 h-4" />
           المواد الدراسية
         </button>
      </div>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-6 rounded-[2rem] border shadow-xl flex items-center gap-4 ${
              status === "success" ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
          >
            {status === "success" ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <p className="text-lg font-black">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5">
           <div className="section-card p-10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-32 h-32 bg-medical-500/5 rounded-full -ml-16 -mt-16 blur-3xl" />
              
              <div className="flex items-center gap-4 mb-10 relative z-10">
                 <div className={`p-4 rounded-2xl ${activeTab === "YEARS" ? "bg-medical-50 dark:bg-medical-500/10 text-medical-600" : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600"}`}>
                    {activeTab === "YEARS" ? <GraduationCap className="w-8 h-8" /> : <BookOpen className="w-8 h-8" />}
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">
                       {activeTab === "YEARS" ? "إضافة سنة دراسية" : "إضافة مادة دراسية"}
                    </h2>
                    <p className="text-slate-400 text-xs font-bold mt-1">قم بتعبئة البيانات لِحفظها في النظام</p>
                 </div>
              </div>

              <form action={activeTab === "YEARS" ? handleAddCategory : handleAddSubject} className="space-y-8 relative z-10">
                 {activeTab === "YEARS" ? (
                   <>
                     <input type="hidden" name="type" value="YEAR" />
                     <div className="space-y-3">
                        <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">اسم السنة / التخصص</label>
                        <input name="name" required placeholder="مثلاً: السنة الثانية - طب بشري" className="admin-input" />
                     </div>
                     <div className="space-y-3">
                        <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">وصف قصير</label>
                        <textarea name="description" placeholder="نبذة عن هذه المرحلة الدراسية..." className="admin-input min-h-[120px]" />
                     </div>
                   </>
                 ) : (
                   <>
                     <div className="space-y-3">
                        <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">تابع لِلسنة الدراسية</label>
                        <select 
                          name="categoryId" 
                          title="السنة الدراسية"
                          required 
                          className="admin-input appearance-none cursor-pointer"
                          value={filterYearId === "all" ? "" : filterYearId}
                          onChange={(e) => setFilterYearId(e.target.value || "all")}
                        >
                           <option value="">اختر السنة الدراسية المناسبة...</option>
                           {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <p className="text-[10px] text-amber-500 font-bold px-1">بِمجرد الاختيار، ستظهر فقط مواد هذه السنة في القائمة المجاورة.</p>
                     </div>
                     <div className="space-y-3">
                        <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">اسم المادة</label>
                        <input name="name" required placeholder="مثلاً: علم الأنسجة (Histology)" className="admin-input" />
                     </div>
                     <div className="space-y-3">
                        <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">وصف المادة</label>
                        <textarea name="description" placeholder="ماذا سيدرس الطالب في هذه المادة؟" className="admin-input min-h-[120px]" />
                     </div>
                   </>
                 )}

                 <button disabled={loading} className={`admin-btn-primary w-full py-5 rounded-[2rem] ${activeTab === "SUBJECTS" ? "bg-indigo-600 dark:bg-indigo-600 text-white dark:text-white hover:bg-indigo-700 shadow-indigo-500/20" : ""}`}>
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                    <span className="text-xl">حفظ البيانات في النظام</span>
                 </button>
              </form>
           </div>
        </div>

        {/* Listing Column */}
        <div className="lg:col-span-7 space-y-6">
           <div className="bg-slate-50/50 dark:bg-slate-900/20 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800/60 min-h-[600px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-4">
                 <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-medical-600 rounded-full" />
                    {activeTab === "YEARS" ? "السنوات المضافة حالياً" : "المواد الدراسية المسجلة"}
                 </h3>
                 <div className="flex items-center gap-3">
                    {activeTab === "SUBJECTS" && (
                       <button 
                        onClick={() => setFilterYearId("all")}
                        className={`text-[10px] font-black px-3 py-1.5 rounded-lg border transition-all ${filterYearId === "all" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-dark-card text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-500"}`}
                       >
                         عرض الكل
                       </button>
                    )}
                    <div className="px-4 py-1.5 bg-white dark:bg-dark-card rounded-full border border-slate-100 dark:border-slate-800 text-xs font-black text-slate-400 shadow-sm">
                       {activeTab === "YEARS" ? categories.length : filteredSubjects.length} عنصر
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <AnimatePresence mode="popLayout">
                 {activeTab === "YEARS" ? (
                   categories.map((cat, i) => (
                      <motion.div 
                        key={cat.id} 
                        layout
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/60 flex items-center justify-between group shadow-sm hover:shadow-xl hover:border-medical-500/20 transition-all duration-500"
                      >
                         <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-medical-50 dark:bg-medical-500/10 rounded-2xl flex items-center justify-center text-medical-600 group-hover:scale-110 transition-transform">
                               <GraduationCap className="w-7 h-7" />
                            </div>
                            <div>
                               <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">{cat.name}</h4>
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                                  {cat.type === "YEAR" ? "سنة أكاديمية" : "تخصص طبي"}
                               </span>
                            </div>
                         </div>
                         <button title="حذف" aria-label="حذف" onClick={() => handleDeleteCat(cat.id)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                            <Trash2 className="w-6 h-6" />
                         </button>
                      </motion.div>
                   ))
                 ) : (
                   filteredSubjects.map((sub, i) => (
                      <motion.div 
                        key={sub.id} 
                        layout
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/60 flex items-center justify-between group shadow-sm hover:shadow-xl hover:border-indigo-500/20 transition-all duration-500"
                      >
                         <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                               <BookOpen className="w-7 h-7" />
                            </div>
                            <div>
                               <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">{sub.name}</h4>
                               <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-medical-600 bg-medical-50 dark:bg-medical-500/10 px-2 py-1 rounded-md">{sub.category?.name}</span>
                                  <span className="text-[10px] font-bold text-slate-400">{sub.lessons?.length || 0} درس</span>
                                </div>
                            </div>
                         </div>
                         <button title="حذف" aria-label="حذف" onClick={() => handleDeleteSub(sub.id)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                            <Trash2 className="w-6 h-6" />
                         </button>
                      </motion.div>
                   ))
                 )}
                 </AnimatePresence>
                 {activeTab === "SUBJECTS" && filteredSubjects.length === 0 && (
                   <div className="py-20 text-center text-slate-400 font-bold italic">
                      {filterYearId === "all" ? "لا توجد مواد مسجلة حالياً." : "لا توجد مواد مضافة لهذه السنة حالياً."}
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
