"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowLeft, BookOpen, Check, CheckCircle2, Clock3, FileText, FlaskConical, Play, ShieldCheck, Sparkles, Star, TimerReset, Trophy, Zap } from "lucide-react";
import {
  getAvailableQuizSubjects,
  getAvailableQuizStudyYears,
  getPublishedQuizQuestionsForStudent,
  getStudentQuizSummary,
  saveQuizAttemptProgress,
  submitQuizAttempt,
  getQuizAttemptById,
} from "@/app/actions/quiz";
import { getPharmacyAccess } from "@/app/actions/pharmacy";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HINT_CHIP_STYLES: Record<string, string> = {
  Anatomie:
    "border-rose-300/80 bg-rose-50 text-rose-700 shadow-[0_4px_14px_rgba(244,63,94,0.18)] dark:border-rose-400/30 dark:bg-rose-950/40 dark:text-rose-300",
  Histologie:
    "border-violet-300/80 bg-violet-50 text-violet-700 shadow-[0_4px_14px_rgba(139,92,246,0.18)] dark:border-violet-400/30 dark:bg-violet-950/40 dark:text-violet-300",
  Physiologie:
    "border-emerald-300/80 bg-emerald-50 text-emerald-700 shadow-[0_4px_14px_rgba(16,185,129,0.18)] dark:border-emerald-400/30 dark:bg-emerald-950/40 dark:text-emerald-300",
  Biophysique:
    "border-amber-300/80 bg-amber-50 text-amber-700 shadow-[0_4px_14px_rgba(245,158,11,0.18)] dark:border-amber-400/30 dark:bg-amber-950/40 dark:text-amber-300",
};

const HINT_ICONS: Record<string, string> = {
  Anatomie: "🦴",
  Histologie: "🔬",
  Physiologie: "❤️",
  Biophysique: "🧪",
};

