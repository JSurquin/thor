/* PWA hors ligne partiel — actif en prod uniquement (voir RegisterServiceWorker).
   Navigations : réseau d’abord pour du contenu à jour, cache en repli.
   Autres GET : cache d’abord pour assets rapides. */
const CACHE = "thor-static-v2";
const PRECACHE = ["/", "/playground", "/exercices"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(PRECACHE).catch(() => {
        /* certaines origines peuvent refuser une entrée ; on continue */
      })
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          try {
            if (res.ok) {
              const clone = res.clone();
              caches.open(CACHE).then((c) => c.put(event.request, clone));
            }
          } catch {
            /* ignore */
          }
          return res;
        })
        .catch(() =>
          caches
            .match(event.request)
            .then((hit) => hit || caches.match("/") || Response.error())
        )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((hit) => hit || fetch(event.request))
  );
});
