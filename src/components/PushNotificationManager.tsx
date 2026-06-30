"use client";

import { useEffect, useState } from "react";
import { requestPermission, subscribeUser } from "@/utils/notifications";
import { Bell, BellOff, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
      
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js").catch(console.error);
        if (Notification.permission === "granted") {
          subscribeSilently();
        }
      }
    }
  }, []);

  const subscribeSilently = async () => {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (vapidKey) await subscribeUser(vapidKey);
  };

  const handleClick = async () => {
    if (permission === "granted") {
      setMessage("الإشعارات مفعلة بالفعل ومسجلة بنجاح! 🎉");
      setTimeout(() => setMessage(""), 4000);
      return;
    }

    if (permission === "denied") {
      setMessage("لقد قمت برفض الإشعارات سابقاً 🔒. لتفعيلها، اضغط على أيقونة (القفل) بجوار رابط الموقع في الأعلى واختر 'سماح' للإشعارات.");
      setTimeout(() => setMessage(""), 8000);
      return;
    }

    // Default state: request it
    setLoading(true);
    setMessage("سيظهر لك الآن طلب من المتصفح في الأعلى... اضغط 'Allow' (السماح).");
    try {
      const perm = await requestPermission();
      setPermission(perm);
      if (perm === "granted") {
        setMessage("ممتاز! تم تفعيل الإشعارات بنجاح 🎉");
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (vapidKey) {
          await subscribeUser(vapidKey);
        }
      } else {
        setMessage("قمت برفض الإشعارات. يمكنك تفعيلها لاحقاً من القفل بجوار الرابط.");
      }
    } catch (error) {
      setMessage("حدث خطأ أثناء طلب الإذن");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 6000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold leading-relaxed p-4 rounded-xl shadow-2xl max-w-[280px] text-right border border-slate-700"
            dir="rtl"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleClick}
        disabled={loading}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all border-4 border-white dark:border-dark-bg ${
          permission === "granted" 
            ? "bg-green-500 hover:bg-green-600 text-white" 
            : permission === "denied"
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-medical-500 hover:bg-medical-600 text-white animate-pulse"
        }`}
        title="إدارة الإشعارات"
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
        ) : permission === "granted" ? (
          <BellRing className="w-6 h-6" />
        ) : permission === "denied" ? (
          <BellOff className="w-6 h-6" />
        ) : (
          <Bell className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}


