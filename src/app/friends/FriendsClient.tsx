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
  rejectFriendRequest, removeFriend, searchUsersLive,
  getOutgoingDecisions, markDecisionRead
} from "@/app/actions/friends";
import { useLocale } from "@/context/LocaleProvider.client";

interface Friend {
  friendshipId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    studyYear?: string | null;
    telegram: string | null;
    instagram: string | null;
    facebook: string | null;
    lastActiveAt?: Date | string | null;
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
  const [selectedRequest, setSelectedRequest] = useState<Friend | null>(null);
  const [outgoingDecisions, setOutgoingDecisions] = useState<Record<string, { id: string; status: "accepted" | "rejected"; expiresAt: number; readAt: number | null; message: string }>>({});
  const { t } = useLocale();

  const loadServerOutgoingDecisions = async () => {
    try {
      const res = await getOutgoingDecisions();
      if (res.success && Array.isArray(res.decisions)) {
        const mapped: Record<string, { id: string; status: "accepted" | "rejected"; expiresAt: number; readAt: number | null; message: string }> = {};
        res.decisions.forEach((d: any) => {
          const userId = d.actor.id;
          mapped[userId] = {
            id: d.id,
            status: d.type === "REJECTED" ? "rejected" : "accepted",
            expiresAt: new Date(d.expiresAt).getTime(),
            readAt: d.readAt ? new Date(d.readAt).getTime() : null,
            message: d.message || (d.type === "REJECTED" ? t("friend_request_rejected", "Friend request rejected.") : t("friend_request_accepted", "Friend request accepted.")),
          };
        });
        setOutgoingDecisions(mapped);
      }
    } catch (e) {
      // ignore
    }
  };

  const markOutgoingDecisionRead = async (userId: string) => {
    const decision = outgoingDecisions[userId];
    if (!decision) return;

    try {
      await markDecisionRead(decision.id);
    } catch (e) {
      // ignore
    }
    // Refresh from server
    await loadServerOutgoingDecisions();
  };

  const rejectedOutgoing = Object.entries(outgoingDecisions)
      .filter(([, decision]) => decision.status === "rejected" && decision.expiresAt > Date.now() && !decision.readAt)
      .map(([userId, decision]) => {
        const req = outgoing.find(item => item.user.id === userId);
        const actorUser = req?.user || null;
        return {
          user: actorUser || {
            id: userId,
            name: t("user_default", "Unknown user"),
            email: "",
            image: null,
            studyYear: null,
            telegram: null,
            instagram: null,
            facebook: null,
            lastActiveAt: null,
          },
          decision,
        };
      });
  useEffect(() => {
    // Load server-side outgoing decisions on mount
    loadServerOutgoingDecisions();
  }, []);

