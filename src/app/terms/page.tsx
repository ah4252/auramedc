import { FileText, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center justify-center p-4 bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 rounded-2xl mb-6">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">الشروط والأحكام</h1>
        <p className="text-slate-500 dark:text-slate-400">يرجى قراءة شروط استخدام منصة ميدبلاس بعناية.</p>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 space-y-10 animate-slide-up">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-medical-600">
            <div className="w-2 h-8 bg-medical-500 rounded-full"></div>
            1. مقدمة
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            باستخدامك لمنصة ميدبلاس (MedPulse)، فإنك توافق على الالتزام بالشروط والأحكام الموضحة هنا. هذه المنصة مخصصة للأغراض التعليمية والتدريبية لطلاب الطب والمهنيين الصحيين.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-medical-600">
            <div className="w-2 h-8 bg-medical-500 rounded-full"></div>
            2. الملكية الفكرية
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            جميع المحتويات المتوفرة على المنصة بما في ذلك الفيديوهات، النصوص، الملفات، والشعارات هي ملكية خاصة لمنصة ميدبلاس. لا يجوز إعادة إنتاج، توزيع، أو بيع أي جزء من هذا المحتوى بدون إذن خطي مسبق.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-medical-600">
            <div className="w-2 h-8 bg-medical-500 rounded-full"></div>
            3. استخدام المحتوى
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            المحتوى المقدم هو للأغراض التعليمية فقط. لا ينبغي استخدامه كبديل للاستشارة الطبية المتخصصة أو التشخيص أو العلاج. نحن لا نتحمل مسؤولية أي قرارات طبية تُتخذ بناءً على المحتوى المعروض.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-medical-600">
            <div className="w-2 h-8 bg-medical-500 rounded-full"></div>
            4. حساب المستخدم
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            يتحمل المستخدم مسؤولية الحفاظ على سرية بيانات حسابه. أي نشاط يتم من خلال الحساب يعتبر من مسؤولية صاحب الحساب مباشرة.
          </p>
        </section>

        <div className="pt-10 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-medical-600 font-bold hover:gap-3 transition-all">
            العودة للرئيسية
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
