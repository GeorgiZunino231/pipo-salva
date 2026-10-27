// Pipo — service worker simple: con internet usa siempre la versión nueva; sin internet abre la última guardada.
var CACHE = 'pipo-offline-v1';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(function(res){
      if (res && res.ok && !url.search) {
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copy); });
      }
      return res;
    }).catch(function(){
      return caches.match(req, {ignoreSearch: true}).then(function(r){
        return r || caches.match(self.registration.scope) || caches.match('index.html');
      });
    })
  );
});
