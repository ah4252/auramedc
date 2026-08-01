"use client";

import Link from "next/link";
import { BookOpen, User, Menu, Stethoscope, Lock, X, ShieldCheck, Sparkles, Globe, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { logoutAdmin, logoutUser } from "@/app/actions/auth";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/context/LocaleProvider.client";

export default function Navbar({ isAdmin = false, isUser = false, userName = null, userImage = null, userId = null, incomingRequestsCount = 0, unreadNewsCount = 0 }: { isAdmin?: boolean, isUser?: boolean, userName?: string | null, userImage?: string | null, userId?: string | null, incomingRequestsCount?: number, unreadNewsCount?: number }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const shouldShowNav = !isAuthRoute && (isUser || isAdmin);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const { t, lang, setLang } = useLocale();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const isRtl = lang === "ar";

  const handleLogoClick = (e: React.MouseEvent) => {
    // Increment clicks
    setClicks(prev => prev + 1);

    if (clickTimeout.current) clearTimeout(clickTimeout.current);

    clickTimeout.current = setTimeout(() => {
      setClicks(0); // reset if they stop clicking
    }, 1000);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogoutUser = async () => {
    await logoutUser();
    router.refresh();
    router.push("/");
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("password", password);

    const { loginAdmin } = await import("@/app/actions/auth");
    const res = await loginAdmin(formData);

    if (res?.error) {
      setError(res.error);
    } else {
      setShowModal(false);
      setPassword("");
      router.refresh();
      router.push("/admin");
    }

    setLoading(false);
  };

  if (!shouldShowNav) return null;

  return (
    <>
      <nav className={`${pathname?.startsWith("/admin") ? "" : "sticky top-0"} z-40 w-full glass-panel border-b`}>
        <div className="container mx-auto px-4 h-16 flex flex-wrap items-center justify-between gap-3 min-w-0">

          {/* Premium Logo */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 select-none cursor-pointer group"
          >
            {/* Logo Image */}
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
              <img
                src="/logo.png"
                alt="AuraMed Logo"
                className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 rounded-full bg-sky-500/20 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>

            {/* Text part */}
            <div className="flex flex-col leading-none">
              <span className="text-lg md:text-xl font-black tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600 italic">Aura</span>
                <span className="text-slate-800 dark:text-white not-italic font-light">Med</span>
              </span>
              <span className="text-[7px] md:text-[8px] font-black tracking-[0.3em] text-amber-500 uppercase mt-0.5">Elite</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex flex-1 min-w-0 items-center gap-3 xl:gap-6 font-bold text-xs lg:text-xs xl:text-sm overflow-x-auto whitespace-nowrap scrollbar-none">
            <Link href="/" className="relative group text-slate-700 dark:text-slate-300 hover:text-medical-600 transition-colors shrink-0">
              {t("home", "الرئيسية")}
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-medical-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/courses" className="relative group text-slate-700 dark:text-slate-300 hover:text-medical-600 transition-colors shrink-0">
              {t("courses", "السنوات الدراسية")}
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-medical-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/subjects" className="relative group text-slate-700 dark:text-slate-300 hover:text-medical-600 transition-colors shrink-0">
              {t("subjects", "التخصصات")}
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-medical-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/pharmacy" className="relative group text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors shrink-0">
              {t("pharmacy", "الصيدلة")}
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/timetable" className="relative group text-slate-700 dark:text-slate-300 hover:text-medical-600 transition-colors shrink-0">
              {t("timetable", "جدول الدراسة")}
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-medical-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link href="/news" className="relative group text-slate-700 dark:text-slate-300 hover:text-medical-600 transition-colors shrink-0 flex items-center gap-1.5">
              <span>{t("news", "الأخبار")}</span>
              {unreadNewsCount > 0 && (
                <span className="flex items-center justify-center min-w-[1.1rem] h-4 px-1 bg-medical-500 text-white text-[10px] font-black rounded-full shadow-md animate-bounce">
                  {unreadNewsCount > 99 ? "+99" : unreadNewsCount}
                </span>
              )}
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-medical-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {isUser && (
              <Link href="/friends" className="relative group text-slate-700 dark:text-slate-300 hover:text-medical-600 transition-colors shrink-0 flex items-center gap-1.5">
                <span>{t("friends", "الأصدقاء")}</span>
                {incomingRequestsCount > 0 && (
                  <span className="flex items-center justify-center min-w-[1.1rem] h-4 px-1 bg-red-500 text-white text-[10px] font-black rounded-full shadow-md animate-bounce">
                    {incomingRequestsCount > 99 ? "+99" : incomingRequestsCount}
                  </span>
                )}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-medical-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
            <Link
              href="/gpa-calculator"
              className="px-4 py-2 bg-gradient-to-r from-medical-600 to-medical-400 text-white rounded-xl hover:shadow-md hover:shadow-medical-600/30 hover:scale-105 active:scale-95 transition-all font-black text-[11px] lg:text-xs xl:text-sm shadow-sm shadow-medical-600/10 shrink-0 whitespace-nowrap"
            >
              {t("gpa", "حاسبة المعدل")}
            </Link>
            {isAdmin && (
              <Link href="/admin" className="group text-medical-600 dark:text-medical-400 font-bold flex items-center gap-1 bg-medical-50 dark:bg-medical-900/30 px-3 py-1.5 rounded-lg hover:bg-medical-100 dark:hover:bg-medical-900/50 transition-all border border-medical-100 dark:border-medical-500/20 shadow-sm shrink-0">
                <Lock className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                <span>{t("admin", "لوحة التحكم")}</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {isUser ? (
              <div className="flex items-center gap-2 lg:gap-3">
                <Link href="/profile" className="flex items-center gap-2 group">
                  <div className="hidden xl:flex flex-col items-end mr-1 group-hover:text-medical-600 transition-colors leading-tight">
                    <span className="text-[10px] text-slate-400 truncate">{t("welcome", "أهلاً بك")}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[5.5rem]">{userName}</span>
                  </div>
                  <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center border-2 border-transparent group-hover:border-medical-500 transition-all overflow-hidden shrink-0">
                    {userImage ? (
                      <img src={userImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-medical-600 dark:text-medical-400" />
                    )}
                  </div>
                </Link>
                <button
                  onClick={handleLogoutUser}
                  className="hidden lg:block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-rose-50 hover:text-rose-600 transition-all shrink-0"
                >
                  {t("logout", "خروج")}
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-2 bg-medical-600 hover:bg-medical-700 text-white px-4 py-2 rounded-full transition-all shadow-md shadow-medical-600/20 shrink-0 text-xs whitespace-nowrap">
                <User className="w-3.5 h-3.5" />
                <span>{t("login", "تسجيل الدخول")}</span>
              </Link>
            )}

            {/* Language dropdown — محفوظة المساحة وتصميم جذاب */}
            <div className="relative" ref={langMenuRef as any}>
              <button
                onClick={() => setShowLangMenu((v) => !v)}
                aria-expanded={showLangMenu}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-black transition-all ${"bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
                title={t("change_language", "تغيير اللغة")}
              >
                <Globe className="w-4 h-4" />
                <ChevronDown className={`w-3 h-3 transition-transform ${showLangMenu ? "-rotate-180" : "rotate-0"}`} />
              </button>

              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className={`absolute mt-2 w-48 bg-white dark:bg-dark-card rounded-xl shadow-xl z-50 overflow-hidden border border-slate-100 dark:border-slate-800 ${isRtl ? 'left-0' : 'right-0'}`}
                    style={{ transformOrigin: isRtl ? 'left top' : 'right top' }}
                  >
                    {/* Arabic item - styled as highlighted when selected */}
                    <button
                      onClick={() => {
                        try { document.cookie = `site_lang=ar; path=/; max-age=${60 * 60 * 24 * 365}`; window.localStorage.setItem("site_lang", "ar"); } catch (e) {}
                        setLang("ar");
                        setShowLangMenu(false);
                        setTimeout(() => router.refresh(), 80);
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 transition-colors ${lang === "ar" ? "bg-medical-600 text-white" : "bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm ${lang === "ar" ? "bg-white text-medical-600" : "bg-slate-800 text-slate-200 dark:bg-slate-700"}`}>
                          ع
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black">العربية</div>
                          <div className="text-[11px] opacity-60">AR</div>
                        </div>
                      </div>
                      {lang === "ar" && <span className="text-[12px] font-black">✓</span>}
                    </button>

                    {/* French item */}
                    <button
                      onClick={() => {
                        try { document.cookie = `site_lang=fr; path=/; max-age=${60 * 60 * 24 * 365}`; window.localStorage.setItem("site_lang", "fr"); } catch (e) {}
                        setLang("fr");
                        setShowLangMenu(false);
                        setTimeout(() => router.refresh(), 80);
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 transition-colors ${lang === "fr" ? "bg-medical-600 text-white" : "bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm ${lang === "fr" ? "bg-white text-medical-600" : "bg-slate-800 text-slate-200 dark:bg-slate-700"}`}>
                          FR
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black">Français</div>
                          <div className="text-[11px] opacity-60">FR</div>
                        </div>
                      </div>
                      {lang === "fr" && <span className="text-[12px] font-black">✓</span>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden relative p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              title="القائمة"
            >
              <Menu className="w-6 h-6" />
              {(incomingRequestsCount > 0 || unreadNewsCount > 0) && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              )}
              {(incomingRequestsCount > 0 || unreadNewsCount > 0) && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[50] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white dark:bg-dark-bg z-[55] lg:hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-black text-xl text-medical-600">{t("menu", "القائمة")}</span>
                <button onClick={() => setShowMobileMenu(false)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full" title={t("close", "إغلاق")}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 font-bold text-lg">
                <Link href="/" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                  {t("home", "الرئيسية")}
                </Link>
                <Link href="/courses" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                  {t("courses", "السنوات الدراسية")}
                </Link>
                <Link href="/subjects" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                  {t("subjects", "التخصصات")}
                </Link>
                <Link href="/pharmacy" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors text-emerald-700 dark:text-emerald-400">
                  {t("pharmacy", "الصيدلة")}
                </Link>
                <Link href="/timetable" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                  {t("timetable", "جدول الدراسة")}
                </Link>

                <Link href="/news" onClick={() => setShowMobileMenu(false)} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                  <div className="flex items-center gap-3">
                    {t("news", "الأخبار")}
                  </div>
                  {unreadNewsCount > 0 && (
                    <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 bg-medical-500 text-white text-[11px] font-black rounded-full shadow-md animate-pulse">
                      {unreadNewsCount > 99 ? "+99" : unreadNewsCount}
                    </span>
                  )}
                </Link>
                {isUser && (
                  <Link href="/friends" onClick={() => setShowMobileMenu(false)} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                    <span>{t("friends", "الأصدقاء")}</span>
                    {incomingRequestsCount > 0 && (
                      <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 bg-red-500 text-white text-[11px] font-black rounded-full shadow-md animate-pulse">
                        {incomingRequestsCount > 99 ? "+99" : incomingRequestsCount}
                      </span>
                    )}
                  </Link>
                )}
                <Link href="/gpa-calculator" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-4 p-4 bg-medical-50 dark:bg-medical-900/20 text-medical-600 rounded-2xl">
                  <Sparkles className="w-5 h-5" />
                  {t("gpa", "حاسبة المعدل")}
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-4 p-4 text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
                    <Lock className="w-5 h-5" />
                    {t("admin", "لوحة التحكم")}
                  </Link>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {/* Mobile language switcher removed */}

                {isUser ? (
                  <button
                    onClick={() => { handleLogoutUser(); setShowMobileMenu(false); }}
                    className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black"
                  >
                    {t("logout", "تسجيل الخروج")}
                  </button>
                ) : isAdmin ? null : (
                  <Link
                    href="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-medical-600 text-white rounded-2xl font-black shadow-lg shadow-medical-600/20"
                  >
                    <User className="w-5 h-5" />
                    {t("login", "تسجيل الدخول")}
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Secret Admin Login Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-dark-card w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative border border-slate-200 dark:border-slate-800"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 left-6 p-2 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center mb-8 mt-4">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-tr from-medical-600 to-medical-400 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-medical-600/30 rotate-12">
                    <Lock className="w-10 h-10" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center border-2 border-white dark:border-dark-card">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">المنطقة المحظورة</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">تشفير عالي المستوى - يرجى إدخال رمز الدخول</p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-black mb-6 text-center border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    placeholder="••••••••"
                    className="w-full p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-medical-500 focus:bg-white dark:focus:bg-slate-900 outline-none text-center font-mono text-2xl tracking-[0.5em] transition-all"
                    dir="ltr"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-medical-600 dark:hover:bg-medical-500 dark:hover:text-white font-black py-5 rounded-2xl transition-all disabled:opacity-50 shadow-xl"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    "تأكيد الهوية والدخول"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black italic">Security Protocol Alpha-7</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
