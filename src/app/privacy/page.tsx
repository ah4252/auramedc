import { ShieldCheck, Eye, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl mb-6">
          <Lock className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">سياسة الخصوصية</h1>
        <p className="text-slate-500 dark:text-slate-400">نحن نلتزم بحماية خصوصيتك وبياناتك الشخصية.</p>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 space-y-10 animate-slide-up">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-blue-600">
            <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
            1. المعلومات التي نجمعها
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            نحن نجمع فقط المعلومات الضرورية لتجربتك التعليمية، مثل الاسم، البريد الإلكتروني، وتقدمك الدراسي في المحاضرات. لا نقوم بجمع أي بيانات حساسة لا تتعلق بخدماتنا.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-blue-600">
            <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
            2. كيف نستخدم بياناتك
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            تُستخدم بياناتك لتقديم خدمات المنصة، وتخصيص المحتوى المناسب لك، وإرسال تنبيهات الدروس الجديدة، وتحليل الأداء العام لتحسين الموقع.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-blue-600">
            <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
            3. حماية البيانات
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            نحن نستخدم أحدث تقنيات التشفير والبروتوكولات الأمنية لضمان بقاء معلوماتك آمنة وبعيدة عن أي وصول غير مصرح به.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-blue-600">
            <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
            4. مشاركة المعلومات مع طرف ثالث
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            نحن لا نبيع أو نشارك بياناتك الشخصية مع أي جهات خارجية لأغراض تسويقية. يتم الاحتفاظ بجميع بياناتك داخل بيئة ميدبلاس الآمنة.
          </p>
        </section>

        <div className="pt-10 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
            العودة للرئيسية
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
