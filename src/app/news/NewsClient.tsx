"use client";

import { useState, useEffect } from "react";
import { Newspaper, Calendar, X, ChevronRight, Video, Link as LinkIcon, Send, MessageCircle, User as UserIcon, CornerDownLeft, Reply, Trash2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addNewsComment, deleteNewsComment } from "@/app/actions/news";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleProvider.client";

export default function NewsClient({ news, userId, isAdmin = false }: { news: any[], userId?: string, isAdmin?: boolean }) {
  const { t } = useLocale();
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; userName: string } | null>(null);
  const router = useRouter();

  // Refresh to update the layout (clear the unread news badge)
  useEffect(() => {
    router.refresh();
  }, [router]);

  // Prevent background scrolling while the modal is open
  useEffect(() => {
    if (selectedNews) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedNews]);

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
      alert(result.error || t("news_add_comment_error", "An error occurred while adding the comment"));
    }
    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string, parentId?: string) => {
    if (!confirm(t("news_confirm_delete_comment", "Are you sure you want to delete this comment?"))) return;

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
      alert(result.error || t("news_delete_comment_error", "An error occurred while deleting the comment"));
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
              <h2 className="text-2xl font-black text-slate-400">{t("news_no_news_title","No news at the moment")}</h2>
              <p className="text-slate-500 mt-2 font-bold">{t("news_no_news_description","We will post updates here soon, stay tuned!")}</p>
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
                    className="bg-white dark:bg-slate-800/40 backdrop-blur-md rounded-[2rem] border border-slate-200 dark:border-slate-700/50 overflow-hidden hover:border-medical-500/50 hover:shadow-[0_0_30px_-10px_rgba(14,165,233,0.3)] transition-all duration-300 cursor-pointer group flex flex-col h-full relative shadow-sm"
                  >
                    {/* Badges for Links/Videos */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                      {videos.length > 0 && (
                        <div className="bg-red-500/80 backdrop-blur-md text-white p-2 rounded-xl shadow-lg border border-red-500/50 flex items-center gap-1.5" title={`${videos.length} ${t("news_video_count_label", "video")}`}>
                          <Video className="w-4 h-4" />
                          {videos.length > 1 && <span className="text-[10px] font-black leading-none">{videos.length}</span>}
                        </div>
                      )}
                      {files.length > 0 && (
                        <div className="bg-blue-500/80 backdrop-blur-md text-white p-2 rounded-xl shadow-lg border border-blue-500/50 flex items-center gap-1.5" title={`${files.length} ${t("news_attachment_count_label", "attachment")}`}>
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
                          <span className="px-3 py-1 bg-medical-500/10 text-medical-600 dark:text-medical-400 text-[10px] font-black rounded-full border border-medical-500/20">
                          {t("news_badge","Announcement")}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                          <Calendar className="w-3.5 h-3.5" />
                          <time dateTime={typeof item.createdAt === 'string' ? item.createdAt : new Date(item.createdAt).toISOString()}>
                            {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                          </time>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-medical-500 dark:group-hover:text-medical-400 transition-colors line-clamp-2">
                        {item.title}
                      </h2>
                      
                      <div className="text-slate-600 dark:text-slate-400 font-bold text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                        {item.content}
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50 pt-4">
                        <div className="flex items-center gap-2 text-medical-600 dark:text-medical-400 text-sm font-black group-hover:gap-3 transition-all">
                          <span>{t("news_details","Details")}</span>
                          <ChevronRight className="w-4 h-4 rotate-180" />
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-500 font-bold text-xs">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{totalCommentsCount} {t("news_comment_label","Comment")}</span>
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
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-5xl max-h-[95vh] overflow-hidden bg-gradient-to-b from-white via-slate-50 to-gray-100 dark:from-[#0f172a] dark:via-[#1a1f3a] dark:to-[#0b1220] rounded-[3rem] shadow-[0_25px_80px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_80px_-20px_rgba(14,165,233,0.3)] border border-slate-200 dark:border-slate-700/60 flex flex-col"
            >
              <div className="absolute top-6 right-6 z-20">
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedNews(null)}
                  className="p-3 bg-red-100 hover:bg-red-200 dark:bg-gradient-to-br dark:from-red-500/20 dark:to-red-600/20 dark:hover:from-red-500/40 dark:hover:to-red-600/40 text-red-600 dark:text-white rounded-full backdrop-blur-md transition-all shadow-lg border border-red-300 dark:border-red-500/30 hover:border-red-400 dark:hover:border-red-500/50"
                  title={t("close","Close")}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="overflow-y-auto custom-scrollbar flex-1 relative flex flex-col">
                
                {/* News Details (Top Section) */}
                <div className="flex-none">
                  {/* Media Section */}
                  {(() => {
                    const videos = parseUrls(selectedNews.videoUrl);
                    const validVideos = videos.filter((vid: string) => getYouTubeId(vid));
                    
                    if (validVideos.length > 0) {
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: -30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className="w-full shrink-0 flex flex-col border-b border-slate-300 dark:border-slate-700/50"
                        >
                          {validVideos.map((vid: string, idx: number) => {
                            const ytId = getYouTubeId(vid);
                            return (
                              <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.15 + idx * 0.1 }}
                                className={`w-full aspect-video relative bg-slate-900 dark:bg-slate-950 shrink-0 overflow-hidden ${idx > 0 ? 'border-t border-slate-300 dark:border-slate-700/50' : ''}`}
                              >
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent pointer-events-none z-10" />
                                <iframe
                                  className="w-full h-full"
                                  src={`https://www.youtube.com/embed/${ytId}`}
                                  allowFullScreen
                                  title={`Video preview ${idx + 1}`}
                                />
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      );
                    } else if (selectedNews.image) {
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: -40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className="w-full h-80 sm:h-96 relative shrink-0 overflow-hidden group"
                        >
                          <motion.img 
                            initial={{ scale: 1.05, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            whileHover={{ scale: 1.02 }}
                            src={selectedNews.image} 
                            alt={selectedNews.title} 
                            className="w-full h-full object-cover transition-transform duration-700" 
                          />
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent group-hover:from-blue-500/20 transition-all duration-700" />
                        </motion.div>
                      );
                    }
                    return null;
                  })()}
                  
                  {/* Content Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                      className="p-8 sm:p-12 bg-gradient-to-br from-white via-gray-50 to-transparent dark:from-slate-900/50 dark:via-slate-900/30 dark:to-transparent"
                  >
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex items-center gap-4 mb-8 flex-wrap"
                    >
                      <motion.span 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, delay: 0.35 }}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-medical-500/20 dark:to-medical-600/20 text-blue-700 dark:text-medical-300 text-xs font-black rounded-full border border-blue-300 dark:border-medical-500/40 shadow-lg shadow-blue-500/10 dark:shadow-medical-500/10 hover:from-blue-200 hover:to-blue-300 dark:hover:from-medical-500/30 dark:hover:to-medical-600/30 transition-all"
                      >
                        {t("news_important_announcement", "Important announcement")}
                      </motion.span>
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-bold bg-gray-100 dark:bg-slate-800/40 px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700/50"
                      >
                        <Calendar className="w-4 h-4 text-medical-400" />
                        <time dateTime={typeof selectedNews.createdAt === 'string' ? selectedNews.createdAt : new Date(selectedNews.createdAt).toISOString()}>
                          {new Date(selectedNews.createdAt).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </motion.div>
                    </motion.div>
                    
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.35 }}
                      className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-400 mb-10 leading-tight"
                    >
                      {selectedNews.title}
                    </motion.h2>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-slate-700 dark:text-slate-300 font-bold text-lg leading-loose whitespace-pre-wrap opacity-95 mb-10 border-l-4 border-blue-300 dark:border-medical-500/50 pl-6 py-4 bg-blue-50 dark:bg-slate-800/20 rounded-r-xl"
                    >
                      {selectedNews.content}
                    </motion.div>

                    {(() => {
                      const files = parseUrls(selectedNews.fileUrl);
                      if (files.length > 0) {
                        return (
                          <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.45 }}
                            className="flex flex-wrap gap-4 mt-10 pt-10 border-t border-slate-700/50"
                          >
                            {files.map((file, idx) => (
                              <motion.a 
                                key={idx}
                                whileHover={{ y: -3, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href={file}
                                target="_self"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.5 + idx * 0.05 }}
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-600/30 dark:to-blue-700/30 hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-600/50 dark:hover:to-blue-700/50 text-blue-700 dark:text-white rounded-2xl font-black transition-all border border-blue-300 dark:border-blue-500/40 hover:border-blue-400 dark:hover:border-blue-500/60 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/20 hover:shadow-blue-500/40 dark:hover:shadow-blue-500/40 flex-1 min-w-[220px] group"
                              >
                                <LinkIcon className="w-5 h-5 text-blue-500 dark:text-blue-300 group-hover:scale-110 transition-transform" />
                                <span>
                                  {files.length > 1 ? `${t("news_attachment_number","Attachment") } ${idx + 1}` : t("news_attachment_open","Open attachment / linked file")}
                                </span>
                              </motion.a>
                            ))}
                          </motion.div>
                        );
                      }
                      return null;
                    })()}
                  </motion.div>
                </div>

                {/* Comments Section (Bottom Section) */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                  className="w-full bg-gradient-to-b from-gray-50 dark:from-slate-900/30 to-gray-100 dark:to-[#0B1120] flex flex-col flex-1 relative border-t border-slate-300 dark:border-slate-700/50"
                >
                  {/* Header */}
                  <motion.div 
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="p-8 border-b border-slate-300 dark:border-slate-700/50 flex items-center gap-4 sticky top-0 bg-gradient-to-r from-gray-50 dark:from-[#0B1120]/95 to-gray-100 dark:to-[#0f172a]/95 backdrop-blur-xl z-10"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <MessageCircle className="w-6 h-6 text-medical-500" />
                    </motion.div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">{t("news_comments","Comments")}</h3>
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, delay: 0.65 }}
                      className="bg-gradient-to-r from-blue-100 dark:from-medical-500/50 to-blue-200 dark:to-medical-600/50 text-blue-700 dark:text-medical-100 px-4 py-1.5 rounded-full text-sm font-black border border-blue-300 dark:border-medical-500/50 shadow-lg shadow-blue-500/20 dark:shadow-medical-500/20"
                    >
                      {getCommentsCount(selectedNews)}
                    </motion.span>
                  </motion.div>

                  {/* Warning Note */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.65 }}
                    className="mx-8 mt-6 p-4 bg-gradient-to-r from-amber-100 dark:from-amber-500/15 to-amber-200 dark:to-amber-600/15 border border-amber-300 dark:border-amber-500/30 rounded-2xl flex items-start gap-3 text-sm text-amber-700 dark:text-amber-300 font-black shadow-lg shadow-amber-500/10 dark:shadow-amber-500/10"
                  >
                    <Clock className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                    <p className="leading-relaxed">
                      {t("news_comments_retention_note","Note: Comments and replies are automatically deleted every 4 hours to boost interaction and protect privacy.")}
                    </p>
                  </motion.div>

                  {/* Comments Container */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    {(!selectedNews.comments || selectedNews.comments.length === 0) ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                        className="text-center py-16 opacity-60"
                      >
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <MessageCircle className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4 opacity-40" />
                        </motion.div>
                        <p className="text-slate-600 dark:text-slate-400 font-black text-base">{t("news_comments_empty","Be the first to share your opinion!")}</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-6">
                        <AnimatePresence initial={false}>
                          {selectedNews.comments.map((comment: any, idx: number) => (
                            <motion.div 
                              key={comment.id}
                              initial={{ opacity: 0, y: 20, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -20, scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 300, damping: 25, delay: idx * 0.05 }}
                              layout
                              className="space-y-4 group"
                            >
                              {/* Main Comment */}
                              <motion.div 
                                whileHover={{ x: 4 }}
                                className="flex gap-4 relative"
                              >
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 400, delay: idx * 0.05 + 0.05 }}
                                  className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 dark:from-medical-500/30 to-blue-300 dark:to-medical-600/30 shrink-0 overflow-hidden flex items-center justify-center border-2 border-blue-400 dark:border-medical-500/50 shadow-lg shadow-blue-500/20 dark:shadow-medical-500/20"
                                >
                                  {comment.user?.image ? (
                                    <img src={comment.user.image} alt={comment.user.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <UserIcon className="w-6 h-6 text-medical-300" />
                                  )}
                                </motion.div>
                                <motion.div 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: idx * 0.05 + 0.08 }}
                                  className="flex-1 bg-gradient-to-br from-gray-100 dark:from-slate-800/60 to-gray-50 dark:to-slate-900/40 p-5 rounded-2xl rounded-tr-sm border border-slate-300 dark:border-slate-700/50 hover:border-blue-400 dark:hover:border-medical-500/30 transition-all shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-medical-500/20 relative overflow-hidden group"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 dark:from-medical-500/0 via-blue-500/5 dark:via-medical-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-black text-base text-slate-900 dark:text-slate-100">
                                        {comment.user?.name || t("user_default","Unknown user")}
                                      </span>
                                      <span className="text-xs text-slate-600 dark:text-slate-500 font-bold">
                                        {new Date(comment.createdAt).toLocaleDateString('ar-EG')}
                                      </span>
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 text-sm font-bold leading-relaxed">
                                      {comment.content}
                                    </p>
                                    
                                    {/* Actions */}
                                    {(userId || isAdmin) && (
                                      <div className="flex items-center gap-4 mt-4 border-t border-slate-700/30 pt-3">
                                        {userId && (
                                          <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setReplyTo({ id: comment.id, userName: comment.user?.name || t("user_default","Unknown user") })}
                                            className="inline-flex items-center gap-2 text-xs font-black text-blue-600 dark:text-medical-400 hover:text-blue-700 dark:hover:text-medical-300 hover:bg-blue-100 dark:hover:bg-medical-500/10 px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-blue-300 dark:hover:border-medical-500/30"
                                          >
                                            <CornerDownLeft className="w-3.5 h-3.5" />
                                            <span>{t("reply","Reply")}</span>
                                          </motion.button>
                                        )}
                                        {(comment.userId === userId || isAdmin) && (
                                          <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="inline-flex items-center gap-2 text-xs font-black text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-red-300 dark:hover:border-red-500/30 mr-auto"
                                            title={t("news_delete_comment","Delete comment")}
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>{t("delete","Delete")}</span>
                                          </motion.button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              </motion.div>

                              {/* Replies Container */}
                              {comment.replies && comment.replies.length > 0 && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mr-4 pl-8 border-l-2 border-gradient-to-b from-blue-400 dark:from-medical-500/50 to-slate-400 dark:to-slate-800/80 space-y-4 relative"
                                >
                                  <AnimatePresence initial={false}>
                                    {comment.replies.map((reply: any, replyIdx: number) => (
                                      <motion.div 
                                        key={reply.id}
                                        initial={{ opacity: 0, x: -15, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -15, scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25, delay: replyIdx * 0.04 }}
                                        layout
                                        className="flex gap-3 relative mt-2 group/reply"
                                      >
                                        <motion.div 
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ type: "spring", stiffness: 400, delay: replyIdx * 0.04 + 0.05 }}
                                          className="w-9 h-9 rounded-full bg-slate-300 dark:bg-slate-800 shrink-0 overflow-hidden flex items-center justify-center border border-slate-400 dark:border-medical-500/30 shadow-md"
                                        >
                                          {reply.user?.image ? (
                                            <img src={reply.user.image} alt={reply.user.name} className="w-full h-full object-cover" />
                                          ) : (
                                            <UserIcon className="w-4 h-4 text-slate-500" />
                                          )}
                                        </motion.div>
                                        <motion.div 
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ duration: 0.3, delay: replyIdx * 0.04 + 0.08 }}
                                          className="flex-1 bg-gray-100 dark:bg-slate-800/40 p-4 rounded-xl rounded-tr-sm border border-slate-300 dark:border-slate-800 hover:border-blue-400 dark:hover:border-medical-500/20 transition-all relative overflow-hidden group/reply"
                                        >
                                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 dark:from-medical-500/0 via-blue-500/3 dark:via-medical-500/3 to-transparent opacity-0 group-hover/reply:opacity-100 transition-opacity" />
                                          <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-1">
                                              <span className="font-black text-xs text-slate-900 dark:text-slate-300 flex items-center gap-2">
                                                {reply.user?.name || t("user_default","Unknown user")}
                                                <span className="px-2 py-0.5 bg-blue-100 dark:bg-medical-500/20 text-blue-700 dark:text-medical-300 text-[7px] font-black rounded uppercase">{t("reply","Reply")}</span>
                                              </span>
                                              <span className="text-[8px] text-slate-600 dark:text-slate-500 font-bold">
                                                {new Date(reply.createdAt).toLocaleDateString('ar-EG')}
                                              </span>
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300 text-xs font-bold leading-relaxed">
                                              {reply.content}
                                            </p>

                                            {/* Delete reply action */}
                                            {(reply.userId === userId || isAdmin) && (
                                              <div className="flex items-center justify-end mt-2 pt-2 border-t border-slate-800/50">
                                                <motion.button 
                                                  whileHover={{ scale: 1.05 }}
                                                  whileTap={{ scale: 0.95 }}
                                                  onClick={() => handleDeleteComment(reply.id, comment.id)}
                                                  className="inline-flex items-center gap-1 text-[8px] font-black text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 px-2 py-1 rounded transition-all border border-transparent hover:border-red-300 dark:hover:border-red-500/30"
                                                  title={t("news_delete_reply","Delete reply")}
                                                >
                                                  <Trash2 className="w-2.5 h-2.5" />
                                                  <span>{t("delete","Delete")}</span>
                                                </motion.button>
                                              </div>
                                            )}
                                          </div>
                                        </motion.div>
                                      </motion.div>
                                    ))}
                                  </AnimatePresence>
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  {userId ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                      className="p-6 border-t border-slate-300 dark:border-slate-700/50 bg-gradient-to-t from-gray-100 dark:from-[#0B1120] to-transparent dark:to-transparent space-y-4"
                    >
                      {/* Active Reply Banner */}
                      <AnimatePresence>
                        {replyTo && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0, y: 10 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: 10 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="bg-gradient-to-r from-amber-100 dark:from-amber-500/15 to-amber-200 dark:to-amber-600/15 border border-amber-300 dark:border-amber-500/30 rounded-2xl px-4 py-3 flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 font-black overflow-hidden shadow-lg shadow-amber-500/10 dark:shadow-amber-500/10"
                          >
                            <span className="flex items-center gap-2">
                              <Reply className="w-4 h-4 rotate-180 text-amber-600 dark:text-amber-400" />
                              <span>{t("news_replying_to_prefix","Replying to comment")} <span className="font-black text-amber-600 dark:text-amber-400">@{replyTo.userName}</span></span>
                            </span>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setReplyTo(null)} 
                              className="p-1.5 hover:bg-amber-200 dark:hover:bg-amber-500/20 rounded-lg transition-all" 
                              title="Cancel reply" 
                              aria-label="Cancel reply"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <form onSubmit={handleAddComment} className="flex gap-3 group">
                        <motion.input 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.85 }}
                          type="text" 
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder={replyTo ? `${t("news_reply_placeholder_prefix","Write your reply to")} ${replyTo.userName}...` : t("news_comment_input_placeholder","Share your thoughts...")}
                          className="flex-1 bg-gradient-to-r from-gray-100 dark:from-slate-800/50 to-gray-50 dark:to-slate-900/50 border border-slate-300 dark:border-slate-700/50 focus:border-blue-400 dark:focus:border-medical-500/50 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-medical-500/20 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-500 shadow-lg focus:shadow-blue-500/20 dark:focus:shadow-medical-500/20"
                        />
                        <motion.button 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.9 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={!commentText.trim() || isSubmitting}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-medical-600 dark:to-medical-700 dark:hover:from-medical-500 dark:hover:to-medical-600 text-white px-6 py-4 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 dark:shadow-medical-500/30 hover:shadow-blue-500/50 dark:hover:shadow-medical-500/50 disabled:shadow-none border border-blue-400 dark:border-medical-500/30 hover:border-blue-500 dark:hover:border-medical-500/50 font-black"
                          title={t("news_send_comment","Send comment")}
                          aria-label={t("news_send_comment","Send comment")}
                        >
                          <Send className="w-5 h-5 rotate-180" />
                        </motion.button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                      className="p-8 border-t border-slate-300 dark:border-slate-700/50 bg-gradient-to-b from-transparent dark:from-transparent to-gray-50 dark:to-slate-900/30 text-center"
                    >
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-bold mb-5">{t("news_login_required","You must be logged in to add a comment")}</p>
                      <motion.a 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="/login" 
                        className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 dark:from-medical-600 dark:to-medical-700 hover:from-blue-600 hover:to-blue-700 dark:hover:from-medical-500 dark:hover:to-medical-600 text-white text-sm font-black px-8 py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/30 dark:shadow-medical-500/30 hover:shadow-blue-500/50 dark:hover:shadow-medical-500/50 border border-blue-400 dark:border-medical-500/30 hover:border-blue-500 dark:hover:border-medical-500/50"
                      >
                        {t("login","Login")}
                      </motion.a>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
