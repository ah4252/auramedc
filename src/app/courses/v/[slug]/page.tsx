import { PlayCircle, Download, Heart, Share2, FileText, CheckCircle2, ArrowRight, BookOpen, Stethoscope, Sparkles } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import FavoriteButton from "@/components/courses/FavoriteButton";

function getEmbedUrl(url: string | null) {
  if (!url) return null;
  const cleanUrl = url.trim();
  try {
    if (cleanUrl.includes("list=")) {
      const regExp = /[&?]list=([^#&?]+)/;
      const match = cleanUrl.match(regExp);
      if (match && match[1]) {
        return `https://www.youtube-nocookie.com/embed/videoseries?list=${match[1]}&rel=0`;
      }
    }
    if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) {
      const videoRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
      const match = cleanUrl.match(videoRegExp);
      if (match && match[2] && match[2].length === 11) {
        return `https://www.youtube-nocookie.com/embed/${match[2]}?rel=0&modestbranding=1`;
      }
    }
  } catch (e) {
    console.error("Error parsing video URL:", e);
  }
  return cleanUrl;
}

export default async function LessonDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  
  let lesson;
  try {
    lesson = await prisma.lesson.findUnique({
      where: { slug: decodedSlug },
      include: {
        subject: {
          include: {
            category: true
          }
        },
        resources: true,
        favorites: userId ? { where: { userId } } : false
      }
    });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    notFound();
  }

  if (!lesson) {
    notFound();
  }

  const isFavorited = (lesson as any).favorites?.length > 0;
  const mainUrl = lesson.videoUrl || lesson.resources.find((r: any) => r.type === "VIDEO")?.url || null;
  const embedUrl = getEmbedUrl(mainUrl);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 sm:mb-8">
          <Link 
            href={`/courses/s/${lesson.subject?.slug}`} 
            className="group flex items-center justify-center sm:justify-start gap-2 bg-white dark:bg-dark-card px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-medical-500 transition-all text-slate-600 dark:text-slate-400 hover:text-medical-600 w-fit"
          >
            <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold">العودة لِفهرس المادة</span>
          </Link>
          
          <div className="flex items-center gap-2 text-xs sm:text-sm overflow-hidden flex-wrap">
            <span className="bg-medical-50 dark:bg-medical-900/30 text-medical-700 dark:text-medical-400 px-2 py-1 rounded-lg border border-medical-200/50 dark:border-medical-500/20 font-black text-[9px] uppercase">
              {lesson.subject?.category?.name || "عام"}
            </span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-slate-300 font-bold truncate max-w-[120px] sm:max-w-md">
              {lesson.subject?.name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="w-full aspect-video bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-2xl border border-slate-200 dark:border-slate-800">
              {embedUrl ? (
                <iframe 
                  src={embedUrl} 
                  title={lesson.title || "فيديو الدرس"}
                  className="w-full h-full absolute inset-0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-800 p-4 text-center">
                  <PlayCircle className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">الفيديو غير متوفر حالياً</p>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-dark-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {lesson.title}
                </h1>
                <FavoriteButton lessonId={lesson.id} initialIsFavorited={isFavorited} userId={userId || null} />
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-medical-50 dark:bg-medical-900/20 text-medical-600 dark:text-medical-400 text-[10px] sm:text-sm px-2.5 py-1 rounded-lg font-bold">
                  المنصة الأكاديمية
                </span>
                <span className="text-slate-500 text-[10px] sm:text-sm flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  متاح للعرض
                </span>
              </div>

              <div className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 text-base sm:text-lg break-words whitespace-pre-wrap">
                {lesson.description || "لا يوجد وصف مضاف لهذه المحاضرة."}
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/60">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-medical-600 to-medical-400 flex items-center justify-center text-white shadow-lg relative shrink-0">
                  <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8" />
                  <Sparkles className="w-3 h-3 sm:w-4 h-4 absolute -top-1 -right-1 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white italic">إدارة Aura<span className="not-italic font-light">Med</span></h4>
                  <p className="text-xs sm:text-sm text-slate-500 font-bold">بكل رقي من المطور</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-medical-600" />
                ملحقات المحاضرة
              </h3>
              
              <div className="space-y-3">
                {lesson.pdfUrl && !lesson.resources.some(r => r.url === lesson.pdfUrl) && (
                  <a 
                    href={lesson.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-medical-500 hover:shadow-lg hover:shadow-medical-600/10 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-dark-card transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-bold block text-slate-900 dark:text-white group-hover:text-medical-600 transition-colors">ملف الـ PDF الأساسي</span>
                        <span className="text-xs text-slate-500">متاح للتحميل</span>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-slate-400 group-hover:text-medical-600" />
                  </a>
                )}

                {lesson.resources && lesson.resources
                  .filter((res: any) => res.url !== mainUrl)
                  .map((res: any) => (
                  <a 
                    key={res.id}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-medical-500 hover:shadow-lg hover:shadow-medical-600/10 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-dark-card transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${
                        res.type === "VIDEO" ? "bg-medical-100 dark:bg-medical-900/30 text-medical-600" :
                        res.type === "PDF" ? "bg-red-100 dark:bg-red-900/30 text-red-600" :
                        "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                      }`}>
                        {res.type === "VIDEO" ? <PlayCircle className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                      </div>
                      <div>
                        <span className="font-bold block text-slate-900 dark:text-white group-hover:text-medical-600 transition-colors">{res.title}</span>
                        <span className="text-xs text-slate-500">
                          {res.type === "VIDEO" ? "فيديو إضافي" : 
                           res.type === "PDF" ? "ملف مرفق" : 
                           res.type === "SUMMARY" ? "ملخص الدرس" : "رابط خارجي"}
                        </span>
                      </div>
                    </div>
                    {res.type === "VIDEO" ? <PlayCircle className="w-5 h-5 text-slate-400 group-hover:text-medical-600" /> : <Download className="w-5 h-5 text-slate-400 group-hover:text-medical-600" />}
                  </a>
                ))}

                {!lesson.pdfUrl && (!lesson.resources || lesson.resources.length === 0) && (
                  <div className="text-center p-6 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                    <p className="text-slate-500 text-sm">لا توجد ملحقات إضافية لهذا الدرس.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
