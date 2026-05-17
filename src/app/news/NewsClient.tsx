"use client";

import { useState } from "react";
import { Newspaper, Calendar, X, ChevronRight, Video, Link as LinkIcon, Send, MessageCircle, User as UserIcon, CornerDownLeft, Reply, Trash2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addNewsComment, deleteNewsComment } from "@/app/actions/news";

export default function NewsClient({ news, userId, isAdmin = false }: { news: any[], userId?: string, isAdmin?: boolean }) {
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; userName: string } | null>(null);

  // لمنع التمرير في الخلفية عند فتح النافذة
  if (typeof window !== "undefined") {
    if (selectedNews) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const parseUrls = (urlStr: string) => {
    if (!urlStr) return [];
    try {
      const parsed = JSON.parse(urlStr);
      if (Array.isArray(parsed)) return parsed;
      return [urlStr];
    } catch {
      return [urlStr];
    }
  };

  const getCommentsCount = (newsItem: any) => {
    if (!newsItem.comments) return 0;
    let count = newsItem.comments.length;
    newsItem.comments.forEach((c: any) => {
      if (c.replies) count += c.replies.length;
    });
    return count;
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !userId || !selectedNews) return;

    setIsSubmitting(true);
    const result = await addNewsComment(selectedNews.id, commentText, replyTo?.id);
    
    if (result.success && result.comment) {
      if (replyTo) {
        // Find the parent comment and add this reply to its replies array
        const updatedComments = (selectedNews.comments || []).map((c: any) => {
          if (c.id === replyTo.id) {
            return {
              ...c,
              replies: [...(c.replies || []), result.comment]
            };
          }
          return c;
        });
        setSelectedNews({
          ...selectedNews,
          comments: updatedComments
        });
        setReplyTo(null);
      } else {
        // Add to main comments list
        const updatedNews = {
          ...selectedNews,
          comments: [result.comment, ...(selectedNews.comments || [])]
        };
        setSelectedNews(updatedNews);
      }
      setCommentText("");
    } else {
      alert(result.error || "حدث خطأ أثناء إضافة التعليق");
    }
    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string, parentId?: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا التعليق؟")) return;

    const result = await deleteNewsComment(commentId);
    if (result.success) {
      if (parentId) {
        // Reply deleted
        const updatedComments = (selectedNews.comments || []).map((c: any) => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: (c.replies || []).filter((r: any) => r.id !== commentId)
            };
          }
          return c;
        });
        setSelectedNews({
          ...selectedNews,
          comments: updatedComments
        });
      } else {
        // Root comment deleted
        const updatedNews = {
          ...selectedNews,
          comments: (selectedNews.comments || []).filter((c: any) => c.id !== commentId)
        };
        setSelectedNews(updatedNews);
      }
    } else {
      alert(result.error || "حدث خطأ أثناء حذف التعليق");
    }
  };

  const commentAnimation = {
    hidden: { opacity: 0, scale: 0.85, y: 25 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 450, damping: 22 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: -15, 
      transition: { duration: 0.15 } 
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 pb-24 relative z-10 -mt-8">
        <div className="max-w-6xl mx-auto">
          {news.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/30 backdrop-blur-sm rounded-[3rem] border border-slate-700/50 max-w-4xl mx-auto">
              <Newspaper className="w-20 h-20 text-slate-600 mx-auto mb-6 opacity-50" />
              <h2 className="text-2xl font-black text-slate-400">لا توجد أخبار حالياً</h2>
              <p className="text-slate-500 mt-2 font-bold">سنقوم بنشر التحديثات هنا قريباً، ابق على تواصل!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => {
                const videos = parseUrls(item.videoUrl);
                const files = parseUrls(item.fileUrl);
                const totalCommentsCount = getCommentsCount(item);

                return (
                  <motion.article 
                    key={item.id}
                    whileHover={{ y: -5 }}
                    onClick={() => { setSelectedNews(item); setReplyTo(null); }}
                    className="bg-slate-800/40 backdrop-blur-md rounded-[2rem] border border-slate-700/50 overflow-hidden hover:border-medical-500/50 hover:shadow-[0_0_30px_-10px_rgba(14,165,233,0.3)] transition-all duration-300 cursor-pointer group flex flex-col h-full relative"
                  >
                    {/* Badges for Links/Videos */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                      {videos.length > 0 && (
                        <div className="bg-red-500/80 backdrop-blur-md text-white p-2 rounded-xl shadow-lg border border-red-500/50 flex items-center gap-1.5" title={`${videos.length} فيديو`}>
                          <Video className="w-4 h-4" />
                          {videos.length > 1 && <span className="text-[10px] font-black leading-none">{videos.length}</span>}
                        </div>
                      )}
                      {files.length > 0 && (
                        <div className="bg-blue-500/80 backdrop-blur-md text-white p-2 rounded-xl shadow-lg border border-blue-500/50 flex items-center gap-1.5" title={`${files.length} مرفق`}>
                          <LinkIcon className="w-4 h-4" />
                          {files.length > 1 && <span className="text-[10px] font-black leading-none">{files.length}</span>}
                        </div>
                      )}
                    </div>

                    {item.image ? (
                      <div className="w-full h-48 relative overflow-hidden bg-slate-900 border-b border-slate-700/50 shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-slate-700/50 shrink-0 flex items-center justify-center relative overflow-hidden">
                        <Newspaper className="w-16 h-16 text-slate-700 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-medical-500/5 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-medical-500/10 text-medical-400 text-[10px] font-black rounded-full border border-medical-500/20">
                          إعلان
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
                          <Calendar className="w-3.5 h-3.5" />
                          <time dateTime={item.createdAt}>
                            {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                          </time>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-black text-white mb-3 leading-tight group-hover:text-medical-400 transition-colors line-clamp-2">
                        {item.title}
                      </h2>
                      
                      <div className="text-slate-400 font-bold text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                        {item.content}
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-slate-700/50 pt-4">
                        <div className="flex items-center gap-2 text-medical-400 text-sm font-black group-hover:gap-3 transition-all">
                          <span>التفاصيل</span>
                          <ChevronRight className="w-4 h-4 rotate-180" />
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{totalCommentsCount} تعليق</span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal for full content */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNews(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-[#0f172a] rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-slate-700/50 flex flex-col"
            >
              <div className="absolute top-4 right-4 z-20">
                <button 
                  onClick={() => setSelectedNews(null)}
                  className="p-2.5 bg-black/40 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all shadow-lg"
                  title="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto custom-scrollbar flex-1 relative flex flex-col lg:flex-row">
                
                {/* News Details (Right Side) */}
                <div className="flex-1 min-h-[50vh] border-b lg:border-b-0 lg:border-l border-slate-700/50">
                  {(() => {
                    const videos = parseUrls(selectedNews.videoUrl);
                    if (videos.length > 0) {
                      return (
                        <div className="w-full shrink-0 flex flex-col border-b border-slate-800">
                          {videos.map((vid, idx) => {
                            const ytId = getYouTubeId(vid);
                            return (
                              <div key={idx} className={`w-full aspect-video relative bg-black shrink-0 ${idx > 0 ? 'border-t border-slate-800' : ''}`}>
                                {ytId ? (
                                  <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${ytId}`}
                                    allowFullScreen
                                    title={`Video preview ${idx + 1}`}
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <Video className="w-12 h-12 text-slate-600" />
                                    <a href={vid} target="_blank" rel="noopener noreferrer" className="text-medical-400 hover:underline font-bold">
                                      فتح رابط الفيديو الخارجي {videos.length > 1 ? idx + 1 : ''}
                                    </a>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    } else if (selectedNews.image) {
                      return (
                        <div className="w-full h-64 sm:h-80 relative shrink-0">
                          <img 
                            src={selectedNews.image} 
                            alt={selectedNews.title} 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
                        </div>
                      );
                    }
                    return null;
                  })()}
                  
                  <div className={`p-8 ${!selectedNews.image && parseUrls(selectedNews.videoUrl).length === 0 ? 'pt-16' : ''}`}>
                    <div className="flex items-center gap-4 mb-6 flex-wrap">
                      <span className="px-4 py-1.5 bg-medical-500/10 text-medical-400 text-xs font-black rounded-full border border-medical-500/20 shadow-sm">
                        إعلان هام
                      </span>
                      <div className="flex items-center gap-2 text-sm text-slate-400 font-bold">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={selectedNews.createdAt}>
                          {new Date(selectedNews.createdAt).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-8 leading-tight">
                      {selectedNews.title}
                    </h2>
                    
                    <div className="text-slate-300 font-bold text-base leading-loose whitespace-pre-wrap opacity-95 mb-8">
                      {selectedNews.content}
                    </div>

                    {(() => {
                      const files = parseUrls(selectedNews.fileUrl);
                      if (files.length > 0) {
                        return (
                          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-800">
                            {files.map((file, idx) => (
                              <a 
                                key={idx}
                                href={file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black transition-all border border-slate-700 shadow-lg flex-1 min-w-[200px]"
                              >
                                <LinkIcon className="w-5 h-5 text-blue-400" />
                                {files.length > 1 ? `المرفق رقم ${idx + 1}` : 'فتح المرفق / الملف المرتبط'}
                              </a>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>

                {/* Comments Section (Left Side) */}
                <div className="w-full lg:w-96 bg-[#0B1120] flex flex-col h-[50vh] lg:h-auto shrink-0 relative">
                  <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-medical-500" />
                    <h3 className="text-lg font-black text-white">التعليقات</h3>
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg text-xs font-bold">
                      {getCommentsCount(selectedNews)}
                    </span>
                  </div>

                  {/* Gorgeous Warning Banner for comment deletion */}
                  <div className="mx-6 mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2 text-xs text-amber-500 font-black">
                    <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-500 animate-pulse" />
                    <p className="leading-relaxed">
                      ملاحظة: تُحذف التعليقات والردود تلقائياً كل 4 ساعات لتنشيط التفاعل والحفاظ على الخصوصية.
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {(!selectedNews.comments || selectedNews.comments.length === 0) ? (
                      <div className="text-center py-10 opacity-50">
                        <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400 font-bold text-sm">كن أول من يشارك برأيه!</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <AnimatePresence initial={false}>
                          {selectedNews.comments.map((comment: any) => (
                            <motion.div 
                              key={comment.id}
                              variants={commentAnimation}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              layout
                              className="space-y-4"
                            >
                              {/* Main Comment */}
                              <div className="flex gap-3 relative group">
                                <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0 overflow-hidden flex items-center justify-center border border-slate-700">
                                  {comment.user?.image ? (
                                    <img src={comment.user.image} alt={comment.user.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <UserIcon className="w-5 h-5 text-slate-500" />
                                  )}
                                </div>
                                <div className="flex-1 bg-slate-800/50 p-4 rounded-2xl rounded-tr-sm border border-slate-700/50 hover:border-slate-600 transition-colors relative">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-black text-sm text-slate-200">
                                      {comment.user?.name || 'مستخدم غير معروف'}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-bold">
                                      {new Date(comment.createdAt).toLocaleDateString('ar-EG')}
                                    </span>
                                  </div>
                                  <p className="text-slate-300 text-sm font-bold leading-relaxed">
                                    {comment.content}
                                  </p>
                                  
                                  {/* Actions: Reply and Delete */}
                                  {(userId || isAdmin) && (
                                    <div className="flex items-center gap-3 mt-3 border-t border-slate-700/30 pt-2">
                                      {userId && (
                                        <button 
                                          onClick={() => setReplyTo({ id: comment.id, userName: comment.user?.name || 'مستخدم غير معروف' })}
                                          className="inline-flex items-center gap-1 text-[10px] font-black text-medical-400 hover:text-medical-300 transition-colors"
                                        >
                                          <CornerDownLeft className="w-3 h-3" />
                                          <span>رد</span>
                                        </button>
                                      )}
                                      {(comment.userId === userId || isAdmin) && (
                                        <button 
                                          onClick={() => handleDeleteComment(comment.id)}
                                          className="inline-flex items-center gap-1 text-[10px] font-black text-red-500 hover:text-red-400 transition-colors mr-auto"
                                          title="حذف التعليق"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                          <span>حذف</span>
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Replies Container */}
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="mr-6 pr-4 border-r-2 border-slate-800/80 space-y-4 relative">
                                  <AnimatePresence initial={false}>
                                    {comment.replies.map((reply: any) => (
                                      <motion.div 
                                        key={reply.id}
                                        variants={commentAnimation}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        layout
                                        className="flex gap-2 relative mt-2"
                                      >
                                        {/* Nested branch line decoration */}
                                        <div className="absolute -right-4 top-5 w-4 h-0.5 bg-slate-800/80" />

                                        <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0 overflow-hidden flex items-center justify-center border border-slate-700">
                                          {reply.user?.image ? (
                                            <img src={reply.user.image} alt={reply.user.name} className="w-full h-full object-cover" />
                                          ) : (
                                            <UserIcon className="w-4 h-4 text-slate-500" />
                                          )}
                                        </div>
                                        <div className="flex-1 bg-slate-800/30 p-3.5 rounded-2xl rounded-tr-sm border border-slate-800 relative">
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="font-black text-xs text-slate-300 flex items-center gap-1">
                                              {reply.user?.name || 'مستخدم غير معروف'}
                                              <span className="px-1.5 py-0.5 bg-slate-800 text-slate-500 text-[8px] font-black rounded uppercase">رد</span>
                                            </span>
                                            <span className="text-[9px] text-slate-500 font-bold">
                                              {new Date(reply.createdAt).toLocaleDateString('ar-EG')}
                                            </span>
                                          </div>
                                          <p className="text-slate-300 text-xs font-bold leading-relaxed">
                                            {reply.content}
                                          </p>

                                          {/* Delete reply action */}
                                          {(reply.userId === userId || isAdmin) && (
                                            <div className="flex items-center justify-end mt-2 pt-1 border-t border-slate-800/50">
                                              <button 
                                                onClick={() => handleDeleteComment(reply.id, comment.id)}
                                                className="inline-flex items-center gap-1 text-[9px] font-black text-red-500 hover:text-red-400 transition-colors"
                                                title="حذف الرد"
                                              >
                                                <Trash2 className="w-2.5 h-2.5" />
                                                <span>حذف</span>
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </motion.div>
                                    ))}
                                  </AnimatePresence>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  {userId ? (
                    <div className="p-4 border-t border-slate-800 bg-[#0f172a] space-y-3">
                      {/* Active Reply Banner */}
                      <AnimatePresence>
                        {replyTo && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0, y: 10 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: 10 }}
                            className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 flex items-center justify-between text-xs text-amber-400 font-bold overflow-hidden"
                          >
                            <span className="flex items-center gap-1.5">
                              <Reply className="w-3.5 h-3.5 rotate-180" />
                              <span>الرد على تعليق @{replyTo.userName}</span>
                            </span>
                            <button onClick={() => setReplyTo(null)} className="p-1 hover:bg-slate-800 rounded-md transition-colors" title="إلغاء الرد" aria-label="إلغاء الرد">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <form onSubmit={handleAddComment} className="flex gap-2">
                        <input 
                          type="text" 
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder={replyTo ? `اكتب ردك على ${replyTo.userName}...` : "اكتب تعليقك هنا..."}
                          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-medical-500 transition-colors"
                        />
                        <button 
                          type="submit"
                          disabled={!commentText.trim() || isSubmitting}
                          className="bg-medical-600 hover:bg-medical-700 text-white p-3 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="إرسال التعليق"
                          aria-label="إرسال التعليق"
                        >
                          <Send className="w-5 h-5 rotate-180" />
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="p-6 border-t border-slate-800 bg-[#0f172a] text-center">
                      <p className="text-sm text-slate-400 font-bold mb-3">يجب تسجيل الدخول لإضافة تعليق</p>
                      <a href="/login" className="inline-block bg-slate-800 hover:bg-slate-700 text-white text-sm font-black px-6 py-2 rounded-full transition-colors">
                        تسجيل الدخول
                      </a>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
