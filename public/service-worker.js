const CACHE_NAME = "my-cache-v1";
const urlsToCache = [
  "/programming-on-internet/public/",
  "/programming-on-internet/public/index.html",
  "/programming-on-internet/public/dashboard.html",
  "/programming-on-internet/public/students.html",
  "/programming-on-internet/public/tasks.html",
  "/programming-on-internet/public/style.css",
  "/programming-on-internet/public/main.js",
  "/programming-on-internet/public/dashboard.js",
  "/programming-on-internet/public/students.js",
  "/programming-on-internet/public/tasks.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch(console.log)
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch(console.log)
  );
});
