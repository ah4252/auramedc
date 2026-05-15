import { getCategories } from "@/app/actions/content";
import Link from "next/link";
import { Sparkles, GraduationCap, ArrowRight, MessageSquare, Lock } from "lucide-react";
import * as motion from "framer-motion/client";

export const dynamic = "force-dynamic";

export default async function CommunityPortalPage() {
  const categories = await getCategories("YEAR");

  return (
    <div className="min-h-screen bg-[#050811] text-white py-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-medical-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-500/10 border border-medical-500/20 rounded-full text-medical-400 text-xs font-black tracking-widest uppercase">
            <Sparkles className="w-4 h-4" />
            مجتمع AuraMed النخبوي
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight italic">
            اختر <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-400 to-indigo-500">سنتك الدراسية</span>
          </h1>
          <p className="text-slate-400 text-xl font-bold max-w-2xl mx-auto leading-relaxed">
            انضم إلى مجتمع سنتك الدراسية لِتشارك المعرفة، تطرح الأسئلة، وتتفاعل مع زملائك في نفس المرحلة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <Link 
              key={cat.id}
              href={`/community/y/${cat.slug}`}
              className="group relative flex flex-col bg-white/[0.03] backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 hover:border-medical-500/40 transition-all duration-500 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-medical-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-medical-500/10 transition-colors"></div>
              
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-medical-600 group-hover:text-white transition-all duration-500 shadow-inner border border-white/5">
                  <GraduationCap className="w-8 h-8" />
                </div>
                {cat.communityPassword && (
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20" title="محمي بكلمة مرور">
                    <Lock className="w-5 h-5" />
                  </div>
                )}
              </div>
              
              <h3 className="text-3xl font-black text-white mb-4 group-hover:text-medical-400 transition-colors">
                {cat.name}
              </h3>
              
              <p className="text-slate-400 font-bold mb-8 flex-1 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                {cat.description || `انضم إلى مجتمع ${cat.name} وتفاعل مع زملائك.`}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                 <span className="text-sm font-black text-medical-400 flex items-center gap-2 group-hover:gap-3 transition-all">
                    دخول المجتمع
                    <ArrowRight className="w-4 h-4 -rotate-180" />
                 </span>
                 <div className="p-3 bg-white/5 rounded-xl text-slate-500 group-hover:text-medical-400 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                 </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-32 bg-white/[0.02] rounded-[4rem] border-2 border-dashed border-white/5">
             <h3 className="text-2xl font-black text-slate-500">سيتم تفعيل المجتمعات قريباً...</h3>
          </div>
        )}
      </div>
    </div>
  );
}
