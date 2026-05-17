"use client";

import { useState } from "react";
import { Plus, Trash2, Calendar, BookOpen, Calculator, Edit, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { createGPAYear, deleteGPAYear, createGPASubject, deleteGPASubject } from "@/app/actions/gpaAdmin";
import { useRouter } from "next/navigation";

export default function GpaAdminClient({ initialYears }: { initialYears: any[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Year State
  const [newYearName, setNewYearName] = useState("");
  const [newYearSlug, setNewYearSlug] = useState("");

  // Subject State
  const [activeYearId, setActiveYearId] = useState<string | null>(initialYears[0]?.id || null);
  const [newSubName, setNewSubName] = useState("");
  const [newSubCoef, setNewSubCoef] = useState<number>(1);

  const handleAddYear = async () => {
    if (!newYearName || !newYearSlug) return;
    setLoading(true);
    const res = await createGPAYear(newYearName, newYearSlug);
    if (res.success) {
      setNewYearName("");
      setNewYearSlug("");
      router.refresh();
    }
    setLoading(false);
  };

  const handleDeleteYear = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه السنة وجميع موادها؟")) return;
    setLoading(true);
    await deleteGPAYear(id);
    router.refresh();
    if (activeYearId === id) setActiveYearId(null);
    setLoading(false);
  };

  const handleAddSubject = async () => {
    if (!activeYearId || !newSubName || newSubCoef < 1) return;
    setLoading(true);
    const res = await createGPASubject(activeYearId, newSubName, newSubCoef);
    if (res.success) {
      setNewSubName("");
      setNewSubCoef(1);
      router.refresh();
    }
    setLoading(false);
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المادة؟")) return;
    setLoading(true);
    await deleteGPASubject(id);
    router.refresh();
    setLoading(false);
  };

  const activeYear = initialYears.find(y => y.id === activeYearId);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-medical-100 dark:bg-medical-900/30 text-medical-600 rounded-[2rem] shadow-lg shadow-medical-600/10">
            <Calculator className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">تحرير الالة حاسبة</h1>
            <p className="text-slate-500 font-medium text-lg">إدارة السنوات والمواد لحاسبة المعدل التراكمي</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Years Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-dark-card p-6 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-medical-600" />
              السنوات / التخصصات
            </h2>
            
            <div className="space-y-4 mb-8">
              {initialYears.map(y => (
                <div 
                  key={y.id}
                  onClick={() => setActiveYearId(y.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${activeYearId === y.id ? "border-medical-500 bg-medical-50 dark:bg-medical-900/20" : "border-slate-100 dark:border-slate-800 hover:border-medical-200"}`}
                >
                  <div className="font-bold text-slate-700 dark:text-slate-300">{y.name}</div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteYear(y.id); }}
                    disabled={loading}
                    title="حذف السنة"
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {initialYears.length === 0 && (
                <div className="text-center text-slate-400 py-4 text-sm">لا توجد سنوات مضافة</div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-500 mb-4">إضافة سنة جديدة</h3>
              <div className="space-y-3">
                <input 
                  placeholder="اسم السنة (مثال: السنة الأولى طب)"
                  value={newYearName}
                  onChange={e => setNewYearName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-medical-500 text-sm font-bold"
                />
                <input 
                  placeholder="رابط السنة (مثال: year-1)"
                  value={newYearSlug}
                  onChange={e => setNewYearSlug(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-medical-500 text-sm font-bold"
                  dir="ltr"
                />
                <button 
                  onClick={handleAddYear}
                  disabled={loading || !newYearName || !newYearSlug}
                  className="w-full py-3 bg-medical-600 hover:bg-medical-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-medical-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  إضافة
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Section */}
        <div className="lg:col-span-2">
          {activeYearId ? (
            <div className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-medical-600" />
                    المواد والمعاملات
                  </h2>
                  <p className="text-slate-500 mt-2">إدارة مواد: <span className="font-bold text-medical-600">{activeYear?.name}</span></p>
                </div>
                <div className="bg-medical-50 dark:bg-medical-900/20 text-medical-600 px-4 py-2 rounded-xl font-bold text-sm">
                  {activeYear?.subjects?.length || 0} مواد
                </div>
              </div>

              {/* Table of subjects */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden mb-8">
                <table className="w-full text-right">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="p-4 font-bold text-slate-600 dark:text-slate-300">اسم المادة</th>
                      <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-center w-24">المعامل</th>
                      <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-center w-24">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeYear?.subjects?.map((sub: any) => (
                      <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{sub.name}</td>
                        <td className="p-4 text-center">
                          <span className="bg-medical-100 dark:bg-medical-900/30 text-medical-700 px-3 py-1 rounded-lg font-black inline-block min-w-[3rem]">
                            {sub.coefficient}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleDeleteSubject(sub.id)}
                            disabled={loading}
                            title="حذف المادة"
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!activeYear?.subjects || activeYear.subjects.length === 0) && (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-slate-400">لا توجد مواد مضافة لهذه السنة</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add subject form */}
              <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-medical-600" />
                  إضافة مادة جديدة بالجدول
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    placeholder="اسم المادة"
                    value={newSubName}
                    onChange={e => setNewSubName(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-medical-500 font-bold"
                  />
                  <input 
                    type="number"
                    placeholder="المعامل"
                    value={newSubCoef || ""}
                    onChange={e => setNewSubCoef(parseInt(e.target.value) || 0)}
                    min={1}
                    className="w-full sm:w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-medical-500 text-center font-bold"
                  />
                  <button 
                    onClick={handleAddSubject}
                    disabled={loading || !newSubName || newSubCoef < 1}
                    className="py-3 px-6 bg-medical-600 hover:bg-medical-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-medical-600/20 disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "إضافة"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 dark:bg-dark-card border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] text-slate-400 p-10 text-center">
              <Calculator className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
              <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2">الرجاء تحديد سنة</h3>
              <p className="text-sm max-w-sm">اختر سنة من القائمة الجانبية أو قم بإضافة سنة جديدة للبدء في إدارة المواد ومعاملاتها</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
