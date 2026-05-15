"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Clock, Plus, Trash2, Save, LogIn, AlertCircle, ChevronRight, ChevronLeft, Trash, Copy, Home, CheckCircle2, Circle, Calendar, FileText, Download, Award, Star, Laptop } from "lucide-react";
import { saveTimetable } from "@/app/actions/timetable";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function TimetableClient({ initialData, isUser }: { initialData: any, isUser: boolean }) {
  const days = [
    { ar: "الأحد", en: "Sun" },
    { ar: "الاثنين", en: "Mon" },
    { ar: "الثلاثاء", en: "Tue" },
    { ar: "الأربعاء", en: "Wed" },
    { ar: "الخميس", en: "Thu" },
    { ar: "الجمعة", en: "Fri" },
    { ar: "السبت", en: "Sat" }
  ];

  const [schedule, setSchedule] = useState(initialData || {});
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [reportId, setReportId] = useState("AM-00000");
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReportId(`AM-${Math.floor(Math.random() * 100000)}`);
  }, []);

  const stats = useMemo(() => {
    let total = 0;
    let completed = 0;
    Object.values(schedule).forEach((dayTasks: any) => {
      dayTasks.forEach((task: any) => {
        total++;
        if (task.completed) completed++;
      });
    });
    return { total, completed };
  }, [schedule]);

  const addTask = (day: string) => {
    const newTask = {
      id: Date.now().toString(),
      time: "",
      subject: "",
      completed: false
    };
    setSchedule({
      ...schedule,
      [day]: [...(schedule[day] || []), newTask]
    });
  };

  const removeTask = (day: string, id: string) => {
    setSchedule({
      ...schedule,
      [day]: schedule[day].filter((task: any) => task.id !== id)
    });
  };

  const toggleTask = (day: string, id: string) => {
    setSchedule({
      ...schedule,
      [day]: schedule[day].map((task: any) => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    });
  };

  const updateTask = (day: string, id: string, field: string, value: string) => {
    setSchedule({
      ...schedule,
      [day]: schedule[day].map((task: any) => 
        task.id === id ? { ...task, [field]: value } : task
      )
    });
  };

  const clearWeek = () => {
    if (confirm("هل أنت متأكد من مسح جدول الأسبوع بالكامل؟")) {
      const reset: Record<string, any[]> = {};
      days.forEach(d => reset[d.ar] = []);
      setSchedule(reset);
    }
  };

  const handleExport = async () => {
    if (!certificateRef.current) return;
    setExportLoading(true);
    try {
      const h2c = (window as any).html2canvas;
      if (!h2c) {
        setMessage({ type: 'error', text: "جاري تحميل محرك التصدير..." });
        setExportLoading(false);
        return;
      }
      const element = certificateRef.current;
      element.style.display = "block"; 
      const canvas = await h2c(element, {
        scale: 2, 
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      element.style.display = "none";
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `AuraMed_Schedule_${new Date().getTime()}.png`;
      link.click();
      setMessage({ type: 'success', text: "تم تحميل الجدول كصورة بنجاح! 📸" });
    } catch (error) {
      setMessage({ type: 'error', text: "حدث خطأ أثناء التصدير" });
    } finally {
      setExportLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSave = async () => {
    if (!isUser || loading) return;
    setLoading(true);
    try {
      const res = await saveTimetable(schedule);
      if (res && res.success) {
        setMessage({ type: 'success', text: "تم حفظ بياناتك بنجاح! ✅" });
      } else {
        setMessage({ type: 'error', text: res?.error || "حدث خطأ أثناء الحفظ" });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "تعذر الاتصال بالسيرفر" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const progressWidth = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="w-full bg-[#050505] min-h-screen text-white p-4 md:p-12 font-sans relative">
      <div className="max-w-[1600px] mx-auto">
        
        {/* --- MOBILE RESTRICTION OVERLAY --- */}
        <div className="md:hidden flex flex-col items-center justify-center py-20 px-6 text-center" dir="rtl">
           <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center border border-blue-500/20 mb-8 animate-pulse">
              <Laptop className="w-12 h-12 text-blue-500" />
           </div>
           <h2 className="text-3xl font-black mb-4 leading-tight">استمتع بـ <span className="text-blue-500">أفخم تجربة</span></h2>
           <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
             للحصول على أفضل تجربة تنظيم وتخطيط، نوصيك بفتح جدول الدراسة من خلال جهاز الكمبيوتر الخاص بك. المخطط التفاعلي صُمم لِيمنحك تحكماً كاملاً على الشاشات الكبيرة.
           </p>
        </div>

        {/* --- REFINED HEADER SECTION (HIDDEN ON MOBILE) --- */}
        <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-8 mb-16 text-right" dir="rtl">
          <div className="relative">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-[80px]"></div>
             
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-md"
             >
               <Calendar className="w-3.5 h-3.5" /> منظم الوقت الشخصي
             </motion.div>
             
             <motion.h1 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-6"
             >
               نظم <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">جدولك</span> الدراسي بذكاء
             </motion.h1>
             
             <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed opacity-80">
               أداة تفاعلية تتيح لك تخطيط يومك، تحديد مهامك الدراسية، وحفظها للوصول إليها في أي وقت ومن أي مكان.
             </p>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-6">
             <div className="text-right border-r-2 border-blue-500/30 pr-6 py-1">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">إنجاز الأسبوع</p>
                <div className="flex items-center gap-3">
                   <span className="text-2xl font-black text-white">{Math.round(progressWidth)}%</span>
                   <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressWidth}%` }}
                        className="h-full bg-blue-500"
                      />
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="hidden md:block">
        {!isUser && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-[2rem] mb-10 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md" dir="rtl">
            <div className="flex items-center gap-4 text-amber-500 text-right">
               <AlertCircle className="w-6 h-6" />
               <div>
                  <p className="text-lg font-black italic">ملاحظة هامة للزوار</p>
                  <p className="text-sm font-medium opacity-80">يمكنك تجربة تنظيم جدولك، ولكن لحفظ بياناتك يرجى تسجيل الدخول.</p>
               </div>
            </div>
            <a href="/login" className="flex items-center gap-2 px-8 py-3 bg-amber-500 text-[#1a1f2e] rounded-xl font-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20">
              <LogIn className="w-5 h-5" /> تسجيل الدخول الآن
            </a>
          </div>
        )}

        {/* Main Schedule Grid */}
        <div className="overflow-x-auto pb-10 scrollbar-hide" dir="rtl">
           <div className="grid grid-cols-7 gap-px bg-slate-800/20 rounded-[3rem] border border-slate-800/50 overflow-hidden min-w-[1200px] shadow-2xl">
              {days.map((day, idx) => {
                const isToday = new Date().getDay() === idx;
                return (
                  <div key={day.ar} className={`flex flex-col min-h-[650px] transition-all duration-700 ${isToday ? 'bg-blue-600/[0.03] ring-1 ring-inset ring-blue-500/10' : 'bg-[#0a0c14]'}`}>
                    <div className={`p-8 text-center border-b transition-all duration-700 ${
                      isToday 
                        ? 'bg-blue-600 text-white shadow-[0_15px_40px_-10px_rgba(37,99,235,0.4)] border-blue-400/20 z-10' 
                        : 'bg-slate-900/20 text-slate-500 border-slate-800/40'
                    }`}>
                        <div className="flex flex-col items-center gap-1.5">
                          <h3 className={`text-2xl font-black leading-none tracking-tight ${isToday ? 'text-white' : 'text-slate-300'}`}>{day.ar}</h3>
                          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isToday ? 'text-blue-100/60' : 'text-slate-600'}`}>{day.en}</p>
                        </div>
                    </div>
                    <div className="flex-1 p-5 space-y-5">
                        {schedule[day.ar]?.map((task: any) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={task.id} 
                            className={`p-5 rounded-[2rem] border transition-all relative group ${task.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/5 hover:border-blue-500/30'}`}
                          >
                            <div className="flex flex-col items-center gap-4">
                                <input 
                                  type="text" 
                                  value={task.time}
                                  onChange={(e) => updateTask(day.ar, task.id, 'time', e.target.value)}
                                  placeholder="00:00"
                                  className="w-full bg-transparent border-none text-[11px] font-black text-center text-slate-500 outline-none placeholder:text-slate-700"
                                />
                                <textarea 
                                  value={task.subject}
                                  onChange={(e) => updateTask(day.ar, task.id, 'subject', e.target.value)}
                                  placeholder="المهمة..."
                                  rows={2}
                                  className={`w-full bg-transparent border-none text-center text-lg font-black outline-none resize-none leading-snug ${task.completed ? 'text-emerald-500/60 line-through' : 'text-white'}`}
                                />
                                <div className="flex items-center gap-5 pt-3 opacity-0 group-hover:opacity-100 transition-all">
                                  <button title="تبديل الحالة" aria-label="تبديل الحالة" onClick={() => toggleTask(day.ar, task.id)} className="transition-transform hover:scale-125">
                                      {task.completed ? <CheckCircle2 className="w-6 h-6 text-emerald-500 shadow-emerald-500/20" /> : <Circle className="w-6 h-6 text-slate-700 hover:text-blue-500" />}
                                  </button>
                                  <button title="حذف المهمة" aria-label="حذف المهمة" onClick={() => removeTask(day.ar, task.id)} className="text-slate-700 hover:text-rose-500 transition-colors">
                                      <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                            </div>
                          </motion.div>
                        ))}
                        <button 
                          title="إضافة مهمة جديدة" aria-label="إضافة مهمة جديدة"
                          onClick={() => addTask(day.ar)}
                          className="w-full py-8 rounded-[2rem] border-2 border-dashed border-slate-900 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all flex items-center justify-center group"
                        >
                          <Plus className="w-8 h-8 text-slate-800 group-hover:text-blue-500 group-hover:rotate-90 transition-all duration-500" />
                        </button>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Footer Actions Section */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-16" dir="rtl">
           {isUser && (
             <div className="flex flex-wrap items-center justify-center gap-4">
                <button onClick={handleExport} disabled={exportLoading} className="px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-[2rem] font-black flex items-center gap-3 transition-all border border-slate-800 disabled:opacity-50 shadow-xl">
                   {exportLoading ? <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> : <Download className="w-6 h-6 text-blue-500" />}
                   تحميل الجدول كصورة
                </button>
                <button onClick={handleSave} disabled={loading} className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black flex items-center gap-3 transition-all shadow-2xl shadow-blue-600/30 disabled:opacity-50">
                   {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-6 h-6" />}
                   حفظ كافة التغييرات
                </button>
                <button onClick={clearWeek} className="px-10 py-5 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-[2rem] font-black flex items-center gap-3 transition-all border border-rose-500/20">
                   <Trash className="w-6 h-6" /> مسح الأسبوع
                </button>
             </div>
           )}
        </div>
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-10 py-5 rounded-[2rem] font-black shadow-2xl z-[100] ${message.type === 'success' ? 'bg-blue-600' : 'bg-rose-600'}`}>
             {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* eslint-disable-next-line react/forbid-dom-props */}
      <div ref={certificateRef} style={{ display: "none" }} className="fixed top-[-9999px] left-[-9999px] w-[1200px] bg-white p-10 text-right rtl font-sans certificate-export-root">
        <div className="border-[2px] border-slate-100 shadow-2xl p-10 h-full relative bg-white rounded-[2rem] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-teal-500"></div>
          <div className="flex justify-between items-center border-b border-slate-50 pb-8 mb-10">
            <div className="flex items-center gap-6">
              <Calendar className="w-12 h-12 text-blue-600" />
              <div>
                <h1 className="text-3xl font-black text-slate-900 leading-none mb-1">Aura<span className="text-blue-600">Med</span></h1>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Medical Study Systems</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase">Issue ID: {reportId}</p>
              <p className="text-xs font-black text-slate-800">{new Date().toLocaleDateString('ar-DZ')}</p>
            </div>
          </div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">مخطط الدراسة الأسبوعي</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-7 gap-3 mb-10 items-start">
            {days.map((day, idx) => (
              <div key={idx} className="bg-slate-50/50 rounded-3xl overflow-hidden border border-slate-100 flex flex-col">
                <div className="p-4 text-center bg-blue-600 text-white">
                  <h3 className="text-base font-black">{day.ar}</h3>
                  <p className="text-[8px] font-black opacity-60 uppercase tracking-widest">{day.en}</p>
                </div>
                <div className="p-3 space-y-2 h-auto">
                  {schedule[day.ar]?.map((task: any) => (
                    <div key={task.id} className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <p className="text-[8px] font-black text-blue-600 mb-1 flex items-center gap-1">
                        <Clock className="w-2 h-2" /> {task.time || "غير محدد"}
                      </p>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {task.subject}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
             <div className="relative z-10 flex justify-between items-center">
                <div className="flex items-center gap-6">
                   <Star className="w-8 h-8 text-blue-400 fill-blue-400/20" />
                   <p className="text-2xl font-black italic">"النجاح هو نتيجة الانضباط اليومي"</p>
                </div>
                <p className="text-[10px] text-blue-400 font-black tracking-tighter">AuraMed Systems</p>
             </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .certificate-export-root * { font-family: 'Arial', 'Tahoma', sans-serif !important; }
        @media print {
          html, body { background: white !important; color: black !important; visibility: visible !important; }
          body * { visibility: hidden !important; }
          .certificate-export-root, .certificate-export-root * { visibility: visible !important; }
        }
      `}</style>
    </div>
  );
}
