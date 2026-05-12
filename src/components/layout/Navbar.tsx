"use client";

import Link from "next/link";
import { BookOpen, Search as SearchIcon, User, Menu, Stethoscope, Lock, X, ShieldCheck, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { logoutAdmin, logoutUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import SearchModal from "./SearchModal";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar({ isAdmin = false, isUser = false, userName = null, userImage = null, userId = null }: { isAdmin?: boolean, isUser?: boolean, userName?: string | null, userImage?: string | null, userId?: string | null }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    // Increment clicks
    setClicks(prev => prev + 1);

    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    
    clickTimeout.current = setTimeout(() => {
      setClicks(0); // reset if they stop clicking
    }, 1000);
  };

  useEffect(() => {
    if (clicks >= 5) {
      setShowModal(true);
      setClicks(0);
      if (clickTimeout.current) clearTimeout(clickTimeout.current);
    }
  }, [clicks]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("password", password);

    const { loginAdmin } = await import("@/app/actions/auth");
    const res = await loginAdmin(formData);
    
    if (res?.error) {
      setError(res.error);
    } else {
      setShowModal(false);
      setPassword("");
      router.refresh();
      router.push("/admin");
    }
    setLoading(false);
  };

  const handleLogoutUser = async () => {
    await logoutUser();
    router.refresh();
    router.push("/");
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full glass-panel border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Premium Logo */}
          <Link 
            href="/" 
            onClick={handleLogoClick}
            className="flex items-center gap-3 select-none cursor-pointer group"
          >
            {/* Logo Image */}
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
              <img 
                src="/logo.svg" 
                alt="AuraMed Logo" 
                className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300" 
              />
              <div className="absolute inset-0 rounded-full bg-sky-500/20 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"/>
            </div>

            {/* Text part */}
            <div className="flex flex-col leading-none">
              <span className="text-lg md:text-xl font-black tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600 italic">Aura</span>
                <span className="text-slate-800 dark:text-white not-italic font-light">Med</span>
              </span>
              <span className="text-[7px] md:text-[8px] font-black tracking-[0.3em] text-amber-500 uppercase mt-0.5">Elite</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10 font-bold">
            <Link href="/" className="relative group text-slate-700 dark:text-slate-300 hover:text-medical-600 transition-colors">
              الرئيسية
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-medical-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/courses" className="relative group text-slate-700 dark:text-slate-300 hover:text-medical-600 transition-colors">
              السنوات الدراسية
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-medical-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/subjects" className="relative group text-slate-700 dark:text-slate-300 hover:text-medical-600 transition-colors">
              التخصصات
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-medical-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/gpa-calculator" 
              className="px-6 py-2.5 bg-gradient-to-r from-medical-600 to-medical-400 text-white rounded-[1.2rem] hover:shadow-lg hover:shadow-medical-600/30 hover:scale-105 active:scale-95 transition-all font-black text-sm shadow-md shadow-medical-600/10"
            >
              حاسبة المعدل
            </Link>
            {isAdmin && (
              <Link href="/admin" className="group text-medical-600 dark:text-medical-400 font-bold flex items-center gap-1.5 bg-medical-50 dark:bg-medical-900/30 px-4 py-2 rounded-xl hover:bg-medical-100 dark:hover:bg-medical-900/50 transition-all border border-medical-100 dark:border-medical-500/20 shadow-sm">
                <Lock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>لوحة التحكم</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setShowSearch(true)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              title="بحث"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
            
            {isUser ? (
              <div className="flex items-center gap-2 md:gap-3">
                <Link href="/profile" className="flex items-center gap-3 group">
                  <div className="hidden lg:flex flex-col items-end mr-1 group-hover:text-medical-600 transition-colors">
                    <span className="text-xs text-slate-500">أهلاً بك</span>
                    <span className="text-sm font-bold">{userName}</span>
                  </div>
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center border-2 border-transparent group-hover:border-medical-500 transition-all overflow-hidden">
                    {userImage ? (
                      <img src={userImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-medical-600 dark:text-medical-400" />
                    )}
                  </div>
                </Link>
                <button 
                  onClick={handleLogoutUser}
                  className="hidden md:block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  خروج
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-2 bg-medical-600 hover:bg-medical-700 text-white px-5 py-2 rounded-full transition-all shadow-md shadow-medical-600/20">
                <User className="w-4 h-4" />
                <span className="hidden md:inline">تسجيل الدخول</span>
              </Link>
            )}

            <button 
              onClick={() => setShowMobileMenu(true)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              title="القائمة"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[50] md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white dark:bg-dark-bg z-[55] md:hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-black text-xl text-medical-600">القائمة</span>
                <button onClick={() => setShowMobileMenu(false)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full" title="إغلاق">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4 font-bold text-lg">
                <Link href="/" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                  الرئيسية
                </Link>
                <Link href="/courses" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                  السنوات الدراسية
                </Link>
                <Link href="/subjects" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                  التخصصات
                </Link>
                <Link href="/gpa-calculator" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-4 p-4 bg-medical-50 dark:bg-medical-900/20 text-medical-600 rounded-2xl">
                  <Sparkles className="w-5 h-5" />
                  حاسبة المعدل
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-4 p-4 text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
                    <Lock className="w-5 h-5" />
                    لوحة التحكم
                  </Link>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                {isUser ? (
                  <button 
                    onClick={() => { handleLogoutUser(); setShowMobileMenu(false); }}
                    className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black"
                  >
                    تسجيل الخروج
                  </button>
                ) : (
                  <Link 
                    href="/login" 
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-medical-600 text-white rounded-2xl font-black shadow-lg shadow-medical-600/20"
                  >
                    <User className="w-5 h-5" />
                    تسجيل الدخول
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Secret Admin Login Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-dark-card w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative border border-slate-200 dark:border-slate-800"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 left-6 p-2 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center mb-8 mt-4">
                <div className="relative mb-6">
                   <div className="w-20 h-20 bg-gradient-to-tr from-medical-600 to-medical-400 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-medical-600/30 rotate-12">
                      <Lock className="w-10 h-10" />
                   </div>
                   <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center border-2 border-white dark:border-dark-card">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                   </div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">المنطقة المحظورة</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">تشفير عالي المستوى - يرجى إدخال رمز الدخول</p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-black mb-6 text-center border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="relative">
                   <input 
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     autoFocus
                     placeholder="••••••••"
                     className="w-full p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-medical-500 focus:bg-white dark:focus:bg-slate-900 outline-none text-center font-mono text-2xl tracking-[0.5em] transition-all"
                     dir="ltr"
                   />
                </div>
                <button 
                  type="submit"
                  disabled={loading || !password}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-medical-600 dark:hover:bg-medical-500 dark:hover:text-white font-black py-5 rounded-2xl transition-all disabled:opacity-50 shadow-xl"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    "تأكيد الهوية والدخول"
                  )}
                </button>
              </form>
              
              <div className="mt-8 text-center">
                 <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black italic">Security Protocol Alpha-7</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSearch && (
          <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
