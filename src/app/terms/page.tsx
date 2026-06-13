import { ShieldCheck, ArrowRight, BookOpen, AlertTriangle, Copyright, Key, RefreshCcw, Scale, Users } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <div className="text-center mb-16 animate-fade-in relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-medical-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="inline-flex items-center justify-center p-5 bg-gradient-to-br from-medical-100 to-medical-200 dark:from-medical-900/40 dark:to-medical-900/20 text-medical-600 dark:text-medical-400 rounded-3xl mb-6 shadow-xl shadow-medical-500/10 border border-medical-200 dark:border-medical-800 relative z-10">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">الشروط والأحكام</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          نرحب بك في منصة <span className="font-bold text-medical-600 dark:text-medical-400">AuraMed Elite</span>. يرجى قراءة شروط استخدام المنصة بعناية حيث تحدد هذه الوثيقة حقوقك وواجباتك كمستخدم لخدماتنا.
        </p>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800/60 animate-slide-up relative overflow-hidden">
        {/* Decorative subtle background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e908_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e908_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

        <div className="space-y-12 relative z-10">
          {/* Section 1 */}
          <section className="group">
            <h2 className="text-2xl font-black mb-5 flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="w-12 h-12 bg-medical-50 dark:bg-medical-900/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-medical-100 dark:group-hover:bg-medical-900/40 transition-all">
                 <BookOpen className="w-6 h-6 text-medical-600 dark:text-medical-400" />
              </div>
              <span>1. الموافقة على الشروط ووصف الخدمة</span>
            </h2>
            <div className="pl-16 pr-2 md:pr-16 text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4">
              <p>
                باستخدامك لمنصة AuraMed Elite، فإنك تقر بموافقتك الكاملة على هذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، فلا يحق لك استخدام المنصة.
              </p>
              <p>
                تقدم المنصة خدمات تعليمية طبية تشمل المحاضرات المسجلة، الملخصات، الجداول الدراسية التفاعلية، وغرف النقاش المجتمعية لمساعدة طلاب الطب في مسيرتهم الأكاديمية.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="group">
            <h2 className="text-2xl font-black mb-5 flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 transition-all">
                 <Copyright className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <span>2. حقوق الملكية الفكرية والقيود</span>
            </h2>
            <div className="pl-16 pr-2 md:pr-16 text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4">
              <p>
                جميع المحتويات المتوفرة على المنصة (بما في ذلك الفيديوهات، النصوص، الصور، الملفات، الشعارات، وتصميم الواجهات) هي ملكية فكرية حصرية لـ AuraMed Elite ومحمية بموجب قوانين حقوق النشر.
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2 text-slate-500 dark:text-slate-400 marker:text-amber-500">
                <li>يُمنع منعاً باتاً تنزيل أو إعادة إنتاج الفيديوهات والمحتويات المرئية.</li>
                <li>يُمنع مشاركة حسابك مع أشخاص آخرين؛ الحساب مخصص للاستخدام الفردي فقط.</li>
                <li>يُمنع بيع، تأجير، أو استغلال المحتوى التعليمي لأغراض تجارية.</li>
              </ul>
              <p className="text-red-500 dark:text-red-400 text-sm font-bold mt-4 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                المخالفة لهذه الشروط ستؤدي إلى الحظر النهائي للحساب دون تعويض، مع اتخاذ الإجراءات القانونية اللازمة.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="group">
            <h2 className="text-2xl font-black mb-5 flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-all">
                 <Key className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span>3. الحسابات والأمان</span>
            </h2>
            <div className="pl-16 pr-2 md:pr-16 text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4">
              <p>
                يتحمل المستخدم المسؤولية الكاملة عن الحفاظ على سرية بيانات حسابه وكلمة المرور. أي نشاط يتم عبر حسابك يُعد من مسؤوليتك. يجب إبلاغ الإدارة فوراً في حال الشك بوجود اختراق أو استخدام غير مصرح به للحساب.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="group">
            <h2 className="text-2xl font-black mb-5 flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40 transition-all">
                 <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <span>4. إخلاء المسؤولية الطبية</span>
            </h2>
            <div className="pl-16 pr-2 md:pr-16 text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4">
              <p>
                <strong>المحتوى المقدم هو للأغراض الأكاديمية والتعليمية فقط.</strong> 
              </p>
              <p>
                لا تشكل المعلومات الواردة في المحاضرات أو النقاشات بديلاً عن الاستشارة الطبية المتخصصة، التشخيص، أو العلاج الفعلي السريري. لا تتحمل منصة AuraMed Elite أي مسؤولية قانونية عن قرارات طبية أو تشخيصية يتخذها المستخدمون بناءً على المحتوى المعروض.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="group">
            <h2 className="text-2xl font-black mb-5 flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-all">
                 <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>5. قواعد مجتمع AuraMed التفاعلي</span>
            </h2>
            <div className="pl-16 pr-2 md:pr-16 text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4">
              <p>عند المشاركة في غرف النقاش المجتمعية، يُتوقع من المستخدمين الالتزام ببيئة احترافية ومحترمة:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-500 dark:text-slate-400 marker:text-emerald-500">
                <li>الاحترام المتبادل وعدم توجيه أي إساءات أو تنمر.</li>
                <li>عدم نشر روابط لترويج منتجات أو خدمات خارجية.</li>
                <li>الحفاظ على خصوصية المرضى وعدم مشاركة أي معلومات حقيقية تُحدد هوية المرضى في حالات النقاش الطبي.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="group">
            <h2 className="text-2xl font-black mb-5 flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all">
                 <RefreshCcw className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <span>6. التعديل على الشروط</span>
            </h2>
            <div className="pl-16 pr-2 md:pr-16 text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4">
              <p>
                نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت بناءً على متطلبات الخدمة. ستُعتبر التعديلات نافذة فور نشرها على هذه الصفحة، ويُعتبر استمرارك في استخدام المنصة موافقة ضمنية على الشروط المُعدلة.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <p className="text-sm text-slate-500">آخر تحديث: 1 يونيو 2026</p>
          <Link href="/" className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-medical-600 dark:hover:bg-medical-500 hover:text-white transition-all shadow-lg hover:shadow-medical-600/30 group">
            فهمت وموافق، عودة للرئيسية
            <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
