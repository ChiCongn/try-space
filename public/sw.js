const CACHE_NAME = "tryspace-v1";
const STATIC_ASSETS = [
  "/",
  "/catalog",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/models/wooden-table-set.png",
  "/models/wooden_table_set-1k.glb"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        const copy = response.clone();
        const isCacheable =
          event.request.url.includes("/models/") ||
          event.request.destination === "image" ||
          event.request.destination === "font";

        if (isCacheable) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }

        return response;
      });
    })
  );
});