export default function QuizPage() {
  const [studyYears, setStudyYears] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedStudyYear, setSelectedStudyYear] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState({ attemptsCount: 0, averageScore: 0, bestScore: 0, totalCorrect: 0, totalWrong: 0, totalUnanswered: 0 });
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [resultSummary, setResultSummary] = useState<{ correct: number; total: number; percentage: number } | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedQuestionDetail, setSelectedQuestionDetail] = useState<any>(null);
  const [questionsDetails, setQuestionsDetails] = useState<any[]>([]);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [attemptLocked, setAttemptLocked] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [canViewPharmacy, setCanViewPharmacy] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [studentSummary, years, hasPharmacyAccess] = await Promise.all([
        getStudentQuizSummary(),
        getAvailableQuizStudyYears(),
        getPharmacyAccess(),
      ]);
      setCanViewPharmacy(hasPharmacyAccess);
      setStudyYears(years);
      setSummary(studentSummary || { attemptsCount: 0, averageScore: 0, bestScore: 0, totalCorrect: 0, totalWrong: 0, totalUnanswered: 0 });

      const saved = localStorage.getItem("auraQuizAttemptId");
      if (saved) {
        try {
          const data = await getQuizAttemptById(saved);
          if (data && data.status === "IN_PROGRESS") {
            setAttempt(data);
            setSelectedExamId(data.examId);
            setCurrentQuestionIndex(0);
            setTimeLeft(Math.max(0, (data.exam.durationMinutes * 60) - Math.floor((Date.now() - new Date(data.startedAt).getTime()) / 1000)));
          } else {
            localStorage.removeItem("auraQuizAttemptId");
          }
        } catch {
          localStorage.removeItem("auraQuizAttemptId");
        }
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadSubjects = async () => {
      if (!selectedStudyYear) {
        setSubjects([]);
        setSelectedSubjectId("");
        return;
      }
      const data = await getAvailableQuizSubjects(selectedStudyYear);
      setSubjects(data || []);
      setSelectedSubjectId("");
    };

    loadSubjects();
  }, [selectedStudyYear]);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!selectedStudyYear || !selectedSubjectId) {
        setQuestions([]);
        setAnswerState({});
        return;
      }
      const data = await getPublishedQuizQuestionsForStudent({ studyYear: selectedStudyYear, subjectId: selectedSubjectId });
      setQuestions(shuffleQuestions(data || []));
      setAnswerState({});
      setResultSummary(null);
      setQuestionsDetails([]);
      setAttemptLocked(false);
      setCurrentQuizIndex(0);
    };

    loadQuestions();
  }, [selectedStudyYear, selectedSubjectId]);

  useEffect(() => {
    if (!attempt) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [attempt?.id]);

  useEffect(() => {
    if (timeLeft === 0 && attempt && !isSubmitting && !reviewMode) {
      handleAutoSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  useEffect(() => {
    const open = Boolean((showResultsModal && resultSummary) || (showDetailModal && selectedQuestionDetail));
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [showResultsModal, resultSummary, showDetailModal, selectedQuestionDetail]);

  const statusMap = useMemo(() => {
    const map: Record<string, string | null> = {};
    (attempt?.answers || []).forEach((answer: any) => {
      map[answer.questionId] = answer.selectedOptionId;
    });
    Object.entries(answers).forEach(([questionId, optionId]) => {
      map[questionId] = optionId;
    });
    return map;
  }, [attempt, answers]);

  const currentQuestion = questions[currentQuestionIndex] || null;

  const arenaParticles = useMemo(() => {
    const rand = mulberry32(20260822);
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 2 + rand() * 3.5,
      duration: 3.5 + rand() * 4.5,
      delay: rand() * 4,
    }));
  }, []);

  const setAnswerState = (value: Record<string, string>) => setAnswers(value);

  const saveAnswer = async (questionId: string, optionId: string | null) => {
    if (!attempt) return;
    try {
      const result = await saveQuizAttemptProgress(attempt.id, [{ questionId, optionId }]);
      if (!result?.success) {
        console.warn("saveQuizAttemptProgress failed:", result?.error);
        return;
      }
      setAttempt((prev: any) => ({
        ...prev,
        answers: prev.answers.map((answer: any) => answer.questionId === questionId ? { ...answer, selectedOptionId: optionId } : answer),
      }));
    } catch (error: any) {
      console.error("saveAnswer failed:", error);
    }
  };

  const handleAutoSubmit = async () => {
    if (!attempt || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await submitQuizAttempt(attempt.id);
      if (result?.success) {
        localStorage.removeItem("auraQuizAttemptId");
        const fullAttempt = await getQuizAttemptById(attempt.id);
        if (fullAttempt) {
          setAttempt(fullAttempt);
        } else {
          setAttempt((prev: any) => ({ ...prev, ...result.result, status: "COMPLETED" }));
        }
        setReviewMode(true);
        setSummary(await getStudentQuizSummary());
      } else {
        alert(result?.error || "تعذر إنهاء الاختبار حالياً");
      }
    } catch (error: any) {
      console.error("handleAutoSubmit failed:", error);
      alert(error?.message || "حدث خطأ أثناء إنهاء الاختبار");
    }
    setIsSubmitting(false);
  };

  const handleFinishAttempt = async () => {
    if (!attempt) return;
    const unanswered = questions.filter((q: any) => !statusMap[q.questionId]).length;
    const confirmed = unanswered > 0 ? window.confirm(`لديك ${unanswered} أسئلة لم تجب عنها. هل تريد إنهاء الاختبار؟`) : window.confirm("هل أنت متأكد من رغبتك في إنهاء الاختبار؟");
    if (!confirmed) return;
    setIsSubmitting(true);
    try {
      const result = await submitQuizAttempt(attempt.id);
      if (result?.success) {
        localStorage.removeItem("auraQuizAttemptId");
        const fullAttempt = await getQuizAttemptById(attempt.id);
        if (fullAttempt) {
          setAttempt(fullAttempt);
        } else {
          setAttempt((prev: any) => ({ ...prev, ...result.result, status: "COMPLETED" }));
        }
        setReviewMode(true);
        setSummary(await getStudentQuizSummary());
      } else {
        alert(result?.error || "تعذر إنهاء الاختبار حالياً");
      }
    } catch (error: any) {
      console.error("handleFinishAttempt failed:", error);
      alert(error?.message || "حدث خطأ أثناء إنهاء الاختبار");
    }
    setIsSubmitting(false);
  };

  const progress = questions.length ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = questions.filter((q: any) => statusMap[q.questionId]).length;

  const openQuestionDetail = (detail: any) => {
    setSelectedQuestionDetail(detail);
    setShowDetailModal(true);
  };

  const shuffleQuestions = (items: any[]) => {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_30%),linear-gradient(135deg,#f8fbff_0%,#eef6ff_35%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_30%),linear-gradient(135deg,#020817_0%,#0f172a_35%,#020617_100%)] py-8 px-4 md:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-10 h-72 w-72 rounded-full bg-medical-500/20 blur-[120px]" />
        <div className="absolute right-[-5%] top-1/3 h-80 w-80 rounded-full bg-sky-400/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-indigo-500/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/70"
        >
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-medical-500 via-cyan-500 to-indigo-500 text-white shadow-[0_18px_45px_rgba(14,165,233,0.4)]">
                <Trophy className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-medical-600">AuraMed</p>
                <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white md:text-4xl">لوحة Quiz الطبية</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">اختبارات دقيقة، تجربة احترافية، ومعدل أداء متقدم.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/courses?tab=qcms" className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-black text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                <Sparkles className="h-4 w-4" />
                QCMs
              </Link>
              <Link href="/courses" className="inline-flex items-center gap-2 rounded-2xl border border-medical-200 bg-medical-50 px-4 py-2.5 text-sm font-black text-medical-700 shadow-sm transition hover:-translate-y-0.5 hover:border-medical-400 hover:shadow-md dark:border-medical-800 dark:bg-medical-900/30 dark:text-medical-300">
                <BookOpen className="h-4 w-4" />
                الدروس
              </Link>
              {canViewPharmacy && (
                <Link href="/courses?tab=pharmacy" className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-black text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <FlaskConical className="h-4 w-4" />
                  الصيدلة
                </Link>
              )}
              {attempt && (
                <button
                  type="button"
                  onClick={() => setAttempt(null)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white shadow-[0_16px_32px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  رجوع
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {!attempt && (
          <div className="space-y-8">
            {/* ساحة التحدي - اختيار السنة والمادة */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-[36px]"
            >
              {/* الإطار الضوئي الدوّار (مقصوص لمنع فراغ أسفل الصفحة) */}
              <div aria-hidden className="pointer-events-none absolute -inset-2.5 z-0 overflow-hidden rounded-[40px]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
                  className="absolute left-1/2 top-1/2 h-[400%] w-[400%] bg-[conic-gradient(from_0deg,transparent_0deg,#d946ef_70deg,#22d3ee_140deg,#818cf8_210deg,transparent_280deg)] opacity-40 blur-[22px] dark:opacity-75"
                  style={{ x: "-50%", y: "-50%" }}
                />
              </div>

              <div className="relative z-10 overflow-hidden rounded-[34px] border border-slate-200/80 bg-white/90 shadow-[0_36px_90px_-28px_rgba(99,102,241,0.4)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/85 dark:shadow-[0_40px_120px_-20px_rgba(99,102,241,0.5)]">
                {/* الشفق المتحرك */}
                <motion.div aria-hidden className="pointer-events-none absolute -top-32 right-[8%] h-72 w-72 rounded-full bg-fuchsia-300/40 blur-[110px] dark:bg-fuchsia-600/30" animate={{ x: [0, 50, -30, 0], y: [0, 35, 60, 0] }} transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }} />
                <motion.div aria-hidden className="pointer-events-none absolute -bottom-40 left-[4%] h-80 w-80 rounded-full bg-cyan-300/35 blur-[120px] dark:bg-cyan-500/25" animate={{ x: [0, -60, 40, 0], y: [0, -40, 20, 0] }} transition={{ repeat: Infinity, duration: 19, ease: "easeInOut" }} />
                <motion.div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 rounded-full bg-indigo-300/35 blur-[100px] dark:bg-indigo-600/25" animate={{ x: [0, 45, -50, 0], y: [0, 40, -20, 0] }} transition={{ repeat: Infinity, duration: 23, ease: "easeInOut" }} />

                {/* جزيئات متلألئة */}
                {arenaParticles.map((p) => (
                  <motion.span
                    key={p.id}
                    aria-hidden
                    className="pointer-events-none absolute z-10 rounded-full bg-fuchsia-500/50 dark:bg-white"
                    style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
                    animate={{ opacity: [0.05, 0.85, 0.05], scale: [0.6, 1.5, 0.6], y: [0, -16, 0] }}
                    transition={{ repeat: Infinity, duration: p.duration, delay: p.delay, ease: "easeInOut" }}
                  />
                ))}

                <div className="relative z-20 p-7 md:p-10">
                  {/* الرأس */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className="relative shrink-0">
                        <span className="absolute inset-0 animate-ping rounded-[22px] bg-gradient-to-br from-fuchsia-500 to-indigo-600 opacity-30" />
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.2 }}
                          className="relative flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 shadow-[0_18px_50px_-8px_rgba(217,70,239,0.75)] md:h-20 md:w-20"
                        >
                          <Zap className="h-8 w-8 text-white md:h-10 md:w-10" strokeWidth={2.5} fill="rgba(255,255,255,0.25)" />
                        </motion.div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-fuchsia-600 dark:text-fuchsia-400">Quiz Arena</p>
                        <h2 className="mt-1.5 text-3xl font-black text-slate-900 dark:text-white md:text-5xl">
                          ساحة <span className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent dark:from-fuchsia-400 dark:via-purple-400 dark:to-cyan-300">التحدي</span>
                        </h2>
                        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">حدّد السنة والمادة… وانطلق في مواجهة الأسئلة</p>
                      </div>
                    </div>
                    <Sparkles className="hidden h-9 w-9 shrink-0 animate-pulse text-fuchsia-400/60 dark:text-fuchsia-400/50 lg:block" />
                  </div>

                  <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr_240px]">
                    {/* الخطوة ١: السنة الدراسية */}
                    <div>
                      <label className="mb-4 flex items-center gap-3 text-sm font-black text-slate-900 dark:text-white">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-xs font-black text-white shadow-[0_8px_20px_rgba(217,70,239,0.5)]">1</div>
                        السنة الدراسية
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {(studyYears || []).map((year, i) => {
                          const isActive = selectedStudyYear === year;
                          return (
                            <motion.button
                              key={year}
                              type="button"
                              onClick={() => setSelectedStudyYear(year)}
                              initial={{ opacity: 0, y: 14 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.35 }}
                              whileHover={{ scale: 1.06, y: -2 }}
                              whileTap={{ scale: 0.94 }}
                              className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-black transition-colors ${
                                isActive
                                  ? "border-transparent bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-white shadow-[0_12px_36px_rgba(192,38,211,0.55)]"
                                  : "border-slate-200 bg-white/80 text-slate-700 hover:border-fuchsia-400 hover:bg-fuchsia-50 hover:text-fuchsia-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-fuchsia-400/50 dark:hover:bg-white/[0.09] dark:hover:text-white"
                              }`}
                            >
                              {isActive && (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                                  <Check className="h-4 w-4" strokeWidth={3} />
                                </motion.span>
                              )}
                              {year}
                            </motion.button>
                          );
                        })}
                        {!studyYears?.length && <p className="text-sm text-slate-400 dark:text-slate-500">لا توجد سنوات متاحة حالياً</p>}
                      </div>
                    </div>

                    {/* الخطوة ٢: المادة */}
                    <div>
                      <label className={`mb-4 flex items-center gap-3 text-sm font-black ${selectedStudyYear ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}>
                        <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black shadow-[0_8px_20px_rgba(14,165,233,0.5)] ${selectedStudyYear ? "bg-gradient-to-br from-cyan-400 to-sky-600 text-white" : "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"}`}>2</div>
                        المادة
                      </label>
                      {selectedStudyYear ? (
                        <div key={selectedStudyYear} className="flex flex-wrap gap-2.5">
                          {(subjects || []).map((subject: any, i) => {
                            const isActive = selectedSubjectId === subject.id;
                            return (
                              <motion.button
                                key={subject.id}
                                type="button"
                                onClick={() => setSelectedSubjectId(subject.id)}
                                initial={{ opacity: 0, scale: 0.8, y: 12 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 20 }}
                                whileHover={{ scale: 1.06, y: -2 }}
                                whileTap={{ scale: 0.94 }}
                                className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-black transition-colors ${
                                  isActive
                                    ? "border-transparent bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white shadow-[0_12px_36px_rgba(6,182,212,0.5)]"
                                    : "border-slate-200 bg-white/80 text-slate-700 hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-cyan-400/50 dark:hover:bg-white/[0.09] dark:hover:text-white"
                                }`}
                              >
                                {isActive && (
                                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                                    <Check className="h-4 w-4" strokeWidth={3} />
                                  </motion.span>
                                )}
                                {subject.name}
                              </motion.button>
                            );
                          })}
                          {!(subjects || []).length && <p className="text-sm text-slate-400 dark:text-slate-500">لا توجد مواد لهذه السنة بعد</p>}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex h-[54px] items-center gap-3 rounded-2xl border border-dashed border-fuchsia-300 bg-fuchsia-50/50 px-5 text-sm font-bold text-slate-500 dark:border-fuchsia-400/30 dark:bg-white/[0.02] dark:text-slate-400"
                        >
                          <motion.span animate={{ x: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
                            ←
                          </motion.span>
                          اختر السنة أولاً لتظهر المواد هنا
                        </motion.div>
                      )}
                    </div>

                    {/* العدّاد المتوهج */}
                    <div className="flex flex-col justify-end">
                      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-emerald-50/70 to-cyan-50/50 p-6 text-center backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
                        <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-16 mx-auto h-32 w-32 rounded-full bg-emerald-500/25 blur-2xl" animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ repeat: Infinity, duration: 3 }} />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">جاهز للتدريب</p>
                        <div className="relative mt-3 inline-flex">
                          <motion.span aria-hidden className="absolute inset-0 rounded-full bg-emerald-400/30" animate={{ scale: [1, 1.8], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }} />
                          <AnimatePresence mode="popLayout">
                            <motion.span
                              key={questions.length}
                              initial={{ scale: 0.4, opacity: 0, y: 10 }}
                              animate={{ scale: 1, opacity: 1, y: 0 }}
                              exit={{ scale: 0.4, opacity: 0, y: -10 }}
                              transition={{ type: "spring", stiffness: 300, damping: 18 }}
                              className="block bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-6xl font-black text-transparent dark:from-emerald-300 dark:via-teal-300 dark:to-cyan-300"
                            >
                              {questions.length}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                        <p className="mt-2 text-xs font-bold text-slate-500 dark:text-slate-400">{questions.length === 1 ? "سؤال بانتظارك" : "سؤالاً بانتظارك"}</p>
                      </div>
                    </div>
                  </div>

                  {/* شريط المسار الحالي */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: selectedStudyYear ? 1 : 0.45 }}
                    className="mt-8 flex flex-wrap items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-xs font-bold text-slate-600 dark:border-white/5 dark:bg-white/[0.03] dark:text-slate-300"
                  >
                    <span className="rounded-lg bg-fuchsia-100 px-3 py-1.5 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300">{selectedStudyYear || "السنة؟"}</span>
                    <ArrowLeft className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    <span className={`rounded-lg px-3 py-1.5 ${selectedSubjectId ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300" : "bg-slate-200/70 text-slate-400 dark:bg-white/5 dark:text-slate-500"}`}>
                      {subjects.find((s: any) => s.id === selectedSubjectId)?.name || "المادة؟"}
                    </span>
                    <ArrowLeft className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    <span className={`rounded-lg px-3 py-1.5 ${questions.length ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-slate-200/70 text-slate-400 dark:bg-white/5 dark:text-slate-500"}`}>
                      {questions.length ? `${questions.length} سؤال جاهز` : "في انتظار الأسئلة"}
                    </span>
                    {questions.length > 0 && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="mr-auto inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1.5 text-white shadow-[0_8px_24px_rgba(16,185,129,0.45)]">
                        <Zap className="h-3.5 w-3.5" fill="currentColor" />
                        انطلق!
                      </motion.span>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* قسم الأسئلة - الوسط */}
            {selectedStudyYear && selectedSubjectId && questions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_28px_70px_-24px_rgba(16,185,129,0.35)] backdrop-blur-xl sm:rounded-[36px] sm:p-8 dark:border-white/10 dark:bg-slate-950/85 dark:shadow-[0_32px_90px_-20px_rgba(16,185,129,0.3)]">
                  {/* توهجات خلفية هادئة */}
                  <motion.div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-emerald-300/40 blur-[90px] dark:bg-emerald-500/20" animate={{ y: [0, 24, 0] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }} />
                  <motion.div aria-hidden className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-cyan-300/40 blur-[90px] dark:bg-cyan-500/20" animate={{ y: [0, -24, 0] }} transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }} />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
                            {subjects.find((s: any) => s.id === selectedSubjectId)?.name || "المادة"}
                          </h3>
                          <span className="shrink-0 rounded-lg bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">{selectedStudyYear}</span>
                        </div>
                        <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400 sm:text-sm">
                          السؤال {Math.min(currentQuizIndex + 1, questions.length)} من {questions.length}
                        </p>
                      </div>

                      {/* حلقة التقدم الدائرية */}
                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center sm:h-[76px] sm:w-[76px]">
                        <motion.span aria-hidden className="absolute inset-0 rounded-full bg-emerald-400/30 blur-md" animate={{ opacity: [0.35, 0.75, 0.35] }} transition={{ repeat: Infinity, duration: 2.5 }} />
                        <svg viewBox="0 0 64 64" className="relative h-full w-full -rotate-90">
                          <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6" className="stroke-slate-200 dark:stroke-slate-700/70" />
                          <motion.circle
                            cx="32"
                            cy="32"
                            r="26"
                            fill="none"
                            strokeWidth="6"
                            strokeLinecap="round"
                            stroke="url(#quizRingGradient)"
                            strokeDasharray={2 * Math.PI * 26}
                            initial={false}
                            animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - Math.min(currentQuizIndex / questions.length, 1)) }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                          />
                          <defs>
                            <linearGradient id="quizRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-base font-black leading-none text-slate-900 dark:text-white sm:text-xl">{Math.min(currentQuizIndex + 1, questions.length)}</span>
                          <span className="mt-0.5 text-[9px] font-bold text-slate-400 dark:text-slate-500">من {questions.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 mb-5 sm:mt-5 sm:mb-6">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/60">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                          animate={{ width: `${(currentQuizIndex / questions.length) * 100}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Single Question Card with AnimatePresence */}
                    <div className="relative min-h-[320px] sm:min-h-[340px]">
                      <AnimatePresence mode="wait">
                        {currentQuizIndex < questions.length ? (
                          <motion.div
                            key={questions[currentQuizIndex].id}
                            initial={{ opacity: 0, x: 60, scale: 0.96 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -60, scale: 0.96 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="overflow-hidden rounded-3xl border-2 border-slate-200/80 bg-white/95 shadow-sm dark:border-white/10 dark:bg-slate-900/80"
                          >
                            <div className="bg-gradient-to-l from-emerald-50/90 via-cyan-50/60 to-transparent px-4 py-4 sm:px-6 sm:py-5 dark:from-emerald-950/25 dark:via-slate-900 dark:to-slate-900/95">
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-sm font-black text-white shadow-[0_8px_20px_rgba(16,185,129,0.4)] sm:h-10 sm:w-10">
                                  {currentQuizIndex + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                  {questions[currentQuizIndex].hint && HINT_CHIP_STYLES[questions[currentQuizIndex].hint] && (
                                    <motion.span
                                      initial={{ opacity: 0, y: -8, scale: 0.85 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 22 }}
                                      className={`mb-2 inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-[10px] font-black tracking-wide sm:text-xs ${HINT_CHIP_STYLES[questions[currentQuizIndex].hint]}`}
                                    >
                                      <span className="text-xs leading-none sm:text-sm">{HINT_ICONS[questions[currentQuizIndex].hint]}</span>
                                      سؤال خاص بـ {questions[currentQuizIndex].hint}
                                    </motion.span>
                                  )}
                                  <p className="text-[17px] font-bold leading-relaxed text-slate-900 dark:text-white sm:text-xl">
                                    {questions[currentQuizIndex].text}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2.5 px-4 py-4 sm:space-y-3 sm:px-6 sm:py-6">
                              {(questions[currentQuizIndex].options || []).map((option: any, optIndex: number) => {
                                const isSelected = answers[questions[currentQuizIndex].id] === option.id;
                                return (
                                  <motion.button
                                    key={option.id}
                                    initial={{ opacity: 0, x: 28 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.12 + optIndex * 0.07, type: "spring", stiffness: 260, damping: 22 }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="button"
                                    onClick={() => {
                                      if (attemptLocked) return;
                                      const q = questions[currentQuizIndex];
                                      const newAnswers = { ...answers, [q.id]: option.id };
                                      setAnswers(newAnswers);

                                      // If last question, compute results and show modal
                                      if (currentQuizIndex === questions.length - 1) {
                                        setAttemptLocked(true);
                                        setTimeout(() => {
                                          setCurrentQuizIndex(questions.length);
                                        }, 300);
                                        setTimeout(() => {
                                          const details: any[] = [];
                                          let correct = 0;
                                          questions.forEach((qItem) => {
                                            const sel = newAnswers[qItem.id];
                                            const correctOpt = qItem.options.find((opt: any) => opt.isCorrect);
                                            const selectedOpt = qItem.options.find((opt: any) => opt.id === sel);
                                            const isCorrect = sel === correctOpt?.id;
                                            if (isCorrect) correct++;
                                            details.push({
                                              id: qItem.id,
                                              text: qItem.text,
                                              isCorrect,
                                              selectedOption: selectedOpt,
                                              correctOption: correctOpt,
                                              explanation: qItem.explanation || "لم يتم توفير شرح لهذا السؤال",
                                              reference: qItem.reference || "لم يتم توفير مرجع",
                                            });
                                          });
                                          const percentage = Number(((correct / questions.length) * 100).toFixed(1));
                                          setQuestionsDetails(details);
                                          setResultSummary({ correct, total: questions.length, percentage });
                                          setShowResultsModal(true);
                                        }, 700);
                                      } else {
                                        // Move to next question after brief delay
                                        setTimeout(() => {
                                          setCurrentQuizIndex((prev) => prev + 1);
                                        }, 350);
                                      }
                                    }}
                                    className={`w-full rounded-2xl border-2 p-3.5 text-right font-bold transition-colors duration-300 sm:p-4 sm:text-lg ${
                                      isSelected
                                        ? "border-cyan-500 bg-gradient-to-l from-cyan-50 to-emerald-50 text-cyan-900 shadow-[0_10px_30px_rgba(6,182,212,0.28)] dark:border-cyan-400 dark:from-cyan-950/40 dark:to-emerald-950/25 dark:text-cyan-100"
                                        : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:bg-cyan-50/40 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-cyan-400/40 dark:hover:bg-white/[0.07]"
                                    }`}
                                  >
                                    <span className="flex items-center gap-3">
                                      <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-colors ${
                                        isSelected
                                          ? "bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-[0_6px_16px_rgba(6,182,212,0.45)]"
                                          : "bg-slate-100 text-slate-500 dark:bg-white/[0.07] dark:text-slate-400"
                                      }`}>
                                        {String.fromCharCode(65 + optIndex)}
                                      </span>
                                      <span className="min-w-0 flex-1 text-sm leading-relaxed sm:text-base">{option.text}</span>
                                      {isSelected && (
                                        <motion.span
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-[0_4px_12px_rgba(6,182,212,0.5)]"
                                        >
                                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                        </motion.span>
                                      )}
                                    </span>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="completed"
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative overflow-hidden rounded-3xl border-2 border-emerald-300/70 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-6 py-12 text-center dark:border-emerald-500/40 dark:from-emerald-950/40 dark:via-slate-900 dark:to-cyan-950/30"
                          >
                            <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-20 mx-auto h-40 w-40 rounded-full bg-emerald-400/30 blur-[70px]" animate={{ opacity: [0.4, 0.85, 0.4] }} transition={{ repeat: Infinity, duration: 3 }} />
                            <div className="relative mb-5 inline-flex">
                              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
                              <motion.div
                                initial={{ scale: 0, rotate: -120 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 220, damping: 14 }}
                                className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-[0_18px_50px_rgba(16,185,129,0.45)]"
                              >
                                <CheckCircle2 className="h-10 w-10" />
                              </motion.div>
                            </div>
                            <h3 className="relative mb-2 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">أنهيت هذه الجولة!</h3>
                            <p className="relative mb-6 text-slate-500 dark:text-slate-400">أجبت على جميع الأسئلة — راجع نتائجك الآن</p>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setShowResultsModal(true)}
                              className="relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3.5 text-sm font-black text-white shadow-[0_16px_40px_rgba(16,185,129,0.4)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.5)] transition-all"
                            >
                              <Trophy className="h-5 w-5" />
                              عرض النتيجة
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* قسم التقييم - الأخير */}
            {selectedStudyYear && selectedSubjectId && questions.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[40px] border-2 border-dashed border-slate-300/50 bg-white/70 p-12 text-center dark:border-slate-700/50 dark:bg-slate-900/70"
              >
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-lg font-bold text-slate-700 dark:text-slate-300">لا توجد أسئلة متاحة حاليًا</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">في هذه المادة ضمن السنة المختارة. يرجى الانتظار لإضافة المزيد من الأسئلة.</p>
              </motion.div>
            )}
          </div>
        )}

        {attempt && !reviewMode && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-[0_25px_70px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/85"
          >
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-medical-600">{attempt.exam.title}</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">السؤال {currentQuestionIndex + 1} من {questions.length}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 font-black text-amber-700 shadow-sm"><Clock3 className="h-4 w-4" /> {formatTime(timeLeft)}</div>
                <button onClick={handleFinishAttempt} className="rounded-2xl bg-slate-900 px-4 py-2.5 font-black text-white shadow-[0_16px_35px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-900">إنهاء الاختبار</button>
              </div>
            </div>

            <div className="mb-5">
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-medical-600" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
              <div className="space-y-5">
                <div className="rounded-[24px] bg-gradient-to-br from-slate-50 via-medical-50 to-sky-50 p-5 shadow-inner dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">السؤال {currentQuestionIndex + 1}</p>
                  <h3 className="mt-3 text-2xl font-black leading-relaxed text-slate-900 dark:text-white">{currentQuestion?.question?.text}</h3>
                </div>

                <div className="space-y-3">
                  {(currentQuestion?.question?.options || []).map((option: any, index: number) => {
                    const isSelected = statusMap[currentQuestion.questionId] === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => { saveAnswer(currentQuestion.questionId, option.id); setAttempt((prev: any) => ({ ...prev, answers: prev.answers.map((ans: any) => ans.questionId === currentQuestion.questionId ? { ...ans, selectedOptionId: option.id } : ans) })); }}
                        className={`w-full rounded-2xl border p-4 text-right transition-all duration-200 ${isSelected ? "border-medical-600 bg-gradient-to-r from-medical-50 to-sky-50 shadow-[0_18px_35px_rgba(14,165,233,0.15)] dark:from-medical-950/30 dark:to-sky-950/20" : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-medical-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-medical-500"}`}
                      >
                        <span className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-black text-slate-700 dark:bg-slate-700 dark:text-slate-100">{String.fromCharCode(65 + index)}</span>
                        {option.text}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))} className="rounded-2xl bg-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600">السؤال السابق</button>
                  <button onClick={() => setCurrentQuestionIndex((i) => Math.min(questions.length - 1, i + 1))} className="rounded-2xl bg-gradient-to-r from-medical-600 to-sky-500 px-4 py-2.5 text-sm font-black text-white shadow-[0_14px_30px_rgba(14,165,233,0.32)]">السؤال التالي</button>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50 p-4 shadow-inner dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
                <h4 className="mb-3 font-black text-slate-900 dark:text-white">خريطة الأسئلة</h4>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((item: any, index: number) => {
                    const isAnswered = !!statusMap[item.questionId];
                    const isCurrent = index === currentQuestionIndex;
                    return (
                      <button key={item.questionId} onClick={() => setCurrentQuestionIndex(index)} className={`h-11 w-11 rounded-xl border text-sm font-black transition ${isCurrent ? "border-medical-600 bg-gradient-to-r from-medical-600 to-sky-500 text-white shadow-[0_8px_18px_rgba(14,165,233,0.3)]" : isAnswered ? "border-emerald-500 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300" : "border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"}`}>
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                  الإجابات: {answeredCount}/{questions.length}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {attempt && reviewMode && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-[0_25px_70px_rgba(15,23,42,0.12)] dark:border-slate-700 dark:bg-slate-900/85"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-medical-600">انتهى الاختبار</p>
                <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{attempt.score || 0} / {questions.length}</h2>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-medical-600">{Number(attempt.percentage || 0).toFixed(1)}%</div>
                <div className="text-sm text-slate-500">تم بحمد الله</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricBox label="إجابات صحيحة" value={attempt.correctCount || 0} />
              <MetricBox label="إجابات خاطئة" value={attempt.incorrectCount || 0} />
              <MetricBox label="غير مجاب" value={attempt.unansweredCount || 0} />
              <MetricBox label="الوقت المستغرق" value={formatDuration(attempt.timeSpentSeconds || 0)} />
            </div>

            <div className="space-y-4">
              {((attempt as any)?.exam?.questions || []).map((item: any, index: number) => {
                const answer = attempt.answers.find((ans: any) => ans.questionId === item.questionId);
                const selectedOption = item.question.options.find((option: any) => option.id === answer?.selectedOptionId);
                const correctOption = item.question.options.find((option: any) => option.isCorrect);
                return (
                  <motion.div key={item.questionId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-sky-50 p-4 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
                    <h4 className="text-lg font-black">السؤال {index + 1}</h4>
                    <p className="my-3 text-base font-bold text-slate-800 dark:text-slate-100">{item.question.text}</p>
                    <p className="text-sm">إجابتك: <span className="font-black">{selectedOption?.text || "غير مجاب"}</span> {answer?.isCorrect ? "✅" : "❌"}</p>
                    <p className="text-sm">الإجابة الصحيحة: <span className="font-black">{correctOption?.text}</span> ✅</p>
                    {item.question.explanation && <p className="mt-2 text-sm"><strong>الشرح:</strong> {item.question.explanation}</p>}
                    {item.question.reference && <p className="mt-2 text-sm"><strong>المرجع العلمي:</strong> {item.question.reference}</p>}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* نافذة النتائج الإجمالية المنبثقة */}
        {showResultsModal && resultSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResultsModal(false)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0.7 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.7 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className={`flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[26px] border-2 shadow-2xl [@supports(height:100dvh)]:max-h-[90dvh] sm:max-h-[86vh] sm:rounded-[28px] ${
                resultSummary.percentage >= 50
                  ? "border-emerald-200/50 bg-gradient-to-br from-emerald-50/95 via-green-50/80 to-teal-50/60 dark:border-emerald-800/50 dark:from-emerald-950/80 dark:via-slate-900/80 dark:to-teal-950/60"
                  : "border-red-200/50 bg-gradient-to-br from-red-50/95 via-orange-50/80 to-rose-50/60 dark:border-red-800/50 dark:from-red-950/80 dark:via-slate-900/80 dark:to-rose-950/60"
              }`}
            >
              {/* الرأس */}
              <div className={`shrink-0 px-4 py-3.5 sm:px-8 sm:py-6 ${
                resultSummary.percentage >= 50
                  ? "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"
                  : "bg-gradient-to-r from-red-500 via-orange-500 to-rose-500"
              }`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, type: "spring" }}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 sm:h-16 sm:w-16"
                    >
                      {resultSummary.percentage >= 50 ? (
                        <Trophy className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                      )}
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-black text-white sm:text-2xl">
                        {resultSummary.percentage >= 50 ? "ممتاز!" : "حاول مرة أخرى"}
                      </h3>
                      <p className="text-[10px] text-white/80 mt-0.5 sm:text-xs">
                        {resultSummary.percentage >= 50
                          ? "لقد حققت درجة عالية!"
                          : "لديك المزيد من المحاولات"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowResultsModal(false)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-base text-white transition hover:bg-white/30 active:scale-90 sm:h-10 sm:w-10"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* محتوى النتائج */}
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 scrollbar-thin sm:space-y-6 sm:px-8 sm:py-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
                {/* الإحصائيات الرئيسية */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl bg-white/70 p-3 shadow-lg dark:bg-slate-800/70 border-2 border-emerald-200 dark:border-emerald-700 sm:p-6"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400 sm:text-xs">الصحيحة</p>
                    <p className="mt-1.5 text-xl font-black text-emerald-600 dark:text-emerald-400 sm:mt-4 sm:text-5xl">
                      {resultSummary.correct}
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 sm:text-sm sm:mt-2">من {resultSummary.total}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl bg-white/70 p-3 shadow-lg dark:bg-slate-800/70 border-2 border-sky-200 dark:border-sky-700 sm:p-6"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-sky-700 dark:text-sky-400 sm:text-xs">النسبة</p>
                    <p className="mt-1.5 whitespace-nowrap text-xl font-black bg-gradient-to-r from-medical-600 to-sky-500 bg-clip-text text-transparent sm:mt-4 sm:text-5xl">
                      {resultSummary.percentage}%
                    </p>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${resultSummary.percentage}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="mt-2 h-1.5 rounded-full bg-gradient-to-r from-medical-600 to-sky-500 sm:mt-3 sm:h-2"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl bg-white/70 p-3 shadow-lg dark:bg-slate-800/70 border-2 border-red-200 dark:border-red-700 sm:p-6"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-red-700 dark:text-red-400 sm:text-xs">الخاطئة</p>
                    <p className="mt-1.5 text-xl font-black text-red-600 dark:text-red-400 sm:mt-4 sm:text-5xl">
                      {resultSummary.total - resultSummary.correct}
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 sm:text-sm sm:mt-2">حاول مجددًا</p>
                  </motion.div>
                </div>

                {/* تفاصيل الأسئلة المختصرة */}
                {questionsDetails.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white sm:text-lg">تفاصيل الإجابات</h4>
                    <div className="max-h-44 space-y-2 overflow-y-auto overscroll-contain pr-1 sm:max-h-64 sm:pr-2">
                      {questionsDetails.map((detail, index) => (
                        <motion.button
                          key={detail.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => openQuestionDetail(detail)}
                          className={`w-full rounded-xl border-2 p-3 text-right transition-all duration-300 active:scale-[0.98] sm:rounded-2xl sm:p-3.5 ${
                            detail.isCorrect
                              ? "bg-emerald-100/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-600 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]"
                              : "bg-red-100/70 dark:bg-red-950/30 border-red-300 dark:border-red-600 hover:shadow-[0_8px_20px_rgba(239,68,68,0.2)]"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span className={`shrink-0 text-xs font-black sm:text-sm ${detail.isCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
                              {detail.isCorrect ? "✅" : "❌"}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-[11px] font-bold text-slate-700 dark:text-slate-300 sm:text-xs">
                              السؤال {index + 1}: {detail.text}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* الأزرار */}
              <div
                className="flex shrink-0 gap-2 border-t border-emerald-200 px-3 pt-3 pb-[max(5.25rem,env(safe-area-inset-bottom))] dark:border-emerald-700 sm:gap-3 sm:px-8 sm:pt-4 sm:pb-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowResultsModal(false);
                    setAnswers({});
                    setResultSummary(null);
                    setQuestionsDetails([]);
                    setAttemptLocked(false);
                    setCurrentQuizIndex(0);
                    setQuestions((prev) => shuffleQuestions(prev));
                  }}
                  className="min-w-0 flex-1 rounded-xl bg-gradient-to-r from-medical-600 via-sky-500 to-indigo-600 px-3 py-3 text-xs font-black text-white shadow-[0_12px_30px_rgba(14,165,233,0.3)] transition-all hover:shadow-[0_16px_40px_rgba(14,165,233,0.4)] active:scale-[0.98] sm:rounded-2xl sm:px-4 sm:text-sm"
                >
                  حاول مرة أخرى
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowResultsModal(false)}
                  className="min-w-0 flex-1 rounded-xl border-2 border-slate-300 bg-white px-3 py-3 text-xs font-black text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 sm:rounded-2xl sm:px-4 sm:text-sm"
                >
                  ✓ حسناً
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* نافذة تفاصيل الإجابة المنبثقة */}
        {showDetailModal && selectedQuestionDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailModal(false)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className={`flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[26px] border-2 shadow-[0_25px_60px_rgba(15,23,42,0.14)] [@supports(height:100dvh)]:max-h-[90dvh] sm:max-h-[84vh] sm:max-w-2xl sm:rounded-[30px] ${
                selectedQuestionDetail.isCorrect
                  ? "border-emerald-300/60 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:border-emerald-700/50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/40"
                  : "border-red-300/60 bg-gradient-to-br from-red-50 via-orange-50 to-rose-50 dark:border-red-700/50 dark:from-red-950/40 dark:via-slate-900 dark:to-rose-950/40"
              }`}
            >
              {/* الرأس */}
              <div
                className={`shrink-0 px-4 py-3.5 sm:px-6 sm:py-5 ${
                  selectedQuestionDetail.isCorrect
                    ? "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"
                    : "bg-gradient-to-r from-red-500 via-orange-500 to-red-500"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 sm:h-12 sm:w-12">
                      {selectedQuestionDetail.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-white sm:h-7 sm:w-7" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-white sm:h-7 sm:w-7" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white sm:text-lg">
                        {selectedQuestionDetail.isCorrect ? "إجابة صحيحة!" : "إجابة خاطئة"}
                      </h3>
                      <p className="text-[10px] text-white/80 mt-0.5 sm:text-xs">
                        {selectedQuestionDetail.isCorrect ? "ممتاز! إجابتك صحيحة" : "يرجى مراجعة الإجابة الصحيحة"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-base text-white transition hover:bg-white/30 active:scale-90 sm:h-10 sm:w-10"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* المحتوى */}
              <div
                style={{ WebkitOverflowScrolling: "touch" }}
                className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 scrollbar-thin [overflow-wrap:anywhere] sm:space-y-4 sm:px-6 sm:py-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600"
              >
                {/* السؤال */}
                <div className="rounded-xl border border-slate-200/80 bg-white/60 p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 sm:rounded-2xl sm:p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-600 dark:text-slate-400 mb-1.5 sm:text-xs sm:mb-2">السؤال</p>
                  <p className="text-[15px] font-bold text-slate-900 leading-relaxed dark:text-white sm:text-base">
                    {selectedQuestionDetail.text}
                  </p>
                </div>

                {/* إجابتك */}
                <div className="rounded-xl bg-white/70 p-3.5 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 shadow-sm sm:rounded-2xl sm:p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-600 dark:text-slate-400 mb-1.5 sm:text-xs sm:mb-2">
                    إجابتك
                  </p>
                  <p className={`text-[13px] font-bold leading-relaxed sm:text-sm ${selectedQuestionDetail.selectedOption ? "text-slate-900 dark:text-white" : "text-red-600 dark:text-red-400"}`}>
                    {selectedQuestionDetail.selectedOption?.text || "لم تجب على هذا السؤال"}
                  </p>
                </div>

                {/* الإجابة الصحيحة */}
                <div
                  className={`rounded-xl p-3.5 border-2 shadow-sm sm:rounded-2xl sm:p-4 ${
                    selectedQuestionDetail.isCorrect
                      ? "bg-emerald-100/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-600"
                      : "bg-emerald-100/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-600"
                  }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400 mb-1.5 sm:text-xs sm:mb-2">
                    الإجابة الصحيحة
                  </p>
                  <p className="text-[13px] font-bold leading-relaxed text-emerald-900 dark:text-emerald-200 sm:text-sm">
                    {selectedQuestionDetail.correctOption?.text}
                  </p>
                </div>

                {/* الشرح */}
                <div className="rounded-xl bg-blue-100/60 dark:bg-blue-950/30 p-3.5 border-2 border-blue-300 dark:border-blue-600 shadow-sm sm:rounded-2xl sm:p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-blue-700 dark:text-blue-400 mb-1.5 sm:text-xs sm:mb-2">
                    الشرح التفصيلي
                  </p>
                  <p className="text-[13px] leading-relaxed text-blue-900 dark:text-blue-200 sm:text-sm">
                    {selectedQuestionDetail.explanation}
                  </p>
                </div>

                {/* المرجع العلمي */}
                <div className="rounded-xl bg-indigo-100/60 dark:bg-indigo-950/30 p-3.5 border-2 border-indigo-300 dark:border-indigo-600 shadow-sm sm:rounded-2xl sm:p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-indigo-700 dark:text-indigo-400 mb-1.5 sm:text-xs sm:mb-2">
                    المرجع العلمي
                  </p>
                  <p className="text-[13px] leading-relaxed text-indigo-900 dark:text-indigo-200 sm:text-sm">
                    {selectedQuestionDetail.reference}
                  </p>
                </div>
              </div>

              {/* الزر */}
              <div
                className="shrink-0 border-t border-slate-200 px-4 pt-3 pb-[max(5.25rem,env(safe-area-inset-bottom))] dark:border-slate-700 sm:px-6 sm:pt-4 sm:pb-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDetailModal(false)}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-black text-white transition-all active:scale-[0.98] sm:rounded-2xl ${
                    selectedQuestionDetail.isCorrect
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-[0_12px_30px_rgba(16,185,129,0.3)]"
                      : "bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-[0_12px_30px_rgba(239,68,68,0.3)]"
                  }`}
                >
                  حسناً، فهمت ✓
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-white via-medical-50 to-sky-50 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
    >
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-medical-500/10 blur-2xl" />
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-medical-500 to-sky-500 text-white shadow-[0_14px_30px_rgba(14,165,233,0.28)]"><Icon className="h-6 w-6" /></div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{value}</p>
    </motion.div>
  );
}

function MetricBox({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-black mt-2 text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} دقيقة و ${seconds} ثانية`;
}

function TargetPill() {
  return <Target className="w-6 h-6" />;
}

function Target() {
  return <AlertCircle className="w-4 h-4" />;
}

