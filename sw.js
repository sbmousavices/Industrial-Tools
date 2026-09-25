const CACHE_NAME = 'bm-planning-v2';
const OFFLINE_PAGE = '/Industrial-Tools/offline.html';

const urlsToCache = [
  '/Industrial-Tools/',
  '/Industrial-Tools/index.html',
  '/Industrial-Tools/hub.html',
  '/Industrial-Tools/Community.html',
  '/Industrial-Tools/offline.html',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching core files');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Service Worker: Cache failed', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // اصلاح شده: اجازه کش کردن منابع CORS (مثل CDN ها)
        if (!response || response.status !== 200) return response;
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // حالت آفلاین
        if (event.request.mode === 'navigate' || event.request.destination === 'document') {
          return caches.match(OFFLINE_PAGE);
        }
        return caches.match(event.request);
      })
  );
});
