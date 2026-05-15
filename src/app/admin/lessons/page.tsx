"use client";

import { addLesson, getCategories, getSubjects } from "@/app/actions/content";
import { useState, useEffect } from "react";
import { 
  PlusCircle, Save, CheckCircle2, Link2, Plus, 
  PlayCircle, FileText, Trash2, Info, Layout, 
  FileCode, Globe, AlertCircle, Loader2, GraduationCap, BookOpen, ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLessonsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([getCategories(), getSubjects()]).then(([cats, subs]) => {
      setCategories(cats);
      setAllSubjects(subs);
    });
  }, []);

  const filteredSubjects = allSubjects.filter(s => s.categoryId === selectedCategoryId);

  const addResourceRow = () => {
    setResources([...resources, { title: "", type: "VIDEO", url: "" }]);
  };

  const removeResourceRow = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const updateResource = (index: number, field: string, value: string) => {
    const updated = [...resources];
    updated[index][field] = value;
    setResources(updated);
  };

  async function handleAdd(formData: FormData) {
    setLoading(true);
    setMessage("");
    setStatus(null);
    
    formData.append("resources", JSON.stringify(resources));
    const res = await addLesson(formData);
    
    if (res.error) {
      setMessage(res.error);
      setStatus("error");
    } else {
      setMessage("تم بنجاح! لَقَد أضفت درساً جديداً مع جميع موارده إلى النظام.");
      setStatus("success");
      setResources([]);
      setSelectedCategoryId("");
      (document.getElementById("lesson-form") as HTMLFormElement)?.reset();
    }
    setLoading(false);
    setTimeout(() => { setMessage(""); setStatus(null); }, 4000);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl pb-20 space-y-10 text-right"
      dir="rtl"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">إضافة محتوى تعليمي</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">قم بنشر الدروس والمحاضرات الطبية وربطها بالموارد المناسبة.</p>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-6 rounded-[2.5rem] border shadow-2xl flex items-center gap-4 ${
              status === "success" 
                ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 text-emerald-700" 
                : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
          >
            {status === "success" ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            <p className="text-xl font-black">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <form id="lesson-form" action={handleAdd} className="space-y-10">
        {/* Hierarchy Selection */}
        <div className="section-card p-10 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-40 h-40 bg-medical-500/5 rounded-full -ml-20 -mt-20 blur-3xl group-hover:bg-medical-500/10 transition-colors" />
           
           <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="p-4 bg-medical-50 dark:bg-medical-500/10 rounded-2xl text-medical-600">
                 <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-slate-800 dark:text-white">تحديد موقع الدرس</h2>
                 <p className="text-slate-400 text-xs font-bold mt-1">اختر السنة والمادة لِضمان وصول الطالب للمحتوى</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-3">
                 <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">1. السنة الدراسية</label>
                 <select 
                   title="السنة الدراسية"
                   className="admin-input appearance-none cursor-pointer" 
                   value={selectedCategoryId} 
                   onChange={(e) => setSelectedCategoryId(e.target.value)}
                   required
                 >
                    <option value="">اختر السنة الدراسية...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
              </div>
              <div className="space-y-3">
                 <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">2. المادة العلمية</label>
                 <div className="relative">
                    <select 
                      name="subjectId" 
                      title="المادة العلمية"
                      className="admin-input appearance-none cursor-pointer disabled:opacity-50" 
                      disabled={!selectedCategoryId}
                      required
                    >
                       <option value="">{selectedCategoryId ? "اختر المادة الدراسية..." : "يجب اختيار السنة أولاً"}</option>
                       {filteredSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    {!selectedCategoryId && <p className="text-[10px] text-amber-500 font-bold mt-1.5 px-2 animate-pulse">يجب اختيار السنة أولاً لِتظهر المواد المتاحة</p>}
                 </div>
              </div>
           </div>
        </div>

        {/* Main Content */}
        <div className="section-card p-10">
           <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600">
                 <Layout className="w-8 h-8" />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-slate-800 dark:text-white">بيانات المحاضرة</h2>
                 <p className="text-slate-400 text-xs font-bold mt-1">العنوان والوصف الأساسي للدرس</p>
              </div>
           </div>

           <div className="space-y-8">
              <div className="space-y-3">
                 <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">عنوان المحاضرة <span className="text-rose-500">*</span></label>
                 <input name="title" required placeholder="مثلاً: الفيزيولوجيا - مقدمة في الجهاز العصبي" className="admin-input" />
              </div>
              <div className="space-y-3">
                 <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">وصف المحتوى</label>
                 <textarea name="description" placeholder="عن ماذا تتحدث هذه المحاضرة؟ وما هي الأهداف التعليمية منها؟" className="admin-input min-h-[140px]" />
              </div>
           </div>
        </div>

        {/* Resources */}
        <div className="section-card p-10 border-indigo-500/10">
           <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600">
                    <Link2 className="w-8 h-8" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">موارد الدرس</h2>
                    <p className="text-slate-400 text-xs font-bold mt-1">اربط الفيديوهات، ملفات الـ PDF والملخصات</p>
                 </div>
              </div>
              <button type="button" onClick={addResourceRow} className="admin-btn-secondary px-8 py-3 text-sm group">
                 <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                 إضافة مورد جديد
              </button>
           </div>

           <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                 {resources.map((res, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-5 p-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-[2rem] border border-slate-100 dark:border-slate-800 relative group transition-all hover:border-medical-500/20 shadow-sm"
                    >
                       <div className="md:col-span-4 space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">عنوان المورد</label>
                          <input placeholder="شرح الفيديو - الجزء الأول" value={res.title} onChange={(e) => updateResource(index, "title", e.target.value)} className="admin-input py-3 text-sm" />
                       </div>
                       <div className="md:col-span-3 space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">نوع الملف</label>
                          <select title="نوع المورد" value={res.type} onChange={(e) => updateResource(index, "type", e.target.value)} className="admin-input py-3 text-sm appearance-none cursor-pointer">
                             <option value="VIDEO">فيديو (YouTube)</option>
                             <option value="PDF">ملف PDF</option>
                             <option value="SUMMARY">ملخص الدرس</option>
                             <option value="LINK">رابط خارجي</option>
                          </select>
                       </div>
                       <div className="md:col-span-4 space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">الرابط المباشر</label>
                          <input placeholder="https://..." value={res.url} onChange={(e) => updateResource(index, "url", e.target.value)} className="admin-input py-3 text-sm" dir="ltr" />
                       </div>
                       <div className="md:col-span-1 flex items-end justify-center pb-2">
                          <button type="button" onClick={() => removeResourceRow(index)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all shadow-sm">
                             <Trash2 className="w-6 h-6" />
                          </button>
                       </div>
                    </motion.div>
                 ))}
              </AnimatePresence>
              {resources.length === 0 && (
                <div className="text-center py-16 bg-slate-50/30 dark:bg-slate-900/10 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                   <p className="text-slate-400 font-bold">لم تقم بإضافة أي موارد تعليمية لهذا الدرس بعد.</p>
                </div>
              )}
           </div>
        </div>
        
        {/* Submit */}
        <button disabled={loading} className="admin-btn-primary w-full py-8 text-2xl shadow-medical-600/20 rounded-[2.5rem]">
           {loading ? <Loader2 className="w-10 h-10 animate-spin mx-auto" /> : <><Save className="w-10 h-10" /> <span className="font-black">نشر المحاضرة وتفعيلها لِلطلاب</span></>}
        </button>
      </form>
    </motion.div>
  );
}
