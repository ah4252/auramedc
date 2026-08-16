import ThemeAwareWrapper from "@/components/ThemeAwareWrapper";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function QuizPage() {
  return (
    <ThemeAwareWrapper 
      darkClass="min-h-screen bg-[#0a0f1d] pb-20 font-sans text-white" 
      lightClass="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900"
    >
      <div className="container mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="max-w-md w-full bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl text-center relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
          
          <div className="w-24 h-24 mx-auto bg-amber-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-amber-500/20 group-hover:scale-110 transition-transform duration-500">
            <Sparkles className="w-12 h-12 text-amber-500" />
          </div>
          
          <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-4">Quiz</h1>
          <p className="text-lg font-bold text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            سيتوفر المحتوى قريبا...
          </p>
          
          <Link 
            href="/courses"
            className="inline-flex items-center justify-center px-8 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-2xl font-black transition-all"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </ThemeAwareWrapper>
  );
}
