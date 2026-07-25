import type { CapacitorConfig } from '@capacitor/cli';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ROOT CAUSE EXPLANATION — اقرأ هذا قبل التعديل
 * ════════════════════════════════════════════════════════════════════════════
 *
 * المشكلة الجذرية:
 * عندما يُضبط server.url على domain خارجي (Vercel)، يحمّل Capacitor الصفحة
 * من ذلك الـ domain عبر WebView. لكن Capacitor يحقن الـ JavaScript Bridge
 * (window.Capacitor، PluginRegistry إلخ) فقط في الصفحات المحملة من:
 *   - capacitor://localhost (الـ webDir المحلي)
 *   - http://localhost (Live Reload)
 *   - النطاق المضبوط في server.hostname فقط
 *
 * عند تحميل صفحة من auramedc.vercel.app:
 *   1. Android WebView يحمّل الصفحة
 *   2. Capacitor يحاول حقن Bridge عبر JavaScript Interface
 *   3. ينجح في حقن window.Capacitor
 *   4. لكن الـ plugin registry يُرجع "not implemented" لأن الـ
 *      JavaScript المحمول من Vercel لا يعرف AuraDownloader Plugin
 *      (لأن AuraDownloader.ts مضمّن في كود Next.js على Vercel)
 *
 * ════════════════════════════════════════════════════════════════════════════
 * الحل الصحيح لهذا النمط (Remote Web App):
 * ════════════════════════════════════════════════════════════════════════════
 *
 * الكود المنشور على Vercel يحتوي على AuraDownloader.ts الذي يستدعي
 * registerPlugin('AuraDownloader') — هذا يعني:
 *
 * ✅ registerPlugin() يُنفَّذ في الـ JS المحمول من Vercel
 * ✅ MainActivity.java تسجّل AuraDownloaderPlugin.class قبل super.onCreate()
 * ✅ Capacitor يربط الاثنين عبر Bridge
 *
 * إذن المشكلة لم تكن في server.url نفسه — المشكلة كانت في:
 * 1. registerPlugin() كان يُستدعى بعد super.onCreate() [مُصلح الآن]
 * 2. تحقق من أن الـ JS المنشور على Vercel يتضمن AuraDownloader.ts
 *
 * ════════════════════════════════════════════════════════════════════════════
 */

const config: CapacitorConfig = {
  appId: 'com.auramed.app',
  appName: 'AuraMed Elite',

  /**
   * webDir: المسار المحلي للـ build.
   * يُستخدم فقط عند عدم وجود server.url.
   * إذا كنت تستخدم server.url، يظل webDir مطلوباً لكنه لا يُستخدم فعلياً.
   */
  webDir: 'out',

  server: {
    /**
     * url: يجعل التطبيق يحمّل الموقع من Vercel مباشرة.
     * هذا النمط صحيح ويعمل مع Capacitor شرط:
     * 1. أن يكون registerPlugin() قبل super.onCreate() ← مُصلح
     * 2. أن تكون الـ JS Bundle على Vercel تستدعي registerPlugin('AuraDownloader')
     * 3. أن يكون الـ HTTPS صالح (Vercel يوفر ذلك تلقائياً)
     */
    url: 'https://auramedc.vercel.app',
    cleartext: false,

    /**
     * androidScheme: يضمن استخدام https للـ capacitor scheme
     * مهم لتجنب مشاكل Mixed Content على Android
     */
    androidScheme: 'https',
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0f1e',
      showSpinner: false,
    },
  },
};

export default config;