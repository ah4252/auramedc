"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, BookOpen, FileText, Video, ExternalLink, Activity, 
  Stethoscope, Dna, Brain, Bone, Eye, Heart, HelpCircle, Image as ImageIcon, X,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/context/LocaleProvider.client";

// Helper function to safely parse description JSON
function parseDescription(desc: string | null) {
  if (!desc) return { brief: "", content: "", videoUrl: "", iconName: "Stethoscope", links: [], images: [] };
  try {
    if (desc.trim().startsWith("{")) {
      const parsed = JSON.parse(desc);
      return {
        brief: parsed.brief || "",
        content: parsed.content || "",
        videoUrl: parsed.videoUrl || "",
        iconName: parsed.iconName || "Stethoscope",
        links: parsed.links || [],
        images: parsed.images || []
      };
    }
  } catch (e) {}
  return { brief: desc, content: "", videoUrl: "", iconName: "Stethoscope", links: [], images: [] };
}

// Helper function to map icon string to Lucide component
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = { 
    Stethoscope, Dna, Activity, Brain, Bone, Eye, BookOpen, Heart 
  };
  return icons[iconName] || Stethoscope;
};

// Helper function to extract YouTube ID for embed
function getYoutubeEmbedUrl(url: string) {
  if (!url) return null;
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
    const match = url.trim().match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
  } catch (e) {}
  return null;
}

