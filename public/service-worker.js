// define the files to store in the browser cache memory

const resources = [
    "./index.html",
    "./css/styles.css",
    "./js/idb.js",
    "./js/index.js",
  ];
  
  const APP_PREFIX = "BudgetTracker-";
  const VERSION = "v_1.0";
  const CACHE_NAME = APP_PREFIX + VERSION;
  
  // install by first opening the cache and give a cache name, then addAll resources
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
          console.log(cache);
          return cache.addAll(resources);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
      console.log("fetch request : " + event.request.url);
      event.respondWith(
          caches.match(event.request).then((request) => {
              if (request) {
                  console.log(`Responding with ${event.request.url} cache`)
                  return request
              } else {
                  console.log(`No cached resource found, fetching ${event.request.url}`)
                  return fetch(event.request)
              }
          })
      )
  })
  // console.log(caches.keys())