"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlayCircle, Calculator, User, FlaskConical } from "lucide-react";
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
    { name: t("pharmacy", "الصيدلة"), icon: FlaskConical, path: "/pharmacy" },
    { name: t("gpa", "الحاسبة"), icon: Calculator, path: "/gpa-calculator" },
    { name: t("profile", "حسابي"), icon: User, path: "/profile" },
  ];

  return (
    <div
      className="md:hidden fixed left-1/2 -translate-x-1/2 bottom-4 z-50 w-[calc(100%-2rem)] max-w-xl px-3 py-2 bg-white/40 dark:bg-dark-card/40 backdrop-blur-[10px] border border-white/20 dark:border-dark-card/30 rounded-3xl shadow-2xl"
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
