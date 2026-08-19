// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically activates new service worker on deploy
      injectRegister: 'auto',
      workbox: {
        cleanupOutdatedCaches: true, // Automatically deletes old hashed chunk caches
        skipWaiting: true,           // Forces newly installed SW to take control immediately
        clientsClaim: true,          // Makes SW take control of all open client tabs instantly
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}']
      }
    })
  ]
});