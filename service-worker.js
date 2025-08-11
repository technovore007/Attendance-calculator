// Enhanced Service Worker for PWA with proper GitHub Pages support
const CACHE_NAME = 'attendance-calculator-v2.1';
const DYNAMIC_CACHE = 'attendance-calculator-dynamic-v2.1';

// Assets to cache - using relative paths for GitHub Pages compatibility
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css', 
  './script.js',
  './manifest.json',
  './icons/favicon.ico',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/icon-152.png',
  './icons/icon-167.png',
  './icons/icon-180.png'
];

// External resources that should be cached
const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Clean up complete');
        // Take control of all clients immediately
        return self.clients.claim();
      })
      .catch(error => {
        console.error('Service Worker: Activation failed:', error);
      })
  );
});

// Fetch event - serve cached content with network fallback
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // Not in cache, fetch from network
        console.log('Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request)
          .then(networkResponse => {
            // Check if response is valid
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response for caching
            const responseToCache = networkResponse.clone();

            // Cache the response for future use
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                // Only cache same-origin requests
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              })
              .catch(error => {
                console.error('Service Worker: Failed to cache dynamic resource:', error);
              });

            return networkResponse;
          })
          .catch(error => {
            console.error('Service Worker: Network request failed:', error);
            
            // If offline and requesting an HTML page, return cached index.html
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
            
            // For other resources, return a generic offline response if needed
            return new Response('Offline - resource unavailable', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
      .catch(error => {
        console.error('Service Worker: Cache match failed:', error);
        return fetch(event.request);
      })
  );
});

// Handle background sync (if supported)
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform background tasks here
      console.log('Service Worker: Performing background sync')
    );
  }
});

// Handle push notifications (if needed in future)
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');
  
  if (event.data) {
    const notificationData = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(notificationData.title || 'Attendance Calculator', {
        body: notificationData.body || 'New notification',
        icon: './icons/icon-192.png',
        badge: './icons/icon-192.png',
        vibrate: [100, 50, 100],
        data: notificationData.data || {},
        actions: notificationData.actions || []
      })
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === self.location.origin && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow('./');
        }
      })
      .catch(error => {
        console.error('Service Worker: Failed to handle notification click:', error);
      })
  );
});

// Handle service worker messages
self.addEventListener('message', event => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
  console.log('Service Worker: Periodic sync triggered:', event.tag);
  
  if (event.tag === 'content-sync') {
    event.waitUntil(
      // Perform periodic sync tasks
      console.log('Service Worker: Performing periodic sync')
    );
  }
});

// Handle unhandled promise rejections
self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker: Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Log service worker errors
self.addEventListener('error', event => {
  console.error('Service Worker: Error occurred:', event.error);
});

console.log('Service Worker: Script loaded successfully');
