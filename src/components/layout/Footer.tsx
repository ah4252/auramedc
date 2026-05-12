"use client";

import Link from "next/link";
import { Stethoscope, Mail, Phone, MapPin, ExternalLink, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
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
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
                  <circle cx="50" cy="50" r="48" stroke="url(#goldGradF)" strokeWidth="2.5" fill="none"/>
                  <circle cx="50" cy="50" r="43" fill="#0f172a" fillOpacity="0.95"/>
                  <rect x="44" y="24" width="12" height="52" rx="4" fill="url(#blueGradF)" fillOpacity="0.15"/>
                  <rect x="24" y="44" width="52" height="12" rx="4" fill="url(#blueGradF)" fillOpacity="0.15"/>
                  <path d="M35 30 C35 30 28 30 28 40 L28 55 C28 64 36 70 44 70 C52 70 58 64 58 55 L58 52" stroke="url(#blueGradF)" strokeWidth="4" strokeLinecap="round" fill="none"/>
                  <circle cx="65" cy="46" r="8" stroke="url(#goldGradF)" strokeWidth="3" fill="#0f172a"/>
                  <circle cx="65" cy="46" r="3.5" fill="url(#goldGradF)"/>
                  <path d="M42 62 L50 45 L58 62" stroke="url(#blueGradF)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7"/>
                  <path d="M45 57 L55 57" stroke="url(#blueGradF)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
                  <defs>
                    <linearGradient id="goldGradF" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f59e0b"/>
                      <stop offset="50%" stopColor="#fcd34d"/>
                      <stop offset="100%" stopColor="#d97706"/>
                    </linearGradient>
                    <linearGradient id="blueGradF" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#38bdf8"/>
                      <stop offset="100%" stopColor="#0ea5e9"/>
                    </linearGradient>
                  </defs>
                </svg>
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
              النظام التعليمي الطبي الأكثر رقياً وفخامة في العالم العربي. نبتكر لمستقبل الأطباء النخبة.
            </p>
            <div className="flex items-center gap-4 text-slate-500 pt-4">
               <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
                  <Mail className="w-5 h-5 text-medical-500" />
                  <span className="text-sm font-bold">support@medgpa.com</span>
               </div>
            </div>
          </div>

          {/* Expanded Quick Links */}
          <div className="md:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-black text-xl mb-6 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-medical-500" />
                أقسام الموقع
              </h4>
              <ul className="space-y-4 text-lg">
                <li><Link href="/" className="hover:text-white hover:translate-x-1 transition-all inline-block font-bold">الرئيسية</Link></li>
                <li><Link href="/courses" className="hover:text-white hover:translate-x-1 transition-all inline-block font-bold">السنوات الدراسية</Link></li>
                <li><Link href="/subjects" className="hover:text-white hover:translate-x-1 transition-all inline-block font-bold">التخصصات الطبية</Link></li>
                <li><Link href="/gpa-calculator" className="text-medical-500 hover:text-medical-400 font-black">حاسبة المعدل</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-xl mb-6">معلومات</h4>
              <ul className="space-y-4 text-lg">
                <li><Link href="/about" className="hover:text-white hover:translate-x-1 transition-all inline-block font-bold">عن المنصة</Link></li>
                <li><Link href="/terms" className="hover:text-white hover:translate-x-1 transition-all inline-block font-bold">الشروط والأحكام</Link></li>
                <li><Link href="/privacy" className="hover:text-white hover:translate-x-1 transition-all inline-block font-bold">سياسة الخصوصية</Link></li>
              </ul>
            </div>
          </div>

          {/* Small Contacts */}
          <div className="md:col-span-3 space-y-6">
             <h4 className="text-white font-black text-xl mb-6">تواصل مباشر</h4>
             <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                   <Phone className="w-5 h-5 text-medical-500" />
                   <span className="font-bold text-white" dir="ltr">+966 50 000 0000</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                   <MapPin className="w-5 h-5 text-medical-500" />
                   <span className="font-bold text-slate-300">امجدل - بوسعادة - الجزائر</span>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Bar (Keep small as requested) */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] text-slate-600 font-medium">
            &copy; {new Date().getFullYear()} Aura Med Elite Education. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
            <span>بكل رقي من المطور</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
