"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Lock, X, Save, ShieldCheck, Key, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateCommunityPassword } from "../../actions/community";
import { useRouter } from "next/navigation";

export default function PasswordManager({ category }: { category: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState(category.communityPassword || "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const res = await updateCommunityPassword(category.id, password || null);
    if (res.success) {
      setStatus("success");
      router.refresh();
      setTimeout(() => {
        setIsOpen(false);
        setStatus(null);
      }, 1500);
    } else {
      setStatus("error");
    }
    setLoading(false);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/98"
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-black rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/20"
            style={{ backgroundColor: '#000000', opacity: 1, color: 'white' }}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 left-6 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500/20 transition-all z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center mb-8 text-center relative z-10">
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-2xl">
                 <Key className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-2 uppercase italic">أمان المجتمع</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
                 <ShieldCheck className="w-3 h-3 text-amber-500" />
                 <span className="text-[10px] font-black text-amber-200 uppercase tracking-widest">{category.name}</span>
              </div>
            </div>

            {status === "success" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center font-black text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> تم الحفظ بنجاح
              </motion.div>
            )}

            <form onSubmit={handleSave} className="space-y-6 relative z-10">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mr-1">كلمة المرور الجديدة</label>
                <div className="relative">
                  <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input 
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="اتركه فارغاً لِدخول عام"
                    className="w-full bg-white/10 border-2 border-white/5 p-5 pr-14 rounded-2xl outline-none font-black text-lg focus:border-amber-500 transition-all text-white"
                    autoFocus
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-5 h-5" />}
                <span>حفظ التغييرات</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="p-3 bg-white/5 dark:bg-slate-800/50 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-2xl transition-all border border-transparent hover:border-amber-500/20"
      >
        <Lock className="w-5 h-5" />
      </button>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
