"use client";

import { addCategory, getCategories, deleteCategory } from "@/app/actions/content";
import { useState, useEffect } from "react";
import { 
  Save, Trash2, AlertCircle, CheckCircle2, Loader2, Stethoscope, Activity,
  Plus, X, Link as LinkIcon, Video, FileText, Info, Dna, Brain, Bone, Eye, Heart, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EditCategoryModal from "./EditCategoryModal";

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
  } catch (e) {}
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

const iconMap: Record<string, any> = {
  Stethoscope,
  Activity,
  Dna,
  Brain,
  Bone,
  Eye,
  Heart,
  BookOpen
};

export default function AdminSpecialtiesPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  // Links State for New Specialty Form
  const [linksList, setLinksList] = useState<{ title: string; url: string }[]>([]);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Stethoscope");

  // Dynamic Images State
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const cats = await getCategories("SPECIALTY");
    setCategories(cats);
  };

  const addLinkToForm = () => {
    if (!linkTitle || !linkUrl) return;
    setLinksList([...linksList, { title: linkTitle, url: linkUrl }]);
    setLinkTitle("");
    setLinkUrl("");
  };

  const removeLinkFromForm = (idx: number) => {
    setLinksList(linksList.filter((_, i) => i !== idx));
  };

  const addImageToForm = () => {
    if (!imageUrlInput) return;
    setImagesList([...imagesList, imageUrlInput]);
    setImageUrlInput("");
  };

  const removeImageFromForm = (idx: number) => {
    setImagesList(imagesList.filter((_, i) => i !== idx));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const form = e.currentTarget;
    const data = new FormData(form);

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
      brief: data.get("brief") as string,
      content: data.get("content") as string,
      videoUrl: data.get("videoUrl") as string,
      iconName: selectedIcon,
      links: finalLinks,
      images: finalImages
    };

    const finalFormData = new FormData();
    finalFormData.append("name", data.get("name") as string);
    finalFormData.append("type", "SPECIALTY");
    finalFormData.append("description", JSON.stringify(descriptionObj));

    const res = await addCategory(finalFormData);
    
    if (res.error) {
      setMessage(res.error);
      setStatus("error");
    } else {
      setMessage("تم حفظ التخصص بنجاح!");
      setStatus("success");
      form.reset();
      setLinksList([]);
      setLinkTitle("");
      setLinkUrl("");
      setImagesList([]);
      setImageUrlInput("");
      setSelectedIcon("Stethoscope");
      refreshData();
    }
    
    setLoading(false);
    setTimeout(() => { setMessage(""); setStatus(null); }, 4000);
  }

  async function handleDeleteCat(id: string) {
    if (!confirm("حذف التخصص سيحذف كل المواد والدروس التابعة له! هل أنت متأكد؟")) return;
    const res = await deleteCategory(id);
    if (res.success) refreshData();
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl pb-20 space-y-10 text-right"
      dir="rtl"
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">إدارة التخصصات الطبية</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">نظم وأضف التخصصات الطبية، وأضف تفاصيل الدروس ومقاطع الفيديو والروابط الهامة.</p>
      </div>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-6 rounded-[2rem] border shadow-xl flex items-center gap-4 ${
              status === "success" ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
          >
            {status === "success" ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <p className="text-lg font-black">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5">
           <div className="section-card p-10 relative overflow-hidden group bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
              <div className="absolute top-0 left-0 w-32 h-32 bg-medical-500/5 rounded-full -ml-16 -mt-16 blur-3xl" />
              
              <div className="flex items-center gap-4 mb-10 relative z-10">
                 <div className="p-4 rounded-2xl bg-medical-50 dark:bg-medical-500/10 text-medical-600">
                    <Stethoscope className="w-8 h-8" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">إضافة تخصص طبي جديد</h2>
                    <p className="text-slate-400 text-xs font-bold mt-1">قم بتعبئة محتوى التخصص بالكامل</p>
                 </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="space-y-2">
                   <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">اسم التخصص</label>
                   <input name="name" required placeholder="مثلاً: الباطنة العامة، الجراحة، الأطفال..." className="admin-input" />
                </div>

                <div className="space-y-2">
                   <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">وصف مختصر (يظهر في البطاقة)</label>
                   <textarea name="brief" required placeholder="نبذة قصيرة تظهر في الصفحة الرئيسية للتخصصات..." className="admin-input min-h-[70px]" />
                </div>

                <div className="space-y-2">
                   <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">المحتوى الداخلي للتخصص (شرح كامل)</label>
                   <textarea name="content" required placeholder="اكتب تفاصيل هذا التخصص، المراجع المتوفرة، والخطط الدراسية..." className="admin-input min-h-[140px]" />
                </div>

                <div className="space-y-2">
                   <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">رابط فيديو تعريفي (يوتيوب)</label>
                   <input name="videoUrl" placeholder="https://www.youtube.com/watch?v=..." className="admin-input" />
                </div>

                {/* Icon Selection */}
                <div className="space-y-3">
                   <label className="block text-sm font-black text-slate-500 dark:text-slate-400 px-1">أيقونة التخصص</label>
                   <div className="grid grid-cols-4 gap-2">
                     {AVAILABLE_ICONS.map((icon) => {
                       const IconComponent = iconMap[icon.name] || Stethoscope;
                       return (
                         <button
                           key={icon.name}
                           type="button"
                           onClick={() => setSelectedIcon(icon.name)}
                           className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${selectedIcon === icon.name ? 'bg-medical-50 dark:bg-medical-900/30 text-medical-600 border-medical-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:border-slate-200'}`}
                         >
                           <IconComponent className="w-5 h-5 mb-1 text-slate-500 group-hover:text-medical-600" />
                           <span>{icon.label}</span>
                         </button>
                       );
                     })}
                   </div>
                </div>

                {/* Dynamic Links Section */}
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                   <label className="block text-sm font-black text-slate-700 dark:text-slate-300">الروابط الهامة والمراجع</label>
                   <div className="flex gap-2">
                     <input 
                       value={linkTitle} 
                       onChange={(e) => setLinkTitle(e.target.value)} 
                       placeholder="اسم الرابط (مثال: قناة التيليجرام)" 
                       className="admin-input flex-1 text-xs" 
                     />
                     <input 
                       value={linkUrl} 
                       onChange={(e) => setLinkUrl(e.target.value)} 
                       placeholder="https://..." 
                       className="admin-input flex-1 text-xs" 
                     />
                     <button 
                       type="button" 
                       title="إضافة رابط"
                       onClick={addLinkToForm} 
                       className="p-3 bg-medical-600 text-white rounded-xl hover:bg-medical-700 transition-colors"
                     >
                       <Plus className="w-5 h-5" />
                     </button>
                   </div>

                   {linksList.length > 0 && (
                     <div className="mt-3 space-y-1.5">
                       {linksList.map((link, idx) => (
                         <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-dark-card rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
                           <span className="font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                             <LinkIcon className="w-3.5 h-3.5 text-medical-500" />
                             {link.title}
                           </span>
                           <button 
                             type="button" 
                             title="حذف الرابط"
                             onClick={() => removeLinkFromForm(idx)}
                             className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 p-1 rounded-md"
                           >
                             <X className="w-3.5 h-3.5" />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                </div>

                 {/* Dynamic Images Section */}
                 <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300">صور للتخصص (روابط صور)</label>
                    <div className="flex gap-2">
                      <input 
                        value={imageUrlInput} 
                        onChange={(e) => setImageUrlInput(e.target.value)} 
                        placeholder="https://... (رابط صورة)" 
                        className="admin-input flex-1 text-xs" 
                      />
                      <button 
                        type="button" 
                        title="إضافة صورة"
                        onClick={addImageToForm} 
                        className="p-3 bg-medical-600 text-white rounded-xl hover:bg-medical-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {imagesList.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {imagesList.map((imgUrl, idx) => (
                          <div key={idx} className="relative group/img aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imgUrl} alt="Specialty preview" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              title="حذف الصورة"
                              onClick={() => removeImageFromForm(idx)}
                              className="absolute top-1 left-1 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-md shadow"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                 </div>

                <button disabled={loading} className="admin-btn-primary w-full py-5 rounded-[2rem]">
                   {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                   <span className="text-xl">حفظ التخصص في النظام</span>
                </button>
              </form>
           </div>
        </div>

        {/* Listing Column */}
        <div className="lg:col-span-7 space-y-6">
           <div className="bg-slate-50/50 dark:bg-slate-900/20 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800/60 min-h-[600px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-4">
                 <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-medical-600 rounded-full" />
                    التخصصات المضافة حالياً
                 </h3>
                 <div className="px-4 py-1.5 bg-white dark:bg-dark-card rounded-full border border-slate-100 dark:border-slate-800 text-xs font-black text-slate-400 shadow-sm">
                    {categories.length} تخصص
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <AnimatePresence mode="popLayout">
                 {categories.map((cat, i) => {
                    const parsed = parseDescription(cat.description);
                    return (
                      <motion.div 
                        key={cat.id} 
                        layout
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:border-medical-500/20 transition-all duration-500 group"
                      >
                         {/* Top row: Icon + Info + Badges */}
                         <div className="flex items-start gap-4 mb-5">
                            <div className="w-14 h-14 bg-medical-50 dark:bg-medical-500/10 rounded-2xl flex items-center justify-center text-medical-600 shrink-0 group-hover:scale-110 transition-transform">
                               <Activity className="w-7 h-7" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">{cat.name}</h4>
                               <p className="text-slate-400 text-xs line-clamp-2">{parsed.brief || "لا يوجد وصف مختصر"}</p>
                               <div className="flex flex-wrap items-center gap-2 mt-2">
                                 {parsed.videoUrl && <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full"><Video className="w-3 h-3" /> فيديو تعريفي</span>}
                                 {parsed.links.length > 0 && <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-full"><LinkIcon className="w-3 h-3" /> {parsed.links.length} رابط</span>}
                                 {parsed.content && <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full"><FileText className="w-3 h-3" /> محتوى تفصيلي</span>}
                               </div>
                            </div>
                         </div>

                         {/* Bottom row: Action buttons - always visible */}
                         <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                            <EditCategoryModal category={cat} onSaved={refreshData} />
                            <button 
                              title="حذف" 
                              aria-label="حذف" 
                              onClick={() => handleDeleteCat(cat.id)} 
                              className="flex items-center gap-2 flex-1 justify-center px-4 py-2.5 text-rose-500 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-xl transition-all text-sm font-bold border border-rose-200/50 dark:border-rose-800/30"
                            >
                               <Trash2 className="w-4 h-4" />
                               <span>حذف</span>
                            </button>
                         </div>
                      </motion.div>
                    );
                 })}
                 </AnimatePresence>
                 {categories.length === 0 && (
                   <div className="py-20 text-center text-slate-400 font-bold italic">
                      لا توجد تخصصات مضافة حالياً.
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
