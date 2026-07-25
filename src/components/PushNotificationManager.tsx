"use client";

import { useEffect, useState } from "react";
import { requestPermission, subscribeUser } from "@/utils/notifications";
import { Bell, BellOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false); // هل تم حفظ الاشتراك في DB؟
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js").catch(() => {});
        // إذا كان الإذن ممنوحاً مسبقاً — حاول التسجيل الصامت تلقائياً
        if (Notification.permission === "granted") {
          subscribeSilently();
        }
      }
    }
  }, []);

  // تسجيل صامت بدون إشعار بصري — يعمل عند كل تحميل للصفحة
  const subscribeSilently = async () => {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return;
    try {
      await subscribeUser(vapidKey);
      setSubscribed(true); // نجح الحفظ في DB
    } catch {
      // فشل صامت (مثلاً: FCM غير متاح أو المستخدم غير مسجل)
      // الزر سيظهر ليتمكن المستخدم من المحاولة يدوياً
    }
  };

  const handleClick = async () => {
    // الإذن ممنوح لكن الاشتراك لم يُسجَّل في DB — حاول مجدداً
    if (permission === "granted" && !subscribed) {
      setLoading(true);
      setMessage("جارٍ تسجيل الإشعارات...");
      try {
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (vapidKey) await subscribeUser(vapidKey);
        setSubscribed(true);
        setMessage("ممتاز! تم تفعيل الإشعارات بنجاح 🎉");
      } catch (error: any) {
        if (error.message === "Unauthorized") {
          setMessage("يجب تسجيل الدخول كطالب أولاً لتلقي الإشعارات 🔐");
        } else {
          setMessage("تعذّر التسجيل. تأكد من اتصالك بالإنترنت وحاول مجدداً.");
        }
      }
      setLoading(false);
      setTimeout(() => setMessage(""), 6000);
      return;
    }

    if (permission === "denied") {
      setMessage("رفضت الإشعارات سابقاً 🔒. اضغط على أيقونة القفل بجوار الرابط واختر 'سماح'.");
      setTimeout(() => setMessage(""), 8000);
      return;
    }

    // الحالة الافتراضية: اطلب الإذن لأول مرة
    setLoading(true);
    setMessage("سيظهر طلب من المتصفح... اضغط 'Allow' للسماح.");
    try {
      const perm = await requestPermission();
      if (perm === "granted") {
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (vapidKey) await subscribeUser(vapidKey);
        setPermission(perm);
        setSubscribed(true);
        setMessage("ممتاز! تم تفعيل الإشعارات بنجاح 🎉");
      } else {
        setPermission(perm);
        setMessage("رفضت الإشعارات. يمكنك تفعيلها لاحقاً من القفل بجوار الرابط.");
      }
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        setMessage("يجب تسجيل الدخول كطالب أولاً لتلقي الإشعارات 🔐");
      } else {
        setMessage("تعذّر تفعيل الإشعارات. حاول مجدداً.");
      }
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 6000);
  };

  // أخفِ الزر فقط بعد نجاح الاشتراك فعلياً في DB
  if (subscribed && !message) return null;

  // أخفِ الزر إذا كان الإذن مرفوضاً ولا توجد رسالة
  if (permission === "denied" && !message) return null;

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end gap-3">
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

      {!subscribed && permission !== "denied" && (
        <button
          onClick={handleClick}
          disabled={loading}
          className="w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all border-2 md:border-4 border-white dark:border-dark-bg bg-medical-500 hover:bg-medical-600 text-white md:animate-pulse"
          title="تفعيل الإشعارات"
        >
          {loading ? (
            <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          ) : (
            <Bell className="w-5 h-5 md:w-6 md:h-6" />
          )}
        </button>
      )}
    </div>
  );
}
