"use client";

import { useState, useEffect } from "react";
import { X, MessageSquare, Send, Loader2, BookOpen, Plus, Sparkles, AlertTriangle, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createDiscussion, updateDiscussion } from "@/app/actions/community";
import { useRouter } from "next/navigation";

export default function NewDiscussionModal({ isOpen, onClose, subjects, userId, onSuccess, editPost }: { 
  isOpen: boolean, 
  onClose: () => void, 
  subjects: any[], 
  userId: string,
  onSuccess?: (newPost: any) => void,
  editPost?: any // New: for edit mode
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title);
      setContent(editPost.content);
      setSubjectId(editPost.subjectId || "");
    } else {
      setTitle("");
      setContent("");
      setSubjectId("");
    }
  }, [editPost, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    setError("");

    if (editPost) {
      const res = await updateDiscussion(editPost.id, userId, title, content);
      if (res.success) {
        if (onSuccess) {
          onSuccess({ ...editPost, title, content, subjectId });
        }
        onClose();
      } else {
        setError(res.error || "حدث خطأ ما");
      }
    } else {
      const res = await createDiscussion(userId, title, content, subjectId || undefined);
      if (res.success && res.discussion) {
        setTitle("");
        setContent("");
        setSubjectId("");
        if (onSuccess) onSuccess(res.discussion);
        onClose();
      } else {
        setError(res.error || "حدث خطأ ما");
      }
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="relative w-full max-w-lg bg-[#0a0f1d] border border-white/10 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-medical-500 via-indigo-500 to-medical-500" />
            
            <div className="p-10 md:p-14 space-y-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                     {editPost ? <Edit3 className="w-8 h-8 text-medical-500" /> : <Plus className="w-8 h-8 text-medical-500" />}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tight">{editPost ? "تعديل المنشور" : "منشور جديد"}</h2>
                    <p className="text-slate-500 font-bold mt-1">شارك معرفتك الطبية</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-red-500/20 transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-black flex items-center gap-3">
                   <AlertTriangle className="w-5 h-5" /> {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-400 flex items-center gap-2 mr-2">العنوان</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عن ماذا يدور نقاشك؟" className="w-full p-5 rounded-[1.5rem] border-2 border-white/5 bg-white/5 focus:border-medical-500 focus:bg-white/10 outline-none font-black text-xl transition-all placeholder:text-slate-700 text-white" required />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-400 flex items-center gap-2 mr-2">المادة العلمية</label>
                  <div className="relative group">
                    <BookOpen className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600 group-focus-within:text-medical-500 transition-colors" />
                    <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full p-5 pr-14 rounded-[1.5rem] border-2 border-white/5 bg-white/5 focus:border-medical-500 focus:bg-white/10 outline-none font-bold text-lg appearance-none transition-all text-white">
                      <option value="" className="bg-[#0a0f1d]">نقاش عام</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id} className="bg-[#0a0f1d]">{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-400 flex items-center gap-2 mr-2">المحتوى</label>
                  <textarea placeholder="اكتب نقاشك هنا..." value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full p-6 rounded-[1.8rem] border-2 border-white/5 bg-white/5 focus:border-medical-500 focus:bg-white/10 outline-none font-bold text-lg transition-all resize-none placeholder:text-slate-700 text-white" required />
                </div>

                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3">
                   <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                   <p className="text-[11px] text-red-400 font-bold leading-tight">تنبيه: هذا المنشور مؤقت وسيتم حذفه تلقائياً من المجتمع بعد **5 ساعات** من الآن.</p>
                </div>

                <button type="submit" disabled={loading || !title || !content} className="w-full group relative overflow-hidden bg-gradient-to-r from-medical-600 to-indigo-600 text-white font-black py-6 rounded-[1.8rem] transition-all shadow-2xl shadow-medical-600/30 flex items-center justify-center gap-3 disabled:opacity-50">
                  <span className="relative z-10 flex items-center gap-3 text-xl">
                    {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Send className="w-6 h-6 -rotate-45" />}
                    {editPost ? "حفظ التعديلات" : "إطلاق المنشور"}
                  </span>
                </button>
              </form>
              <p className="text-[10px] text-center text-slate-600 font-bold">تذكر: سيتم حذف هذا المنشور تلقائياً بعد 5 ساعات من الآن.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
