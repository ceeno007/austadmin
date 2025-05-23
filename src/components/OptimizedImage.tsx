import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  ...props
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  
  // Generate WebP URL if the source is a local image
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.startsWith('http')) {
      // For external images, use as is
      return originalSrc;
    }
    // For local images, assume they're in the public directory
    // You would need to set up a build process to generate WebP versions
    const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return webpSrc;
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  if (error) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400">Image not available</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <Skeleton 
          className={`absolute inset-0 ${className}`}
        />
      )}
      <picture>
        <source
          srcSet={getOptimizedSrc(src)}
          type="image/webp"
        />
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoad}
          onError={handleError}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          {...props}
        />
      </picture>
    </div>
  );
};

export default React.memo(OptimizedImage); 