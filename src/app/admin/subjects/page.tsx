"use client";

import { addCategory } from "@/app/actions/content";
import { useState } from "react";
import { PlusCircle, Save, GraduationCap, Stethoscope } from "lucide-react";

export default function AdminSubjectsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAdd(formData: FormData) {
    setLoading(true);
    const res = await addCategory(formData);
    if (res.error) setMessage(res.error);
    else {
      setMessage("تمت الإضافة بنجاح!");
      setTimeout(() => setMessage(""), 3000);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-5xl animate-fade-in pb-10">
      <h1 className="text-3xl font-bold mb-8">تنظيم المحتوى الأكاديمي</h1>
      
      {message && (
        <div className="mb-6 p-4 rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold animate-slide-up">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Years Form */}
        <div className="bg-white dark:bg-dark-card p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-medical-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
          
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
            <div className="p-3 bg-medical-50 dark:bg-medical-900/30 rounded-2xl">
              <GraduationCap className="w-6 h-6 text-medical-600 dark:text-medical-400" />
            </div>
            إضافة سنة دراسية
          </h2>
          
          <form action={handleAdd} className="space-y-5 relative z-10">
            <input type="hidden" name="type" value="YEAR" />
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mr-1">اسم السنة</label>
              <input 
                name="name" 
                placeholder="مثال: السنة الأولى"
                required 
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mr-1">وصف السنة</label>
              <textarea 
                name="description" 
                placeholder="نبذة عن المواد في هذه السنة..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all min-h-[120px]"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-medical-600 dark:hover:bg-medical-500 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? "جاري الحفظ..." : "حفظ السنة الدراسية"}
            </button>
          </form>
        </div>

        {/* Specialty Form */}
        <div className="bg-white dark:bg-dark-card p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
              <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            إضافة تخصص طبي
          </h2>
          
          <form action={handleAdd} className="space-y-5 relative z-10">
            <input type="hidden" name="type" value="SPECIALTY" />
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mr-1">اسم التخصص</label>
              <input 
                name="name" 
                placeholder="مثال: أمراض الباطنة"
                required 
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 mr-1">وصف التخصص</label>
              <textarea 
                name="description" 
                placeholder="وصف لمحتوى هذا التخصص..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[120px]"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? "جاري الحفظ..." : "حفظ التخصص الطبي"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
