"use client";

import { useState } from "react";
import { loginAdmin } from "@/app/actions/auth";
import { HeartPulse, Lock, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(formData: FormData) {
    setLoading(true);
    setError("");
    const res = await loginAdmin(formData);
    
    if (res?.error) {
      setError(res.error);
    } else {
      router.refresh(); // Refresh to trigger layout cookie check
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-dark-bg p-4">
      <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">بوابة الإدارة الخاصة</h1>
          <p className="text-slate-500 text-sm mt-2 text-center">هذه المنطقة مخصصة لمالك الموقع فقط. الرجاء إدخال كلمة المرور السريّة.</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-bold mb-6 text-center border border-red-200 dark:border-red-800/50">
            {error}
          </div>
        )}

        <form action={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">كلمة المرور الإدارية</label>
            <input 
              type="password" 
              name="password" 
              required
              placeholder="••••••••"
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-medical-500 outline-none text-left font-mono transition-all"
              dir="ltr"
            />
          </div>
          
          <button 
            disabled={loading}
            className="w-full bg-medical-600 hover:bg-medical-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-medical-600/30 hover:-translate-y-1"
          >
            {loading ? "جاري التحقق..." : "تسجيل الدخول للوحة التحكم"}
          </button>
        </form>

        <div className="mt-8 text-center flex items-center justify-center gap-2 text-slate-400 text-sm font-bold tracking-tight">
          <Stethoscope className="w-4 h-4 text-medical-500" />
          <span className="italic">Aura<span className="not-italic font-light">Med</span></span>
        </div>
      </div>
    </div>
  );
}
