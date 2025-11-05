// Service Worker v2.0.0 - Politie Forum Nederland
// Last Updated: November 5, 2025
// Enhanced PWA with offline support, Firebase caching, and push notifications

const CACHE_VERSION = '2.0.0';
const CACHE_NAME = `politie-forum-v${CACHE_VERSION}`;
const OFFLINE_URL = '/offline';
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const DEBUG = false; // Set to true to enable verbose logging in development

// Runtime cache configuration
const RUNTIME_CACHE = {
  images: `${CACHE_NAME}-images`,
  static: `${CACHE_NAME}-static`,
  pages: `${CACHE_NAME}-pages`,
  firebase: `${CACHE_NAME}-firebase`,
};

// Critical assets to cache on install (minimal for fast activation)
const STATIC_CACHE = [
  '/',
  '/offline',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/police_badge_icon_192x192.png',
  '/police_badge_icon_512x512.png',
];

// ============================================================================
// LOGGING HELPERS
// ============================================================================

/**
 * Conditional logging - only logs when DEBUG is true
 */
function log(...args) {
  if (DEBUG) console.log('[SW]', ...args);
}

/**
 * Always log warnings - useful for troubleshooting without verbose mode
 */
function warn(...args) {
  console.warn('[SW]', ...args);
}

/**
 * Always log errors
 */
function error(...args) {
  console.error('[SW]', ...args);
}

/**
 * Filter and log meaningful fetch events (skip noisy/irrelevant ones)
 */
function logFetch(event, category = 'FETCH') {
  if (!DEBUG) return; // Skip if not in debug mode

  const { request } = event;
  const url = new URL(request.url);

  // Skip noisy or irrelevant fetches
  const skip =
    request.mode === 'no-cors' || // opaque requests
    request.url.includes('chrome-extension://') || // browser extensions
    request.url.includes('devtools://') || // devtools
    request.destination === '' || // prefetch or unknown
    url.pathname.startsWith('/_next/static/') || // Next.js static files
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico|css|js|woff2?)$/); // static assets

  if (skip) return;

  console.groupCollapsed(`[SW ${category}] ${request.method} ${url.pathname}`);
  console.log('Mode:', request.mode);
  console.log('Destination:', request.destination);
  console.log('Headers:', {
    accept: request.headers.get('accept'),
    referer: request.headers.get('referer'),
  });
  console.groupEnd();
}

// ============================================================================
// SERVICE WORKER LIFECYCLE
// ============================================================================

// Install event - cache critical assets immediately
self.addEventListener('install', (event) => {
  log('Installing Service Worker v' + CACHE_VERSION);
  log('CACHE_NAME:', CACHE_NAME);
  log('STATIC_CACHE:', STATIC_CACHE);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        log('Cache opened successfully');
        log('Caching static assets:', STATIC_CACHE);
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => {
        log('All static assets cached successfully');
        log('Skipping waiting');
        return self.skipWaiting();
      })
      .catch((err) => {
        error('Install failed:', err);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  log('Activating Service Worker v' + CACHE_VERSION);
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        log('Found caches:', cacheNames);
        return Promise.all(
          cacheNames
            .filter((name) => {
              // Remove old version caches
              const isOldVersion = name.startsWith('politie-forum-') && name !== CACHE_NAME &&
                                 !Object.values(RUNTIME_CACHE).includes(name);
              if (isOldVersion) {
                log('Marked for deletion:', name);
              }
              return isOldVersion;
            })
            .map((name) => {
              log('Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        log('Claiming all clients');
        return self.clients.claim();
      })
      .then(() => {
        log('Service Worker activation complete');
      })
  );
});

// Fetch event - intelligent caching strategies with error recovery
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  logFetch(event, 'FETCH');

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
    log('Using NAVIGATION handler for:', request.url);
    event.respondWith(
      handleNavigationRequest(request).catch(err => {
        error('Navigation handler error:', err);
        return new Response('Navigation Error: ' + err.message, {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      })
    );
    return;
  }

  // Strategy 2: Cache-first for images (performance optimization)
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|webp|avif|svg|gif|ico)$/)) {
    log('Using IMAGE handler for:', request.url);
    event.respondWith(
      handleImageRequest(request).catch(err => {
        error('Image handler error:', err);
        // Return placeholder SVG on error
        return new Response(
          '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#ccc"/></svg>',
          { status: 200, headers: { 'Content-Type': 'image/svg+xml' } }
        );
      })
    );
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
    log('Using STATIC ASSET handler for:', request.url);
    event.respondWith(
      handleStaticAssetRequest(request).catch(err => {
        error('Static asset handler error:', err);
        throw err; // Let network error propagate for CSS/JS
      })
    );
    return;
  }

  // Strategy 4: Network-first with cache fallback for Firebase
  if (url.hostname.includes('firebasedatabase.app') || url.hostname.includes('firebaseapp.com')) {
    log('Using FIREBASE handler for:', request.url);
    event.respondWith(
      handleFirebaseRequest(request).catch(err => {
        error('Firebase handler error:', err);
        throw err;
      })
    );
    return;
  }

  // Default: Network-first with cache fallback
  log('Using DEFAULT handler for:', request.url);
  event.respondWith(
    handleDefaultRequest(request).catch(err => {
      error('Default handler error:', err);
      throw err;
    })
  );
});

