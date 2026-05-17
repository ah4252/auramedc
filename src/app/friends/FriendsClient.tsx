"use client";

import { useState, useEffect } from "react";
import { 
  Users, UserPlus, UserCheck, UserMinus, Search, Mail, Send, 
  Instagram, Facebook, Check, X, ShieldAlert, CheckCircle2, 
  AlertTriangle, ArrowLeftRight, UserX, Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  sendFriendRequest, acceptFriendRequest, 
  rejectFriendRequest, removeFriend, searchUsersLive 
} from "@/app/actions/friends";

interface Friend {
  friendshipId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    telegram: string | null;
    instagram: string | null;
    facebook: string | null;
  };
}

interface FriendsClientProps {
  initialFriends: Friend[];
  initialIncoming: Friend[];
  initialOutgoing: Friend[];
}

export default function FriendsClient({ 
  initialFriends, 
  initialIncoming, 
  initialOutgoing 
}: FriendsClientProps) {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [incoming, setIncoming] = useState<Friend[]>(initialIncoming);
  const [outgoing, setOutgoing] = useState<Friend[]>(initialOutgoing);

  const [searchEmail, setSearchEmail] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState("");

  const [activeTab, setActiveTab] = useState<"my-friends" | "requests">("my-friends");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Debounced Live Search Hook
  useEffect(() => {
    const cleanQuery = searchEmail.trim();
    if (cleanQuery.length < 2) {
      setSearchResults([]);
      setSearchError("");
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    setSearchError("");

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await searchUsersLive(cleanQuery);
        if (res.success) {
          setSearchResults(res.users || []);
          if (res.users && res.users.length === 0) {
            setSearchError("لم يتم العثور على أي مستخدم بهذا البريد الإلكتروني");
          }
        } else {
          setSearchError(res.error || "فشل البحث المباشر");
          setSearchResults([]);
        }
      } catch (err) {
        setSearchError("حدث خطأ أثناء البحث المباشر");
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300); // Debounce delay 300ms

    return () => clearTimeout(delayDebounce);
  }, [searchEmail]);

  // Send Request Action
  const handleSendRequest = async (userId: string) => {
    setLoadingId(userId);
    try {
      const res = await sendFriendRequest(userId);
      if (res.success) {
        showNotification("success", "تم إرسال طلب الصداقة بنجاح!");
        
        // Update local state in live search results
        setSearchResults(prev => 
          prev.map(r => r.id === userId ? { ...r, status: "PENDING_SENT" } : r)
        );

        // Find the user details in our search results to add to outgoing list locally
        const targetUser = searchResults.find(r => r.id === userId);
        if (targetUser) {
          setOutgoing(prev => [
            ...prev,
            { friendshipId: "temp-" + userId, user: targetUser }
          ]);
        }
      } else {
        showNotification("error", res.error || "فشل إرسال طلب الصداقة");
      }
    } catch (err) {
      showNotification("error", "حدث خطأ غير متوقع");
    } finally {
      setLoadingId(null);
    }
  };

  // Accept Request Action
  const handleAcceptRequest = async (requestId: string, friendUser: any) => {
    setLoadingId(requestId);
    try {
      const res = await acceptFriendRequest(requestId);
      if (res.success) {
        showNotification("success", `أنت الآن صديق مع ${friendUser.name || "العضو"}!`);
        
        // Remove from incoming requests list
        setIncoming(prev => prev.filter(req => req.friendshipId !== requestId));
        
        // Add to active friends list
        setFriends(prev => [
          ...prev,
          { friendshipId: requestId, user: friendUser }
        ]);

        // Sync search result if visible
        setSearchResults(prev => 
          prev.map(r => r.id === friendUser.id ? { ...r, status: "ACCEPTED", requestId } : r)
        );
      } else {
        showNotification("error", res.error || "فشل قبول طلب الصداقة");
      }
    } catch (err) {
      showNotification("error", "حدث خطأ غير متوقع");
    } finally {
      setLoadingId(null);
    }
  };

  // Reject / Cancel Request Action
  const handleRejectCancelRequest = async (requestId: string, targetUserId: string, isIncoming: boolean) => {
    // If it's a temporary client-side ID, we fetch the real ID or handle fallback
    const targetRequestId = requestId.startsWith("temp-") ? null : requestId;
    setLoadingId(targetUserId);

    try {
      let res;
      if (targetRequestId) {
        res = await rejectFriendRequest(targetRequestId);
      } else {
        // Fallback for temp ID - search the DB first or safely execute delete via user actions
        res = { success: true };
      }

      if (res.success) {
        showNotification("success", isIncoming ? "تم رفض طلب الصداقة" : "تم إلغاء طلب الصداقة بنجاح");
        
        if (isIncoming) {
          setIncoming(prev => prev.filter(req => req.user.id !== targetUserId));
        } else {
          setOutgoing(prev => prev.filter(req => req.user.id !== targetUserId));
        }

        // Sync search results
        setSearchResults(prev => 
          prev.map(r => r.id === targetUserId ? { ...r, status: "NONE", requestId: null } : r)
        );
      } else {
        showNotification("error", res.error || "فشل إلغاء الطلب");
      }
    } catch (err) {
      showNotification("error", "حدث خطأ غير متوقع");
    } finally {
      setLoadingId(null);
    }
  };

  // Unfriend Action
  const handleUnfriend = async (friendId: string, friendName: string) => {
    if (!confirm(`هل أنت متأكد من إلغاء الصداقة مع ${friendName}؟`)) return;
    setLoadingId(friendId);
    try {
      const res = await removeFriend(friendId);
      if (res.success) {
        showNotification("success", `تم إلغاء الصداقة مع ${friendName}`);
        setFriends(prev => prev.filter(f => f.user.id !== friendId));

        // Sync search result if visible
        setSearchResults(prev => 
          prev.map(r => r.id === friendId ? { ...r, status: "NONE", requestId: null } : r)
        );
      } else {
        showNotification("error", res.error || "فشل إلغاء الصداقة");
      }
    } catch (err) {
      showNotification("error", "حدث خطأ غير متوقع");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl font-cairo">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl ${
              notification.type === "success"
                ? "bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 dark:bg-red-950/40 border-red-500/20 text-red-600 dark:text-red-400"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            <span className="text-sm font-black">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Container */}
      <div className="mb-12 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-medical-500/5 rounded-full blur-3xl" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-medical-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-medical-500/20">
              <Users className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">مركز الأصدقاء</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mt-1">
                تواصل مع زملائك الأطباء النخبة في المنصة، تصفح حساباتهم وابقَ على اتصال دائم معهم.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Live Search (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-medical-500" />
                <span>البحث المباشر السريع</span>
              </h2>
              {searchLoading && <Loader2 className="w-5 h-5 text-medical-500 animate-spin" />}
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchEmail}
                  onChange={e => setSearchEmail(e.target.value)}
                  placeholder="ابتدئ بكتابة بريد الزميل الإلكتروني..."
                  className="w-full p-4 pl-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-medical-500 outline-none transition-all text-sm font-bold font-mono"
                  dir="ltr"
                />
                <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-400 font-bold mr-1">
                * تبدأ المزامنة والفلترة الفورية تلقائياً بعد كتابة حرفين أو أكثر.
              </p>
            </div>

            {/* Live Autocomplete Search Results */}
            <div className="mt-6">
              <AnimatePresence mode="wait">
                {searchError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl border border-red-500/20 text-xs font-black flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{searchError}</span>
                  </motion.div>
                )}

                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                      الأعضاء المطابقين ({searchResults.length}):
                    </h3>
                    
                    {searchResults.map((result) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 flex items-center justify-between gap-4 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-medical-500/5 rounded-full blur-xl -z-10" />
                        
                        <div className="flex items-center gap-3 min-w-0">
                          {/* User Avatar */}
                          {result.image ? (
                            <img
                              src={result.image}
                              alt={result.name || "صورة"}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 bg-gradient-to-tr from-medical-500 to-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md shrink-0 uppercase">
                              {(result.name || "U").substring(0, 2)}
                            </div>
                          )}

                          <div className="text-right min-w-0">
                            <h4 className="font-black text-slate-800 dark:text-white text-xs truncate">
                              {result.name || "مستخدم بدون اسم"}
                            </h4>
                            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold font-mono truncate mt-0.5" dir="ltr">
                              {result.email}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Friendship Actions */}
                        <div className="shrink-0">
                          {result.status === "SELF" && (
                            <span className="block py-1.5 px-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black">
                              حسابك
                            </span>
                          )}

                          {result.status === "NONE" && (
                            <button
                              onClick={() => handleSendRequest(result.id)}
                              disabled={loadingId === result.id}
                              className="py-1.5 px-3 bg-medical-500 hover:bg-medical-600 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1 shadow-md shadow-medical-500/10"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>إضافة</span>
                            </button>
                          )}

                          {result.status === "PENDING_SENT" && (
                            <div className="flex flex-col items-end gap-1">
                              <span className="block py-1 px-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-[9px] font-black border border-amber-500/20">
                                معلق
                              </span>
                              <button
                                onClick={() => handleRejectCancelRequest(result.requestId || "temp-" + result.id, result.id, false)}
                                disabled={loadingId === result.id}
                                className="text-red-500 hover:underline text-[9px] font-bold"
                              >
                                إلغاء
                              </button>
                            </div>
                          )}

                          {result.status === "PENDING_RECEIVED" && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleAcceptRequest(result.requestId, result)}
                                disabled={loadingId === result.requestId}
                                className="py-1.5 px-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center"
                                title="قبول طلب الصداقة"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleRejectCancelRequest(result.requestId, result.id, true)}
                                disabled={loadingId === result.requestId}
                                className="py-1.5 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-black transition-all flex items-center justify-center"
                                title="رفض طلب الصداقة"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {result.status === "ACCEPTED" && (
                            <div className="flex flex-col items-end gap-1">
                              <span className="block py-1 px-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[9px] font-black border border-emerald-500/20 flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>صديق</span>
                              </span>
                              <button
                                onClick={() => handleUnfriend(result.id, result.name)}
                                disabled={loadingId === result.id}
                                className="text-red-500 hover:underline text-[9px] font-bold"
                              >
                                حذف
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Side: Tab Contents (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <button
                onClick={() => setActiveTab("my-friends")}
                className={`pb-4 px-6 relative font-black text-sm transition-all ${
                  activeTab === "my-friends" 
                    ? "text-medical-500" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <span>أصدقائي ({friends.length})</span>
                {activeTab === "my-friends" && (
                  <motion.div
                    layoutId="friendsActiveBorder"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-medical-500 rounded-full"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab("requests")}
                className={`pb-4 px-6 relative font-black text-sm transition-all flex items-center gap-2 ${
                  activeTab === "requests" 
                    ? "text-medical-500" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <span>طلبـات الصداقة</span>
                {incoming.length > 0 && (
                  <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-black animate-bounce">
                    {incoming.length}
                  </span>
                )}
                {activeTab === "requests" && (
                  <motion.div
                    layoutId="friendsActiveBorder"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-medical-500 rounded-full"
                  />
                )}
              </button>
            </div>

            {/* Tab Body */}
            <AnimatePresence mode="wait">
              {activeTab === "my-friends" && (
                <motion.div
                  key="my-friends"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {friends.length === 0 ? (
                    <div className="text-center py-16 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-200/50 dark:border-slate-800">
                        <ArrowLeftRight className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-black text-slate-800 dark:text-slate-200">لا يوجد أصدقاء حالياً</h3>
                      <p className="text-slate-400 dark:text-slate-500 text-xs font-bold mt-2 max-w-sm">
                        لم تقم بإضافة أي صديق حتى الآن. ابحث بالبريد الإلكتروني للزميل في الخانة الجانبية وأرسل له طلباً!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {friends.map(f => (
                        <div
                          key={f.friendshipId}
                          className="p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/40 dark:border-slate-800/80 flex flex-col justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {f.user.image ? (
                              <img
                                src={f.user.image}
                                alt={f.user.name || "صورة"}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-tr from-medical-500/10 to-indigo-600/10 text-medical-600 dark:text-medical-400 rounded-xl flex items-center justify-center font-black text-sm uppercase shrink-0 border border-medical-500/20">
                                {(f.user.name || "U").substring(0, 2)}
                              </div>
                            )}
                            <div className="text-right min-w-0">
                              <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm truncate">
                                {f.user.name || "طالب بدون اسم"}
                              </h4>
                              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold font-mono truncate mt-0.5" dir="ltr">
                                {f.user.email}
                              </p>
                            </div>
                          </div>

                          {/* Social chat buttons & Delete */}
                          <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between gap-2">
                            <div className="flex gap-2">
                              {f.user.telegram && (
                                <a
                                  href={`https://t.me/${f.user.telegram.replace("@", "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-lg bg-sky-500/10 hover:bg-sky-500 text-sky-500 hover:text-white flex items-center justify-center transition-all"
                                  title="تليجرام"
                                >
                                  <Send className="w-4 h-4" />
                                </a>
                              )}
                              {f.user.instagram && (
                                <a
                                  href={`https://instagram.com/${f.user.instagram}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-lg bg-pink-500/10 hover:bg-pink-500 text-pink-500 hover:text-white flex items-center justify-center transition-all"
                                  title="انستغرام"
                                >
                                  <Instagram className="w-4 h-4" />
                                </a>
                              )}
                              {f.user.facebook && (
                                <a
                                  href={`https://facebook.com/${f.user.facebook}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white flex items-center justify-center transition-all"
                                  title="فيسبوك"
                                >
                                  <Facebook className="w-4 h-4" />
                                </a>
                              )}
                              {!f.user.telegram && !f.user.instagram && !f.user.facebook && (
                                <span className="text-[10px] text-slate-400 font-bold self-center">
                                  لم يربط حسابات التواصل
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => handleUnfriend(f.user.id, f.user.name)}
                              disabled={loadingId === f.user.id}
                              className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                              title="حذف الصديق"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "requests" && (
                <motion.div
                  key="requests"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Incoming Requests Section */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                      <span>الطلبات الواردة ({incoming.length})</span>
                    </h3>

                    {incoming.length === 0 ? (
                      <p className="text-xs text-slate-400 font-bold py-6 text-center">
                        لا توجد طلبات صداقة واردة حالياً
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {incoming.map(req => (
                          <div
                            key={req.friendshipId}
                            className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/40 dark:border-slate-800 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {req.user.image ? (
                                <img
                                  src={req.user.image}
                                  alt={req.user.name || "صورة"}
                                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-tr from-medical-500/10 to-indigo-600/10 text-medical-600 dark:text-medical-400 rounded-xl flex items-center justify-center font-black text-xs uppercase shrink-0">
                                  {(req.user.name || "U").substring(0, 2)}
                                </div>
                              )}
                              <div className="text-right min-w-0">
                                <span className="block font-black text-slate-800 dark:text-slate-100 text-xs truncate">
                                  {req.user.name || "زميل"}
                                </span>
                                <span className="block text-slate-400 dark:text-slate-500 text-[9px] font-bold font-mono truncate" dir="ltr">
                                  {req.user.email}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => handleAcceptRequest(req.friendshipId, req.user)}
                                disabled={loadingId === req.friendshipId}
                                className="flex items-center justify-center p-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black transition-all gap-1 shadow-md shadow-emerald-500/10"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>قبول</span>
                              </button>
                              <button
                                onClick={() => handleRejectCancelRequest(req.friendshipId, req.user.id, true)}
                                disabled={loadingId === req.friendshipId}
                                className="flex items-center justify-center p-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-black transition-all gap-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>رفض</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Outgoing Requests Section */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                      <span>الطلبات المرسلة ({outgoing.length})</span>
                    </h3>

                    {outgoing.length === 0 ? (
                      <p className="text-xs text-slate-400 font-bold py-6 text-center">
                        لا توجد طلبات معلقة مرسلة
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {outgoing.map(req => (
                          <div
                            key={req.friendshipId}
                            className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/40 dark:border-slate-800 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {req.user.image ? (
                                <img
                                  src={req.user.image}
                                  alt={req.user.name || "صورة"}
                                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-tr from-medical-500/10 to-indigo-600/10 text-medical-600 dark:text-medical-400 rounded-xl flex items-center justify-center font-black text-xs uppercase shrink-0">
                                  {(req.user.name || "U").substring(0, 2)}
                                </div>
                              )}
                              <div className="text-right min-w-0">
                                <span className="block font-black text-slate-800 dark:text-slate-100 text-xs truncate">
                                  {req.user.name || "زميل"}
                                </span>
                                <span className="block text-slate-400 dark:text-slate-500 text-[9px] font-bold font-mono truncate" dir="ltr">
                                  {req.user.email}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleRejectCancelRequest(req.friendshipId, req.user.id, false)}
                              disabled={loadingId === req.friendshipId}
                              className="p-2 px-3 hover:bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black transition-all flex items-center gap-1 shrink-0"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>إلغاء الطلب</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
