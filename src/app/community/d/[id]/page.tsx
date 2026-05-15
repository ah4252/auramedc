import { getDiscussion } from "../../../actions/community";
import DiscussionViewClient from "./DiscussionViewClient";
import { cookies } from "next/headers";
import { prisma } from "../../../../lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DiscussionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  
  const discussion = await getDiscussion(id);
  if (!discussion) notFound();

  let user = null;
  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, image: true }
    });
  }

  return (
    <DiscussionViewClient 
      discussion={JSON.parse(JSON.stringify(discussion))} 
      user={user}
    />
  );
}
