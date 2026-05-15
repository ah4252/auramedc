import Link from "next/link";
import { PlayCircle, BookOpen, Stethoscope, Award, ArrowLeft, HeartPulse, User, MessageSquare, Shield, LayoutGrid, GraduationCap, Lock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getYoutubeThumbnail } from "@/lib/utils";

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
    // الصفحة تعمل بأرقام افتراضية عند فشل DB
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-5 dark:opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 to-slate-50 dark:from-dark-bg/90 dark:to-dark-bg"></div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-100 dark:bg-medical-900/30 text-medical-700 dark:text-medical-300 text-sm font-semibold mb-6 animate-fade-in">
            <Award className="w-4 h-4" />
            <span>المنصة الطبية الرائدة في الوطن العربي</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold leading-relaxed md:leading-relaxed mb-6 animate-slide-up max-w-4xl text-balance py-2">
            ارتقِ بمسيرتك <span className="text-transparent bg-clip-text bg-gradient-to-l from-medical-400 to-medical-600">الطبية</span> نحو التفوق
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl animate-slide-up [animation-delay:0.1s]">
            مكتبة ضخمة من المحاضرات، الدروس الجامعية، والمراجع الطبية منظمة بطريقة احترافية لتسهيل رحلتك في عالم الطب.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up [animation-delay:0.2s]">
            <Link href="/courses" className="flex items-center justify-center gap-2 bg-medical-600 hover:bg-medical-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg shadow-medical-600/30 hover:scale-105">
              <PlayCircle className="w-5 h-5" />
              <span>ابدأ التعلم الآن</span>
            </Link>
            <Link href="/subjects" className="flex items-center justify-center gap-2 bg-white dark:bg-dark-card border-2 border-slate-200 dark:border-slate-700 hover:border-medical-500 dark:hover:border-medical-500 px-8 py-4 rounded-full text-lg font-bold transition-all hover:scale-105">
              <Stethoscope className="w-5 h-5" />
              <span>تصفح التخصصات</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="py-16 bg-white dark:bg-dark-card border-y border-slate-200 dark:border-slate-800 relative z-20 shadow-sm">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: lessonCount > 0 ? `+${lessonCount}` : "+500", label: "محاضرة طبية", icon: BookOpen },
            { value: subjectCount > 0 ? `+${subjectCount}` : "+50", label: "تخصص مختلف", icon: Stethoscope },
            { value: userCount > 0 ? `${userCount.toLocaleString('ar-EG')}+` : "10k+", label: "طالب طب", icon: Award },
            { value: "99%", label: "نسبة الرضا", icon: HeartPulse },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-2 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <div className="p-3 bg-medical-100 dark:bg-medical-900/40 text-medical-600 dark:text-medical-400 rounded-xl group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
              <p className="text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timetable Feature Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-medical-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-slate-900 dark:bg-dark-card rounded-[3rem] p-8 md:p-16 border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-medical-500/10 text-medical-400 text-xs font-black uppercase tracking-widest">
                 أداة النخبة الجديدة
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                نظّم وقتك <span className="text-medical-500">بِذكاء</span> مع مُخطط AuraMed الاحترافي
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                وداعاً للفوضى! مع جدول الدراسة التفاعلي، يمكنك الآن تنظيم محاضراتك، أهدافك اليومية، وتتبع تقدمك الدراسي في مكان واحد بِتصميم فائق الجودة وسهولة تامة.
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                 <Link href="/timetable" className="px-10 py-5 bg-medical-600 hover:bg-medical-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-medical-600/20 hover:scale-105 active:scale-95">
                    ابدأ تنظيم جدولك الآن
                 </Link>
              </div>
            </div>
            <div className="flex-1 relative group">
               <div className="absolute inset-0 bg-medical-500/20 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700"></div>
               <div className="relative glass-panel border-slate-700 p-4 rounded-3xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Surgical Experts in Action" 
                    className="w-full h-auto rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section - NEW */}
      <section className="py-24 bg-slate-50 dark:bg-dark-bg/50 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-8 text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-500 text-xs font-black uppercase tracking-widest border border-indigo-500/20">
                 <MessageSquare className="w-4 h-4" />
                 مجتمع AuraMed التفاعلي
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight italic">
                تواصل مع زملائك في <span className="text-indigo-500">نفس السنة</span> الدراسية
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xl leading-relaxed font-medium">
                لقد قمنا بتقسيم المجتمع إلى غرف نقاش مخصصة لكل سنة دراسية، لضمان تبادل المعلومات والأسئلة الأكثر صلة بِمرحلتك الحالية.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-4 p-6 bg-white dark:bg-dark-card rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="w-12 h-12 bg-medical-500/10 rounded-2xl flex items-center justify-center text-medical-600 shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">خصوصية تامة</h4>
                    <p className="text-sm text-slate-500">مجتمعات محمية بكلمة مرور لضمان جودة المحتوى.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white dark:bg-dark-card rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0">
                    <LayoutGrid className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">تنظيم ذكي</h4>
                    <p className="text-sm text-slate-500">نقاشات مقسمة حسب المواد والتخصصات الطبية.</p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                 <Link href="/community" className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-xl transition-all shadow-xl shadow-indigo-600/20 hover:scale-105">
                    دخول بوابة المجتمع
                    <ArrowLeft className="w-6 h-6 -rotate-180" />
                 </Link>
              </div>
            </div>
            
            <div className="flex-1 relative">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-12">
                    <div className="h-48 bg-white dark:bg-dark-card rounded-[2.5rem] p-6 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                       <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                          <GraduationCap className="w-6 h-6" />
                       </div>
                       <div className="font-black text-slate-900 dark:text-white">السنة الأولى</div>
                    </div>
                    <div className="h-64 bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/30 flex flex-col justify-between relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                       <MessageSquare className="w-10 h-10 opacity-40" />
                       <div className="font-black text-2xl">أكثر من 500 نقاش طبي نشط</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-64 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
                        <Lock className="w-10 h-10 text-amber-500 opacity-60" />
                        <div className="font-black text-xl">دخول آمن ومحمي لطلاب النخبة</div>
                    </div>
                    <div className="h-48 bg-white dark:bg-dark-card rounded-[2.5rem] p-6 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                       <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                          <GraduationCap className="w-6 h-6" />
                       </div>
                       <div className="font-black text-slate-900 dark:text-white">السنة النهائية</div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Lessons Placeholder */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">أحدث الدروس المضافة</h2>
            <p className="text-slate-500 dark:text-slate-400">ابقى على اطلاع بأحدث المحاضرات والكورسات.</p>
          </div>
          <Link href="/courses" className="hidden md:flex items-center gap-2 text-medical-600 dark:text-medical-400 hover:text-medical-800 font-semibold group">
            <span>عرض الكل</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestLessons.map((lesson) => {
            const videoUrl = lesson.videoUrl || lesson.resources?.find((r: any) => r.type === "VIDEO")?.url;
            const thumbnailUrl = getYoutubeThumbnail(videoUrl || null);
            const hasValidVideo = !!thumbnailUrl;
            const dynamicBgStyle = thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})` } : {};
            return (
              <Link href={`/courses/v/${lesson.slug}`} key={lesson.id} className="glass-panel rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-medical-600/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border border-slate-200 dark:border-slate-800">
                <div className="h-56 relative overflow-hidden bg-[#05070a]">
                  {hasValidVideo ? (
                    <>
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80" style={dynamicBgStyle} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10" />
                      
                      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-medical-600/90 p-4 rounded-full text-white backdrop-blur-md shadow-lg shadow-medical-600/50 scale-90 group-hover:scale-100 transition-transform">
                          <PlayCircle className="w-10 h-10 ml-1" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white gap-3 border-b border-white/5">
                       <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                          <BookOpen className="w-8 h-8 text-white opacity-60" />
                       </div>
                       <span className="text-xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">لا يوجد فيديو</span>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-md text-medical-700 dark:text-medical-400 text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm">
                      {lesson.subject?.category?.name || "عام"}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col bg-white dark:bg-dark-card relative z-20">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-snug group-hover:text-medical-600 transition-colors">
                    {lesson.title}
                  </h3>
                  
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
          {latestLessons.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500">لم يتم إضافة أي دروس بعد.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
