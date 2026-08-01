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
    { name: lang === "fr" ? "Accueil" : "الرئيسية", icon: Home, path: "/" },
    { name: lang === "fr" ? "Cours" : "الدروس", icon: PlayCircle, path: "/courses" },
    { name: lang === "fr" ? "Pharmacie" : "الصيدلة", icon: FlaskConical, path: "/pharmacy" },
    { name: lang === "fr" ? t("gpa", "calculateur") : t("gpa", "الحاسبة"), icon: Calculator, path: "/gpa-calculator" },
    { name: lang === "fr" ? "Mon compte" : "حسابي", icon: User, path: "/profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-2 pb-safe-area">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} className="relative flex flex-col items-center justify-center w-full h-full">
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute -top-1 w-12 h-1 bg-medical-500 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon 
                className={`w-6 h-6 mb-1 transition-colors ${
                  isActive ? "text-medical-600 dark:text-medical-400" : "text-slate-400"
                }`} 
              />
              <span className={`text-[10px] font-bold ${
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
