/**
 * auth-helpers.ts
 * مساعدات المصادقة الآمنة — Security Authentication Helpers
 */

import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

// ============================================================
// Admin Token — نظام توكن المدير الآمن
// ============================================================

const ADMIN_SECRET = process.env.NEXTAUTH_SECRET || "change-me-to-a-strong-secret";
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 أيام

/**
 * توليد توكن مدير موقّع بـ HMAC — لا يمكن تزويره بدون المفتاح السري
 */
export function generateAdminToken(): string {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = `${timestamp}.${nonce}`;
  const signature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

/**
 * التحقق من صحة توكن المدير وعدم انتهاء صلاحيته
 */
export function verifyAdminToken(token: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [timestamp, nonce, signature] = parts;
  const payload = `${timestamp}.${nonce}`;
  const expectedSig = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(payload)
    .digest("hex");
  // مقارنة آمنة تمنع Timing Attacks
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return false;
  }
  const age = Date.now() - parseInt(timestamp, 10);
  return age <= TOKEN_EXPIRY_MS;
}

/**
 * يُلزم المستخدم بأن يكون مديراً — يرمي خطأ إذا لم يكن كذلك
 */
export async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token || !verifyAdminToken(token)) {
    throw new Error("غير مصرح — يجب تسجيل الدخول كمدير");
  }
}

/**
 * يتحقق هل المستخدم الحالي مدير (بدون رمي خطأ)
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    return !!token && verifyAdminToken(token);
  } catch {
    return false;
  }
}

/**
 * يُلزم المستخدم بتسجيل الدخول — يرجع ID المستخدم أو يرمي خطأ
 */
export async function requireUser(): Promise<string> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  if (!userId) throw new Error("يجب تسجيل الدخول أولاً");
  return userId;
}

/**
 * يجلب ID المستخدم الحالي أو null إذا لم يكن مسجلاً
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("user_token")?.value ?? null;
  } catch {
    return null;
  }
}

export function normalizeStudyYear(value?: string | null): string {
  return (value ?? "").replace(/\s+/g, " ").trim().toLowerCase();
}

export function isThirdYearStudyYear(value?: string | null): boolean {
  const normalized = normalizeStudyYear(value);
  if (!normalized) return false;

  const simplePatterns = [
    /^s?\d+$/,
    /^(?:السنة\s*)?(?:الثالثة|3|3e|3rd|third)$/,
    /^(?:السنة\s*)?(?:الثالثة|3|3e|3rd|third)\s*(?:طب|medicine|medecine)?$/,
    /(?:السنة\s*(?:الثالثة|3)|3(?:rd|e)?\s*(?:year|année|annee)|third\s*year|troisi(?:è|e)me\s*année)/,
  ];

  return simplePatterns.some(pattern => pattern.test(normalized));
}

export function isSubscriptionExemptEmail(email?: string | null): boolean {
  return (email ?? "").trim().toLowerCase() === "abendakfal07@gmail.com";
}

export async function canAccessPharmacy(): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { studyYear: true },
  });

  return isThirdYearStudyYear(user?.studyYear ?? null);
}

export async function canAccessQcms(): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (isSubscriptionExemptEmail(user?.email ?? null)) return true;

  const approved = await prisma.subscriptionRequest.findFirst({
    where: {
      userId,
      status: "APPROVED",
      OR: [
        { transactionId: { startsWith: "QCM:" } },
        { transactionId: { startsWith: "ALL:" } },
        { transactionId: { not: { contains: ":" } } }
      ]
    },
    orderBy: { createdAt: "desc" },
  });

  if (!approved) return false;

  const used = Number((approved as any).usedViews ?? 0);
  const max = Number((approved as any).maxViews ?? 5);
  return used < max;
}

// ============================================================
// Password Utilities — أدوات كلمات المرور
// ============================================================

/**
 * توليد كلمة مرور مؤقتة آمنة (8 أحرف عشوائية)
 */
export function generateTempPassword(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase(); // مثال: A3F7B2C1
}
