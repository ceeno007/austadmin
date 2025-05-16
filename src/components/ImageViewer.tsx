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
      className="fixed inset-0 bg-black/90 z-[10001] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
        <img 
          src={imageUrl} 
          alt="Zoomed view" 
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
        <button 
          className="absolute top-2 right-2 bg-[#FF5500] text-white p-2 rounded-full shadow-lg hover:bg-[#e64d00] transition-colors z-10"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
        {hasPrevious && onPrevious && (
          <button 
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 text-[#FF5500] p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); onPrevious(); }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {hasNext && onNext && (
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 text-[#FF5500] p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageViewer; 