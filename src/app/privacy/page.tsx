import { ShieldCheck, Lock, ArrowRight, Eye, Database, Share2, Server, KeyRound, Mail } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <div className="text-center mb-16 animate-fade-in relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="inline-flex items-center justify-center p-5 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-900/20 text-blue-600 dark:text-blue-400 rounded-3xl mb-6 shadow-xl shadow-blue-500/10 border border-blue-200 dark:border-blue-800 relative z-10">
          <Lock className="w-12 h-12" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">سياسة الخصوصية</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          خصوصيتك هي أولويتنا في <span className="font-bold text-blue-600 dark:text-blue-400">AuraMed Elite</span>. تشرح هذه السياسة كيف نقوم بجمع، استخدام، وحماية بياناتك الشخصية كطالب طب.
        </p>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800/60 animate-slide-up relative overflow-hidden">
        {/* Decorative subtle background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f608_1px,transparent_1px),linear-gradient(to_bottom,#3b82f608_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

        <div className="space-y-12 relative z-10">
          {/* Section 1 */}
          <section className="group">
            <h2 className="text-2xl font-black mb-5 flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-all">
                 <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span>1. المعلومات التي نجمعها</span>
            </h2>
            <div className="pl-16 pr-2 md:pr-16 text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4">
              <p>نحن نجمع فقط المعلومات الضرورية لتحسين تجربتك التعليمية، والتي تشمل:</p>
              <ul className="list-disc list-inside space-y-2 mt-2 text-slate-500 dark:text-slate-400 marker:text-blue-500">
                <li>المعلومات الشخصية الأساسية: الاسم، البريد الإلكتروني، والجامعة أو السنة الدراسية (إن وجدت).</li>
                <li>بيانات الاستخدام: سجل مشاهدة المحاضرات، التقدم في الكورسات، ومشاركاتك في غرف النقاش.</li>
                <li>بيانات الجهاز: نوع المتصفح وعناوين IP لتحسين الأمان وتجربة المستخدم.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="group">
            <h2 className="text-2xl font-black mb-5 flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-all">
                 <Eye className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>2. كيف نستخدم بياناتك</span>
            </h2>
            <div className="pl-16 pr-2 md:pr-16 text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4">
              <p>تُستخدم بياناتك حصرياً للأغراض التالية:</p>
              <ul className="list-disc list-inside space-y-2 mt-2 text-slate-500 dark:text-slate-400 marker:text-emerald-500">
                <li>تقديم محتوى تعليمي مخصص يتناسب مع مستواك وسنتك الدراسية.</li>
                <li>تتبع تقدمك الأكاديمي وإصدار تقارير لك عبر أداة حاسبة المعدل.</li>
                <li>إرسال تنبيهات هامة بشأن المحاضرات الجديدة أو تغييرات المنصة.</li>
                <li>تحليل الأداء العام للمنصة لتحسين جودة الخدمات.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="group">
            <h2 className="text-2xl font-black mb-5 flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-all">
                 <Server className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span>3. حماية البيانات وأمن المعلومات</span>
            </h2>
            <div className="pl-16 pr-2 md:pr-16 text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4">
              <p>
                نطبق معايير أمنية صارمة وتقنيات تشفير متقدمة لحماية معلوماتك الشخصية من الوصول غير المصرح به، التعديل، أو الإفصاح. يتم تخزين كلمات المرور الخاصة بك بشكل مشفر ولا يمكن لأي من موظفينا الاطلاع عليها.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="group">
            <h2 className="text-2xl font-black mb-5 flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40 transition-all">
                 <Share2 className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <span>4. مشاركة المعلومات مع طرف ثالث</span>
            </h2>
            <div className="pl-16 pr-2 md:pr-16 text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4">
              <p>
                <strong>نحن لا نبيع بياناتك الشخصية لأي طرف.</strong>
              </p>
              <p>
                لا نشارك معلوماتك مع جهات خارجية إلا في حدود ضيقة جداً لتوفير الخدمة (مثل مزودي خدمات الاستضافة أو قواعد البيانات الآمنة)، وهم ملزمون أيضاً بشروط سرية صارمة.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="group">
            <h2 className="text-2xl font-black mb-5 flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 transition-all">
                 <KeyRound className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <span>5. حقوقك كطالب</span>
            </h2>
            <div className="pl-16 pr-2 md:pr-16 text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4">
              <p>لديك الحق الكامل في الوصول إلى معلوماتك الشخصية أو تعديلها من خلال إعدادات حسابك. إذا أردت حذف حسابك وبياناتك بالكامل، يمكنك تقديم طلب وسنقوم بذلك وفقاً لسياساتنا التقنية.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="group">
            <h2 className="text-2xl font-black mb-5 flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all">
                 <Mail className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <span>6. التواصل معنا</span>
            </h2>
            <div className="pl-16 pr-2 md:pr-16 text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4">
              <p>
                إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية، لا تتردد في التواصل معنا عبر قنوات الدعم المتاحة على المنصة.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <p className="text-sm text-slate-500">آخر تحديث: 1 يونيو 2026</p>
          <Link href="/" className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-lg hover:shadow-blue-600/30 group">
            فهمت وموافق، عودة للرئيسية
            <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
