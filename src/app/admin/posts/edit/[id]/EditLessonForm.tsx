"use client";

import { updateLesson } from "@/app/actions/content";
import { useState } from "react";
import { Save, ArrowRight, Plus, Video, FileText, Link2, Trash2, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditLessonForm({ lesson, categories }: { lesson: any, categories: any[] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Initialize with existing resources and legacy fields
  const [resources, setResources] = useState<any[]>(() => {
    const existing = [...(lesson.resources || [])];
    
    // Migrate legacy fields if they exist and aren't already in resources
    if (lesson.videoUrl && !existing.find(r => r.url === lesson.videoUrl)) {
      existing.push({ title: "الفيديو الأصلي", type: "VIDEO", url: lesson.videoUrl });
    }
    if (lesson.pdfUrl && !existing.find(r => r.url === lesson.pdfUrl)) {
      existing.push({ title: "ملف PDF الأصلي", type: "PDF", url: lesson.pdfUrl });
    }
    if (lesson.summaryUrl && !existing.find(r => r.url === lesson.summaryUrl)) {
      existing.push({ title: "الملخص الأصلي", type: "SUMMARY", url: lesson.summaryUrl });
    }
    
    return existing;
  });

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
    // Append resources to the form data
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
    <div className="max-w-4xl animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/posts" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">تعديل الدرس: {lesson.title}</h1>
      </div>
      
      <div className="bg-white dark:bg-dark-card p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        {message && (
          <div className={`mb-6 p-4 rounded-xl font-bold flex items-center gap-2 ${message.includes("بنجاح") ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            <div className={`w-2 h-2 rounded-full ${message.includes("بنجاح") ? 'bg-green-500' : 'bg-red-500'}`} />
            {message}
          </div>
        )}

        <form action={handleEdit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">عنوان الدرس</label>
              <input name="title" defaultValue={lesson.title} required className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">السنة الدراسية</label>
              <select name="categoryId" defaultValue={lesson.subject?.categoryId} required className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">وصف الدرس</label>
            <textarea name="description" defaultValue={lesson.description || ""} className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[120px]" />
          </div>

          {/* --- Multi-Resource Section (New) --- */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Link2 className="w-5 h-5 text-blue-600" />
                الموارد والملحقات (فيديوهات، ملفات، إلخ)
              </h3>
              <button 
                type="button" 
                onClick={addResourceRow}
                className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
              >
                <Plus className="w-4 h-4" />
                إضافة مورد جديد
              </button>
            </div>

            <div className="space-y-3">
              {resources.map((res, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/30 group animate-slide-in">
                  <div className="md:col-span-3">
                    <input 
                      placeholder="عنوان المورد (مثلاً: شرح الفيديو)" 
                      value={res.title}
                      onChange={(e) => updateResource(index, "title", e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div className="md:col-span-3">
                    <select 
                      value={res.type}
                      onChange={(e) => updateResource(index, "type", e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="VIDEO">فيديو (YouTube)</option>
                      <option value="PDF">ملف PDF</option>
                      <option value="SUMMARY">ملخص الدرس</option>
                      <option value="LINK">رابط خارجي</option>
                    </select>
                  </div>
                  <div className="md:col-span-5">
                    <input 
                      placeholder="رابط المورد (URL)" 
                      value={res.url}
                      onChange={(e) => updateResource(index, "url", e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                      dir="ltr"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => removeResourceRow(index)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {resources.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-sm">
                  لا توجد موارد إضافية لهذا الدرس حالياً. اضغط "إضافة مورد جديد" للبدء.
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-8 flex justify-end">
            <button 
              type="submit" 
              disabled={loading} 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-10 py-4 rounded-xl font-black transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <Save className="w-5 h-5" />
              {loading ? "جاري الحفظ..." : "حفظ التعديلات النهائية"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
