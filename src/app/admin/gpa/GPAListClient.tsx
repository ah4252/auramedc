"use client";

import { useState } from "react";
import { User, Clock, Calculator, X, FileText, CheckCircle2 } from "lucide-react";
import DeleteGPAButton from "./DeleteGPAButton";

export default function GPAListClient({ initialCalculations }: { initialCalculations: any[] }) {
  const [selectedCalc, setSelectedCalc] = useState<any>(null);

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
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-medical-600" />
            نتائج الطلاب المحفوظة
          </h2>
          <span className="bg-medical-100 dark:bg-medical-900/30 text-medical-700 dark:text-medical-400 text-sm font-bold px-3 py-1 rounded-full">
            {initialCalculations.length} نتيجة
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/20 text-slate-500 text-sm">
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
                return (
                  <tr key={calc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
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
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <Calculator className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                    <p className="text-lg">لا توجد نتائج معدلات محفوظة حتى الآن.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
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
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
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
