import React, { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { debounce, throttle } from '@/utils/performance';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
  const location = useLocation();

  // Optimize scroll performance
  const handleScroll = useCallback(
    throttle(() => {
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
    }, 100),
    []
  );

  // Optimize resize performance
  const handleResize = useCallback(
    debounce(() => {
      // Update layout calculations
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`
      );
    }, 100),
    []
  );

  // Clean up event listeners and classes on unmount
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Set initial viewport height
    document.documentElement.style.setProperty(
      '--vh',
      `${window.innerHeight * 0.01}px`
    );

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
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

export default PerformanceOptimizer; 