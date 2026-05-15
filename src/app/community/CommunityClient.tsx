"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Plus, Search, Filter, User, Clock, ChevronLeft, MessageCircle, Share2, MoreVertical, Flag, Heart, Eye, AlertTriangle, ShieldAlert, Sparkles, Lock, X, Edit3, Trash2, ArrowRight, Instagram, Facebook, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import NewDiscussionModal from "./NewDiscussionModal";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { toggleLike, deleteDiscussion } from "@/app/actions/community";
import { useRouter } from "next/navigation";

export default function CommunityClient({ initialDiscussions, subjects, user, categoryName, categoryId }: { initialDiscussions: any[], subjects: any[], user: any, categoryName?: string, categoryId?: string }) {
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<any>(null);
  const [optimisticLikes, setOptimisticLikes] = useState<Record<string, { liked: boolean, count: number }>>({});
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEdit = (e: React.MouseEvent, post: any) => {
    e.preventDefault();
    e.stopPropagation();
    setEditPost(post);
    setIsModalOpen(true);
  };

  // Filter subjects based on search (Smart & Case-insensitive)
  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const filteredDiscussions = discussions.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubjectId ? d.subjectId === selectedSubjectId : true;
    return matchesSearch && matchesSubject;
  });

  const handleLike = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    // Optimistic Update
    const discussion = discussions.find(d => d.id === id);
    if (!discussion) return;

    const isLiked = optimisticLikes[id]?.liked ?? discussion.likes?.some((l: any) => l.userId === user.id);
    const count = optimisticLikes[id]?.count ?? discussion.likes?.length ?? 0;

    setOptimisticLikes(prev => ({
      ...prev,
      [id]: {
        liked: !isLiked,
        count: isLiked ? Math.max(0, count - 1) : count + 1
      }
    }));

    await toggleLike(user.id, id);
    router.refresh();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("هل أنت متأكد من حذف هذا المنشور؟")) {
      await deleteDiscussion(id);
      router.refresh();
    }
  };

  // If user is not logged in, show a premium "Access Denied" notice
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Lights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-medical-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white/5 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/10 text-center shadow-2xl relative z-10"
        >
          <div className="w-24 h-24 bg-gradient-to-tr from-medical-600 to-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-medical-600/30">
             <Lock className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-6">منطقة النخبة فقط</h1>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed font-bold">
             المجتمع مخصص لطلاب AuraMed المسجلين فقط لضمان جودة النقاشات الطبية. يرجى تسجيل الدخول أو إنشاء حساب للانضمام إلينا.
          </p>
          <div className="flex flex-col gap-4">
             <Link href="/login" className="w-full py-5 bg-white text-slate-950 rounded-[2rem] font-black text-xl hover:bg-medical-400 hover:text-white transition-all">
                تسجيل الدخول
             </Link>
             <Link href="/register" className="w-full py-5 bg-white/10 text-white rounded-[2rem] font-black text-xl border border-white/10 hover:bg-white/20 transition-all">
                إنشاء حساب جديد
             </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050811] text-white py-12 px-4 relative overflow-hidden font-cairo">
      {/* ANOTHER WORLD BACKGROUND DESIGN */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-medical-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER SECTION - ULTRA PREMIUM - CENTERED */}
        <div className="flex flex-col items-center justify-center text-center gap-10 mb-20">
          <div className="space-y-4 flex flex-col items-center">
            {categoryName && (
              <Link href="/community" className="group flex items-center gap-2 text-slate-500 hover:text-medical-400 transition-colors mb-4 font-bold">
                <ArrowRight className="w-4 h-4" />
                العودة لاختيار السنة
              </Link>
            )}
            <motion.div 
              initial={{ y: -20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-medical-500/10 border border-medical-500/20 rounded-full text-medical-400 text-xs font-black tracking-widest uppercase"
            >
              <Sparkles className="w-4 h-4" />
              مجتمع {categoryName || "مؤقت ونقي"}
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
              {categoryName ? categoryName.split(' ')[0] : "COMMU"}<span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-400 to-indigo-500">{categoryName ? categoryName.split(' ').slice(1).join(' ') : "NITY"}</span>
            </h1>
            <p className="text-slate-400 text-xl md:text-2xl font-bold max-w-2xl leading-relaxed">
              {categoryName ? `مساحة خاصة بطلاب ${categoryName} لتبادل الخبرات.` : "عالم من المعرفة المتجددة."}
            </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="px-12 py-6 bg-gradient-to-r from-medical-600 to-indigo-600 text-white rounded-[2.5rem] font-black text-2xl shadow-[0_20px_50px_rgba(14,165,233,0.3)] flex items-center justify-center gap-4 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus className="w-8 h-8 relative z-10" />
            <span className="relative z-10">منشور جديد</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* SIDEBAR - NEON GLASS */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black flex items-center gap-3">
                  <Filter className="w-5 h-5 text-medical-400" />
                  المواد
                </h3>
              </div>
              
              <div className="relative mb-6">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  placeholder="ابحث عن مادة..."
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 p-3 pr-10 rounded-2xl outline-none text-sm font-bold focus:border-medical-500/50 transition-all"
                />
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                <button 
                  onClick={() => setSelectedSubjectId(null)}
                  className={`w-full text-right px-5 py-4 rounded-2xl text-sm font-black transition-all ${!selectedSubjectId ? "bg-medical-500 text-white shadow-lg shadow-medical-500/20" : "text-slate-500 hover:bg-white/5"}`}
                >
                  جميع المواد
                </button>
                {filteredSubjects.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setSelectedSubjectId(s.id)}
                    className={`w-full text-right px-5 py-4 rounded-2xl text-sm font-black transition-all ${selectedSubjectId === s.id ? "bg-medical-500 text-white shadow-lg shadow-medical-500/20" : "text-slate-500 hover:bg-white/5"}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* MAIN FEED - FLOWING SPEED */}
          <main className="lg:col-span-9 space-y-10">
            
            <div className="relative group">
              <Search className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-medical-400 transition-colors" />
              <input 
                type="text"
                placeholder="ابحث في النقاشات الجارية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 backdrop-blur-xl border border-white/10 p-7 pr-16 rounded-[3rem] outline-none focus:ring-4 focus:ring-medical-500/10 shadow-2xl font-black text-xl transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredDiscussions.map((d, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    key={d.id}
                    className="bg-white/[0.03] backdrop-blur-sm p-8 md:p-10 rounded-[3.5rem] border border-white/5 shadow-2xl hover:bg-white/[0.05] hover:border-medical-500/30 transition-all group relative overflow-hidden"
                  >
                    {/* Hover Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-medical-500/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div 
                      onClick={() => router.push(`/community/d/${d.id}`)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 ring-2 ring-white/5">
                            {d.user?.image ? (
                              <img src={d.user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-800">
                                <User className="w-7 h-7" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-4">
                               <h4 className="font-black text-white text-lg">{d.user?.name || "طالب آورا"}</h4>
                               <div className="flex items-center gap-2">
                                 {d.user?.telegram && (
                                   <a 
                                     href={d.user.telegram.startsWith('http') ? d.user.telegram : `https://t.me/${d.user.telegram.replace('@', '')}`} 
                                     target="_blank" rel="noopener noreferrer" 
                                     className="p-1.5 bg-sky-500/10 text-sky-500 rounded-lg hover:bg-sky-500 hover:text-white transition-all shadow-sm"
                                     onClick={(e) => e.stopPropagation()}
                                   >
                                     <Send className="w-3.5 h-3.5" />
                                   </a>
                                 )}
                                 {d.user?.instagram && (
                                   <a 
                                     href={d.user.instagram.startsWith('http') ? d.user.instagram : `https://instagram.com/${d.user.instagram}`} 
                                     target="_blank" rel="noopener noreferrer" 
                                     className="p-1.5 bg-pink-500/10 text-pink-500 rounded-lg hover:bg-pink-500 hover:text-white transition-all shadow-sm"
                                     onClick={(e) => e.stopPropagation()}
                                   >
                                     <Instagram className="w-3.5 h-3.5" />
                                   </a>
                                 )}
                                 {d.user?.facebook && (
                                   <a 
                                     href={d.user.facebook.startsWith('http') ? d.user.facebook : `https://facebook.com/${d.user.facebook}`} 
                                     target="_blank" rel="noopener noreferrer" 
                                     className="p-1.5 bg-blue-600/10 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                     onClick={(e) => e.stopPropagation()}
                                   >
                                     <Facebook className="w-3.5 h-3.5" />
                                   </a>
                                 )}
                               </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-bold mt-1">
                              <div className="flex items-center gap-1">
                                 <Clock className="w-3.5 h-3.5" />
                                 {mounted ? formatDistanceToNow(new Date(d.createdAt), { addSuffix: true, locale: ar }) : "..."}
                              </div>
                              <div className="flex items-center gap-1 text-medical-400">
                                 <Eye className="w-3.5 h-3.5" />
                                 {d.views} مشاهدة
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {d.subject && (
                          <span className="px-5 py-2 bg-medical-500/10 text-medical-400 border border-medical-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {d.subject.name}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-3xl font-black text-white mb-4 group-hover:text-medical-400 transition-colors leading-tight">
                        {d.title}
                      </h3>
                      
                      <p className="text-slate-400 text-lg leading-relaxed mb-8 line-clamp-2 font-bold opacity-80">
                        {d.content}
                      </p>
                      
                      <div className="flex items-center justify-between pt-8 border-t border-white/5">
                        <div className="flex items-center gap-8">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(e, d.id);
                            }}
                            className={`flex items-center gap-2 transition-all duration-300 transform active:scale-125 font-black ${
                              (optimisticLikes[d.id]?.liked ?? d.likes?.some((l: any) => l.userId === user.id))
                                ? "text-red-500 scale-110" 
                                : "text-slate-500 hover:text-red-400"
                            }`}
                          >
                            <motion.div
                              whileTap={{ scale: 1.5 }}
                              animate={{ 
                                scale: (optimisticLikes[d.id]?.liked ?? d.likes?.some((l: any) => l.userId === user.id)) ? [1, 1.4, 1] : 1,
                                filter: (optimisticLikes[d.id]?.liked ?? d.likes?.some((l: any) => l.userId === user.id)) 
                                  ? ["drop-shadow(0 0 0px #ef4444)", "drop-shadow(0 0 15px #ef4444)", "drop-shadow(0 0 0px #ef4444)"] 
                                  : "none"
                              }}
                              transition={{ 
                                scale: { type: "spring", stiffness: 300, duration: 0.4 },
                                filter: { duration: 0.4, ease: "easeInOut" }
                              }}
                            >
                              <Heart className={`w-6 h-6 transition-colors duration-300 ${(optimisticLikes[d.id]?.liked ?? d.likes?.some((l: any) => l.userId === user.id)) ? "fill-current text-red-500" : "text-slate-500"}`} />
                            </motion.div>
                            <span className="text-lg">{optimisticLikes[d.id]?.count ?? d.likes?.length ?? 0}</span>
                          </button>
                          
                          <div className="flex items-center gap-2 text-slate-500 hover:text-medical-400 transition-colors font-black">
                            <MessageCircle className="w-6 h-6" />
                            <span className="text-lg">{d._count?.comments || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {user.id === d.userId && (
                            <>
                               <button 
                                 onClick={(e) => handleEdit(e, d)}
                                 className="p-3 bg-white/5 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-2xl transition-all"
                               >
                                  <Edit3 className="w-5 h-5" />
                               </button>
                               <button 
                                 onClick={(e) => { e.stopPropagation(); handleDelete(e, d.id); }}
                                 className="p-3 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-2xl transition-all"
                               >
                                  <Trash2 className="w-5 h-5" />
                               </button>
                            </>
                          )}
                          <div className="p-3 bg-medical-500 text-white rounded-2xl shadow-lg shadow-medical-500/20 hover:scale-110 transition-all">
                             <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredDiscussions.length === 0 && (
                <div className="text-center py-32 bg-white/[0.02] rounded-[4rem] border-2 border-dashed border-white/5">
                   <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                      <Search className="w-12 h-12 text-slate-700" />
                   </div>
                   <h3 className="text-3xl font-black text-white mb-3">الصمت يعم المكان...</h3>
                   <p className="text-slate-500 text-xl font-bold">كن أنت من يكسر حاجز الصمت ويبدأ النقاش!</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <NewDiscussionModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditPost(null);
        }} 
        subjects={subjects} 
        userId={user?.id}
        categoryId={categoryId}
        editPost={editPost}
        onSuccess={(updatedPost) => {
          if (editPost) {
            setDiscussions(discussions.map(d => d.id === updatedPost.id ? { ...d, ...updatedPost } : d));
          } else {
            setDiscussions([updatedPost, ...discussions]);
          }
          setIsModalOpen(false);
          setEditPost(null);
          router.refresh();
        }}
      />
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0ea5e9;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
