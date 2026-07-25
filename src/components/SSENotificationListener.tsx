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
    <div className="fixed top-5 right-4 z-[200] flex flex-col gap-3 max-w-[340px] w-full px-2 pointer-events-none" dir="rtl">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.toastId}
            initial={{ opacity: 0, y: -20, x: 50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, x: 50, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="pointer-events-auto relative overflow-hidden bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-xl border border-medical-500/40 rounded-2xl shadow-[0_10px_35px_rgba(14,165,233,0.25)] p-4 flex gap-3.5 items-center cursor-pointer group hover:border-medical-400 transition-all duration-300"
            onClick={() => {
              if (t.url) window.location.href = t.url;
              dismiss(t.toastId);
            }}
          >
            {/* Ambient Background Glow Effect */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-medical-500/20 rounded-full blur-2xl group-hover:bg-medical-400/30 transition-all duration-500 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Icon Container with Glowing Ping & Ringing Animation */}
            <div className="relative shrink-0 flex items-center justify-center">
              <span className="absolute inline-flex h-11 w-11 rounded-full bg-medical-400/30 animate-ping" />
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-medical-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-medical-500/40 text-white">
                <motion.div
                  animate={{ rotate: [0, -18, 18, -12, 12, -6, 6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Bell className="w-5 h-5 drop-shadow" />
                </motion.div>
              </div>
            </div>

            {/* Text Contents */}
            <div className="flex-1 min-w-0 z-10">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-medical-400 animate-pulse" />
                <h4 className="text-sm font-black text-white tracking-wide leading-tight group-hover:text-medical-300 transition-colors">
                  {t.title}
                </h4>
              </div>
              <p className="text-xs text-slate-300 dark:text-slate-300 font-medium mt-1 leading-relaxed line-clamp-2">
                {t.body}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismiss(t.toastId);
              }}
              className="z-10 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all shrink-0 self-start"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Bottom Shrinking Progress Bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 7, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-medical-400 via-cyan-400 to-medical-600 rounded-b-full"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
