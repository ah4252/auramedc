import { cookies } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles, ShieldCheck, BookOpen, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { tServer } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const siteLang = (cookieStore.get("site_lang")?.value as any) || "ar";

  return {
    title: tServer(
      "subscription_page_title",
      siteLang ?? "ar",
      siteLang === "fr" ? "Aide à l'inscription et à l'abonnement | AuraMed Elite" : "Subscription & Signup Help | AuraMed Elite"
    ),
    description: tServer(
      "subscription_page_description",
      siteLang ?? "ar",
      siteLang === "fr"
        ? "Tout ce que vous devez savoir pour rejoindre AuraMed Elite et vous abonner en toute confiance."
        : "Everything you need to know to join AuraMed Elite and subscribe with confidence."
    )
  };
}

export default async function SubscriptionPage() {
  const cookieStore = await cookies();
  const siteLang = (cookieStore.get("site_lang")?.value as any) || "ar";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 opacity-80" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-blue-500/10 blur-[140px] pointer-events-none" />
        <div className="absolute right-0 top-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur-xl">
                <Sparkles className="w-4 h-4 text-sky-400" />
                {tServer("subscription_page_title", siteLang ?? "ar", "Subscription & Signup Help")}
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                  {tServer("subscription_page_title", siteLang ?? "ar", "Subscription & Signup Help")}
                </h1>
                <p className="max-w-3xl text-lg text-slate-300">
                  {tServer(
                    "subscription_page_description",
                    siteLang ?? "ar",
                    "Everything you need to know to join AuraMed Elite and subscribe with confidence."
                  )}
                </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href="/profile?tab=subscription"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-medical-500 to-sky-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-medical-500/20 transition-all hover:-translate-y-0.5 hover:shadow-medical-500/30"
                  >
                    {tServer("subscription_page_button_register", siteLang ?? "ar", "Subscribe")}
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Link>
                  <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">
                    {tServer(
                      "subscription_page_section_support_desc",
                      siteLang ?? "ar",
                      "Reach out via email or social links for fast assistance with registration."
                    )}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-700/30 bg-slate-900/70 p-5 text-slate-300 max-w-md">
                  <div className="text-xs uppercase tracking-[0.35em] text-sky-400 font-black mb-3">
                    {tServer("subscription_page_plan_title", siteLang ?? "ar", "Premium plan")}
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-white">{tServer("subscription_page_plan_price", siteLang ?? "ar", "100 DZD")}</span>
                    <span className="text-sm text-slate-400">{tServer("subscription_page_plan_billing", siteLang ?? "ar", "per month")}</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-400">
                    {tServer(
                      "subscription_page_plan_note",
                      siteLang ?? "ar",
                      "Includes full access to premium content, tools and fast support."
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-900/30 backdrop-blur-3xl">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
                  <h2 className="text-xl font-black mb-4">
                    {tServer("subscription_page_section_why_title", siteLang ?? "ar", "Why subscribe?")}
                  </h2>
                  <p className="text-slate-300">
                    {tServer(
                      "subscription_page_section_why_desc",
                      siteLang ?? "ar",
                      "Unlock exclusive medical content, advanced study tools, and premium support for your learning journey."
                    )}
                  </p>
                </div>
                <div className="grid gap-4">
                  {[
                    {
                      icon: ShieldCheck,
                      title: tServer("subscription_page_section_how_title", siteLang ?? "ar", "How to sign up"),
                      desc: tServer(
                        "subscription_page_section_how_desc",
                        siteLang ?? "ar",
                        "Click register, complete your details, and verify your email to activate your account."
                      )
                    },
                    {
                      icon: BookOpen,
                      title: tServer("subscription_page_section_why_title", siteLang ?? "ar", "Why subscribe?"),
                      desc: tServer(
                        "subscription_page_section_why_desc",
                        siteLang ?? "ar",
                        "Unlock exclusive medical content, advanced study tools, and premium support for your learning journey."
                      )
                    },
                    {
                      icon: Users,
                      title: tServer("subscription_page_section_support_title", siteLang ?? "ar", "Need help?"),
                      desc: tServer(
                        "subscription_page_section_support_desc",
                        siteLang ?? "ar",
                        "Reach out via email or social links for fast assistance with registration."
                      )
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 rounded-3xl border border-slate-700/40 bg-slate-950/50 p-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-medical-500/10 text-medical-400">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-white">{item.title}</h3>
                        <p className="mt-2 text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-[2rem] border border-slate-700/40 bg-slate-900/50 p-6">
                  <h3 className="text-lg font-black text-white mb-4">
                    {tServer("subscription_page_guide_title", siteLang ?? "ar", "Subscription Guide")}
                  </h3>
                  <div className="space-y-4 text-slate-300">
                    <div>
                      <h4 className="font-black text-white">{tServer("subscription_page_guide_step_1_title", siteLang ?? "ar", "How to subscribe")}</h4>
                      <p className="mt-2 text-sm leading-relaxed">
                        {tServer("subscription_page_guide_step_1_desc", siteLang ?? "ar", "Choose your plan, complete the registration form, then submit your payment details. Once the payment is verified, your subscription will be activated automatically.")}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-black text-white">{tServer("subscription_page_guide_step_2_title", siteLang ?? "ar", "Subscription duration")}</h4>
                      <p className="mt-2 text-sm leading-relaxed">
                        {tServer("subscription_page_guide_step_2_desc", siteLang ?? "ar", "Subscriptions are billed monthly and remain active until you cancel. Renewals happen automatically so you keep access without interruption.")}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-black text-white">{tServer("subscription_page_guide_step_3_title", siteLang ?? "ar", "Need help?")}</h4>
                      <p className="mt-2 text-sm leading-relaxed">
                        {tServer("subscription_page_guide_step_3_desc", siteLang ?? "ar", "If you have questions about the process or the duration, contact our support team through the email or social links provided on the page.")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[2rem] border border-slate-700/40 bg-slate-900/50 p-6">
                  <h3 className="text-lg font-black text-white mb-4">
                    {tServer("subscription_page_includes_title", siteLang ?? "ar", "What you get")}
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 w-5 h-5 text-sky-400" />
                      <span>{tServer("subscription_page_feature_1", siteLang ?? "ar", "Unlimited access to premium lectures")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 w-5 h-5 text-sky-400" />
                      <span>{tServer("subscription_page_feature_2", siteLang ?? "ar", "Advanced study tools and downloads")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 w-5 h-5 text-sky-400" />
                      <span>{tServer("subscription_page_feature_3", siteLang ?? "ar", "Priority support and exclusive tips")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
