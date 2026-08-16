import { cookies } from "next/headers";
import { getTimetable } from "@/app/actions/timetable";
import { prisma } from "@/lib/db";
import TimetableClient from "./TimetableClient";
import Script from "next/script";
import ThemeAwareWrapper from "@/components/ThemeAwareWrapper";

export default async function TimetablePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_token")?.value;
  const isUser = !!userId;
  
  const timetableData = isUser ? await getTimetable() : null;

  let userEmail: string | null = null;
  if (userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true }
      });
      if (user) userEmail = user.email;
    } catch (error) {
      console.error("Error fetching user email:", error);
    }
  }

  return (
    <ThemeAwareWrapper darkClass="min-h-screen bg-[#0a0f1d] pb-20 font-sans text-white" lightClass="min-h-screen bg-white pb-20 font-sans text-slate-900">
      {/* Interactive Timetable Tool */}
      <TimetableClient 
        initialData={JSON.parse(JSON.stringify(timetableData))} 
        isUser={isUser} 
        hasActiveSubscription={true}
        activeSubscriptionsCount={1}
        userEmail={userEmail}
      />
      
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" 
        strategy="lazyOnload"
      />

      {/* Footer Info */}
      <section className="container mx-auto px-4 mt-16 text-center">
         <p className="text-slate-500 text-sm font-bold uppercase tracking-widest italic opacity-30">AuraMed Planner System v2.0</p>
      </section>
    </ThemeAwareWrapper>
  );
}
