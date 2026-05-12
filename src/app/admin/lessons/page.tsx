"use client";

import { addLesson } from "@/app/actions/content";
import { useState, useEffect } from "react";
import { PlusCircle, Save, CheckCircle2, Link2, Plus, PlayCircle, FileText, Trash2 } from "lucide-react";
import { getCategories } from "@/app/actions/content";

export default function AdminLessonsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

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
    // Add resources to formData as JSON
    formData.append("resources", JSON.stringify(resources));
    const res = await addLesson(formData);
    if (res.error) setMessage(res.error);
    else {
      setMessage("تمت إضافة الدرس مع جميع الموارد بنجاح!");
      setResources([]); // Reset resources
      (document.getElementById("lesson-form") as HTMLFormElement)?.reset();
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl animate-fade-in pb-20">
      <h1 className="text-3xl font-bold mb-6">إدارة الدروس والموارد المتعددة</h1>
      
      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-medical-600">
          <PlusCircle className="w-6 h-6" />
          إضافة درس جديد بنظام الموارد
        </h2>
        
        {message && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {message}
          </div>
        )}

        <form id="lesson-form" action={handleAdd} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 dark:text-slate-300">عنوان الدرس</label>
              <input name="title" required placeholder="مثلاً: فيزياء القلب - الجزء الأول" className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 dark:text-slate-300">السنة الدراسية</label>
              <select name="categoryId" required className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all">
                <option value="">اختر السنة...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id} className="text-black">{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 dark:text-slate-300">وصف الدرس</label>
            <textarea name="description" placeholder="اكتب تفاصيل الدرس هنا..." className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all min-h-[120px]" />
          </div>

          {/* Multiple Resources Section */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-medical-500" />
                موارد الدرس (فيديوهات، ملفات، ملخصات)
              </h3>
              <button 
                type="button" 
                onClick={addResourceRow}
                className="flex items-center gap-2 text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl font-bold hover:scale-105 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                أضف مورد جديد
              </button>
            </div>

            <div className="space-y-3">
              {resources.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 italic">
                  لم يتم إضافة موارد إضافية لهذا الدرس بعد.
                </div>
              )}
              {resources.map((res, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700 relative group animate-slide-in">
                  <div className="md:col-span-4">
                    <input 
                      placeholder="عنوان المورد (مثلاً: شرح فيديو)" 
                      value={res.title}
                      onChange={(e) => updateResource(index, "title", e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <select 
                      value={res.type}
                      onChange={(e) => updateResource(index, "type", e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                    >
                      <option value="VIDEO">فيديو</option>
                      <option value="PDF">ملف PDF</option>
                      <option value="SUMMARY">ملخص</option>
                      <option value="LINK">رابط خارجي</option>
                    </select>
                  </div>
                  <div className="md:col-span-5">
                    <input 
                      placeholder="الرابط (URL)" 
                      value={res.url}
                      onChange={(e) => updateResource(index, "url", e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                      dir="ltr"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => removeResourceRow(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-medical-600 hover:bg-medical-700 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-medical-600/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-8">
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-6 h-6" />
                <span>نشر الدرس وجميع الموارد</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
