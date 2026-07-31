import ar from "@/locales/ar.json";
import fr from "@/locales/fr.json";

export type Locale = "ar" | "fr";

const map: Record<Locale, Record<string, string>> = {
  ar,
  fr,
};

export function getTranslations(lang: Locale = "ar") {
  return map[lang] || map.ar;
}

export function tServer(key: string, lang: Locale = "ar", fallback?: string) {
  const translations = getTranslations(lang);
  return translations[key] || fallback || key;
}
