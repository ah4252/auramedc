import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { getUserIdFromCookies } from '@/lib/auth-helpers';

export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    const cookieStore = await cookies();
    const userId = getUserIdFromCookies(cookieStore);

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ success: false, error: 'Invalid subscription data' }, { status: 400 });
    }

    const { endpoint, keys: { p256dh, auth } } = subscription;

    // Upsert the subscription (create if new, update if already exists for this endpoint)
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { userId, p256dh, auth },
      create: { userId, endpoint, p256dh, auth },
    });

    console.log('Push subscription saved for user', userId);

    return NextResponse.json({ success: true, message: 'Subscription saved' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

