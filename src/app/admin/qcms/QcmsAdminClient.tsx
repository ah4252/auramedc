"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, BookOpen, Layers, NotebookPen, Plus, Trash2, RefreshCw, Save, CheckCircle2, AlertCircle, Link as LinkIcon, ClipboardList } from "lucide-react";
import { createQcmsYear, deleteQcmsYear, createQcmsSubject, deleteQcmsSubject, createQcmsExamLink, deleteQcmsExamLink } from "@/app/actions/qcmsAdmin";

export default function QcmsAdminClient({ initialYears = [] }: { initialYears?: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [newYearName, setNewYearName] = useState("");
  const [newYearSlug, setNewYearSlug] = useState("");

  const [activeYearId, setActiveYearId] = useState<string | null>(initialYears[0]?.id || null);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [newSubjectOrder, setNewSubjectOrder] = useState<number>(0);

  const [newExamLinkSubjectId, setNewExamLinkSubjectId] = useState<string | null>(null);
  // قائمة الروابط المعلّقة (قبل الحفظ)
  const [pendingLinks, setPendingLinks] = useState<{ label: string; url: string }[]>([{ label: "", url: "" }]);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const activeYear = initialYears.find((y: any) => y.id === activeYearId) || null;
  const selectedSubject = (activeYear?.subjects || []).find((subject: any) => subject.id === selectedSubjectId) || null;

  const handleAddYear = async () => {
    if (!newYearName.trim() || !newYearSlug.trim()) {
      setStatus({ type: "error", message: "أدخل اسم السنة ورابطها" });
      return;
    }

    setLoading(true);
    const res = await createQcmsYear(newYearName.trim(), newYearSlug.trim());
    setLoading(false);

    if ((res as any).success) {
      setNewYearName("");
      setNewYearSlug("");
      setStatus({ type: "success", message: "تمت إضافة السنة الدراسية" });
      router.refresh();
    } else {
      setStatus({ type: "error", message: (res as any).error || "حدث خطأ" });
    }
  };

  const handleDeleteYear = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف السنة وجميع موادها؟")) return;

    setLoading(true);
    const res = await deleteQcmsYear(id);
    setLoading(false);

    if ((res as any).success) {
      setStatus({ type: "success", message: "تم حذف السنة الدراسية" });
      if (activeYearId === id) setActiveYearId(null);
      router.refresh();
    } else {
      setStatus({ type: "error", message: (res as any).error || "حدث خطأ" });
    }
  };

  const handleAddSubject = async () => {
    if (!activeYearId) {
      setStatus({ type: "error", message: "اختر سنة أولاً" });
      return;
    }

    if (!newSubjectName.trim()) {
      setStatus({ type: "error", message: "اسم المادة مطلوب" });
      return;
    }

    setLoading(true);
    const res = await createQcmsSubject(activeYearId, newSubjectName.trim(), newSubjectCode.trim(), newSubjectOrder);
    setLoading(false);

    if ((res as any).success) {
      setNewSubjectName("");
      setNewSubjectCode("");
      setNewSubjectOrder(0);
      setStatus({ type: "success", message: "تمت إضافة المادة الدراسية" });
      router.refresh();
    } else {
      setStatus({ type: "error", message: (res as any).error || "حدث خطأ" });
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المادة؟")) return;

    setLoading(true);
    const res = await deleteQcmsSubject(id);
    setLoading(false);

    if ((res as any).success) {
      setStatus({ type: "success", message: "تم حذف المادة الدراسية" });
      router.refresh();
    } else {
      setStatus({ type: "error", message: (res as any).error || "حدث خطأ" });
    }
  };

  // إضافة صف رابط جديد فارغ
  const handleAddPendingRow = () => {
    setPendingLinks((prev) => [...prev, { label: "", url: "" }]);
  };

  // تحديث قيمة حقل في صف معيّن
  const handlePendingChange = (index: number, field: "label" | "url", value: string) => {
    setPendingLinks((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  // حذف صف من القائمة
  const handleRemovePendingRow = (index: number) => {
    setPendingLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // حفظ كل الروابط المعلّقة دفعةً واحدة
  const handleSaveAllLinks = async () => {
    if (!newExamLinkSubjectId) {
      setStatus({ type: "error", message: "اختر مادة أولاً" });
      return;
    }

    const valid = pendingLinks.filter((r) => r.label.trim() && r.url.trim() && /^https?:\/\//i.test(r.url.trim()));
    if (valid.length === 0) {
      setStatus({ type: "error", message: "أدخل رابطاً واحداً صحيحاً على الأقل يبدأ بـ http أو https" });
      return;
    }

    setLoading(true);
    let saved = 0;
    for (const row of valid) {
      const res = await createQcmsExamLink(newExamLinkSubjectId, row.label.trim(), row.url.trim());
      if ((res as any).success) saved++;
    }
    setLoading(false);

    if (saved > 0) {
      setPendingLinks([{ label: "", url: "" }]);
      setNewExamLinkSubjectId(null);
      setStatus({ type: "success", message: `✓ تم حفظ ${saved} رابط بنجاح` });
      router.refresh();
    } else {
      setStatus({ type: "error", message: "حدث خطأ أثناء الحفظ" });
    }
  };

  const handleDeleteExamLink = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الرابط؟")) return;

    setLoading(true);
    const res = await deleteQcmsExamLink(id);
    setLoading(false);

    if ((res as any).success) {
      setStatus({ type: "success", message: "تم حذف رابط الاختبار" });
      router.refresh();
    } else {
      setStatus({ type: "error", message: (res as any).error || "حدث خطأ" });
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-10" dir="rtl">
      <div className="mb-8 rounded-[2rem] border border-violet-500/20 bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-violet-500/10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-200">QCMS</p>
            <h1 className="mt-3 text-3xl font-black text-white md:text-4xl">إدارة قسم QCMS</h1>
            <p className="mt-3 text-sm font-medium text-slate-400">إدارة السنوات الدراسية والمواد التعليمية الخاصة بالاختبارات</p>
          </div>
          <div className="rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-violet-200">
            <NotebookPen className="w-5 h-5 inline-block ml-2" />
            QCM Studio
          </div>
        </div>
      </div>

      {status && (
        <div className={`mb-6 flex items-center gap-3 rounded-2xl border px-5 py-4 ${status.type === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-rose-500/30 bg-rose-500/10 text-rose-200"}`}>
          {status.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-black text-sm">{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <section className="rounded-[2rem] border border-slate-700/50 bg-slate-900/60 p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-300">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">السنوات الدراسية</h2>
                  <p className="text-xs font-bold text-slate-500">لوحة تنظيمية</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {initialYears.map((year: any) => (
                <div key={year.id} className="group flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/50 p-4 transition hover:border-violet-500 hover:bg-violet-500/10">
                  <button
                    className="flex-1 text-right font-black text-slate-100"
                    onClick={() => setActiveYearId(year.id)}
                  >
                    {year.name}
                  </button>
                  <button
                    className="rounded-xl p-2 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-300"
                    disabled={loading}
                    onClick={() => handleDeleteYear(year.id)}
                    aria-label="حذف السنة"
                    title="حذف السنة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {initialYears.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-600 p-6 text-center text-sm font-bold text-slate-500">
                  لا توجد سنوات مضافة
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-slate-700 pt-6">
              <h3 className="mb-4 text-sm font-black text-slate-300">إضافة سنة دراسية جديدة</h3>
              <div className="space-y-3">
                <input
                  value={newYearName}
                  onChange={(e) => setNewYearName(e.target.value)}
                  className="admin-input"
                  placeholder="اسم السنة الدراسية"
                />
                <input
                  value={newYearSlug}
                  onChange={(e) => setNewYearSlug(e.target.value)}
                  className="admin-input"
                  dir="ltr"
                  placeholder="slug-year"
                />
                <button
                  disabled={loading || !newYearName.trim() || !newYearSlug.trim()}
                  onClick={handleAddYear}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 font-black text-white transition hover:bg-violet-500 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  إضافة السنة
                </button>
              </div>
            </div>
          </section>
        </aside>

        <section className="lg:col-span-8">
          <div className="rounded-[2rem] border border-slate-700/50 bg-slate-900/60 p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-300">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">المواد الدراسية</h2>
                  <p className="text-xs font-bold text-slate-500">
                    {activeYear ? `السنة الحالية: ${activeYear.name}` : "اختر سنة لمعرفة المواد"}
                  </p>
                </div>
              </div>
              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-black text-emerald-200">
                {activeYear?.subjects?.length || 0} مادة
              </div>
            </div>

            {activeYear ? (
              <>
                <div className="mb-8 overflow-hidden rounded-[1.8rem] border border-slate-700">
                  <table className="w-full text-right">
                    <thead className="bg-slate-800/60">
                      <tr>
                        <th className="p-4 text-sm font-black text-slate-300">اسم المادة</th>
                        <th className="p-4 text-sm font-black text-slate-300">الكود</th>
                        <th className="p-4 text-sm font-black text-slate-300">الترتيب</th>
                        <th className="p-4 text-sm font-black text-slate-300">روابط الامتحانات</th>
                        <th className="p-4 text-sm font-black text-slate-300 text-center">حذف</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activeYear.subjects || []).map((subject: any) => (
                        <tr key={subject.id} className={`border-t border-slate-800 hover:bg-slate-800/40 align-top ${selectedSubjectId === subject.id ? "bg-violet-500/10" : ""}`}>
                          <td className="p-4 font-black text-slate-100">
                            <button
                              className="text-right font-black text-slate-100 transition hover:text-violet-300"
                              onClick={() => {
                                setSelectedSubjectId(subject.id);
                                setNewExamLinkSubjectId(subject.id);
                                setNewExamLinkLabel("");
                                setNewExamLinkUrl("");
                                setTimeout(() => {
                                  document.getElementById("exam-link-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
                                }, 100);
                              }}
                            >
                              {subject.name}
                            </button>
                          </td>
                          <td className="p-4 font-bold text-slate-400">{subject.code || "—"}</td>
                          <td className="p-4 font-bold text-slate-400">{subject.order ?? 0}</td>
                          <td className="p-4">
                            <div className="space-y-2">
                              {(subject.examLinks || []).map((link: any) => (
                                <div key={link.id} className="flex items-center justify-between gap-2 rounded-xl border border-violet-500/20 bg-violet-500/5 px-3 py-2">
                                  <div className="min-w-0 flex-1">
                                    <a href={link.url} target="_blank" rel="noreferrer" className="block truncate text-sm font-black text-violet-200 hover:text-white">
                                      {link.label}
                                    </a>
                                    <span className="block truncate text-[10px] font-bold text-slate-500">{link.url}</span>
                                  </div>
                                  <button
                                    className="rounded-lg p-1 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                                    onClick={() => handleDeleteExamLink(link.id)}
                                    disabled={loading}
                                    title="حذف الرابط"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}

                              {(!subject.examLinks || subject.examLinks.length === 0) && (
                                <span className="text-xs font-bold text-slate-500">لا توجد روابط</span>
                              )}

                              <button
                                className="mt-2 inline-flex items-center gap-2 rounded-xl border border-violet-500/40 px-3 py-2 text-[11px] font-black text-violet-200 transition hover:bg-violet-500/15"
                                onClick={() => {
                                  setSelectedSubjectId(subject.id);
                                  setNewExamLinkSubjectId(subject.id);
                                  setNewExamLinkLabel("");
                                  setNewExamLinkUrl("");
                                  setTimeout(() => {
                                    document.getElementById("exam-link-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
                                  }, 100);
                                }}
                              >
                                <Plus className="w-3.5 h-3.5" />
                                إضافة رابط
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              className="rounded-xl p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
                              disabled={loading}
                              onClick={() => handleDeleteSubject(subject.id)}
                              title="حذف المادة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(!activeYear.subjects || activeYear.subjects.length === 0) && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">
                            لا توجد مواد مضافة لهذه السنة
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {selectedSubject && (
                  <section id="exam-link-section" className="mt-6 rounded-[2rem] border border-violet-500/30 bg-slate-950 p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <NotebookPen className="w-6 h-6 text-violet-300" />
                          <h3 className="text-2xl font-black text-white">صفحة المادة: {selectedSubject.name}</h3>
                        </div>
                        <p className="mt-2 text-sm font-bold text-slate-500">إدارة الروابط</p>
                      </div>
                    </div>

                    <div className="rounded-[1.8rem] border border-slate-700/70 p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-violet-300" />
                        <h4 className="text-lg font-black text-white">روابط الامتحانات</h4>
                      </div>
                      <div className="space-y-3">
                        {(selectedSubject.examLinks || []).map((link: any) => (
                          <div key={link.id} className="flex items-center justify-between rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3">
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-black text-violet-200">{link.label}</div>
                              <a href={link.url} target="_blank" rel="noreferrer" className="mt-1 block truncate text-[11px] font-bold text-slate-400 hover:text-white">
                                {link.url}
                              </a>
                            </div>
                            <button
                              className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"
                              onClick={() => handleDeleteExamLink(link.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {(!selectedSubject.examLinks || selectedSubject.examLinks.length === 0) && (
                          <div className="rounded-xl border border-dashed border-slate-600 p-5 text-center text-sm font-bold text-slate-500">
                            لا توجد روابط امتحانات لهذه المادة
                          </div>
                        )}

                        {newExamLinkSubjectId === selectedSubject.id && (
                          <div className="rounded-xl border border-violet-500/45 bg-slate-900 p-4">
                            {/* رأس النموذج */}
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-violet-200">إضافة روابط</span>
                                <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-black text-violet-300">
                                  {pendingLinks.length} {pendingLinks.length === 1 ? "رابط" : "روابط"}
                                </span>
                              </div>
                              <button
                                className="rounded-full border border-slate-600 px-3 py-1 text-[10px] font-black text-slate-300 hover:bg-slate-700"
                                onClick={() => {
                                  setNewExamLinkSubjectId(null);
                                  setPendingLinks([{ label: "", url: "" }]);
                                }}
                              >
                                إلغاء
                              </button>
                            </div>

                            {/* صفوف الروابط */}
                            <div className="space-y-3">
                              {pendingLinks.map((row, idx) => (
                                <div key={idx} className="group relative flex items-start gap-2 rounded-xl border border-slate-700/60 bg-slate-800/50 p-3">
                                  <span className="mt-2.5 min-w-[1.25rem] text-center text-[11px] font-black text-slate-500">{idx + 1}</span>
                                  <div className="flex flex-1 flex-col gap-2">
                                    <input
                                      className="admin-input"
                                      placeholder="اسم الرابط"
                                      value={row.label}
                                      onChange={(e) => handlePendingChange(idx, "label", e.target.value)}
                                    />
                                    <input
                                      className="admin-input"
                                      dir="ltr"
                                      placeholder="https://exam.example.com"
                                      value={row.url}
                                      onChange={(e) => handlePendingChange(idx, "url", e.target.value)}
                                    />
                                  </div>
                                  {pendingLinks.length > 1 && (
                                    <button
                                      className="mt-2 rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
                                      onClick={() => handleRemovePendingRow(idx)}
                                      title="حذف هذا الصف"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* زر إضافة صف جديد */}
                            <button
                              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-violet-500/40 py-2.5 text-sm font-black text-violet-300 transition hover:border-violet-400 hover:bg-violet-500/10"
                              onClick={handleAddPendingRow}
                            >
                              <Plus className="w-4 h-4" />
                              إضافة رابط آخر
                            </button>

                            {/* زر الحفظ الكلي */}
                            <button
                              disabled={loading || pendingLinks.every((r) => !r.label.trim() || !r.url.trim())}
                              onClick={handleSaveAllLinks}
                              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 font-black text-white transition hover:bg-violet-500 disabled:opacity-50"
                            >
                              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              حفظ {pendingLinks.filter((r) => r.label.trim() && r.url.trim()).length > 0
                                ? `${pendingLinks.filter((r) => r.label.trim() && r.url.trim()).length} رابط`
                                : "الروابط"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                <div className="rounded-[2rem] border border-violet-500/30 bg-violet-500/5 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-violet-500/10 p-2 text-violet-200">
                      <Plus className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black text-white">إضافة مادة دراسية</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <input
                      className="admin-input md:col-span-2"
                      placeholder="اسم المادة"
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                    />
                    <input
                      className="admin-input"
                      placeholder="كود المادة"
                      value={newSubjectCode}
                      onChange={(e) => setNewSubjectCode(e.target.value)}
                    />
                    <input
                      type="number"
                      min={0}
                      className="admin-input"
                      placeholder="الترتيب"
                      value={newSubjectOrder}
                      onChange={(e) => setNewSubjectOrder(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      disabled={loading || !newSubjectName.trim()}
                      onClick={handleAddSubject}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-black text-white transition hover:bg-emerald-500 disabled:opacity-50"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      حفظ المادة
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-slate-600 p-12 text-center">
                <Layers className="mx-auto mb-4 w-14 h-14 text-slate-500" />
                <h3 className="text-xl font-black text-slate-300">اختر أو أضف سنة دراسية</h3>
                <p className="mt-3 text-sm font-medium text-slate-500">بعد ذلك سيتم تفعيل شاشة إدراج المواد الخاصة بهذه السنة</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
