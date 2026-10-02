/* ============ KARDAM — Service Worker ============ */
const CACHE_NAME = 'kardam-v7';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './css/post-pin.css',
  './css/registration-flow.css',
  './css/daywell-polish.css',
  './css/main-reference-polish.css',
  './css/language-and-profile-polish.css',
  './css/calm-glass.css',
  './js/data.js',
  './js/storage.js',
  './js/auth.js',
  './js/app.js',
  './js/main-interface.js',
  './js/duress-interface.js',
  './js/chat.js',
  './js/journal.js',
  './js/peer.js',
  './js/emergency.js',
  './js/duress.js',
  './js/init.js',
  './manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
