"use client";

import Link from "next/link";
import { Stethoscope, Mail, Phone, MapPin, ExternalLink, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

import { useEffect, useState } from "react";
import { getSettings } from "@/app/actions/settings";
import { Instagram, Facebook, Send as TelegramIcon } from "lucide-react";
import { useLocale } from "@/context/LocaleProvider.client";

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<any>({});
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { t } = useLocale();
  
  useEffect(() => {
    getSettings().then(setSettings);
  }, []);
  
  // Only show footer on the home page
  if (pathname !== "/") return null;

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-medical-500/50 to-transparent"></div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-medical-600/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand & Description */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              {/* Premium SVG Emblem (Footer version) */}
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="AuraMed Elite Logo"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-500 italic">Aura</span>
                  <span className="text-white not-italic font-light">Med</span>
                </span>
                <span className="text-[8px] font-black tracking-[0.3em] text-amber-500 uppercase mt-0.5">Elite</span>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-slate-500">
              {t("footer_description", "النظام التعليمي الطبي الأكثر رقياً وفخامة في العالم العربي. نبتكر لمستقبل الأطباء النخبة.")}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-slate-500 pt-4">
               {settings.socialEmail && (
                 <a 
                   href={`mailto:${settings.socialEmail}`} 
                   onClick={(e) => {
                     navigator.clipboard.writeText(settings.socialEmail);
                     setCopiedEmail(true);
                     setTimeout(() => setCopiedEmail(false), 2000);
                   }}
                   className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer relative"
                   title="اضغط لفتح تطبيق الإيميل أو نسخ العنوان"
                 >
                    <Mail className={`w-5 h-5 ${copiedEmail ? "text-green-400" : "text-sky-500"}`} />
                    <span className="text-sm font-bold" dir="ltr">{copiedEmail ? "تم النسخ!" : settings.socialEmail}</span>
                 </a>
               )}
            </div>
          </div>

          {/* Expanded Quick Links */}
          <div className="md:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-black text-xl mb-6 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-medical-500" />
                {t("footer_sections_title", "أقسام الموقع")}
              </h4>
              <ul className="space-y-4 text-lg">
                <li><Link href="/" className="hover:text-white hover:translate-x-1 transition-all inline-block font-bold">{t("footer_home", "الرئيسية")}</Link></li>
                <li><Link href="/courses" className="hover:text-white hover:translate-x-1 transition-all inline-block font-bold">{t("footer_courses", "السنوات الدراسية")}</Link></li>
                <li><Link href="/subjects" className="hover:text-white hover:translate-x-1 transition-all inline-block font-bold">{t("footer_subjects", "التخصصات الطبية")}</Link></li>
                <li><Link href="/timetable" className="hover:text-white hover:translate-x-1 transition-all inline-block font-bold">{t("footer_timetable", "جدول الدراسة")}</Link></li>
                <li><Link href="/gpa-calculator" className="text-medical-500 hover:text-medical-400 font-black">{t("footer_gpa_calculator", "حاسبة المعدل")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-xl mb-6">{t("footer_information_title", "معلومات")}</h4>
              <ul className="space-y-4 text-lg">
                <li><Link href="/about" className="hover:text-white hover:translate-x-1 transition-all inline-block font-bold">{t("footer_about", "عن المنصة")}</Link></li>
                <li><Link href="/terms" className="hover:text-white hover:translate-x-1 transition-all inline-block font-bold">{t("footer_terms", "الشروط والأحكام")}</Link></li>
                <li><Link href="/privacy" className="hover:text-white hover:translate-x-1 transition-all inline-block font-bold">{t("footer_privacy", "سياسة الخصوصية")}</Link></li>
              </ul>
            </div>
          </div>

          {/* Social Contacts */}
          <div className="md:col-span-3 space-y-6">
             <h4 className="text-white font-black text-xl mb-6">{t("footer_contact_title", "تواصل مباشر")}</h4>
             <div className="space-y-4">
                {settings.socialWhatsapp && (
                  <a href={`https://wa.me/${settings.socialWhatsapp.replace(/[^0-9]/g, '')}`} target="_self" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-800/30 hover:bg-slate-800/80 rounded-2xl border border-slate-700/30 transition-colors group">
                     <Phone className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                     <span className="font-bold text-white" dir="ltr">{settings.socialWhatsapp}</span>
                  </a>
                )}
                {settings.socialTelegram && (
                  <a href={settings.socialTelegram} target="_self" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-800/30 hover:bg-slate-800/80 rounded-2xl border border-slate-700/30 transition-colors group">
                     <TelegramIcon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                     <span className="font-bold text-white">{t("footer_telegram", "تيليجرام (Telegram)")}</span>
                  </a>
                )}
                {settings.socialInstagram && (
                  <a href={settings.socialInstagram} target="_self" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-800/30 hover:bg-slate-800/80 rounded-2xl border border-slate-700/30 transition-colors group">
                     <Instagram className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
                     <span className="font-bold text-white">{t("footer_instagram", "إنستغرام (Instagram)")}</span>
                  </a>
                )}
                {settings.socialFacebook && (
                  <a href={settings.socialFacebook} target="_self" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-800/30 hover:bg-slate-800/80 rounded-2xl border border-slate-700/30 transition-colors group">
                     <Facebook className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                     <span className="font-bold text-white">{t("footer_facebook", "فيسبوك (Facebook)")}</span>
                  </a>
                )}
                {(!settings.socialWhatsapp && !settings.socialTelegram && !settings.socialInstagram && !settings.socialFacebook) && (
                  <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                     <MapPin className="w-5 h-5 text-medical-500" />
                     <span className="font-bold text-slate-300">{t("footer_location", "امجدل - بوسعادة - الجزائر")}</span>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Bottom Bar (Keep small as requested) */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] text-slate-600 font-medium">
            &copy; {new Date().getFullYear()} Aura Med Elite Education. {t("footer_rights_reserved", "جميع الحقوق محفوظة.")}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
            <span>{t("footer_built_by", "بكل رقي من المطور")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