// Navigation requests (HTML pages) - Network-first with improved error handling
async function handleNavigationRequest(request) {
  log('handleNavigationRequest START for:', request.url);
  
  try {
    const cache = await caches.open(RUNTIME_CACHE.pages);
    log('Cache opened:', RUNTIME_CACHE.pages);
    
    try {
      // Try network first for fresh content
      log('Attempting network fetch for:', request.url);
      
      const response = await Promise.race([
        fetch(request),
        new Promise((_, reject) => {
          setTimeout(() => {
            warn('Network timeout (10s) for:', request.url);
            reject(new Error('Network timeout after 10s'));
          }, 10000);
        })
      ]);
      
      log('Network response received:', {
        url: request.url,
        status: response?.status,
        ok: response?.ok,
        statusText: response?.statusText
      });
      
      // Only cache successful responses
      if (response && response.ok && response.status === 200) {
        log('Response OK (200), caching:', request.url);
        // Clone before caching to avoid "Response body already read" errors
        cache.put(request, response.clone()).catch(err => {
          warn('Failed to cache navigation response:', err);
        });
      } else {
        warn('Response not OK:', {
          status: response?.status,
          ok: response?.ok,
          url: request.url
        });
      }
      
      log('Returning network response for:', request.url);
      return response;
    } catch (networkError) {
      warn('Network request failed for', request.url, 'Error:', networkError.message);
      
      // Fall back to cache
      log('Attempting cache match for:', request.url);
      const cached = await cache.match(request);
      if (cached) {
        log('Serving cached page:', request.url);
        return cached;
      }
      
      log('No cached page found, trying offline page');
      // Try to serve offline page as last resort
      try {
        const offlinePage = await caches.match(OFFLINE_URL);
        if (offlinePage) {
          log('Serving offline page from', OFFLINE_URL);
          return offlinePage;
        }
        error('Offline page not found in cache');
      } catch (offlineErr) {
        error('Failed to retrieve offline page:', offlineErr);
      }
      
      // Ultimate fallback - return a valid HTTP response, never throw
      warn('Using ultimate fallback - returning 503 response');
      return new Response('Service Unavailable - Offline and no cached version available', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      });
    }
  } catch (err) {
    error('Critical error in handleNavigationRequest:', err);
    
    // Always return a response, never throw from fetch handler
    warn('Critical error fallback - returning 500 response');
    return new Response('Service Worker Error: ' + err.message, {
      status: 500,
      statusText: 'Internal Server Error',
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    });
  }
}

