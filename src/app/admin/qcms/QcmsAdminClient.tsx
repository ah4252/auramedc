"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, BookOpen, Layers, NotebookPen, Plus, Trash2, RefreshCw, Save, 
  CheckCircle2, AlertCircle, Link as LinkIcon, ExternalLink, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  // حالة النافذة المنبثقة (Modal) لإدارة وروابط المادة
  const [modalSubjectId, setModalSubjectId] = useState<string | null>(null);
  const [pendingLinks, setPendingLinks] = useState<{ label: string; url: string }[]>([{ label: "", url: "" }]);
  const [modalStatus, setModalStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const activeYear = initialYears.find((y: any) => y.id === activeYearId) || null;
  const modalSubject = (activeYear?.subjects || []).find((subject: any) => subject.id === modalSubjectId) || null;

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
      if (modalSubjectId === id) setModalSubjectId(null);
      router.refresh();
    } else {
      setStatus({ type: "error", message: (res as any).error || "حدث خطأ" });
    }
  };

  // فتح النافذة المنبثقة لإدارة روابط مادة معينة
  const openLinksModal = (subject: any) => {
    setModalSubjectId(subject.id);
    setPendingLinks([{ label: "", url: "" }]);
    setModalStatus(null);
  };

  const closeLinksModal = () => {
    setModalSubjectId(null);
    setPendingLinks([{ label: "", url: "" }]);
    setModalStatus(null);
  };

  // إضافة صف رابط جديد فارغ (إمكانية إضافة ما لا نهاية من الروابط)
  const handleAddPendingRow = () => {
    setPendingLinks((prev) => [...prev, { label: "", url: "" }]);
  };

  // تحديث قيمة حقل في صف معين
  const handlePendingChange = (index: number, field: "label" | "url", value: string) => {
    setPendingLinks((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  // حذف صف من الروابط المعلّقة
  const handleRemovePendingRow = (index: number) => {
    setPendingLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // حفظ جميع الروابط المعلّقة دفعة واحدة
  const handleSaveAllLinks = async () => {
    if (!modalSubjectId) return;

    const prepared = pendingLinks
      .map((r) => ({
        label: r.label.trim(),
        url: r.url.trim() ? (r.url.trim().startsWith("http://") || r.url.trim().startsWith("https://") ? r.url.trim() : `https://${r.url.trim()}`) : ""
      }))
      .filter((r) => r.label && r.url);

    if (prepared.length === 0) {
      setModalStatus({ type: "error", message: "أدخل اسم ورابط صحيحين لواحد على الأقل" });
      return;
    }

    setLoading(true);
    let saved = 0;
    for (const row of prepared) {
      const res = await createQcmsExamLink(modalSubjectId, row.label, row.url);
      if ((res as any).success) saved++;
    }
    setLoading(false);

    if (saved > 0) {
      setPendingLinks([{ label: "", url: "" }]);
      setModalStatus({ type: "success", message: `✓ تم حفظ ${saved} رابط بنجاح` });
      router.refresh();
    } else {
      setModalStatus({ type: "error", message: "حدث خطأ أثناء حفظ الروابط" });
    }
  };

  const handleDeleteExamLink = async (linkId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الرابط؟")) return;

    setLoading(true);
    const res = await deleteQcmsExamLink(linkId);
    setLoading(false);

    if ((res as any).success) {
      setModalStatus({ type: "success", message: "تم حذف رابط الاختبار" });
      router.refresh();
    } else {
      setModalStatus({ type: "error", message: (res as any).error || "حدث خطأ" });
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-10" dir="rtl">
      {/* Header */}
      <div className="mb-8 rounded-[2rem] border border-violet-500/20 bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-violet-500/10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-200">QCMS</p>
            <h1 className="mt-3 text-3xl font-black text-white md:text-4xl">إدارة قسم QCMS</h1>
            <p className="mt-3 text-sm font-medium text-slate-400">إدارة السنوات الدراسية والمواد التعليمية الخاصة بالاختبارات</p>
          </div>
          <div className="rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-violet-200 flex items-center gap-2">
            <NotebookPen className="w-5 h-5 text-violet-300" />
            <span>QCM Studio</span>
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
        {/* شريط السنوات الدراسية الجانبي */}
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
                <div
                  key={year.id}
                  className={`group flex items-center justify-between rounded-2xl border p-4 transition cursor-pointer ${
                    activeYearId === year.id
                      ? "border-violet-500 bg-violet-500/15 shadow-lg shadow-violet-500/5"
                      : "border-slate-700/70 bg-slate-800/40 hover:border-violet-500/50 hover:bg-slate-800/80"
                  }`}
                  onClick={() => setActiveYearId(year.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeYearId === year.id ? "bg-violet-400 animate-pulse" : "bg-slate-600"}`} />
                    <span className="font-black text-slate-100">{year.name}</span>
                  </div>
                  <button
                    className="rounded-xl p-2 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-300"
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteYear(year.id);
                    }}
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

            <div className="mt-8 border-t border-slate-700/80 pt-6">
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

        {/* قسم المواد الدراسية */}
        <section className="lg:col-span-8">
          <div className="rounded-[2rem] border border-slate-700/50 bg-slate-900/60 p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-300">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">المواد الدراسية</h2>
                  <p className="text-xs font-bold text-slate-400">
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
                <div className="mb-8 overflow-x-auto rounded-[1.8rem] border border-slate-700/80">
                  <table className="w-full text-right border-collapse min-w-[650px]">
                    <thead className="bg-slate-800/80 border-b border-slate-700">
                      <tr>
                        <th className="p-4 text-sm font-black text-slate-300">اسم المادة</th>
                        <th className="p-4 text-sm font-black text-slate-300">الكود</th>
                        <th className="p-4 text-sm font-black text-slate-300 text-center">الترتيب</th>
                        <th className="p-4 text-sm font-black text-slate-300">روابط الامتحانات</th>
                        <th className="p-4 text-sm font-black text-slate-300 text-center">حذف</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {(activeYear.subjects || []).map((subject: any) => {
                        const linksCount = subject.examLinks?.length || 0;
                        return (
                          <tr
                            key={subject.id}
                            className="hover:bg-slate-800/40 transition group"
                          >
                            <td className="p-4">
                              <button
                                className="text-right font-black text-slate-100 transition hover:text-violet-300 flex items-center gap-2 group-hover:translate-x-1 duration-200"
                                onClick={() => openLinksModal(subject)}
                              >
                                <BookOpen className="w-4 h-4 text-violet-400 shrink-0" />
                                <span>{subject.name}</span>
                              </button>
                            </td>
                            <td className="p-4 font-bold text-slate-400">
                              <span className="rounded-lg bg-slate-800 px-2.5 py-1 font-mono text-xs text-slate-300 border border-slate-700/50">
                                {subject.code || "—"}
                              </span>
                            </td>
                            <td className="p-4 font-bold text-slate-400 text-center">
                              {subject.order ?? 0}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3 flex-wrap">
                                {/* عداد الروابط */}
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black shrink-0 ${
                                  linksCount > 0
                                    ? "bg-violet-500/20 text-violet-200 border border-violet-500/30"
                                    : "bg-slate-800 text-slate-400 border border-slate-700"
                                }`}>
                                  <LinkIcon className="w-3 h-3 text-violet-400" />
                                  {linksCount} {linksCount === 1 ? "رابط" : "روابط"}
                                </span>

                                {/* زر إظهار النافذة المنبثقة لإضافة/إدارة الروابط */}
                                <button
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-xs font-black text-violet-200 transition hover:bg-violet-500/25 hover:border-violet-400"
                                  onClick={() => openLinksModal(subject)}
                                >
                                  <Plus className="w-3.5 h-3.5 text-violet-300" />
                                  <span>إضافة / إدارة الروابط</span>
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
                        );
                      })}
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

                {/* نموذج إضافة مادة جديدة */}
                <div className="rounded-[2rem] border border-violet-500/30 bg-violet-500/5 p-6">
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

      {/* ========================================================================= */}
      {/* النافذة المنبثقة (Modal) لإدارة الروابط الخاصة بالمادة المحددة */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {modalSubjectId && modalSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
            {/* خلفية الإغلاق */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 -z-10"
              onClick={closeLinksModal}
            />

            {/* محتوى النافذة */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[2.5rem] border border-violet-500/30 bg-slate-900 shadow-2xl shadow-violet-950/50 overflow-hidden"
              dir="rtl"
            >
              {/* شريط العنوان الأعلى */}
              <div className="flex items-center justify-between border-b border-slate-800 p-6 bg-slate-950/60 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-violet-500/20 p-3 text-violet-300 border border-violet-500/30">
                    <LinkIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">إدارة روابط الاختبارات</h3>
                    <p className="text-xs font-bold text-violet-300 mt-0.5">
                      المادة: <span className="text-white font-black">{modalSubject.name}</span> ({activeYear?.name})
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeLinksModal}
                  className="rounded-2xl border border-slate-700 bg-slate-800/80 p-2.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-300 transition"
                  title="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* جسم النافذة الرئيسي (قابل للتمرير) */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {modalStatus && (
                  <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-black ${
                    modalStatus.type === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-rose-500/30 bg-rose-500/10 text-rose-200"
                  }`}>
                    {modalStatus.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{modalStatus.message}</span>
                  </div>
                )}

                {/* قائمة الروابط الحالية للمادة */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-200 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-violet-400" />
                      الروابط المحفوظة حالياً
                    </h4>
                    <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[11px] font-black text-violet-300 border border-violet-500/30">
                      {modalSubject.examLinks?.length || 0} رابط
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-48 overflow-y-auto pl-1">
                    {(modalSubject.examLinks || []).map((link: any) => (
                      <div key={link.id} className="flex items-center justify-between rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 transition hover:bg-violet-500/10">
                        <div className="min-w-0 flex-1 ml-3">
                          <div className="truncate text-sm font-black text-violet-200">{link.label}</div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-0.5 inline-flex items-center gap-1 truncate text-xs font-bold text-slate-400 hover:text-white transition"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{link.url}</span>
                          </a>
                        </div>
                        <button
                          className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/15 hover:text-rose-300 transition shrink-0"
                          onClick={() => handleDeleteExamLink(link.id)}
                          title="حذف الرابط"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {(!modalSubject.examLinks || modalSubject.examLinks.length === 0) && (
                      <div className="rounded-xl border border-dashed border-slate-700/80 p-4 text-center text-xs font-bold text-slate-500">
                        لا توجد روابط امتحانات مضافة لهذه المادة بعد.
                      </div>
                    )}
                  </div>
                </div>

                {/* قسم إضافة روابط جديدة (إمكانية إضافة ما لا نهاية من الروابط) */}
                <div className="rounded-2xl border border-violet-500/30 bg-slate-950/80 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-violet-400" />
                      <h4 className="text-sm font-black text-white">إضافة روابط جديدة</h4>
                    </div>
                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-black text-slate-300">
                      {pendingLinks.length} {pendingLinks.length === 1 ? "رابط مجهز" : "روابط مجهزة"}
                    </span>
                  </div>

                  {/* صفوف الروابط */}
                  <div className="space-y-3">
                    {pendingLinks.map((row, idx) => (
                      <div key={idx} className="group relative flex items-start gap-2 rounded-xl border border-slate-700/80 bg-slate-900/90 p-3 shadow-inner">
                        <span className="mt-2.5 min-w-[1.5rem] text-center text-xs font-black text-violet-400 bg-violet-500/10 rounded-md py-1">
                          {idx + 1}
                        </span>
                        <div className="flex flex-1 flex-col gap-2">
                          <input
                            className="admin-input"
                            placeholder="عنوان / اسم الرابط (مثال: Controle S1 2024)"
                            value={row.label}
                            onChange={(e) => handlePendingChange(idx, "label", e.target.value)}
                          />
                          <input
                            className="admin-input"
                            dir="ltr"
                            placeholder="https://drive.google.com/..."
                            value={row.url}
                            onChange={(e) => handlePendingChange(idx, "url", e.target.value)}
                          />
                        </div>
                        {pendingLinks.length > 1 && (
                          <button
                            className="mt-2 rounded-lg p-2 text-slate-500 transition hover:bg-rose-500/15 hover:text-rose-400 shrink-0"
                            onClick={() => handleRemovePendingRow(idx)}
                            title="حذف هذا الصف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* زر إضافة صف جديد (إضافة مالا نهاية من الروابط) */}
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-violet-500/50 py-3 text-xs font-black text-violet-300 transition hover:border-violet-400 hover:bg-violet-500/15"
                    onClick={handleAddPendingRow}
                  >
                    <Plus className="w-4 h-4" />
                    إضافة رابط آخر
                  </button>
                </div>
              </div>

              {/* أزرار الحفظ والإغلاق التذييل */}
              <div className="flex items-center justify-between border-t border-slate-800 p-4 bg-slate-950/80 shrink-0 gap-3">
                <button
                  type="button"
                  className="rounded-2xl border border-slate-700 px-5 py-2.5 text-xs font-black text-slate-300 hover:bg-slate-800 transition"
                  onClick={closeLinksModal}
                >
                  إلغاء
                </button>

                <button
                  type="button"
                  disabled={loading || pendingLinks.every((r) => !r.label.trim() || !r.url.trim())}
                  onClick={handleSaveAllLinks}
                  className="flex items-center gap-2 rounded-2xl bg-violet-600 px-6 py-2.5 text-xs font-black text-white transition hover:bg-violet-500 disabled:opacity-50 shadow-lg shadow-violet-600/30"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>
                    حفظ {pendingLinks.filter((r) => r.label.trim() && r.url.trim()).length > 0
                      ? `${pendingLinks.filter((r) => r.label.trim() && r.url.trim()).length} رابط`
                      : "الروابط"}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
