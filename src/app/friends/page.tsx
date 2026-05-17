import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getFriendsData } from "@/app/actions/friends";
import FriendsClient from "./FriendsClient";

export const metadata = {
  title: "الأصدقاء | AuraMed Elite",
  description: "ابحث عن الأصدقاء وأرسل طلبات صداقة وتواصل مع زملائك الأطباء النخبة في المنصة"
};

export default async function FriendsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;

  // Redirect to login if not authenticated
  if (!userId) {
    redirect("/login?redirect=/friends");
  }

  const res = await getFriendsData();
  const friends = res.success ? res.friends || [] : [];
  const incoming = res.success ? res.incomingRequests || [] : [];
  const outgoing = res.success ? res.outgoingRequests || [] : [];

  return (
    <FriendsClient 
      initialFriends={friends} 
      initialIncoming={incoming} 
      initialOutgoing={outgoing} 
    />
  );
}
