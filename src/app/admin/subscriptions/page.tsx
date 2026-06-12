import { prisma } from "@/lib/db";
import SubscriptionsClient from "./SubscriptionsClient";

export default async function AdminSubscriptionsPage() {
  let requests = [];
  try {
    requests = await (prisma as any).subscriptionRequest.findMany({
      include: {
        user: {
          select: { name: true, email: true, role: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">طلبات الاشتراك ⚡</h1>
        <p className="text-slate-500 font-bold">مراجعة وتفعيل اشتراكات المستخدمين عبر بريدي موب.</p>
      </div>
      
      <SubscriptionsClient initialRequests={JSON.parse(JSON.stringify(requests))} />
    </div>
  );
}
