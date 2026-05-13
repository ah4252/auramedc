import { Stethoscope, Target, Users, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="py-24 bg-white dark:bg-dark-card border-b border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-medical-500/5 rounded-full blur-3xl -mr-64 -mt-64"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center justify-center p-4 bg-medical-50 dark:bg-medical-900/20 text-medical-600 dark:text-medical-400 rounded-3xl mb-8 relative">
            <Stethoscope className="w-12 h-12" />
            <Sparkles className="w-5 h-5 absolute -top-1 -right-1 text-amber-400 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight italic">Aura <span className="text-medical-600 not-italic font-light">Med Elite</span></h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            نحن القمة في التعليم الطبي الرقمي. صممت Aura Med لتكون الملاذ الأكاديمي الأكثر رقياً للأطباء الطامحين نحو التميز العالمي.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "رؤيتنا",
              desc: "أن نكون المرجع الأول والمنصة الأكثر موثوقية لطلاب الطب والمهنيين الصحيين في المنطقة العربية.",
              icon: Target,
              color: "bg-blue-100 text-blue-600"
            },
            {
              title: "رسالتنا",
              desc: "تسهيل رحلة التعلم الطبي الصعبة عبر تقديم شروحات احترافية، مراجع دقيقة، وأدوات تقييم حديثة.",
              icon: BookOpen,
              color: "bg-medical-100 text-medical-600"
            },
            {
              title: "مجتمعنا",
              desc: "نبني مجتمعاً من الأطباء المستقبليين الذين يتبادلون المعرفة ويسعون جميعاً نحو التميز السريري والأكاديمي.",
              icon: Users,
              color: "bg-indigo-100 text-indigo-600"
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-dark-card p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300">
              <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="bg-medical-600 rounded-[4rem] p-12 md:p-20 text-white text-center relative overflow-hidden shadow-2xl shadow-medical-600/30">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 relative z-10">جاهز لبدء رحلتك الطبية معنا؟</h2>
          <p className="text-xl md:text-2xl text-medical-100 mb-12 max-w-2xl mx-auto relative z-10">
            انضم الآن لآلاف الطلاب وابدأ في استكشاف مئات المحاضرات المتاحة حصرياً على المنصة.
          </p>
          <Link href="/register" className="inline-flex items-center gap-3 bg-white text-medical-600 px-10 py-5 rounded-full text-xl font-extrabold hover:scale-105 transition-all relative z-10 shadow-xl">
            ابدأ مجاناً الآن
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
