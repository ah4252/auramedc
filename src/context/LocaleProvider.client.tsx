"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import ar from "@/locales/ar.json";
import fr from "@/locales/fr.json";

type Locale = "ar" | "fr";

const translations: Record<Locale, Record<string, string>> = {
  ar,
  fr,
};

const LocaleContext = createContext({
  lang: "ar" as Locale,
  setLang: (l: Locale) => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export function LocaleProvider({ initialLang, children }: { initialLang?: Locale; children: React.ReactNode }) {
  const [lang, setLang] = useState<Locale>(initialLang || (typeof window !== "undefined" && (window.localStorage.getItem("site_lang") as Locale)) || "ar");

  useEffect(() => {
    try {
      window.localStorage.setItem("site_lang", lang);
      document.cookie = `site_lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`;
    } catch (e) {
      // ignore
    }
  }, [lang]);

  const t = (key: string, fallback?: string) => {
    return translations[lang][key] || fallback || key;
  };

  return (
    <LocaleContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
