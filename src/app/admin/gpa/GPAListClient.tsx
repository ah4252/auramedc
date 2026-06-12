"use client";

import { useState, useTransition } from "react";
import { User, Clock, Calculator, X, FileText, CheckCircle2, Trash2, Loader2, CheckSquare, Square } from "lucide-react";
import DeleteGPAButton from "./DeleteGPAButton";
import { bulkDeleteGPACalculations } from "@/app/actions/content";
import { motion, AnimatePresence } from "framer-motion";

export default function GPAListClient({ initialCalculations }: { initialCalculations: any[] }) {
  const [selectedCalc, setSelectedCalc] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const allIds = initialCalculations.map(c => c.id);
  const allSelected = allIds.length > 0 && selectedIds.size === allIds.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  };

  const handleBulkDelete = async () => {
    setBulkLoading(true);
    const ids = Array.from(selectedIds);
    const res = await bulkDeleteGPACalculations(ids);
    setBulkLoading(false);
    setShowBulkConfirm(false);
    if (res?.error) {
      alert(res.error);
    } else {
      setSelectedIds(new Set());
    }
  };

  const openModal = (calc: any) => {
    setSelectedCalc(calc);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedCalc(null);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4 bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-medical-600" />
            نتائج الطلاب المحفوظة
          </h2>
          <div className="flex items-center gap-3">
            <span className="bg-medical-100 dark:bg-medical-900/30 text-medical-700 dark:text-medical-400 text-sm font-bold px-3 py-1 rounded-full">
              {initialCalculations.length} نتيجة
            </span>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between gap-4 px-6 py-3 bg-rose-50 dark:bg-rose-900/20 border-b border-rose-200 dark:border-rose-800/50">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                  <CheckSquare className="w-4 h-4" />
                  <span>تم تحديد <strong>{selectedIds.size}</strong> من {initialCalculations.length} نتيجة</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-colors"
                  >
                    إلغاء التحديد
                  </button>
                  <button
                    onClick={() => setShowBulkConfirm(true)}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-black rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm shadow-rose-600/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف المحدد ({selectedIds.size})
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/20 text-slate-500 text-sm">
                <th className="p-4 w-12">
                  <button
                    onClick={toggleAll}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      allSelected
                        ? "text-medical-600"
                        : someSelected
                        ? "text-medical-400"
                        : "text-slate-300 dark:text-slate-600 hover:text-slate-400"
                    }`}
                    title={allSelected ? "إلغاء تحديد الكل" : "تحديد الكل"}
                  >
                    {allSelected ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : someSelected ? (
                      <CheckSquare className="w-5 h-5 opacity-50" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="p-4 font-medium">الطالب</th>
                <th className="p-4 font-medium text-center">المعدل</th>
                <th className="p-4 font-medium text-center">عدد المواد</th>
                <th className="p-4 font-medium">تاريخ الحساب</th>
                <th className="p-4 font-medium text-center">الاجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {initialCalculations.map((calc: any) => {
                const subjects = JSON.parse(calc.subjects || '[]');
                const isSelected = selectedIds.has(calc.id);
                return (
                  <tr
                    key={calc.id}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-medical-50/60 dark:bg-medical-900/10"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-4 w-12">
                      <button
                        onClick={() => toggleOne(calc.id)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          isSelected
                            ? "text-medical-600"
                            : "text-slate-300 dark:text-slate-600 hover:text-slate-400"
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="p-4 cursor-pointer group" onClick={() => openModal(calc)}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-medical-50 dark:bg-medical-900/20 flex items-center justify-center text-medical-600 dark:text-medical-400 group-hover:scale-110 transition-transform overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                          {calc.user?.image ? (
                            <img src={calc.user.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-medical-600 transition-colors">{calc.user?.name || "طالب غير معروف"}</p>
                          <p className="text-xs text-slate-500">{calc.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-lg font-bold text-medical-600 dark:text-medical-400 bg-medical-50 dark:bg-medical-900/20 px-3 py-1 rounded-lg border border-medical-100 dark:border-medical-800">
                        {calc.gpa}
                      </span>
                    </td>
                    <td className="p-4 text-center text-slate-600 dark:text-slate-400">
                      {subjects.length} مادة
                    </td>
                    <td className="p-4 text-slate-500 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span dir="ltr">{new Date(calc.createdAt).toLocaleString('ar-DZ')}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <DeleteGPAButton id={calc.id} />
                    </td>
                  </tr>
                );
              })}
              {initialCalculations.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <Calculator className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                    <p className="text-lg">لا توجد نتائج معدلات محفوظة حتى الآن.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Delete Confirmation Modal */}
      <AnimatePresence>
        {showBulkConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !bulkLoading && setShowBulkConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 text-center"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent rounded-t-[2.5rem]" />

              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              </div>

              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
                تأكيد الحذف الجماعي
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-8 leading-relaxed">
                هل أنت متأكد من حذف <strong className="text-rose-600 dark:text-rose-400">{selectedIds.size}</strong> نتيجة محددة؟
                <br />
                لا يمكن التراجع عن هذا الإجراء.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkConfirm(false)}
                  disabled={bulkLoading}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black transition-all hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkLoading}
                  className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 disabled:opacity-50"
                >
                  {bulkLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>حذف ({selectedIds.size})</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      {selectedCalc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-dark-card w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-medical-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 overflow-hidden border border-white/30 flex items-center justify-center">
                  {selectedCalc.user?.image ? (
                    <img src={selectedCalc.user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Calculator className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">تفاصيل كشف النقاط</h3>
                  <p className="text-sm text-white/80">{selectedCalc.user?.name}</p>
                </div>
              </div>
              <button title="إغلاق" aria-label="إغلاق" onClick={closeModal} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8 p-4 bg-medical-50 dark:bg-medical-900/20 rounded-2xl border border-medical-100 dark:border-medical-800">
                <div>
                  <p className="text-slate-500 text-sm mb-1">المعدل العام</p>
                  <p className="text-4xl font-black text-medical-600 dark:text-medical-400">{selectedCalc.gpa}</p>
                </div>
                <div className="text-left">
                  <p className="text-slate-500 text-sm mb-1 text-right">تاريخ الحفظ</p>
                  <p className="text-slate-700 dark:text-slate-300 font-medium" dir="ltr">
                    {new Date(selectedCalc.createdAt).toLocaleString('ar-DZ')}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  قائمة المواد والعلامات
                </h4>

                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-right">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">
                      <tr>
                        <th className="p-3 font-medium">المادة</th>
                        <th className="p-3 font-medium text-center">العلامة</th>
                        <th className="p-3 font-medium text-center">المعامل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {JSON.parse(selectedCalc.subjects || '[]').map((sub: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                          <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{sub.name}</td>
                          <td className="p-3 text-center font-bold text-medical-600 dark:text-medical-400">{sub.grade}</td>
                          <td className="p-3 text-center text-slate-500">{sub.coefficient}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
