self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function() { clients.claim(); });

self.addEventListener('fetch', function(e) {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(function() {
      return new Response('You are offline. Please reconnect.');
    }));
  }
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf(self.location.origin) !== -1) {
          return list[i].focus();
        }
      }
      return clients.openWindow(self.registration.scope);
    })
  );
});
