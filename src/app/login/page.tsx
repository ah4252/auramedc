"use client";

import { loginUser } from "@/app/actions/auth";
import { createRecoveryRequest } from "@/app/actions/recovery";
import { useState } from "react";
import { LogIn, Mail, Lock, ArrowRight, HeartPulse, X, Eye, EyeOff, KeyRound, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Forgot password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLastPassword, setForgotLastPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    const res = await loginUser(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotLastPassword.trim()) return;
    setForgotLoading(true);
    setForgotError("");
    setForgotSuccess(false);
    
    const res = await createRecoveryRequest(forgotEmail.trim(), forgotLastPassword.trim());
    if (res.error) {
      setForgotError(res.error);
    } else {
      setForgotSuccess(true);
    }
    setForgotLoading(false);
  }

  function closeForgot() {
    setShowForgot(false);
    setForgotEmail("");
    setForgotLastPassword("");
    setForgotError("");
    setForgotSuccess(false);
    setForgotLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0B1120] font-cairo flex items-center justify-center p-4 relative overflow-hidden text-white">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-medical-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[150px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="bg-[#0f172a]/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_0_80px_-20px_rgba(14,165,233,0.25)] border border-white/5 p-8 md:p-12 relative overflow-hidden">
          
          {/* Top border gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-medical-500/50 to-transparent"></div>

          <div className="flex flex-col items-center mb-10 text-center">
            <Link href="/" className="inline-flex items-center justify-center p-4 rounded-3xl bg-medical-500/10 border border-medical-500/20 text-medical-400 mb-6 group hover:bg-medical-500/20 transition-all duration-300">
              <HeartPulse className="w-10 h-10 group-hover:scale-110 transition-transform" />
            </Link>
            <h1 className="text-3xl font-black mb-3 tracking-tight">
              تسجيل <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-400 to-sky-400">الدخول</span>
            </h1>
            <p className="text-slate-400 font-bold">أهلاً بك مجدداً في منصتك التعليمية المتكاملة</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm font-black text-center border border-red-500/20 flex items-center justify-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-300 mr-2">البريد الإلكتروني</label>
              <div className="relative group">
                <input 
                  name="email"
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  className="w-full pl-4 pr-14 py-4 rounded-2xl border border-slate-700 bg-[#0B1120]/50 text-white placeholder:text-slate-500 focus:border-medical-500 focus:ring-1 focus:ring-medical-500 outline-none transition-all font-bold text-left"
                  dir="ltr"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg group-focus-within:bg-medical-500 group-focus-within:text-white text-slate-400 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mr-2">
                <label className="text-sm font-black text-slate-300">كلمة المرور</label>
                <button 
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs text-medical-400 hover:text-medical-300 font-black transition-colors underline-offset-2 hover:underline"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              <div className="relative group">
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-14 py-4 rounded-2xl border border-slate-700 bg-[#0B1120]/50 text-white placeholder:text-slate-500 focus:border-medical-500 focus:ring-1 focus:ring-medical-500 outline-none transition-all font-bold text-left"
                  dir="ltr"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg group-focus-within:bg-medical-500 group-focus-within:text-white text-slate-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-medical-600 to-sky-500 hover:from-medical-500 hover:to-sky-400 text-white font-black py-4 rounded-2xl transition-all shadow-[0_0_40px_-10px_rgba(14,165,233,0.5)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <div className="relative flex items-center justify-center gap-2 z-10">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>تسجيل الدخول</span>
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm font-bold">
              ليس لديك حساب؟{" "}
              <Link href="/register" className="text-medical-400 font-black hover:text-medical-300 hover:underline transition-colors ml-1">
                أنشئ حساباً جديداً
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0f172a]/50 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all group backdrop-blur-md font-bold">
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            <span className="text-sm">العودة للصفحة الرئيسية</span>
          </Link>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgot && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForgot}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-md bg-[#0f172a] rounded-[2.5rem] border border-slate-700/50 shadow-[0_0_80px_-10px_rgba(14,165,233,0.3)] overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"></div>

              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                      <KeyRound className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">طلب استعادة الحساب</h2>
                      <p className="text-slate-400 text-xs font-bold mt-1">المطور سيراجع ويوافق على طلبك يدوياً</p>
                    </div>
                  </div>
                  <button 
                    onClick={closeForgot}
                    className="p-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-xl transition-all"
                    title="إغلاق"
                    aria-label="إغلاق"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Result: Request Sent Success */}
                <AnimatePresence>
                  {forgotSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-6"
                    >
                      <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-lg shadow-green-500/5 animate-bounce">
                        <CheckCircle className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-black text-white mb-3">تم إرسال الطلب بنجاح!</h3>
                      <p className="text-slate-400 text-sm font-bold leading-relaxed mb-6">
                        طلبك قيد المعالجة الآن وينتظر الموافقة من المطور. 
                        <br />
                        يرجى مراجعة صفحة تسجيل الدخول لاحقاً.
                      </p>
                      <button
                        onClick={closeForgot}
                        className="w-full py-4 bg-gradient-to-r from-medical-600 to-sky-500 text-white rounded-2xl font-black transition-transform hover:-translate-y-0.5 shadow-lg shadow-medical-600/20"
                      >
                        حسناً، فهمت
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {forgotError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mb-6"
                    >
                      <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-xs font-black border border-red-500/20 flex items-center gap-2" dir="rtl">
                        <X className="w-4 h-4 shrink-0" />
                        <span>{forgotError}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                {!forgotSuccess && (
                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    <div className="space-y-1">
                      <label className="block text-xs font-black text-slate-400 mr-2 uppercase tracking-wide">البريد الإلكتروني</label>
                      <div className="relative group">
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={e => { setForgotEmail(e.target.value); setForgotError(""); }}
                          placeholder="name@gmail.com"
                          required
                          className="w-full pl-4 pr-14 py-4 rounded-2xl border border-slate-700 bg-[#0B1120]/50 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all font-bold text-left"
                          dir="ltr"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg group-focus-within:bg-amber-500 group-focus-within:text-white text-slate-400 transition-colors">
                          <Mail className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-black text-slate-400 mr-2 uppercase tracking-wide">آخر كلمة سر تتذكرها</label>
                      <div className="relative group">
                        <input
                          type="text"
                          value={forgotLastPassword}
                          onChange={e => { setForgotLastPassword(e.target.value); setForgotError(""); }}
                          placeholder="أدخل آخر كلمة سر تتذكرها..."
                          required
                          className="w-full pl-4 pr-14 py-4 rounded-2xl border border-slate-700 bg-[#0B1120]/50 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all font-bold text-right"
                          dir="rtl"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg group-focus-within:bg-amber-500 group-focus-within:text-white text-slate-400 transition-colors">
                          <Lock className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading || !forgotEmail.trim() || !forgotLastPassword.trim()}
                      className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white rounded-2xl font-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_30px_-10px_rgba(245,158,11,0.5)]"
                    >
                      {forgotLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <KeyRound className="w-5 h-5" />
                          <span>إرسال الطلب للمطور</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
