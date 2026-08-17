"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Filter,
  LayoutDashboard,
  Plus,
  Search,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trophy,
  Eye,
  EyeOff,
  Copy,
  BarChart3,
  Lightbulb,
  Hash,
} from "lucide-react";
import {
  cloneQuizQuestion,
  createQuizQuestion,
  deleteQuizQuestion,
  getQuizDashboardStats,
  getQuizFilterOptions,
  getQuizQuestionBank,
  getQuizResultsForAdmin,
  toggleQuizQuestionPublish,
} from "@/app/actions/quiz";
import { getAvailableQuizSubjects } from "@/app/actions/quiz";


const difficultyOptions = [
  { value: "EASY", label: "سهل", color: "emerald", icon: "🟢" },
  { value: "MEDIUM", label: "متوسط", color: "amber", icon: "🟡" },
  { value: "HARD", label: "صعب", color: "rose", icon: "🔴" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function AdminQuizPage() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState<any>({
    totalQuestions: 0,
    publishedQuestions: 0,
    draftQuestions: 0,
    totalAttempts: 0,
    averageScore: 0,
    topScore: 0,
    lowestScore: 0,
  });
  const [subjects, setSubjects] = useState<any[]>([]);
  const [filters, setFilters] = useState({ subjects: [], studyYears: [] });
  const yearOptions = filters.studyYears || [];
  const [questionPage, setQuestionPage] = useState(1);
  const [questionPageSize, setQuestionPageSize] = useState(10);
  const [questionSearch, setQuestionSearch] = useState("");
  const [questionSubject, setQuestionSubject] = useState("");
  const [questionYear, setQuestionYear] = useState("");
  const [questionDifficulty, setQuestionDifficulty] = useState("");
  const [questionStatus, setQuestionStatus] = useState("");
  const [questionBank, setQuestionBank] = useState<any>({ questions: [], total: 0, totalPages: 1 });
  const [resultsList, setResultsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [questionForm, setQuestionForm] = useState({
    text: "",
    subjectId: "",
    studyYear: "",
    difficulty: "MEDIUM",
    explanation: "",
    hint: "",
    reference: "",
    keywords: "",
    isPublished: false,
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });

  const visibleBankSubjects = useMemo(() => {
    if (!questionYear) return subjects;
    return subjects.filter((subject: any) => subject.category?.name === questionYear);
  }, [subjects, questionYear]);
  const visibleQuestionSubjects = useMemo(() => {
    if (!questionForm.studyYear) return subjects;
    return subjects.filter((subject: any) => subject.category?.name === questionForm.studyYear);
  }, [subjects, questionForm.studyYear]);

  useEffect(() => {
    const loadInitialData = async () => {
      const data = await getQuizDashboardStats();
      const results = await getQuizResultsForAdmin();
      const filterData = await getQuizFilterOptions();
      const subjectData = await getAvailableQuizSubjects();
      setStats(data);
      setResultsList(results);
      setFilters(filterData);
      setSubjects(subjectData);
      const bank = await getQuizQuestionBank({ page: 1, pageSize: questionPageSize });
      setQuestionBank(bank);
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    refreshBank();
  }, [questionPage, questionPageSize, questionSearch, questionSubject, questionYear, questionDifficulty, questionStatus]);

  useEffect(() => {
    if (questionForm.studyYear && questionForm.subjectId && !visibleQuestionSubjects.some((subject: any) => subject.id === questionForm.subjectId)) {
      setQuestionForm((prev) => ({ ...prev, subjectId: "" }));
    }
  }, [questionForm.studyYear, questionForm.subjectId, visibleQuestionSubjects]);

  useEffect(() => {
    if (questionYear && questionSubject && !visibleBankSubjects.some((subject: any) => subject.id === questionSubject)) {
      setQuestionSubject("");
    }
  }, [questionYear, questionSubject, visibleBankSubjects]);

  const refreshBank = async () => {
    setLoading(true);
    const bank = await getQuizQuestionBank({
      search: questionSearch,
      subjectId: questionSubject,
      studyYear: questionYear,
      difficulty: questionDifficulty,
      status: questionStatus,
      page: questionPage,
      pageSize: questionPageSize,
    });
    setQuestionBank(bank);
    setLoading(false);
  };

  const refreshDashboard = async () => {
    const data = await getQuizDashboardStats();
    const results = await getQuizResultsForAdmin();
    const filterData = await getQuizFilterOptions();
    const subjectData = await getAvailableQuizSubjects();
    setStats(data);
    setResultsList(results);
    setFilters(filterData);
    setSubjects(subjectData);
  };

  const handleQuestionChange = (field: string, value: any) => {
    setQuestionForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateOption = (index: number, field: "text" | "isCorrect", value: string | boolean) => {
    setQuestionForm((prev) => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? { ...option, [field]: value } : option),
    }));
  };

  const addOption = () => {
    setQuestionForm((prev) => ({ ...prev, options: [...prev.options, { text: "", isCorrect: false }] }));
  };

  const submitQuestion = async () => {
    try {
      const payload = {
        ...questionForm,
        options: questionForm.options.filter((o) => o.text.trim()).map((o, index) => ({ ...o, order: index })),
      };
      if (!payload.text.trim()) return alert("نص السؤال مطلوب");
      if (!payload.subjectId) return alert("اختر المادة");
      if (!payload.studyYear) return alert("اختر السنة الدراسية");
      if (payload.options.length < 2) return alert("يجب إدخال خيارين على الأقل");
      const result = await createQuizQuestion(payload as any);
      if (result?.success) {
        setQuestionForm({
          text: "",
          subjectId: "",
          studyYear: "",
          difficulty: "MEDIUM",
          explanation: "",
          hint: "",
          reference: "",
          keywords: "",
          isPublished: false,
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        });
        refreshDashboard();
        setTab("bank");
      }
    } catch (error: any) {
      alert(error?.message || "حدث خطأ أثناء حفظ السؤال");
    }
  };

  const handleTogglePublishQuestion = async (id: string) => {
    const result = await toggleQuizQuestionPublish(id);
    if (result?.success) refreshBank();
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا السؤال؟")) return;
    await deleteQuizQuestion(id);
    refreshBank();
    refreshDashboard();
  };

  const handleCloneQuestion = async (id: string) => {
    await cloneQuizQuestion(id);
    refreshBank();
  };

  const tabs = [
    { id: "overview", label: "لوحة التحكم", icon: LayoutDashboard, gradient: "from-violet-500 to-purple-600" },
    { id: "bank", label: "بنك الأسئلة", icon: BookOpen, gradient: "from-sky-500 to-blue-600" },
    { id: "add", label: "إضافة سؤال", icon: Plus, gradient: "from-emerald-500 to-teal-600" },
    { id: "results", label: "نتائج الطلاب", icon: Trophy, gradient: "from-rose-500 to-pink-600" },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-[32px] overflow-hidden mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.3),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        
        <div className="relative z-10 p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-[22px] bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl"
              >
                <BrainCircuit className="w-9 h-9 text-white" />
              </motion.div>
              <div>
                <p className="text-sm font-black text-white/50 tracking-widest uppercase mb-1">AuraMed Quiz Engine</p>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">لوحة تحكم الاختبارات</h1>
                <p className="text-sm text-white/60 mt-1 font-medium">إدارة الأسئلة ونتائج الطلاب</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {tabs.map((t) => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                    tab === t.id
                      ? "bg-white text-slate-900 shadow-xl shadow-black/10"
                      : "bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm border border-white/10"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overview Tab */}
      <AnimatePresence mode="wait">
        {tab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                title="إجمالي الأسئلة"
                value={stats.totalQuestions ?? 0}
                icon={FileText}
                gradient="from-violet-500 via-purple-500 to-fuchsia-500"
                bgGlow="bg-violet-500/20"
                delay={0}
              />
              <StatCard
                title="أسئلة منشورة"
                value={stats.publishedQuestions ?? 0}
                icon={CheckCircle2}
                gradient="from-emerald-500 via-green-500 to-teal-500"
                bgGlow="bg-emerald-500/20"
                delay={1}
              />
              <StatCard
                title="مسودات"
                value={stats.draftQuestions ?? 0}
                icon={Lightbulb}
                gradient="from-amber-500 via-orange-500 to-yellow-500"
                bgGlow="bg-amber-500/20"
                delay={2}
              />
              <StatCard
                title="محاولات الطلاب"
                value={stats.totalAttempts ?? 0}
                icon={Users}
                gradient="from-blue-500 via-indigo-500 to-violet-500"
                bgGlow="bg-blue-500/20"
                delay={3}
              />
              <StatCard
                title="متوسط النتائج"
                value={`${Number(stats.averageScore || 0).toFixed(1)}%`}
                icon={BarChart3}
                gradient="from-purple-500 via-fuchsia-500 to-pink-500"
                bgGlow="bg-purple-500/20"
                delay={7}
              />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <QuickAction
                title="إضافة سؤال جديد"
                description="أنشئ سؤالاً متعددة الخيارات مع شرح وتلميحات"
                icon={Plus}
                gradient="from-emerald-500 to-teal-600"
                onClick={() => setTab("add")}
              />
              <QuickAction
                title="مراجعة النتائج"
                description="تتبع أداء الطلاب ونسب النجاح"
                icon={Trophy}
                gradient="from-rose-500 to-pink-600"
                onClick={() => setTab("results")}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bank Tab */}
      <AnimatePresence mode="wait">
        {tab === "bank" && (
          <motion.div
            key="bank"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-lg shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white">بحث وتصفية</h3>
                  <p className="text-xs text-slate-500">ابحث وصفّر الأسئلة حسب المادة أو السنة أو الصعوبة</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                <div className="relative xl:col-span-2">
                  <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    placeholder="اكتب للبحث في الأسئلة..."
                    className="w-full pr-11 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
                <select value={questionSubject} onChange={(e) => setQuestionSubject(e.target.value)} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all">
                  <option value="">كل المواد</option>
                  {(visibleBankSubjects || []).map((subject: any) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                </select>
                <select value={questionYear} onChange={(e) => setQuestionYear(e.target.value)} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all">
                  <option value="">كل السنوات</option>
                  {(filters.studyYears || []).map((year: string) => <option key={year} value={year}>{year}</option>)}
                </select>
                <select value={questionDifficulty} onChange={(e) => setQuestionDifficulty(e.target.value)} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all">
                  <option value="">كل المستويات</option>
                  {difficultyOptions.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
                <select value={questionStatus} onChange={(e) => setQuestionStatus(e.target.value)} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all">
                  <option value="">كل الحالات</option>
                  <option value="PUBLISHED">منشور</option>
                  <option value="DRAFT">مسودة</option>
                </select>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {(questionBank.questions || []).length === 0 && !loading && (
                <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-slate-400 font-bold text-lg">لا توجد أسئلة بعد</p>
                  <p className="text-slate-300 dark:text-slate-600 text-sm mt-1">ابدأ بإضافة أسئلة جديدة</p>
                </div>
              )}

              <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                {(questionBank.questions || []).map((question: any, idx: number) => (
                  <motion.div key={question.id} variants={item}>
                    <QuestionCard
                      question={question}
                      onTogglePublish={() => handleTogglePublishQuestion(question.id)}
                      onClone={() => handleCloneQuestion(question.id)}
                      onDelete={() => handleDeleteQuestion(question.id)}
                      index={idx}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <div className="text-sm text-slate-500 font-medium">
                إجمالي النتائج: <span className="font-black text-slate-900 dark:text-white">{questionBank.total || 0}</span>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuestionPage((p) => Math.max(1, p - 1))}
                  disabled={questionPage <= 1}
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sm disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <span className="font-black text-slate-900 dark:text-white text-sm">{questionPage}</span>
                  <span className="text-slate-400 text-sm">/</span>
                  <span className="text-slate-500 text-sm font-medium">{questionBank.totalPages || 1}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuestionPage((p) => Math.min(questionBank.totalPages || 1, p + 1))}
                  disabled={questionPage >= (questionBank.totalPages || 1)}
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sm disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Question Tab */}
      <AnimatePresence mode="wait">
        {tab === "add" && (
          <motion.div
            key="add"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Form Header */}
            <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-lg shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">إضافة سؤال جديد</h2>
                    <p className="text-sm text-slate-500 mt-0.5">أنشئ سؤالاً متعددة الخيارات مع خيارات وشرح</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={submitQuestion}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-shadow"
                >
                  حفظ السؤال
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Question Content */}
              <div className="xl:col-span-2 space-y-6">
                <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                      <Hash className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white">نص السؤال</h3>
                  </div>
                  <textarea
                    value={questionForm.text}
                    onChange={(e) => handleQuestionChange("text", e.target.value)}
                    rows={5}
                    placeholder="اكتب نص السؤال هنا..."
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none"
                  />
                </div>

                {/* Options */}
                <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white">الاختيارات</h3>
                    <span className="text-xs text-slate-400 mr-auto">{questionForm.options.filter(o => o.text.trim()).length} من {questionForm.options.length}</span>
                  </div>
                  <div className="space-y-3">
                    {questionForm.options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`rounded-2xl border-2 p-4 transition-all ${
                          option.isCorrect
                            ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-600"
                            : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                            option.isCorrect
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <input
                            value={option.text}
                            onChange={(e) => updateOption(index, "text", e.target.value)}
                            placeholder={`الاختيار ${String.fromCharCode(65 + index)}`}
                            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                          />
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={!!option.isCorrect}
                              onChange={(e) => updateOption(index, "isCorrect", e.target.checked)}
                              className="w-5 h-5 rounded-lg accent-emerald-500"
                            />
                            <span className="text-xs font-bold text-slate-500">صحيح</span>
                          </label>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={addOption}
                    className="mt-4 w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-500 hover:border-emerald-400 hover:text-emerald-500 transition-colors"
                  >
                    + إضافة خيار آخر
                  </motion.button>
                </div>
              </div>

              {/* Sidebar Settings */}
              <div className="space-y-6">
                <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                      <Filter className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white">الإعدادات</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">السنة الدراسية</label>
                      <select value={questionForm.studyYear} onChange={(e) => handleQuestionChange("studyYear", e.target.value)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all">
                        <option value="">اختر السنة</option>
                        {(yearOptions || []).map((year: string) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">المادة</label>
                      <select value={questionForm.subjectId} onChange={(e) => handleQuestionChange("subjectId", e.target.value)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all">
                        <option value="">اختر المادة</option>
                        {(visibleQuestionSubjects || []).map((subject: any) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">مستوى الصعوبة</label>
                      <div className="grid grid-cols-3 gap-2">
                        {difficultyOptions.map((item) => (
                          <motion.button
                            key={item.value}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleQuestionChange("difficulty", item.value)}
                            className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                              questionForm.difficulty === item.value
                                ? item.color === "emerald" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                : item.color === "amber" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                                : "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                          >
                            {item.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">نشر فوراً</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={questionForm.isPublished}
                          onChange={(e) => handleQuestionChange("isPublished", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Extra Info */}
                <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white">معلومات إضافية</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">شرح الإجابة</label>
                      <textarea
                        value={questionForm.explanation}
                        onChange={(e) => handleQuestionChange("explanation", e.target.value)}
                        rows={3}
                        placeholder="اشرح الإجابة الصحيحة..."
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-3 text-sm font-medium focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">تلميح</label>
                      <input
                        value={questionForm.hint}
                        onChange={(e) => handleQuestionChange("hint", e.target.value)}
                        placeholder="تلميح اختياري للطلاب..."
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">المرجع العلمي</label>
                      <input
                        value={questionForm.reference}
                        onChange={(e) => handleQuestionChange("reference", e.target.value)}
                        placeholder="مرجع علمي..."
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">الكلمات المفتاحية</label>
                      <input
                        value={questionForm.keywords}
                        onChange={(e) => handleQuestionChange("keywords", e.target.value)}
                        placeholder="كلمات مفتاحية مفصولة بفواصل..."
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Tab */}
      <AnimatePresence mode="wait">
        {tab === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-lg shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">نتائج الطلاب</h2>
                  <p className="text-sm text-slate-500">{resultsList.length} نتيجة</p>
                </div>
              </div>

              {(resultsList || []).length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-slate-400 font-bold text-lg">لا توجد نتائج بعد</p>
                  <p className="text-slate-300 dark:text-slate-600 text-sm mt-1">ستظهر نتائج الطلاب هنا بعد حل الاختبارات</p>
                </div>
              )}

              <div className="space-y-3">
                {(resultsList || []).map((result: any, idx: number) => {
                  const percentage = Number(result.percentage || 0);
                  const passed = percentage >= 60;
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`rounded-2xl border p-4 transition-all hover:shadow-md ${
                        passed
                          ? "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10"
                          : "border-rose-200 dark:border-rose-800/50 bg-rose-50/50 dark:bg-rose-900/10"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm ${
                            passed
                              ? "bg-emerald-500 text-white"
                              : "bg-rose-500 text-white"
                          }`}>
                            {percentage.toFixed(0)}%
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 dark:text-white">{result.user?.name || result.user?.email || "طالب"}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{result.exam?.title || "—"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="font-bold">{result.correctCount}</span> صحيح
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            <span className="font-bold">{result.incorrectCount}</span> خاطئ
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            <span className="font-bold">{Math.round((result.timeSpentSeconds || 0) / 60)}</span> دقيقة
                          </span>
                          <span className="text-slate-400">
                            {new Date(result.completedAt || result.createdAt).toLocaleDateString("ar-EG")}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────────────────────────────────── */
/* StatCard Component                                     */
/* ────────────────────────────────────────────────────── */
function StatCard({ title, value, icon: Icon, gradient, bgGlow, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay * 0.07, type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-lg shadow-slate-200/30 dark:shadow-none overflow-hidden group cursor-default"
    >
      {/* Glow Effect */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full opacity-50" />
      
      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────── */
/* QuestionCard Component                                 */
/* ────────────────────────────────────────────────────── */
function QuestionCard({ question, onTogglePublish, onClone, onDelete, index }: any) {
  const diffConfig: Record<string, { bg: string; text: string; label: string }> = {
    EASY: { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-400", label: "سهل" },
    MEDIUM: { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-400", label: "متوسط" },
    HARD: { bg: "bg-rose-100 dark:bg-rose-900/40", text: "text-rose-700 dark:text-rose-400", label: "صعب" },
  };
  const diff = diffConfig[question.difficulty] || diffConfig.MEDIUM;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${diff.bg} ${diff.text}`}>
              {diff.label}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
              question.isPublished
                ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
            }`}>
              {question.isPublished ? "منشور" : "مسودة"}
            </span>
            {question.subject?.name && (
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400">
                {question.subject.name}
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed">
            {question.text}
          </p>
          {question.studyYear && (
            <p className="text-xs text-slate-400 mt-2">السنة: {question.studyYear}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onTogglePublish}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              question.isPublished
                ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 hover:bg-amber-200"
                : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200"
            }`}
            title={question.isPublished ? "إلغاء النشر" : "نشر"}
          >
            {question.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onClone}
            className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center hover:bg-sky-200 transition-all"
            title="نسخ"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onDelete}
            className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center hover:bg-rose-200 transition-all"
            title="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────── */
/* QuickAction Component                                  */
/* ────────────────────────────────────────────────────── */
function QuickAction({ title, description, icon: Icon, gradient, onClick }: any) {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="text-left rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
    >
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient}`} />
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-black text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </motion.button>
  );
}