// Image requests - Cache-first with network fallback (9+ minutes stale tolerance)
async function handleImageRequest(request) {
  log('Image request for:', request.url);
  
  try {
    const cache = await caches.open(RUNTIME_CACHE.images);
    const cached = await cache.match(request);
    
    if (cached) {
      log('Serving image from cache:', request.url);
      return cached;
    }
    
    log('Image not in cache, trying network:', request.url);
    
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        log('Image network successful, caching:', request.url);
        // Clone to avoid "Response body already read" errors
        const clonedResponse = response.clone();
        cache.put(request, clonedResponse).catch(err =>
          warn('Failed to cache image:', err)
        );
        return response;
      }
      warn('Image network response not OK:', response?.status, request.url);
      return response;
    } catch (networkError) {
      warn('Image network error:', networkError.message, request.url);
      // Return cached if available
      if (cached) {
        log('Returning stale image cache after network error');
        return cached;
      }
      
      // Return placeholder SVG for failed image loads (never throw)
      log('Returning placeholder SVG for image');
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#0a1931"/><text x="50%" y="50%" text-anchor="middle" fill="#004bbf" font-family="sans-serif" font-size="16">Image unavailable</text></svg>',
        { 
          status: 200,
          headers: { 
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-cache'
          }
        }
      );
    }
  } catch (err) {
    error('Critical error in handleImageRequest:', err);
    
    // Return placeholder instead of throwing
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#0a1931"/></svg>',
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

// Static asset requests (CSS, JS, fonts) - Cache-first with stale-while-revalidate
async function handleStaticAssetRequest(request) {
  try {
    const cache = await caches.open(RUNTIME_CACHE.static);
    const cached = await cache.match(request);
    
    if (cached) {
      // Static assets are immutable (versioned by Next.js), return immediately
      log('Serving static asset from cache:', request.url);
      return cached;
    }
    
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        log('Static asset network successful, caching:', request.url);
        cache.put(request, response.clone()).catch(err =>
          warn('Failed to cache static asset:', err)
        );
      }
      return response;
    } catch (networkError) {
      warn('Static asset network error:', networkError.message);
      // Return cached even if old
      if (cached) {
        log('Returning cached static asset after network error');
        return cached;
      }
      throw networkError;
    }
  } catch (error) {
    error('Error in handleStaticAssetRequest:', error);
    throw error;
  }
}

// Firebase requests - Network-first with cache fallback (for offline support)
async function handleFirebaseRequest(request) {
  try {
    const cache = await caches.open(RUNTIME_CACHE.firebase);
    
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        // Only cache successful GET requests
        log('Firebase network successful, caching:', request.url);
        cache.put(request, response.clone()).catch(err =>
          warn('Failed to cache Firebase response:', err)
        );
      }
      return response;
    } catch (networkError) {
      warn('Firebase network error, attempting cached data:', networkError.message);
      // Use cached Firebase data when offline
      const cached = await cache.match(request);
      if (cached) {
        log('Using cached Firebase data (offline mode)');
        return cached;
      }
      throw networkError;
    }
  } catch (error) {
    error('Error in handleFirebaseRequest:', error);
    throw error;
  }
}

// Default requests - Network-first with cache fallback and error safety
async function handleDefaultRequest(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        log('Default request network successful, caching:', request.url);
        cache.put(request, response.clone()).catch(err =>
          warn('Failed to cache default request:', err)
        );
      }
      return response;
    } catch (networkError) {
      warn('Network error for default request:', request.url);
      const cached = await cache.match(request);
      if (cached) {
        log('Returning cached default request after network error');
        return cached;
      }
      throw networkError;
    }
  } catch (error) {
    error('Error in handleDefaultRequest:', error);
    throw error;
  }
}

// Push notification support
self.addEventListener('push', (event) => {
  log('Push notification received');
  
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
  log('Notification clicked:', event.action);
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
  log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-comments') {
    event.waitUntil(syncComments());
  } else if (event.tag === 'sync-likes') {
    event.waitUntil(syncLikes());
  }
});

async function syncComments() {
  try {
    // TODO: Implement comment sync from IndexedDB to Firebase
    log('Syncing offline comments to Firebase...');
    
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
    error('Comment sync failed:', error);
    throw error;
  }
}

async function syncLikes() {
  try {
    log('Syncing offline likes to Firebase...');
    // TODO: Implement like sync
    return Promise.resolve();
  } catch (error) {
    error('Like sync failed:', error);
    throw error;
  }
}

// Message handler (for communication with main thread)
self.addEventListener('message', (event) => {
  log('Message received:', event.data);
  
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
  error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  error('Unhandled promise rejection:', event.reason);
});

console.log('[SW] Service Worker v' + CACHE_VERSION + ' loaded');
