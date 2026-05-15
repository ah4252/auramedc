"use client";

import Link from "next/link";
import { 
  LayoutDashboard, Users, BookOpen, Settings, Video, 
  FileEdit, Calculator, Menu, X, Heart, 
  PlusCircle, Database, LayoutPanelLeft, Bell, MessageSquare, Share2
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const groups = [
    {
      title: "الرئيسية",
      links: [
        { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
      ]
    },
    {
      title: "إدارة المحتوى",
      links: [
        { href: "/admin/lessons", label: "الدروس والفيديوهات", icon: Video },
        { href: "/admin/subjects", label: "المواد والتخصصات", icon: BookOpen },
        { href: "/admin/posts", label: "المنشورات والمقالات", icon: FileEdit },
        { href: "/admin/gpa-calculator", label: "تحرير الالة حاسبة", icon: Calculator },
      ]
    },
    {
      title: "المستخدمين والنشاط",
      links: [
        { href: "/admin/users", label: "قاعدة المستخدمين", icon: Users },
        { href: "/admin/community", label: "إدارة المجتمع", icon: MessageSquare },
        { href: "/admin/social", label: "مواقع التواصل", icon: Share2 },
        { href: "/admin/favorites", label: "تفاعلات المفضلة", icon: Heart },
        { href: "/admin/gpa", label: "سجلات المعدل", icon: Calculator },
      ]
    },
    {
      title: "النظام",
      links: [
        { href: "/admin/settings", label: "الإعدادات العامة", icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Header Toggle */}
      <div className={`md:hidden sticky top-0 z-[60] flex items-center justify-between p-4 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all ${scrolled ? "shadow-md" : ""}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-medical-600 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-medical-600 to-indigo-600 bg-clip-text text-transparent">لوحة التحكم</h2>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          {isOpen ? <X className="w-6 h-6 text-medical-600" /> : <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />}
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed md:static inset-y-0 right-0 z-[80]
        w-72 bg-white dark:bg-dark-card border-l border-slate-200 dark:border-slate-800 
        flex flex-col transform transition-all duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
      `}>
        {/* Sidebar Header */}
        <div className="h-24 hidden md:flex items-center px-8 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-medical-500 to-medical-700 rounded-xl flex items-center justify-center shadow-lg shadow-medical-500/20">
               <LayoutPanelLeft className="w-6 h-6 text-white" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">AuraMed</h2>
               <p className="text-[10px] uppercase tracking-wider text-medical-600 font-bold">Admin Console</p>
             </div>
          </div>
        </div>
        
        {/* Navigation Content */}
        <nav className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
          {groups.map((group, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="px-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[2px]">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.links.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  
                  return (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? "bg-medical-50 dark:bg-medical-900/20 text-medical-600 shadow-sm" 
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-medical-600 dark:hover:text-medical-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${isActive ? "bg-medical-600 text-white shadow-md shadow-medical-600/20" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-medical-100 dark:group-hover:bg-medical-900/30 group-hover:text-medical-600"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-sm font-bold ${isActive ? "text-medical-600 dark:text-medical-400" : ""}`}>{link.label}</span>
                      </div>
                      {isActive && (
                        <motion.div layoutId="active-pill" className="w-1.5 h-1.5 rounded-full bg-medical-600" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-6 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800/50">
          <p className="text-xs text-center text-slate-500 font-medium">© 2025 AuraMed Elite</p>
        </div>
      </aside>
    </>
  );
}
