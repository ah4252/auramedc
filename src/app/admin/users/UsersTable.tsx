"use client";

import { Users, Mail, Clock, ShieldCheck, Search, Download, KeyRound, X, Check, Trash2, Loader2, CheckSquare, Square } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DeleteUserButton from "./DeleteUserButton";
import { adminChangePassword } from "@/app/actions/auth";
import { bulkDeleteUsers } from "@/app/actions/bulkDelete";

export default function UsersTable({ initialUsers }: { initialUsers: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [studyYearFilter, setStudyYearFilter] = useState("ALL");
  const [wilayaFilter, setWilayaFilter] = useState("ALL");

  // Bulk select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Password Modal state
  const [pwModal, setPwModal] = useState<{ open: boolean; userId: string; userName: string }>({ open: false, userId: "", userName: "" });
  const [newPw, setNewPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState({ text: "", type: "" });

  const filteredUsers = useMemo(() => {
    return initialUsers.filter(user => {
      const matchesSearch = 
        (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
        (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || "");
      const matchesStudyYear = studyYearFilter === "ALL" || (user.studyYear || "").toString() === studyYearFilter;
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchesWilaya = wilayaFilter === "ALL" || (user.wilaya || "").toString() === wilayaFilter;
      return matchesSearch && matchesRole && matchesStudyYear && matchesWilaya;
    });
  }, [searchQuery, roleFilter, studyYearFilter, wilayaFilter, initialUsers]);

  const studyYears = useMemo(() => {
    const setYears = new Set<string>();
    initialUsers.forEach(u => { if (u.studyYear) setYears.add(u.studyYear); });
    return Array.from(setYears).filter(Boolean).sort();
  }, [initialUsers]);

  const wilayas = useMemo(() => {
    const setWilayas = new Set<string>();
    initialUsers.forEach(u => { if (u.wilaya) setWilayas.add(u.wilaya); });
    return Array.from(setWilayas).filter(Boolean).sort();
  }, [initialUsers]);

  const filteredIds = filteredUsers.map(u => u.id);
  const allSelected = filteredIds.length > 0 && filteredIds.every(id => selectedIds.has(id));
  const someSelected = filteredIds.some(id => selectedIds.has(id)) && !allSelected;

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(prev => { const next = new Set(prev); filteredIds.forEach(id => next.delete(id)); return next; });
    } else {
      setSelectedIds(prev => new Set([...Array.from(prev), ...filteredIds]));
    }
  };

  const handleBulkDelete = async () => {
    setBulkLoading(true);
    const res = await bulkDeleteUsers(Array.from(selectedIds));
    setBulkLoading(false);
    setShowBulkConfirm(false);
    if (res?.error) alert(res.error);
    else setSelectedIds(new Set());
  };

  function openPwModal(userId: string, userName: string) {
    setPwModal({ open: true, userId, userName });
    setNewPw("");
    setPwMsg({ text: "", type: "" });
  }

  function closePwModal() {
    setPwModal({ open: false, userId: "", userName: "" });
    setNewPw("");
    setPwMsg({ text: "", type: "" });
  }

  async function handleAdminChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!newPw.trim()) return;
    setPwLoading(true);
    setPwMsg({ text: "", type: "" });
    const res = await adminChangePassword(pwModal.userId, newPw);
    if (res.error) {
      setPwMsg({ text: res.error, type: "error" });
    } else {
      setPwMsg({ text: "تم تغيير كلمة المرور بنجاح ✅", type: "success" });
      setTimeout(closePwModal, 1500);
    }
    setPwLoading(false);
  }

  const handleExport = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = document.createElement("div");
      element.dir = "rtl";
      element.style.position = "absolute";
      element.style.left = "-9999px";
      element.style.top = "-9999px";
      
      element.innerHTML = `
        <div dir="rtl" style="padding: 0; font-family: 'Cairo', sans-serif; width: 1122px; background: #ffffff;">
          <!-- Top Navy Header Bar -->
          <div style="background: #0f172a; padding: 36px 50px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 11px; color: #64748b; font-weight: 600; margin-bottom: 8px;">نظام إدارة المنصة التعليمية</div>
              <h1 style="font-size: 30px; font-weight: 900; color: #ffffff; margin: 0 0 6px 0;">قاعدة بيانات الطلاب</h1>
              <p style="color: #64748b; font-size: 14px; font-weight: 500; margin: 0;">كشف مفصل ببيانات الحسابات المسجلة في المنصة</p>
            </div>
            <div style="text-align: left; display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
              <div style="background: #0ea5e9; color: white; padding: 6px 16px; border-radius: 8px; font-size: 14px; font-weight: 800;">AuraMed Elite</div>
              <div style="font-size: 12px; color: #64748b;">تاريخ الإصدار: <span style="color: #94a3b8; font-family: monospace; font-weight: 700;">${new Date().toLocaleDateString('ar-EG')}</span></div>
              <div style="font-size: 12px; color: #64748b;">إجمالي السجلات: <span style="color: #0ea5e9; font-weight: 800;">${filteredUsers.length}</span></div>
            </div>
          </div>
          <!-- Accent bar -->
          <div style="height: 4px; background: #0ea5e9;"></div>
          <!-- Stats Row -->
          <div style="display: flex; gap: 20px; padding: 30px 50px 20px 50px;">
            <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; border-right: 4px solid #0ea5e9;">
              <div style="font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 6px;">إجمالي الحسابات</div>
              <div style="font-size: 28px; font-weight: 900; color: #0f172a;">${filteredUsers.length}</div>
            </div>
            <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; border-right: 4px solid #10b981;">
              <div style="font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 6px;">كلمات مرور مشفرة</div>
              <div style="font-size: 28px; font-weight: 900; color: #0f172a;">${filteredUsers.filter((u) => u.password && (u.password.startsWith('$2b$') || u.password.startsWith('$2a$'))).length}</div>
            </div>
            <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; border-right: 4px solid #e11d48;">
              <div style="font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 6px;">مديرون (ADMIN)</div>
              <div style="font-size: 28px; font-weight: 900; color: #0f172a;">${filteredUsers.filter((u) => u.role === 'ADMIN').length}</div>
            </div>
          </div>

          <!-- Table -->
          <div style="padding: 0 50px 50px 50px;"><div style="border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse; text-align: right;" dir="rtl">
              <thead>
                <tr style="background: #1e293b;">
                  <th style="padding: 14px 18px; font-size: 12px; color: #94a3b8; font-weight: 700; text-align: right; border-bottom: 2px solid #0ea5e9; width: 5%">#</th>
                  <th style="padding: 14px 18px; font-size: 12px; color: #94a3b8; font-weight: 700; text-align: right; width: 22%; border-bottom: 2px solid #0ea5e9;">الاسم الكامل</th>
                  <th style="padding: 14px 18px; font-size: 12px; color: #94a3b8; font-weight: 700; text-align: right; width: 28%; border-bottom: 2px solid #0ea5e9;">البريد الإلكتروني</th>
                  <th style="padding: 14px 18px; text-align: center; font-size: 12px; color: #94a3b8; font-weight: 700; width: 18%; border-bottom: 2px solid #0ea5e9;">كلمة المرور</th>
                  <th style="padding: 14px 18px; text-align: center; font-size: 12px; color: #94a3b8; font-weight: 700; width: 12%; border-bottom: 2px solid #0ea5e9;">الصلاحية</th>
                  <th style="padding: 14px 18px; text-align: center; font-size: 12px; color: #94a3b8; font-weight: 700; width: 12%; border-bottom: 2px solid #0ea5e9;">السنة الدراسية</th>
                  <th style="padding: 14px 18px; text-align: center; font-size: 12px; color: #94a3b8; font-weight: 700; width: 15%; border-bottom: 2px solid #0ea5e9;">تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody>
                ${filteredUsers.map((user, index) => {
                  const isEncrypted = user.password && (user.password.startsWith('$2b$') || user.password.startsWith('$2a$'));
                  const pwDisplay = isEncrypted ? 'مشفرة 🔒' : (user.password || '---');
                  const bgColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';
                  
                  return `
                  <tr style="background-color: ${bgColor}; border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 14px 18px; font-size: 12px; color: #94a3b8; font-weight: 600; text-align: right;">${index + 1}</td>
                    <td style="padding: 14px 18px; font-size: 14px; font-weight: 800; color: #0f172a; text-align: right;">${user.name || "بدون اسم"}</td>
                    <td style="padding: 14px 18px; font-size: 12px; color: #475569; font-weight: 500; text-align: left; direction: ltr;">${user.email}</td>
                    <td style="padding: 14px 18px; font-size: 12px; text-align: center; color: ${isEncrypted ? '#10b981' : '#f59e0b'}; font-weight: 700;">
                      <div style="display: inline-block; background: ${isEncrypted ? '#ecfdf5' : '#fffbeb'}; padding: 4px 10px; border-radius: 8px; border: 1px solid ${isEncrypted ? '#a7f3d0' : '#fde68a'};">
                        ${pwDisplay}
                      </div>
                    </td>
                    <td style="padding: 14px 18px; text-align: center;">
                      <span style="font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 5px; background: ${user.role === 'ADMIN' ? '#fee2e2' : '#e0f2fe'}; color: ${user.role === 'ADMIN' ? '#e11d48' : '#0284c7'};">
                        ${user.role}
                      </span>
                    </td>
                    <td style="padding: 14px 18px; text-align: center; font-size: 12px; color: #475569; font-weight: 600;">${user.studyYear || '---'}</td>
                    <td style="padding: 14px 18px; font-size: 12px; text-align: center; color: #64748b; font-weight: 600;">${new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
                  </tr>
                `}).join('')}
              </tbody>
            </table>
          </div></div>

          <!-- Signature & Stamp Section -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 10px 50px 40px 50px; background: #ffffff;">
            <div style="text-align: right;">
              <p style="font-size: 12px; color: #64748b; font-weight: 700; margin: 0 0 12px 0;">توقيع واعتماد الإدارة:</p>
              <div style="border-bottom: 2px dashed #cbd5e1; width: 220px; padding-bottom: 6px; text-align: center;">
                <span style="font-family: 'Cairo', sans-serif; font-size: 16px; font-weight: 900; color: #0ea5e9;">Ahmed Ben Dakfal</span>
              </div>
              <p style="font-size: 10px; color: #94a3b8; margin: 6px 0 0 0;">المشرف العام على المنصة</p>
            </div>
            
            <div style="display: flex; flex-direction: column; align-items: center; margin-left: 20px;">
              <!-- Professional Stamp Design -->
              <div style="border: 2.5px dashed #0ea5e9; border-radius: 50%; width: 100px; height: 100px; display: flex; flex-direction: column; justify-content: center; align-items: center; transform: rotate(-5deg); background: rgba(14, 165, 233, 0.02); box-shadow: 0 0 0 4px #ffffff, 0 0 0 6px rgba(14, 165, 233, 0.08);">
                <span style="font-size: 8px; color: #0ea5e9; font-weight: 800; letter-spacing: 0.5px;">AURAMED ELITE</span>
                <span style="font-size: 12px; color: #0284c7; font-weight: 900; margin: 2px 0;">ختم رسمي</span>
                <span style="font-size: 7px; color: #64748b; font-weight: 600;">مستند معتمد</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 50px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
              <span style="font-size: 12px; color: #64748b; font-weight: 600;">وثيقة إلكترونية موثقة - نظام AuraMed الإداري الآمن</span>
            </div>
            <span style="font-size: 11px; color: #94a3b8; font-family: monospace;">AuraMed Elite v1.0.0</span>
          </div>
        </div>
      `;
      
      document.body.appendChild(element);

      // Wait briefly for DOM to fully render the element
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollY: 0,
        x: 0,
        y: 0
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      // Calculate dynamic height to fit content perfectly on A4 landscape width
      const pdfWidth = 11.69; // A4 width in inches
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF({
        unit: 'in',
        format: [pdfWidth, Math.max(8.27, pdfHeight)],
        orientation: 'landscape'
      });
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.max(8.27, pdfHeight));
      pdf.save(`AuraMed_Students_Report_${new Date().getTime()}.pdf`);
      
      document.body.removeChild(element);
    } catch (e: any) {
      console.error(e);
      alert('حدث خطأ أثناء تحميل الملف. الرجاء المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">

      {/* Password Change Modal */}
      <AnimatePresence>
        {pwModal.open && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closePwModal} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent rounded-t-[2.5rem]" />
              
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                    <KeyRound className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">تغيير كلمة المرور</h2>
                    <p className="text-sm text-slate-400 font-bold mt-0.5 truncate max-w-[200px]">{pwModal.userName}</p>
                  </div>
                </div>
                <button onClick={closePwModal} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 transition-colors" title="إغلاق" aria-label="إغلاق">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <AnimatePresence>
                {pwMsg.text && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6"
                  >
                    <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-bold ${
                      pwMsg.type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800"
                    }`}>
                      {pwMsg.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                      <span>{pwMsg.text}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleAdminChangePassword} className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">كلمة المرور الجديدة</label>
                  <input
                    type="text"
                    value={newPw}
                    onChange={e => { setNewPw(e.target.value); setPwMsg({ text: "", type: "" }); }}
                    placeholder="أدخل كلمة المرور الجديدة..."
                    required
                    minLength={6}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-bold outline-none focus:border-amber-500 transition-all"
                    dir="ltr"
                  />
                  <p className="text-xs text-slate-400 font-bold mt-2 mr-1">الحد الأدنى: 6 أحرف</p>
                </div>
                <button type="submit" disabled={pwLoading || !newPw.trim()}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-amber-500/20"
                >
                  {pwLoading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><KeyRound className="w-4 h-4" /><span>تعيين كلمة المرور</span></>
                  }
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Select Toolbar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-8 py-3 bg-rose-50 dark:bg-rose-900/20 border-b border-rose-200 dark:border-rose-800/50">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                <CheckSquare className="w-4 h-4" />
                <span>تم تحديد <strong>{selectedIds.size}</strong> مستخدم</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedIds(new Set())} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-colors">إلغاء التحديد</button>
                <button onClick={() => setShowBulkConfirm(true)} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-black rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm">
                  <Trash2 className="w-3.5 h-3.5" />
                  حذف المحدد ({selectedIds.size})
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-5">
            <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">إجمالي الطلاب</p>
              <h4 className="text-2xl font-black text-slate-800 dark:text-white">{initialUsers.length}</h4>
            </div>
         </div>
         <div className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-5">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">نتائج الفلتر</p>
              <h4 className="text-2xl font-black text-slate-800 dark:text-white">{filteredUsers.length}</h4>
            </div>
         </div>
         <div className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-5">
            <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">آخر المسجلين</p>
              <h4 className="text-2xl font-black text-slate-800 dark:text-white">+{initialUsers.slice(0,1).length}</h4>
            </div>
         </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث بالاسم أو البريد..." 
              className="w-full pr-12 pl-4 py-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] text-sm focus:ring-4 focus:ring-medical-500/10 focus:border-medical-500 outline-none transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <select
               title="تصفية حسب الصلاحية"
               value={roleFilter}
               onChange={(e) => setRoleFilter(e.target.value)}
               className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 outline-none cursor-pointer"
             >
               <option value="ALL">جميع الرتب</option>
               <option value="USER">طلاب (USER)</option>
               <option value="ADMIN">مديرين (ADMIN)</option>
             </select>
             <select
               title="تصفية حسب السنة الدراسية"
               value={studyYearFilter}
               onChange={(e) => setStudyYearFilter(e.target.value)}
               className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 outline-none cursor-pointer"
             >
               <option value="ALL">جميع السنوات</option>
               {studyYears.map((y) => (
                 <option key={y} value={y}>{y}</option>
               ))}
             </select>
             <select
               title="تصفية حسب الولاية"
               value={wilayaFilter}
               onChange={(e) => setWilayaFilter(e.target.value)}
               className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 outline-none cursor-pointer"
             >
               <option value="ALL">جميع الولايات</option>
               {wilayas.map((w) => (
                 <option key={w} value={w}>{w}</option>
               ))}
             </select>
             <button 
               onClick={handleExport}
               className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-medical-600 hover:bg-medical-50 transition-all"
               title="تصدير البيانات"
             >
                <Download className="w-5 h-5" />
             </button>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/30 dark:bg-slate-800/10 text-slate-400 text-[10px] uppercase tracking-[2px] font-black">
                <th className="px-6 py-6 w-12">
                  <button onClick={toggleAll} className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${allSelected ? "text-medical-600" : "text-slate-300 dark:text-slate-600 hover:text-slate-400"}`}>
                    {allSelected || someSelected ? <CheckSquare className={`w-5 h-5 ${someSelected ? "opacity-50" : ""}`} /> : <Square className="w-5 h-5" />}
                  </button>
                </th>
                <th className="px-8 py-6 font-black text-right">المعلومات الشخصية</th>
                <th className="px-8 py-6 font-black text-right">البريد والحالة</th>
                <th className="px-8 py-6 font-black text-center">كلمة المرور</th>
                <th className="px-8 py-6 font-black text-center">الصلاحية</th>
                <th className="px-8 py-6 font-black text-center">السنة الدراسية</th>
                <th className="px-8 py-6 font-black text-center">الولاية</th>
                <th className="px-8 py-6 font-black text-center">تاريخ الانضمام</th>
                <th className="px-8 py-6 font-black text-center">التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredUsers.map((user) => {
                const isSelected = selectedIds.has(user.id);
                return (
                  <tr key={user.id} className={`group transition-all duration-300 ${isSelected ? "bg-medical-50/60 dark:bg-medical-900/10" : "hover:bg-slate-50/80 dark:hover:bg-slate-800/20"}`}>
                    <td className="px-6 py-6">
                      <button onClick={() => toggleOne(user.id)} className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isSelected ? "text-medical-600" : "text-slate-300 dark:text-slate-600 hover:text-slate-400"}`}>
                        {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </button>
                    </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-400 font-black text-xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-md transition-transform group-hover:scale-110">
                          {user.image ? (
                            <img src={user.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            user.name ? user.name.charAt(0).toUpperCase() : "?"
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-dark-card rounded-full" />
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-800 dark:text-white group-hover:text-medical-600 transition-colors">{user.name || "بدون اسم"}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">ID: {user.id.slice(0, 12)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold text-sm">
                        <Mail className="w-4 h-4 text-medical-600" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">حساب مفعل</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-medical-600">
                      {user.password ? (
                        user.password.startsWith("$2b$") || user.password.startsWith("$2a$") ? (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-sans text-[11px] font-black uppercase tracking-wider">
                            <span>مشفرة</span>
                            <span>🔒</span>
                          </span>
                        ) : (
                          <span className="font-mono">{user.password}</span>
                        )
                      ) : (
                        "---"
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      user.role === "ADMIN" 
                        ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800" 
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.studyYear || '---'}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.wilaya || '---'}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-black text-sm">
                        <Clock className="w-4 h-4 text-slate-300" />
                        <span dir="ltr">{new Date(user.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 opacity-50 uppercase tracking-tighter">
                        {new Date(user.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openPwModal(user.id, user.name || user.email)}
                        className="p-2.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white rounded-xl transition-all"
                        title="تغيير كلمة المرور"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <DeleteUserButton id={user.id} />
                    </div>
                  </td>
                </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                       <Users className="w-24 h-24 text-slate-300" />
                       <div>
                         <p className="text-2xl font-black text-slate-500">لا يوجد نتائج تطابق بحثك</p>
                         <p className="text-sm font-bold mt-1">تأكد من كتابة الاسم أو البريد بشكل صحيح.</p>
                       </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
           <p className="text-sm font-bold text-slate-400">عرض {filteredUsers.length} من {initialUsers.length} نتيجة</p>
           <div className="flex gap-2">
              <button disabled className="px-5 py-2 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 text-sm font-bold opacity-50">السابق</button>
              <button disabled className="px-5 py-2 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 text-sm font-bold opacity-50">التالي</button>
           </div>
        </div>
      </div>

      {/* Bulk Confirm Modal */}
      <AnimatePresence>
        {showBulkConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !bulkLoading && setShowBulkConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 text-center">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent rounded-t-[2.5rem]" />
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">تأكيد الحذف الجماعي</h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-8 leading-relaxed">
                سيتم حذف <strong className="text-rose-600 dark:text-rose-400">{selectedIds.size}</strong> مستخدم مع جميع بياناتهم المرتبطة.<br />لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowBulkConfirm(false)} disabled={bulkLoading}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black transition-all hover:bg-slate-200 disabled:opacity-50">إلغاء</button>
                <button onClick={handleBulkDelete} disabled={bulkLoading}
                  className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 disabled:opacity-50">
                  {bulkLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Trash2 className="w-4 h-4" /><span>حذف ({selectedIds.size})</span></>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
