"use client";

import { useState, useEffect } from "react";
import { getSocialUsers, bulkClearSocialLinks } from "@/app/actions/socialAdmin";
import { User, Send, Instagram, Facebook, Calendar, Mail, ExternalLink, Share2, X, Globe, Trash2, Loader2, CheckSquare, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSocialUrl } from "@/lib/utils";

export default function AdminSocialPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Bulk select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await getSocialUsers();
      setUsers(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const allIds = users.map(u => u.id);
  const allSelected = allIds.length > 0 && allIds.every(id => selectedIds.has(id));
  const someSelected = allIds.some(id => selectedIds.has(id)) && !allSelected;

  const toggleOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleAll = () => setSelectedIds(allSelected ? new Set() : new Set(allIds));

  const handleBulkDelete = async () => {
    setBulkLoading(true);
    const res = await bulkClearSocialLinks(Array.from(selectedIds));
    setBulkLoading(false);
    setShowBulkConfirm(false);
    if (res?.error) {
      alert(res.error);
    } else {
      setSelectedIds(new Set());
      // Refresh data
      const data = await getSocialUsers();
      setUsers(data);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen font-cairo">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <Share2 className="w-8 h-8 text-medical-600" />
            إدارة مواقع التواصل
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold italic">
            انقر على بطاقة الطالب لعرض روابطه الاجتماعية
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Select All */}
          {users.length > 0 && (
            <button
              onClick={toggleAll}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border transition-all ${
                allSelected
                  ? "bg-medical-600 text-white border-medical-600"
                  : "bg-white dark:bg-dark-card border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-medical-500"
              }`}
            >
              {allSelected || someSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              {allSelected ? "إلغاء الكل" : "تحديد الكل"}
            </button>
          )}
          <div className="bg-medical-500/10 px-6 py-3 rounded-2xl border border-medical-500/20 text-medical-700 dark:text-medical-400 font-black">
            إجمالي المسجلين: {users.length} طالب
          </div>
        </div>
      </div>

      {/* Bulk Toolbar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4 px-6 py-3 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-200 dark:border-rose-800/50">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                <CheckSquare className="w-4 h-4" />
                <span>تم تحديد <strong>{selectedIds.size}</strong> من {users.length} طالب</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  إلغاء التحديد
                </button>
                <button
                  onClick={() => setShowBulkConfirm(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-black rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  مسح روابط المحدد ({selectedIds.size})
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => {
          const isSelected = selectedIds.has(user.id);
          return (
            <motion.div
              key={user.id}
              layoutId={user.id}
              onClick={() => setSelectedUser(user)}
              whileHover={{ y: -5 }}
              className={`relative rounded-[2.5rem] border p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer group overflow-hidden text-center ${
                isSelected
                  ? "bg-medical-50 dark:bg-medical-900/20 border-medical-400 dark:border-medical-600 ring-2 ring-medical-400/30"
                  : "bg-white dark:bg-dark-card border-slate-100 dark:border-slate-800"
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-medical-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Checkbox */}
              <button
                onClick={(e) => toggleOne(user.id, e)}
                className={`absolute top-4 right-4 w-6 h-6 rounded-lg flex items-center justify-center transition-all z-10 ${
                  isSelected
                    ? "text-medical-600 bg-medical-100 dark:bg-medical-900/40"
                    : "text-slate-300 dark:text-slate-600 hover:text-slate-400 bg-white/80 dark:bg-slate-800/80"
                }`}
              >
                {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
              </button>

              <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                {user.image ? (
                  <img src={user.image} alt={user.name || "صورة الطالب"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </div>

              <h3 className="font-black text-xl text-slate-800 dark:text-white group-hover:text-medical-600 transition-colors">{user.name || "طالب آورا"}</h3>
              <p className="text-xs text-slate-500 font-bold mt-1 line-clamp-1 opacity-60">{user.email}</p>

              <div className="mt-3 flex items-center justify-center gap-1.5">
                {user.telegram && <span className="w-2 h-2 rounded-full bg-sky-400" title="Telegram" />}
                {user.instagram && <span className="w-2 h-2 rounded-full bg-pink-400" title="Instagram" />}
                {user.facebook && <span className="w-2 h-2 rounded-full bg-blue-500" title="Facebook" />}
              </div>

              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="px-3 py-1 bg-medical-500/10 text-medical-600 rounded-full text-[10px] font-black uppercase tracking-widest">عرض الروابط</div>
              </div>
            </motion.div>
          );
        })}

        {users.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center bg-white dark:bg-dark-card rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Share2 className="w-20 h-20 text-slate-300 mx-auto mb-4 opacity-20" />
            <h3 className="text-2xl font-black text-slate-400">لا يوجد طلاب أضافوا روابط اجتماعية بعد</h3>
          </div>
        )}
      </div>

      {/* Bulk Confirm Modal */}
      <AnimatePresence>
        {showBulkConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !bulkLoading && setShowBulkConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 text-center">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent rounded-t-[2.5rem]" />
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">مسح الروابط الاجتماعية</h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-8 leading-relaxed">
                سيتم مسح جميع روابط التواصل الاجتماعي لـ <strong className="text-rose-600 dark:text-rose-400">{selectedIds.size}</strong> طالب محدد.<br />لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowBulkConfirm(false)} disabled={bulkLoading}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black transition-all hover:bg-slate-200 disabled:opacity-50">
                  إلغاء
                </button>
                <button onClick={handleBulkDelete} disabled={bulkLoading}
                  className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 disabled:opacity-50">
                  {bulkLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Trash2 className="w-4 h-4" /><span>مسح ({selectedIds.size})</span></>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Social Links Modal */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedUser(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-[500px] bg-white dark:bg-[#0f172a] rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10"
              >
                <div className="p-8 md:p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-medical-500/20">
                        {selectedUser.image ? <img src={selectedUser.image} alt={selectedUser.name || "صورة الطالب"} className="w-full h-full object-cover" /> :
                          <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"><User className="w-8 h-8" /></div>}
                      </div>
                      <div className="text-right">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white">{selectedUser.name}</h2>
                        <p className="text-sm text-slate-500 font-bold">{selectedUser.email}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedUser(null)} title="إغلاق" className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-r-4 border-medical-500 pr-3 text-right">حسابات التواصل الاجتماعي</div>

                    {selectedUser.telegram && (
                      <motion.a whileHover={{ scale: 1.01 }}
                        href={getSocialUrl(selectedUser.telegram, "telegram")} target="_self" rel="noopener noreferrer"
                        className="flex flex-col gap-2 p-4 bg-sky-500/5 hover:bg-sky-500 text-sky-600 hover:text-white rounded-[1.5rem] border border-sky-500/10 transition-all group">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm group-hover:bg-white/20 transition-all">
                              <Send className="w-5 h-5 text-sky-500 group-hover:text-white" />
                            </div>
                            <span className="font-black italic">Telegram</span>
                          </div>
                          <ExternalLink className="w-4 h-4 opacity-50" />
                        </div>
                        <div className="px-1 text-sm font-bold opacity-70 truncate text-left" dir="ltr">{selectedUser.telegram}</div>
                      </motion.a>
                    )}

                    {selectedUser.instagram && (
                      <motion.a whileHover={{ scale: 1.01 }}
                        href={getSocialUrl(selectedUser.instagram, "instagram")} target="_self" rel="noopener noreferrer"
                        className="flex flex-col gap-2 p-4 bg-pink-500/5 hover:bg-pink-500 text-pink-600 hover:text-white rounded-[1.5rem] border border-pink-500/10 transition-all group">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm group-hover:bg-white/20 transition-all">
                              <Instagram className="w-5 h-5 text-pink-500 group-hover:text-white" />
                            </div>
                            <span className="font-black italic">Instagram</span>
                          </div>
                          <ExternalLink className="w-4 h-4 opacity-50" />
                        </div>
                        <div className="px-1 text-sm font-bold opacity-70 truncate text-left" dir="ltr">{selectedUser.instagram}</div>
                      </motion.a>
                    )}

                    {selectedUser.facebook && (
                      <motion.a whileHover={{ scale: 1.01 }}
                        href={getSocialUrl(selectedUser.facebook, "facebook")} target="_self" rel="noopener noreferrer"
                        className="flex flex-col gap-2 p-4 bg-blue-600/5 hover:bg-blue-600 text-blue-600 hover:text-white rounded-[1.5rem] border border-blue-600/10 transition-all group">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm group-hover:bg-white/20 transition-all">
                              <Facebook className="w-5 h-5 text-blue-600 group-hover:text-white" />
                            </div>
                            <span className="font-black italic">Facebook</span>
                          </div>
                          <ExternalLink className="w-4 h-4 opacity-50" />
                        </div>
                        <div className="px-1 text-sm font-bold opacity-70 truncate text-left" dir="ltr">{selectedUser.facebook}</div>
                      </motion.a>
                    )}
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-black text-slate-400">
                    <div className="flex items-center gap-2 italic">
                      <Calendar className="w-4 h-4" />
                      عضو منذ: {new Date(selectedUser.createdAt).toLocaleDateString('ar-EG')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-medical-500" />
                      AURAMED STUDENT
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
