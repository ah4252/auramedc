import { cookies } from "next/headers";
import CommunityLoginRequired from "./CommunityLoginRequired";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userToken = cookieStore.get("user_token")?.value;
  const adminToken = cookieStore.get("admin_token")?.value;

  // Strict check: must have a non-empty token
  if (!userToken && !adminToken) {
    return <CommunityLoginRequired />;
  }

  // Validate that the user actually exists in the database, or the admin has a valid session
  let isValid = false;
  if (adminToken === "secure_session_token") {
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

