// Service Worker v2.0.0 - Politie Forum Nederland
// Last Updated: November 5, 2025
// Enhanced PWA with offline support, Firebase caching, and push notifications

const CACHE_VERSION = '2.0.0';
const CACHE_NAME = `politie-forum-v${CACHE_VERSION}`;
const OFFLINE_URL = '/offline';
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Critical assets to cache on install (minimal for fast activation)
const STATIC_CACHE = [
  '/',
  '/offline',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/police_badge_icon_192x192.png',
  '/police_badge_icon_512x512.png',
];

// Runtime cache configuration
const RUNTIME_CACHE = {
  images: `${CACHE_NAME}-images`,
  static: `${CACHE_NAME}-static`,
  pages: `${CACHE_NAME}-pages`,
  firebase: `${CACHE_NAME}-firebase`,
};

// Install event - cache critical assets immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v' + CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching critical assets');
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => {
        console.log('[SW] Skip waiting - activate immediately');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Install failed:', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v' + CACHE_VERSION);
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // Remove old version caches
              return name.startsWith('politie-forum-') && name !== CACHE_NAME &&
                     !Object.values(RUNTIME_CACHE).includes(name);
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming all clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extensions and DevTools
  if (url.protocol === 'chrome-extension:' || url.protocol === 'devtools:') {
    return;
  }

  // Skip cross-origin requests (except Firebase, Google Fonts, and CDNs)
  const allowedOrigins = [
    location.origin,
    'firebasedatabase.app',
    'googleapis.com',
    'gstatic.com',
    'vercel.app',
  ];
  
  const isAllowedOrigin = allowedOrigins.some(origin => url.hostname.includes(origin));
  if (!isAllowedOrigin) {
    return;
  }

  // Skip Firebase Auth (requires fresh tokens)
  if (url.pathname.includes('/__/auth/') || url.pathname.includes('/auth/')) {
    return;
  }

  // Skip API routes that need fresh data
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Strategy 1: Network-first for HTML pages (always fresh content)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Strategy 2: Cache-first for images (performance optimization)
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|webp|avif|svg|gif|ico)$/)) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Strategy 3: Cache-first for static assets (CSS, JS, fonts)
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.match(/\.(css|js|woff2|woff|ttf|otf)$/)
  ) {
    event.respondWith(handleStaticAssetRequest(request));
    return;
  }

  // Strategy 4: Network-first with cache fallback for Firebase
  if (url.hostname.includes('firebasedatabase.app') || url.hostname.includes('firebaseapp.com')) {
    event.respondWith(handleFirebaseRequest(request));
    return;
  }

  // Default: Network-first with cache fallback
  event.respondWith(handleDefaultRequest(request));
});

// Navigation requests (HTML pages) - Network-first
async function handleNavigationRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE.pages);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Cache successful page responses
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Try cache first, then offline page
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    const offlinePage = await caches.match(OFFLINE_URL);
    if (offlinePage) {
      return offlinePage;
    }
    
    // Ultimate fallback
    return new Response('Offline - No cached version available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Image requests - Cache-first with network fallback
async function handleImageRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE.images);
  const cached = await cache.match(request);
  
  if (cached) {
    // Check if cache is stale (older than 7 days)
    const cacheDate = cached.headers.get('sw-cache-date');
    if (cacheDate) {
      const age = Date.now() - new Date(cacheDate).getTime();
      if (age < CACHE_MAX_AGE) {
        return cached;
      }
    } else {
      return cached; // No date header, assume valid
    }
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Add cache date header
      const clonedResponse = response.clone();
      const headers = new Headers(clonedResponse.headers);
      headers.set('sw-cache-date', new Date().toISOString());
      
      const newResponse = new Response(await clonedResponse.blob(), {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        headers: headers
      });
      
      cache.put(request, newResponse.clone());
      return newResponse;
    }
    return response;
  } catch (error) {
    // Return cached if available
    if (cached) {
      return cached;
    }
    
    // Return placeholder SVG for failed image loads
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#0a1931"/><text x="50%" y="50%" text-anchor="middle" fill="#004bbf" font-family="sans-serif" font-size="16">Afbeelding niet beschikbaar</text></svg>',
      { 
        status: 200,
        headers: { 
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

// Static asset requests (CSS, JS, fonts) - Cache-first with long TTL
async function handleStaticAssetRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE.static);
  const cached = await cache.match(request);
  
  if (cached) {
    // Static assets are immutable (versioned by Next.js)
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return cached if available
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Firebase requests - Network-first with cache fallback (for offline support)
async function handleFirebaseRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE.firebase);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Only cache successful GET requests
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Use cached Firebase data when offline
    const cached = await cache.match(request);
    if (cached) {
      console.log('[SW] Using cached Firebase data (offline mode)');
      return cached;
    }
    throw error;
  }
}

// Default requests - Network-first with cache fallback
async function handleDefaultRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Push notification support
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let notificationData = {
    title: 'Politie Forum Nederland',
    body: 'Nieuw bericht op Politie Forum Nederland',
    icon: '/police_badge_icon_192x192.png',
    badge: '/police_badge_icon_64x64.png',
    url: '/',
  };

  // Parse push data if available
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    vibrate: [200, 100, 200],
    tag: notificationData.tag || 'default',
    requireInteraction: false,
    data: {
      url: notificationData.url,
      timestamp: Date.now(),
    },
    actions: [
      {
        action: 'open',
        title: 'Bekijken',
        icon: '/police_badge_icon_64x64.png',
      },
      {
        action: 'close',
        title: 'Sluiten',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if already open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync support (for offline comment posting)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-comments') {
    event.waitUntil(syncComments());
  } else if (event.tag === 'sync-likes') {
    event.waitUntil(syncLikes());
  }
});

async function syncComments() {
  try {
    // TODO: Implement comment sync from IndexedDB to Firebase
    console.log('[SW] Syncing offline comments to Firebase...');
    
    // Example implementation:
    // const db = await openIndexedDB();
    // const comments = await db.getAll('pending-comments');
    // for (const comment of comments) {
    //   await fetch('/api/comments', {
    //     method: 'POST',
    //     body: JSON.stringify(comment),
    //   });
    // }
    
    return Promise.resolve();
  } catch (error) {
    console.error('[SW] Comment sync failed:', error);
    throw error;
  }
}

async function syncLikes() {
  try {
    console.log('[SW] Syncing offline likes to Firebase...');
    // TODO: Implement like sync
    return Promise.resolve();
  } catch (error) {
    console.error('[SW] Like sync failed:', error);
    throw error;
  }
}

// Message handler (for communication with main thread)
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  } else if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => {
        return Promise.all(names.map((name) => caches.delete(name)));
      })
    );
  }
});

// Error handler
self.addEventListener('error', (event) => {
  console.error('[SW] Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] Service Worker v' + CACHE_VERSION + ' loaded');
