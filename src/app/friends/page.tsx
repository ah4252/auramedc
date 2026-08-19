import { cookies } from "next/headers";
import { getUserIdFromCookies } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { getFriendsData } from "@/app/actions/friends";
import FriendsClient from "./FriendsClient";

export const metadata = {
  title: "Friends | AuraMed Elite",
  description: "Search for friends, send friend requests, and connect with your elite medical colleagues on the platform."
};

export default async function FriendsPage() {
  const cookieStore = await cookies();
  const userId = getUserIdFromCookies(cookieStore);

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
