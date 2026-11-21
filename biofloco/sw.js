// Tanque Biofloco: funciona sem internet. A página busca a versão nova quando tem sinal; bibliotecas ficam guardadas.
const V="bf-2";
const BASE=["./","manifest.webmanifest","icon-192.png","icon-512.png","jogo/","jogo/manifest.webmanifest",
  "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@500;600;700&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(BASE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(u.hostname.endsWith("supabase.co"))return; // dados: sempre direto na nuvem
  if(u.origin===location.origin){ // app e jogo: rede primeiro, cache se estiver sem sinal (cada página na sua chave)
    const k=u.origin+u.pathname.replace(/index\.html$/,"");
    e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(k,c))}return res}).catch(()=>caches.match(k).then(x=>x||caches.match(r))));return}
  e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const c=res.clone();caches.open(V).then(k=>k.put(r,c))}return res})))});
