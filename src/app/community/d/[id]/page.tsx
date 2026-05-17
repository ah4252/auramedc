import { getDiscussion } from "@/app/actions/community";
import DiscussionViewClient from "./DiscussionViewClient";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import CommunityLoginRequired from "@/app/community/CommunityLoginRequired";

export const dynamic = "force-dynamic";

export default async function DiscussionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  const adminToken = cookieStore.get("admin_token")?.value;
  
  let user = null;
  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, image: true, role: true }
    });
  }

  if (!user && adminToken === "secure_session_token") {
    user = {
      id: "secure_session_token",
      name: "المشرف العام",
      image: null,
      role: "ADMIN"
    };
  }

  if (!user) {
    return <CommunityLoginRequired />;
  }

  const discussion = await getDiscussion(id);
  if (!discussion) notFound();

  // Increment views
  await prisma.discussion.update({
    where: { id },
    data: { views: { increment: 1 } }
  }).catch(() => {});
  
  // Update the object for immediate display
  if (discussion) {
    discussion.views += 1;
  }

  return (
    <DiscussionViewClient 
      discussion={JSON.parse(JSON.stringify(discussion))} 
      user={user}
    />
  );
}
