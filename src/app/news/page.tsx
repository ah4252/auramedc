import { getNews } from "@/app/actions/news";
import { Sparkles } from "lucide-react";
import { cookies } from "next/headers";
import NewsClient from "./NewsClient";

export const metadata = {
  title: "أخبار المنصة | AuraMed Elite",
  description: "آخر التحديثات والإعلانات في منصة أوراميد التعليمية"
};

export default async function NewsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  const adminToken = cookieStore.get("admin_token")?.value;
  const isAdmin = !!adminToken;
  const news = await getNews(true); // Fetch only published news

  return (
    <div className="min-h-screen bg-[#0f172a] font-cairo text-white">
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-medical-900/20" />
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-medical-500/50 to-transparent" />
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-medical-500/10 to-transparent" />
        
        {/* Glow effects */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-medical-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-sky-600/20 rounded-full blur-[128px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-medical-500/10 border border-medical-500/20 text-medical-400 mb-6 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>نبقيك على اطلاع دائم</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            أخبار <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-400 to-medical-600">المنصة</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-bold leading-relaxed">
            تابع أحدث الإعلانات، التحديثات الهامة، والميزات الجديدة التي نضيفها باستمرار لتحسين تجربتك التعليمية.
          </p>
        </div>
      </div>

      {/* News Content */}
      <NewsClient news={news} userId={userId} isAdmin={isAdmin} />
    </div>
  );
}
