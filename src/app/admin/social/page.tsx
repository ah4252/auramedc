"use client";

import { useState, useEffect } from "react";
import { getSocialUsers } from "@/app/actions/socialAdmin";
import { User, Send, Instagram, Facebook, Calendar, Mail, ExternalLink, Share2, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSocialPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getSocialUsers();
      setUsers(data);
      setLoading(false);
    }
    fetchData();
  }, []);

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
            انقر على اسم الطالب لعرض روابط تواصله الاجتماعي
          </p>
        </div>
        <div className="bg-medical-500/10 px-6 py-3 rounded-2xl border border-medical-500/20 text-medical-700 dark:text-medical-400 font-black">
          إجمالي المسجلين: {users.length} طالب
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <motion.div 
            key={user.id} 
            layoutId={user.id}
            onClick={() => setSelectedUser(user)}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden text-center"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-medical-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
              {user.image ? (
                <img src={user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>
            
            <h3 className="font-black text-xl text-slate-800 dark:text-white group-hover:text-medical-600 transition-colors">{user.name || "طالب آورا"}</h3>
            <p className="text-xs text-slate-500 font-bold mt-1 line-clamp-1 opacity-60">{user.email}</p>
            
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="px-3 py-1 bg-medical-500/10 text-medical-600 rounded-full text-[10px] font-black uppercase tracking-widest">عرض الروابط</div>
            </div>
          </motion.div>
        ))}

        {users.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center bg-white dark:bg-dark-card rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Share2 className="w-20 h-20 text-slate-300 mx-auto mb-4 opacity-20" />
            <h3 className="text-2xl font-black text-slate-400">لا يوجد طلاب أضافوا روابط اجتماعية بعد</h3>
          </div>
        )}
      </div>

      {/* Social Links Modal */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                           {selectedUser.image ? <img src={selectedUser.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"><User className="w-8 h-8" /></div>}
                        </div>
                        <div className="text-right">
                           <h2 className="text-2xl font-black text-slate-800 dark:text-white">{selectedUser.name}</h2>
                           <p className="text-sm text-slate-500 font-bold">{selectedUser.email}</p>
                        </div>
                     </div>
                     <button onClick={() => setSelectedUser(null)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all">
                        <X className="w-6 h-6" />
                     </button>
                  </div>

                  <div className="space-y-4">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-r-4 border-medical-500 pr-3 text-right">حسابات التواصل الاجتماعي</div>
                    
                    {selectedUser.telegram && (
                      <motion.a 
                        whileHover={{ scale: 1.01 }}
                        href={selectedUser.telegram.startsWith('http') ? selectedUser.telegram : `https://t.me/${selectedUser.telegram.replace('@', '')}`} 
                        target="_blank" rel="noopener noreferrer"
                        className="flex flex-col gap-2 p-4 bg-sky-500/5 hover:bg-sky-500 text-sky-600 hover:text-white rounded-[1.5rem] border border-sky-500/10 transition-all group"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm group-hover:bg-white/20 transition-all">
                                <Send className="w-5 h-5 text-sky-500 group-hover:text-white" />
                             </div>
                             <span className="font-black italic">Telegram</span>
                          </div>
                          <ExternalLink className="w-4 h-4 opacity-50" />
                        </div>
                        <div className="px-1 text-sm font-bold opacity-70 truncate text-left" dir="ltr">
                          {selectedUser.telegram}
                        </div>
                      </motion.a>
                    )}

                    {selectedUser.instagram && (
                      <motion.a 
                        whileHover={{ scale: 1.01 }}
                        href={selectedUser.instagram.startsWith('http') ? selectedUser.instagram : `https://instagram.com/${selectedUser.instagram}`} 
                        target="_blank" rel="noopener noreferrer"
                        className="flex flex-col gap-2 p-4 bg-pink-500/5 hover:bg-pink-500 text-pink-600 hover:text-white rounded-[1.5rem] border border-pink-500/10 transition-all group"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm group-hover:bg-white/20 transition-all">
                                <Instagram className="w-5 h-5 text-pink-500 group-hover:text-white" />
                             </div>
                             <span className="font-black italic">Instagram</span>
                          </div>
                          <ExternalLink className="w-4 h-4 opacity-50" />
                        </div>
                        <div className="px-1 text-sm font-bold opacity-70 truncate text-left" dir="ltr">
                          {selectedUser.instagram}
                        </div>
                      </motion.a>
                    )}

                    {selectedUser.facebook && (
                      <motion.a 
                        whileHover={{ scale: 1.01 }}
                        href={selectedUser.facebook.startsWith('http') ? selectedUser.facebook : `https://facebook.com/${selectedUser.facebook}`} 
                        target="_blank" rel="noopener noreferrer"
                        className="flex flex-col gap-2 p-4 bg-blue-600/5 hover:bg-blue-600 text-blue-600 hover:text-white rounded-[1.5rem] border border-blue-600/10 transition-all group"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm group-hover:bg-white/20 transition-all">
                                <Facebook className="w-5 h-5 text-blue-600 group-hover:text-white" />
                             </div>
                             <span className="font-black italic">Facebook</span>
                          </div>
                          <ExternalLink className="w-4 h-4 opacity-50" />
                        </div>
                        <div className="px-1 text-sm font-bold opacity-70 truncate text-left" dir="ltr">
                          {selectedUser.facebook}
                        </div>
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
