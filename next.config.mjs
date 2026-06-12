/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ],
  },

  // ✅ Security HTTP Headers — رؤوس الأمان
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // منع تضمين الموقع في iframe من مواقع أخرى (Clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // منع المتصفح من تخمين نوع المحتوى (MIME sniffing)
          { key: "X-Content-Type-Options", value: "nosniff" },
          // التحكم في معلومات Referrer
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // منع تسريب معلومات المتصفح (DNS prefetch)
          { key: "X-DNS-Prefetch-Control", value: "on" },
          // سياسة الأذونات — تقييد الوصول لمزايا المتصفح الحساسة
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // حماية من XSS — رؤوس أمان المحتوى (Content Security Policy أساسي)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval مطلوب لـ Next.js
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' ws: wss:",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://drive.google.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
