const CACHE_NAME = 'alfa-academy-v1';
const urlsToCache = [
  '/alfaacademy/admin/',
  '/alfaacademy/admin/index.html',
  '/alfaacademy/admin/logo192.png',
  '/alfaacademy/admin/logo512.png',
  '/alfaacademy/admin/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch new
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback if offline
        return caches.match('/alfaacademy/admin/');
      })
  );
});
