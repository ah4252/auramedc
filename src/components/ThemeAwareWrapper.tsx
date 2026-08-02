"use client";

import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  darkClass?: string;
  lightClass?: string;
};

export default function ThemeAwareWrapper({ children, darkClass = "", lightClass = "" }: Props) {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      if (typeof window === "undefined") return "dark";
      const stored = window.localStorage.getItem("theme");
      if (stored) return stored === "dark" ? "dark" : "light";
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    } catch (e) {
      return "dark";
    }
  });

  useEffect(() => {
    const handler = (e: any) => {
      const t = e?.detail?.theme || window.localStorage.getItem("theme") || (document.documentElement.classList.contains("dark") ? "dark" : "light");
      setTheme(t === "dark" ? "dark" : "light");
    };

    window.addEventListener("theme-change", handler as EventListener);
    window.addEventListener("storage", handler as EventListener);
    return () => {
      window.removeEventListener("theme-change", handler as EventListener);
      window.removeEventListener("storage", handler as EventListener);
    };
  }, []);

  const cls = theme === "dark" ? darkClass : lightClass;
  return <div className={cls}>{children}</div>;
}
