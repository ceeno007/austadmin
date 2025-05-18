import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ImageWithSkeleton: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        {...props}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s",
          ...props.style,
        }}
        className={`w-full h-full object-cover ${props.className || ""}`}
      />
    </div>
  );
};

export default ImageWithSkeleton; 