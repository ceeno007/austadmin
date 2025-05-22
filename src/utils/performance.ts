/**
 * Performance optimization utilities
 * This file contains functions to improve the performance of the application
 */

import React from 'react';

// Image preloading utility
export const preloadImage = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Skip if already cached
    if (imageCache[src]) {
      resolve(true);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      imageCache[src] = true;
      resolve(true);
    };
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = async (sources: string[]): Promise<boolean[]> => {
  const promises = sources.map(src => preloadImage(src));
  return Promise.all(promises);
};

// Image cache
export const imageCache: Record<string, boolean> = {};

// Debounce function to limit how often a function can be called
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function to limit how often a function can be called
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Lazy load component with React.lazy
export const lazyLoad = (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
  return React.lazy(() => importFn());
};

// Intersection Observer utility for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = { threshold: 0.1 }
): IntersectionObserver => {
  return new IntersectionObserver(callback, options);
};

// Resource hints for preloading critical resources
export const addResourceHints = () => {
  // Add preconnect for external domains
  const preconnectLinks = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];
  
  preconnectLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
  
  // Add preload for critical assets
  const preloadLinks = [
    // Add critical CSS, JS, or image files here
  ];
  
  preloadLinks.forEach(({ href, as }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  });
};

// Register service worker
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          // console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
};

// Track memory usage
export const trackMemoryUsage = () => {
  if ('memory' in performance) {
    setInterval(() => {
      const memory = (performance as any).memory;
      // console.log('Memory usage:', {
      //   usedJSHeapSize: formatBytes(memory.usedJSHeapSize),
      //   totalJSHeapSize: formatBytes(memory.totalJSHeapSize),
      //   jsHeapSizeLimit: formatBytes(memory.jsHeapSizeLimit)
      // });
    }, 10000);
  }
};

// Track page load performance
export const trackPageLoad = () => {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const timing = performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      
      // console.log(`Page load time: ${pageLoadTime}ms`);
      
      // Log key metrics
      // console.log(`DOM Content Loaded: ${timing.domContentLoadedEventEnd - timing.navigationStart}ms`);
      // console.log(`First Paint: ${performance.getEntriesByType('paint')[0]?.startTime}ms`);
    }, 0);
  });
};

// Track resource loading
export const trackResourceLoading = () => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach(entry => {
      const resource = entry.name.split('/').pop();
      let type = 'Other';
      
      if (entry.name.endsWith('.js')) type = 'JavaScript';
      else if (entry.name.endsWith('.css')) type = 'CSS';
      else if (entry.name.endsWith('.png') || entry.name.endsWith('.jpg') || 
               entry.name.endsWith('.gif') || entry.name.endsWith('.webp')) type = 'Image';
      else if (entry.name.endsWith('.woff') || entry.name.endsWith('.woff2')) type = 'Font';
      else if (entry.name.includes('api')) type = 'API';
      
      const duration = entry.duration;
      if (duration > 1000) {
        // console.log(`Resource loaded: ${type} - ${resource} (${duration.toFixed(2)}ms)`);
      }
    });
  });
  
  observer.observe({entryTypes: ['resource']});
};

// Track component render time
export const trackComponentRender = (componentName: string, callback: () => void) => {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  const renderTime = endTime - startTime;
  
  if (renderTime > 50) {
    // console.log(`Component ${componentName} rendered in ${renderTime}ms`);
  }
};

// Track API request time
export const trackApiRequest = (url: string, callback: () => Promise<any>) => {
  const startTime = performance.now();
  return callback().then(result => {
    const endTime = performance.now();
    const requestTime = endTime - startTime;
    
    // console.log(`API request to ${url} took ${requestTime}ms`);
    return result;
  });
};

// Track route changes
export let lastRouteChange = 0;
export const trackRouteChange = () => {
  const now = performance.now();
  const routeChangeTime = lastRouteChange > 0 ? now - lastRouteChange : 0;
  lastRouteChange = now;
  
  if (routeChangeTime > 0) {
    // console.log(`Route change took ${routeChangeTime}ms`);
  }
};

// Track resource loading performance metrics
interface PerformanceMetric {
  type: string;
  resource: string;
  duration: number;
  timestamp: number;
}

// Store performance metrics in memory
const performanceMetrics: PerformanceMetric[] = [];

/**
 * Track resource loading performance
 * @param type The type of resource (JS, CSS, Image, etc.)
 * @param resource The resource name or identifier
 * @param duration The loading duration in milliseconds
 */
// Function removed to avoid duplicate declaration

// Get all performance metrics
export const getPerformanceMetrics = (): PerformanceMetric[] => {
  return [...performanceMetrics];
};

/**
 * Measures the execution time of a function
 * @param fn The function to measure
 * @param name Optional name for the measurement
 * @returns The result of the function
 */
export const measureExecutionTime = async <T>(fn: () => Promise<T>, name?: string): Promise<T> => {
  const startTime = performance.now();
  try {
    const result = await fn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log execution time
    if (name) {
      // Comment out the logging
      // trackResourceLoading('Function', name, duration);
    }
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log execution error
    if (name) {
      // Comment out the logging
      // trackResourceLoading('Function Error', name, duration);
    }
    
    throw error;
  }
};

/**
 * Reports performance metrics to an analytics service
 * @param endpoint The endpoint to send metrics to
 */
export const reportPerformanceMetrics = async (endpoint: string): Promise<void> => {
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(performanceMetrics),
    });
  } catch (error) {
    console.error('Failed to report performance metrics:', error);
  }
};

// Export a performance monitoring hook for React components
export const usePerformanceMonitoring = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    trackComponentRender(componentName, () => {});
  };
}; 