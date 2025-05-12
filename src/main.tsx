import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { addResourceHints, registerServiceWorker } from './utils/performance';

// Add resource hints for faster loading
addResourceHints();

// Register service worker for offline support and caching
registerServiceWorker();

// Create root and render app
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
