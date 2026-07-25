import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const count = await prisma.pushSubscription.count();
    const subs = await prisma.pushSubscription.findMany({
      select: { id: true, userId: true, endpoint: true, createdAt: true },
    });
    return NextResponse.json({ count, subscriptions: subs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
