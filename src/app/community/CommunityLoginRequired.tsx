"use client";

import { Lock, UserPlus, LogIn, Sparkles, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CommunityLoginRequired() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden bg-[#050811]">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-medical-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700" />
      
      <div className="max-w-2xl w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] text-center shadow-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-xs font-black tracking-widest uppercase mb-8">
            <ShieldAlert className="w-4 h-4" />
            محتوى حصري للأعضاء
          </div>

          <div className="w-24 h-24 bg-gradient-to-tr from-medical-600 to-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-medical-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Lock className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 italic">
            انضم إلى <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-400 to-indigo-500">النخبة</span>
          </h1>
          
          <p className="text-slate-400 text-lg font-bold mb-12 leading-relaxed">
            عذراً، قسم المجتمع متاح فقط للطلاب المسجلين في AuraMed. 
            قم بتسجيل الدخول أو إنشاء حساب جديد لتتمكن من التفاعل مع زملائك ومشاركة المعرفة.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-3 py-5 bg-white text-slate-950 rounded-2xl font-black text-xl hover:bg-medical-500 hover:text-white transition-all shadow-xl group"
            >
              <LogIn className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              تسجيل الدخول
            </Link>
            
            <Link 
              href="/register" 
              className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xl hover:bg-white/10 transition-all group"
            >
              <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
              إنشاء حساب
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-slate-500 font-bold text-sm border-t border-white/5 pt-8">
              <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-medical-400" />
                  <span>نقاشات علمية</span>
              </div>
              <div className="w-1 h-1 bg-white/10 rounded-full" />
              <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-medical-400" />
                  <span>مشاركة ملفات</span>
              </div>
              <div className="w-1 h-1 bg-white/10 rounded-full" />
              <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-medical-400" />
                  <span>تواصل مباشر</span>
              </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
