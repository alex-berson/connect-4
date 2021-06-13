const cacheName = 'cache-v1';
const files = [
  'https://alex-berson.github.io/connect-4/',
  'index.html',
  'css/style.css',
  'js/connect4.js',
  'js/move.js',
  'js/ai.js',
  'js/evaluation.js',
  'js/win.js',
  'js/ui.js',
  'js/helpers.js',
  'fonts/RobotoSlab-Regular-webfont.woff',
  'fonts/RobotoSlab-Bold-webfont.woff'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
      cache.addAll(files);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== cacheName)
        .map(key => caches.delete(key))
      )
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
