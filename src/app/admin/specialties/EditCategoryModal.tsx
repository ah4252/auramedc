"use client";

import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { Edit2, X, Save, Plus, Link as LinkIcon, Trash2, Stethoscope, Activity, Dna, Brain, Bone, Eye, Heart, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Category = {
  id: string;
  name: string;
  description?: string | null;
};

// Helper function to safely parse description JSON
function parseDescription(desc: string | null) {
  if (!desc) return { brief: "", content: "", videoUrl: "", iconName: "Stethoscope", links: [], images: [] };
  try {
    if (desc.trim().startsWith("{")) {
      const parsed = JSON.parse(desc);
      return {
        brief: parsed.brief || "",
        content: parsed.content || "",
        videoUrl: parsed.videoUrl || "",
        iconName: parsed.iconName || "Stethoscope",
        links: parsed.links || [],
        images: parsed.images || []
      };
    }
  } catch (_error: unknown) {}
  return { brief: desc, content: "", videoUrl: "", iconName: "Stethoscope", links: [], images: [] };
}

const AVAILABLE_ICONS = [
  { name: "Stethoscope", label: "سماعة طبية" },
  { name: "Activity", label: "مخطط قلب" },
  { name: "Dna", label: "حمض نووي DNA" },
  { name: "Brain", label: "دماغ" },
  { name: "Bone", label: "عظام" },
  { name: "Eye", label: "عين" },
  { name: "Heart", label: "قلب" },
  { name: "BookOpen", label: "كتاب مفتوح" }
];

const iconMap: Record<string, LucideIcon> = {
  Stethoscope,
  Activity,
  Dna,
  Brain,
  Bone,
  Eye,
  Heart,
  BookOpen
};

type EditCategoryModalProps = {
  category: Category;
  onSaved?: () => void;
};

export default function EditCategoryModal({ category, onSaved }: EditCategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const parsedData = parseDescription(category.description);
  
  // States for JSON properties
  const [brief, setBrief] = useState(parsedData.brief);
  const [content, setContent] = useState(parsedData.content);
  const [videoUrl, setVideoUrl] = useState(parsedData.videoUrl);
  const [selectedIcon, setSelectedIcon] = useState(parsedData.iconName);
  const [linksList, setLinksList] = useState<{ title: string; url: string }[]>(parsedData.links);
  const [imagesList, setImagesList] = useState<string[]>(parsedData.images || []);

  // Temp states for adding a link
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // Temp state for image url
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Sync state when category changes or modal opens
  useEffect(() => {
    if (isOpen) {
      const data = parseDescription(category.description);
      setBrief(data.brief);
      setContent(data.content);
      setVideoUrl(data.videoUrl);
      setSelectedIcon(data.iconName);
      setLinksList(data.links);
      setImagesList(data.images || []);
    }
  }, [isOpen, category]);

  const addLink = () => {
    if (!linkTitle || !linkUrl) return;
    setLinksList([...linksList, { title: linkTitle, url: linkUrl }]);
    setLinkTitle("");
    setLinkUrl("");
  };

  const removeLink = (idx: number) => {
    setLinksList(linksList.filter((_, i) => i !== idx));
  };

  const addImage = () => {
    if (!imageUrlInput) return;
    setImagesList([...imagesList, imageUrlInput]);
    setImageUrlInput("");
  };

  const removeImage = (idx: number) => {
    setImagesList(imagesList.filter((_, i) => i !== idx));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData(e.currentTarget);

    // Auto-add current link inputs if user forgot to click "+" button
    let finalLinks = [...linksList];
    if (linkTitle && linkUrl) {
      finalLinks.push({ title: linkTitle, url: linkUrl });
    }

    let finalImages = [...imagesList];
    if (imageUrlInput) {
      finalImages.push(imageUrlInput);
    }

    const descriptionObj = {
      brief: brief,
      content: content,
      videoUrl: videoUrl,
      iconName: selectedIcon,
      links: finalLinks,
      images: finalImages
    };

    const finalFormData = new FormData();
    finalFormData.append("name", data.get("name") as string);
    finalFormData.append("description", JSON.stringify(descriptionObj));

    const res = await updateCategory(category.id, finalFormData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setIsOpen(false);
      setLoading(false);
      if (onSaved) {
        onSaved();
      } else {
        window.location.reload();
      }
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 flex-1 justify-center px-4 py-2.5 text-blue-600 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-all text-sm font-bold border border-blue-200/50 dark:border-blue-800/30"
        title="تعديل"
      >
        <Edit2 className="w-4 h-4" />
        <span>تعديل</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-dark-card w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative my-8 text-right"
              dir="rtl"
            >
              <button 
                onClick={() => setIsOpen(false)}
                title="إغلاق"
                type="button"
                className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">تعديل بيانات التخصص</h2>
                <p className="text-slate-500 mt-1">تحديث محتوى {category.name}</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-6 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 pl-1">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">اسم التخصص</label>
                  <input 
                    name="name"
                    defaultValue={category.name}
                    placeholder="اسم التخصص"
                    required
                    className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">وصف مختصر</label>
                  <textarea 
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="وصف مختصر يظهر في البطاقة"
                    required
                    rows={2}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">المحتوى التفصيلي للتخصص</label>
                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="شرح وتفاصيل التخصص بالكامل..."
                    required
                    rows={4}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">رابط الفيديو التعريفي</label>
                  <input 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                  />
                </div>

                 <div className="space-y-2">
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 px-1">أيقونة التخصص</label>
                   <div className="grid grid-cols-4 gap-2">
                     {AVAILABLE_ICONS.map((icon) => {
                       const IconComponent = iconMap[icon.name] || Stethoscope;
                       return (
                         <button
                           key={icon.name}
                           type="button"
                           onClick={() => setSelectedIcon(icon.name)}
                           className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-[11px] font-bold ${selectedIcon === icon.name ? 'bg-medical-50 dark:bg-medical-900/30 text-medical-600 border-medical-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:border-slate-200'}`}
                         >
                           <IconComponent className="w-4 h-4 mb-1 text-slate-500 group-hover:text-medical-600" />
                           <span>{icon.label}</span>
                         </button>
                       );
                     })}
                   </div>
                 </div>

                {/* Edit Links */}
                <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                   <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">الروابط الهامة والمراجع</label>
                   <div className="flex gap-2">
                     <input 
                       value={linkTitle} 
                       onChange={(e) => setLinkTitle(e.target.value)} 
                       placeholder="اسم الرابط" 
                       className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card text-xs focus:ring-2 focus:ring-medical-500 outline-none transition-all" 
                     />
                     <input 
                       value={linkUrl} 
                       onChange={(e) => setLinkUrl(e.target.value)} 
                       placeholder="https://..." 
                       className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card text-xs focus:ring-2 focus:ring-medical-500 outline-none transition-all" 
                     />
                      <button 
                        type="button" 
                        title="إضافة رابط"
                        onClick={addLink} 
                        className="p-2.5 bg-medical-600 text-white rounded-xl hover:bg-medical-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                   </div>

                   {linksList.length > 0 && (
                     <div className="mt-2 space-y-1">
                       {linksList.map((link, idx) => (
                         <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-dark-card rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
                           <span className="font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                             <LinkIcon className="w-3.5 h-3.5 text-medical-500" />
                             {link.title}
                           </span>
                           <button 
                             type="button" 
                             title="حذف الرابط"
                             onClick={() => removeLink(idx)}
                             className="text-rose-500 hover:bg-rose-50 p-1 rounded-md"
                           >
                             <Trash2 className="w-3.5 h-3.5" />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                </div>

                 {/* Edit Images */}
                 <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">صور للتخصص (روابط صور)</label>
                    <div className="flex gap-2">
                      <input 
                        value={imageUrlInput} 
                        onChange={(e) => setImageUrlInput(e.target.value)} 
                        placeholder="https://... (رابط صورة)" 
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card text-xs focus:ring-2 focus:ring-medical-500 outline-none transition-all" 
                      />
                      <button 
                        type="button" 
                        title="إضافة صورة"
                        onClick={addImage} 
                        className="p-2.5 bg-medical-600 text-white rounded-xl hover:bg-medical-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {imagesList.length > 0 && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {imagesList.map((imgUrl, idx) => (
                          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              title="حذف الصورة"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 left-1 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded shadow"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                 </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-medical-600 hover:bg-medical-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-medical-600/30 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
