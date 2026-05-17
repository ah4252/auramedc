"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Lock, Unlock, ShieldAlert, KeyRound, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { verifyToolsPassword } from "@/app/actions/settings";

export default function ToolsGate({
  children,
  toolsProtected = false,
  initialUnlocked = true
}: {
  children: React.ReactNode;
  toolsProtected?: boolean;
  initialUnlocked?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(initialUnlocked);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync unlocked state when initialUnlocked prop changes from layout server validation
  useEffect(() => {
    setUnlocked(initialUnlocked);
  }, [initialUnlocked]);

  // news administration is exempt from tools protection
  const exemptPaths = ["/admin/news"];
  const isProtected = toolsProtected && !unlocked && !exemptPaths.some(exempt => pathname === exempt);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await verifyToolsPassword(password);
      if (res.success) {
        setUnlocked(true);
        setPassword("");
        router.refresh();
      } else {
        setError(res.error || "كلمة المرور غير صحيحة");
      }
    } catch (err) {
      setError("حدث خطأ أثناء التحقق من كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  if (!isProtected) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
      >
        {/* Radar pulsing backglow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-orange-400 text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-amber-500/20 relative group">
            <Lock className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-3xl border border-amber-400 animate-ping opacity-25 pointer-events-none" />
          </div>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            القسم محمي بكلمة مرور
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed max-w-sm font-medium">
            تفعيل حماية الأدوات نشط. يرجى إدخال كلمة مرور الأدوات السرية لتتمكن من تصفح وتعديل هذا القسم.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs font-black flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              كلمة مرور الأدوات
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-4 pl-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-amber-500 outline-none text-left font-mono transition-all font-black"
                dir="ltr"
              />
              <KeyRound className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-4 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Unlock className="w-5 h-5" />
            )}
            <span>فتح حماية القسم الإداري</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold tracking-wider uppercase">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>AuraMed Security Gate</span>
        </div>
      </motion.div>
    </div>
  );
}
