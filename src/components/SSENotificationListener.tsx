"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";

type NotificationData = {
  title: string;
  body: string;
  url?: string;
};

export default function SSENotificationListener() {
  const [notifications, setNotifications] = useState<
    (NotificationData & { id: string })[]
  >([]);

  useEffect(() => {
    let es: EventSource | null = null;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;

    function connect() {
      es = new EventSource("/api/sse");

      es.addEventListener("notification", (e) => {
        try {
          const data: NotificationData = JSON.parse(e.data);
          const id = crypto.randomUUID();

          // إضافة الإشعار كـ toast داخل الموقع
          setNotifications((prev) => [...prev, { ...data, id }]);

          // حذف الإشعار تلقائياً بعد 7 ثوانٍ
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
          }, 7000);

          // إذا كانت إشعارات المتصفح مفعلة — أرسل إشعار نظام أيضاً
          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            new Notification(data.title, {
              body: data.body,
              icon: "/icons/icon-192.webp",
            });
          }
        } catch {
          // بيانات غير صالحة — تجاهل
        }
      });

      es.onerror = () => {
        es?.close();
        // إعادة الاتصال بعد 5 ثوانٍ
        retryTimeout = setTimeout(connect, 5000);
      };
    }

    connect();

    return () => {
      es?.close();
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, []);

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div
      className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-[320px]"
      dir="rtl"
    >
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-4 flex gap-3 items-start cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => {
              if (n.url) window.location.href = n.url;
              dismiss(n.id);
            }}
          >
            <div className="w-9 h-9 rounded-full bg-medical-100 dark:bg-medical-900 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-medical-600 dark:text-medical-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {n.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {n.body}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismiss(n.id);
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
