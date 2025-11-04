// Service Worker for offline caching and performance optimization
// Version 2.0.0 - Enhanced with network-first for HTML, cache-first for assets

const CACHE_VERSION = 'v3';
const CACHE_NAME = `pforum-cache-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;

// Resources to precache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/police_badge_icon_64x64.png',
  '/police_badge_icon_192x192.png',
  '/police_badge_icon_512x512.png',
  '/favicon.ico',
  '/offline.html', // Offline fallback page
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v2...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets');
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name.startsWith('pforum-cache-') &&
              name !== CACHE_NAME &&
              name !== STATIC_CACHE &&
              name !== IMAGE_CACHE &&
              name !== API_CACHE
            );
          })
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - smart caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Firebase, external API calls, and user avatars (must be fresh)
  if (
    url.hostname.includes('firebaseapp.com') ||
    url.hostname.includes('firebasedatabase.app') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('google-analytics.com') ||
    url.hostname.includes('googletagmanager.com') ||
    url.hostname.includes('googleusercontent.com') ||
    url.hostname.includes('gravatar.com')
  ) {
    return;
  }

  // HTML pages → Network first (always get latest version)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache, then offline page
          return caches.match(request).then((cached) => {
            return cached || caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // Static assets (JS, CSS, images, fonts) → Cache first
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|avif|svg|woff2|ttf|ico)$/) ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone();
              const cacheName = request.destination === 'image' ? IMAGE_CACHE : STATIC_CACHE;
              caches.open(cacheName).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
        );
      })
    );
    return;
  }

  // Default: Network only (for API calls, etc.)
  event.respondWith(fetch(request));
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-comments') {
    event.waitUntil(syncComments());
  }
});

async function syncComments() {
  // Implement comment sync logic if needed
  console.log('Syncing offline comments...');
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Politie Forum Nederland';
  const options = {
    body: data.body || 'Nieuw bericht op het forum',
    icon: '/police_badge_icon_192x192.png',
    badge: '/police_badge_icon_64x64.png',
    tag: data.tag || 'notification',
    data: data.url || '/',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});
