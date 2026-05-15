"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Camera, Save, ArrowRight, CheckCircle, BookOpen, Heart, GraduationCap, Clock, PlayCircle, Inbox, ExternalLink, Zap, Trash2, Instagram, Facebook, Send } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getYoutubeThumbnail } from "@/lib/utils";

export default function ProfileClient({ user }: { user: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  async function handleUpdate(formData: FormData) {
    setLoading(true);
    setMessage({ text: "", type: "" });
    const res = await updateProfile(formData);
    if (res?.error) {
      setMessage({ text: res.error, type: "error" });
    } else {
      setMessage({ text: "تم تحديث ملفك الشخصي بنجاح!", type: "success" });
      router.refresh(); // This will update the 'user' prop data
    }
    setLoading(false);
  }

  const stats = [
    { label: "دروس مكتملة", value: user.progress?.filter((p: any) => p.completed).length || 0, icon: CheckCircle, color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
    { label: "في المفضلة", value: user.favorites?.length || 0, icon: Heart, color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
    { label: "آخر معدل", value: user.gpaCalculations?.[0]?.gpa || "0.00", icon: GraduationCap, color: "text-medical-600 bg-medical-50 dark:bg-medical-900/20" },
    { label: "ساعات المشاهدة", value: Math.round((user.progress?.reduce((acc: number, curr: any) => acc + curr.watchedSec, 0) || 0) / 3600), icon: Clock, color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20" },
  ];

  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar Info */}
        <aside className="w-full md:w-80 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800 text-center"
          >
            <div className="relative inline-block group mb-6">
              <div className="w-24 h-24 rounded-full bg-medical-50 dark:bg-medical-900/30 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-medical-600 dark:text-medical-400" />
                )}
              </div>
              <button 
                onClick={() => setActiveTab("settings")}
                className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-700 rounded-full shadow-md border border-slate-100 dark:border-slate-600 hover:scale-110 transition-transform"
                title="تغيير الصورة"
              >
                <Camera className="w-4 h-4 text-medical-600 dark:text-medical-400" />
              </button>
            </div>
            <h1 className="text-xl font-bold mb-1">{user.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{user.email}</p>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              {user.telegram && (
                <a href={user.telegram.startsWith('http') ? user.telegram : `https://t.me/${user.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-sky-500/10 text-sky-500 rounded-xl hover:bg-sky-500 hover:text-white transition-all shadow-sm">
                  <Send className="w-4 h-4" />
                </a>
              )}
              {user.instagram && (
                <a href={user.instagram.startsWith('http') ? user.instagram : `https://instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-pink-500/10 text-pink-500 rounded-xl hover:bg-pink-500 hover:text-white transition-all shadow-sm">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {user.facebook && (
                <a href={user.facebook.startsWith('http') ? user.facebook : `https://facebook.com/${user.facebook}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-600/10 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              {[
                { id: "overview", label: "نظرة عامة", icon: BookOpen },
                { id: "favorites", label: "المفضلة", icon: Heart },
                { id: "settings", label: "الإعدادات", icon: User },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02, x: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold w-full text-right ${
                    activeTab === tab.id 
                      ? "bg-medical-600 text-white shadow-lg shadow-medical-600/30" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <Link href="/" className="flex items-center justify-center gap-2 text-slate-500 hover:text-medical-600 font-bold transition-colors">
            <ArrowRight className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Progress */}
                <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-medical-600" />
                    <span>آخر الدروس المشاهدة</span>
                  </h2>
                  <div className="space-y-4">
                    {user.progress?.slice(0, 3).map((p: any) => (
                      <Link 
                        key={p.id} 
                        href={`/courses/v/${p.lesson.slug}`}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-medical-600">
                          <PlayCircle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-sm group-hover:text-medical-600 transition-colors line-clamp-1">{p.lesson.title}</h3>
                          <p className="text-xs text-slate-500">{p.lesson.subject.name}</p>
                        </div>
                        <div className="text-xs font-bold px-3 py-1 rounded-full bg-medical-50 dark:bg-medical-900/30 text-medical-600">
                          {p.completed ? "مكتمل" : "قيد المشاهدة"}
                        </div>
                      </Link>
                    ))}
                    {!user.progress?.length && (
                      <div className="text-center py-10 text-slate-400">لا يوجد نشاط مؤخراً</div>
                    )}
                  </div>
                </div>

                {/* GPA History */}
                <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-medical-600" />
                    <span>سجل المعدلات</span>
                  </h2>
                  <div className="space-y-4">
                    {user.gpaCalculations?.map((calc: any) => (
                      <div key={calc.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                        <div>
                          <div className="font-bold text-medical-600">{calc.gpa}</div>
                          <div className="text-xs text-slate-500">{new Date(calc.createdAt).toLocaleDateString('ar-EG')}</div>
                        </div>
                        <div className="text-xs text-slate-400">{calc.subjects.split(',').length} مواد</div>
                      </div>
                    ))}
                    {!user.gpaCalculations?.length && (
                      <div className="text-center py-10 text-slate-400">لم تقم بحساب معدلك بعد</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "favorites" && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {user.favorites?.map((fav: any) => {
                  const thumbnailUrl = getYoutubeThumbnail(fav.lesson.videoUrl);
                  return (
                    <Link 
                      key={fav.id} 
                      href={`/courses/v/${fav.lesson.slug}`}
                      className="bg-white dark:bg-dark-card p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="aspect-video rounded-2xl bg-[#05070a] mb-4 overflow-hidden relative border border-slate-100 dark:border-slate-800/50 shadow-inner">
                        {thumbnailUrl ? (
                          <>
                            <img 
                              src={thumbnailUrl} 
                              alt={fav.lesson.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <PlayCircle className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                            </div>
                            <div className="absolute inset-0 bg-medical-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white gap-2 border-b border-white/5">
                             <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                                <BookOpen className="w-5 h-5 text-white opacity-60" />
                             </div>
                             <span className="text-sm font-black uppercase tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">لا يوجد فيديو</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold group-hover:text-medical-600 transition-colors line-clamp-1">{fav.lesson.title}</h3>
                      <p className="text-xs text-slate-500">{fav.lesson.subject.name}</p>
                    </Link>
                  );
                })}
                {!user.favorites?.length && (
                  <div className="col-span-full text-center py-20 bg-white dark:bg-dark-card rounded-[2.5rem] text-slate-400">
                    قائمتك المفضلة فارغة حالياً
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                <h2 className="text-2xl font-bold mb-8">إعدادات الحساب</h2>
                
                {message.text && (
                  <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold ${
                    message.type === "success" 
                      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                      : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                  }`}>
                    {message.type === "success" && <CheckCircle className="w-5 h-5" />}
                    {message.text}
                  </div>
                )}

                <form action={handleUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">اسم العرض</label>
                    <input 
                      id="name"
                      name="name"
                      defaultValue={user.name || ""}
                      required
                      title="اسم العرض"
                      placeholder="اسم العرض"
                      className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-2">رابط الصورة الشخصية</label>
                    <input 
                      name="image"
                      defaultValue={user.image || ""}
                      placeholder="https://..."
                      className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                      dir="ltr"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">Telegram</label>
                       <input 
                         name="telegram"
                         defaultValue={user.telegram || ""}
                         placeholder="@username"
                         className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 outline-none transition-all text-sm"
                         dir="ltr"
                       />
                       {user.telegram && (
                         <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-black text-sky-500 animate-pulse">
                            <Send className="w-3 h-3" />
                            <span>مفعّل</span>
                         </div>
                       )}
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">Instagram</label>
                       <input 
                         name="instagram"
                         defaultValue={user.instagram || ""}
                         placeholder="username"
                         className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-pink-500 outline-none transition-all text-sm"
                         dir="ltr"
                       />
                       {user.instagram && (
                         <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-black text-pink-500 animate-pulse">
                            <Instagram className="w-3 h-3" />
                            <span>مفعّل</span>
                         </div>
                       )}
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest">Facebook</label>
                       <input 
                         name="facebook"
                         defaultValue={user.facebook || ""}
                         placeholder="profile_id"
                         className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
                         dir="ltr"
                       />
                       {user.facebook && (
                         <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-black text-blue-600 animate-pulse">
                            <Facebook className="w-3 h-3" />
                            <span>مفعّل</span>
                         </div>
                       )}
                    </div>
                  </div>

                  <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={loading}
                    className="w-full bg-medical-600 hover:bg-medical-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-medical-600/30 flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
