const CACHE_NAME = 'lista-compras-v1';
const ASSETS = [
  './',
  './index.html',
  './offline.html',
  './css/style.css',
  './javascript/app.js',
  './javascript/pwa.js',
  './img/carrinho.png',
  './img/lixeira.png',
  './manifest.json',
  './img/icon-192x192.png',
  './img/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/webfonts/fa-brands-400.woff2'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia de cache: Cache First, então network
self.addEventListener('fetch', (event) => {
  // Ignorar requisições de extensões do navegador e analytics
  if (
    event.request.url.startsWith('chrome-extension://') || 
    event.request.url.includes('google-analytics.com') ||
    event.request.url.includes('googletagmanager.com')
  ) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se o recurso estiver no cache, retorna
        if (response) {
          return response;
        }
        
        // Caso contrário, busca na rede
        return fetch(event.request)
          .then((networkResponse) => {
            // Se a resposta não for válida, apenas retorne
            if (
              !networkResponse || 
              networkResponse.status !== 200 || 
              networkResponse.type !== 'basic' ||
              event.request.method !== 'GET'
            ) {
              return networkResponse;
            }
            
            // Clonar a resposta para armazenar no cache
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return networkResponse;
          })
          .catch(() => {
            // Em caso de erro de rede para solicitações de página HTML, retornar a página offline
            if (event.request.mode === 'navigate') {
              return caches.match('./offline.html');
            }
            
            // Para imagens, tentar buscar uma imagem genérica
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('./img/carrinho.png');
            }
            
            // Para outras solicitações, retornar um erro
            return new Response('Sem conexão com a internet', {
              status: 503,
              statusText: 'Serviço indisponível',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Sincronização em segundo plano
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-listas') {
    event.waitUntil(sincronizarDados());
  }
});

// Função para sincronizar dados quando voltar online
function sincronizarDados() {
  // Aqui você implementaria a lógica para sincronizar dados com um servidor se necessário
  console.log('Sincronização de dados pendentes');
  return Promise.resolve();
}

// Notificações push
self.addEventListener('push', function(event) {
  const title = 'ListaÊ - Lista de Compras';
  const options = {
    body: event.data ? event.data.text() : 'Atualize sua lista de compras!',
    icon: './img/icon-192x192.png',
    badge: './img/icon-192x192.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
}); 