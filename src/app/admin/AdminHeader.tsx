"use client";

import { User, LayoutPanelLeft } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function AdminHeader({ siteName }: { siteName: string }) {
  return (
    <header className="h-20 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 px-8 flex items-center justify-between sticky top-0 z-30 shrink-0 shadow-sm shadow-slate-100/50 dark:shadow-none">
      <div className="flex items-center gap-4">
        <div className="md:hidden w-10 h-10 bg-medical-600 rounded-xl flex items-center justify-center shadow-lg shadow-medical-600/20">
           <LayoutPanelLeft className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">الإدارة المركزية</h1>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">مرحباً بك في {siteName} Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700 ml-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border border-white dark:border-slate-600 shadow-sm">
            <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
        </div>
        <div className="w-32">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
