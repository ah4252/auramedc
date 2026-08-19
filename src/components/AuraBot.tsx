"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  BookOpen,
  FlaskConical,
  Calendar,
  Newspaper,
  Sparkles,
  Brain,
  Calculator,
  Pill,
  Users,
  ChevronLeft,
  EyeOff,
  Sparkle,
} from "lucide-react";
import { useLocale } from "@/context/LocaleProvider.client";

const STORAGE_KEY = "auramed_aurabot_hidden";

interface SectionItem {
  id: string;
  labelKey: string;
  descKey: string;
  icon: React.ElementType;
  href: string;
  gradient: string;
}

const sectionDefs: SectionItem[] = [
  { id: "courses", labelKey: "aurabot_courses_label", descKey: "aurabot_courses_desc", icon: BookOpen, href: "/courses", gradient: "from-sky-400 to-blue-500" },
  { id: "subjects", labelKey: "aurabot_subjects_label", descKey: "aurabot_subjects_desc", icon: FlaskConical, href: "/subjects", gradient: "from-emerald-400 to-green-500" },
  { id: "qcms", labelKey: "aurabot_qcms_label", descKey: "aurabot_qcms_desc", icon: Sparkles, href: "/qcms", gradient: "from-violet-400 to-purple-500" },
  { id: "quiz", labelKey: "aurabot_quiz_label", descKey: "aurabot_quiz_desc", icon: Brain, href: "/quiz", gradient: "from-rose-400 to-pink-500" },
  { id: "timetable", labelKey: "aurabot_timetable_label", descKey: "aurabot_timetable_desc", icon: Calendar, href: "/timetable", gradient: "from-amber-400 to-orange-500" },
  { id: "gpa", labelKey: "aurabot_gpa_label", descKey: "aurabot_gpa_desc", icon: Calculator, href: "/gpa-calculator", gradient: "from-orange-400 to-red-400" },
  { id: "pharmacy", labelKey: "aurabot_pharmacy_label", descKey: "aurabot_pharmacy_desc", icon: Pill, href: "/pharmacy", gradient: "from-teal-400 to-cyan-500" },
  { id: "news", labelKey: "aurabot_news_label", descKey: "aurabot_news_desc", icon: Newspaper, href: "/news", gradient: "from-pink-400 to-fuchsia-500" },
  { id: "friends", labelKey: "aurabot_friends_label", descKey: "aurabot_friends_desc", icon: Users, href: "/friends", gradient: "from-cyan-400 to-sky-500" },
];

type SectionWithTranslations = SectionItem & { label: string; description: string };

