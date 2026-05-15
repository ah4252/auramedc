"use client";

import { LogOut } from "lucide-react";
import { logoutAdmin } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = "/";
  };

  return (
    <button 
      onClick={handleLogout}
      className="group flex flex-row items-center gap-2 w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/30 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-slate-100 dark:border-slate-700/50 hover:border-rose-200 dark:hover:border-rose-500/20 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-300 shadow-sm"
    >
      <span className="font-bold text-xs whitespace-nowrap">تسجيل الخروج</span>
      <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40 group-hover:border-rose-200 dark:group-hover:border-rose-500/30 group-hover:-translate-x-0.5 transition-all">
        <LogOut className="w-3.5 h-3.5 rotate-180" />
      </div>
    </button>
  );
}
