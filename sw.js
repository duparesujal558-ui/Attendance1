/**
 * Service worker — network-first for the page, cache-first for icons.
 *
 * Network-first matters while the app is still changing: a cache-first page
 * keeps serving yesterday's copy for a load or two after every update, which
 * is indistinguishable from a broken app.
 *
 * Offline still works — with no network the cached copy is served, so a
 * classroom with no signal can still take attendance.
 */
var CACHE = 'att-v3-2';
var SHELL = ['./','./index.html','./manifest.json','./icon-192.png',
             './icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(SHELL.map(function (u) {
      return c.add(u).catch(function () { return null; });
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) {
      return k !== CACHE ? caches.delete(k) : null;
    }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  var isPage = req.mode === 'navigate' ||
               (req.headers.get('accept') || '').indexOf('text/html') > -1;

  if (isPage) {
    e.respondWith(fetch(req).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy); });
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        return hit || caches.match('./index.html');
      });
    }));
    return;
  }

  e.respondWith(caches.match(req).then(function (hit) {
    return hit || fetch(req).then(function (res) {
      if (res && res.status === 200 && res.type === 'basic') {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    });
  }));
});
