"use client";

import { useEffect, useState } from "react";
import { requestPermission, subscribeUser } from "@/utils/notifications";
import { Bell, BellOff, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
let globalAudio: HTMLAudioElement | null = null;
let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;

if (typeof document !== "undefined") {
  globalAudio = new Audio('/notification.wav');
  globalAudio.preload = 'auto';
  const unlockAudio = async () => {
    // Create AudioContext on first user interaction to satisfy autoplay policies
    if (!audioContext) {
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      audioContext = new AudioCtx();
      try {
        const response = await fetch('/notification.wav');
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      } catch (e) {
        console.error('Failed to load notification sound buffer:', e);
      }
    }
    if (globalAudio) {
      globalAudio.load(); // Forces the browser to recognize user intent
    }
    document.removeEventListener('click', unlockAudio as any);
    document.removeEventListener('touchstart', unlockAudio as any);
  };
  document.addEventListener('click', unlockAudio as any);
  document.addEventListener('touchstart', unlockAudio as any);
}

const playNotificationSound = () => {
  try {
    // Ensure the AudioContext is running (required after user interaction)
    if (audioContext && audioBuffer) {
      if (audioContext.state === 'suspended') {
        audioContext.resume().catch((e) => console.error('AudioContext resume error:', e));
      }
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    } else if (globalAudio) {
      // Fallback to the HTMLAudioElement if the Web Audio API failed
      globalAudio.currentTime = 0; // Reset to start
      globalAudio.play().catch((e) => console.error('Audio play error:', e));
    } else {
      console.warn('No audio method available');
    }
  } catch (e) {
    console.error('Audio error:', e);
  }
};

export default function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false); // هل تم حفظ الاشتراك في DB؟
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSound = localStorage.getItem("notification_sound");
      if (storedSound !== null) {
        setSoundEnabled(storedSound === "true");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      console.log("PushNotificationManager mounted. Permission:", Notification.permission);
      setPermission(Notification.permission);

      if ("serviceWorker" in navigator) {
        // Re‑add listener for messages from the Service Worker
        const messageHandler = (event: MessageEvent) => {
          console.log('Service Worker message received:', event.data);
          if (event.data && event.data.type === 'NOTIFICATION_RECEIVED') {
            const isSoundEnabled = localStorage.getItem('notification_sound') !== 'false';
            console.log('Is sound enabled?', isSoundEnabled);
            if (isSoundEnabled) {
              playNotificationSound();
            }
          }
        };
        navigator.serviceWorker.addEventListener('message', messageHandler);
        
        navigator.serviceWorker.register("/service-worker.js").then((reg) => {
          console.log("Service Worker registered successfully with scope:", reg.scope);
          // Add message listener after registration
          const messageHandler = (event: MessageEvent) => {
            console.log('Service Worker message received:', event.data);
            if (event.data && event.data.type === 'NOTIFICATION_RECEIVED') {
              const isSoundEnabled = localStorage.getItem('notification_sound') !== 'false';
              console.log('Is sound enabled?', isSoundEnabled);
              if (isSoundEnabled) {
                playNotificationSound();
              }
            }
          };
          navigator.serviceWorker.addEventListener('message', messageHandler);
          // Cleanup on unmount
          return () => {
            navigator.serviceWorker.removeEventListener('message', messageHandler);
          };
        }).catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
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
          setMessage(`تعذّر التسجيل: ${error.message}`);
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
        setMessage(`تعذّر التفعيل: ${error.message}`);
      }
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 6000);
  };

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

      {subscribed && (
        <button
          onClick={() => {
            const newVal = !soundEnabled;
            setSoundEnabled(newVal);
            localStorage.setItem("notification_sound", newVal ? "true" : "false");
          }}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg transition-all border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-medical-500 hover:border-medical-500"
          title={soundEnabled ? "كتم صوت الإشعارات" : "تفعيل صوت الإشعارات"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}
