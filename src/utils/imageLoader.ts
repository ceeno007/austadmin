interface ImageCache {
  [key: string]: HTMLImageElement;
}

const imageCache: ImageCache = {};

/**
 * Preloads a single image and caches it
 * @param src The image source URL
 * @returns Promise that resolves when the image is loaded
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  if (imageCache[src]) {
    return Promise.resolve(imageCache[src]);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache[src] = img;
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Preloads multiple images in parallel
 * @param srcs Array of image source URLs
 * @returns Promise that resolves when all images are loaded
 */
export const preloadImages = (srcs: string[]): Promise<HTMLImageElement[]> => {
  return Promise.all(srcs.map(src => preloadImage(src)));
};

/**
 * Clears the image cache
 */
export const clearImageCache = (): void => {
  Object.keys(imageCache).forEach(key => {
    delete imageCache[key];
  });
};

/**
 * Gets the dimensions of an image without loading it into the DOM
 * @param src The image source URL
 * @returns Promise that resolves with the image dimensions
 */
export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Creates a responsive image URL based on the viewport size
 * @param src The original image source URL
 * @param width The desired width
 * @param height The desired height
 * @returns The responsive image URL
 */
export const getResponsiveImageUrl = (src: string, width: number, height: number, quality: number = 70): string => {
  // If the image is from Cloudinary, modify the URL to include size parameters
  if (src.includes('cloudinary.com')) {
    const baseUrl = src.split('/upload/')[0] + '/upload/';
    const imagePath = src.split('/upload/')[1];
    return `${baseUrl}w_${width},h_${height},q_${quality},c_scale/${imagePath}`;
  }
  
  // If it's a local or server image with a query string
  if (src.includes('?')) {
    return `${src}&w=${width}&h=${height}&q=${quality}`;
  }
  
  // If it's a local or server image without a query string
  return `${src}?w=${width}&h=${height}&q=${quality}`;
}; 