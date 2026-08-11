"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlayCircle, Calculator, User, Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleProvider.client";

export default function MobileNav() {
  const pathname = usePathname();
  const { t, lang } = useLocale();
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  if (isAuthRoute) return null;

  const navItems = [
    { name: t("home", "الرئيسية"), icon: Home, path: "/" },
    { name: t("courses", "الدروس"), icon: PlayCircle, path: "/courses" },
    { name: t("news", "الأخبار"), icon: Newspaper, path: "/news" },
    { name: t("gpa", "الحاسبة"), icon: Calculator, path: "/gpa-calculator" },
    { name: t("profile", "حسابي"), icon: User, path: "/profile" },
  ];

  return (
    <div
      className="md:hidden fixed left-1/2 -translate-x-1/2 bottom-4 z-50 w-[calc(100%-2rem)] max-w-xl px-3 py-2 rounded-3xl border border-white/20 dark:border-white/10 backdrop-blur-[20px] bg-white/20 dark:bg-slate-950/30 text-slate-100 dark:text-slate-200 shadow-[0_10px_40px_rgba(2,6,23,0.28)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
    >
      <div className="flex items-center justify-around h-12">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} className="relative flex-1 flex flex-col items-center justify-center min-w-0 h-full">
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute -top-1 w-12 h-1 bg-medical-500 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon 
                className={`w-6 h-6 mb-0.5 transition-colors ${
                  isActive ? "text-medical-600 dark:text-medical-400" : "text-slate-400"
                }`} 
              />
              <span className={`text-[10px] font-bold truncate whitespace-nowrap ${
                isActive ? "text-medical-600 dark:text-medical-400" : "text-slate-400"
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
