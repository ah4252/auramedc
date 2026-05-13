"use client";

import { Hammer, Clock, ShieldAlert, HeartPulse, X, Lock, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/app/actions/auth";

export default function MaintenanceScreen() {
  const [clicks, setClicks] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleIconClick = () => {
    setClicks(prev => prev + 1);
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(() => setClicks(0), 1000);
  };

  useEffect(() => {
    if (clicks >= 5) {
      setShowModal(true);
      setClicks(0);
    }
  }, [clicks]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("password", password);

    const res = await loginAdmin(formData);
    
    if (res?.error) {
      setError(res.error);
    } else {
      setShowModal(false);
      setPassword("");
      router.refresh();
      router.push("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900 flex items-center justify-center p-6 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-medical-500/10 rounded-full -mr-64 -mt-64 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full -ml-64 -mb-64 blur-3xl animate-pulse"></div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12 inline-block cursor-pointer select-none"
          onClick={handleIconClick}
        >
           <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-orange-600/20 rotate-12 group-active:scale-95 transition-transform">
                 <Hammer className="w-12 h-12" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-orange-500 border-4 border-slate-900">
                 <Clock className="w-6 h-6 animate-spin-slow" />
              </div>
           </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl font-black text-white mb-6 tracking-tight leading-tight">
            نحن في مهمة <span className="text-orange-500">تحسين</span> سريعة!
          </h1>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">
            عذراً، المنصة حالياً تحت الصيانة الدورية لضمان تقديم أفضل تجربة تعليمية طبية ممكنة. سنعود إليكم خلال وقت قصير جداً.
          </p>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2.5rem] mb-12">
             <div className="flex items-center justify-center gap-3 text-orange-500 font-bold mb-4">
                <ShieldAlert className="w-5 h-5" />
                <span>إشعار النظام</span>
             </div>
             <p className="text-slate-300">
                جميع البيانات محفوظة بأمان، والعمل جارٍ على تحديث بعض الخصائص التقنية. نشكركم على صبركم.
             </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-500">
             <HeartPulse className="w-5 h-5 text-medical-600" />
             <span className="font-bold tracking-widest uppercase">MedGpa Engineering Team</span>
          </div>
        </motion.div>
      </div>

      {/* Secret Admin Login Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-dark-card w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative border border-slate-200 dark:border-slate-800"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 left-6 p-2 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center mb-8 mt-4">
                <div className="relative mb-6">
                   <div className="w-20 h-20 bg-gradient-to-tr from-medical-600 to-medical-400 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-medical-600/30 rotate-12">
                      <Lock className="w-10 h-10" />
                   </div>
                   <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center border-2 border-white dark:border-dark-card">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                   </div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">الدخول الآمن</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">يرجى إدخال رمز التحقق للمدير</p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-black mb-6 text-center border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="relative">
                   <input 
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     autoFocus
                     placeholder="••••••••"
                     className="w-full p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-medical-500 focus:bg-white dark:focus:bg-slate-900 outline-none text-center font-mono text-2xl tracking-[0.5em] transition-all"
                     dir="ltr"
                   />
                </div>
                <button 
                  type="submit"
                  disabled={loading || !password}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-medical-600 dark:hover:bg-medical-500 dark:hover:text-white font-black py-5 rounded-2xl transition-all disabled:opacity-50 shadow-xl"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    "تحقق ودخول"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
