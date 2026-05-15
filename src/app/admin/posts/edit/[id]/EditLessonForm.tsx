"use client";

import { updateLesson } from "@/app/actions/content";
import { useState, useEffect } from "react";
import { Save, ArrowRight, Plus, Video, FileText, Link2, Trash2, PlayCircle, GraduationCap, BookOpen, Layout, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function EditLessonForm({ lesson, categories, subjects }: { lesson: any, categories: any[], subjects: any[] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(lesson.subject?.categoryId || "");
  const router = useRouter();

  const [resources, setResources] = useState<any[]>(() => {
    const existing = [...(lesson.resources || [])];
    if (lesson.videoUrl && !existing.find(r => r.url === lesson.videoUrl)) {
      existing.push({ title: "الفيديو الأصلي", type: "VIDEO", url: lesson.videoUrl });
    }
    if (lesson.pdfUrl && !existing.find(r => r.url === lesson.pdfUrl)) {
      existing.push({ title: "ملف PDF الأصلي", type: "PDF", url: lesson.pdfUrl });
    }
    return existing;
  });

  const filteredSubjects = subjects.filter(s => s.categoryId === selectedCategoryId);

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

  async function handleEdit(formData: FormData) {
    setLoading(true);
    formData.append("resources", JSON.stringify(resources));
    
    const res = await updateLesson(lesson.id, formData);
    if (res?.error) {
      setMessage(res.error);
    } else {
      setMessage("تم حفظ التعديلات بنجاح!");
      setTimeout(() => {
        router.push("/admin/posts");
        router.refresh();
      }, 1000);
    }
    setLoading(false);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-5xl pb-20 space-y-10 text-right"
      dir="rtl"
    >
      <div className="flex items-center gap-6 mb-12">
        <Link href="/admin/posts" className="p-4 bg-white dark:bg-dark-card rounded-[1.5rem] border border-slate-200 dark:border-slate-800 hover:border-medical-500 transition-all shadow-sm">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <div>
           <h1 className="text-4xl font-black text-slate-900 dark:text-white">تعديل المحاضرة</h1>
           <p className="text-lg text-slate-500 font-medium mt-1">أنت الآن تقوم بتعديل: <span className="text-medical-600 font-black">{lesson.title}</span></p>
        </div>
      </div>
      
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`p-6 rounded-[2.5rem] border shadow-2xl font-black flex items-center gap-4 ${message.includes("بنجاح") ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}
          >
            <div className={`w-3 h-3 rounded-full ${message.includes("بنجاح") ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
            <p className="text-xl">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form action={handleEdit} className="space-y-10">
        {/* Hierarchy Section */}
        <div className="section-card p-10 relative overflow-hidden">
           <div className="flex items-center gap-4 mb-10 text-medical-600">
              <GraduationCap className="w-8 h-8" />
              <h2 className="text-2xl font-black text-slate-800 dark:text-white">تعديل الموقع الهرمي</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                 <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">السنة الدراسية</label>
                 <select 
                   title="السنة الدراسية"
                   className="admin-input appearance-none cursor-pointer" 
                   value={selectedCategoryId} 
                   onChange={(e) => setSelectedCategoryId(e.target.value)}
                   required
                 >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
              </div>
              <div className="space-y-3">
                 <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">المادة العلمية</label>
                 <select 
                   name="subjectId" 
                   title="المادة العلمية"
                   className="admin-input appearance-none cursor-pointer" 
                   defaultValue={lesson.subjectId}
                   required
                 >
                    {filteredSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                 </select>
              </div>
           </div>
        </div>

        {/* Content Section */}
        <div className="section-card p-10">
           <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-medical-50 dark:bg-medical-500/10 rounded-2xl">
                 <Layout className="w-8 h-8 text-medical-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white">تفاصيل المحاضرة</h2>
           </div>
           <div className="space-y-8">
              <div className="space-y-3">
                 <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">عنوان الدرس</label>
                 <input name="title" title="عنوان الدرس" placeholder="عنوان الدرس" defaultValue={lesson.title} required className="admin-input" />
              </div>
              <div className="space-y-3">
                 <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">الوصف الدراسي</label>
                 <textarea name="description" title="الوصف الدراسي" placeholder="الوصف الدراسي" defaultValue={lesson.description || ""} className="admin-input min-h-[140px]" />
              </div>
           </div>
        </div>

        {/* Resources Section */}
        <div className="section-card p-10 border-indigo-500/10">
           <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
              <h2 className="text-2xl font-black flex items-center gap-4">
                 <Link2 className="w-8 h-8 text-indigo-600" />
                 إدارة الموارد والملحقات
              </h2>
              <button type="button" onClick={addResourceRow} className="admin-btn-secondary px-8 py-3 text-sm group">
                 <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                 إضافة مورد جديد
              </button>
           </div>
           <div className="space-y-6">
              {resources.map((res, index) => (
                 <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-5 p-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-[2rem] border border-slate-100 dark:border-slate-800 group shadow-sm transition-all hover:border-medical-500/20">
                    <div className="md:col-span-4 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">عنوان المورد</label>
                       <input value={res.title} onChange={(e) => updateResource(index, "title", e.target.value)} className="admin-input py-3 text-sm" placeholder="عنوان المورد" />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">نوع الملف</label>
                       <select title="نوع المورد" value={res.type} onChange={(e) => updateResource(index, "type", e.target.value)} className="admin-input py-3 text-sm appearance-none cursor-pointer">
                          <option value="VIDEO">فيديو</option>
                          <option value="PDF">ملف PDF</option>
                          <option value="SUMMARY">ملخص</option>
                          <option value="LINK">رابط خارجي</option>
                       </select>
                    </div>
                    <div className="md:col-span-4 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">الرابط المباشر</label>
                       <input value={res.url} onChange={(e) => updateResource(index, "url", e.target.value)} className="admin-input py-3 text-sm" placeholder="الرابط" dir="ltr" />
                    </div>
                    <div className="md:col-span-1 flex items-end justify-center pb-2">
                       <button type="button" title="حذف المورد" aria-label="حذف المورد" onClick={() => removeResourceRow(index)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all shadow-sm">
                          <Trash2 className="w-6 h-6" />
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
        
        <button disabled={loading} className="admin-btn-primary w-full py-8 text-2xl shadow-medical-600/20 rounded-[2.5rem]">
           {loading ? <Loader2 className="w-10 h-10 animate-spin mx-auto" /> : <><Save className="w-10 h-10" /> <span className="font-black">حفظ كافة التعديلات النهائية</span></>}
        </button>
      </form>
    </motion.div>
  );
}
