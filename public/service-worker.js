self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  const title = data.title || 'إشعار جديد';
  const options = {
    body: data.body || '',
    icon: '/icons/icon-192.webp',
    badge: '/icons/icon-72.webp',
    data: data.url || '/',
    vibrate: [200, 100, 200],
  };
  event.waitUntil(
    self.registration.showNotification(title, options).then(() => {
      return clients.matchAll({ type: 'window', includeUncontrolled: true });
    }).then(clientList => {
      for (const client of clientList) {
        client.postMessage({ type: 'NOTIFICATION_RECEIVED', payload: data });
      }
    })
  );
});


self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data;
  event.waitUntil(clients.openWindow(url));
});
