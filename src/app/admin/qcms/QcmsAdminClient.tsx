"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Calendar, BookOpen, Layers, NotebookPen, Plus, Trash2, RefreshCw, Save, 
  CheckCircle2, AlertCircle, Link as LinkIcon, ExternalLink, X, TrendingUp, Star, Pencil
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  createQcmsYear, deleteQcmsYear, 
  createQcmsSubject, deleteQcmsSubject, 
  createQcmsExamLink, deleteQcmsExamLink, updateQcmsExamLink
} from "@/app/actions/qcmsAdmin";

export default function QcmsAdminClient({ initialYears = [] }: { initialYears?: any[] }) {
  const router = useRouter();
  const [years, setYears] = useState<any[]>(initialYears);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // تحديث الحالة عند وصول بيانات جديدة من السيرفر
  useEffect(() => {
    setYears(initialYears);
  }, [initialYears]);

  const [newYearName, setNewYearName] = useState("");
  const [newYearSlug, setNewYearSlug] = useState("");

  const [activeYearId, setActiveYearId] = useState<string | null>(initialYears[0]?.id || null);

  // تعيين السنة النشطة افتراضياً في حال عدم اختيار أي سنة
  useEffect(() => {
    if (!activeYearId && years.length > 0) {
      setActiveYearId(years[0].id);
    }
  }, [years, activeYearId]);

  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [newSubjectOrder, setNewSubjectOrder] = useState<number>(0);

  // حالة النافذة المنبثقة (Modal) لإدارة وروابط المادة
  const [modalSubjectId, setModalSubjectId] = useState<string | null>(null);
  const [pendingLinks, setPendingLinks] = useState<{ label: string; url: string }[]>([{ label: "", url: "" }]);
  const [modalStatus, setModalStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editingLinkValues, setEditingLinkValues] = useState<{ label: string; url: string }>({ label: "", url: "" });

  const activeYear = years.find((y: any) => y.id === activeYearId) || null;
  const modalSubject = years.flatMap((y: any) => y.subjects || []).find((s: any) => s.id === modalSubjectId) || null;

  // إضافة سنة دراسية
  const handleAddYear = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newYearName.trim() || !newYearSlug.trim()) {
      setStatus({ type: "error", message: "أدخل اسم السنة ورابطها (Slug)" });
      return;
    }

    setLoading(true);
    const res = await createQcmsYear(newYearName.trim(), newYearSlug.trim());
    setLoading(false);

    if ((res as any).success) {
      setNewYearName("");
      setNewYearSlug("");
      setStatus({ type: "success", message: "تمت إضافة السنة الدراسية بنجاح" });
      router.refresh();
    } else {
      setStatus({ type: "error", message: (res as any).error || "حدث خطأ أثناء إضافة السنة" });
    }
  };

  // حذف سنة دراسية
  const handleDeleteYear = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف السنة وجميع موادها؟")) return;

    setLoading(true);
    const res = await deleteQcmsYear(id);
    setLoading(false);

    if ((res as any).success) {
      setStatus({ type: "success", message: "تم حذف السنة الدراسية" });
      if (activeYearId === id) setActiveYearId(null);
      setYears((prev) => prev.filter((y) => y.id !== id));
      router.refresh();
    } else {
      setStatus({ type: "error", message: (res as any).error || "حدث خطأ أثناء الحذف" });
    }
  };

  // إضافة مادة دراسية
  const handleAddSubject = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeYearId) {
      setStatus({ type: "error", message: "اختر سنة دراسية أولاً" });
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
      setStatus({ type: "success", message: "تمت إضافة المادة الدراسية بنجاح" });
      router.refresh();
    } else {
      setStatus({ type: "error", message: (res as any).error || "حدث خطأ أثناء إدراج المادة" });
    }
  };

  // حذف مادة دراسية
  const handleDeleteSubject = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المادة؟")) return;

    setLoading(true);
    const res = await deleteQcmsSubject(id);
    setLoading(false);

    if ((res as any).success) {
      setStatus({ type: "success", message: "تم حذف المادة الدراسية" });
      if (modalSubjectId === id) setModalSubjectId(null);
      setYears((prevYears) =>
        prevYears.map((year) => ({
          ...year,
          subjects: (year.subjects || []).filter((s: any) => s.id !== id)
        }))
      );
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

  // إغلاق النافذة المنبثقة
  const closeLinksModal = () => {
    setModalSubjectId(null);
    setPendingLinks([{ label: "", url: "" }]);
    setModalStatus(null);
    setEditingLinkId(null);
    setEditingLinkValues({ label: "", url: "" });
  };

  // إضافة صف رابط جديد فارغ (إمكانية إضافة مالا نهاية من الروابط)
  const handleAddPendingRow = () => {
    setPendingLinks((prev) => [...prev, { label: "", url: "" }]);
  };

  // تحديث قيمة حقل في صف معين
  const handlePendingChange = (index: number, field: "label" | "url", value: string) => {
    setPendingLinks((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  // حذف صف من الروابط المعلّقة
  const handleRemovePendingRow = (index: number) => {
    setPendingLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const normalizeDrivePreviewUrl = (rawUrl: string) => {
    const trimmed = rawUrl.trim();
    if (!trimmed) return "";

    if (trimmed.includes("drive.google.com")) {
      const directFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^\/\?]+)/i);
      if (directFileMatch?.[1]) {
        return `https://drive.google.com/file/d/${directFileMatch[1]}/preview`;
      }

      const idMatch = trimmed.match(/[?&]id=([^&]+)/i);
      if (idMatch?.[1]) {
        return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
      }
    }

    return trimmed;
  };

  const inferLinkLabel = (rawUrl: string, fallbackLabel?: string) => {
    const trimmedFallback = (fallbackLabel || "").trim();
    if (trimmedFallback) return trimmedFallback;

    const cleanUrl = rawUrl.trim();
    if (!cleanUrl) return "Exam link";

    try {
      const parsed = new URL(cleanUrl);
      if (parsed.hostname.includes("drive.google.com")) {
        return "Google Drive File";
      }
      return parsed.hostname.replace(/^www\./i, "");
    } catch {
      return "Exam link";
    }
  };

  // حفظ جميع الروابط المعلّقة دفعة واحدة مع تحديث فوري للحالة
  const handleSaveAllLinks = async () => {
    if (!modalSubjectId) return;

    const prepared = pendingLinks
      .map((r) => {
        const rawUrl = r.url.trim();
        let formattedUrl = rawUrl;
        if (rawUrl && !/^https?:\/\//i.test(rawUrl)) {
          formattedUrl = `https://${rawUrl}`;
        }
        const finalUrl = normalizeDrivePreviewUrl(formattedUrl);
        return {
          label: inferLinkLabel(finalUrl, r.label),
          url: finalUrl
        };
      })
      .filter((r) => r.label && r.url);

    if (prepared.length === 0) {
      setModalStatus({ type: "error", message: "يرجى كتابة عنوان ورابط صحيح لواحد على الأقل" });
      return;
    }

    setLoading(true);
    let savedCount = 0;
    const newSavedLinks: any[] = [];

    for (const row of prepared) {
      const res = await createQcmsExamLink(modalSubjectId, row.label, row.url);
      if ((res as any).success) {
        savedCount++;
        newSavedLinks.push({
          id: (res as any).id || `temp-${Date.now()}-${Math.random()}`,
          label: row.label,
          url: row.url,
          qcmsSubjectId: modalSubjectId
        });
      }
    }
    setLoading(false);

    if (savedCount > 0) {
      // تحديث الحالة المحلية فوراً حتى تظهر الروابط في الواجهة دون انتظر
      setYears((prevYears) =>
        prevYears.map((year) => ({
          ...year,
          subjects: (year.subjects || []).map((subj: any) => {
            if (subj.id === modalSubjectId) {
              return {
                ...subj,
                examLinks: [...(subj.examLinks || []), ...newSavedLinks]
              };
            }
            return subj;
          })
        }))
      );

      setPendingLinks([{ label: "", url: "" }]);
      setModalStatus({ type: "success", message: `✓ تم حفظ ${savedCount} رابط بنجاح!` });
      router.refresh();
    } else {
      setModalStatus({ type: "error", message: "حدث خطأ أثناء ترحيل الروابط" });
    }
  };


  const handleUpdateExamLink = async () => {
    if (!editingLinkId) return;

    const trimmedLabel = editingLinkValues.label.trim();
    const trimmedUrl = editingLinkValues.url.trim();

    if (!trimmedLabel || !trimmedUrl) {
      setModalStatus({ type: "error", message: "اسم الرابط ورابطه مطلوبان" });
      return;
    }

    setLoading(true);
    const res = await updateQcmsExamLink(editingLinkId, trimmedLabel, trimmedUrl);
    setLoading(false);

    if ((res as any).success) {
      setYears((prevYears) =>
        prevYears.map((year) => ({
          ...year,
          subjects: (year.subjects || []).map((subj: any) => ({
            ...subj,
            examLinks: (subj.examLinks || []).map((l: any) =>
              l.id === editingLinkId ? { ...l, label: trimmedLabel, url: trimmedUrl } : l
            )
          }))
        }))
      );
      setEditingLinkId(null);
      setEditingLinkValues({ label: "", url: "" });
      setModalStatus({ type: "success", message: "تم تحديث اسم الرابط وعنوانه بنجاح" });
      router.refresh();
    } else {
      setModalStatus({ type: "error", message: (res as any).error || "حدث خطأ أثناء التحديث" });
    }
  };

  // حذف رابط امتحان
  const handleDeleteExamLink = async (linkId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الرابط؟")) return;

    setLoading(true);
    const res = await deleteQcmsExamLink(linkId);
    setLoading(false);

    if ((res as any).success) {
      // تحديث فوري للحالة المحلية
      setYears((prevYears) =>
        prevYears.map((year) => ({
          ...year,
          subjects: (year.subjects || []).map((subj: any) => {
            if (subj.id === modalSubjectId) {
              return {
                ...subj,
                examLinks: (subj.examLinks || []).filter((l: any) => l.id !== linkId)
              };
            }
            return subj;
          })
        }))
      );

      if (editingLinkId === linkId) {
        setEditingLinkId(null);
        setEditingLinkValues({ label: "", url: "" });
      }

      setModalStatus({ type: "success", message: "تم حذف رابط الاختبار" });
      router.refresh();
    } else {
      setModalStatus({ type: "error", message: (res as any).error || "حدث خطأ عند الحذف" });
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
          <div className="flex flex-col gap-2 sm:flex-row items-center">
            <Link
              href="/admin/qcms/stats"
              className="rounded-full border border-cyan-400/25 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-200 flex items-center gap-2 transition-all"
            >
              <TrendingUp className="w-4 h-4 text-cyan-300" />
              <span>الإحصائيات</span>
            </Link>
            <div className="rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-violet-200 flex items-center gap-2">
              <NotebookPen className="w-5 h-5 text-violet-300" />
              <span>QCM Studio</span>
            </div>
          </div>
        </div>
      </div>

      {status && (
        <div className={`mb-6 flex items-center gap-3 rounded-2xl border px-5 py-4 ${status.type === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-rose-500/30 bg-rose-500/10 text-rose-200"}`}>
          {status.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
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
              {years.map((year: any) => (
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
                    type="button"
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

              {years.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-600 p-6 text-center text-sm font-bold text-slate-500">
                  لا توجد سنوات مضافة
                </div>
              )}
            </div>

            <form onSubmit={handleAddYear} className="mt-8 border-t border-slate-700/80 pt-6">
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
                  type="submit"
                  disabled={loading || !newYearName.trim() || !newYearSlug.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 font-black text-white transition hover:bg-violet-500 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  إضافة السنة
                </button>
              </div>
            </form>
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
                  <table className="w-full text-right border-collapse min-w-[850px]">
                    <thead className="bg-slate-800/80 border-b border-slate-700 sticky top-0">
                      <tr>
                        <th className="p-5 text-sm font-black text-slate-300 text-right">اسم المادة</th>
                        <th className="p-5 text-sm font-black text-slate-300 text-center min-w-[100px]">الكود</th>
                        <th className="p-5 text-sm font-black text-slate-300 text-center min-w-[80px]">الترتيب</th>
                        <th className="p-5 text-sm font-black text-slate-300 text-center min-w-[140px]">الامتحانات</th>
                        <th className="p-5 text-sm font-black text-slate-300 text-center min-w-[120px]">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {(activeYear.subjects || []).map((subject: any) => {
                        const linksCount = subject.examLinks?.length || 0;
                        return (
                          <tr
                            key={subject.id}
                            className="hover:bg-slate-800/60 transition group"
                          >
                            <td className="p-5 text-right">
                              <button 
                                onClick={() => openLinksModal(subject)}
                                className="text-left font-black text-slate-100 transition group-hover:text-violet-300 hover:text-violet-300 flex items-center gap-2 cursor-pointer hover:underline"
                              >
                                <BookOpen className="w-4 h-4 text-violet-400 shrink-0" />
                                <span className="truncate">{subject.name}</span>
                              </button>
                            </td>
                            <td className="p-5 font-bold text-slate-400 text-center">
                              <span className="rounded-lg bg-slate-800 px-3 py-1.5 font-mono text-xs text-slate-300 border border-slate-700/50 inline-block">
                                {subject.code || "—"}
                              </span>
                            </td>
                            <td className="p-5 font-bold text-slate-400 text-center">
                              <span className="inline-block bg-slate-800/50 px-3 py-1.5 rounded-lg text-sm font-black text-slate-200">{subject.order ?? 0}</span>
                            </td>
                            <td className="p-5 text-center">
                              <div className="flex items-center gap-2 justify-center flex-wrap">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-black whitespace-nowrap ${
                                  linksCount > 0
                                    ? "bg-violet-500/20 text-violet-200 border border-violet-500/30"
                                    : "bg-slate-800 text-slate-400 border border-slate-700"
                                }`}>
                                  <LinkIcon className="w-3 h-3 text-violet-400" />
                                  {linksCount}
                                </span>

                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1 rounded-xl border border-violet-500/40 bg-violet-500/10 px-2 py-1.5 text-xs font-black text-violet-200 transition hover:bg-violet-500/30 hover:border-violet-400 hover:text-violet-100 whitespace-nowrap"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openLinksModal(subject);
                                  }}
                                  title="إضافة أو تعديل روابط الامتحانات"
                                >
                                  <Plus className="w-3.5 h-3.5 text-violet-300 shrink-0" />
                                  <span className="hidden sm:inline">إضافة</span>
                                </button>
                              </div>
                            </td>
                            <td className="p-5 text-center">
                              <button
                                type="button"
                                className="rounded-xl p-3 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition inline-flex items-center justify-center border border-slate-700 hover:border-rose-500/50"
                                disabled={loading}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSubject(subject.id);
                                }}
                                title="حذف هذه المادة"
                              >
                                <Trash2 className="w-5 h-5" />
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
                <form onSubmit={handleAddSubject} className="rounded-[2rem] border border-violet-500/30 bg-violet-500/5 p-6">
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
                      type="submit"
                      disabled={loading || !newSubjectName.trim()}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-black text-white transition hover:bg-emerald-500 disabled:opacity-50"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      حفظ المادة
                    </button>
                  </div>
                </form>
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
                  type="button"
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
                    {(modalSubject.examLinks || []).map((link: any) => {
                      const isEditing = editingLinkId === link.id;

                      return (
                        <div key={link.id} className="rounded-xl border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 px-4 py-3 transition">
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                value={editingLinkValues.label}
                                onChange={(e) => setEditingLinkValues((prev) => ({ ...prev, label: e.target.value }))}
                                className="admin-input"
                                placeholder="اسم الرابط"
                              />
                              <input
                                value={editingLinkValues.url}
                                onChange={(e) => setEditingLinkValues((prev) => ({ ...prev, url: e.target.value }))}
                                dir="ltr"
                                className="admin-input"
                                placeholder="https://drive.google.com/..."
                              />
                              <div className="flex justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-black text-slate-300" 
                                  onClick={() => {
                                    setEditingLinkId(null);
                                    setEditingLinkValues({ label: "", url: "" });
                                  }}
                                >
                                  إلغاء
                                </button>
                                <button
                                  type="button"
                                  className="rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-black text-white"
                                  onClick={handleUpdateExamLink}
                                >
                                  حفظ
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0 flex-1 ml-3">
                                <div className="flex items-center gap-2 truncate">
                                  <span className={`truncate text-sm font-black text-violet-200`}>{link.label}</span>
                                </div>
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
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  className="rounded-lg p-2 text-slate-300 hover:bg-violet-500/15 hover:text-violet-300 transition"
                                  onClick={() => {
                                    setEditingLinkId(link.id);
                                    setEditingLinkValues({ label: link.label || "", url: link.url || "" });
                                  }}
                                  title="تعديل الاسم أو الرابط"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/15 hover:text-rose-300 transition"
                                  onClick={() => handleDeleteExamLink(link.id)}
                                  title="حذف الرابط"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {(!modalSubject.examLinks || modalSubject.examLinks.length === 0) && (
                      <div className="rounded-xl border border-dashed border-slate-700/80 p-4 text-center text-xs font-bold text-slate-500">
                        لا توجد روابط امتحانات مضافة لهذه المادة بعد.
                      </div>
                    )}
                  </div>
                </div>

                {/* قسم إضافة روابط جديدة (إمكانية إضافة مالا نهاية من الروابط) */}
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
                          <div className="flex gap-2">
                            <input
                              className="admin-input flex-1"
                              dir="ltr"
                              placeholder="https://drive.google.com/..."
                              value={row.url}
                              onChange={(e) => handlePendingChange(idx, "url", e.target.value)}
                            />
                          </div>
                        </div>
                        {pendingLinks.length > 1 && (
                          <button
                            type="button"
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
