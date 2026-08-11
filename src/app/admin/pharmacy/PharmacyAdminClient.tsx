"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Edit3, Image as ImageIcon, FolderOpen,
  X, Save, Loader2, FlaskConical, ChevronDown, ChevronUp, Link2, Search, CheckSquare, Square
} from "lucide-react";
import {
  addPharmacySection,
  updatePharmacySection,
  deletePharmacySection,
  addPharmacyImage,
  deletePharmacyImage,
  updatePharmacyImage,
  bulkDeletePharmacyImages,
  bulkDeletePharmacySections
} from "@/app/actions/pharmacy";

type PharmacyImage = {
  id: string;
  title: string | null;
  url: string;
  description: string | null;
  order: number;
};

type PharmacySection = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  order: number;
  images: PharmacyImage[];
};

export default function PharmacyAdminClient({ sections: initialSections }: { sections: PharmacySection[] }) {
  const [sections, setSections] = useState<PharmacySection[]>(initialSections);
  const [isPending, startTransition] = useTransition();

  // Section states
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSection, setEditingSection] = useState<PharmacySection | null>(null);
  const [sectionName, setSectionName] = useState("");
  const [sectionDesc, setSectionDesc] = useState("");
  const [sectionImageUrl, setSectionImageUrl] = useState("");

  // Image states
  const [showAddImage, setShowAddImage] = useState<string | null>(null); // sectionId
  const [editingImage, setEditingImage] = useState<{ image: PharmacyImage; sectionId: string } | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [imageDesc, setImageDesc] = useState("");
  const [medicineIndications, setMedicineIndications] = useState("");
  const [medicineSideEffects, setMedicineSideEffects] = useState("");
  const [medicineAgeLimit, setMedicineAgeLimit] = useState("");

  // Expanded sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(initialSections.map(s => s.id)));
  
  // Selection
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // --- URL Helper ---
  const normalizeImageUrl = (url: string): string => {
    // i.ibb.co direct image links (with full path) — pass through as-is
    // e.g. https://i.ibb.co/KcSSKrFH/957e5668-f0d6-4f29-bb1a-1c4431b95859.jpg
    if (/^https?:\/\/i\.ibb\.co\/.+/.test(url)) return url;
    // ibb.co share page — we can't reliably convert without an API, keep as-is
    // blob: and all other https: links — keep as-is
    return url;
  };

  const getUrlHint = (url: string): { type: "warning" | "info" | "error"; msg: string } | null => {
    if (!url) return null;
    if (url.startsWith("blob:"))
      return { type: "warning", msg: "⚠️ رابط blob مؤقت ويعمل فقط في هذا المتصفح الآن — للحفظ الدائم ارفع الصورة على خدمة مثل ImgBB أو Cloudinary." };
    // i.ibb.co direct image link (any path/filename)
    if (/^https?:\/\/i\.ibb\.co\/.+\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(url))
      return { type: "info", msg: "✅ رابط ImgBB مباشر — سيعمل بشكل صحيح." };
    if (/^https?:\/\/i\.ibb\.co\/.+/.test(url))
      return { type: "info", msg: "✅ رابط ImgBB مباشر — سيعمل بشكل صحيح." };
    // ibb.co share page (not direct)
    if (/^https?:\/\/ibb\.co\/[A-Za-z0-9]+$/.test(url))
      return { type: "info", msg: "ℹ️ رابط صفحة ImgBB — للحصول على أفضل نتيجة انسخ رابط الصورة المباشر (i.ibb.co/...) من صفحة ImgBB." };
    return null;
  };

  const showFeedback = (type: "success" | "error", msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  // --- Section Handlers ---
  const handleAddSection = () => {
    if (!sectionName.trim()) return;
    const fd = new FormData();
    fd.append("name", sectionName);
    fd.append("description", sectionDesc);
    fd.append("imageUrl", normalizeImageUrl(sectionImageUrl));
    startTransition(async () => {
      const res = await addPharmacySection(fd);
      if (res?.error) { showFeedback("error", res.error); return; }
      showFeedback("success", "تم إضافة القسم بنجاح");
      setSectionName(""); setSectionDesc(""); setSectionImageUrl(""); setShowAddSection(false);
      window.location.reload();
    });
  };

  const handleUpdateSection = () => {
    if (!editingSection || !sectionName.trim()) return;
    const fd = new FormData();
    fd.append("name", sectionName);
    fd.append("description", sectionDesc);
    fd.append("imageUrl", normalizeImageUrl(sectionImageUrl));
    startTransition(async () => {
      const res = await updatePharmacySection(editingSection.id, fd);
      if (res?.error) { showFeedback("error", res.error); return; }
      showFeedback("success", "تم تعديل القسم بنجاح");
      setEditingSection(null); setSectionName(""); setSectionDesc(""); setSectionImageUrl("");
      window.location.reload();
    });
  };

  const handleDeleteSection = (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم وجميع صوره؟")) return;
    startTransition(async () => {
      const res = await deletePharmacySection(id);
      if (res?.error) { showFeedback("error", res.error); return; }
      showFeedback("success", "تم حذف القسم");
      setSections(prev => prev.filter(s => s.id !== id));
      setSelectedSections(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    });
  };

  const handleBulkDeleteSections = () => {
    const ids = Array.from(selectedSections);
    if (ids.length === 0) return;
    if (!confirm(`هل أنت متأكد من حذف ${ids.length} قسم مع جميع صورها؟`)) return;

    startTransition(async () => {
      const res = await bulkDeletePharmacySections(ids);
      if (res?.error) { showFeedback("error", res.error); return; }
      showFeedback("success", `تم حذف ${ids.length} قسم بنجاح`);
      setSections(prev => prev.filter(s => !ids.includes(s.id)));
      setSelectedSections(new Set());
    });
  };

  const toggleSectionSelection = (id: string) => {
    setSelectedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // --- Image Handlers ---
  const handleAddImage = (sectionId: string) => {
    if (!imageUrl.trim()) return;
    const fd = new FormData();
    fd.append("sectionId", sectionId);
    fd.append("url", normalizeImageUrl(imageUrl));
    fd.append("title", imageTitle);
    fd.append("description", imageDesc);
    fd.append("indications", medicineIndications);
    fd.append("sideEffects", medicineSideEffects);
    fd.append("ageLimit", medicineAgeLimit);
    startTransition(async () => {
      const res = await addPharmacyImage(fd);
      if (res?.error) { showFeedback("error", res.error); return; }
      showFeedback("success", "تم إضافة الصورة بنجاح");
      setShowAddImage(null); setImageUrl(""); setImageTitle(""); setImageDesc(""); setMedicineIndications(""); setMedicineSideEffects(""); setMedicineAgeLimit("");
      window.location.reload();
    });
  };

  const handleUpdateImage = () => {
    if (!editingImage || !imageUrl.trim()) return;
    const fd = new FormData();
    fd.append("url", normalizeImageUrl(imageUrl));
    fd.append("title", imageTitle);
    fd.append("description", imageDesc);
    fd.append("indications", medicineIndications);
    fd.append("sideEffects", medicineSideEffects);
    fd.append("ageLimit", medicineAgeLimit);
    startTransition(async () => {
      const res = await updatePharmacyImage(editingImage.image.id, fd);
      if (res?.error) { showFeedback("error", res.error); return; }
      showFeedback("success", "تم تعديل الصورة بنجاح");
      setEditingImage(null); setImageUrl(""); setImageTitle(""); setImageDesc(""); setMedicineIndications(""); setMedicineSideEffects(""); setMedicineAgeLimit("");
      window.location.reload();
    });
  };

  const handleDeleteImage = (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;
    startTransition(async () => {
      const res = await deletePharmacyImage(id);
      if (res?.error) { showFeedback("error", res.error); return; }
      showFeedback("success", "تم حذف الصورة");
      setSections(prev => prev.map(s => ({ ...s, images: s.images.filter(img => img.id !== id) })));
      setSelectedImages(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    });
  };

  const handleBulkDelete = (sectionId: string) => {
    const ids = Array.from(selectedImages).filter(id => sections.find(s => s.id === sectionId)?.images.some(img => img.id === id));
    if (ids.length === 0) return;
    if (!confirm(`هل أنت متأكد من حذف ${ids.length} صورة؟`)) return;

    startTransition(async () => {
      const res = await bulkDeletePharmacyImages(ids);
      if (res?.error) { showFeedback("error", res.error); return; }
      showFeedback("success", `تم حذف ${ids.length} صورة`);
      setSections(prev => prev.map(s => {
        if (s.id !== sectionId) return s;
        return { ...s, images: s.images.filter(img => !ids.includes(img.id)) };
      }));
      setSelectedImages(prev => {
        const next = new Set(prev);
        ids.forEach(id => next.delete(id));
        return next;
      });
    });
  };

  const toggleImageSelection = (id: string) => {
    setSelectedImages(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filteredSections = sections.filter(section => 
    section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (section.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-emerald-500" />
            إدارة قسم الصيدلة
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            أضف وعدّل أقسام الصيدلة وصورها
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedSections.size > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleBulkDeleteSections}
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-2xl font-black hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
              حذف المحدد ({selectedSections.size})
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setShowAddSection(true); setSectionName(""); setSectionDesc(""); setSectionImageUrl(""); setEditingSection(null); }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-shadow"
          >
            <Plus className="w-5 h-5" />
            إضافة قسم جديد
          </motion.button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن قسم..."
          className="w-full pr-12 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm focus:border-emerald-500 outline-none transition-all font-medium text-slate-900 dark:text-white"
        />
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl font-bold text-sm text-center ${
              feedback.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
            }`}
          >
            {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Section Modal */}
      <AnimatePresence>
        {(showAddSection || editingSection) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {editingSection ? "تعديل القسم" : "إضافة قسم جديد"}
                </h3>
                <button
                  onClick={() => { setShowAddSection(false); setEditingSection(null); }}
                  title="إغلاق النافذة"
                  className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">اسم القسم *</label>
                  <input
                    value={sectionName}
                    onChange={e => setSectionName(e.target.value)}
                    placeholder="مثال: أدوية القلب"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">صورة القسم (رابط اختياري)</label>
                  <div className="relative">
                    <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={sectionImageUrl}
                      onChange={e => setSectionImageUrl(e.target.value)}
                      placeholder="https://ibb.co/... أو i.ibb.co أو blob:https://gemini.google.com/..."
                      dir="ltr"
                      className="w-full pr-10 px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium"
                    />
                  </div>
                  {(() => { const hint = getUrlHint(sectionImageUrl); return hint ? (
                    <p className={`text-xs mt-1.5 font-medium ${
                      hint.type === "warning" ? "text-amber-600 dark:text-amber-400" :
                      hint.type === "error"   ? "text-red-600 dark:text-red-400" :
                      "text-sky-600 dark:text-sky-400"
                    }`}>{hint.msg}</p>
                  ) : null; })()}
                </div>
                {sectionImageUrl && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
                    <img src={normalizeImageUrl(sectionImageUrl)} alt="preview" className="max-w-full max-h-full object-contain p-2" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">وصف القسم (اختياري)</label>
                  <textarea
                    value={sectionDesc}
                    onChange={e => setSectionDesc(e.target.value)}
                    rows={3}
                    placeholder="وصف مختصر للقسم..."
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium resize-none"
                  />
                </div>
                <button
                  onClick={editingSection ? handleUpdateSection : handleAddSection}
                  disabled={isPending || !sectionName.trim()}
                  className="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-black flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {editingSection ? "حفظ التعديلات" : "إضافة القسم"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Image Modal */}
      <AnimatePresence>
        {(showAddImage || editingImage) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {editingImage ? "تعديل الصورة" : "إضافة صورة"}
                </h3>
                <button
                  onClick={() => { setShowAddImage(null); setEditingImage(null); setImageUrl(""); setImageTitle(""); setImageDesc(""); setMedicineIndications(""); setMedicineSideEffects(""); setMedicineAgeLimit(""); }}
                  title="إغلاق النافذة"
                  className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">رابط الصورة *</label>
                  <div className="relative">
                    <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://ibb.co/... أو i.ibb.co أو blob:https://gemini.google.com/..."
                      dir="ltr"
                      className="w-full pr-10 px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium"
                    />
                  </div>
                  {(() => { const hint = getUrlHint(imageUrl); return hint ? (
                    <p className={`text-xs mt-1.5 font-medium ${
                      hint.type === "warning" ? "text-amber-600 dark:text-amber-400" :
                      hint.type === "error"   ? "text-red-600 dark:text-red-400" :
                      "text-sky-600 dark:text-sky-400"
                    }`}>{hint.msg}</p>
                  ) : null; })()}
                </div>
                {imageUrl && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
                    <img src={normalizeImageUrl(imageUrl)} alt="preview" className="max-w-full max-h-full object-contain p-2" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">عنوان الصورة (اختياري)</label>
                  <input
                    value={imageTitle}
                    onChange={e => setImageTitle(e.target.value)}
                    placeholder="عنوان الصورة..."
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">وصف الصورة (اختياري)</label>
                  <textarea
                    value={imageDesc}
                    onChange={e => setImageDesc(e.target.value)}
                    rows={2}
                    placeholder="وصف مختصر..."
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">دواعي الاستعمال</label>
                  <textarea
                    value={medicineIndications}
                    onChange={e => setMedicineIndications(e.target.value)}
                    rows={3}
                    placeholder="أدخل دواعي الاستعمال..."
                    className="w-full px-4 py-3 text-sm rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">الأثار الجانبية</label>
                  <textarea
                    value={medicineSideEffects}
                    onChange={e => setMedicineSideEffects(e.target.value)}
                    rows={3}
                    placeholder="أدخل الآثار الجانبية..."
                    className="w-full px-4 py-3 text-sm rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/20 focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">السن المحدد</label>
                  <input
                    value={medicineAgeLimit}
                    onChange={e => setMedicineAgeLimit(e.target.value)}
                    placeholder="مثل: 12 سنة فما فوق"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium"
                  />
                </div>
                <button
                  onClick={editingImage ? handleUpdateImage : () => handleAddImage(showAddImage!)}
                  disabled={isPending || !imageUrl.trim()}
                  className="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-black flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {editingImage ? "حفظ التعديلات" : "إضافة الصورة"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sections List */}
      {sections.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700"
        >
          <FlaskConical className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-black text-slate-400 dark:text-slate-500">لا توجد أقسام بعد</h3>
          <p className="text-slate-400 dark:text-slate-600 mt-2">ابدأ بإضافة قسم جديد للصيدلة</p>
        </motion.div>
      ) : filteredSections.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700"
        >
          <Search className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-black text-slate-400 dark:text-slate-500">لا توجد نتائج بحث</h3>
          <p className="text-slate-400 dark:text-slate-600 mt-2">لم يتم العثور على أقسام تطابق بحثك</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {filteredSections.map((section, idx) => {
            const isExpanded = expandedSections.has(section.id);
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => toggleSectionSelection(section.id)}
                      title="تحديد القسم"
                      className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {selectedSections.has(section.id) ? (
                        <CheckSquare className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <Square className="w-6 h-6" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex items-center gap-4 flex-1 text-right"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20 overflow-hidden">
                        {section.imageUrl ? (
                          <img src={section.imageUrl} alt={section.name} className="w-full h-full object-cover" />
                        ) : (
                          <FolderOpen className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">{section.name}</h3>
                        {section.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{section.description}</p>
                        )}
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full mt-1 inline-block">
                          {section.images.length} صورة
                        </span>
                      </div>
                      <div className="mr-auto">
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </div>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mr-4">
                    <button
                      onClick={() => {
                        setEditingSection(section);
                        setSectionName(section.name);
                        setSectionDesc(section.description || "");
                        setSectionImageUrl(section.imageUrl || "");
                        setShowAddSection(false);
                      }}
                      title="تعديل القسم"
                      className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      title="حذف القسم"
                      className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Images Grid */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-slate-100 dark:border-slate-800 p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-black text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-emerald-500" />
                          الصور ({section.images.length})
                        </h4>
                        <div className="flex items-center gap-2">
                          {Array.from(selectedImages).filter(id => section.images.some(img => img.id === id)).length > 0 && (
                            <button
                              onClick={() => handleBulkDelete(section.id)}
                              disabled={isPending}
                              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              حذف المحدد ({Array.from(selectedImages).filter(id => section.images.some(img => img.id === id)).length})
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setShowAddImage(section.id);
                              setEditingImage(null);
                              setImageUrl(""); setImageTitle(""); setImageDesc("");
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            إضافة صورة
                          </button>
                        </div>
                      </div>

                      {section.images.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                          <ImageIcon className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                          <p className="text-slate-400 dark:text-slate-600 text-sm font-medium">لا توجد صور في هذا القسم</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                          {section.images.map((img, imgIdx) => (
                            <motion.div
                              key={img.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: imgIdx * 0.04 }}
                              className={`group relative bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border-2 transition-all aspect-square ${
                                selectedImages.has(img.id) 
                                  ? "border-emerald-500 shadow-lg shadow-emerald-500/20" 
                                  : "border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              <img
                                src={img.url}
                                alt={img.title || "pharmacy image"}
                                className={`w-full h-full object-cover transition-transform duration-300 ${selectedImages.has(img.id) ? "scale-105" : "group-hover:scale-105"}`}
                              />
                              {/* Selection Toggle */}
                              <button
                                onClick={() => toggleImageSelection(img.id)}
                                title="تحديد الصورة"
                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/40 backdrop-blur-sm text-white hover:bg-slate-900/60 transition-colors z-10"
                              >
                                {selectedImages.has(img.id) ? (
                                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                                ) : (
                                  <Square className="w-5 h-5 opacity-70" />
                                )}
                              </button>
                              {/* Overlay */}
                              <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent transition-opacity duration-300 flex flex-col justify-end p-3 ${
                                selectedImages.has(img.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              }`}>
                                {img.title && (
                                  <p className="text-white text-xs font-bold truncate mb-2">{img.title}</p>
                                )}
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingImage({ image: img, sectionId: section.id });
                                      setShowAddImage(null);
                                      setImageUrl(img.url);
                                      setImageTitle(img.title || "");
                                      setImageDesc(img.description || "");
                                    }}
                                    className="flex-1 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-bold hover:bg-blue-500/80 transition-colors flex items-center justify-center gap-1"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    تعديل
                                  </button>
                                  <button
                                    onClick={() => handleDeleteImage(img.id)}
                                    className="flex-1 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-bold hover:bg-red-500/80 transition-colors flex items-center justify-center gap-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    حذف
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