export default function AuraBot() {
  const { t, lang } = useLocale();
  const isRtl = lang === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const [isPermaHidden, setIsPermaHidden] = useState(false);
  const [selected, setSelected] = useState<SectionWithTranslations | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(
    () =>
      sectionDefs.map((s) => ({
        ...s,
        label: t(s.labelKey),
        description: t(s.descKey),
      })),
    [t]
  );

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") {
        setIsPermaHidden(true);
        return;
      }
    } catch {}
    const timer = setTimeout(() => setIsOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, selected]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSelected(null);
  }, []);

  const handlePermaHide = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const confirmPermaHide = useCallback(() => {
    setShowConfirm(false);
    setIsOpen(false);
    setSelected(null);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setTimeout(() => setIsPermaHidden(true), 350);
  }, []);

  if (isPermaHidden) return null;

  return (
    <>
      {/* ═══════ Backdrop ═══════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="aura-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 z-[39] bg-black/20 dark:bg-black/40 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      {/* ═══════ Chat Window ═══════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.88, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
              className="fixed z-[41] flex flex-col overflow-hidden border border-white/30 dark:border-white/10 backdrop-blur-[28px] bg-white/60 dark:bg-slate-950/60 shadow-[0_24px_80px_-12px_rgba(56,189,248,0.2),0_24px_60px_-12px_rgba(0,0,0,0.35)]
              bottom-[88px] left-3 right-3 max-h-[60vh] rounded-[22px]
              md:bottom-6 md:left-6 md:right-auto md:w-[400px] md:max-h-[75vh] md:rounded-[28px]"
          >
            {/* ─── Header ─── */}
            <div className="relative px-4 pt-4 pb-3 border-b border-white/30 dark:border-white/10 shrink-0">
              <div className="absolute inset-0 bg-gradient-to-b from-sky-400/10 via-violet-400/5 to-transparent pointer-events-none" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
                    className="relative shrink-0"
                  >
                    <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-sky-400 via-sky-500 to-violet-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
                      <Sparkle className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950 shadow-sm" />
                  </motion.div>
                  <div className="min-w-0">
                    <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-tight">
                      {t("aurabot_greeting")} 👋
                    </h3>
                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate">
                      {t("aurabot_subtitle")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={handlePermaHide}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-400/20 transition-all text-[11px] font-bold text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 group"
                  >
                    <EyeOff className="w-3.5 h-3.5 group-hover:rotate-[-8deg] transition-transform" />
                    <span>{t("aurabot_dismiss")}</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* ─── Body ─── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: isRtl ? 24 : -24, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: isRtl ? -24 : 24, scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="space-y-3"
                  >
                    <button
                      onClick={() => setSelected(null)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                    >
                      <ChevronLeft className={`w-4 h-4 ${isRtl ? "" : "rotate-180"}`} />
                      {t("aurabot_back")}
                    </button>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 }}
                      className="p-4 rounded-[20px] bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-[12px] bg-gradient-to-br ${selected.gradient} flex items-center justify-center shadow-lg`}>
                          <selected.icon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white">
                          {selected.label}
                        </h4>
                      </div>
                      <p className="text-[13px] leading-[1.8] text-slate-600 dark:text-slate-300 mb-4">
                        {selected.description}
                      </p>
                      <Link
                        href={selected.href}
                        onClick={handleClose}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-violet-500 text-white text-xs font-black shadow-lg shadow-sky-500/25 hover:shadow-sky-500/50 transition-all active:scale-95"
                      >
                        {t("aurabot_go_to")} {selected.label}
                        <ChevronLeft className={`w-4 h-4 ${isRtl ? "" : "rotate-180"}`} />
                      </Link>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, x: isRtl ? -24 : 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRtl ? 24 : -24 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="space-y-2"
                  >
                    {/* Welcome bubble */}
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="relative p-4 rounded-[20px] bg-gradient-to-br from-sky-400/15 via-violet-400/10 to-pink-400/5 border border-sky-200/30 dark:border-sky-400/10 backdrop-blur-sm"
                    >
                      <div className={`absolute -top-2 w-4 h-4 rotate-45 bg-sky-50 dark:bg-slate-950/60 border-l border-t border-sky-200/30 dark:border-sky-400/10 ${isRtl ? "right-4" : "right-4"}`} />
                      <p className="text-[13px] leading-[1.8] text-slate-700 dark:text-slate-200 relative">
                        {t("aurabot_welcome_msg")}
                      </p>
                    </motion.div>

                    {/* Section buttons */}
                    {sections.map((s, i) => (
                      <motion.button
                        key={s.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.12 + i * 0.045 }}
                        whileHover={{ scale: 1.015, x: isRtl ? 2 : -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelected(s)}
                        className="w-full flex items-center gap-3 p-3 rounded-[18px] border border-white/40 dark:border-white/8 bg-white/30 dark:bg-white/[0.03] hover:bg-white/60 dark:hover:bg-white/[0.07] transition-colors group text-right"
                      >
                        <div className={`w-9 h-9 rounded-[10px] bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all shrink-0`}>
                          <s.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-[13px] font-bold text-slate-800 dark:text-white">
                            {s.label}
                          </span>
                          <span className="block text-[11px] text-slate-400 dark:text-slate-500 truncate leading-relaxed">
                            {s.description.slice(0, 50)}…
                          </span>
                        </div>
                        <ChevronLeft className={`w-4 h-4 text-slate-200 dark:text-white/10 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors shrink-0 ${isRtl ? "" : "rotate-180"}`} />
                      </motion.button>
                    ))}

                    <div ref={chatEndRef} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ─── Footer ─── */}
            <div className="px-5 py-3 border-t border-white/20 dark:border-white/5 shrink-0">
              <p className="text-center text-[10px] font-bold text-slate-300 dark:text-slate-600 tracking-wide">
                {t("aurabot_footer")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ Confirm Dialog ═══════ */}
      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="fixed z-[61] bottom-24 left-3 right-3 p-5 rounded-[22px] border border-white/30 dark:border-white/10 backdrop-blur-[28px] bg-white/80 dark:bg-slate-900/80 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.3)] text-center md:left-1/2 md:right-auto md:-translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-full md:max-w-sm md:p-6"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-[14px] bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                <EyeOff className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-black text-sm md:text-base text-slate-900 dark:text-white mb-2">
                {t("aurabot_confirm_title")}
              </h3>
              <p className="text-[12px] md:text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 mb-5">
                {t("aurabot_confirm_desc")}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95"
                >
                  {t("aurabot_confirm_cancel")}
                </button>
                <button
                  onClick={confirmPermaHide}
                  className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-red-400 to-rose-500 text-white text-xs font-black shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all active:scale-95"
                >
                  {t("aurabot_confirm_yes")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════ FAB — Glassmorphism Message Icon ═══════ */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 45 }}
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 350, damping: 18 }}
            onClick={() => { setIsOpen(true); setSelected(null); }}
            className={`fixed z-40 group bottom-[88px] left-4 md:bottom-6 md:left-6`}
          >
            <span className="absolute -inset-2 rounded-[26px] bg-gradient-to-br from-sky-400 via-violet-400 to-pink-400 opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500" />
            <span className="absolute inset-0 rounded-[18px] border-2 border-sky-400/40 dark:border-sky-400/20 animate-ping" />
            <span className="relative flex items-center justify-center w-[48px] h-[48px] rounded-[16px] border border-white/40 dark:border-white/15 backdrop-blur-xl bg-white/30 dark:bg-white/[0.08] shadow-[0_8px_32px_-4px_rgba(56,189,248,0.35),0_4px_16px_-4px_rgba(0,0,0,0.2)] group-hover:shadow-[0_8px_40px_-4px_rgba(56,189,248,0.5),0_4px_20px_-4px_rgba(0,0,0,0.25)] transition-all duration-300 md:w-[56px] md:h-[56px] md:rounded-[20px]">
              <MessageCircle className="w-5 h-5 text-sky-500 dark:text-sky-400 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors drop-shadow-sm md:w-6 md:h-6" />
            </span>
            <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-gradient-to-br from-violet-400 to-pink-500 border-2 border-white dark:border-slate-950 shadow-md">
              <span className="absolute inset-0.5 rounded-full bg-white/40 animate-pulse" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
