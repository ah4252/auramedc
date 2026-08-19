import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/qcms")) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // فحص سريع للصيغة فقط (userId.timestamp.nonce.signature) —
  // التحقق الكامل من التوقيع يتم في auth-helpers على الخادم،
  // لأن middleware يعمل على Edge Runtime بدون وصول لـ crypto الخاص بـ Node.
  const token = request.cookies.get("user_token")?.value;
  const hasUser = !!token && token.split(".").length === 4;

  if (!hasUser) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    url.searchParams.set("message", "يرجى تسجيل الدخول للمتابعة");
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/timetable")) {
    // التوكن موجود وصيغته سليمة — صفحة الجدول تفتح للمسجلين.
    // الفحص الكامل للتوقيع يتم في إجراءات الخادم.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
