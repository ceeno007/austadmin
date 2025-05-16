import React, { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { debounce, throttle } from '@/utils/performance';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
  const location = useLocation();
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const isScrollingRef = useRef(false);

  // Optimize scroll performance with RAF
  const handleScroll = useCallback(() => {
    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      requestAnimationFrame(() => {
        // Add will-change to elements in viewport
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.classList.add('will-change-transform');
          } else {
            element.classList.remove('will-change-transform');
          }
        });
        isScrollingRef.current = false;
      });
    }
  }, []);

  // Optimize resize performance
  const handleResize = useCallback(
    debounce(() => {
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          '--vh',
          `${window.innerHeight * 0.01}px`
        );
      });
    }, 100),
    []
  );

  // Add hardware acceleration to main content
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.style.transform = 'translateZ(0)';
      mainContent.style.backfaceVisibility = 'hidden';
      mainContent.style.perspective = '1000px';
      mainContent.style.willChange = 'transform';
    }
  }, []);

  // Clean up event listeners and classes on unmount
  useEffect(() => {
    // Use passive event listeners for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Set initial viewport height
    document.documentElement.style.setProperty(
      '--vh',
      `${window.innerHeight * 0.01}px`
    );

    // Add CSS to prevent white flash
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
      body {
        background-color: #ffffff;
        overflow-x: hidden;
      }
      main {
        transform: translateZ(0);
        will-change: transform;
        backface-visibility: hidden;
        perspective: 1000px;
      }
      .animate-on-scroll {
        will-change: transform, opacity;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.head.removeChild(style);
      // Clean up will-change classes
      document.querySelectorAll('.will-change-transform').forEach((element) => {
        element.classList.remove('will-change-transform');
      });
    };
  }, [handleScroll, handleResize]);

  // Optimize route changes
  useEffect(() => {
    // Preload next route's assets
    const preloadNextRoute = async () => {
      const nextRoute = location.pathname;
      // Add your preloading logic here
    };

    preloadNextRoute();
  }, [location.pathname]);

  return <>{children}</>;
};

export default React.memo(PerformanceOptimizer); 