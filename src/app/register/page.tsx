"use client";

import { registerUser } from "@/app/actions/auth";
import { getAvailableStudyYears } from "@/app/actions/news";
import { useState, useRef, useEffect, useMemo } from "react";
import { UserPlus, Mail, Lock, User, ArrowRight, Sparkles, HeartPulse, X, CalendarDays, Eye, EyeOff, Globe, ChevronDown, Check, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/context/LocaleProvider.client";
import ThemeToggle from "@/components/layout/ThemeToggle";

const algerianWilayas = [
  "الجزائر — جامعة الجزائر 1 — كلية",
  "البليدة — جامعة البليدة 1 — كلية",
  "وهران — جامعة وهران 1 — كلية",
  "قسنطينة — جامعة قسنطينة 3 — كلية",
  "عنابة — جامعة باجي مختار عنابة — كلية",
  "سطيف — جامعة سطيف 1 — كلية",
  "باتنة — جامعة باتنة 2 — كلية",
  "تلمسان — جامعة تلمسان — كلية",
  "سيدي بلعباس — جامعة الجيلالي ليابس — كلية",
  "تيزي وزو — جامعة مولود معمري — كلية",
  "بجاية — جامعة عبد الرحمان ميرة — كلية",
  "سعيدة — جامعة الدكتور مولاي الطاهر — كلية",
  "ورقلة — جامعة قاصدي مرباح — كلية",
  "الجلفة — جامعة زيان عاشور — كلية",
  "الشلف — جامعة حسيبة بن بوعلي — كلية",
  "المدية — جامعة يحيى فارس — كلية",
  "بسكرة — جامعة محمد خيضر — كلية",
  "الوادي — جامعة الشهيد حمه لخضر — كلية",
  "بومرداس — جامعة أمحمد بوقرة — كلية",
  "قالمة — جامعة باجي مختار عنابة — ملحقة",
  "عين الدفلى (خميس مليانة) — جامعة الجيلالي بونعامة — ملحقة",
  "تبسة — جامعة باتنة — ملحقة",
  "تمنراست — جامعة أحمد دراية أدرار — ملحقة",
  "سوق أهراس — جامعة باجي مختار عنابة — ملحقة",
  "خنشلة — جامعة قسنطينة 3 — ملحقة",
  "جيجل — جامعة عبد الرحمان ميرة بجاية — ملحقة",
  "تيارت — جامعة وهران 1 — ملحقة",
  "المسيلة — جامعة سطيف 1 — ملحقة",
  "أدرار — جامعة أحمد دراية — ملحقة",
  "تيبازة — جامعة البليدة 1 — ملحقة",
  "معسكر — جامعة الجيلالي ليابس سيدي بلعباس — ملحقة",
  "أم البواقي — جامعة قسنطينة 3 — ملحقة",
  "سكيكدة — جامعة باجي مختار عنابة — ملحقة"
].sort((a, b) => a.localeCompare(b, 'ar', { sensitivity: 'base' }));

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const router = useRouter();
  const { t, lang, setLang } = useLocale();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const isRtl = lang === "ar";
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [wilayaType, setWilayaType] = useState<"ALL" | "كلية" | "ملحقة">("ALL");

  useEffect(() => {
    getAvailableStudyYears().then(setAvailableYears);
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("theme");
      if (stored) setTheme(stored === "dark" ? "dark" : "light");
      else setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");

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
    } catch (e) {}
  }, []);
  // listen for theme changes to trigger re-render if needed
  useEffect(() => {
    try {
      const handler = (e: Event) => {};
      window.addEventListener('theme-change', handler as EventListener);
      window.addEventListener('storage', handler as EventListener);
      return () => {
        window.removeEventListener('theme-change', handler as EventListener);
        window.removeEventListener('storage', handler as EventListener);
      };
    } catch (e) {}
  }, []);

  const filteredWilayas = useMemo(() => {
    return algerianWilayas
      .filter(wilaya => {
        if (wilayaType === "ALL") return true;
        return wilaya.includes(wilayaType === "كلية" ? "— كلية" : "— ملحقة");
      })
      .sort((a, b) => a.localeCompare(b, 'ar', { sensitivity: 'base' }));
  }, [wilayaType]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const wilaya = (formData.get("wilaya") as string)?.trim() || "";
    
    // التحقق من أن الإيميل ينتهي بـ @gmail.com
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setError(t("register_error_gmail", "عذراً، يُسمح فقط بإنشاء حساب باستخدام بريد @gmail.com"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("register_error_password_mismatch", "كلمتا المرور غير متطابقتين"));
      return;
    }

    if (!wilaya) {
      setError(t("register_error_wilaya_required", "يجب اختيار ولاية الدراسة قبل إنشاء الحساب"));
      return;
    }

    if (!termsAccepted) {
      setError(t("register_error_terms_required", "يجب الموافقة على الشروط والأحكام قبل إنشاء الحساب"));
      return;
    }

    setLoading(true);
    setError("");
    const res = await registerUser(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/register/complete");
    }
  }

  return (
    <div className={`min-h-screen font-cairo flex items-center justify-center p-4 relative overflow-hidden ${theme === 'dark' ? 'bg-[#0B1120] text-white' : 'bg-white text-slate-900'}`}>
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-medical-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className={`${theme === 'dark' ? 'bg-[#0f172a]/70 text-white border-white/5' : 'bg-white/90 text-slate-900 border-slate-300'} backdrop-blur-2xl rounded-[3rem] shadow-[0_0_80px_-20px_rgba(14,165,233,0.25)] border p-8 md:p-12 relative overflow-hidden`}>
          
          {/* Subtle top border gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-medical-500/50 to-transparent"></div>

          <div className="absolute top-6 right-6 z-20">
            <div ref={langMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setShowLangMenu((prev) => !prev)}
                title={t("change_language", "تغيير اللغة")}
                className={`${theme === 'dark' ? 'inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-black text-slate-100 shadow-lg shadow-slate-900/10 backdrop-blur-xl hover:bg-white/15' : 'inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-black text-slate-900 shadow-sm hover:bg-white/95' } transition-all`}
              >
                <Globe className={`w-4 h-4 ${theme === 'dark' ? 'text-sky-300' : 'text-slate-700'}`} />
                <ChevronDown className={`w-3 h-3 transition-transform ${showLangMenu ? "-rotate-180" : "rotate-0"} ${theme === 'dark' ? '' : 'text-slate-700'}`} />
              </button>

              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className={`mt-2 w-48 rounded-[1.5rem] border border-white/10 bg-slate-950/95 shadow-2xl shadow-slate-900/40 overflow-hidden backdrop-blur-3xl ${isRtl ? "left-0" : "right-0"}`}
                    style={{ transformOrigin: isRtl ? "left top" : "right top" }}
                  >
                    {[
                      { id: "ar", label: "العربية", code: "ع" },
                      { id: "fr", label: "Français", code: "FR" },
                      { id: "en", label: "English", code: "EN" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          try { document.cookie = `site_lang=${item.id}; path=/; max-age=${60 * 60 * 24 * 365}`; window.localStorage.setItem("site_lang", item.id); } catch (e) {}
                          setLang(item.id as any);
                          setShowLangMenu(false);
                          setTimeout(() => router.refresh(), 80);
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-all ${lang === item.id ? "bg-medical-600/95 text-white" : "text-slate-200 hover:bg-white/10"}`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-2xl bg-slate-800 flex items-center justify-center text-xs font-black">{item.code}</span>
                          <span>{item.label}</span>
                        </span>
                        {lang === item.id && <span className="text-xs font-black">✓</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="absolute top-6 left-6 z-20">
            <ThemeToggle />
          </div>

          <div className="flex flex-col items-center mb-10 text-center">
            <Link href="/" className="inline-flex items-center justify-center p-4 rounded-3xl bg-medical-500/10 border border-medical-500/20 text-medical-400 mb-6 group hover:bg-medical-500/20 transition-all duration-300">
              <HeartPulse className="w-10 h-10 group-hover:scale-110 transition-transform" />
            </Link>

            <p className={`text-[10px] font-black tracking-[0.35em] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t("auth_brand_badge", "AURAMED")}</p>
            <h2 className={`mt-3 text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t("auth_brand_name", "AuraMed Elite")}</h2>
            
            <h1 className="text-3xl font-black mb-3 tracking-tight">
              {t("register_page_title", "إنشاء")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-400 to-sky-400">{t("register_page_action", "حساب جديد")}</span>
            </h1>
            <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'} font-bold`}>{t("register_page_subtitle", "انضم لآلاف الطلاب وابدأ رحلتك التعليمية المتميزة")}</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm font-black text-center border border-red-500/20 flex items-center justify-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className={`text-sm font-black ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'} mr-2`}>{t("name_label", "الاسم الكامل")}</label>
              <div className="relative group">
                <input 
                  name="name"
                  type="text"
                  required
                  placeholder={t("register_name_placeholder", "أدخل اسمك الثلاثي")}
                  className={`${theme === 'dark' ? 'w-full pl-4 pr-14 py-4 rounded-2xl border border-slate-700 bg-[#0B1120]/50 text-white placeholder:text-slate-500' : 'w-full pl-4 pr-14 py-4 rounded-2xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-700'} focus:border-medical-500 focus:ring-1 focus:ring-medical-500 outline-none transition-all font-bold`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg group-focus-within:bg-medical-500 group-focus-within:text-white text-slate-400 transition-colors">
                  <User className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-black ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'} mr-2 flex justify-between`}>
                <span>{t("email_label", "البريد الإلكتروني")}</span>
                <span className="text-medical-400 text-[10px] bg-medical-500/10 px-2 py-0.5 rounded-full border border-medical-500/20">{t("email_gmail_hint", "يجب أن يكون @gmail")}</span>
              </label>
              <div className="relative group">
                <input 
                  name="email"
                  type="email"
                  required
                  placeholder={t("email_placeholder", "name@gmail.com")}
                  className={`${theme === 'dark' ? 'w-full pl-4 pr-14 py-4 rounded-2xl border border-slate-700 bg-[#0B1120]/50 text-white placeholder:text-slate-500' : 'w-full pl-4 pr-14 py-4 rounded-2xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-700'} focus:border-medical-500 focus:ring-1 focus:ring-medical-500 outline-none transition-all font-bold text-left`}
                  dir="ltr"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg group-focus-within:bg-medical-500 group-focus-within:text-white text-slate-400 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-black ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'} mr-2`}>{t("study_year_label", "السنة الدراسية")}</label>
              <div className="relative group">
                <select 
                  name="studyYear"
                  required
                  className={`${theme === 'dark' ? 'w-full pl-4 pr-14 py-4 rounded-2xl border border-slate-700 bg-[#0B1120]/50 text-white' : 'w-full pl-4 pr-14 py-4 rounded-2xl border border-slate-300 bg-white text-slate-900'} focus:border-medical-500 focus:ring-1 focus:ring-medical-500 outline-none transition-all font-bold appearance-none cursor-pointer`}
                >
                  <option value="" disabled hidden>{t("study_year_placeholder", "اختر السنة الدراسية")}</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg group-focus-within:bg-medical-500 group-focus-within:text-white text-slate-400 transition-colors pointer-events-none">
                  <CalendarDays className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-black ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'} mr-2 flex items-center gap-2`}>
                <MapPin className="w-4 h-4 text-medical-500" />
                <span>{t("register_wilaya_label", "ولاية الدراسة")}</span>
                <span className="text-[10px] bg-medical-500/10 text-medical-500 px-2 py-0.5 rounded-full border border-medical-500/20">إجباري</span>
              </label>
              <div className="grid gap-3 lg:grid-cols-[1fr_2fr]">
                <div className="relative group">
                  <label className="sr-only">نوع الولاية</label>
                  <select
                    value={wilayaType}
                    onChange={(e) => setWilayaType(e.target.value as "ALL" | "كلية" | "ملحقة")}
                    className={`${theme === 'dark' ? 'w-full pl-4 pr-10 py-4 rounded-2xl border border-slate-700 bg-[#0B1120]/50 text-white' : 'w-full pl-4 pr-10 py-4 rounded-2xl border border-slate-300 bg-white text-slate-900'} focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-bold appearance-none cursor-pointer`}
                  >
                    <option value="ALL">اختر نوع الولاية</option>
                    <option value="كلية">كلية</option>
                    <option value="ملحقة">ملحقة</option>
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                <div className="relative group">
                  <label className="sr-only">اختر الولاية</label>
                  <select
                    name="wilaya"
                    required
                    disabled={wilayaType === "ALL"}
                    className={`${theme === 'dark' ? 'w-full pl-4 pr-14 py-4 rounded-2xl border border-slate-700 bg-[#0B1120]/50 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.02)]' : 'w-full pl-4 pr-14 py-4 rounded-2xl border border-slate-300 bg-white text-slate-900 shadow-sm'} focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-bold appearance-none cursor-pointer text-right ${wilayaType === "ALL" ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <option value="" disabled hidden>{wilayaType === "ALL" ? t("register_wilaya_placeholder", "اختر نوع الولاية أولاً") : t("register_wilaya_placeholder", "اختر ولايتك")}</option>
                    {filteredWilayas.map(wilaya => (
                      <option key={wilaya} value={wilaya} className="text-slate-900">{wilaya}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl group-focus-within:bg-medical-500 group-focus-within:text-white text-slate-500 dark:text-slate-400 transition-colors pointer-events-none">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-black ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'} mr-2`}>{t("password_label", "كلمة المرور")}</label>
              <div className="relative group">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={t("password_input_placeholder", "••••••••")}
                  className={`${theme === 'dark' ? 'w-full pl-12 pr-14 py-4 rounded-2xl border border-slate-700 bg-[#0B1120]/50 text-white placeholder:text-slate-500' : 'w-full pl-12 pr-14 py-4 rounded-2xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-700'} focus:border-medical-500 focus:ring-1 focus:ring-medical-500 outline-none transition-all font-bold text-left`}
                  dir="ltr"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg group-focus-within:bg-medical-500 group-focus-within:text-white text-slate-400 transition-colors pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-black ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'} mr-2`}>{t("confirm_password_label", "تأكيد كلمة المرور")}</label>
              <div className="relative group">
                <input 
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder={t("confirm_password_input_placeholder", "••••••••")}
                  className={`${theme === 'dark' ? 'w-full pl-12 pr-14 py-4 rounded-2xl border border-slate-700 bg-[#0B1120]/50 text-white placeholder:text-slate-500' : 'w-full pl-12 pr-14 py-4 rounded-2xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-700'} focus:border-medical-500 focus:ring-1 focus:ring-medical-500 outline-none transition-all font-bold text-left`}
                  dir="ltr"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg group-focus-within:bg-medical-500 group-focus-within:text-white text-slate-400 transition-colors pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-700 bg-[#09101d]/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-sm font-black text-slate-200 underline-offset-2 hover:text-white transition-colors"
                >
                  {t("terms_and_conditions_label", "الشروط والأحكام")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTermsAccepted((prev) => !prev);
                    setError("");
                  }}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 font-black transition-all ${termsAccepted ? "bg-emerald-500 text-white" : "bg-medical-500/10 text-medical-200 hover:bg-medical-500/20"}`}
                >
                  {termsAccepted && <Check className="w-4 h-4 text-white" />}
                  <span>{termsAccepted ? t("terms_revoke_button", "إلغاء الموافقة") : t("terms_accept_button", "الموافقة")}</span>
                </button>
              </div>
              <p className={`text-xs font-bold ${termsAccepted ? "text-emerald-300" : "text-slate-500"}`}>
                {termsAccepted
                  ? t("terms_accepted_note", "تمت الموافقة على الشروط والأحكام")
                  : t("terms_not_accepted_note", "يجب الموافقة على الشروط والأحكام قبل التسجيل")}
              </p>
            </div>

            <button 
              type="submit"
              disabled={loading || !termsAccepted}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-medical-600 to-sky-500 hover:from-medical-500 hover:to-sky-400 text-white font-black py-4 rounded-2xl transition-all shadow-[0_0_40px_-10px_rgba(14,165,233,0.5)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <div className="relative flex items-center justify-center gap-2 z-10">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{t("register_button", "إنشاء الحساب الآن")}</span>
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm font-bold">
              {t("register_have_account", "لديك حساب بالفعل؟")} {" "}
              <Link href="/login" className="text-medical-400 font-black hover:text-medical-300 hover:underline transition-colors ml-1">
                {t("register_login_link", "سجل دخولك من هنا")}
              </Link>
            </p>
          </div>

          <AnimatePresence>
            {showTermsModal && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowTermsModal(false)}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="relative w-full max-w-lg bg-[#0f172a] rounded-[2rem] border border-slate-700/50 shadow-[0_0_80px_-10px_rgba(14,165,233,0.3)] overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-medical-500/60 to-transparent"></div>
                  <div className="p-8">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-xl font-black text-white">{t("terms_modal_title", "سياسة الموقع والخصوصية")}</h2>
                        <p className="text-slate-400 text-sm font-bold mt-2">
                          {t("terms_modal_description", "راجع كيف يعمل الموقع وكيف نحمي خصوصيتك قبل الموافقة.")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(false)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-white/10 text-slate-300 transition-all"
                        aria-label={t("terms_modal_close", "إغلاق")}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4 text-sm leading-relaxed text-slate-300">
                      <p>{t("terms_modal_paragraph_1", "يُستخدم الموقع لتقديم محتوى تعليمي طبي موجه للطلاب المسجلين. عند إنشاء الحساب، توافق على استخدام بياناتك لتحسين تجربتك داخل المنصة.")}</p>
                      <p>{t("terms_modal_paragraph_2", "نحترم خصوصيتك ونحافظ على المعلومات الشخصية سرية. لا نشارك بيانات التسجيل مع طرف ثالث بدون موافقتك.")}</p>
                      <p>{t("terms_modal_paragraph_3", "باستخدام المنصة، توافق على شروط الاستخدام وسياسة الخصوصية كما هي موضحة في هذه النافذة.")}</p>
                      <p>{t("terms_modal_paragraph_4", "يمكنك الرجوع إلى هذه السياسة في أي وقت، ونستخدم بياناتك فقط لتحسين تجربتك التعليمية داخل المنصة، مثل تذكيرك بالدروس الجديدة أو تحديثات المحتوى.")}</p>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(false)}
                        className="rounded-2xl border border-slate-700 px-5 py-3 font-black text-slate-200 hover:bg-white/5 transition-all"
                      >
                        {t("terms_modal_close", "إغلاق")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTermsAccepted(true);
                          setShowTermsModal(false);
                          setError("");
                        }}
                        className="rounded-2xl bg-medical-600 px-5 py-3 font-black text-white hover:bg-medical-500 transition-all"
                      >
                        {t("terms_modal_accept", "أوافق وأغلق")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
}
