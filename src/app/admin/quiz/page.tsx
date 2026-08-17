"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Filter,
  GraduationCap,
  LayoutDashboard,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import {
  cloneQuizQuestion,
  createQuizExam,
  createQuizQuestion,
  deleteQuizExam,
  deleteQuizQuestion,
  getQuizDashboardStats,
  getQuizExams,
  getQuizFilterOptions,
  getQuizQuestionBank,
  getQuizResultsForAdmin,
  toggleQuizExamPublish,
  toggleQuizQuestionPublish,
  updateQuizExam,
  updateQuizQuestion,
} from "@/app/actions/quiz";
import { getAvailableQuizSubjects } from "@/app/actions/quiz";
import { useRouter } from "next/navigation";

const difficultyOptions = [
  { value: "EASY", label: "سهل" },
  { value: "MEDIUM", label: "متوسط" },
  { value: "HARD", label: "صعب" },
];

export default function AdminQuizPage() {
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState<any>({
    totalQuestions: 0,
    publishedQuestions: 0,
    draftQuestions: 0,
    totalExams: 0,
    publishedExams: 0,
    unpublishedExams: 0,
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
  const [examList, setExamList] = useState<any[]>([]);
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

  const [examForm, setExamForm] = useState({
    title: "",
    description: "",
    subjectId: "",
    studyYear: "",
    difficulty: "MEDIUM",
    questionCount: 10,
    durationMinutes: 20,
    passScore: 60,
    allowRetake: true,
    randomizeQuestions: true,
    randomizeOptions: true,
    showAnswerExplanation: true,
    isPublished: false,
    manualQuestionIds: [] as string[],
  });

  const visibleBankSubjects = useMemo(() => {
    if (!questionYear) return subjects;
    return subjects.filter((subject: any) => subject.category?.name === questionYear);
  }, [subjects, questionYear]);
  const visibleQuestionSubjects = useMemo(() => {
    if (!questionForm.studyYear) return subjects;
    return subjects.filter((subject: any) => subject.category?.name === questionForm.studyYear);
  }, [subjects, questionForm.studyYear]);
  const visibleExamSubjects = useMemo(() => {
    if (!examForm.studyYear) return subjects;
    return subjects.filter((subject: any) => subject.category?.name === examForm.studyYear);
  }, [subjects, examForm.studyYear]);

  useEffect(() => {
    const loadInitialData = async () => {
      const data = await getQuizDashboardStats();
      const results = await getQuizResultsForAdmin();
      const examData = await getQuizExams();
      const filterData = await getQuizFilterOptions();
      const subjectData = await getAvailableQuizSubjects();
      setStats(data);
      setExamList(examData);
      setResultsList(results);
      setFilters(filterData);
      setSubjects(subjectData);
      const bank = await getQuizQuestionBank({ page: 1, pageSize: questionPageSize });
      setQuestionBank(bank);
    };

    loadInitialData();
  }, []);

  const filteredQuestionIds = useMemo(() => {
    return questionBank.questions.filter((q: any) => q.isPublished).map((q: any) => q.id);
  }, [questionBank]);

  useEffect(() => {
    refreshBank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionPage, questionPageSize, questionSearch, questionSubject, questionYear, questionDifficulty, questionStatus]);

  useEffect(() => {
    if (questionForm.studyYear && questionForm.subjectId && !visibleQuestionSubjects.some((subject: any) => subject.id === questionForm.subjectId)) {
      setQuestionForm((prev) => ({ ...prev, subjectId: "" }));
    }
  }, [questionForm.studyYear, questionForm.subjectId, visibleQuestionSubjects]);

  useEffect(() => {
    if (examForm.studyYear && examForm.subjectId && !visibleExamSubjects.some((subject: any) => subject.id === examForm.subjectId)) {
      setExamForm((prev) => ({ ...prev, subjectId: "" }));
    }
  }, [examForm.studyYear, examForm.subjectId, visibleExamSubjects]);

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
    const examData = await getQuizExams();
    const filterData = await getQuizFilterOptions();
    const subjectData = await getAvailableQuizSubjects();
    setStats(data);
    setExamList(examData);
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

  const selectManualQuestion = (questionId: string) => {
    setExamForm((prev) => {
      const exists = prev.manualQuestionIds.includes(questionId);
      const next = exists ? prev.manualQuestionIds.filter((id) => id !== questionId) : [...prev.manualQuestionIds, questionId];
      return { ...prev, manualQuestionIds: next };
    });
  };

  const createExam = async () => {
    try {
      const payload = {
        ...examForm,
        questionIds: examForm.manualQuestionIds.length ? examForm.manualQuestionIds : filteredQuestionIds.slice(0, examForm.questionCount),
      };
      await createQuizExam(payload as any);
      alert("تم إنشاء الاختبار بنجاح");
      setExamForm({
        title: "",
        description: "",
        subjectId: "",
        studyYear: "",
        difficulty: "MEDIUM",
        questionCount: 10,
        durationMinutes: 20,
        passScore: 60,
        allowRetake: true,
        randomizeQuestions: true,
        randomizeOptions: true,
        showAnswerExplanation: true,
        isPublished: false,
        manualQuestionIds: [],
      });
      refreshDashboard();
      setTab("exams");
    } catch (error: any) {
      alert(error?.message || "فشل إنشاء الاختبار");
    }
  };

  const handleToggleExamPublish = async (id: string) => {
    await toggleQuizExamPublish(id);
    refreshDashboard();
  };

  const handleDeleteExam = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الاختبار؟")) return;
    await deleteQuizExam(id);
    refreshDashboard();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-medical-600">AuraMed</p>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-2">لوحة تحكم Quiz</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: "overview", label: "لوحة التحكم", icon: LayoutDashboard },
              { id: "bank", label: "بنك الأسئلة", icon: BookOpen },
              { id: "add", label: "+ إضافة سؤال", icon: Plus },
              { id: "exams", label: "الاختبارات", icon: ClipboardCheck },
              { id: "results", label: "نتائج الطلاب", icon: Users },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${tab === item.id ? "bg-medical-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard title="إجمالي الأسئلة" value={stats.totalQuestions ?? 0} icon={FileText} color="from-violet-500 to-indigo-500" />
            <StatCard title="أسئلة منشورة" value={stats.publishedQuestions ?? 0} icon={CheckCircle2} color="from-emerald-500 to-teal-500" />
            <StatCard title="مسودات" value={stats.draftQuestions ?? 0} icon={Sparkles} color="from-amber-500 to-orange-500" />
            <StatCard title="إجمالي الاختبارات" value={stats.totalExams ?? 0} icon={ClipboardCheck} color="from-sky-500 to-cyan-500" />
            <StatCard title="اختبارات منشورة" value={stats.publishedExams ?? 0} icon={ShieldCheck} color="from-emerald-500 to-green-500" />
            <StatCard title="غير منشورة" value={stats.unpublishedExams ?? 0} icon={Filter} color="from-rose-500 to-pink-500" />
            <StatCard title="محاولات الطلاب" value={stats.totalAttempts ?? 0} icon={Users} color="from-blue-500 to-indigo-500" />
            <StatCard title="متوسط النتائج" value={`${Number(stats.averageScore || 0).toFixed(1)}%`} icon={Target} color="from-purple-500 to-violet-500" />
          </div>
        </div>
      )}

      {tab === "bank" && (
        <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex flex-col xl:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute right-3 top-3.5 text-slate-400" />
              <input value={questionSearch} onChange={(e) => setQuestionSearch(e.target.value)} placeholder="بحث في بنك الأسئلة..." className="w-full pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm" />
            </div>
            <select value={questionSubject} onChange={(e) => setQuestionSubject(e.target.value)} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm">
              <option value="">كل المواد</option>
              {(visibleBankSubjects || []).map((subject: any) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
            </select>
            <select value={questionYear} onChange={(e) => setQuestionYear(e.target.value)} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm">
              <option value="">كل السنوات</option>
              {(filters.studyYears || []).map((year: string) => <option key={year} value={year}>{year}</option>)}
            </select>
            <select value={questionDifficulty} onChange={(e) => setQuestionDifficulty(e.target.value)} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm">
              <option value="">كل مستويات الصعوبة</option>
              {difficultyOptions.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            <select value={questionStatus} onChange={(e) => setQuestionStatus(e.target.value)} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm">
              <option value="">كل الحالات</option>
              <option value="PUBLISHED">منشور</option>
              <option value="DRAFT">مسودة</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="p-3 font-black">السؤال</th>
                  <th className="p-3 font-black">المادة</th>
                  <th className="p-3 font-black">السنة</th>
                  <th className="p-3 font-black">الصعوبة</th>
                  <th className="p-3 font-black">الحالة</th>
                  <th className="p-3 font-black">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {(questionBank.questions || []).map((question: any) => (
                  <tr key={question.id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="p-3 max-w-[300px]">{question.text.slice(0, 90)}{question.text.length > 90 ? "..." : ""}</td>
                    <td className="p-3">{question.subject?.name || "—"}</td>
                    <td className="p-3">{question.studyYear || "—"}</td>
                    <td className="p-3">{question.difficultyLabel || question.difficulty}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-full text-[10px] font-black ${question.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{question.isPublished ? "منشور" : "مسودة"}</span></td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      <button onClick={() => handleTogglePublishQuestion(question.id)} className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-lg font-bold">{question.isPublished ? "إلغاء النشر" : "نشر"}</button>
                      <button onClick={() => handleCloneQuestion(question.id)} className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-lg font-bold">نسخ</button>
                      <button onClick={() => handleDeleteQuestion(question.id)} className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-lg font-bold">حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-slate-500">إجمالي النتائج: {questionBank.total || 0}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setQuestionPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-bold">السابق</button>
              <span className="text-sm font-bold">{questionPage} / {questionBank.totalPages || 1}</span>
              <button onClick={() => setQuestionPage((p) => Math.min(questionBank.totalPages || 1, p + 1))} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-bold">التالي</button>
            </div>
          </div>
        </div>
      )}

      {tab === "add" && (
        <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">إضافة سؤال جديد</h2>
            <button onClick={submitQuestion} className="bg-medical-600 text-white px-5 py-2.5 rounded-xl font-black">حفظ السؤال</button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="xl:col-span-2">
              <label className="text-sm font-bold mb-2 block">نص السؤال</label>
              <textarea value={questionForm.text} onChange={(e) => handleQuestionChange("text", e.target.value)} rows={4} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3" />
            </div>

            <div>
              <label className="text-sm font-bold mb-2 block">المادة</label>
              <select value={questionForm.subjectId} onChange={(e) => handleQuestionChange("subjectId", e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3">
                <option value="">اختر المادة</option>
                {(visibleQuestionSubjects || []).map((subject: any) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold mb-2 block">السنة الدراسية</label>
              <select value={questionForm.studyYear} onChange={(e) => handleQuestionChange("studyYear", e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3">
                <option value="">اختر السنة</option>
                {(yearOptions || []).map((year: string) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold mb-2 block">مستوى الصعوبة</label>
              <select value={questionForm.difficulty} onChange={(e) => handleQuestionChange("difficulty", e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3">
                {difficultyOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>

            <div className="xl:col-span-2">
              <h3 className="text-lg font-black mb-3">الاختيارات</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questionForm.options.map((option, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black">الاختيار {String.fromCharCode(65 + index)}</span>
                      <label className="inline-flex items-center gap-2 text-sm font-bold">
                        <input type="checkbox" checked={!!option.isCorrect} onChange={(e) => updateOption(index, "isCorrect", e.target.checked)} />
                        الإجابة الصحيحة
                      </label>
                    </div>
                    <input value={option.text} onChange={(e) => updateOption(index, "text", e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3" />
                  </div>
                ))}
              </div>
              <button onClick={addOption} className="mt-3 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-sm">+ إضافة خيار</button>
            </div>

            <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-bold mb-2 block">شرح الإجابة</label>
                <textarea value={questionForm.explanation} onChange={(e) => handleQuestionChange("explanation", e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3" />
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">تلميح</label>
                <input value={questionForm.hint} onChange={(e) => handleQuestionChange("hint", e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3" />
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">المرجع العلمي</label>
                <input value={questionForm.reference} onChange={(e) => handleQuestionChange("reference", e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3" />
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">الكلمات المفتاحية</label>
                <input value={questionForm.keywords} onChange={(e) => handleQuestionChange("keywords", e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3" />
              </div>
            </div>

            <div className="xl:col-span-2 flex items-center gap-4">
              <label className="inline-flex items-center gap-2 font-bold"><input type="checkbox" checked={questionForm.isPublished} onChange={(e) => handleQuestionChange("isPublished", e.target.checked)} /> منشور فوراً</label>
            </div>
          </div>
        </div>
      )}

      {tab === "exams" && (
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-5">
            <h2 className="text-2xl font-black">إنشاء اختبار جديد</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className="text-sm font-bold mb-2 block">اسم الاختبار</label><input value={examForm.title} onChange={(e) => setExamForm((prev) => ({ ...prev, title: e.target.value }))} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3" /></div>
              <div className="md:col-span-2"><label className="text-sm font-bold mb-2 block">وصف الاختبار</label><textarea value={examForm.description} onChange={(e) => setExamForm((prev) => ({ ...prev, description: e.target.value }))} rows={3} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3" /></div>
              <div><label className="text-sm font-bold mb-2 block">المادة</label><select value={examForm.subjectId} onChange={(e) => setExamForm((prev) => ({ ...prev, subjectId: e.target.value }))} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3"><option value="">اختر المادة</option>{(visibleExamSubjects || []).map((subject: any) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></div>
              <div><label className="text-sm font-bold mb-2 block">السنة الدراسية</label><select value={examForm.studyYear} onChange={(e) => setExamForm((prev) => ({ ...prev, studyYear: e.target.value }))} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3"><option value="">اختر السنة</option>{(yearOptions || []).map((year: string) => <option key={year} value={year}>{year}</option>)}</select></div>
              <div><label className="text-sm font-bold mb-2 block">مستوى الصعوبة</label><select value={examForm.difficulty} onChange={(e) => setExamForm((prev) => ({ ...prev, difficulty: e.target.value }))} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3">{difficultyOptions.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}</select></div>
              <div><label className="text-sm font-bold mb-2 block">عدد الأسئلة</label><input type="number" min={1} value={examForm.questionCount} onChange={(e) => setExamForm((prev) => ({ ...prev, questionCount: Number(e.target.value) }))} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3" /></div>
              <div><label className="text-sm font-bold mb-2 block">مدة الاختبار (دقائق)</label><input type="number" min={5} value={examForm.durationMinutes} onChange={(e) => setExamForm((prev) => ({ ...prev, durationMinutes: Number(e.target.value) }))} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3" /></div>
              <div><label className="text-sm font-bold mb-2 block">درجة النجاح (%)</label><input type="number" min={1} max={100} value={examForm.passScore} onChange={(e) => setExamForm((prev) => ({ ...prev, passScore: Number(e.target.value) }))} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3" /></div>
              <div className="flex items-center gap-3"><input type="checkbox" checked={examForm.allowRetake} onChange={(e) => setExamForm((prev) => ({ ...prev, allowRetake: e.target.checked }))} /> <span className="font-bold">السماح بإعادة الاختبار</span></div>
              <div className="flex items-center gap-3"><input type="checkbox" checked={examForm.randomizeQuestions} onChange={(e) => setExamForm((prev) => ({ ...prev, randomizeQuestions: e.target.checked }))} /> <span className="font-bold">ترتيب الأسئلة عشوائيًا</span></div>
              <div className="flex items-center gap-3"><input type="checkbox" checked={examForm.randomizeOptions} onChange={(e) => setExamForm((prev) => ({ ...prev, randomizeOptions: e.target.checked }))} /> <span className="font-bold">ترتيب الخيارات عشوائيًا</span></div>
              <div className="flex items-center gap-3"><input type="checkbox" checked={examForm.showAnswerExplanation} onChange={(e) => setExamForm((prev) => ({ ...prev, showAnswerExplanation: e.target.checked }))} /> <span className="font-bold">إظهار شرح الإجابات</span></div>
              <div className="flex items-center gap-3"><input type="checkbox" checked={examForm.isPublished} onChange={(e) => setExamForm((prev) => ({ ...prev, isPublished: e.target.checked }))} /> <span className="font-bold">نشر الاختبار فورًا</span></div>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-4">
              <h3 className="text-lg font-black mb-3">اختيار الأسئلة</h3>
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {(questionBank.questions || []).filter((q: any) => q.isPublished).map((question: any) => (
                  <label key={question.id} className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-800 p-2">
                    <input type="checkbox" checked={examForm.manualQuestionIds.includes(question.id)} onChange={() => selectManualQuestion(question.id)} />
                    <span className="text-sm leading-6">{question.text}</span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={createExam} className="w-full bg-medical-600 text-white px-5 py-3 rounded-xl font-black">إنشاء الاختبار</button>
          </div>

          <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="text-xl font-black mb-4">قائمة الاختبارات</h2>
            <div className="space-y-3">
              {(examList || []).map((exam: any) => (
                <div key={exam.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-black">{exam.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black ${exam.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{exam.isPublished ? "منشور" : "مسودة"}</span>
                  </div>
                  <p className="text-xs text-slate-500">{exam.subject?.name} • {exam.studyYear}</p>
                  <p className="text-xs text-slate-500 mt-1">{exam.questionCount || exam.questions?.length || 0} سؤال • {exam.durationMinutes} دقيقة</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button onClick={() => handleToggleExamPublish(exam.id)} className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-lg font-bold">{exam.isPublished ? "إلغاء النشر" : "نشر"}</button>
                    <button onClick={() => handleDeleteExam(exam.id)} className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-lg font-bold">حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "results" && (
        <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
          <h2 className="text-2xl font-black mb-4">نتائج الطلاب</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="p-3 font-black">الطالب</th>
                  <th className="p-3 font-black">الاختبار</th>
                  <th className="p-3 font-black">النسبة</th>
                  <th className="p-3 font-black">الإجابات الصحيحة</th>
                  <th className="p-3 font-black">الإجابات الخاطئة</th>
                  <th className="p-3 font-black">الوقت</th>
                  <th className="p-3 font-black">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {(resultsList || []).map((result: any) => (
                  <tr key={result.id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="p-3">{result.user?.name || result.user?.email || "طالب"}</td>
                    <td className="p-3">{result.exam?.title || "—"}</td>
                    <td className="p-3 font-black">{Number(result.percentage || 0).toFixed(1)}%</td>
                    <td className="p-3">{result.correctCount}</td>
                    <td className="p-3">{result.incorrectCount}</td>
                    <td className="p-3">{Math.round((result.timeSpentSeconds || 0) / 60)} دقيقة</td>
                    <td className="p-3">{new Date(result.completedAt || result.createdAt).toLocaleDateString("ar-EG")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${color} text-white mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{value}</h3>
    </div>
  );
}


