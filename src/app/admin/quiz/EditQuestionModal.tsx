"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, X, Save, Loader2, Trash2, Plus, CheckCircle2, Hash, Filter, Lightbulb } from "lucide-react";
import { getQuizQuestionById, updateQuizQuestion, getAvailableQuizSubjects } from "@/app/actions/quiz";

const difficultyOptions = [
  { value: "EASY", label: "سهل" },
  { value: "MEDIUM", label: "متوسط" },
  { value: "HARD", label: "صعب" },
];

type Props = {
  questionId: string;
  onUpdated?: () => void;
};

export default function EditQuestionModal({ questionId, onUpdated }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [yearOptions, setYearOptions] = useState<string[]>([]);

  const [form, setForm] = useState({
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
    ] as Array<{ id?: string; text: string; isCorrect: boolean }>,
  });

  const visibleSubjects = form.studyYear
    ? subjects.filter((s: any) => s.studyYear === form.studyYear)
    : subjects;

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [question, filterSubjects] = await Promise.all([
          getQuizQuestionById(questionId),
          getAvailableQuizSubjects(),
        ]);
        if (!question) { setError("السؤال غير موجود"); setLoading(false); return; }
        setSubjects(filterSubjects || []);
        const years = [...new Set((filterSubjects || []).map((s: any) => s.studyYear).filter(Boolean))];
        setYearOptions(years as string[]);
        setForm({
          text: question.text || "",
          subjectId: question.subjectId || "",
          studyYear: question.studyYear || "",
          difficulty: question.difficulty || "MEDIUM",
          explanation: question.explanation || "",
          hint: question.hint || "",
          reference: question.reference || "",
          keywords: question.keywords || "",
          isPublished: !!question.isPublished,
          options: (question.options || []).length >= 2
            ? (question.options || []).map((o: any) => ({ id: o.id, text: o.text, isCorrect: !!o.isCorrect }))
            : [
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
              ],
        });
      } catch {
        setError("حدث خطأ أثناء تحميل السؤال");
      }
      setLoading(false);
    })();
  }, [isOpen, questionId]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateOption = (index: number, field: string, value: any) => {
    setForm((prev) => {
      const options = [...prev.options];
      options[index] = { ...options[index], [field]: value };
      return { ...prev, options };
    });
  };

  const addOption = () => {
    setForm((prev) => ({ ...prev, options: [...prev.options, { text: "", isCorrect: false }] }));
  };

  const removeOption = (index: number) => {
    setForm((prev) => ({ ...prev, options: prev.options.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    if (!form.text.trim()) return setError("نص السؤال مطلوب");
    if (!form.subjectId) return setError("اختر المادة");
    if (!form.studyYear) return setError("اختر السنة الدراسية");
    const validOptions = form.options.filter((o) => o.text.trim());
    if (validOptions.length < 2) return setError("يجب إدخال خيارين على الأقل");

    setSaving(true);
    setError("");
    try {
      const result = await updateQuizQuestion(questionId, {
        text: form.text,
        subjectId: form.subjectId,
        studyYear: form.studyYear,
        difficulty: form.difficulty,
        explanation: form.explanation,
        hint: form.hint,
        reference: form.reference,
        keywords: form.keywords,
        isPublished: form.isPublished,
        options: validOptions.map((o, i) => ({ id: o.id, text: o.text, isCorrect: o.isCorrect, order: i })),
      });
      if (result?.success) {
        setIsOpen(false);
        onUpdated?.();
      }
    } catch (e: any) {
      setError(e?.message || "حدث خطأ أثناء الحفظ");
    }
    setSaving(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-200 transition-all"
        title="تعديل"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 left-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">تعديل السؤال</h2>
                <p className="text-sm text-slate-500 mt-1">حدّث بيانات السؤال وخياراته</p>
              </div>

              {loading && (
                <div className="py-16 text-center">
                  <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto" />
                  <p className="text-slate-400 font-bold mt-3">جاري تحميل السؤال...</p>
                </div>
              )}

              {error && !loading && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold mb-6 text-center">
                  {error}
                </div>
              )}

              {!loading && (
                <div className="space-y-6">
                  {/* Question Text */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Hash className="w-4 h-4 text-violet-500" />
                      <label className="text-sm font-black text-slate-700 dark:text-slate-300">نص السؤال</label>
                    </div>
                    <textarea
                      value={form.text}
                      onChange={(e) => handleChange("text", e.target.value)}
                      rows={4}
                      placeholder="اكتب نص السؤال هنا..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Options */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sky-500" />
                        <label className="text-sm font-black text-slate-700 dark:text-slate-300">الاختيارات</label>
                        <span className="text-xs text-slate-400">{form.options.filter((o) => o.text.trim()).length} / {form.options.length}</span>
                      </div>
                      <button onClick={addOption} className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                        <Plus className="w-3 h-3" /> إضافة خيار
                      </button>
                    </div>
                    <div className="space-y-2">
                      {form.options.map((option, index) => (
                        <div
                          key={index}
                          className={`rounded-xl border-2 p-3 transition-all ${
                            option.isCorrect
                              ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-600"
                              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                                option.isCorrect ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </div>
                            <input
                              value={option.text}
                              onChange={(e) => updateOption(index, "text", e.target.value)}
                              placeholder={`الاختيار ${String.fromCharCode(65 + index)}`}
                              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                            />
                            <label className="flex items-center gap-1.5 cursor-pointer select-none shrink-0">
                              <input
                                type="checkbox"
                                checked={!!option.isCorrect}
                                onChange={(e) => {
                                  const newOptions = form.options.map((o, i) => ({ ...o, isCorrect: i === index ? e.target.checked : false }));
                                  setForm((prev) => ({ ...prev, options: newOptions }));
                                }}
                                className="w-4 h-4 rounded accent-emerald-500"
                              />
                              <span className="text-[10px] font-bold text-slate-500">صحيح</span>
                            </label>
                            {form.options.length > 2 && (
                              <button onClick={() => removeOption(index)} className="text-slate-400 hover:text-rose-500 transition-colors shrink-0">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Filter className="w-4 h-4 text-amber-500" />
                      <label className="text-sm font-black text-slate-700 dark:text-slate-300">الإعدادات</label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">السنة</label>
                        <select
                          value={form.studyYear}
                          onChange={(e) => handleChange("studyYear", e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                        >
                          <option value="">اختر السنة</option>
                          {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">المادة</label>
                        <select
                          value={form.subjectId}
                          onChange={(e) => handleChange("subjectId", e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                        >
                          <option value="">اختر المادة</option>
                          {visibleSubjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">الصعوبة</label>
                        <div className="grid grid-cols-3 gap-1">
                          {difficultyOptions.map((d) => (
                            <button
                              key={d.value}
                              onClick={() => handleChange("difficulty", d.value)}
                              className={`py-2 rounded-lg text-[11px] font-bold transition-all ${
                                form.difficulty === d.value
                                  ? d.value === "EASY" ? "bg-emerald-500 text-white"
                                  : d.value === "MEDIUM" ? "bg-amber-500 text-white"
                                  : "bg-rose-500 text-white"
                                  : "bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">نشر فوراً</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.isPublished}
                          onChange={(e) => handleChange("isPublished", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Extra Info */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-sky-500" />
                      <label className="text-sm font-black text-slate-700 dark:text-slate-300">معلومات إضافية</label>
                    </div>
                    <div className="space-y-3">
                      <textarea
                        value={form.explanation}
                        onChange={(e) => handleChange("explanation", e.target.value)}
                        rows={2}
                        placeholder="شرح الإجابة الصحيحة..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all resize-none"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          value={form.hint}
                          onChange={(e) => handleChange("hint", e.target.value)}
                          placeholder="تلميح..."
                          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                        />
                        <input
                          value={form.reference}
                          onChange={(e) => handleChange("reference", e.target.value)}
                          placeholder="المرجع العلمي..."
                          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                        />
                      </div>
                      <input
                        value={form.keywords}
                        onChange={(e) => handleChange("keywords", e.target.value)}
                        placeholder="الكلمات المفتاحية (مفصولة بفواصل)..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
                    </motion.button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-8 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
