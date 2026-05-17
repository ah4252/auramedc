"use client";

import { useState } from "react";
import { KeyRound, Check, Trash2, Mail, Clock, ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { approveRecoveryRequest, deleteRecoveryRequest } from "@/app/actions/recovery";

interface RecoveryRequest {
  id: string;
  email: string;
  lastPassword: string;
  status: string;
  createdAt: Date;
  userName?: string;
  userImage?: string | null;
}

export default function RecoveryClient({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState<RecoveryRequest[]>(
    initialRequests.map(r => ({
      ...r,
      createdAt: new Date(r.createdAt)
    }))
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApprove = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await approveRecoveryRequest(id);
      if (res.success) {
        setRequests(prev =>
          prev.map(req => (req.id === id ? { ...req, status: "APPROVED" } : req))
        );
        showNotification("success", "تمت الموافقة على الطلب بنجاح! يمكن للمستخدم الآن الدخول بـ 2026");
      } else {
        showNotification("error", res.error || "فشل في الموافقة على الطلب");
      }
    } catch (err) {
      showNotification("error", "حدث خطأ غير متوقع");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    setLoadingId(id);
    try {
      const res = await deleteRecoveryRequest(id);
      if (res.success) {
        setRequests(prev => prev.filter(req => req.id !== id));
        showNotification("success", "تم حذف طلب استعادة كلمة المرور بنجاح");
      } else {
        showNotification("error", res.error || "فشل في حذف الطلب");
      }
    } catch (err) {
      showNotification("error", "حدث خطأ غير متوقع");
    } finally {
      setLoadingId(null);
    }
  };

  const pendingCount = requests.filter(r => r.status === "PENDING").length;

  return (
    <div className="space-y-8 font-cairo">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl ${
              notification.type === "success"
                ? "bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 dark:bg-red-950/40 border-red-500/20 text-red-600 dark:text-red-400"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            <span className="text-sm font-black">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
        {/* Decorative blur background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-medical-500/5 rounded-full blur-2xl" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-medical-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-medical-500/20">
            <KeyRound className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">إدارة طلبات استعادة الحساب</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mt-1">
              مراجعة والموافقة على طلبات المستخدمين الذين نسوا كلمات مرورهم.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <div className="px-5 py-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/20 text-sm font-black flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>معلّق: {pendingCount}</span>
          </div>
          <div className="px-5 py-3 bg-medical-500/10 text-medical-600 dark:text-medical-400 rounded-2xl border border-medical-500/20 text-sm font-black flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>الإجمالي: {requests.length}</span>
          </div>
        </div>
      </div>

      {/* Main Request Grid */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <span>طلبات استعادة الحساب النشطة</span>
        </h2>

        {requests.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-200/50 dark:border-slate-800">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-200">لا يوجد طلبات حالياً</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mt-2 max-w-sm">
              لم يقم أي مستخدم بإرسال طلب استعادة حسابه مؤخراً. كل الحسابات آمنة!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 pb-4 text-slate-400 text-xs font-black uppercase tracking-wide">
                  <th className="py-4 px-4">المستخدم / البريد الإلكتروني</th>
                  <th className="py-4 px-4">آخر كلمة سر يتذكرها</th>
                  <th className="py-4 px-4">تاريخ الطلب</th>
                  <th className="py-4 px-4 text-center">حالة الطلب</th>
                  <th className="py-4 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {requests.map((request) => (
                    <motion.tr
                      key={request.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`border-b transition-colors font-bold text-sm ${
                        request.status === "COMPLETED"
                          ? "border-emerald-100 dark:border-emerald-950/50 bg-emerald-500/5 dark:bg-emerald-950/10 hover:bg-emerald-500/10 dark:hover:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300"
                          : "border-slate-50 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-3">
                          {request.userImage ? (
                            <img
                              src={request.userImage}
                              alt={request.userName || "صورة المستخدم"}
                              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-tr from-medical-500/15 to-indigo-600/15 text-medical-600 dark:text-medical-400 rounded-xl flex items-center justify-center shrink-0 border border-medical-500/20 font-black text-sm uppercase">
                              {(request.userName || "U").substring(0, 2)}
                            </div>
                          )}
                          <div className="text-right">
                            <span className="block font-black text-slate-800 dark:text-slate-200 text-sm leading-tight">
                              {request.userName || "طالب بدون اسم"}
                            </span>
                            <span className="block text-slate-400 dark:text-slate-500 text-xs font-bold font-mono mt-1 text-left" dir="ltr">
                              {request.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-5 px-4">
                        <span className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 font-bold" dir="ltr">
                          {request.lastPassword}
                        </span>
                      </td>

                      <td className="py-5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                        {request.createdAt.toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>

                      <td className="py-5 px-4 text-center">
                        {request.status === "PENDING" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wide">
                            <Clock className="w-3 h-3" />
                            <span>بانتظار المعالجة</span>
                          </span>
                        ) : request.status === "APPROVED" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wide">
                            <Check className="w-3 h-3" />
                            <span>تمت الموافقة (2026)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>تم الدخول بنجاح 🎉</span>
                          </span>
                        )}
                      </td>

                      <td className="py-5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {request.status === "PENDING" && (
                            <button
                              onClick={() => handleApprove(request.id)}
                              disabled={loadingId === request.id}
                              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-500/10 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>موافقة</span>
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(request.id)}
                            disabled={loadingId === request.id}
                            className="flex items-center justify-center p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all border border-transparent hover:border-red-500/10 disabled:opacity-50"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
