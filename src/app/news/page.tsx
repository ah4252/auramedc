import { getNews } from "@/app/actions/news";
import { Sparkles } from "lucide-react";
import { cookies } from "next/headers";
import NewsClient from "./NewsClient";
import NewsLoginRequired from "./NewsLoginRequired";

import { prisma } from "@/lib/db";
import { getUserIdFromCookies, verifyAdminToken } from "@/lib/auth-helpers";
import { tServer } from "@/lib/i18n";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const siteLang = (cookieStore.get("site_lang")?.value as any) || "ar";

  return {
    title: tServer("news_meta_title", siteLang ?? "ar", siteLang === "fr" ? "Actualités | AuraMed Elite" : "News | AuraMed Elite"),
    description: tServer(
      "news_meta_description",
      siteLang ?? "ar",
      siteLang === "fr"
        ? "Les dernières mises à jour et annonces de la plateforme AuraMed pour améliorer votre expérience d'apprentissage."
        : "The latest updates and announcements from AuraMed to improve your learning experience."
    )
  };
}

export default async function NewsPage() {
  const cookieStore = await cookies();
  const userId = getUserIdFromCookies(cookieStore);
  const adminToken = cookieStore.get("admin_token")?.value;
  const isAdmin = !!adminToken && verifyAdminToken(adminToken);
  const siteLang = (cookieStore.get("site_lang")?.value as any) || "ar";

  if (!userId && !isAdmin) {
    return <NewsLoginRequired />;
  }

  let isValid = false;
  if (isAdmin) {
    isValid = true;
  } else if (userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, studyYear: true }
      });
      if (user) {
        isValid = true;
        // Update lastReadNewsAt to clear the unread news badge
        await prisma.$queryRaw`UPDATE "User" SET "lastReadNewsAt" = NOW() WHERE id = ${userId}`;
      }
    } catch (e) {}
  }

  if (!isValid) {
    return <NewsLoginRequired />;
  }

  let userStudyYear = null;
  if (userId) {
    const u = await prisma.user.findUnique({ where: { id: userId }, select: { studyYear: true } });
    if (u) userStudyYear = u.studyYear;
  }
  
  const news = await getNews(true, userStudyYear); // Fetch only published news, filter by studyYear if applicable

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white font-cairo">
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-medical-900/20" />
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-medical-500/50 to-transparent" />
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-medical-500/10 to-transparent" />
        
        {/* Glow effects */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-medical-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-sky-600/20 rounded-full blur-[128px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-medical-500/10 border border-medical-500/20 text-medical-600 dark:text-medical-400 mb-6 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>{tServer("news_hero_badge", siteLang ?? "ar", siteLang === "fr" ? "Nous vous tenons informés" : "We keep you informed")}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            {tServer("news_title_prefix", siteLang ?? "ar", siteLang === "fr" ? "Actualités" : "News")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-400 to-medical-600">{tServer("news_title_highlight", siteLang ?? "ar", siteLang === "fr" ? "la plateforme" : "the platform")}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-bold leading-relaxed">
            {tServer(
              "news_description",
              siteLang ?? "ar",
              siteLang === "fr"
                ? "Suivez les dernières annonces, mises à jour importantes et nouvelles fonctionnalités que nous ajoutons continuellement pour améliorer votre expérience d'apprentissage."
                : "Follow the latest announcements, important updates, and new features we continuously add to improve your learning experience."
            )}
          </p>
        </div>
      </div>

      {/* News Content */}
      <NewsClient news={news} userId={userId ?? undefined} isAdmin={isAdmin} />
    </div>
  );
}
