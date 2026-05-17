"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/app/actions/course";
import { motion } from "framer-motion";

export default function FavoriteButton({ 
  lessonId, 
  initialIsFavorited,
  userId
}: { 
  lessonId: string; 
  initialIsFavorited: boolean;
  userId: string | null;
}) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (!userId) {
      alert("الرجاء تسجيل الدخول أولاً لإضافة الدروس إلى المفضلة");
      window.location.href = "/login";
      return;
    }
    if (loading) return;
    
    // Optimistic update
    setIsFavorited(!isFavorited);
    
    const res = await toggleFavorite(lessonId);
    if (res.error) {
      // Revert on error
      setIsFavorited(isFavorited);
      alert(res.error);
    } else {
      setIsFavorited(res.favorited ?? false);
    }
    setLoading(false);
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-2 transition-all font-bold ${
        isFavorited 
          ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-900/30" 
          : "bg-white border-slate-200 text-slate-600 dark:bg-dark-card dark:border-slate-800 dark:text-slate-400 hover:border-red-400"
      }`}
    >
      <Heart className={`w-5 h-5 transition-colors ${isFavorited ? "fill-current" : ""}`} />
      <span>{isFavorited ? "في المفضلة" : "إضافة للمفضلة"}</span>
    </motion.button>
  );
}
