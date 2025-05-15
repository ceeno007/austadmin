import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageViewerProps {
  imageUrl: string;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ 
  imageUrl, 
  onClose, 
  onNext, 
  onPrevious, 
  hasNext = false, 
  hasPrevious = false 
}) => {
  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 bg-[#FF5500] text-white p-2 rounded-full flex items-center justify-center shadow-md hover:bg-[#e64d00] transition-colors"
        onClick={onClose}
      >
        <X className="h-8 w-8" />
      </button>
      
      {hasPrevious && onPrevious && (
        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FF5500] text-white p-2 rounded-full flex items-center justify-center shadow-md hover:bg-[#e64d00] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}
      
      {hasNext && onNext && (
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#FF5500] text-white p-2 rounded-full flex items-center justify-center shadow-md hover:bg-[#e64d00] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}
      
      <img 
        src={imageUrl} 
        alt="Zoomed view" 
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ImageViewer; 