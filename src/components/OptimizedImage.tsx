import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { getResponsiveImageUrl } from '@/utils/imageLoader';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width = 800,
  height = 600,
  quality = 70,
  ...props
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  
  // Generate optimized image URL based on screen size
  useEffect(() => {
    // First determine if we need small or large image based on screen width
    const screenWidth = window.innerWidth;
    let imageWidth = width;
    let imageHeight = height;
    
    // Scale down image size for mobile devices
    if (screenWidth < 768) {
      imageWidth = Math.min(screenWidth, width / 2);
      imageHeight = Math.round((imageWidth * height) / width);
    }
    
    // Apply responsive image URL with quality parameter
    const optimizedSrc = getResponsiveImageUrl(src, imageWidth, imageHeight, quality);
    setCurrentSrc(optimizedSrc);
  }, [src, width, height, quality]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    // If the optimized URL fails, try the original as fallback
    if (currentSrc !== src) {
      setCurrentSrc(src);
    }
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
          srcSet={currentSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
          type="image/webp"
        />
        <img
          src={currentSrc}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
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