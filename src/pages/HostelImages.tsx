import React, { useState, useEffect, useRef, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, Home, XCircle, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";

// Define the structure of our hostel data
interface Hostel {
  name: string;
  type: string;
  images: string[];
}

const HostelImages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (location.state?.hostel) {
      setHostel(location.state.hostel);
      setLoading(false);
      window.scrollTo(0, 0);
    } else {
      navigate('/hostels', { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hostel) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
        case 'Escape':
          if (fullscreen) {
            setFullscreen(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hostel, fullscreen]);

  const handlePrevImage = () => {
    if (!hostel) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? hostel.images.length - 1 : prevIndex - 1
    );
    setImageLoading(true);
    setImageError(false);
    setRetryCount(0);
  };

  const handleNextImage = () => {
    if (!hostel) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === hostel.images.length - 1 ? 0 : prevIndex + 1
    );
    setImageLoading(true);
    setImageError(false);
    setRetryCount(0);
  };

  const handleGoToIndex = (index: number) => {
    setCurrentIndex(index);
    setImageLoading(true);
    setImageError(false);
    setRetryCount(0);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFullscreen(!fullscreen);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleNextImage();
        } else {
          handlePrevImage();
        }
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    if (retryCount < 2) {
      // Retry loading the image
      setRetryCount(prev => prev + 1);
      setImageLoading(true);
      // Force a re-render by updating the src with a timestamp
      const img = document.querySelector(`img[src*="${hostel?.images[currentIndex]}"]`) as HTMLImageElement;
      if (img) {
        const separator = hostel?.images[currentIndex].includes('?') ? '&' : '?';
        img.src = `${hostel?.images[currentIndex]}${separator}t=${Date.now()}`;
      }
    } else {
      setImageError(true);
      setImageLoading(false);
    }
  };

  const handleRetryImage = () => {
    setRetryCount(0);
    setImageError(false);
    setImageLoading(true);
  };

  useEffect(() => {
    if (fullscreen) {
      document.body.classList.add('fullscreen-active');
    } else {
      document.body.classList.remove('fullscreen-active');
    }
    return () => {
      document.body.classList.remove('fullscreen-active');
    };
  }, [fullscreen]);

  if (loading || !hostel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="aspect-[4/3] w-full rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="p-8"><Skeleton className="h-96 w-full rounded-xl" /></div>}>
      <>
        <SEO 
          title={`${hostel.name} - ${hostel.type} Images | AUST`}
          description={`View images of ${hostel.name} ${hostel.type} accommodation at AUST.`}
          keywords="hostel images, student accommodation, campus housing, AUST hostels"
          url={`${window.location.origin}/hostel-images`}
          type="website"
        />

        <style>{`
          body.fullscreen-active .navbar,
          body.fullscreen-active .footer,
          body.fullscreen-active nav,
          body.fullscreen-active footer {
            display: none !important;
          }
        `}</style>

        {fullscreen ? (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {imageLoading && (
                <Skeleton className="absolute inset-0 bg-gray-800" />
              )}
              {imageError ? (
                <div className="flex flex-col items-center justify-center text-white">
                  <XCircle className="h-8 w-8 mb-2" />
                  <span className="mb-4">Image not available</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetryImage}
                    className="text-white border-white hover:bg-white hover:text-black"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : (
                <img 
                  src={hostel.images[currentIndex]} 
                  alt={`${hostel.name} ${currentIndex + 1}`}
                  className={`max-w-full max-h-full object-contain ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/60 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-lg font-semibold z-20">
                {hostel.name} - {hostel.type}
              </div>
              <button
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors z-30"
                onClick={toggleFullscreen}
                aria-label="Exit fullscreen"
              >
                <Minimize2 className="h-5 w-5 sm:h-7 sm:w-7" />
              </button>
              <button
                className="absolute left-1 sm:left-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#FF5500] rounded-full w-8 h-8 sm:w-16 sm:h-16 flex items-center justify-center shadow-lg transition-all hover:scale-105 z-10"
                onClick={handlePrevImage}
              >
                <ArrowLeft className="h-4 w-4 sm:h-8 sm:w-8" />
              </button>
              <button
                className="absolute right-1 sm:right-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#FF5500] rounded-full w-8 h-8 sm:w-16 sm:h-16 flex items-center justify-center shadow-lg transition-all hover:scale-105 z-10"
                onClick={handleNextImage}
              >
                <ArrowRight className="h-4 w-4 sm:h-8 sm:w-8" />
              </button>
              <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 flex flex-col items-center z-10">
                {/* Dots indicator */}
                <div className="flex justify-center gap-2 mb-2">
                  {hostel.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleGoToIndex(idx)}
                      className={`w-3 h-3 rounded-full border-2 transition-all duration-200 focus:outline-none
                        ${currentIndex === idx ? 'bg-[#FF5500] border-[#FF5500] scale-125 shadow-lg' : 'bg-white border-gray-300 opacity-60 hover:opacity-100'}`}
                      aria-label={`Go to image ${idx + 1}`}
                      style={{ outline: 'none' }}
                    />
                  ))}
                </div>
                <div className="text-xs sm:text-base text-white bg-black/60 px-2 py-1 rounded">
                  {currentIndex + 1} / {hostel.images.length}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-1 sm:px-4 py-2 sm:py-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center mb-4">
                  <Button 
                    variant="ghost" 
                    className="flex items-center text-[#FF5500] hover:bg-[#FF5500]/10 -ml-2 h-10"
                    onClick={() => navigate('/hostels')}
                  >
                    <ChevronLeft className="h-6 w-6 mr-2" />
                    <span className="text-base">Back to Hostels</span>
                  </Button>
                </div>
                {/* Main Image Gallery */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-2 sm:mb-8">
                  <div 
                    className="relative aspect-[3/4] sm:aspect-[16/9] group"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {imageLoading && (
                      <Skeleton className="absolute inset-0 bg-gray-100" />
                    )}
                    {imageError ? (
                      <div className="flex flex-col items-center justify-center h-full bg-gray-100">
                        <XCircle className="h-8 w-8 mb-2 text-gray-400" />
                        <span className="text-gray-400 mb-4">Image not available</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRetryImage}
                          className="text-gray-600 border-gray-400 hover:bg-gray-400 hover:text-white"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      </div>
                    ) : (
                      <img 
                        src={hostel.images[currentIndex]} 
                        alt={`${hostel.name} ${currentIndex + 1}`}
                        className={`w-full h-full object-contain bg-gray-100 ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    )}
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/60 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-lg font-semibold z-20">
                      {hostel.name} - {hostel.type}
                    </div>
                    <button
                      className="absolute top-1 right-1 sm:top-4 sm:right-4 bg-black/70 hover:bg-black/90 text-white p-1.5 sm:p-3 rounded-full transition-colors z-30"
                      onClick={toggleFullscreen}
                      aria-label="Enter fullscreen"
                    >
                      <Maximize2 className="h-4 w-4 sm:h-7 sm:w-7" />
                    </button>
                    {hostel.images.length > 1 && (
                      <>
                        <button
                          className="absolute left-1 sm:left-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#FF5500] rounded-full w-8 h-8 sm:w-16 sm:h-16 flex items-center justify-center shadow-lg transition-all hover:scale-105 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                          onClick={handlePrevImage}
                        >
                          <ArrowLeft className="h-4 w-4 sm:h-8 sm:w-8" />
                        </button>
                        <button
                          className="absolute right-1 sm:right-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#FF5500] rounded-full w-8 h-8 sm:w-16 sm:h-16 flex items-center justify-center shadow-lg transition-all hover:scale-105 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                          onClick={handleNextImage}
                        >
                          <ArrowRight className="h-4 w-4 sm:h-8 sm:w-8" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Thumbnails Grid */}
                <div className="bg-white rounded-lg shadow-lg p-2 sm:p-6">
                  <div className="flex flex-wrap justify-center gap-2 mb-2">
                    {hostel.images.map((image, index) => (
                      <div
                        key={index}
                        onClick={() => handleGoToIndex(index)}
                        className={`cursor-pointer relative border-2 rounded-md transition-all duration-200
                          ${currentIndex === index ? 'border-[#FF5500] scale-110 shadow-lg z-10' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        style={{ width: 56, height: 56, overflow: 'hidden', background: '#f3f3f3' }}
                      >
                        <img
                          src={image}
                          alt={`${hostel.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                          loading="lazy"
                          style={{ display: 'block', width: '100%', height: '100%' }}
                          onError={(e) => {
                            // Fallback for thumbnail errors
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        {currentIndex === index && (
                          <div className="absolute inset-0 border-2 border-[#FF5500] rounded-md pointer-events-none"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-gray-600 mb-1 sm:mb-4 text-xs sm:text-lg">
                    {currentIndex + 1} / {hostel.images.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </Suspense>
  );
};

export default HostelImages;