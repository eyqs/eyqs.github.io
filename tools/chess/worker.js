/*global self, caches, fetch*/
(function (self, caches, fetch) {
  var CACHE_VERSION = 2,
    CACHE_NAME = "eyqs-chess-" + CACHE_VERSION.toString();

  self.addEventListener("install", function (event) {
    event.waitUntil(caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll([
          "./",
          "chess.js",
          "chess.css",
        ]);
      })
      .then(function () {
        return self.skipWaiting();
      }));
  });

  self.addEventListener("fetch", function (event) {
    event.respondWith(caches.match(event.request)
      .then(function (response) {
        return response || fetch(event.request);
      }));
  });

  self.addEventListener("activate", function (event) {
    event.waitUntil(caches.keys()
      .then(function (keys) {
        return Promise.all(keys
          .filter(function (key) {
            return key !== CACHE_NAME;
          })
          .map(function (key) {
            return caches.delete(key);
          }));
      })
      .then(function () {
        self.clients.claim();
      }));
  });

}(self, caches, fetch));