export default function SpecialtyDetailClient({ specialty }: { specialty: any }) {
  const { t } = useLocale();
  const parsed = parseDescription(specialty.description);
  const Icon = getIconComponent(parsed.iconName);
  const embedUrl = getYoutubeEmbedUrl(parsed.videoUrl);

  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="relative min-h-screen py-16 bg-slate-50 dark:bg-dark-bg text-right" dir="rtl">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-medical-500/10 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl opacity-50 dark:opacity-20 animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        {/* Back Link */}
        <Link 
          href="/subjects"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-medical-600 font-bold mb-10 transition-colors bg-white dark:bg-dark-card px-5 py-2.5 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <ArrowRight className="w-5 h-5" />
          <span>{t("subjects_detail_back_to_specialties", "Back to specialties")}</span>
        </Link>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-dark-card rounded-[3rem] border border-slate-200 dark:border-slate-800/80 p-8 sm:p-12 shadow-2xl relative overflow-hidden mb-12"
        >
          <div className="absolute top-0 left-0 w-48 h-48 bg-medical-500/5 rounded-full -ml-24 -mt-24 blur-3xl" />
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-medical-500 to-medical-700 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-medical-500/20 shrink-0">
              <Icon className="w-12 h-12" />
            </div>
            
            <div className="flex-1 space-y-4 text-center md:text-right">
              <span className="bg-medical-50 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 text-xs font-black px-4 py-1.5 rounded-full border border-medical-200/20">
                {t("subjects_detail_verified_label", "Verified medical specialty")}
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                {specialty.name}
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {parsed.brief || t("subjects_fallback_brief", "A complete educational path containing all references, explanations, and academic videos designed especially for students of this specialty.")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Detailed Content - Full Width */}
          <motion.div variants={itemVariants}>
            <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800/80 p-6 sm:p-10 shadow-lg space-y-6">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-medical-600 rounded-full" />
                {t("subjects_detail_about_title", "About the specialty")}
              </h2>
              <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg whitespace-pre-wrap font-medium">
                {parsed.content || t("subjects_detail_no_content", "No additional specialty details have been added yet.")}
              </div>
            </div>
          </motion.div>

          {/* Image Gallery Section */}
          {parsed.images?.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800/80 p-6 sm:p-10 shadow-lg space-y-6">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                  {t("subjects_detail_media_gallery", "Media gallery")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {parsed.images.map((imgUrl: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageUrl(imgUrl)}
                      className="group relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-lg transition-all duration-300 bg-slate-900"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={imgUrl} 
                        alt={`Specialty media ${idx + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white scale-75 group-hover:scale-100 transition-transform duration-300" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Lower Grid - Videos, Links & Platform Help Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Video (Takes more width if available) */}
            {embedUrl ? (
              <motion.div variants={itemVariants} className="lg:col-span-7 space-y-8">
                <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800/80 p-6 sm:p-8 shadow-lg space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-medical-600 rounded-full" />
                    {t("subjects_detail_video_title", "Introduction video for this specialty")}
                  </h2>
                  <div className="aspect-video w-full rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-950 shadow-inner">
                    <iframe 
                      src={embedUrl} 
                      title="Specialty Video" 
                      className="w-full h-full border-0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen 
                    />
                  </div>
                </div>
              </motion.div>
            ) : null}

            {/* Right Column: Links and Info (Takes the rest or full width if no video) */}
            <motion.div variants={itemVariants} className={`${embedUrl ? "lg:col-span-5" : "lg:col-span-12"} space-y-8`}>
              
              {/* Helpful Links */}
              {parsed.links?.length > 0 && (
                <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800/80 p-6 sm:p-8 shadow-lg space-y-6">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                    <div className="w-1.5 h-5 bg-indigo-500 rounded-full" />
                    {t("subjects_detail_links_title", "Important links and references")}
                  </h3>
                  <div className="space-y-3">
                    {parsed.links.map((link: any, idx: number) => (
                      <a 
                        key={idx}
                        href={link.url}
                        target="_self"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/40 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/20 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4.5 h-4.5 text-indigo-500 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="line-clamp-1">{link.title}</span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0 ml-1" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Help & Contact Support card */}
              <div className="bg-gradient-to-br from-medical-600 to-indigo-700 text-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                
                <div className="relative z-10 space-y-6">
                  <h3 className="text-xl font-black flex items-center gap-2.5">
                    <HelpCircle className="w-6 h-6 text-medical-300 animate-bounce" />
                    {t("subjects_detail_need_help", "Need help?")}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
                    {t("subjects_detail_help_description", "If you have any questions about this specialty or want to provide references and lectures, please contact platform support.")}
                  </p>
                  <Link 
                    href="/"
                    className="block w-full py-4 bg-white hover:bg-slate-50 text-medical-700 text-center font-black rounded-2xl transition-all shadow-md text-sm"
                  >
                    {t("subjects_detail_back_home", "Back to home")}
                  </Link>
                </div>
              </div>

            </motion.div>
          </div>
        </motion.div>
        {/* Lightbox Image Preview Modal */}
        <AnimatePresence>
          {activeImageUrl && (
            (() => {
              const currentIndex = parsed.images.indexOf(activeImageUrl);
              const hasMultipleImages = parsed.images.length > 1;

              const showNextImage = (e: React.MouseEvent) => {
                e.stopPropagation();
                const nextIdx = (currentIndex + 1) % parsed.images.length;
                setActiveImageUrl(parsed.images[nextIdx]);
              };

              const showPrevImage = (e: React.MouseEvent) => {
                e.stopPropagation();
                const prevIdx = (currentIndex - 1 + parsed.images.length) % parsed.images.length;
                setActiveImageUrl(parsed.images[prevIdx]);
              };

              return (
                <div 
                  onClick={() => setActiveImageUrl(null)}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
                >
                  {/* Close button */}
                  <button 
                    onClick={() => setActiveImageUrl(null)}
                    title={t("subjects_detail_close_button", "Close")}
                    type="button"
                    className="absolute top-6 left-6 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-55 cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {/* Prev Button (Right side in RTL) */}
                  {hasMultipleImages && (
                    <button
                      onClick={showPrevImage}
                      title={t("subjects_detail_previous_image", "Previous image")}
                      type="button"
                      className="absolute right-6 p-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 z-55 cursor-pointer hover:scale-110"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  )}

                  {/* Main Image Container */}
                  <motion.div
                    key={activeImageUrl} // Re-animate on image source change
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
                    className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-slate-900 cursor-default"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={activeImageUrl} 
                      alt="Full preview" 
                      className="w-full h-auto max-h-[85vh] object-contain rounded-3xl"
                    />

                    {/* Image Counter Badge */}
                    {hasMultipleImages && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white/95 px-4 py-1.5 rounded-full text-xs font-bold border border-white/10">
                        {currentIndex + 1} / {parsed.images.length}
                      </div>
                    )}
                  </motion.div>

                  {/* Next Button (Left side in RTL) */}
                  {hasMultipleImages && (
                    <button
                      onClick={showNextImage}
                      title={t("subjects_detail_next_image", "Next image")}
                      type="button"
                      className="absolute left-6 p-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 z-55 cursor-pointer hover:scale-110"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </button>
                  )}
                </div>
              );
            })()
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
