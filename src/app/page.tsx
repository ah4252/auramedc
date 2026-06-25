import Link from "next/link";
import { PlayCircle, BookOpen, Stethoscope, Award, ArrowLeft, HeartPulse, LayoutGrid, Calculator, Newspaper, Pill, Users, GraduationCap, Sparkles, ChevronLeft, Star, Zap, Clock, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/db";
import { getYoutubeThumbnail } from "@/lib/utils";
import { getSettings } from "@/app/actions/settings";

export default async function Home() {
  let latestLessons: any[] = [];
  let lessonCount = 0;
  let subjectCount = 0;
  let userCount = 0;

  try {
    [latestLessons, lessonCount, subjectCount, userCount] = await Promise.all([
      prisma.lesson.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { subject: { include: { category: true } }, resources: true }
      }),
      prisma.lesson.count(),
      prisma.subject.count(),
      prisma.user.count(),
    ]);
  } catch (error) {
    console.error("Home DB Error:", error);
  }

  let settings: any = {};
  try {
    settings = await getSettings();
  } catch {}

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-[0.04] dark:opacity-[0.07]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-slate-50/95 to-slate-50 dark:from-dark-bg/95 dark:via-dark-bg/98 dark:to-dark-bg" />
        {/* Ambient orbs */}
        <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-medical-500/8 dark:bg-medical-500/12 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] bg-sky-400/8 dark:bg-sky-400/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-medical-100 to-sky-100 dark:from-medical-900/40 dark:to-sky-900/30 text-medical-700 dark:text-medical-300 text-sm font-bold mb-8 border border-medical-200/60 dark:border-medical-700/40 shadow-sm">
            <Award className="w-4 h-4 text-medical-500" />
            <span>المنصة الطبية الأولى في الوطن العربي</span>
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </div>

          {/* Headline */}
          <h1
            className="hero-headline text-4xl md:text-6xl xl:text-7xl font-extrabold text-black text-balance max-w-4xl pt-2 pb-2 mb-6"
          >
            ارتقِ بمسيرتك{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-l from-medical-400 via-medical-500 to-medical-600"
            >
              الطبية
            </span>{" "}
            نحو التفوق
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl leading-relaxed">
            مكتبة ضخمة من المحاضرات، الدروس الجامعية، والمراجع الطبية — منظّمة باحترافية لتسريع رحلتك في عالم الطب.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <Link href="/courses" className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-medical-600 to-medical-500 hover:from-medical-700 hover:to-medical-600 text-white rounded-2xl font-black text-base shadow-xl shadow-medical-600/30 hover:shadow-medical-600/50 hover:-translate-y-0.5 transition-all duration-300">
              <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              ابدأ التعلم الآن
            </Link>
            <Link href="/register" className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-base hover:border-medical-400 hover:text-medical-600 hover:-translate-y-0.5 transition-all duration-300 shadow-sm">
              <Sparkles className="w-4 h-4" />
              انضم مجاناً
            </Link>
          </div>

          {/* ===== BENTO SECTIONS GRID ===== */}
          <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {/* محاضرات — Large card */}
            <Link href="/courses" className="col-span-2 md:col-span-2 group relative flex flex-col justify-between bg-gradient-to-br from-medical-600 via-medical-700 to-medical-800 p-6 md:p-8 rounded-3xl overflow-hidden text-white hover:-translate-y-1 hover:shadow-2xl hover:shadow-medical-700/40 transition-all duration-500 min-h-[160px] md:min-h-[180px]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=60')] bg-cover bg-center opacity-10 group-hover:opacity-15 transition-opacity duration-700" />
              <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-medical-900/60 via-transparent to-transparent" />
              <div className="relative z-10 flex items-start justify-between">
                <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
                <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black border border-white/20">
                  <Zap className="w-3 h-3 fill-white" />
                  {lessonCount > 0 ? `+${lessonCount} درس` : "+500 درس"}
                </span>
              </div>
              <div className="relative z-10 text-right">
                <p className="text-white/70 text-xs font-medium mb-1">السنوات الدراسية</p>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">المحاضرات</h2>
                <p className="text-white/60 text-sm mt-1 hidden md:block">جميع مقاطع الفيديو والمحاضرات</p>
              </div>
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </div>
            </Link>

            {/* التخصصات */}
            <Link href="/subjects" className="group relative flex flex-col justify-between bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-violet-400/50 hover:shadow-violet-500/10 transition-all duration-500 min-h-[160px] md:min-h-[180px]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=60')] bg-cover bg-center opacity-[0.04] dark:opacity-[0.1] group-hover:opacity-[0.07] dark:group-hover:opacity-[0.15] transition-opacity duration-700" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/8 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/40 rounded-2xl flex items-center justify-center border border-violet-200 dark:border-violet-800/60 group-hover:scale-110 group-hover:bg-violet-200 dark:group-hover:bg-violet-900/60 transition-all duration-300">
                  <Stethoscope className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
              <div className="relative z-10 text-right mt-auto">
                <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mb-1">{subjectCount > 0 ? `${subjectCount} تخصص` : "تخصصات طبية"}</p>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">التخصصات</h2>
              </div>
            </Link>

            {/* الصيدلة */}
            <Link href="/pharmacy" className="group relative flex flex-col justify-between bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/25 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800/50 p-6 rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/15 transition-all duration-500 min-h-[160px]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=60')] bg-cover bg-center opacity-[0.04] dark:opacity-[0.1] group-hover:opacity-[0.07] dark:group-hover:opacity-[0.15] transition-opacity duration-700" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center border border-emerald-200 dark:border-emerald-800/60 group-hover:scale-110 transition-transform duration-300">
                  <Pill className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="relative z-10 text-right mt-auto">
                <p className="text-emerald-500 dark:text-emerald-500 text-xs font-medium mb-1">مرجع دوائي</p>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">الصيدلة</h2>
              </div>
            </Link>

            {/* الجدول الدراسي */}
            <Link href="/timetable" className="group relative flex flex-col justify-between bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/25 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 p-6 rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/15 transition-all duration-500 min-h-[160px]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=60')] bg-cover bg-center opacity-[0.04] dark:opacity-[0.1] group-hover:opacity-[0.07] dark:group-hover:opacity-[0.15] transition-opacity duration-700" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-2xl flex items-center justify-center border border-amber-200 dark:border-amber-800/60 group-hover:scale-110 transition-transform duration-300">
                  <LayoutGrid className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="relative z-10 text-right mt-auto">
                <p className="text-amber-500 text-xs font-medium mb-1">تنظيم ذكي</p>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">الجدول الدراسي</h2>
              </div>
            </Link>

            {/* حاسبة المعدل */}
            <Link href="/gpa-calculator" className="group relative flex flex-col justify-between bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/25 dark:to-blue-900/20 border border-sky-200 dark:border-sky-800/50 p-6 rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/15 transition-all duration-500 min-h-[160px]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=60')] bg-cover bg-center opacity-[0.04] dark:opacity-[0.1] group-hover:opacity-[0.07] dark:group-hover:opacity-[0.15] transition-opacity duration-700" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/50 rounded-2xl flex items-center justify-center border border-sky-200 dark:border-sky-800/60 group-hover:scale-110 transition-transform duration-300">
                  <Calculator className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                </div>
              </div>
              <div className="relative z-10 text-right mt-auto">
                <p className="text-sky-500 text-xs font-medium mb-1">احسب معدلك</p>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">حاسبة المعدل</h2>
              </div>
            </Link>

            {/* الأخبار */}
            <Link href="/news" className="group relative flex flex-col justify-between bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-rose-400/50 hover:shadow-rose-500/10 transition-all duration-500 min-h-[160px]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504440589173-0cd404be129e?w=800&q=60')] bg-cover bg-center opacity-[0.05] dark:opacity-[0.1] group-hover:opacity-[0.1] dark:group-hover:opacity-[0.15] transition-opacity duration-700" />
              <div className="absolute top-0 left-0 w-32 h-32 bg-rose-500/8 rounded-full blur-2xl -translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/40 rounded-2xl flex items-center justify-center border border-rose-200 dark:border-rose-800/60 group-hover:scale-110 transition-transform duration-300">
                  <Newspaper className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                </div>
              </div>
              <div className="relative z-10 text-right mt-auto">
                <p className="text-rose-400 text-xs font-medium mb-1">آخر الأخبار</p>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">الأخبار</h2>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-16 bg-white dark:bg-dark-card border-y border-slate-200 dark:border-slate-800 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: settings.statLectures || (lessonCount > 0 ? `+${lessonCount}` : "+500"), label: "محاضرة طبية", icon: PlayCircle, color: "medical" },
              { value: settings.statSpecialties || (subjectCount > 0 ? `+${subjectCount}` : "+50"), label: "تخصص مختلف", icon: Stethoscope, color: "violet" },
              { value: settings.statStudents || (userCount > 0 ? `${userCount.toLocaleString('ar-EG')}+` : "10k+"), label: "طالب طب", icon: GraduationCap, color: "amber" },
              { value: settings.statSatisfaction || "99%", label: "نسبة الرضا", icon: HeartPulse, color: "emerald" },
            ].map((stat, idx) => {
              const colorMap: Record<string, string> = {
                medical: "bg-medical-100 dark:bg-medical-900/40 text-medical-600 dark:text-medical-400",
                violet: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400",
                amber: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
                emerald: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
              };
              return (
                <div key={idx} className="flex flex-col items-center text-center space-y-3 p-6 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                  <div className={`p-3.5 rounded-2xl ${colorMap[stat.color]} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SHOWCASE SECTION ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-dark-bg dark:to-dark-card/40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-medical-500/5 dark:bg-medical-500/8 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-100 dark:bg-medical-900/30 text-medical-700 dark:text-medical-300 text-xs font-black uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              كل ما تحتاجه في مكان واحد
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">أقسام المنصة</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">منصة متكاملة تغطي جميع احتياجاتك الدراسية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                href: "/courses",
                icon: PlayCircle,
                title: "المحاضرات والدروس",
                desc: "آلاف المحاضرات الطبية المصنّفة حسب السنة والتخصص مع إمكانية المشاهدة والتحميل.",
                gradient: "from-medical-600 to-medical-800",
                iconBg: "bg-medical-500/20",
                iconColor: "text-medical-400",
                badge: lessonCount > 0 ? `+${lessonCount} درس` : "+500 درس",
                badgeColor: "bg-medical-500/20 text-medical-300",
              },
              {
                href: "/subjects",
                icon: Stethoscope,
                title: "التخصصات الطبية",
                desc: "تصفّح مواد طبية حسب التخصص: الجراحة، الداخلية، الأطفال، وأكثر بكثير.",
                gradient: "from-violet-600 to-purple-800",
                iconBg: "bg-violet-500/20",
                iconColor: "text-violet-400",
                badge: "متعدد التخصصات",
                badgeColor: "bg-violet-500/20 text-violet-300",
              },
              {
                href: "/pharmacy",
                icon: Pill,
                title: "الصيدلة",
                desc: "مرجع دوائي شامل وتفاعلي للأدوية وجرعاتها وتفاعلاتها الدوائية.",
                gradient: "from-emerald-600 to-teal-800",
                iconBg: "bg-emerald-500/20",
                iconColor: "text-emerald-400",
                badge: "مرجع تفاعلي",
                badgeColor: "bg-emerald-500/20 text-emerald-300",
              },
              {
                href: "/timetable",
                icon: LayoutGrid,
                title: "الجدول الدراسي",
                desc: "نظّم أسبوعك الدراسي بذكاء مع مُخطط تفاعلي يُساعدك على تتبع تقدمك.",
                gradient: "from-amber-500 to-orange-700",
                iconBg: "bg-amber-500/20",
                iconColor: "text-amber-400",
                badge: "تنظيم ذكي",
                badgeColor: "bg-amber-500/20 text-amber-300",
              },
              {
                href: "/gpa-calculator",
                icon: Calculator,
                title: "حاسبة المعدل",
                desc: "احسب معدلك الدراسي بدقة متناهية بناءً على درجاتك ومعاملات المواد.",
                gradient: "from-sky-500 to-blue-700",
                iconBg: "bg-sky-500/20",
                iconColor: "text-sky-400",
                badge: "نتيجة فورية",
                badgeColor: "bg-sky-500/20 text-sky-300",
              },
              {
                href: "/news",
                icon: Newspaper,
                title: "أخبار طبية",
                desc: "ابقَ على اطلاع بآخر الأخبار الطبية والإعلانات والتحديثات الجامعية.",
                gradient: "from-rose-600 to-pink-800",
                iconBg: "bg-rose-500/20",
                iconColor: "text-rose-400",
                badge: "آخر المستجدات",
                badgeColor: "bg-rose-500/20 text-rose-300",
              },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={`group relative flex flex-col bg-slate-900 dark:bg-dark-card rounded-[2rem] overflow-hidden border border-slate-800 hover:border-slate-600 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500`}>
                {/* Top gradient strip */}
                <div className={`h-1.5 bg-gradient-to-r ${item.gradient} w-full`} />
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-13 h-13 p-3 ${item.iconBg} rounded-2xl border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                    </div>
                    <span className={`text-xs font-black px-3 py-1.5 rounded-xl ${item.badgeColor} border border-white/10`}>{item.badge}</span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 text-right">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed text-right flex-1">{item.desc}</p>
                  <div className="mt-6 flex items-center justify-start gap-2 text-slate-500 group-hover:text-white transition-colors duration-300">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="text-sm font-bold">استكشف الآن</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIMETABLE FEATURE CALLOUT ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-medical-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-slate-900 dark:bg-dark-card rounded-[3rem] p-8 md:p-16 border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 text-right order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-medical-500/10 text-medical-400 text-xs font-black uppercase tracking-widest">
                <TrendingUp className="w-3.5 h-3.5" />
                أداة النخبة
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                نظّم وقتك <span className="text-medical-500">بِذكاء</span> مع مُخطط AuraMed
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                وداعاً للفوضى! مع جدول الدراسة التفاعلي، نظّم محاضراتك وأهدافك اليومية وتتبّع تقدمك في مكان واحد.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/timetable" className="px-10 py-5 bg-medical-600 hover:bg-medical-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-medical-600/20 hover:scale-105 active:scale-95">
                  ابدأ تنظيم جدولك الآن
                </Link>
                <Link href="/gpa-calculator" className="flex items-center gap-2 px-8 py-5 bg-white/10 hover:bg-white/15 text-white rounded-2xl font-bold text-base transition-all border border-white/10 hover:border-white/20">
                  <Calculator className="w-4 h-4" />
                  حاسبة المعدل
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-2">
                {[
                  { icon: Clock, text: "جدول أسبوعي" },
                  { icon: TrendingUp, text: "تتبّع التقدم" },
                  { icon: Star, text: "تصميم احترافي" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                    <f.icon className="w-4 h-4 text-medical-500" />
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative group order-1 lg:order-2 w-full">
              <div className="absolute inset-0 bg-medical-500/20 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700" />
              <div className="relative glass-panel border-slate-700 p-4 rounded-3xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="جدول الدراسة"
                  className="w-full h-auto rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LATEST LESSONS ===== */}
      {latestLessons.length > 0 && (
        <section className="py-24 container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-medical-100 dark:bg-medical-900/30 text-medical-700 dark:text-medical-300 text-xs font-black uppercase tracking-widest mb-3">
                <Zap className="w-3.5 h-3.5 fill-current" />
                أحدث الإضافات
              </div>
              <h2 className="text-3xl font-black mb-2">أحدث الدروس المضافة</h2>
              <p className="text-slate-500 dark:text-slate-400">ابقَ على اطلاع بأحدث المحاضرات والكورسات.</p>
            </div>
            <Link href="/courses" className="hidden md:flex items-center gap-2 text-medical-600 dark:text-medical-400 hover:text-medical-800 font-bold group">
              <span>عرض الكل</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestLessons.map((lesson) => {
              const videoUrl = lesson.videoUrl || lesson.resources?.find((r: any) => r.type === "VIDEO")?.url;
              const thumbnailUrl = getYoutubeThumbnail(videoUrl || null);
              const hasValidVideo = !!thumbnailUrl;
              return (
                <Link href={`/courses/v/${lesson.slug}`} key={lesson.id} className="glass-panel rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-medical-600/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border border-slate-200 dark:border-slate-800">
                  {hasValidVideo ? (
                    <div className="h-56 relative overflow-hidden bg-[#05070a]">
                      <img src={thumbnailUrl || ""} alt={lesson.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10" />
                      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-medical-600/90 p-4 rounded-full text-white backdrop-blur-md shadow-lg shadow-medical-600/50 scale-90 group-hover:scale-100 transition-transform">
                          <PlayCircle className="w-10 h-10 ml-1" />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 z-20">
                        <span className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-md text-medical-700 dark:text-medical-400 text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm">
                          {lesson.subject?.category?.name || "عام"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-56 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-medical-950/30 border-b border-slate-200/10 dark:border-slate-800/30 flex items-center justify-center shrink-0">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-medical-500/10 rounded-full blur-2xl" />
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                      <div className="relative flex flex-col items-center justify-center gap-2 z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-medical-500/40">
                          <BookOpen className="w-7 h-7 text-medical-400 group-hover:text-medical-300 transition-colors" />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 z-20">
                        <span className="bg-medical-500/10 border border-medical-500/20 text-medical-400 text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm backdrop-blur-md">
                          {lesson.subject?.category?.name || "عام"}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col bg-white dark:bg-dark-card relative z-20">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-snug group-hover:text-medical-600 transition-colors">{lesson.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 break-words whitespace-normal">
                      {lesson.description || "لا يوجد وصف متاح لهذا الدرس."}
                    </p>
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end">
                      <div className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all ${hasValidVideo ? 'bg-medical-50 dark:bg-medical-900/20 text-medical-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                        {hasValidVideo ? <PlayCircle className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                        <span>{hasValidVideo ? 'شاهد الآن' : 'تصفح المحتوى'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex md:hidden justify-center mt-8">
            <Link href="/courses" className="flex items-center gap-2 text-medical-600 dark:text-medical-400 hover:text-medical-800 font-bold">
              <span>عرض جميع الدروس</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

