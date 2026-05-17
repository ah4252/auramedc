"use client";

import { registerUser } from "@/app/actions/auth";
import { useState } from "react";
import { UserPlus, Mail, Lock, User, ArrowRight, Sparkles, HeartPulse, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    // التحقق من أن الإيميل ينتهي بـ @gmail.com
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setError("عذراً، يُسمح فقط بإنشاء حساب باستخدام بريد @gmail.com");
      return;
    }

    setLoading(true);
    setError("");
    const res = await registerUser(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1120] font-cairo flex items-center justify-center p-4 relative overflow-hidden text-white">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-medical-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="bg-[#0f172a]/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_0_80px_-20px_rgba(14,165,233,0.25)] border border-white/5 p-8 md:p-12 relative overflow-hidden">
          
          {/* Subtle top border gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-medical-500/50 to-transparent"></div>

          <div className="flex flex-col items-center mb-10 text-center">
            <Link href="/" className="inline-flex items-center justify-center p-4 rounded-3xl bg-medical-500/10 border border-medical-500/20 text-medical-400 mb-6 group hover:bg-medical-500/20 transition-all duration-300">
              <HeartPulse className="w-10 h-10 group-hover:scale-110 transition-transform" />
            </Link>
            
            <h1 className="text-3xl font-black mb-3 tracking-tight">
              إنشاء <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-400 to-sky-400">حساب جديد</span>
            </h1>
            <p className="text-slate-400 font-bold">
              انضم لآلاف الطلاب وابدأ رحلتك التعليمية المتميزة
            </p>
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

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-300 mr-2">الاسم الكامل</label>
              <div className="relative group">
                <input 
                  name="name"
                  type="text"
                  required
                  placeholder="أدخل اسمك الثلاثي"
                  className="w-full pl-4 pr-14 py-4 rounded-2xl border border-slate-700 bg-[#0B1120]/50 text-white placeholder:text-slate-500 focus:border-medical-500 focus:ring-1 focus:ring-medical-500 outline-none transition-all font-bold"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg group-focus-within:bg-medical-500 group-focus-within:text-white text-slate-400 transition-colors">
                  <User className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-300 mr-2 flex justify-between">
                <span>البريد الإلكتروني</span>
                <span className="text-medical-400 text-[10px] bg-medical-500/10 px-2 py-0.5 rounded-full border border-medical-500/20">يجب أن يكون @gmail</span>
              </label>
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
              <label className="text-sm font-black text-slate-300 mr-2">كلمة المرور</label>
              <div className="relative group">
                <input 
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-4 pr-14 py-4 rounded-2xl border border-slate-700 bg-[#0B1120]/50 text-white placeholder:text-slate-500 focus:border-medical-500 focus:ring-1 focus:ring-medical-500 outline-none transition-all font-bold text-left"
                  dir="ltr"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg group-focus-within:bg-medical-500 group-focus-within:text-white text-slate-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
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
                    <Sparkles className="w-5 h-5" />
                    <span>إنشاء الحساب الآن</span>
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm font-bold">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-medical-400 font-black hover:text-medical-300 hover:underline transition-colors ml-1">
                سجل دخولك من هنا
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
    </div>
  );
}
