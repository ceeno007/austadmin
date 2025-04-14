import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { addResourceHints, registerServiceWorker } from './utils/performance';

// Add resource hints for faster loading
addResourceHints();

// Register service worker for offline support and caching
registerServiceWorker();

// Create root and render app with Suspense for code splitting
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5500]"></div>
      </div>
    }>
      <App />
    </Suspense>
  </React.StrictMode>
);