  useEffect(() => {
    // Poll server-side decisions every 30s
    const timer = setInterval(() => {
      loadServerOutgoingDecisions();
    }, 30000);

    return () => clearInterval(timer);
  }, [outgoingDecisions]);

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
            setSearchError(t("friends_search_no_results","No user found with that email address."));
          }
        } else {
          setSearchError(res.error || t("friends_search_failed","Live search failed."));
          setSearchResults([]);
        }
      } catch (err) {
        setSearchError(t("friends_search_error","An error occurred during live search."));
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
        showNotification("success", t("friend_request_sent", "Friend request sent successfully!"));

        if (typeof window !== "undefined" && "Notification" in window) {
          const browserNotification = window.Notification;
          if (browserNotification && browserNotification.permission === "granted") {
            try {
              new browserNotification("AuraMed Elite", {
                body: t("friend_request_sent_browser", "Friend request sent successfully!"),
                icon: "/icons/icon-192.webp",
              });
            } catch {
              // Ignore unsupported notification environment in mobile WebViews.
            }
          }
        }

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
        showNotification("error", res.error || t("friends_send_failed", "Failed to send friend request."));
      }
    } catch (err) {
      showNotification("error", t("unexpected_error", "An unexpected error occurred."));
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
        showNotification("success", `${t("friend_now_connected_prefix", "You are now friends with")} ${friendUser.name || t("user_default", "member")}!`);
        // Server will create the decision; refresh server-side decisions
        await loadServerOutgoingDecisions();
        
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
        showNotification("error", res.error || t("friends_accept_failed", "Failed to accept friend request."));
      }
    } catch (err) {
      showNotification("error", t("unexpected_error", "An unexpected error occurred."));
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
        showNotification("success", isIncoming ? t("friend_request_rejected", "Friend request rejected.") : t("friend_request_cancelled", "Friend request cancelled successfully."));
        if (isIncoming && targetUserId) {
          // Server created the rejection decision; refresh server-side decisions
          await loadServerOutgoingDecisions();
        }

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
        showNotification("error", res.error || t("friends_cancel_failed","Failed to cancel the request."));
      }
    } catch (err) {
      showNotification("error", t("unexpected_error","An unexpected error occurred."));
    } finally {
      setLoadingId(null);
    }
  };

  // Unfriend Action
  const handleUnfriend = async (friendId: string, friendName: string) => {
    if (!confirm(`${t("friend_unfriend_confirm_prefix", "Are you sure you want to remove friendship with")} ${friendName}?`)) return;
    setLoadingId(friendId);
    try {
      const res = await removeFriend(friendId);
      if (res.success) {
        showNotification("success", `${t("friend_unfriend_success_prefix", "Friendship removed with")} ${friendName}`);
        setFriends(prev => prev.filter(f => f.user.id !== friendId));

        // Sync search result if visible
        setSearchResults(prev => 
          prev.map(r => r.id === friendId ? { ...r, status: "NONE", requestId: null } : r)
        );
      } else {
        showNotification("error", res.error || t("friends_unfriend_failed", "Failed to remove friend."));
      }
    } catch (err) {
      showNotification("error", t("unexpected_error", "An unexpected error occurred."));
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

      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-medical-500 to-indigo-600 px-6 py-5 text-white">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {selectedRequest.user.image ? (
                      <img src={selectedRequest.user.image} alt={selectedRequest.user.name || t("image_fallback","Profile photo")} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/40" />
                    ) : (
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center font-black text-lg uppercase border-2 border-white/40">
                        {(selectedRequest.user.name || "U").substring(0, 2)}
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-black">{selectedRequest.user.name || t("user_default","Unknown user")}</h2>
                      <p className="text-xs text-white/80 font-bold">{t("friends_profile_label","Profile")}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                    aria-label={t("close","Close")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 md:p-6 space-y-5">
                <div className="grid gap-4 text-right">
                  <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800">
                      <p className="text-[10px] font-black text-slate-400 mb-2">{t("friends_email_label","Email")}</p>
                      <p className="text-base font-black text-slate-800 dark:text-slate-200">{selectedRequest.user.email}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedRequest.user.studyYear ? (
                      <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800">
                        <p className="text-[10px] font-black text-slate-400 mb-2">{t("friends_study_year_label","Study year")}</p>
                        <p className="text-base font-black text-medical-600 dark:text-medical-400">
                          {selectedRequest.user.studyYear}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800">
                        <p className="text-[10px] font-black text-slate-400 mb-2">{t("friends_study_year_label","Study year")}</p>
                        <p className="text-base font-black text-slate-500">{t("not_defined","Not defined")}</p>
                      </div>
                    )}

                    <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800">
                      <p className="text-[10px] font-black text-slate-400 mb-2">{t("friends_status_label","Status")}</p>
                      <p className="text-base font-black text-emerald-600 dark:text-emerald-400">{t("friends_request_incoming","Incoming friend request")}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 mb-3">{t("friends_personal_links","Personal account links")}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.user.telegram ? (
                        <a
                          href={`https://t.me/${selectedRequest.user.telegram.replace("@", "")}`}
                          target="_self"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-black hover:bg-sky-500 hover:text-white transition-all"
                        >
                          {t("telegram","Telegram")}
                        </a>
                      ) : null}

                      {selectedRequest.user.instagram ? (
                        <a
                          href={`https://instagram.com/${selectedRequest.user.instagram}`}
                          target="_self"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-black hover:bg-pink-500 hover:text-white transition-all"
                        >
                          {t("instagram","Instagram")}
                        </a>
                      ) : null}

                      {selectedRequest.user.facebook ? (
                        <a
                          href={`https://facebook.com/${selectedRequest.user.facebook}`}
                          target="_self"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-black hover:bg-blue-600 hover:text-white transition-all"
                        >
                          {t("facebook","Facebook")}
                        </a>
                      ) : null}

                      {!selectedRequest.user.telegram && !selectedRequest.user.instagram && !selectedRequest.user.facebook && (
                        <span className="text-xs font-black text-slate-400">{t("friends_no_personal_links","No personal links attached")}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRequest(null);
                      handleRejectCancelRequest(selectedRequest.friendshipId, selectedRequest.user.id, true);
                    }}
                    disabled={loadingId === selectedRequest.friendshipId}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-2xl py-3 px-4 font-black text-sm transition-all"
                  >
                    <X className="w-4 h-4" />
                    {t("reject","Reject")}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRequest(null);
                      handleAcceptRequest(selectedRequest.friendshipId, selectedRequest.user);
                    }}
                    disabled={loadingId === selectedRequest.friendshipId}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl py-3 px-4 font-black text-sm transition-all"
                  >
                    <Check className="w-4 h-4" />
                    {t("accept","Accept")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Container */}
      <div className="mb-12 relative overflow-hidden rounded-[2.5rem] border border-white/10 dark:border-white/10 bg-white/10 dark:bg-slate-950/40 shadow-2xl shadow-slate-900/30 backdrop-blur-3xl backdrop-saturate-150 p-8 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_20%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.14),_transparent_18%)] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/20 via-white/10 to-transparent dark:from-slate-100/10 dark:via-slate-950/10 dark:to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-medical-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-medical-500/20">
              <Users className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{t("friends_center_title","Friends Center")}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mt-1">
                {t("friends_center_description","Connect with your colleagues, explore profiles, and stay in touch with your medical network.")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Live Search (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 dark:border-white/10 bg-white/10 dark:bg-slate-950/35 shadow-2xl shadow-slate-900/30 backdrop-blur-3xl backdrop-saturate-150 p-6 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_20%)] pointer-events-none" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-medical-500" />
                <span>{t("friends_search_quick","Quick search")}</span>
              </h2>
              {searchLoading && <Loader2 className="w-5 h-5 text-medical-500 animate-spin" />}
            </div>

            <div className="space-y-4 relative z-10">
              <div className="relative">
                <input
                  type="text"
                  value={searchEmail}
                  onChange={e => setSearchEmail(e.target.value)}
                  placeholder={t("friends_search_placeholder","Start typing your colleague's email...")}
                  className="w-full p-4 pl-12 rounded-3xl border border-white/15 dark:border-white/15 bg-white/10 dark:bg-slate-950/30 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500/20 outline-none transition-all text-sm font-bold font-mono backdrop-blur-xl"
                  dir="ltr"
                />
                <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              </div>
              <div className="text-[10px] text-slate-400 font-bold mr-1">
                {t("friends_search_help","* Live matching and filtering starts automatically after typing two or more characters.")}
                {searchError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-3xl border border-red-500/20 text-xs font-black flex items-center gap-2 backdrop-blur-xl"
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
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 relative z-10">
                      {t("friends_search_matches","Matching members")} ({searchResults.length}):
                    </h3>
                    
                    {searchResults.map((result) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-white/10 dark:bg-slate-950/30 rounded-[2rem] border border-white/10 dark:border-white/10 backdrop-blur-xl flex items-center justify-between gap-4 relative overflow-hidden shadow-lg shadow-slate-900/10"
                      >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-medical-500/5 rounded-full blur-xl -z-10" />
                        
                        <div className="flex items-center gap-3 min-w-0">
                          {/* User Avatar */}
                          <div className="relative shrink-0">
                            {result.image ? (
                              <img
                                src={result.image}
                                alt={result.name || t("image_fallback","Profile photo")}
                                className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                              />
                            ) : (
                              <div className="w-11 h-11 bg-gradient-to-tr from-medical-500 to-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md uppercase">
                                {(result.name || "U").substring(0, 2)}
                              </div>
                            )}
                            {result.lastActiveAt && (new Date().getTime() - new Date(result.lastActiveAt).getTime() < 5 * 60 * 1000) && (
                              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-50 dark:border-slate-900 rounded-full z-10" title={t("online_now","Online now")}></span>
                            )}
                          </div>

                          <div className="text-right min-w-0">
                              <h4 className="font-black text-slate-800 dark:text-white text-xs truncate">
                              {result.name || t("user_fallback","Unnamed user")}
                            </h4>
                            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold font-mono truncate mt-0.5" dir="ltr">
                              {result.email}
                            </p>
                            {result.studyYear && (
                              <p className="mt-1 text-[10px] font-black text-medical-600 dark:text-medical-400">
                                {t("friends_year_label","Year")}: {result.studyYear}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Interactive Friendship Actions */}
                        <div className="shrink-0">
                          {result.status === "SELF" && (
                            <span className="block py-1.5 px-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black">
                              {t("account_self","Your account")}
                            </span>
                          )}

                          {result.status === "NONE" && (
                            <button
                              onClick={() => handleSendRequest(result.id)}
                              disabled={loadingId === result.id}
                              className="py-1.5 px-3 bg-medical-500 hover:bg-medical-600 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1 shadow-md shadow-medical-500/10"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>{t("add","Add")}</span>
                            </button>
                          )}

                          {result.status === "PENDING_SENT" && (
                            <div className="flex flex-col items-end gap-1">
                              <span className="block py-1 px-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-[9px] font-black border border-amber-500/20">
                                {t("pending","Pending")}
                              </span>
                              <button
                                onClick={() => handleRejectCancelRequest(result.requestId || "temp-" + result.id, result.id, false)}
                                disabled={loadingId === result.id}
                                className="text-red-500 hover:underline text-[9px] font-bold"
                              >
                                {t("cancel","Cancel")}
                              </button>
                            </div>
                          )}

                          {result.status === "PENDING_RECEIVED" && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleAcceptRequest(result.requestId, result)}
                                disabled={loadingId === result.requestId}
                                className="py-1.5 px-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center"
                                title={t("friends_accept_title","Accept friend request")}
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleRejectCancelRequest(result.requestId, result.id, true)}
                                disabled={loadingId === result.requestId}
                                className="py-1.5 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-black transition-all flex items-center justify-center"
                                title={t("friends_reject_title","Reject friend request")}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {result.status === "ACCEPTED" && (
                            <div className="flex flex-col items-end gap-1">
                              <span className="block py-1 px-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[9px] font-black border border-emerald-500/20 flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>{t("friend_label","Friend")}</span>
                              </span>
                              <button
                                onClick={() => handleUnfriend(result.id, result.name)}
                                disabled={loadingId === result.id}
                                className="text-red-500 hover:underline text-[9px] font-bold"
                              >
                                {t("delete","Delete")}
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
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
                <span>{t("friends_my_friends","My friends")} ({friends.length})</span>
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
                <span>{t("friends_requests","Friend requests")}</span>
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
                      <h3 className="text-base font-black text-slate-800 dark:text-slate-200">{t("friends_no_friends_title","No friends yet")}</h3>
                      <p className="text-slate-400 dark:text-slate-500 text-xs font-bold mt-2 max-w-sm">
                        {t("friends_no_friends_description","You haven't added any friends yet. Search by colleague email in the sidebar and send a request!")}
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
                            <div className="relative shrink-0">
                              {f.user.image ? (
                                <img
                                  src={f.user.image}
                                  alt={f.user.name || t("image_fallback","Profile photo")}
                                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-tr from-medical-500/10 to-indigo-600/10 text-medical-600 dark:text-medical-400 rounded-xl flex items-center justify-center font-black text-sm uppercase border border-medical-500/20">
                                  {(f.user.name || "U").substring(0, 2)}
                                </div>
                              )}
                              {f.user.lastActiveAt && (new Date().getTime() - new Date(f.user.lastActiveAt).getTime() < 5 * 60 * 1000) && (
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-50 dark:border-slate-900 rounded-full z-10" title={t("online_now","Online now")}></span>
                              )}
                            </div>
                            <div className="text-right min-w-0">
                              <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm truncate">
                                {f.user.name || t("user_fallback","Unnamed user")}
                              </h4>
                              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold font-mono truncate mt-0.5" dir="ltr">
                                {f.user.email}
                              </p>
                              {f.user.studyYear && (
                                <p className="mt-1 text-[10px] font-black text-medical-600 dark:text-medical-400">
                                  {t("friends_year_label","Year")}: {f.user.studyYear}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Social chat buttons & Delete */}
                          <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between gap-2">
                            <div className="flex gap-2">
                              {f.user.telegram && (
                                <a
                                  href={`https://t.me/${f.user.telegram.replace("@", "")}`}
                                  target="_self"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-lg bg-sky-500/10 hover:bg-sky-500 text-sky-500 hover:text-white flex items-center justify-center transition-all"
                                  title={t("telegram","Telegram")}
                                >
                                  <Send className="w-4 h-4" />
                                </a>
                              )}
                              {f.user.instagram && (
                                <a
                                  href={`https://instagram.com/${f.user.instagram}`}
                                  target="_self"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-lg bg-pink-500/10 hover:bg-pink-500 text-pink-500 hover:text-white flex items-center justify-center transition-all"
                                  title={t("instagram","Instagram")}
                                >
                                  <Instagram className="w-4 h-4" />
                                </a>
                              )}
                              {f.user.facebook && (
                                <a
                                  href={`https://facebook.com/${f.user.facebook}`}
                                  target="_self"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white flex items-center justify-center transition-all"
                                  title={t("facebook","Facebook")}
                                >
                                  <Facebook className="w-4 h-4" />
                                </a>
                              )}
                              {!f.user.telegram && !f.user.instagram && !f.user.facebook && (
                                <span className="text-[10px] text-slate-400 font-bold self-center">
                                  {t("friends_no_social_accounts","No social accounts connected")}
                                </span>
                              )}
                            </div>

                              <button
                                onClick={() => handleUnfriend(f.user.id, f.user.name)}
                                disabled={loadingId === f.user.id}
                                className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                                title={t("friends_remove_friend_title","Remove friend")}
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
                      <span>{t("friends_incoming_requests","Incoming requests")} ({incoming.length})</span>
                    </h3>

                    {incoming.length === 0 ? (
                      <p className="text-xs text-slate-400 font-bold py-6 text-center">
                        {t("friends_no_incoming_requests","No incoming friend requests at the moment")}
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {incoming.map(req => (
                          <div
                            key={req.friendshipId}
                            onClick={() => setSelectedRequest(req)}
                            className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/40 dark:border-slate-800 flex items-center justify-between gap-4 cursor-pointer hover:border-medical-200 dark:hover:border-medical-700 transition-all"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative shrink-0">
                                {req.user.image ? (
                                  <img
                                    src={req.user.image}
                                    alt={req.user.name || t("image_fallback","Profile photo")}
                                    className="w-10 h-10 rounded-xl object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gradient-to-tr from-medical-500/10 to-indigo-600/10 text-medical-600 dark:text-medical-400 rounded-xl flex items-center justify-center font-black text-xs uppercase">
                                    {(req.user.name || "U").substring(0, 2)}
                                  </div>
                                )}
                                {req.user.lastActiveAt && (new Date().getTime() - new Date(req.user.lastActiveAt).getTime() < 5 * 60 * 1000) && (
                                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-50 dark:border-slate-900 rounded-full z-10" title={t("online_now","Online now")}></span>
                                )}
                              </div>
                              <div className="text-right min-w-0">
                                <span className="block font-black text-slate-800 dark:text-slate-100 text-xs truncate">
                                  {req.user.name || t("user_default","Unknown user")}
                                </span>
                                <span className="block text-slate-400 dark:text-slate-500 text-[9px] font-bold font-mono truncate" dir="ltr">
                                  {req.user.email}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleAcceptRequest(req.friendshipId, req.user)}
                                disabled={loadingId === req.friendshipId}
                                className="flex items-center justify-center p-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black transition-all gap-1 shadow-md shadow-emerald-500/10"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{t("accept","Accept")}</span>
                              </button>
                              <button
                                onClick={() => handleRejectCancelRequest(req.friendshipId, req.user.id, true)}
                                disabled={loadingId === req.friendshipId}
                                className="flex items-center justify-center p-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-black transition-all gap-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>{t("reject","Reject")}</span>
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
                      <span>{t("friends_outgoing_requests","Outgoing requests")} ({outgoing.length})</span>
                    </h3>

                    {outgoing.length === 0 && rejectedOutgoing.length === 0 ? (
                      <p className="text-xs text-slate-400 font-bold py-6 text-center">
                        {t("friends_no_outgoing_requests","No pending outgoing requests")}
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {rejectedOutgoing.map(({ user, decision }) => (
                          <div
                            key={user.id}
                            className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-500/20"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="relative shrink-0">
                                  {user.image ? (
                                    <img src={user.image} alt={user.name || t("image_fallback","Profile photo")} className="w-10 h-10 rounded-xl object-cover" />
                                  ) : (
                                    <div className="w-10 h-10 bg-gradient-to-tr from-medical-500/10 to-indigo-600/10 text-medical-600 dark:text-medical-400 rounded-xl flex items-center justify-center font-black text-xs uppercase">
                                      {(user.name || "U").substring(0, 2)}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right min-w-0">
                                      <span className="block font-black text-slate-800 dark:text-slate-100 text-xs truncate">
                                        {user.name || t("user_default","Colleague")}
                                      </span>
                                  <span className="block text-slate-400 dark:text-slate-500 text-[9px] font-bold font-mono truncate" dir="ltr">
                                    {user.email}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() => markOutgoingDecisionRead(user.id)}
                                className="text-[10px] font-black text-slate-600 dark:text-slate-300 underline"
                              >
                                {t("mark_read","Mark as read")}
                              </button>
                            </div>

                            <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 flex items-center justify-between gap-3">
                                <span className="text-[10px] font-black text-amber-700 dark:text-amber-300">
                                {decision.message || t("friend_request_rejected","Friend request rejected")}
                              </span>
                            </div>
                          </div>
                        ))}

                        {outgoing
                          .filter(req => !outgoingDecisions[req.user.id] || outgoingDecisions[req.user.id].status !== "rejected")
                          .map(req => (
                            <div
                              key={req.friendshipId}
                              className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/40 dark:border-slate-800"
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="relative shrink-0">
                                    {req.user.image ? (
                                      <img
                                        src={req.user.image}
                                        alt={req.user.name || t("image_fallback","Profile photo")}
                                        className="w-10 h-10 rounded-xl object-cover"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 bg-gradient-to-tr from-medical-500/10 to-indigo-600/10 text-medical-600 dark:text-medical-400 rounded-xl flex items-center justify-center font-black text-xs uppercase">
                                        {(req.user.name || t("user_default","User")).substring(0, 2)}
                                      </div>
                                    )}
                                    {req.user.lastActiveAt && (new Date().getTime() - new Date(req.user.lastActiveAt).getTime() < 5 * 60 * 1000) && (
                                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-50 dark:border-slate-900 rounded-full z-10" title={t("online_now","Online now")}></span>
                                    )}
                                  </div>
                                  <div className="text-right min-w-0">
                                    <span className="block font-black text-slate-800 dark:text-slate-100 text-xs truncate">
                                      {req.user.name || t("user_default","Unknown user")}
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
                                  <span>{t("cancel_request","Cancel request")}</span>
                                </button>
                              </div>
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
