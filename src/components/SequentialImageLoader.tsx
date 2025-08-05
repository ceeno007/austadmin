import React, { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Global queue for sequential loading
let imageLoadQueue: (() => void)[] = [];
let isProcessingQueue = false;

// Process one image at a time from the queue
const processNextInQueue = () => {
  if (imageLoadQueue.length === 0) {
    isProcessingQueue = false;
    return;
  }

  isProcessingQueue = true;
  const loadNextImage = imageLoadQueue.shift();
  
  if (loadNextImage) {
    loadNextImage();
  }
};

interface SequentialImageLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  index: number; // Used for priority
  scrollDirection?: 'up' | 'down' | null;
}

const SequentialImageLoader: React.FC<SequentialImageLoaderProps> = ({ 
  src, 
  alt, 
  className, 
  index,
  scrollDirection = 'down',
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [queued, setQueued] = useState(false);
  const [actualSrc, setActualSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Add image load task to the queue
  const addToLoadQueue = () => {
    if (queued || actualSrc) return;
    
    setQueued(true);
    
    // Create a load task function
    const loadTask = () => {
      // Set the actual source to trigger the image loading
      setActualSrc(src);
      
      // Start loading the next image after a small delay
      // to prevent simultaneous loading
      setTimeout(() => {
        processNextInQueue();
      }, 300); // 300ms delay between each image load
    };
    
    // Add to queue based on scroll direction priority
    if (scrollDirection === 'up') {
      imageLoadQueue.unshift(loadTask); // Add to beginning if scrolling up
    } else {
      imageLoadQueue.push(loadTask); // Add to end if scrolling down
    }
    
    // Start processing the queue if not already in progress
    if (!isProcessingQueue) {
      processNextInQueue();
    }
  };

  // Set up intersection observer
  useEffect(() => {
    if (!src) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isVisible = entry.isIntersecting;
        
        setInView(isVisible);
        
        if (isVisible && !actualSrc && !queued) {
          addToLoadQueue();
        }
      },
      {
        rootMargin: '200px', // Start loading a bit before they come into view
        threshold: 0.1,
      }
    );
    
    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      // Remove from queue if component unmounts before loading
      if (queued && !actualSrc) {
        imageLoadQueue = imageLoadQueue.filter(task => task !== addToLoadQueue);
      }
    };
  }, [src, queued, actualSrc]);

  // Handle image load completion
  const handleImageLoaded = () => {
    setLoaded(true);
  };

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <div ref={imgRef} className="w-full h-full">
        {actualSrc && (
          <img
            {...props}
            src={actualSrc}
            alt={alt}
            onLoad={handleImageLoaded}
            style={{
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.3s",
              ...props.style,
            }}
            className={`w-full h-full object-cover ${className || ""}`}
          />
        )}
      </div>
    </div>
  );
};

export default SequentialImageLoader; 