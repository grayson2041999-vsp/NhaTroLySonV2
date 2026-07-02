/* Service worker — Nhà trọ Lý Sơn: nhận thông báo đẩy (Web Push) */
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (e) { data = { title: 'Nhà trọ Lý Sơn', body: (event.data && event.data.text()) || 'Có cập nhật mới' }; }
  const title = data.title || 'Nhà trọ Lý Sơn';
  const body  = data.body  || 'Có cập nhật mới';
  const badge = (typeof data.badge === 'number') ? data.badge : null;
  event.waitUntil((async () => {
    await self.registration.showNotification(title, {
      body, icon: 'icon-192.png', badge: 'icon-192.png', tag: 'nt-update', renotify: true, data: { url: './' }
    });
    try {
      if (badge != null && 'setAppBadge' in self.navigator) {
        if (badge > 0) await self.navigator.setAppBadge(badge);
        else await self.navigator.clearAppBadge();
      }
    } catch (e) {}
  })());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const all = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) { if ('focus' in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow('./');
  })());
});
