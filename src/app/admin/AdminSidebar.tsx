"use client";

import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, Settings, Video, FileEdit, Calculator, Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/admin", label: "الرئيسية", icon: LayoutDashboard },
    { href: "/admin/lessons", label: "إضافة درس", icon: Video },
    { href: "/admin/subjects", label: "المواد والتخصصات", icon: BookOpen },
    { href: "/admin/users", label: "المستخدمين", icon: Users },
    { href: "/admin/favorites", label: "المفضلة", icon: Heart },
    { href: "/admin/gpa", label: "حاسبة المعدل", icon: Calculator },
    { href: "/admin/posts", label: "المنشورات (تعديل/حذف)", icon: FileEdit },
    { href: "/admin/settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Header Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-dark-card border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-medical-600">لوحة التحكم</h2>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed md:static inset-y-0 right-0 z-50
        w-64 bg-white dark:bg-dark-card border-l border-slate-200 dark:border-slate-800 
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
      `}>
        <div className="h-16 hidden md:flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-medical-600 dark:text-medical-400">لوحة التحكم</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                  isActive 
                    ? "bg-medical-600 text-white shadow-lg shadow-medical-600/30" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-medical-600"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
