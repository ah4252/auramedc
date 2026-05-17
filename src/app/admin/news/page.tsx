"use client";

import { useState, useEffect } from "react";
import { getNews, createNews, updateNews, deleteNews, cleanupOldComments } from "@/app/actions/news";
import { Plus, Edit3, Trash2, X, Newspaper, Check, EyeOff, Eye, Image as ImageIcon, Video, Link2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [cleaning, setCleaning] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    const data = await getNews(false);
    setNews(data);
    setLoading(false);
  };

  const openModal = (newsItem?: any) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setTitle(newsItem.title);
      setContent(newsItem.content);
      setImage(newsItem.image || "");
      
      try {
        const parsedVids = JSON.parse(newsItem.videoUrl || "[]");
        setVideoUrls(Array.isArray(parsedVids) ? parsedVids : (newsItem.videoUrl ? [newsItem.videoUrl] : []));
      } catch {
        setVideoUrls(newsItem.videoUrl ? [newsItem.videoUrl] : []);
      }

      try {
        const parsedFiles = JSON.parse(newsItem.fileUrl || "[]");
        setFileUrls(Array.isArray(parsedFiles) ? parsedFiles : (newsItem.fileUrl ? [newsItem.fileUrl] : []));
      } catch {
        setFileUrls(newsItem.fileUrl ? [newsItem.fileUrl] : []);
      }

      setIsPublished(newsItem.isPublished);
    } else {
      setEditingNews(null);
      setTitle("");
      setContent("");
      setImage("");
      setVideoUrls([]);
      setFileUrls([]);
      setIsPublished(true);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
    setTitle("");
    setContent("");
    setImage("");
    setVideoUrls([]);
    setFileUrls([]);
    setIsPublished(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    
    setSubmitting(true);
    
    const finalVideoUrl = JSON.stringify(videoUrls.filter(u => u.trim() !== ""));
    const finalFileUrl = JSON.stringify(fileUrls.filter(u => u.trim() !== ""));

    const payload = { 
      title, 
      content, 
      image, 
      videoUrl: finalVideoUrl, 
      fileUrl: finalFileUrl, 
      isPublished 
    };

    if (editingNews) {
      await updateNews(editingNews.id, payload);
    } else {
      await createNews(payload);
    }
    
    await fetchNews();
    setSubmitting(false);
    closeModal();
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الخبر؟")) {
      await deleteNews(id);
      fetchNews();
    }
  };

  const handleTogglePublish = async (newsItem: any) => {
    await updateNews(newsItem.id, { isPublished: !newsItem.isPublished });
    fetchNews();
  };

  const handleCleanup = async () => {
    if (confirm("هل أنت متأكد من مسح جميع تعليقات وردود الطلاب التي مر عليها أكثر من 4 ساعات؟")) {
      setCleaning(true);
      const res = await cleanupOldComments();
      setCleaning(false);
      if (res.success) {
        alert(`تم التطهير بنجاح! ✅ تم مسح ${res.count} تعليق/رد قديم.`);
        fetchNews();
      } else {
        alert(res.error || "حدث خطأ أثناء محاولة مسح التعليقات");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen font-cairo">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-medical-600" />
            إدارة الأخبار
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold italic">
            أضف الأخبار والتحديثات الجديدة لعرضها للطلاب
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleCleanup}
            disabled={cleaning}
            className="flex items-center justify-center gap-2 px-5 py-4 bg-amber-500/10 hover:bg-amber-500 text-amber-600 dark:text-amber-400 hover:text-white dark:hover:text-slate-900 rounded-2xl font-black transition-all border border-amber-500/20 shadow-md disabled:opacity-50"
          >
            {cleaning ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 shrink-0" />
            )}
            <span>{"مسح التعليقات القديمة (> 4 ساعات)"}</span>
          </button>
          
          <button 
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-medical-600 hover:bg-medical-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-medical-600/20 shrink-0"
          >
            <Plus className="w-5 h-5" />
            إضافة خبر جديد
          </button>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {news.map((item) => (
          <motion.div 
            key={item.id} 
            layout
            className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-lg overflow-hidden group"
          >
            {item.image ? (
              <div className="h-48 w-full bg-slate-100 dark:bg-slate-800 relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            ) : (
              <div className="h-48 w-full bg-medical-50 dark:bg-medical-900/20 flex items-center justify-center relative">
                <Newspaper className="w-16 h-16 text-medical-200 dark:text-medical-800" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${item.isPublished ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                  {item.isPublished ? 'منشور' : 'مسودة'}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>
              
              <h3 className="font-black text-xl text-slate-800 dark:text-white mb-2 line-clamp-1">{item.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold line-clamp-2 mb-6">
                {item.content}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => handleTogglePublish(item)}
                  className="flex items-center gap-2 p-2 text-slate-400 hover:text-medical-600 transition-colors"
                  title={item.isPublished ? "إخفاء الخبر" : "نشر الخبر"}
                >
                  {item.isPublished ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openModal(item)}
                    className="p-2 text-slate-400 hover:text-blue-500 bg-slate-50 dark:bg-slate-800 rounded-xl transition-all"
                    title="تعديل"
                    aria-label="تعديل"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 rounded-xl transition-all"
                    title="حذف"
                    aria-label="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {news.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center bg-white dark:bg-dark-card rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Newspaper className="w-20 h-20 text-slate-300 mx-auto mb-4 opacity-20" />
            <h3 className="text-2xl font-black text-slate-400">لا توجد أخبار مضافة حتى الآن</h3>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-white dark:bg-[#0f172a] rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 p-8 md:p-10"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                  {editingNews ? <Edit3 className="w-6 h-6 text-medical-600" /> : <Plus className="w-6 h-6 text-medical-600" />}
                  {editingNews ? 'تعديل الخبر' : 'خبر جديد'}
                </h2>
                <button onClick={closeModal} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all" title="إغلاق" aria-label="إغلاق">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">عنوان الخبر</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-4 rounded-2xl outline-none focus:border-medical-500 font-bold"
                    placeholder="اكتب عنواناً جذاباً للخبر..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">محتوى الخبر</label>
                  <textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={5}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-4 rounded-2xl outline-none focus:border-medical-500 font-bold resize-none"
                    placeholder="اكتب تفاصيل الخبر هنا..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">رابط الصورة (اختياري)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 p-4 flex items-center pointer-events-none text-slate-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <input 
                      type="url" 
                      value={image} 
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-4 pr-12 rounded-2xl outline-none focus:border-medical-500 font-bold text-left"
                      placeholder="https://example.com/image.jpg"
                      dir="ltr"
                    />
                  </div>
                  {image && (
                    <div className="mt-4 h-32 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-100">
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-slate-100 dark:border-slate-800">
                  
                  {/* Videos List */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300">
                        <Video className="w-4 h-4 text-red-500" />
                        فيديوهات يوتيوب
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setVideoUrls([...videoUrls, ""])} 
                        className="text-xs bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3"/> إضافة فيديو
                      </button>
                    </div>
                    <div className="space-y-3">
                      {videoUrls.map((url, i) => (
                        <div key={i} className="flex gap-2">
                          <input 
                            type="url" 
                            value={url} 
                            onChange={(e) => { const newArr = [...videoUrls]; newArr[i] = e.target.value; setVideoUrls(newArr); }} 
                            className="flex-1 w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:border-red-500 text-sm font-bold text-left" 
                            dir="ltr" 
                            placeholder="https://youtube.com/..." 
                          />
                          <button 
                            type="button" 
                            onClick={() => setVideoUrls(videoUrls.filter((_, idx) => idx !== i))} 
                            className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors"
                            title="حذف الفيديو"
                            aria-label="حذف الفيديو"
                          >
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      ))}
                      {videoUrls.length === 0 && <p className="text-xs text-slate-400 font-bold text-center py-4">لم تقم بإضافة روابط فيديو</p>}
                    </div>
                  </div>
                  
                  {/* Files List */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300">
                        <Link2 className="w-4 h-4 text-blue-500" />
                        مرفقات وملفات
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setFileUrls([...fileUrls, ""])} 
                        className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3"/> إضافة ملف
                      </button>
                    </div>
                    <div className="space-y-3">
                      {fileUrls.map((url, i) => (
                        <div key={i} className="flex gap-2">
                          <input 
                            type="url" 
                            value={url} 
                            onChange={(e) => { const newArr = [...fileUrls]; newArr[i] = e.target.value; setFileUrls(newArr); }} 
                            className="flex-1 w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 p-3 rounded-xl outline-none focus:border-blue-500 text-sm font-bold text-left" 
                            dir="ltr" 
                            placeholder="https://drive.google.com/..." 
                          />
                          <button 
                            type="button" 
                            onClick={() => setFileUrls(fileUrls.filter((_, idx) => idx !== i))} 
                            className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors"
                            title="حذف الملف"
                            aria-label="حذف الملف"
                          >
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      ))}
                      {fileUrls.length === 0 && <p className="text-xs text-slate-400 font-bold text-center py-4">لم تقم بإضافة روابط ملفات</p>}
                    </div>
                  </div>

                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800">
                  <input 
                    type="checkbox" 
                    id="isPublished"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-5 h-5 rounded text-medical-600 focus:ring-medical-500"
                  />
                  <label htmlFor="isPublished" className="font-black text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    نشر الخبر فوراً (ليظهر للطلاب)
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting || !title || !content}
                  className="w-full py-4 bg-medical-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-medical-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-medical-600/20"
                >
                  {submitting ? 'جاري الحفظ...' : (
                    <>
                      <Check className="w-5 h-5" />
                      حفظ الخبر
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
