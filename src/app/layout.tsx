import type { Metadata } from "next";
import { Suspense } from "react";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import MaintenanceGuard from "@/components/layout/MaintenanceGuard";
import { getSettings } from "@/app/actions/settings";
import { prisma, isDatabaseEnabled } from "@/lib/db";
import { cookies } from "next/headers";
import Script from "next/script";
import ActivePresencePing from "@/components/ActivePresencePing";
import SSENotificationListener from "@/components/SSENotificationListener";
import AppLinkGuard from "@/components/AppLinkGuard";

const cairo = Cairo({ subsets: ["arabic", "latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "AuraMed Elite | منصة الطب النخبة",
    template: "%s | AuraMed Elite",
  },
  description: "منصة التعليم الطبي الأرقى في العالم العربي — محاضرات، تخصصات، وأدوات ذكية لطلاب الطب النخبة.",

  manifest: "/manifest.json",
};

export async function generateViewport() {
  try {
    const settings = await getSettings();
    return {
      themeColor: settings.primaryColor || "#0ea5e9",
    };
  } catch (error) {
    console.error("generateViewport: failed to get settings:", error);
    return { themeColor: "#0ea5e9" };
  }
}

import SectionMaintenanceGuard from "@/components/layout/SectionMaintenanceGuard";
import { LocaleProvider } from "@/context/LocaleProvider.client";
import { Locale } from "@/lib/i18n";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAdmin = !!cookieStore.get("admin_token");
  const userId = cookieStore.get("user_token")?.value;
  const showTopNav = !!userId || isAdmin;
  const siteLang = (cookieStore.get("site_lang")?.value as Locale) || "ar";

  let userName = null;
  let userImage = null;
  let unreadNewsCount = 0;
  let incomingRequestsCount = 0;
  
  try {
    if (userId && isDatabaseEnabled()) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          image: true,
          lastReadNewsAt: true,
        },
      });
      userName = user?.name || "طالب";
      userImage = user?.image || null;

      incomingRequestsCount = await prisma.friendship.count({
        where: { friendId: userId, status: "PENDING" }
      });

      if (user?.lastReadNewsAt) {
        unreadNewsCount = await (prisma as any).news.count({
          where: { createdAt: { gt: user.lastReadNewsAt } }
        });
      } else {
        unreadNewsCount = await (prisma as any).news.count();
      }
    }
  } catch {
    userName = "طالب (أوفلاين)";
  }


  let settings;
  try {
    settings = await getSettings();
  } catch {
    settings = {
      primaryColor: "#0ea5e9",
      secondaryColor: "#6366f1",
      darkBg: "#0f172a",
      maintenanceMode: false,
      maintenanceCourses: false,
      maintenanceTimetable: false,

      maintenanceGpa: false,
      maintenanceNews: false,
      maintenanceQcms: false
    };
  }

  const dir = siteLang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={siteLang} dir={dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              const storedTheme = localStorage.getItem('theme');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const isDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
              document.documentElement.classList.toggle('dark', isDark);
            } catch (e) {}
          })();
        `}} />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --medical-600: ${settings.primaryColor || "#0ea5e9"};
            --medical-500: ${settings.primaryColor || "#0ea5e9"};
            --medical-400: ${settings.primaryColor || "#38bdf8"};
            --medical-secondary: ${settings.secondaryColor || "#6366f1"};
            --dark-bg: ${settings.darkBg || "#0f172a"};
          }
          .text-medical-600 { color: var(--medical-600); }
          .bg-medical-600 { background-color: var(--medical-600); }
          .border-medical-600 { border-color: var(--medical-600); }
          html.dark, body.dark { background-color: var(--dark-bg); }
          .dark .bg-dark-bg { background-color: var(--dark-bg); }
        `}} />
      </head>
      <body suppressHydrationWarning className={`${cairo.className} min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-50 transition-colors duration-300`}>
        <AppLinkGuard />
        <SSENotificationListener />
        <LocaleProvider initialLang={siteLang as Locale}>
          <MaintenanceGuard maintenanceMode={settings.maintenanceMode}>
            <ActivePresencePing userId={userId || null} />
            {showTopNav && (
              <Navbar isAdmin={isAdmin} isUser={!!userId} userName={userName} userImage={userImage} userId={userId || null} incomingRequestsCount={incomingRequestsCount} unreadNewsCount={unreadNewsCount} />
            )}
            <main className="flex-1 pb-20 md:pb-0">
              <Suspense fallback={null}>
                <SectionMaintenanceGuard settings={settings}>
                  {children}
                </SectionMaintenanceGuard>
              </Suspense>
            </main>
            <Footer />
            {showTopNav && <MobileNav />}
          </MaintenanceGuard>
        </LocaleProvider>
      </body>
    </html>
  );
}
