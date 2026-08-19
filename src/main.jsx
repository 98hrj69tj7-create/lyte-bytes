import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// =====================================================================
// PWA SELF-HEALING: Auto-reloads the app if old JavaScript chunks are 
// cached but no longer exist on the server after a new deployment.
// This prevents users from needing to clear temp files/cache!
// =====================================================================
window.addEventListener('error', (event) => {
  const isChunkError = 
    /loading chunk/i.test(event.message) || 
    /failed to fetch dynamically imported module/i.test(event.message) ||
    /Importing a module script failed/i.test(event.message) ||
    /dynamically imported module/i.test(event.message);

  if (isChunkError) {
    const chunkReloadKey = 'lyte_chunk_reload_ts';
    const lastReload = sessionStorage.getItem(chunkReloadKey);
    const now = Date.now();

    // Prevent infinite reload loops (only auto-reload if not reloaded within 10s)
    if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
      sessionStorage.setItem(chunkReloadKey, now.toString());
      
      // Force page reload, bypassing the browser cache
      window.location.reload(true); 
    }
  }
});

// Register Service Worker for PWA Offline Caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Force the browser to silently check for an updated Service Worker
        // immediately upon load, preventing stale files from lingering.
        registration.update();
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)