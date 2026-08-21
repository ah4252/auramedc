"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowLeft, BookOpen, CheckCircle2, Clock3, Compass, FileText, FlaskConical, Play, ShieldCheck, Sparkles, Star, TimerReset, Trophy } from "lucide-react";
import {
  getAvailableQuizSubjects,
  getAvailableQuizStudyYears,
  getPublishedQuizExamsForStudent,
  getPublishedQuizQuestionsForStudent,
  getStudentQuizSummary,
  saveQuizAttemptProgress,
  startQuizAttempt,
  submitQuizAttempt,
  getQuizAttemptById,
} from "@/app/actions/quiz";
import { getPharmacyAccess } from "@/app/actions/pharmacy";

export default function QuizPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [studyYears, setStudyYears] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedStudyYear, setSelectedStudyYear] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState({ attemptsCount: 0, averageScore: 0, bestScore: 0, totalCorrect: 0, totalWrong: 0, totalUnanswered: 0 });
  const [activeTab, setActiveTab] = useState("all");
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
  const [selectedCompletedAttempt, setSelectedCompletedAttempt] = useState<any>(null);
  const [showCompletedAttemptModal, setShowCompletedAttemptModal] = useState(false);
  const [attemptLocked, setAttemptLocked] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [canViewPharmacy, setCanViewPharmacy] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [examData, studentSummary, years, hasPharmacyAccess] = await Promise.all([
        getPublishedQuizExamsForStudent(),
        getStudentQuizSummary(),
        getAvailableQuizStudyYears(),
        getPharmacyAccess(),
      ]);
      setExams(examData);
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
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt?.id]);

  const activeExam = useMemo(() => exams.find((exam: any) => exam.id === selectedExamId) || null, [exams, selectedExamId]);
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

  const setAnswerState = (value: Record<string, string>) => setAnswers(value);

  const handleStartAttempt = async (examId: string) => {
    try {
      const result = await startQuizAttempt(examId);
      if (result?.success) {
        const loaded = await getQuizAttemptById(result.attemptId);
        if (!loaded) {
          alert("خدمة الاختبارات غير متاحة حالياً، حاول لاحقاً.");
          return;
        }
        setAttempt(loaded);
        setSelectedExamId(loaded.examId);
        setCurrentQuestionIndex(0);
        setReviewMode(false);
        localStorage.setItem("auraQuizAttemptId", result.attemptId);
        const duration = Number(loaded.exam.durationMinutes || 20) * 60;
        setTimeLeft(duration);
        return;
      }
      alert(result?.error || "تعذر بدء الاختبار حالياً");
    } catch (error: any) {
      console.error("handleStartAttempt failed:", error);
      alert(error?.message || "حدث خطأ أثناء بدء الاختبار");
    }
  };

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
        setAttempt((prev: any) => ({ ...prev, ...result.result, status: "COMPLETED" }));
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
        setAttempt((prev: any) => ({ ...prev, ...result.result, status: "COMPLETED" }));
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

  const filteredExams = useMemo(() => {
    if (activeTab === "new") {
      return exams.filter((exam: any) => !exam.attempts?.length);
    }

    if (activeTab === "done") {
      return exams.filter((exam: any) => (exam.attempts?.length ?? 0) > 0);
    }

    return exams;
  }, [exams, activeTab]);

  const openCompletedAttempt = async (exam: any) => {
    const latestAttempt = exam.attempts?.[0];
    if (!latestAttempt) return;

    const fullAttempt = await getQuizAttemptById(latestAttempt.id);
    setSelectedCompletedAttempt(fullAttempt);
    setShowCompletedAttemptModal(true);
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

          {!attempt && (
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { id: "all", label: "جميع الاختبارات" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-2xl px-4 py-2.5 text-sm font-black transition ${activeTab === tab.id ? "bg-gradient-to-r from-medical-600 to-sky-500 text-white shadow-[0_12px_30px_rgba(14,165,233,0.35)]" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {!attempt && filteredExams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredExams.map((exam: any) => {
              const hasAttempts = (exam.attempts?.length ?? 0) > 0;
              const bestScore = exam.bestScore ?? 0;

              return (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => {
                    if (hasAttempts) {
                      openCompletedAttempt(exam);
                      return;
                    }
                    handleStartAttempt(exam.id);
                  }}
                  className="group rounded-[30px] border border-slate-200 bg-white/90 p-5 text-right shadow-[0_25px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-medical-300 hover:shadow-[0_25px_60px_rgba(14,165,233,0.15)] dark:border-slate-700 dark:bg-slate-900/80"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-medical-600">quiz</p>
                      <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">{exam.title}</h3>
                    </div>
                    <div className={`rounded-full px-2.5 py-1 text-[10px] font-black ${hasAttempts ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300" : "bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300"}`}>
                      {hasAttempts ? "تم حلها" : "جديدة"}
                    </div>
                  </div>

                  <div className="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <p>السنة: <span className="font-black text-slate-800 dark:text-slate-200">{exam.studyYear || "-"}</span></p>
                    <p>المادة: <span className="font-black text-slate-800 dark:text-slate-200">{exam.subject?.name || "-"}</span></p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">الأسئلة</p>
                      <p className="mt-1 font-black text-slate-900 dark:text-white">{exam.questionCount || 0}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">أفضل درجة</p>
                      <p className="mt-1 font-black text-slate-900 dark:text-white">{bestScore ? `${bestScore}%` : "-"}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-black text-medical-600">{hasAttempts ? "عرض النتيجة" : "ابدأ الاختبار"}</span>
                    <span className="rounded-full bg-gradient-to-r from-medical-600 to-sky-500 px-3 py-1.5 text-xs font-black text-white">▶</span>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}



        {!attempt && (
          <div className="space-y-8">
            {/* قسم اختيار السنة والمادة - الأول */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-[40px] border border-white/20 bg-gradient-to-br from-white/95 via-blue-50/80 to-indigo-50/60 p-8 shadow-[0_32px_80px_rgba(14,165,233,0.2)] backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-indigo-950/40"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-black bg-gradient-to-r from-medical-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent dark:from-sky-400 dark:via-cyan-400 dark:to-indigo-400 flex items-center gap-3">
                  <Compass className="w-8 h-8 shrink-0 text-medical-500 dark:text-sky-400" />
                  اختر مسارك التعليمي
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">حدد السنة الدراسية والمادة لبدء التدريب على الأسئلة</p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {/* السنة الدراسية */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <label className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-medical-500 to-sky-500 text-white text-xs font-black">1</div>
                    السنة الدراسية
                  </label>
                  <select
                    value={selectedStudyYear}
                    onChange={(e) => setSelectedStudyYear(e.target.value)}
                    className="w-full rounded-2xl border-2 border-slate-200 bg-white/70 px-4 py-3.5 text-sm font-bold text-slate-900 transition-all duration-300 hover:border-medical-400 focus:border-medical-600 focus:outline-none focus:ring-2 focus:ring-medical-200 dark:border-slate-600 dark:bg-slate-800/70 dark:text-white dark:focus:ring-medical-900"
                  >
                    <option value="">📚 اختر السنة...</option>
                    {(studyYears || []).map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </motion.div>

                {/* المادة */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <label className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white text-xs font-black">2</div>
                    المادة
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    disabled={!selectedStudyYear}
                    className="w-full rounded-2xl border-2 border-slate-200 bg-white/70 px-4 py-3.5 text-sm font-bold text-slate-900 transition-all duration-300 hover:border-sky-400 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800/70 dark:text-white dark:focus:ring-sky-900"
                  >
                    <option value="">📖 اختر المادة...</option>
                    {(subjects || []).map((subject: any) => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </motion.div>

                {/* عدد الأسئلة */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group flex flex-col justify-end"
                >
                  <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500 text-white text-xs font-black">✓</div>
                    الأسئلة المتاحة
                  </div>
                  <div className="rounded-2xl bg-gradient-to-r from-medical-600/20 to-sky-500/20 p-[2px]">
                    <div className="rounded-2xl bg-white/80 px-4 py-3.5 text-center text-sm font-black text-slate-900 dark:bg-slate-800/80 dark:text-white">
                      <span className="text-2xl font-black text-transparent bg-gradient-to-r from-medical-600 to-sky-500 bg-clip-text">
                        {questions.length}
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">سؤال متاح</p>
                    </div>
                  </div>
                </motion.div>
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
                <div className="rounded-[40px] border border-white/20 bg-gradient-to-br from-white/95 via-emerald-50/80 to-cyan-50/60 p-8 shadow-[0_32px_80px_rgba(16,185,129,0.15)] backdrop-blur-xl dark:border-slate-700/40 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-emerald-950/40">
                  {/* Header */}
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {subjects.find((s: any) => s.id === selectedSubjectId)?.name || "المادة"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        السؤال {Math.min(currentQuizIndex + 1, questions.length)} من {questions.length}
                      </p>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-center shadow-[0_12px_32px_rgba(16,185,129,0.3)]">
                      <span className="text-2xl font-black text-white">{currentQuizIndex + 1}/{questions.length}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                        animate={{ width: `${((currentQuizIndex) / questions.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Single Question Card with AnimatePresence */}
                  <div className="relative overflow-hidden min-h-[320px]">
                    <AnimatePresence mode="wait">
                      {currentQuizIndex < questions.length ? (
                        <motion.div
                          key={questions[currentQuizIndex].id}
                          initial={{ opacity: 0, x: 80, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -80, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="rounded-3xl border-2 border-slate-200/80 bg-white/90 dark:border-slate-700/80 dark:bg-slate-900/70 overflow-hidden"
                        >
                          <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-5 dark:from-slate-800 dark:to-slate-900">
                            <div className="flex items-start gap-3">
                              <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-medical-500 to-sky-500 text-sm font-black text-white shadow-lg shadow-medical-500/30">
                                {currentQuizIndex + 1}
                              </div>
                              <p className="text-base font-bold text-slate-900 leading-relaxed dark:text-white">
                                {questions[currentQuizIndex].text}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3 px-6 py-6">
                            {(questions[currentQuizIndex].options || []).map((option: any, optIndex: number) => (
                              <motion.button
                                key={option.id}
                                whileHover={{ scale: 1.01, x: 4 }}
                                whileTap={{ scale: 0.98 }}
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
                                className={`w-full rounded-2xl border-2 p-4 text-right font-bold transition-all duration-300 ${
                                  answers[questions[currentQuizIndex].id] === option.id
                                    ? "border-medical-600 bg-gradient-to-r from-medical-50 to-sky-50 text-medical-700 shadow-[0_8px_20px_rgba(14,165,233,0.25)] dark:border-medical-500 dark:from-medical-950/40 dark:to-sky-950/40 dark:text-medical-300"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:border-slate-600"
                                }`}
                              >
                                <span className="flex items-center justify-between">
                                  <span>{option.text}</span>
                                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200/50 text-xs font-black text-slate-700 dark:bg-slate-700 dark:text-slate-300 ml-3">
                                    {String.fromCharCode(65 + optIndex)}
                                  </span>
                                </span>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="completed"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="rounded-3xl border-2 border-emerald-300 dark:border-emerald-600 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/40 dark:to-cyan-950/40 p-10 text-center"
                        >
                          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                            <CheckCircle2 className="h-8 w-8" />
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">أجبت على جميع الأسئلة!</h3>
                          <p className="text-slate-500 dark:text-slate-400 mb-6">يمكنك مراجعة نتائجك في أي وقت</p>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowResultsModal(true)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-medical-600 to-sky-500 px-8 py-3.5 font-black text-sm text-white shadow-[0_16px_40px_rgba(14,165,233,0.35)] hover:shadow-[0_20px_50px_rgba(14,165,233,0.45)] transition-all"
                          >
                            <Trophy className="h-5 w-5" />
                            عرض النتيجة
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
              {(attempt.exam.questions || []).map((item: any, index: number) => {
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg overflow-hidden rounded-[28px] border-2 shadow-2xl ${
                resultSummary.percentage >= 50
                  ? "border-emerald-200/50 bg-gradient-to-br from-emerald-50/95 via-green-50/80 to-teal-50/60 dark:border-emerald-800/50 dark:from-emerald-950/80 dark:via-slate-900/80 dark:to-teal-950/60"
                  : "border-red-200/50 bg-gradient-to-br from-red-50/95 via-orange-50/80 to-rose-50/60 dark:border-red-800/50 dark:from-red-950/80 dark:via-slate-900/80 dark:to-rose-950/60"
              }`}
            >
              {/* الرأس */}
              <div className={`px-5 py-4 sm:px-8 sm:py-6 ${
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
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 sm:h-16 sm:w-16"
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
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition sm:h-10 sm:w-10"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* محتوى النتائج */}
              <div className="max-h-[65vh] overflow-y-auto overscroll-contain px-5 py-5 space-y-4 sm:px-8 sm:py-8 sm:space-y-6 scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
                {/* الإحصائيات الرئيسية */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl bg-white/70 p-3 shadow-lg dark:bg-slate-800/70 border-2 border-emerald-200 dark:border-emerald-700 sm:p-6"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400 sm:text-xs">الصحيحة</p>
                    <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400 sm:mt-4 sm:text-5xl">
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
                    <p className="mt-2 text-2xl font-black bg-gradient-to-r from-medical-600 to-sky-500 bg-clip-text text-transparent sm:mt-4 sm:text-5xl">
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
                    <p className="mt-2 text-2xl font-black text-red-600 dark:text-red-400 sm:mt-4 sm:text-5xl">
                      {resultSummary.total - resultSummary.correct}
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1 sm:text-sm sm:mt-2">حاول مجددًا</p>
                  </motion.div>
                </div>

                {/* تفاصيل الأسئلة المختصرة */}
                {questionsDetails.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white sm:text-lg">تفاصيل الإجابات</h4>
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1 sm:max-h-64 sm:pr-2">
                      {questionsDetails.map((detail, index) => (
                        <motion.button
                          key={detail.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => openQuestionDetail(detail)}
                          className={`w-full rounded-xl p-2.5 text-right transition-all duration-300 border-2 sm:rounded-2xl sm:p-3.5 ${
                            detail.isCorrect
                              ? "bg-emerald-100/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-600 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]"
                              : "bg-red-100/70 dark:bg-red-950/30 border-red-300 dark:border-red-600 hover:shadow-[0_8px_20px_rgba(239,68,68,0.2)]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-xs font-black sm:text-sm ${detail.isCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
                              {detail.isCorrect ? "✅" : "❌"}
                            </span>
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate flex-1 sm:text-xs">
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
              <div className="border-t border-emerald-200 dark:border-emerald-700 px-5 py-3 flex gap-2 sm:px-8 sm:py-5 sm:gap-3">
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
                  className="flex-1 rounded-xl bg-gradient-to-r from-medical-600 via-sky-500 to-indigo-600 px-3 py-2.5 font-black text-xs text-white shadow-[0_12px_30px_rgba(14,165,233,0.3)] hover:shadow-[0_16px_40px_rgba(14,165,233,0.4)] transition-all sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
                >
                  حاول مرة أخرى
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowResultsModal(false)}
                  className="flex-1 rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 font-black text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
                >
                  ✓ حسناً
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* نافذة تفاصيل الاختبار المحلول */}
        {showCompletedAttemptModal && selectedCompletedAttempt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCompletedAttemptModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-[24px] border-2 border-slate-200 bg-white shadow-[0_25px_60px_rgba(15,23,42,0.14)] dark:border-slate-700 dark:bg-slate-900 sm:max-w-3xl sm:rounded-[30px]"
            >
              <div className="bg-gradient-to-r from-medical-600 to-sky-500 px-5 py-4 sm:px-6 sm:py-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">محاولة مكتملة</p>
                    <h3 className="mt-1 text-lg font-black text-white sm:mt-2 sm:text-2xl">{selectedCompletedAttempt.exam.title}</h3>
                  </div>
                  <button
                    onClick={() => setShowCompletedAttemptModal(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 sm:h-10 sm:w-10"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="max-h-[70vh] overflow-y-auto overscroll-contain px-5 py-5 space-y-3 sm:max-h-[75vh] sm:px-6 sm:py-6 sm:space-y-5 scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
                <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800 sm:rounded-2xl sm:p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 sm:text-[10px]">السنة</p>
                    <p className="mt-1 text-sm font-black text-slate-900 dark:text-white sm:mt-2 sm:text-lg">{selectedCompletedAttempt.exam.studyYear || "-"}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800 sm:rounded-2xl sm:p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 sm:text-[10px]">المادة</p>
                    <p className="mt-1 text-sm font-black text-slate-900 dark:text-white sm:mt-2 sm:text-lg">{selectedCompletedAttempt.exam.subject?.name || "-"}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800 sm:rounded-2xl sm:p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 sm:text-[10px]">النسبة</p>
                    <p className="mt-1 text-sm font-black text-slate-900 dark:text-white sm:mt-2 sm:text-lg">{Number(selectedCompletedAttempt.percentage || 0).toFixed(1)}%</p>
                  </div>
                </div>

                {(selectedCompletedAttempt.exam.questions || []).map((item: any, index: number) => {
                  const answer = selectedCompletedAttempt.answers.find((ans: any) => ans.questionId === item.questionId);
                  const selectedOption = item.question.options.find((option: any) => option.id === answer?.selectedOptionId);
                  const correctOption = item.question.options.find((option: any) => option.isCorrect);
                  const isCorrect = answer?.isCorrect ?? false;

                  return (
                    <div
                      key={item.questionId}
                      className={`rounded-xl border-2 p-3 sm:rounded-[24px] sm:p-4 ${
                        isCorrect
                          ? "border-emerald-300 bg-emerald-50/80 dark:border-emerald-600 dark:bg-emerald-950/20"
                          : "border-red-300 bg-red-50/80 dark:border-red-600 dark:bg-red-950/20"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3 sm:gap-3">
                        <p className="text-xs font-black text-slate-800 dark:text-slate-100 sm:text-sm">السؤال {index + 1}</p>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-black ${isCorrect ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"}`}>
                          {isCorrect ? "صح" : "خطأ"}
                        </span>
                      </div>

                      <p className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">{item.question.text}</p>

                      <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                        <div className="rounded-xl border border-slate-200 bg-white/70 p-2.5 dark:border-slate-700 dark:bg-slate-800/60 sm:rounded-2xl sm:p-3">
                          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 sm:text-[10px]">اختياري</p>
                          <p className="mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-100 sm:text-sm">{selectedOption?.text || "لم تجب"}</p>
                        </div>

                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-2.5 dark:border-emerald-700 dark:bg-emerald-950/20 sm:rounded-2xl sm:p-3">
                          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300 sm:text-[10px]">الإجابة الصحيحة</p>
                          <p className="mt-0.5 text-xs font-bold text-emerald-900 dark:text-emerald-200 sm:text-sm">{correctOption?.text}</p>
                        </div>

                        {item.question.explanation && (
                          <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-2.5 dark:border-blue-700 dark:bg-blue-950/20 sm:rounded-2xl sm:p-3">
                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300 sm:text-[10px]">الشرح</p>
                            <p className="mt-0.5 text-xs text-blue-900 dark:text-blue-200 sm:text-sm">{item.question.explanation}</p>
                          </div>
                        )}

                        {item.question.reference && (
                          <div className="rounded-xl border border-indigo-200 bg-indigo-50/80 p-2.5 dark:border-indigo-700 dark:bg-indigo-950/20 sm:rounded-2xl sm:p-3">
                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300 sm:text-[10px]">المرجع العلمي</p>
                            <p className="mt-0.5 text-xs text-indigo-900 dark:text-indigo-200 sm:text-sm">{item.question.reference}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg overflow-hidden rounded-[24px] border-2 shadow-[0_25px_60px_rgba(15,23,42,0.14)] sm:max-w-2xl sm:rounded-[30px] ${
                selectedQuestionDetail.isCorrect
                  ? "border-emerald-300/60 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:border-emerald-700/50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/40"
                  : "border-red-300/60 bg-gradient-to-br from-red-50 via-orange-50 to-rose-50 dark:border-red-700/50 dark:from-red-950/40 dark:via-slate-900 dark:to-rose-950/40"
              }`}
            >
              {/* الرأس */}
              <div
                className={`px-5 py-4 sm:px-6 sm:py-5 ${
                  selectedQuestionDetail.isCorrect
                    ? "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"
                    : "bg-gradient-to-r from-red-500 via-orange-500 to-red-500"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 sm:h-12 sm:w-12">
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
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition sm:h-10 sm:w-10"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* المحتوى */}
              <div
                style={{ WebkitOverflowScrolling: "touch" }}
                className="max-h-[60vh] overflow-y-auto overscroll-contain px-5 py-5 space-y-3 sm:max-h-[70vh] sm:px-6 sm:py-6 sm:space-y-5 scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600"
              >
                {/* السؤال */}
                <div className="rounded-xl border border-slate-200/80 bg-white/60 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 sm:rounded-2xl sm:p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-600 dark:text-slate-400 mb-1.5 sm:text-xs sm:mb-2">السؤال</p>
                  <p className="text-sm font-bold text-slate-900 leading-relaxed dark:text-white sm:text-base">
                    {selectedQuestionDetail.text}
                  </p>
                </div>

                {/* إجابتك */}
                <div className="rounded-xl bg-white/70 p-3 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 shadow-sm sm:rounded-2xl sm:p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-600 dark:text-slate-400 mb-1.5 sm:text-xs sm:mb-2">
                    إجابتك
                  </p>
                  <p className={`text-xs font-bold sm:text-sm ${selectedQuestionDetail.selectedOption ? "text-slate-900 dark:text-white" : "text-red-600 dark:text-red-400"}`}>
                    {selectedQuestionDetail.selectedOption?.text || "لم تجب على هذا السؤال"}
                  </p>
                </div>

                {/* الإجابة الصحيحة */}
                <div
                  className={`rounded-xl p-3 border-2 shadow-sm sm:rounded-2xl sm:p-4 ${
                    selectedQuestionDetail.isCorrect
                      ? "bg-emerald-100/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-600"
                      : "bg-emerald-100/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-600"
                  }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400 mb-1.5 sm:text-xs sm:mb-2">
                    الإجابة الصحيحة
                  </p>
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200 sm:text-sm">
                    {selectedQuestionDetail.correctOption?.text}
                  </p>
                </div>

                {/* الشرح */}
                <div className="rounded-xl bg-blue-100/60 dark:bg-blue-950/30 p-3 border-2 border-blue-300 dark:border-blue-600 shadow-sm sm:rounded-2xl sm:p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-blue-700 dark:text-blue-400 mb-1.5 sm:text-xs sm:mb-2">
                    الشرح التفصيلي
                  </p>
                  <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed sm:text-sm">
                    {selectedQuestionDetail.explanation}
                  </p>
                </div>

                {/* المرجع العلمي */}
                <div className="rounded-xl bg-indigo-100/60 dark:bg-indigo-950/30 p-3 border-2 border-indigo-300 dark:border-indigo-600 shadow-sm sm:rounded-2xl sm:p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-indigo-700 dark:text-indigo-400 mb-1.5 sm:text-xs sm:mb-2">
                    المرجع العلمي
                  </p>
                  <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed sm:text-sm">
                    {selectedQuestionDetail.reference}
                  </p>
                </div>
              </div>

              {/* الزر */}
              <div className="border-t border-slate-200 dark:border-slate-700 px-5 py-3 sm:px-6 sm:py-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDetailModal(false)}
                  className={`w-full rounded-xl px-4 py-2.5 font-black text-sm text-white transition-all sm:rounded-2xl sm:py-3 ${
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

