import { cookies } from "next/headers";
import CommunityLoginRequired from "./CommunityLoginRequired";
import { prisma } from "@/lib/db";
import { getUserIdFromCookies, verifyAdminToken } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export default async function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userToken = getUserIdFromCookies(cookieStore);
  const adminToken = cookieStore.get("admin_token")?.value;

  // Strict check: must have a valid signed token
  if (!userToken && !(adminToken && verifyAdminToken(adminToken))) {
    return <CommunityLoginRequired />;
  }

  // Validate that the user actually exists in the database, or the admin has a valid session
  let isValid = false;
  if (adminToken && verifyAdminToken(adminToken)) {
    isValid = true;
  } else if (userToken) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userToken },
        select: { id: true }
      });
      if (user) {
        isValid = true;
      }
    } catch (error) {
      console.error("CommunityLayout validation error:", error);
    }
  }

  if (!isValid) {
    return <CommunityLoginRequired />;
  }

  return <>{children}</>;
}

