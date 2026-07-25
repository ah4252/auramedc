import webpush from 'web-push';
import { prisma } from './db';

// Configure web-push with VAPID details
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@auramed.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
} else {
  console.warn('VAPID keys are not set. Web push notifications will not work.');
}

/**
 * Sends a push notification to all subscriptions of a specific user.
 * 
 * @param userId The ID of the user to notify
 * @param title The title of the notification
 * @param body The body of the notification
 * @param url An optional URL to open when the user clicks the notification
 */
export async function sendPushNotification(userId: string, title: string, body: string, url: string = '/') {
  if (!vapidPublicKey || !vapidPrivateKey) {
    return; // VAPID keys not configured, silently return
  }

  try {
    // Fetch user's push subscriptions
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (!subscriptions || subscriptions.length === 0) {
      return; // No subscriptions found
    }

    const payload = JSON.stringify({
      title,
      body,
      url,
    });

    // Send notifications in parallel
    const pushPromises = subscriptions.map(async (sub) => {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        await webpush.sendNotification(pushSubscription, payload);
      } catch (error: any) {
        // If the subscription is no longer valid (e.g. user revoked permission)
        if (error.statusCode === 410 || error.statusCode === 404) {
          console.log(`Push subscription ${sub.id} is invalid or expired. Removing from database.`);
          await prisma.pushSubscription.delete({
            where: { id: sub.id },
          });
        } else {
          console.error(`Error sending push notification to subscription ${sub.id}:`, error);
        }
      }
    });

    await Promise.allSettled(pushPromises);
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
}

/**
 * Sends a push notification to all registered push subscriptions.
 * 
 * @param title The title of the notification
 * @param body The body of the notification
 * @param url An optional URL to open when the user clicks the notification
 */
export async function sendBroadcastNotification(title: string, body: string, url: string = '/') {
  if (!vapidPublicKey || !vapidPrivateKey) {
    return; // VAPID keys not configured, silently return
  }

  try {
    // Fetch all push subscriptions
    const subscriptions = await prisma.pushSubscription.findMany();

    if (!subscriptions || subscriptions.length === 0) {
      return; // No subscriptions found
    }

    const payload = JSON.stringify({
      title,
      body,
      url,
    });

    // Send notifications in parallel
    const pushPromises = subscriptions.map(async (sub) => {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        await webpush.sendNotification(pushSubscription, payload);
      } catch (error: any) {
        // If the subscription is no longer valid (e.g. user revoked permission)
        if (error.statusCode === 410 || error.statusCode === 404) {
          console.log(`Push subscription ${sub.id} is invalid or expired. Removing from database.`);
          await prisma.pushSubscription.delete({
            where: { id: sub.id },
          });
        } else {
          console.error(`Error sending push notification to subscription ${sub.id}:`, error);
        }
      }
    });

    await Promise.allSettled(pushPromises);
  } catch (error) {
    console.error('Failed to send broadcast push notification:', error);
  }
}
