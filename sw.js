// ============================================================
// Service Worker - 投資シミュレーター PWA
// ============================================================

const CACHE_NAME = 'finance-sim-v3';
const ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/data.js',
    '/js/diagnosis.js',
    '/js/simulator.js',
    '/js/education.js',
    '/js/quiz.js',
    '/manifest.json'
];

// Install: cache app shell
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch: network-first with cache fallback
self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request)
            .then(response => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                return response;
            })
            .catch(() => caches.match(e.request))
    );
});
