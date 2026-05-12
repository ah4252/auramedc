"use client";

import { registerUser } from "@/app/actions/auth";
import { useState } from "react";
import { UserPlus, Mail, Lock, User, ArrowRight, HeartPulse } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleRegister(formData: FormData) {
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
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-medical-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl shadow-medical-600/10 border border-slate-100 dark:border-slate-800 p-8 md:p-10">
          <div className="flex flex-col items-center mb-10">
            <Link href="/" className="flex items-center gap-2 text-medical-600 mb-6">
              <HeartPulse className="w-10 h-10" />
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">ميد<span className="text-medical-600">بلاس</span></span>
            </Link>
            <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
            <p className="text-slate-500 mt-2">انضم لآلاف الطلاب في رحلتهم التعليمية</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold mb-6 text-center border border-red-100 dark:border-red-900/30"
            >
              {error}
            </motion.div>
          )}

          <form action={handleRegister} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-1">الاسم الكامل</label>
              <div className="relative">
                <input 
                  name="name"
                  type="text"
                  required
                  placeholder="أدخل اسمك الثلاثي"
                  className="w-full pl-4 pr-12 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                />
                <User className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-1">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-4 pr-12 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                  dir="ltr"
                />
                <Mail className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-1">كلمة المرور</label>
              <div className="relative">
                <input 
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-4 pr-12 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                  dir="ltr"
                />
                <Lock className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-medical-600 hover:bg-medical-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-medical-600/30 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>إنشاء الحساب</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-medical-600 font-bold hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>

        <Link href="/" className="flex items-center justify-center gap-2 mt-8 text-slate-400 hover:text-medical-600 transition-colors group">
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          <span className="text-sm font-medium">العودة للرئيسية</span>
        </Link>
      </motion.div>
    </div>
  );
}
