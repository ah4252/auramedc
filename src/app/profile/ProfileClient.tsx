"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleProvider.client";
import { updateProfile, changePassword, deleteAccount } from "@/app/actions/auth";
import { submitSubscriptionRequest } from "@/app/actions/payment";
import { deleteGPACalculation, deleteAllGPACalculations } from "@/app/actions/gpaUser";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Camera, Save, ArrowRight, CheckCircle, BookOpen, Heart, GraduationCap, Clock, PlayCircle, Inbox, ExternalLink, Zap, Trash2, Instagram, Facebook, Send, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Sparkles, TrendingUp, Award, X, Calendar, MapPin } from "lucide-react";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getYoutubeThumbnail, getSocialUrl } from "@/lib/utils";

export default function ProfileClient({ user, news = [], latestSubscription = null }: { user: any, news?: any[], latestSubscription?: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, lang } = useLocale();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Payment state
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState("TIMETABLE");
  const [receiptBase64, setReceiptBase64] = useState("");

  // Password change state
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState({ text: "", type: "" });
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Image modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState(user.image || "");

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleDeleteGpa(id: string) {
    if (!confirm(t("profile_confirm_delete_gpa"))) return;
    const res = await deleteGPACalculation(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || t("profile_delete_failed"));
    }
  }

  async function handleDeleteAllGpa() {
    if (!confirm(t("profile_confirm_delete_all_gpa"))) return;
    const res = await deleteAllGPACalculations();
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || t("profile_delete_failed"));
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwLoading(true);
    setPwMessage({ text: "", type: "" });
    const res = await changePassword(currentPw, newPw);
    if (res?.error) {
      setPwMessage({ text: res.error, type: "error" });
    } else {
      setPwMessage({ text: t("profile_password_updated_success"), type: "success" });
      setCurrentPw("");
      setNewPw("");
    }
    setPwLoading(false);
  }

  async function handleUpdate(formData: FormData) {
    setLoading(true);
    setMessage({ text: "", type: "" });
    const res = await updateProfile(formData);
    if (res?.error) {
      setMessage({ text: res.error, type: "error" });
    } else {
      setMessage({ text: t("profile_update_success"), type: "success" });
      router.refresh(); // This will update the 'user' prop data
    }
    setLoading(false);
  }

  async function handleDeleteAccount() {
    if (!deletePassword) return;
    setDeleteLoading(true);
    setDeleteError("");
    const res = await deleteAccount(deletePassword);
    if (res?.error) {
      setDeleteError(res.error);
      setDeleteLoading(false);
    } else {
      // Deleted successfully - redirect to homepage
      router.push("/");
      router.refresh();
    }
  }

  async function handleImageUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("image", tempImageUrl);
    formData.append("studyYear", user.studyYear || "");
    formData.append("wilaya", user.wilaya || "");
    formData.append("telegram", user.telegram || "");
    formData.append("instagram", user.instagram || "");
    formData.append("facebook", user.facebook || "");
    
    const res = await updateProfile(formData);
    if (res?.error) {
       alert(res.error || t("profile_update_failed"));
    } else {
       setShowImageModal(false);
       router.refresh();
    }
    setLoading(false);
  }

  const completedCount = user.progress?.filter((p: any) => p.completed).length || 0;
  const favoritesCount = user.favorites?.length || 0;
  const latestGpa = user.gpaCalculations?.[0]?.gpa || "0.00";
  const watchHours = Math.round((user.progress?.reduce((acc: number, curr: any) => acc + curr.watchedSec, 0) || 0) / 3600);

  const stats = [
    { label: t("profile_stats_completed_lessons"), value: completedCount, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]" },
    { label: t("profile_stats_favorites"), value: favoritesCount, icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", glow: "group-hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]" },
    { label: t("profile_stats_latest_gpa"), value: latestGpa, icon: GraduationCap, color: "text-medical-500", bg: "bg-medical-500/10", border: "border-medical-500/20", glow: "group-hover:shadow-[0_0_30px_-5px_rgba(14,165,233,0.3)]" },
    { label: t("profile_stats_watch_hours"), value: watchHours, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]" },
  ];

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-medical-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen opacity-50 pointer-events-none animate-pulse [animation-delay:2s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] opacity-5 pointer-events-none" />

      <div className="container mx-auto px-4 py-16 max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Info */}
          <aside className="w-full lg:w-80 flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl relative overflow-hidden text-center group"
            >
              {/* Card top glow */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-medical-500 to-transparent opacity-50" />
              
              <div className="relative inline-block mb-6">
                <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-medical-600 via-purple-500 to-sky-400 group-hover:rotate-180 transition-transform duration-700 ease-in-out">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 p-1 flex items-center justify-center overflow-hidden transform group-hover:-rotate-180 transition-transform duration-700 ease-in-out">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <User className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setShowImageModal(true)}
                  className="absolute bottom-1 right-1 p-2.5 bg-medical-500 hover:bg-medical-400 text-white rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)] border-2 border-white dark:border-slate-900 hover:scale-110 transition-all z-10"
                  title={t("profile_change_image_title")}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-1 tracking-tight">{user.name}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 font-bold">{user.email}</p>
              {user.wilaya && (
                <div className="inline-flex items-center justify-center gap-2 mb-6 rounded-2xl border border-medical-500/20 bg-medical-500/10 px-4 py-2 text-sm font-black text-medical-600 dark:text-medical-400">
                  <MapPin className="w-4 h-4" />
                  <span>{user.wilaya}</span>
                </div>
              )}
              
              {/* Social Badges */}
              <div className="flex items-center justify-center gap-3 mb-8">
                {user.telegram && (
                  <a href={getSocialUrl(user.telegram, "telegram")} target="_self" rel="noopener noreferrer" className="p-3 bg-sky-500/10 text-sky-500 rounded-2xl hover:bg-sky-500 hover:text-white hover:-translate-y-1 transition-all shadow-sm hover:shadow-[0_5px_20px_rgba(14,165,233,0.4)]" title="Telegram">
                    <Send className="w-5 h-5" />
                  </a>
                )}
                {user.instagram && (
                  <a href={getSocialUrl(user.instagram, "instagram")} target="_self" rel="noopener noreferrer" className="p-3 bg-pink-500/10 text-pink-500 rounded-2xl hover:bg-pink-500 hover:text-white hover:-translate-y-1 transition-all shadow-sm hover:shadow-[0_5px_20px_rgba(236,72,153,0.4)]" title="Instagram">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {user.facebook && (
                  <a href={getSocialUrl(user.facebook, "facebook")} target="_self" rel="noopener noreferrer" className="p-3 bg-blue-600/10 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all shadow-sm hover:shadow-[0_5px_20px_rgba(37,99,235,0.4)]" title="Facebook">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {(!user.telegram && !user.instagram && !user.facebook) && (
                  <div className="text-xs text-slate-400 font-bold bg-slate-100 dark:bg-slate-800/50 py-2 px-4 rounded-xl">{t("profile_no_social_accounts")}</div>
                )}
              </div>
              
              {/* Tabs Navigation */}
              <div className="flex flex-col gap-2 relative">
                {[
                  { id: "overview", label: t("profile_tab_overview"), icon: BookOpen },
                  { id: "favorites", label: t("profile_tab_favorites"), icon: Heart },
                  { id: "subscription", label: t("profile_tab_subscription"), icon: Zap },
                  { id: "settings", label: t("profile_tab_settings"), icon: User },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02, x: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-black w-full text-right overflow-hidden group ${
                        isActive 
                          ? "text-white shadow-lg" 
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-medical-600 to-medical-500"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <tab.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-medical-500 transition-colors'}`} />
                      <span className="relative z-10">{tab.label}</span>
                      
                      {/* Optional Indicator/Badge */}
                      {tab.id === 'favorites' && favoritesCount > 0 && (
                        <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-[10px] py-0.5 px-2 rounded-full z-10 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                          {favoritesCount}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            <Link href="/" className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:text-medical-600 dark:hover:text-medical-400 font-bold transition-colors bg-white/50 dark:bg-slate-900/30 backdrop-blur-md py-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 hover:border-medical-500/30 group mt-6">
              <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>{t("profile_back_home")}</span>
            </Link>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 w-full min-h-[700px]">
            <AnimatePresence mode="wait">
              
              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`group bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-200/50 dark:border-slate-700/50 ${stat.glow} transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${stat.bg} ${stat.color} ${stat.border} shadow-sm group-hover:scale-110 transition-transform`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-black text-slate-800 dark:text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-bold">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Recent Progress */}
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-medical-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                      
                      <div className="flex items-center justify-between mb-8 relative z-10">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                          <div className="p-2 bg-medical-500/10 rounded-xl text-medical-500">
                            <PlayCircle className="w-5 h-5" />
                          </div>
                          {t("profile_recent_lessons")}
                        </h2>
                      </div>
                      
                      <div className="space-y-4 relative z-10">
                        {user.progress?.slice(0, 4).map((p: any, i: number) => (
                          <Link 
                            key={p.id} 
                            href={`/courses/v/${p.lesson.slug}`}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:border-medical-500/30 hover:shadow-lg hover:shadow-medical-500/5 transition-all group/item"
                          >
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover/item:text-medical-500 group-hover/item:border-medical-500/30 transition-colors shadow-sm">
                              <PlayCircle className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover/item:text-medical-500 transition-colors line-clamp-1">{p.lesson.title}</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{p.lesson.subject.name}</p>
                            </div>
                            <div className={`text-[10px] font-black px-3 py-1.5 rounded-full border whitespace-nowrap ${p.completed ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                              {p.completed ? t("profile_status_completed") : t("profile_status_in_progress")}
                            </div>
                          </Link>
                        ))}
                        {(!user.progress || user.progress.length === 0) && (
                          <div className="text-center py-12 flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                              <Inbox className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-500 font-bold">{t("profile_no_activity")}</p>
                            <p className="text-xs text-slate-400 mt-1">{t("profile_start_watching")}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* GPA History */}
                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                      
                      <div className="flex items-center justify-between mb-8 relative z-10">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          {t("profile_gpa_history_title")}
                        </h2>
                        {user.gpaCalculations?.length > 0 && (
                          <button
                            onClick={handleDeleteAllGpa}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                            title={t("profile_delete_all_gpa_title")}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {t("profile_delete_all_gpa_button")}
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-4 relative z-10">
                        {user.gpaCalculations?.slice(0, 5).map((calc: any, i: number) => (
                          <div key={calc.id} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-amber-500/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black shadow-lg shadow-amber-500/20 text-lg">
                                {calc.gpa}
                              </div>
                              <div>
                                <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{t("profile_gpa_item_label")}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(calc.createdAt).toLocaleDateString('ar-EG', { month: 'short', year: 'numeric' })}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-xs font-black text-slate-500 bg-slate-200/50 dark:bg-slate-700/50 px-3 py-1.5 rounded-full whitespace-nowrap">
                                {calc.subjects.split(',').length} {t("profile_gpa_subjects")}
                              </div>
                              <button
                                onClick={() => handleDeleteGpa(calc.id)}
                                className="p-1.5 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                                title={t("profile_delete_gpa_title")}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {(!user.gpaCalculations || user.gpaCalculations.length === 0) && (
                          <div className="text-center py-12 flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                              <Award className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-500 font-bold">{t("profile_no_gpa_yet")}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* FAVORITES TAB */}
              {activeTab === "favorites" && (
                <motion.div
                  key="favorites"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {user.favorites?.map((fav: any, i: number) => {
                    const thumbnailUrl = getYoutubeThumbnail(fav.lesson.videoUrl);
                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        key={fav.id}
                      >
                        <Link 
                          href={`/courses/v/${fav.lesson.slug}`}
                          className="block bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-4 rounded-[2rem] border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl hover:shadow-rose-500/10 hover:border-rose-500/30 transition-all group"
                        >
                           {thumbnailUrl ? (
                            <div className="aspect-video rounded-[1.5rem] bg-slate-900 mb-5 overflow-hidden relative border border-slate-200 dark:border-slate-800">
                              <img 
                                src={thumbnailUrl} 
                                alt={fav.lesson.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                                <div className="w-14 h-14 rounded-full bg-rose-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-[0_0_30px_rgba(244,63,94,0.6)] backdrop-blur-md">
                                  <PlayCircle className="w-7 h-7 ml-1" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="aspect-video rounded-[1.5rem] bg-gradient-to-br from-slate-800 to-slate-900 mb-5 overflow-hidden relative border border-slate-700/50 flex items-center justify-center">
                              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-md group-hover:scale-110 group-hover:border-rose-500/40 transition-all duration-500 relative z-10">
                                <BookOpen className="w-6 h-6 text-rose-400" />
                              </div>
                            </div>
                          )}
                          <h3 className="font-black text-slate-800 dark:text-white group-hover:text-rose-500 transition-colors line-clamp-1 mb-2 px-1">{fav.lesson.title}</h3>
                          <div className="flex items-center gap-2 px-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-500/10 px-2 py-1 rounded-md">{t("profile_favorite_badge")}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold line-clamp-1">{fav.lesson.subject.name}</span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                  {(!user.favorites || user.favorites.length === 0) && (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50">
                      <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 relative">
                        <Heart className="w-12 h-12 text-rose-400 absolute z-10" />
                        <div className="w-full h-full rounded-full animate-ping border-2 border-rose-500/50 absolute inset-0" />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{t("profile_favorites_empty_title")}</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-bold">{t("profile_favorites_empty_description")}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* SUBSCRIPTION TAB */}
              {activeTab === "subscription" && (
                <motion.div
                  key="subscription"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600" />
                    
                    {/* Status Banner - Dynamic by Subscription Type */}
                    {latestSubscription && (() => {
                      const txId = latestSubscription.transactionId || "";
                      const subType = txId.startsWith("TIMETABLE:") ? t("profile_subscription_type_timetable")
                        : txId.startsWith("GPA:") ? t("profile_subscription_type_gpa")
                        : txId.startsWith("SUPPORT:") ? t("profile_subscription_type_support")
                        : t("profile_subscription_type_default");

                      if (latestSubscription.status === "APPROVED") {
                        return (
                          <div className="mb-8 flex items-start gap-4 bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl">
                            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-500 shrink-0">
                              <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-black text-emerald-600 dark:text-emerald-400 text-lg">{t("profile_subscription_approved_heading")}</h4>
                              <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 font-bold mt-1">
                                {t("profile_subscription_approved_description_prefix")} <span className="font-black">{subType}</span> {t("profile_subscription_approved_description_suffix")}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      if (latestSubscription.status === "REJECTED") {
                        return (
                          <div className="mb-8 flex items-start gap-4 bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl">
                            <div className="p-2 bg-rose-500/20 rounded-xl text-rose-500 shrink-0">
                              <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-black text-rose-600 dark:text-rose-400 text-lg">{t("profile_subscription_rejected_heading")}</h4>
                              <p className="text-sm text-rose-600/80 dark:text-rose-400/80 font-bold mt-1">
                                {t("profile_subscription_rejected_description_prefix")} <span className="font-black">{subType}</span> {t("profile_subscription_rejected_description_suffix")}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      if (latestSubscription.status === "PENDING") {
                        return (
                          <div className="mb-8 flex items-start gap-4 bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl">
                            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500 shrink-0">
                              <Clock className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-black text-amber-600 dark:text-amber-400 text-lg">{t("profile_subscription_pending_heading")}</h4>
                              <p className="text-sm text-amber-600/80 dark:text-amber-400/80 font-bold mt-1">
                                {t("profile_subscription_pending_description_prefix")} <span className="font-black">{subType}</span> {t("profile_subscription_pending_description_suffix")}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 shadow-inner">
                        <Zap className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white">{t("profile_subscription_title")}</h2>
                        <p className="text-slate-500 font-bold mt-1">{t("profile_subscription_description")}</p>
                      </div>
                    </div>

                    <div className="rounded-[2.5rem] border border-slate-200/40 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-900/30 p-8 mb-8">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">{t("profile_subscription_guide_title")}</h3>
                      <div className="space-y-4 text-slate-600 dark:text-slate-300">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{t("profile_subscription_guide_step_1_title")}</h4>
                          <p className="mt-2 text-sm leading-relaxed">{t("profile_subscription_guide_step_1_desc")}</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{t("profile_subscription_guide_step_2_title")}</h4>
                          <p className="mt-2 text-sm leading-relaxed">{t("profile_subscription_guide_step_2_desc")}</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{t("profile_subscription_guide_step_3_title")}</h4>
                          <p className="mt-2 text-sm leading-relaxed">{t("profile_subscription_guide_step_3_desc")}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200/30 dark:border-slate-700/30 bg-white/80 dark:bg-slate-950/80 p-4">
                          <h4 className="font-bold text-slate-900 dark:text-white">{t("profile_subscription_payment_policy_title")}</h4>
                          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t("profile_subscription_payment_policy_desc")}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* BaridiMob Info */}
                      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-slate-700 shadow-xl">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-medical-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                          <div>
                            <h3 className="text-2xl font-black mb-1 text-yellow-400">{t("profile_payment_baridimob_title")}</h3>
                            <p className="text-slate-400 text-sm font-bold">{t("profile_payment_baridimob_description")}</p>
                          </div>
                          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner">
                            <Zap className="w-7 h-7 text-yellow-400" />
                          </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group relative">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-black mb-2 text-right flex items-center justify-between">
                              <span>{t("profile_subscription_account_number_label")}</span>
                            </p>
                            <div 
                              className="relative cursor-pointer" 
                              onClick={() => {
                                navigator.clipboard.writeText("00799999004272170042");
                                alert(t("profile_subscription_account_copied"));
                              }}
                              title={t("profile_subscription_copy_title")}
                            >
                              <p className="font-mono text-lg md:text-xl font-bold tracking-widest text-center py-4 bg-black/30 rounded-xl select-all border border-white/5 group-hover:border-yellow-500/30 transition-colors" dir="ltr">
                                007 99999 0042721700 42
                              </p>
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-yellow-400 transition-colors bg-white/5 p-2 rounded-lg backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-black mb-1 text-right">{t("profile_subscription_full_name_label")}</p>
                            <p className="text-lg font-bold text-center py-1">Ahmed BD</p>
                          </div>

                          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-black mb-1 text-right">{t("profile_subscription_fee_label")}</p>
                            <p className="text-3xl font-black text-yellow-400 text-center py-2">
                              {subscriptionType === "TIMETABLE" ? t("profile_subscription_fee_timetable") : 
                               subscriptionType === "GPA" ? t("profile_subscription_fee_gpa") : 
                               t("profile_subscription_fee_support")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Form */}
                      <div className="flex flex-col justify-center">
                        <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" /> {t("profile_payment_confirm_title")}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-8 leading-relaxed">
                            {t("profile_payment_confirm_description")}
                          </p>
                          
                          <form className="space-y-5" onSubmit={async (e) => { 
                            e.preventDefault(); 
                            if (!transactionId || !paymentDate || !receiptBase64) return;
                            setPaymentLoading(true);
                            // Prefix the transactionId with subscriptionType
                            const prefixedTxId = `${subscriptionType}:${transactionId}`;
                            const res = await submitSubscriptionRequest(prefixedTxId, paymentDate, receiptBase64);
                            setPaymentLoading(false);
                            if (res?.success) {
                              setPaymentSuccess(true);
                              setTransactionId("");
                              setPaymentDate("");
                              setReceiptBase64("");
                            } else {
                              alert(res?.error || t("profile_generic_error"));
                            }
                          }}>
                            {paymentSuccess ? (
                              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-center text-amber-600 dark:text-amber-400">
                                <Clock className="w-12 h-12 mx-auto mb-3 text-amber-500 animate-pulse" />
                                <h4 className="font-black text-lg mb-1">{t("profile_payment_request_sent_title")}</h4>
                                <p className="text-sm font-bold">{t("profile_payment_request_sent_description")}</p>
                              </div>
                            ) : (
                              <>
                                <div className="space-y-3 mb-6">
                                  <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block text-right">{t("profile_subscription_select_label")}</label>
                                  <div className="grid grid-cols-1 gap-3">
                                    {[
                                      { id: "TIMETABLE", label: t("profile_subscription_option_timetable_label"), desc: t("profile_subscription_option_timetable_desc"), price: t("profile_subscription_fee_timetable") },
                                      { id: "GPA", label: t("profile_subscription_option_gpa_label"), desc: t("profile_subscription_option_gpa_desc"), price: t("profile_subscription_fee_gpa") },
                                      { id: "SUPPORT", label: t("profile_subscription_option_support_label"), desc: t("profile_subscription_option_support_desc"), price: t("profile_subscription_fee_support") }
                                    ].map((opt) => (
                                      <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setSubscriptionType(opt.id)}
                                        className={`flex items-start justify-between p-4 rounded-2xl border-2 text-right transition-all hover:bg-slate-100 dark:hover:bg-slate-800/40 ${
                                          subscriptionType === opt.id
                                            ? "border-yellow-500 bg-yellow-500/5 dark:bg-yellow-500/10"
                                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/10"
                                        }`}
                                      >
                                        <div className="flex-1 pl-4">
                                          <div className="font-bold text-slate-800 dark:text-white text-sm">{opt.label}</div>
                                          <div className="text-[11px] text-slate-400 mt-1 leading-normal font-medium">{opt.desc}</div>
                                        </div>
                                        <div className="text-right shrink-0 flex flex-col items-end justify-center">
                                          <span className="text-xs font-black text-yellow-500">{opt.price}</span>
                                          <div className={`w-5 h-5 rounded-full border-2 mt-2 flex items-center justify-center ${
                                            subscriptionType === opt.id ? "border-yellow-500 bg-yellow-500" : "border-slate-300 dark:border-slate-600"
                                          }`}>
                                            {subscriptionType === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                          </div>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block text-right">{t("profile_payment_transaction_id_label")}</label>
                                  <input 
                                    type="text" 
                                    placeholder={t("profile_payment_transaction_id_placeholder")} 
                                    required
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all font-bold text-slate-800 dark:text-white text-center"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block text-right">{t("profile_payment_date_label")}</label>
                                  <input 
                                    type="date" 
                                    required
                                    title={t("profile_payment_date_label")}
                                    placeholder={t("profile_payment_date_placeholder")}
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                    className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all font-bold text-slate-800 dark:text-white text-center"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block text-right">{t("profile_payment_receipt_image_label")} <span className="text-rose-500">*</span></label>
                                  <input 
                                    type="file"
                                    required
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setReceiptBase64(reader.result as string);
                                        reader.readAsDataURL(file);
                                      } else {
                                        setReceiptBase64("");
                                      }
                                    }}
                                    className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-yellow-500 outline-none transition-all font-bold text-slate-800 dark:text-white text-right file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-yellow-500/10 file:text-yellow-600 hover:file:bg-yellow-500/20"
                                  />
                                </div>

                                <button 
                                  type="submit" 
                                  disabled={paymentLoading || !receiptBase64}
                                  className="w-full py-4 mt-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white rounded-2xl font-black transition-all shadow-[0_10px_30px_-10px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 text-lg hover:-translate-y-1 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {paymentLoading ? t("profile_payment_sending") : (
                                    <><Send className="w-5 h-5 group-hover:scale-110 transition-transform" /> {t("profile_payment_submit_button")}</>
                                  )}
                                </button>
                              </>
                            )}
                          </form>

                          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">{t("profile_payment_receipt_note")}</p>
                            <a href="http://t.me/chi_jkoa" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white rounded-2xl font-black transition-all text-sm hover:shadow-[0_5px_15px_rgba(14,165,233,0.3)]">
                              <Send className="w-4 h-4" /> {t("profile_contact_support_button")}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-medical-600 via-purple-500 to-sky-400" />
                  
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-medical-500/10 rounded-2xl text-medical-500 shadow-inner">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-800 dark:text-white">{t("profile_settings_title")}</h2>
                      <p className="text-slate-500 font-bold mt-1">{t("profile_settings_description")}</p>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {message.text && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                        animate={{ opacity: 1, height: 'auto', marginBottom: 32 }} 
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                      >
                        <div className={`p-5 rounded-2xl flex items-center gap-3 font-bold border shadow-sm ${
                          message.type === "success" 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-500/30 dark:text-emerald-400" 
                            : "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-500/30 dark:text-rose-400"
                        }`}>
                          {message.type === "success" ? <CheckCircle className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
                          <span className="text-lg">{message.text}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form action={handleUpdate} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label htmlFor="name" className="text-sm font-black text-slate-700 dark:text-slate-300 mr-1 flex items-center gap-2">
                          <User className="w-4 h-4 text-medical-500" /> {t("profile_display_name_label")}
                        </label>
                        <input 
                          id="name" name="name" defaultValue={user.name || ""} required
                          placeholder={t("profile_display_name_placeholder")}
                          className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-bold text-slate-800 dark:text-white placeholder:text-slate-400 shadow-sm"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-700 dark:text-slate-300 mr-1 flex items-center gap-2">
                          <Camera className="w-4 h-4 text-purple-500" /> {t("profile_profile_image_url_label")}
                        </label>
                        <input 
                          name="image" defaultValue={user.image || ""} placeholder="https://example.com/image.jpg" dir="ltr"
                          className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-medium text-slate-800 dark:text-white placeholder:text-slate-400 shadow-sm"
                        />
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="studyYear" className="text-sm font-black text-slate-700 dark:text-slate-300 mr-1 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-medical-500" /> {t("profile_study_year_label")}
                        </label>
                        <input 
                          id="studyYear" name="studyYear" defaultValue={user.studyYear || ""} required readOnly
                          placeholder={t("profile_study_year_placeholder")}
                          className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 cursor-not-allowed outline-none transition-all font-bold shadow-sm"
                        />
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mr-1">{t("profile_settings_study_year_note")}</p>
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="wilaya" className="text-sm font-black text-slate-700 dark:text-slate-300 mr-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-medical-500" /> {t("profile_wilaya_label", "ولاية الدراسة")}
                          <span className="text-[10px] bg-medical-500/10 text-medical-500 px-2 py-0.5 rounded-full border border-medical-500/20">مطلوب</span>
                        </label>
                        <div className="relative">
                          <select 
                            id="wilaya" name="wilaya" defaultValue={user.wilaya || ""} required
                            className="w-full p-4 pr-14 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-bold text-slate-800 dark:text-white shadow-sm appearance-none cursor-pointer text-right"
                          >
                            <option value="">{t("profile_wilaya_placeholder", "اختر ولايتك")}</option>
                          {[
                            "الجزائر — جامعة الجزائر 1 — كلية",
                            "الجزائر — جامعة علوم الصحة — كلية",
                            "البليدة — جامعة البليدة 1 — كلية",
                            "وهران — جامعة وهران 1 — كلية",
                            "قسنطينة — جامعة قسنطينة 3 — كلية",
                            "عنابة — جامعة باجي مختار عنابة — كلية",
                            "سطيف — جامعة سطيف 1 — كلية",
                            "باتنة — جامعة باتنة 2 — كلية",
                            "تلمسان — جامعة تلمسان — كلية",
                            "سيدي بلعباس — جامعة الجيلالي ليابس — كلية",
                            "تيزي وزو — جامعة مولود معمري — كلية",
                            "بجاية — جامعة عبد الرحمان ميرة — كلية",
                            "سعيدة — جامعة الدكتور مولاي الطاهر — كلية",
                            "ورقلة — جامعة قاصدي مرباح — كلية",
                            "الجلفة — جامعة زيان عاشور — كلية",
                            "خنشلة — جامعة عباس لغرور — كلية",
                            "تيارت — جامعة ابن خلدون — كلية",
                            "المسيلة — جامعة محمد بوضياف — كلية",
                            "سكيكدة — جامعة 20 أوت 1955 — كلية",
                            "أم البواقي — جامعة العربي بن مهيدي — كلية",
                            "جيجل — جامعة محمد الصديق بن يحيى — كلية",
                            "الشلف — جامعة حسيبة بن بوعلي — كلية",
                            "المدية — جامعة يحيى فارس — كلية",
                            "بسكرة — جامعة محمد خيضر — كلية",
                            "الوادي — جامعة الشهيد حمه لخضر — كلية",
                            "بومرداس — جامعة أمحمد بوقرة — كلية",
                            "قالمة — جامعة باجي مختار عنابة — ملحقة",
                            "عين الدفلى (خميس مليانة) — جامعة الجيلالي بونعامة — ملحقة",
                            "تبسة — جامعة قسنطينة 3 — ملحقة",
                            "تمنراست — جامعة أحمد دراية أدرار — ملحقة",
                            "سوق أهراس — جامعة باجي مختار عنابة — ملحقة",
                            "خنشلة — جامعة باتنة 2 — ملحقة",
                            "جيجل — جامعة عبد الرحمان ميرة بجاية — ملحقة",
                            "تيارت — جامعة وهران 1 — ملحقة",
                            "المسيلة — جامعة سطيف 1 — ملحقة",
                            "أدرار — جامعة أحمد دراية — ملحقة",
                            "تيبازة — جامعة البليدة 1 — ملحقة",
                            "معسكر — جامعة الجيلالي ليابس سيدي بلعباس — ملحقة",
                            "أم البواقي — جامعة قسنطينة 3 — ملحقة",
                            "سكيكدة — جامعة باجي مختار عنابة — ملحقة"
                          ].map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                          </select>
                          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50">
                      <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <Inbox className="w-5 h-5 text-sky-500" /> {t("profile_social_accounts_title")}
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Telegram */}
                        <div className="space-y-2 relative group">
                           <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Send className="w-4 h-4 text-sky-500" /> Telegram
                           </label>
                           <input 
                             name="telegram" defaultValue={user.telegram || ""} placeholder="@username" dir="ltr"
                             className="w-full p-4 pl-24 text-left rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all font-bold text-slate-800 dark:text-white shadow-sm"
                           />
                           {user.telegram && (
                             <div className="absolute top-10 left-4 bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1">
                                {t("profile_social_status_active")} <CheckCircle className="w-3 h-3" />
                             </div>
                           )}
                        </div>
                        {/* Instagram */}
                        <div className="space-y-2 relative group">
                           <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Instagram className="w-4 h-4 text-pink-500" /> Instagram
                           </label>
                           <input 
                             name="instagram" defaultValue={user.instagram || ""} placeholder="username" dir="ltr"
                             className="w-full p-4 pl-24 text-left rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all font-bold text-slate-800 dark:text-white shadow-sm"
                           />
                           {user.instagram && (
                             <div className="absolute top-10 left-4 bg-pink-500/10 text-pink-600 dark:text-pink-400 px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1">
                                {t("profile_social_status_active")} <CheckCircle className="w-3 h-3" />
                             </div>
                           )}
                        </div>
                        {/* Facebook */}
                        <div className="space-y-2 relative group">
                           <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                           </label>
                           <input 
                             name="facebook" defaultValue={user.facebook || ""} placeholder="https://www.facebook.com/your.name" dir="ltr"
                             className="w-full p-4 pl-24 text-left rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all font-bold text-slate-800 dark:text-white shadow-sm"
                           />
                           <p className="text-[10px] text-blue-500/70 font-bold px-1 mt-1">
                             💡 {t("profile_privacy_note")}
                           </p>
                           {user.facebook && (
                             <div className="absolute top-10 left-4 bg-blue-600/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1">
                                {t("profile_social_status_active")} <CheckCircle className="w-3 h-3" />
                             </div>
                           )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <motion.button 
                        type="submit" disabled={loading}
                        whileHover={{ scale: 1.02, translateY: -2 }} whileTap={{ scale: 0.98 }}
                        className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-medical-600 to-sky-500 hover:from-medical-500 hover:to-sky-400 text-white rounded-2xl font-black transition-all shadow-[0_10px_40px_-10px_rgba(14,165,233,0.5)] flex items-center justify-center gap-3 disabled:opacity-70 text-lg group"
                      >
                        {loading ? (
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                            {t("profile_save_changes_button")}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>

                  {/* Password Change Section */}
                  <div className="mt-16 pt-12 border-t-2 border-slate-100 dark:border-slate-800">
                    <div className="flex items-start md:items-center gap-5 mb-8 flex-col md:flex-row">
                      <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/20 shadow-inner">
                        <Lock className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-1">{t("profile_change_password_title")}</h3>
                        <p className="text-sm font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 inline-block px-3 py-1 rounded-lg border border-amber-200 dark:border-amber-500/20 mt-1 shadow-sm">
                          {t("profile_change_password_note")}
                        </p>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {pwMessage.text && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                          <div className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold border shadow-sm ${pwMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-500/30 dark:text-emerald-400' : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-500/30 dark:text-rose-400'}`}>
                            {pwMessage.type === 'success' ? <ShieldCheck className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                            <span>{pwMessage.text}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="bg-slate-50 dark:bg-slate-800/30 p-6 md:p-8 rounded-[2rem] border border-slate-200/50 dark:border-slate-700/50 max-w-2xl shadow-inner">
                      <div className="space-y-6">
                        <div className="relative">
                          <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-2">{t("profile_current_password_label")}</label>
                          <input type={showCurrentPw ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="••••••••" required className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold text-slate-800 dark:text-white tracking-widest text-lg shadow-sm" dir="ltr" />
                          <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute left-4 bottom-4 text-slate-400 hover:text-amber-500 transition-colors bg-slate-100 dark:bg-slate-700 p-2 rounded-xl">{showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                        </div>
                        
                        <div className="relative">
                          <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-2">{t("profile_new_password_label")}</label>
                          <input type={showNewPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="••••••••" required minLength={6} className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold text-slate-800 dark:text-white tracking-widest text-lg shadow-sm" dir="ltr" />
                          <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute left-4 bottom-4 text-slate-400 hover:text-amber-500 transition-colors bg-slate-100 dark:bg-slate-700 p-2 rounded-xl">{showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                        </div>
                        
                        <motion.button 
                          type="button" onClick={(e) => { e.preventDefault(); handleChangePassword(e as any); }} disabled={pwLoading || !currentPw || !newPw} 
                          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                          className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale shadow-[0_10px_30px_-10px_rgba(245,158,11,0.5)] mt-4 text-lg"
                        >
                          {pwLoading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <><Lock className="w-5 h-5" /><span>{t("profile_change_password_button")}</span></>}
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone - Delete Account */}
                  <div className="mt-16 pt-12 border-t-2 border-red-100 dark:border-red-900/30">
                    <div className="flex items-start md:items-center gap-5 mb-8 flex-col md:flex-row">
                      <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shrink-0 border border-red-500/20 shadow-inner">
                        <Trash2 className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-red-600 dark:text-red-400 mb-1">{t("profile_danger_zone_title")}</h3>
                        <p className="text-sm text-red-600/70 dark:text-red-400/70 font-bold">{t("profile_danger_zone_description")}</p>
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 rounded-[2rem] p-6 md:p-8 max-w-2xl">
                      <p className="text-sm text-red-700 dark:text-red-300 font-bold mb-6 leading-relaxed">
                        ⚠️ {t("profile_delete_warning_text")}
                      </p>
                      <motion.button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_-10px_rgba(239,68,68,0.5)] text-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                        {t("profile_delete_account_button")}
                      </motion.button>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowImageModal(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-medical-500" /> {t("profile_change_image_modal_title")}
                </h3>
                <button title={t("profile_close_button")} aria-label={t("profile_close_button")} onClick={() => setShowImageModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-medical-500/20 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                   {tempImageUrl ? (
                      <img src={tempImageUrl} alt="Preview" className="w-full h-full object-cover" onError={() => setTempImageUrl("")} />
                   ) : (
                      <User className="w-12 h-12 text-slate-400" />
                   )}
                </div>
              </div>

              <form onSubmit={handleImageUpdate}>
                <div className="space-y-2 mb-6">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block text-right">{t("profile_new_image_url_label")}</label>
                  <input 
                    type="url"
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    placeholder="https://..."
                    dir="ltr"
                    className="w-full p-4 pl-4 text-left rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-medical-500 focus:ring-4 focus:ring-medical-500/10 outline-none transition-all font-bold"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="flex-1 py-4 bg-medical-500 hover:bg-medical-600 text-white rounded-2xl font-black transition-all shadow-[0_10px_20px_-10px_rgba(14,165,233,0.5)] flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> {t("profile_save_image_button")}</>}
                  </button>
                  <button type="button" onClick={() => setShowImageModal(false)} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-black transition-all">
                    {t("profile_cancel_button")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowDeleteModal(false); setDeletePassword(""); setDeleteError(""); }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-red-200 dark:border-red-500/30 shadow-2xl"
            >
              {/* Top danger stripe */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-600 to-orange-500 rounded-t-[2.5rem]" />

              <button
                title={t("profile_close_button")}
                aria-label={t("profile_close_button")}
                onClick={() => { setShowDeleteModal(false); setDeletePassword(""); setDeleteError(""); }}
                className="absolute top-5 left-5 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center mb-8 mt-4">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center mb-4 border border-red-200 dark:border-red-500/30">
                  <Trash2 className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">{t("profile_delete_confirm_title")}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                  {t("profile_delete_confirm_description_prefix")} <span className="text-red-500 font-black">{t("profile_delete_confirm_description_strong")}</span> {t("profile_delete_confirm_description_suffix")}
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-2 text-right">
                    {t("profile_delete_password_label")}
                  </label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(""); }}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full p-4 rounded-2xl border-2 border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-900/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-bold text-slate-800 dark:text-white tracking-widest text-lg text-left"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleDeleteAccount(); }}
                  />
                </div>

                <AnimatePresence>
                  {deleteError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-bold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {deleteError}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading || !deletePassword}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_10px_20px_-10px_rgba(239,68,68,0.5)]"
                  >
                    {deleteLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Trash2 className="w-4 h-4" />{t("profile_delete_confirm_button")}</>
                    )}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => { setShowDeleteModal(false); setDeletePassword(""); setDeleteError(""); }}
                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-black transition-all"
                  >
                    {t("profile_cancel_button")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
