import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { preloadImages, getResponsiveImageUrl } from '../utils/imageLoader';
import { createVirtualizationCalculator, VirtualizationOptions } from '../utils/virtualization';

interface OptimizedListOptions extends VirtualizationOptions {
  preloadCount?: number;
  imageWidth?: number;
  imageHeight?: number;
}

interface ListItem {
  id: string | number;
  imageUrl?: string;
  [key: string]: any;
}

interface UseOptimizedListProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  preloadCount?: number;
  overscan?: number;
}

interface UseOptimizedListResult {
  optimizedVisibleItems: any[];
  totalHeight: number;
  offsetY: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useOptimizedList = ({
  items,
  itemHeight,
  containerHeight,
  preloadCount = 5,
  overscan = 3
}: UseOptimizedListProps): UseOptimizedListResult => {
  const [scrollTop, setScrollTop] = useState(0);
  const [optimizedVisibleItems, setOptimizedVisibleItems] = useState<any[]>([]);
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Calculate total height of the list
  const totalHeight = items.length * itemHeight;

  // Calculate which items are visible based on scroll position
  const calculateVisibleItems = () => {
    if (!containerRef.current) return;

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems = items.slice(startIndex, endIndex);
    setOptimizedVisibleItems(visibleItems);
    setOffsetY(startIndex * itemHeight);
  };

  // Set up scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Recalculate visible items when scroll position changes
  useEffect(() => {
    calculateVisibleItems();
  }, [scrollTop, items, itemHeight, containerHeight, overscan]);

  // Preload images for visible items
  useEffect(() => {
    if (!optimizedVisibleItems.length) return;

    const preloadImages = () => {
      optimizedVisibleItems.forEach(item => {
        if (item.image) {
          const img = new Image();
          img.src = typeof item.image === 'string' ? item.image : item.image.src;
        }
      });
    };

    preloadImages();
  }, [optimizedVisibleItems]);

  return {
    optimizedVisibleItems,
    totalHeight,
    offsetY,
    containerRef
  };
};

export const useOptimizedListOld = (
  items: ListItem[],
  options: OptimizedListOptions
) => {
  const {
    itemHeight,
    containerHeight,
    overscan = 3,
    preloadCount = 5,
    imageWidth = 800,
    imageHeight = 600
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create memoized virtualization calculator
  const calculateVirtualization = useCallback(
    createVirtualizationCalculator({ itemHeight, containerHeight, overscan }),
    [itemHeight, containerHeight, overscan]
  );

  // Calculate visible items
  const { startIndex, endIndex, offsetY, visibleItems } = calculateVirtualization(
    scrollTop,
    items.length
  );

  // Get visible items
  const visibleItemsData = items.slice(startIndex, endIndex + 1);

  // Handle scroll events
  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  // Preload images for visible items and next batch
  useEffect(() => {
    const preloadNextBatch = async () => {
      const nextBatchStart = Math.min(endIndex + 1, items.length - 1);
      const nextBatchEnd = Math.min(
        nextBatchStart + preloadCount,
        items.length
      );
      
      const nextBatchUrls = items
        .slice(nextBatchStart, nextBatchEnd)
        .map(item => getResponsiveImageUrl(item.imageUrl, imageWidth, imageHeight));

      await preloadImages(nextBatchUrls);
    };

    preloadNextBatch();
  }, [endIndex, items, preloadCount, imageWidth, imageHeight]);

  // Initial image preloading
  useEffect(() => {
    const preloadInitialImages = async () => {
      setIsLoading(true);
      
      const initialUrls = items
        .slice(0, preloadCount)
        .map(item => getResponsiveImageUrl(item.imageUrl, imageWidth, imageHeight));

      await preloadImages(initialUrls);
      setIsLoading(false);
    };

    preloadInitialImages();
  }, [items, preloadCount, imageWidth, imageHeight]);

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return {
    containerRef,
    visibleItemsData,
    offsetY,
    isLoading,
    totalHeight: items.length * itemHeight
  };
}; 