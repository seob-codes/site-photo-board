// 네트워크 우선(network-first): 인터넷이 되면 항상 최신 파일을 먼저 가져오고,
// 안 될 때만 마지막으로 받아둔 캐시를 보여줌 — 그래야 새 버전을 올렸을 때 폰에 자동 반영됨
const CACHE_NAME = 'fb4-cache-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
