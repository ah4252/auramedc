"use client";

import { 
  Users, Video, Eye, Download, Clock, 
  TrendingUp, TrendingDown, Plus, ArrowUpRight, 
  BookOpen, FileText, Settings, UserPlus,
  BarChart3, Activity, ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function getTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return "منذ سنة";
  interval = seconds / 2592000;
  if (interval > 1) return "منذ أشهر";
  interval = seconds / 86400;
  if (interval > 1) return `منذ ${Math.floor(interval)} أيام`;
  interval = seconds / 3600;
  if (interval > 1) return `منذ ${Math.floor(interval)} ساعة`;
  interval = seconds / 60;
  if (interval > 1) return `منذ ${Math.floor(interval)} دقيقة`;
  return "الآن";
}

export default function DashboardClient({ stats, recentUsers }: { stats: any, recentUsers: any[] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const dashboardStats = [
    { 
      title: "إجمالي المشتركين", 
      value: stats.totalUsers.toLocaleString(), 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50 dark:bg-blue-500/10",
      trend: "+١٢٪",
      trendUp: true
    },
    { 
      title: "الدروس المنشورة", 
      value: stats.totalLessons.toLocaleString(), 
      icon: Video, 
      color: "text-purple-600", 
      bg: "bg-purple-50 dark:bg-purple-500/10",
      trend: "+٥ دروس",
      trendUp: true
    },
    { 
      title: "إحصائيات المشاهدة", 
      value: stats.totalViews >= 1000 ? (stats.totalViews / 1000).toFixed(1) + "K" : stats.totalViews, 
      icon: Eye, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      trend: "+٢٤٪",
      trendUp: true
    },
    { 
      title: "المحتوى المرفق", 
      value: stats.lessonsWithFiles.toLocaleString(), 
      icon: Download, 
      color: "text-orange-600", 
      bg: "bg-orange-50 dark:bg-orange-500/10",
      trend: "-٢٪",
      trendUp: false
    },
  ];

  const quickActions = [
    { title: "إضافة درس جديد", icon: Plus, href: "/admin/lessons", color: "bg-medical-600" },
    { title: "إدارة المواد", icon: BookOpen, href: "/admin/subjects", color: "bg-indigo-600" },
    { title: "إضافة مستخدم", icon: UserPlus, href: "/admin/users", color: "bg-slate-800" },
    { title: "تعديل المنشورات", icon: FileText, href: "/admin/posts", color: "bg-purple-600" },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 pb-10"
    >
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">نظرة عامة على النظام</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-dark-card rounded-[2rem] p-7 shadow-sm border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-slate-50 dark:to-slate-800/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${stat.trendUp ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" : "text-rose-600 bg-rose-50 dark:bg-rose-500/10"}`}>
                {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>

            <div className="mt-6 relative z-10">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-1">{stat.title}</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Actions & Charts */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions Grid */}
          <section>
            <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
              <Plus className="w-5 h-5 text-medical-600" />
              إجراءات سريعة
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, i) => (
                <Link key={i} href={action.href}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-full bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 flex flex-col items-center justify-center text-center gap-3 transition-shadow hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-none group"
                  >
                    <div className={`p-3 rounded-2xl ${action.color} text-white shadow-lg shadow-inherit/20 group-hover:rotate-12 transition-transform`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{action.title}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>

          {/* Performance Card */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 p-10 shadow-sm relative overflow-hidden">
             <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-indigo-600" />
                    تحليلات الأداء
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 font-medium">نمو المشاهدات والمشتركين خلال الأسبوع الماضي</p>
                </div>
                <button className="text-sm font-bold text-medical-600 hover:underline">عرض التقارير الكاملة</button>
             </div>
             
             {/* Mock Chart Area */}
             <div className="h-64 flex items-end justify-between gap-2 px-4 relative">
                {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative z-10">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: "circOut" }}
                      className="w-full max-w-[40px] bg-gradient-to-t from-medical-600 to-indigo-500 rounded-t-xl group-hover:from-medical-500 group-hover:to-indigo-400 transition-all relative shadow-lg shadow-medical-600/10"
                    />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">اليوم {i+1}</span>
                  </div>
                ))}
             </div>
          </motion.div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="space-y-8">
           <section className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-sm flex flex-col h-full min-h-[600px]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <Activity className="w-5 h-5 text-rose-500" />
                  النشاطات الأخيرة
                </h3>
                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              </div>

              <div className="space-y-6 flex-1">
                {recentUsers.map((user: any, i: number) => (
                  <motion.div 
                    key={i} 
                    variants={itemVariants}
                    className="flex gap-4 items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors group border-b border-slate-50 dark:border-slate-800/50 last:border-0"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden border border-white dark:border-slate-700 flex items-center justify-center text-slate-400 font-black text-lg">
                      {user.image ? (
                        <img src={user.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-800 dark:text-white truncate group-hover:text-medical-600 transition-colors">{user.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{user.email}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{getTimeAgo(user.createdAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="mt-8 w-full py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                مشاهدة الجميع
              </button>
           </section>
        </div>

      </div>
    </motion.div>
  );
}
