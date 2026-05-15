import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import MaintenanceGuard from "@/components/layout/MaintenanceGuard";
import { getSettings } from "@/app/actions/settings";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Script from "next/script";

const cairo = Cairo({ subsets: ["arabic", "latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "AuraMed Elite | منصة الطب النخبة",
    template: "%s | AuraMed Elite",
  },
  description: "منصة التعليم الطبي الأرقى في العالم العربي — محاضرات، تخصصات، وأدوات ذكية لطلاب الطب النخبة.",
  icons: {
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
};

export async function generateViewport() {
  const settings = await getSettings();
  return {
    themeColor: settings.primaryColor || "#0ea5e9",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAdmin = !!cookieStore.get("admin_token");
  const userId = cookieStore.get("user_token")?.value;
  
  let userName = null;
  let userImage = null;
  
  try {
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, image: true }
      });
      userName = user?.name || "طالب";
      userImage = user?.image || null;
    }
  } catch (error) {
    console.error("Layout DB Error (User fetch):", error);
    userName = "طالب (أوفلاين)";
  }

  let settings;
  try {
    settings = await getSettings();
  } catch (error) {
    console.error("Layout DB Error (Settings):", error);
    settings = {
      primaryColor: "#0ea5e9",
      secondaryColor: "#6366f1",
      darkBg: "#0f172a",
      maintenanceMode: false
    };
  }

  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --medical-600: ${settings.primaryColor || "#0ea5e9"};
            --medical-500: ${settings.primaryColor || "#0ea5e9"};
            --medical-400: ${settings.primaryColor || "#38bdf8"};
            --medical-secondary: ${settings.secondaryColor || "#6366f1"};
            --dark-bg: ${settings.darkBg || "#0f172a"};
          }
          .text-medical-600 { color: var(--medical-600) !important; }
          .bg-medical-600 { background-color: var(--medical-600) !important; }
          .border-medical-600 { border-color: var(--medical-600) !important; }
          .dark body, .dark { background-color: var(--dark-bg) !important; }
          .dark .bg-dark-bg { background-color: var(--dark-bg) !important; }
        `}} />
      </head>
      <body className={`${cairo.className} min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-50 transition-colors duration-300`}>
        <MaintenanceGuard maintenanceMode={settings.maintenanceMode}>
          <Navbar isAdmin={isAdmin} isUser={!!userId} userName={userName} userImage={userImage} userId={userId || null} />
          <main className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </MaintenanceGuard>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
