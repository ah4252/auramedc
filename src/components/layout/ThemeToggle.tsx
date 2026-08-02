"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const storedTheme = window.localStorage.getItem("theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = storedTheme === "dark" || (!storedTheme && prefersDark) ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.classList.toggle("dark", initialTheme === "dark");
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", theme === "dark");
      window.localStorage.setItem("theme", theme);
      try {
        window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }));
      } catch (e) {}
    } catch (e) {}
  }, [theme]);

  const btnClass = theme === "dark"
    ? "inline-flex items-center justify-center h-10 w-10 rounded-2xl border border-white/15 bg-white/8 text-slate-100 shadow-md transition-all pointer-events-auto"
    : "inline-flex items-center justify-center h-10 w-10 rounded-2xl border border-slate-200 bg-white/90 text-slate-900 shadow-sm transition-all pointer-events-auto";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setTheme((p) => (p === "dark" ? "light" : "dark"));
      }}
      className={btnClass + (className ? ` ${className}` : "")}
      aria-label={theme === "dark" ? "التبديل للوضع النهاري" : "التبديل للوضع الليلي"}
      title={theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
