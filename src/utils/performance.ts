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

// Service Worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered with scope:', registration.scope);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Performance monitoring
export const measurePerformance = (label: string, callback: () => void) => {
  if (process.env.NODE_ENV === 'development') {
    console.time(label);
    callback();
    console.timeEnd(label);
  } else {
    callback();
  }
};

// Memory usage monitoring (for development)
export const logMemoryUsage = () => {
  if (process.env.NODE_ENV === 'development' && 'performance' in window) {
    const memory = (performance as any).memory;
    if (memory) {
      console.log('Memory usage:', {
        totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576) + 'MB',
        usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576) + 'MB',
        jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576) + 'MB',
      });
    }
  }
};

// Performance monitoring utilities

// Track page load performance
export const trackPageLoad = () => {
  if (window.performance) {
    const timing = window.performance.timing;
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`Page load time: ${pageLoadTime}ms`);
    
    // Log other performance metrics
    console.log(`DOM Content Loaded: ${timing.domContentLoadedEventEnd - timing.navigationStart}ms`);
    console.log(`First Paint: ${performance.getEntriesByType('paint')[0]?.startTime}ms`);
  }
};

interface PerformanceMetric {
  type: string;
  resource: string;
  duration: number;
  timestamp: number;
}

const performanceMetrics: PerformanceMetric[] = [];

/**
 * Tracks the loading time of a resource
 * @param type The type of resource (image, script, style, etc.)
 * @param resource The resource URL or identifier
 * @param duration The loading duration in milliseconds
 */
export const trackResourceLoading = (type: string, resource: string, duration: number): void => {
  performanceMetrics.push({
    type,
    resource,
    duration,
    timestamp: Date.now()
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Resource loaded: ${type} - ${resource} (${duration.toFixed(2)}ms)`);
  }
};

/**
 * Gets all performance metrics
 * @returns Array of performance metrics
 */
export const getPerformanceMetrics = (): PerformanceMetric[] => {
  return [...performanceMetrics];
};

/**
 * Gets performance metrics filtered by type
 * @param type The type of resource to filter by
 * @returns Array of performance metrics for the specified type
 */
export const getPerformanceMetricsByType = (type: string): PerformanceMetric[] => {
  return performanceMetrics.filter(metric => metric.type === type);
};

/**
 * Clears all performance metrics
 */
export const clearPerformanceMetrics = (): void => {
  performanceMetrics.length = 0;
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

    trackResourceLoading('function', name || fn.name, duration);
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    trackResourceLoading('function-error', name || fn.name, duration);
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

// Track React component render performance
export const trackComponentRender = (componentName: string, startTime: number) => {
  const endTime = performance.now();
  const renderTime = endTime - startTime;
  console.log(`Component ${componentName} rendered in ${renderTime}ms`);
};

// Track API request performance
export const trackApiRequest = (url: string, startTime: number) => {
  const endTime = performance.now();
  const requestTime = endTime - startTime;
  console.log(`API request to ${url} took ${requestTime}ms`);
};

// Initialize performance tracking
export const initPerformanceTracking = () => {
  // Track initial page load
  window.addEventListener('load', () => {
    trackPageLoad();
    trackResourceLoading();
  });

  // Track route changes
  let lastRouteChange = performance.now();
  window.addEventListener('popstate', () => {
    const routeChangeTime = performance.now() - lastRouteChange;
    console.log(`Route change took ${routeChangeTime}ms`);
    lastRouteChange = performance.now();
  });
};

// Export a performance monitoring hook for React components
export const usePerformanceMonitoring = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    trackComponentRender(componentName, startTime);
  };
}; 