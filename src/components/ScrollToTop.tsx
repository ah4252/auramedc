"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 30 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="العودة للأعلى"
          className="fixed bottom-20 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-xl bg-white/25 dark:bg-white/10 border border-white/30 dark:border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all hover:scale-110 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)] hover:bg-white/35 dark:hover:bg-white/15 md:bottom-6 md:right-6 md:h-14 md:w-14 md:rounded-full"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-medical-500/40 to-medical-600/20 dark:from-medical-400/30 dark:to-medical-500/10" />
          <ChevronUp className="relative z-10 w-5 h-5 text-medical-700 dark:text-medical-300 group-hover:-translate-y-0.5 transition-transform md:w-6 md:h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
