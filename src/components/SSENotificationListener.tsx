"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";

type NotificationData = {
  id: string;
  title: string;
  body: string;
  url: string;
};

type Toast = NotificationData & { toastId: string };

const POLL_INTERVAL = 20000; // 20 seconds

export default function SSENotificationListener() {
  const lastSeenIdRef = useRef<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (data: NotificationData) => {
    const toastId = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...data, toastId }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
    }, 7000);

    // إشعار نظام إذا كانت الصلاحية ممنوحة
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        new Notification(data.title, {
          body: data.body,
          icon: "/icons/icon-192.webp",
        });
      } catch {}
    }
  };

  const dismiss = (toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    async function checkForUpdates() {
      try {
        const res = await fetch("/api/latest-update", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();

        if (!data?.id) return;

        // أول تحميل: سجّل فقط ولا تُظهر إشعاراً
        if (lastSeenIdRef.current === null) {
          lastSeenIdRef.current = data.id;
          return;
        }

        // محتوى جديد؟
        if (data.id !== lastSeenIdRef.current) {
          lastSeenIdRef.current = data.id;
          addToast({ id: data.id, title: data.title, body: data.body, url: data.url });
        }
      } catch {}
    }

    // فحص فوري عند تحميل الصفحة
    checkForUpdates();

    // ثم كل 20 ثانية
    interval = setInterval(checkForUpdates, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-[320px]" dir="rtl">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.toastId}
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-4 flex gap-3 items-start cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => {
              if (t.url) window.location.href = t.url;
              dismiss(t.toastId);
            }}
          >
            <div className="w-9 h-9 rounded-full bg-medical-100 dark:bg-medical-900 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-medical-600 dark:text-medical-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {t.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {t.body}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); dismiss(t.toastId); }}
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
