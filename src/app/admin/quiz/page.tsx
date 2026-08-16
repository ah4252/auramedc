"use client";

import { Sparkles, Pickaxe } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminQuizPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-10 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 bg-purple-500/10 rounded-[2rem] flex items-center justify-center mb-6 border border-purple-500/20"
      >
        <Pickaxe className="w-12 h-12 text-purple-500" />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl font-black text-slate-800 dark:text-white mb-4 flex items-center gap-3"
      >
        إدارة الـ Quiz <Sparkles className="w-6 h-6 text-amber-500" />
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg font-bold text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed"
      >
        هذه الصفحة قيد التطوير. سيتوفر المحتوى والإعدادات الخاصة بقسم الـ Quiz قريباً!
      </motion.p>
    </div>
  );
}
