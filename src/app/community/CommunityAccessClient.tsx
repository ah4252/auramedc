"use client";

import { useState, useEffect } from "react";
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CommunityAccessClient({ 
  children, 
  categorySlug, 
  requiredPassword 
}: { 
  children: React.ReactNode, 
  categorySlug: string, 
  requiredPassword?: string | null 
}) {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const cookieName = `community_access_${categorySlug}`;

  useEffect(() => {
    // Check if password is required
    if (!requiredPassword) {
      setIsAuthorized(true);
      setLoading(false);
      return;
    }

    // Check cookie for previous authorization
    const savedAccess = localStorage.getItem(cookieName);
    if (savedAccess === requiredPassword) {
      setIsAuthorized(true);
    }
    setLoading(false);
  }, [categorySlug, requiredPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === requiredPassword) {
      localStorage.setItem(cookieName, password);
      setIsAuthorized(true);
      setError("");
    } else {
      setError("كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050811] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-medical-500 animate-spin" />
      </div>
    );
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#050811] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-medical-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 text-center shadow-2xl relative z-10"
      >
        <div className="w-20 h-20 bg-gradient-to-tr from-medical-600 to-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-medical-600/30">
           <Lock className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-4 italic uppercase">دخول مقيد</h1>
        <p className="text-slate-400 font-bold mb-8 leading-relaxed">
          هذا المجتمع محمي بكلمة مرور. يرجى إدخال كلمة المرور المخصصة لسنتك الدراسية للمتابعة.
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/40 border-2 border-white/5 p-5 rounded-2xl outline-none text-center font-mono text-2xl tracking-[0.5em] focus:border-medical-500 transition-all text-white placeholder:text-slate-700"
              autoFocus
            />
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-xl hover:bg-medical-500 hover:text-white transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3 group"
          >
            <span>دخول المجتمع</span>
            <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </form>

        <Link href="/community" className="mt-8 inline-flex items-center gap-2 text-slate-500 hover:text-white font-bold transition-colors">
          <ArrowRight className="w-4 h-4" />
          العودة لاختيار سنة أخرى
        </Link>
      </motion.div>
    </div>
  );
}
