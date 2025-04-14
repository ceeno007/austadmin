export interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export interface VirtualizationResult {
  startIndex: number;
  endIndex: number;
  offsetY: number;
  visibleItems: number;
}

/**
 * Calculates which items should be visible in a virtualized list
 * @param scrollTop Current scroll position
 * @param totalItems Total number of items in the list
 * @param options Virtualization options
 * @returns Object containing virtualization calculations
 */
export const calculateVirtualization = (
  scrollTop: number,
  totalItems: number,
  options: VirtualizationOptions
): VirtualizationResult => {
  const { itemHeight, containerHeight, overscan = 3 } = options;

  // Calculate the range of items that should be visible
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(
    totalItems - 1,
    startIndex + visibleItems + overscan
  );

  // Calculate the offset to apply to the container
  const offsetY = startIndex * itemHeight;

  return {
    startIndex,
    endIndex,
    offsetY,
    visibleItems
  };
};

/**
 * Creates a memoized version of calculateVirtualization
 * @param options Virtualization options
 * @returns Memoized calculation function
 */
export const createVirtualizationCalculator = (options: VirtualizationOptions) => {
  let lastScrollTop = 0;
  let lastTotalItems = 0;
  let lastResult: VirtualizationResult | null = null;

  return (scrollTop: number, totalItems: number): VirtualizationResult => {
    // Return cached result if inputs haven't changed
    if (
      lastResult &&
      scrollTop === lastScrollTop &&
      totalItems === lastTotalItems
    ) {
      return lastResult;
    }

    // Calculate new result
    const result = calculateVirtualization(scrollTop, totalItems, options);

    // Cache inputs and result
    lastScrollTop = scrollTop;
    lastTotalItems = totalItems;
    lastResult = result;

    return result;
  };
};

/**
 * Estimates the total height of a virtualized list
 * @param totalItems Total number of items
 * @param itemHeight Height of each item
 * @returns Total height in pixels
 */
export const estimateTotalHeight = (totalItems: number, itemHeight: number): number => {
  return totalItems * itemHeight;
}; 