"use client";

import { useState, useEffect } from "react";
import { User, Clock, MessageCircle, Send, ArrowRight, Trash2, ShieldCheck, Flag, Heart, Eye, Edit3, X, Check, Reply, Instagram, Facebook } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { addComment, deleteDiscussionComment, toggleLike, updateDiscussion, deleteDiscussion } from "@/app/actions/community";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export default function DiscussionViewClient({ discussion, user }: { discussion: any, user: any }) {
  const [commentContent, setCommentContent] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(discussion.title);
  const [editContent, setEditContent] = useState(discussion.content);
  const [mounted, setMounted] = useState(false);
  
  // Optimistic UI States
  const [optLiked, setOptLiked] = useState<boolean | null>(null);
  const [optCount, setOptCount] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLiked = optLiked !== null ? optLiked : discussion.likes?.some((l: any) => l.userId === user?.id);
  const likeCount = optCount !== null ? optCount : discussion.likes?.length || 0;

  const handleAddComment = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    const content = parentId ? replyContent : commentContent;
    if (!content || !user) return;

    setLoading(true);
    const res = await addComment(user.id, discussion.id, content, parentId);
    if (res.success) {
      if (parentId) {
        setReplyToId(null);
        setReplyContent("");
      } else {
        setCommentContent("");
      }
      router.refresh();
    }
    setLoading(false);
  };

  const handleDeleteComment = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا التعليق؟")) {
      const res = await deleteDiscussionComment(id, user.id, discussion.id);
      if (res.success) router.refresh();
    }
  };

  const handleToggleLike = async () => {
    if (!user) return;
    setOptLiked(!isLiked);
    setOptCount(isLiked ? Math.max(0, likeCount - 1) : likeCount + 1);
    await toggleLike(user.id, discussion.id);
    router.refresh();
  };

  const handleSaveEdit = async () => {
    if (!editTitle || !editContent) return;
    setLoading(true);
    const res = await updateDiscussion(discussion.id, user.id, editTitle, editContent);
    if (res.success) {
      setIsEditing(false);
      router.refresh();
    }
    setLoading(false);
  };

  const handleDeletePost = async () => {
    if (confirm("هل أنت متأكد من حذف منشورك؟")) {
      const res = await deleteDiscussion(discussion.id, user.id);
      if (res.success) router.push("/community");
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] py-12 px-4 relative overflow-hidden text-white font-cairo">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#0ea5e915,transparent)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Navigation */}
        <Link href="/community" className="inline-flex items-center gap-3 text-slate-500 hover:text-medical-400 transition-all mb-10 font-black group">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-medical-500/10 transition-all">
             <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
          العودة للمجتمع
        </Link>

        {/* Main Post Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] backdrop-blur-2xl rounded-[3.5rem] p-8 md:p-14 border border-white/10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] mb-12 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-xl">
                {discussion.user?.image ? (
                  <img src={discussion.user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-800">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <h4 className="font-black text-white text-xl">{discussion.user?.name || "طالب آورا"}</h4>
                  <div className="flex items-center gap-2">
                    {discussion.user?.telegram && (
                      <a href={discussion.user.telegram.startsWith('http') ? discussion.user.telegram : `https://t.me/${discussion.user.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-sky-500/10 text-sky-500 rounded-lg hover:bg-sky-500 hover:text-white transition-all shadow-sm" title="Telegram">
                        <Send className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {discussion.user?.instagram && (
                      <a href={discussion.user.instagram.startsWith('http') ? discussion.user.instagram : `https://instagram.com/${discussion.user.instagram}`} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-pink-500/10 text-pink-500 rounded-lg hover:bg-pink-500 hover:text-white transition-all shadow-sm" title="Instagram">
                        <Instagram className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {discussion.user?.facebook && (
                      <a href={discussion.user.facebook.startsWith('http') ? discussion.user.facebook : `https://facebook.com/${discussion.user.facebook}`} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-blue-600/10 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Facebook">
                        <Facebook className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 font-bold mt-1">
                  <div className="flex items-center gap-1.5">
                     <Clock className="w-4 h-4" />
                     {mounted ? formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true, locale: ar }) : "..."}
                  </div>
                  <div className="flex items-center gap-1.5 text-medical-400">
                     <Eye className="w-4 h-4" />
                     {discussion.views} مشاهدة
                  </div>
                </div>
              </div>
            </div>

            {user?.id === discussion.userId && !isEditing && (
              <div className="flex items-center gap-2">
                 <button onClick={() => setIsEditing(true)} className="p-3 bg-white/5 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-2xl transition-all" title="تعديل المنشور">
                    <Edit3 className="w-5 h-5" />
                 </button>
                 <button onClick={handleDeletePost} className="p-3 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-2xl transition-all" title="حذف المنشور">
                    <Trash2 className="w-5 h-5" />
                 </button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                 <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-black/40 border-2 border-medical-500/30 p-5 rounded-2xl outline-none font-black text-2xl text-white" title="عنوان المنشور" aria-label="عنوان المنشور" />
                 <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={6} className="w-full bg-black/40 border-2 border-medical-500/30 p-5 rounded-2xl outline-none font-bold text-lg text-slate-300 resize-none" title="محتوى المنشور" aria-label="محتوى المنشور" />
                 <div className="flex items-center gap-4">
                    <button onClick={handleSaveEdit} className="flex-1 py-4 bg-medical-600 text-white rounded-2xl font-black flex items-center justify-center gap-2"><Check className="w-5 h-5" /> حفظ التغييرات</button>
                    <button onClick={() => setIsEditing(false)} className="px-8 py-4 bg-white/5 text-slate-400 rounded-2xl font-black">إلغاء</button>
                 </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight tracking-tight italic">{discussion.title}</h1>
                <div className="prose prose-invert max-w-none mb-12">
                  <p className="text-slate-300 text-xl leading-relaxed whitespace-pre-wrap font-bold opacity-90">{discussion.content}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-10 border-t border-white/5">
            <div className="flex items-center gap-8">
              <button 
                onClick={handleToggleLike}
                className={`flex items-center gap-3 transition-all duration-300 transform active:scale-125 font-black px-6 py-3 rounded-2xl border ${isLiked ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-white/5 border-white/5 text-slate-400 hover:text-red-400"}`}
              >
                <motion.div
                  whileTap={{ scale: 1.5 }}
                  animate={{ 
                    scale: isLiked ? [1, 1.4, 1] : 1,
                    filter: isLiked 
                      ? ["drop-shadow(0 0 0px #ef4444)", "drop-shadow(0 0 15px #ef4444)", "drop-shadow(0 0 0px #ef4444)"] 
                      : "none"
                  }}
                  transition={{ 
                    scale: { type: "spring", stiffness: 300, duration: 0.4 },
                    filter: { duration: 0.4, ease: "easeInOut" }
                  }}
                >
                  <Heart className={`w-7 h-7 transition-colors duration-300 ${isLiked ? "fill-current" : ""}`} />
                </motion.div>
                <span className="text-2xl">{likeCount}</span>
              </button>
              <div className="flex items-center gap-3 text-slate-400 font-black">
                 <MessageCircle className="w-7 h-7" />
                 <span className="text-2xl">{discussion.comments?.length || 0}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <div className="space-y-12 px-4">
          <h3 className="text-3xl font-black text-white flex items-center gap-4">
            التعليقات والمناقشات
            <div className="h-1 flex-1 bg-gradient-to-r from-medical-500/30 to-transparent rounded-full" />
          </h3>

          <div className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
            <form onSubmit={(e) => handleAddComment(e)} className="flex flex-col sm:flex-row gap-6">
               <div className="flex-1">
                  <textarea placeholder="أضف رأيك أو إجابتك هنا..." value={commentContent} onChange={(e) => setCommentContent(e.target.value)} rows={2} className="w-full p-5 rounded-[1.8rem] bg-black/40 border-2 border-transparent focus:border-medical-500 outline-none transition-all font-bold text-lg text-white resize-none" />
               </div>
               <button type="submit" disabled={loading || !commentContent} className="h-16 px-10 bg-gradient-to-r from-medical-600 to-indigo-600 text-white rounded-[1.8rem] flex items-center justify-center gap-3 shadow-xl shadow-medical-600/20 disabled:opacity-50 transition-all font-black text-xl">
                  <span>تعليق</span><Send className="w-6 h-6 -rotate-45" />
               </button>
            </form>
          </div>

          <div className="space-y-8">
            <AnimatePresence initial={false}>
              {discussion.comments?.map((comment: any, idx: number) => (
                <motion.div 
                  key={comment.id} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                  className="space-y-4"
                >
                  <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 relative group hover:bg-white/[0.04] transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                           {comment.user?.image ? <img src={comment.user.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-800"><User className="w-6 h-6" /></div>}
                        </div>
                        <div>
                           <div className="flex items-center gap-3">
                              <h5 className="font-black text-white text-lg">{comment.user?.name || "طالب آورا"}</h5>
                              <div className="flex items-center gap-1.5">
                                {comment.user?.telegram && (
                                  <a href={comment.user.telegram.startsWith('http') ? comment.user.telegram : `https://t.me/${comment.user.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-400" title="Telegram">
                                    <Send className="w-3 h-3" />
                                  </a>
                                )}
                                {comment.user?.instagram && (
                                  <a href={comment.user.instagram.startsWith('http') ? comment.user.instagram : `https://instagram.com/${comment.user.instagram}`} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-400" title="Instagram">
                                    <Instagram className="w-3 h-3" />
                                  </a>
                                )}
                                {comment.user?.facebook && (
                                  <a href={comment.user.facebook.startsWith('http') ? comment.user.facebook : `https://facebook.com/${comment.user.facebook}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500" title="Facebook">
                                    <Facebook className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                           </div>
                           <span className="text-xs text-slate-500 font-bold">{mounted ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ar }) : "..."}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)} className="p-3 text-slate-500 hover:text-medical-400 hover:bg-medical-500/10 rounded-2xl transition-all flex items-center gap-2 font-black text-xs">
                           <Reply className="w-4 h-4" /> رد
                        </button>
                        {(user?.id === comment.userId || user?.role === "ADMIN") && (
                          <button onClick={() => handleDeleteComment(comment.id)} className="p-3 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all" title="حذف التعليق"><Trash2 className="w-5 h-5" /></button>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-300 text-lg font-bold leading-relaxed pr-4 border-r-2 border-medical-500/30">{comment.content}</p>

                    <AnimatePresence>
                      {replyToId === comment.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-6 pt-6 border-t border-white/5">
                           <form onSubmit={(e) => handleAddComment(e, comment.id)} className="flex gap-4">
                              <input autoFocus placeholder={`الرد على ${comment.user?.name}...`} value={replyContent} onChange={(e) => setReplyContent(e.target.value)} className="flex-1 bg-black/40 border border-white/10 p-4 rounded-2xl outline-none focus:border-medical-500 text-sm font-bold text-white" />
                              <button type="submit" disabled={!replyContent || loading} className="p-4 bg-medical-600 text-white rounded-2xl hover:bg-medical-500 transition-all" title="إرسال الرد"><Send className="w-5 h-5 -rotate-45" /></button>
                           </form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mr-12 space-y-4 border-r-2 border-white/5 pr-6">
                    <AnimatePresence initial={false}>
                      {comment.replies?.map((reply: any) => (
                        <motion.div 
                          key={reply.id} 
                          initial={{ opacity: 0, scale: 0.9, x: 20 }} 
                          animate={{ opacity: 1, scale: 1, x: 0 }} 
                          exit={{ opacity: 0, scale: 0.9, x: 20 }}
                          transition={{ duration: 0.4 }}
                          className="bg-white/[0.01] p-6 rounded-[2rem] border border-white/5 relative hover:bg-white/[0.03] transition-all"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 border border-white/10">
                                 {reply.user?.image ? <img src={reply.user.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-800"><User className="w-5 h-5" /></div>}
                              </div>
                              <div>
                                 <h6 className="font-black text-white text-sm">{reply.user?.name || "طالب آورا"}</h6>
                                 <span className="text-[10px] text-slate-600 font-bold">{mounted ? formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: ar }) : "..."}</span>
                              </div>
                            </div>
                            {(user?.id === reply.userId || user?.role === "ADMIN") && (
                              <button onClick={() => handleDeleteComment(reply.id)} className="p-2 text-slate-700 hover:text-red-400 transition-all" title="حذف الرد"><Trash2 className="w-4 h-4" /></button>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm font-bold leading-relaxed">{reply.content}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {discussion.comments?.length === 0 && (
               <div className="text-center py-16 text-slate-600 font-black text-xl italic">لا توجد ردود بعد. كسر الجليد وابدأ النقاش!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
