import { Users, Video, Eye, Download, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";

function getTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
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

export default async function AdminDashboard() {
  // Fetch real stats
  const [totalUsers, totalLessons, lessonsWithFiles, allLessons, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.lesson.count(),
    prisma.lesson.count({
      where: {
        OR: [
          { pdfUrl: { not: "" } },
          { summaryUrl: { not: "" } }
        ]
      }
    }),
    prisma.lesson.findMany({ select: { views: true } }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: { name: true, createdAt: true, image: true }
    })
  ]);

  const totalViews = allLessons.reduce((sum, lesson) => sum + lesson.views, 0);

  const stats = [
    { title: "إجمالي المستخدمين", value: totalUsers.toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { title: "الدروس المرفوعة", value: totalLessons.toLocaleString(), icon: Video, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { title: "إجمالي المشاهدات", value: totalViews >= 1000 ? (totalViews / 1000).toFixed(1) + "K" : totalViews, icon: Eye, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    { title: "الملفات المرفقة", value: lessonsWithFiles.toLocaleString(), icon: Download, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">نظرة عامة</h1>
        <p className="text-slate-500">إحصائيات وتحليلات المنصة الحقيقية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-all hover:shadow-md">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-2xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             <Video className="w-5 h-5 text-medical-600" />
             توزيع المحتوى
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <p className="text-slate-500 text-sm mb-1">متوسط المشاهدات لكل درس</p>
                <h4 className="text-2xl font-bold">{(totalViews / (totalLessons || 1)).toFixed(1)}</h4>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <p className="text-slate-500 text-sm mb-1">نسبة الدروس مع ملفات PDF</p>
                <h4 className="text-2xl font-bold">{((lessonsWithFiles / (totalLessons || 1)) * 100).toFixed(0)}%</h4>
              </div>
           </div>
           <div className="mt-8 p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
             <p>سيتم تفعيل الرسوم البيانية التفصيلية قريباً</p>
           </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm flex flex-col">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             <Users className="w-5 h-5 text-blue-600" />
             آخر النشاطات
           </h3>
           <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
             {recentUsers.map((user, i) => (
               <div key={i} className="flex gap-4 items-start border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0">
                 <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                   {user.image ? (
                     <img src={user.image} alt="" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                       {user.name?.charAt(0).toUpperCase()}
                     </div>
                   )}
                 </div>
                 <div className="min-w-0">
                   <p className="text-sm font-bold text-slate-900 dark:text-white truncate">تسجيل جديد: <span className="text-medical-600">{user.name}</span></p>
                   <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                     <Clock className="w-3 h-3" />
                     {getTimeAgo(new Date(user.createdAt))}
                   </p>
                 </div>
               </div>
             ))}
             {recentUsers.length === 0 && (
               <div className="text-center py-20 text-slate-400">
                 <p>لا توجد نشاطات حديثة</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
