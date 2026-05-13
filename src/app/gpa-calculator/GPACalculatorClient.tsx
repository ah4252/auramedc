"use client";

import { useState, useRef, useEffect } from "react";
import { Calculator, Plus, Trash2, RotateCcw, GraduationCap, Award, Info, Download, Loader2, FileText, CheckCircle2, Star, Calendar, UserCheck, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { saveGPA } from "@/app/actions/content";

interface Subject {
  id: number;
  name: string;
  grade: number;
  coefficient: number;
}

declare global {
  interface Window {
    html2canvas: any;
  }
}

export default function GPACalculatorClient({ userId, initialData }: { userId: string | null, initialData: any }) {
  const [subjects, setSubjects] = useState<Subject[]>(
    initialData?.subjects || [{ id: Date.now(), name: "", grade: 10, coefficient: 1 }]
  );
  const [saveLoading, setSaveLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [reportId, setReportId] = useState("MP-00000");
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReportId(`MP-${Math.floor(Math.random() * 100000)}`);
  }, []);

  const addSubject = () => {
    setSubjects([...subjects, { id: Date.now(), name: "", grade: 10, coefficient: 1 }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id: number, field: keyof Subject, value: any) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const reset = () => {
    setSubjects([{ id: Date.now(), name: "", grade: 10, coefficient: 1 }]);
  };

  const calculateGPA = () => {
    let weightedSum = 0;
    let totalCoefficients = 0;
    subjects.forEach(s => {
      weightedSum += s.grade * s.coefficient;
      totalCoefficients += s.coefficient;
    });
    return totalCoefficients === 0 ? "0.00" : (weightedSum / totalCoefficients).toFixed(2);
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaveLoading(true);
    const res = await saveGPA(userId, calculateGPA(), subjects);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert(res.error);
    }
    setSaveLoading(false);
  };

  const handleExport = async () => {
    if (!certificateRef.current) return;
    setExportLoading(true);
    
    try {
      const element = certificateRef.current;
      element.style.display = "block"; 
      
      const canvas = await window.html2canvas(element, {
        scale: 2, 
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      
      element.style.display = "none";
      
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `MedPulse_Result_${new Date().getTime()}.png`;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
      alert("حدث خطأ أثناء تصدير النتيجة");
    } finally {
      setExportLoading(false);
    }
  };

  const gpa = calculateGPA();
  const gpaValue = parseFloat(gpa);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg py-12 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-medical-500/5 rounded-full -mr-64 -mt-64 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full -ml-64 -mb-64 blur-3xl"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-medical-600 to-medical-400 text-white shadow-xl shadow-medical-600/30 mb-6"
          >
            <Calculator className="w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">حاسبة المعدل التراكمي</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">احسب معدلك الفصلي بسهولة وبدقة عالية للمسارات الطبية</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-medical-600" />
                  قائمة المواد
                </h2>
                <button 
                  onClick={reset}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                  title="إعادة تعيين"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {subjects.map((subject, index) => (
                    <motion.div 
                      key={subject.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-4 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 group"
                    >
                      <div className="md:col-span-1 hidden md:flex justify-center text-slate-300 font-bold italic">
                        {index + 1}
                      </div>
                      <div className="md:col-span-5">
                        <label className="block md:hidden text-[10px] font-bold text-slate-400 mb-1">اسم المادة</label>
                        <input 
                          placeholder="اسم المادة (اختياري)"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-medical-500 transition-all text-sm"
                          value={subject.name}
                          onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                        />
                      </div>
                      {/* Grid for Grade and Coefficient on mobile */}
                      <div className="md:col-span-5 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block md:hidden text-[10px] font-bold text-slate-400 mb-1">العلامة</label>
                          <input 
                            type="number"
                            placeholder="العلامة"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-medical-500 transition-all text-sm font-bold text-center md:text-right"
                            value={subject.grade}
                            onChange={(e) => updateSubject(subject.id, "grade", parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block md:hidden text-[10px] font-bold text-slate-400 mb-1">المعامل</label>
                          <input 
                            type="number"
                            placeholder="المعامل"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-medical-500 transition-all text-sm text-center font-bold"
                            value={subject.coefficient}
                            onChange={(e) => updateSubject(subject.id, "coefficient", parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <div className="md:col-span-1 flex justify-center pt-2 md:pt-0">
                        <button 
                          onClick={() => removeSubject(subject.id)}
                          className="p-2 text-slate-300 hover:text-red-500 bg-white dark:bg-slate-900 md:bg-transparent rounded-xl border border-slate-100 md:border-0 transition-colors w-full md:w-auto flex justify-center"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <button 
                onClick={addSubject}
                className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-medical-600 hover:border-medical-600 hover:bg-medical-50 dark:hover:bg-medical-900/10 transition-all flex items-center justify-center gap-2 font-bold"
              >
                <Plus className="w-5 h-5" />
                إضافة مادة جديدة
              </button>
            </div>
          </div>

          {/* Result Card */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-24">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Award className="w-6 h-6 text-medical-600" />
                النتيجة المتوقعة
              </h3>

              <div className="relative flex flex-col items-center py-10">
                {/* GPA Ring Decor */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-48 h-48 rounded-full border-[12px] border-slate-100 dark:border-slate-800"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <motion.div 
                     initial={{ rotate: -90 }}
                     animate={{ rotate: (gpaValue / 20) * 360 - 90 }}
                     className="w-48 h-48 rounded-full border-[12px] border-medical-500 border-t-transparent border-l-transparent transition-all duration-700"
                   ></motion.div>
                </div>
                
                <span className="text-5xl font-black text-slate-900 dark:text-white z-10">{gpa}</span>
                <span className="text-sm font-bold text-slate-500 mt-2 z-10 uppercase tracking-widest">معدلك العام</span>
              </div>

              {!userId && (
                <div className="mt-8 p-6 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-medical-500/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-medical-500/30 transition-all"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-medical-500 rounded-lg">
                        <Star className="w-4 h-4 text-white fill-current" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-medical-400">مميزات حصرية للمسجلين</span>
                    </div>
                    
                    <h4 className="text-lg font-bold mb-4 leading-tight">سجل الآن لفتح كافة المميزات!</h4>
                    
                    <ul className="space-y-3 mb-6">
                      {[
                        { icon: Database, text: "حفظ وأرشفة جميع معدلاتك السابقة" },
                        { icon: Download, text: "تحميل كشف النقاط كصورة احترافية" },
                        { icon: Calendar, text: "متابعة تطور مستواك الدراسي" },
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                          <item.icon className="w-4 h-4 text-medical-500" />
                          <span className="font-medium">{item.text}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/register" className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-center block hover:bg-medical-500 hover:text-white transition-all shadow-lg active:scale-95">
                      إنشاء حساب مجاني
                    </Link>
                  </div>
                </div>
              )}

              {userId && (
                <div className="space-y-3 mt-6">
                  <button 
                    onClick={handleSave}
                    disabled={saveLoading}
                    className={`w-full py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                      saveSuccess 
                      ? "bg-green-100 text-green-700 border border-green-200" 
                      : "bg-medical-600 hover:bg-medical-700 text-white shadow-lg shadow-medical-600/30 disabled:opacity-50"
                    }`}
                  >
                    {saveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : saveSuccess ? "تم الحفظ بنجاح! ✓" : "حفظ النتيجة في حسابي"}
                  </button>

                  <button 
                    onClick={handleExport}
                    disabled={exportLoading}
                    className="w-full py-3 rounded-2xl font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {exportLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5 text-medical-600" />
                    )}
                    تحميل النتيجة كصورة
                  </button>
                </div>
              )}

              <div className="mt-10 p-6 rounded-3xl bg-medical-50 dark:bg-medical-900/20 text-medical-700 dark:text-medical-400 text-center">
                <p className="text-sm font-bold">
                  {gpaValue >= 16 ? "ممتاز جداً، استمر يا بطل! 🌟" :
                   gpaValue >= 14 ? "جيد جداً، أداء رائع! ✨" :
                   gpaValue >= 12 ? "جيد، واصل الجهد! 💪" :
                   gpaValue >= 10 ? "مقبول، يمكنك التحسن! 👍" :
                   "لا تيأس، المرة القادمة أفضل! ❤️"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- REFINED CERTIFICATE (COMPACT & STRUCTURED) --- */}
      <div 
        ref={certificateRef}
        style={{ display: "none" }}
        className="fixed top-[-9999px] left-[-9999px] w-[800px] bg-white p-8 text-right rtl"
      >
        <div className="border-[4px] border-medical-600 p-8 h-full relative bg-white shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center border-b-2 border-medical-100 pb-6 mb-8">
            <div className="flex items-center gap-4">
              {/* Logo Emblem (Inline for guaranteed export rendering) */}
              <div className="w-16 h-16 shrink-0">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="48" stroke="#0ea5e9" strokeWidth="4" fill="none"/>
                  <circle cx="50" cy="50" r="40" fill="#0f172a"/>
                  <path d="M35 30 C35 30 28 30 28 40 L28 55 C28 64 36 70 44 70 C52 70 58 64 58 55 L58 52" stroke="#0ea5e9" strokeWidth="6" strokeLinecap="round" fill="none"/>
                  <circle cx="65" cy="46" r="10" stroke="#f59e0b" strokeWidth="4" fill="#0f172a"/>
                  <circle cx="65" cy="46" r="4" fill="#f59e0b"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black text-medical-600 tracking-wider italic leading-none">Aura<span className="not-italic font-light">Med</span></h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Elite Medical Education Systems</p>
              </div>
            </div>
            <div className="text-left text-xs text-slate-500 font-medium">
              <p>تاريخ الإصدار: {new Date().toLocaleDateString('ar-DZ')}</p>
              <p>رقم الكشف: {reportId}</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">كشف نقاط المعدل الفصلي التقديري</h2>
            <div className="w-24 h-1 bg-medical-500 mx-auto mt-2 rounded-full opacity-20"></div>
          </div>

          {/* 1. Subject Table */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-medical-600" />
              تفاصيل المواد والنتائج:
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm">
                  <th className="border border-slate-100 p-4 text-right rounded-tr-xl">المادة</th>
                  <th className="border border-slate-100 p-4 text-center">المعامل</th>
                  <th className="border border-slate-100 p-4 text-center">العلامة</th>
                  <th className="border border-slate-100 p-4 text-center rounded-tl-xl">المجموع</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s, i) => (
                  <tr key={i} className="text-slate-800 border-b border-slate-50">
                    <td className="p-4 font-medium">{s.name || `مادة ${i+1}`}</td>
                    <td className="p-4 text-center">{s.coefficient}</td>
                    <td className="p-4 text-center font-bold text-medical-600">{s.grade}</td>
                    <td className="p-4 text-center font-bold">{(s.grade * s.coefficient).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. Final Result (Nuclear Fix for Arabic Rendering) */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-medical-900 to-slate-900 p-10 shadow-2xl mb-10 border border-white/10 text-right" dir="rtl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-medical-500/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center border border-white/20 shadow-inner shrink-0">
                  <Award className="w-10 h-10 text-medical-400" />
                </div>
                <div>
                  <p className="text-medical-400 text-xs font-bold mb-2">النتيجة النهائية للمعدل</p>
                  <h3 className="text-7xl font-black text-white tracking-tighter leading-none">{gpa}</h3>
                </div>
              </div>
              
              <div className="text-left">
                <div className="inline-block px-8 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl min-w-[200px]">
                  <span className="block text-[10px] text-slate-400 font-bold mb-1 text-right">التقدير العام</span>
                  <p className="text-3xl font-black text-medical-400 text-right">
                    {gpaValue >= 16 ? "ممتاز جداً" :
                     gpaValue >= 14 ? "جيد جداً" :
                     gpaValue >= 12 ? "جيد" :
                     gpaValue >= 10 ? "مقبول" :
                     "راسب"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* 
               CRITICAL FIX: We use a special style to prevent html2canvas 
               from mirroring or splitting the text by using standard web fonts 
               and avoiding complex layout for text-only nodes.
            */}
            <style jsx>{`
              .relative * {
                font-family: 'Arial', sans-serif !important;
                letter-spacing: normal !important;
                word-spacing: normal !important;
              }
            `}</style>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 pt-8 mt-12 text-right" dir="rtl">
            <p className="text-slate-400 text-[10px] font-bold">
              هذا المستند تم توليده آلياً ولا يعوض كشف النقاط الرسمي المسلم من طرف الهيئات الجامعية المختصة.
              <br />حقوق الطبع محفوظة لمنصة Aura Med 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
