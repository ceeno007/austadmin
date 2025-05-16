import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, Home, XCircle, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

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
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    // Get the hostel data from location state
    if (location.state?.hostel) {
      setHostel(location.state.hostel);
      setLoading(false);
      // Scroll to top when component mounts
      window.scrollTo(0, 0);
    } else {
      // If there's no hostel data, redirect back to hostels page
      navigate('/hostels', { replace: true });
    }
  }, [location, navigate]);

  // Handle keyboard navigation
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
  };

  const handleNextImage = () => {
    if (!hostel) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === hostel.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleGoToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFullscreen(!fullscreen);
  };

  // Swipe handlers for mobile
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
          handleNextImage(); // swipe left
        } else {
          handlePrevImage(); // swipe right
        }
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Add/remove fullscreen-active class to <body> when fullscreen changes
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
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5500]"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${hostel.name} - ${hostel.type} Images | AUST`}
        description={`View images of ${hostel.name} ${hostel.type} accommodation at AUST.`}
        keywords="hostel images, student accommodation, campus housing, AUST hostels"
        url={`${window.location.origin}/hostel-images`}
        type="website"
      />

      {/* Hide Navbar and Footer in fullscreen mode using a global class */}
      <style>{`
        body.fullscreen-active .navbar,
        body.fullscreen-active .footer,
        body.fullscreen-active nav,
        body.fullscreen-active footer {
          display: none !important;
        }
      `}</style>

      {fullscreen ? (
        // Fullscreen: only render the fullscreen image gallery, no parent wrappers
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="max-w-full max-h-full flex items-center justify-center">
              <img 
                src={hostel.images[currentIndex]} 
                alt={`${hostel.name} ${currentIndex + 1}`}
                className="shadow-lg rounded-sm w-full h-full object-contain"
                style={{ 
                  objectFit: 'contain',
                  width: '100vw',
                  height: '100vh',
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                  display: 'block'
                }}
              />
              {/* Top overlay for hall name */}
              <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-md text-lg font-semibold z-20 max-w-[90vw] md:max-w-[60vw] truncate shadow-lg">
                {hostel.name} - {hostel.type}
              </div>
              {/* Zoom out icon */}
              <button
                className="absolute top-10 right-4 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors z-30 flex items-center justify-center"
                onClick={toggleFullscreen}
                aria-label="Exit fullscreen"
              >
                <Minimize2 className="h-7 w-7" />
              </button>
            </div>
            {/* Navigation arrows */}
            {hostel.images.length > 1 && (
              <>
                <button
                  className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#FF5500] rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center shadow-lg transition-all hover:scale-105 z-10 opacity-100"
                  onClick={handlePrevImage}
                  tabIndex={0}
                >
                  <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                </button>
                <button
                  className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#FF5500] rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center shadow-lg transition-all hover:scale-105 z-10 opacity-100"
                  onClick={handleNextImage}
                  tabIndex={0}
                >
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                </button>
              </>
            )}
            {/* Fullscreen mode image counter */}
            <div className="absolute bottom-28 left-0 right-0 text-center text-white z-10 text-sm md:text-base">
              {currentIndex + 1} / {hostel.images.length}
            </div>
          </div>
        </div>
      ) : (
        // Not fullscreen: render the normal layout
        <div className="flex flex-col min-h-screen">
          <>
            <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10 h-[50px] sm:h-[60px] flex items-center">
              <div className="container mx-auto h-full px-2 flex items-center justify-between">
                {/* Removed home icon section */}
              </div>
            </header>
            {/* Back button below header, always visible */}
            <div className="relative z-20 bg-white pt-[50px] sm:pt-[60px] pb-2">
              <div className="container mx-auto px-2 flex items-center">
                <Button 
                  variant="ghost" 
                  className="flex items-center text-[#FF5500] hover:bg-[#FF5500]/10 h-8 px-2 py-0"
                  onClick={() => navigate('/hostels')}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span className="text-sm">Back</span>
                </Button>
                <h1 className="text-lg font-bold sm:hidden text-center flex-1">
                  {hostel.name} - {hostel.type}
                </h1>
              </div>
            </div>
          </>
          {/* Main content */}
          <main className="flex-grow">
            <div className="w-full h-full">
              {/* Image gallery - Optimized for landscape view */}
              <div 
                className="w-full flex flex-col items-center justify-center bg-gray-100 md:max-w-5xl md:mx-auto"
              >
                {hostel.images.length > 0 ? (
                  <>
                    <div className="w-full aspect-[16/9] relative flex items-center justify-center group"
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <div className="max-w-full max-h-full flex items-center justify-center w-full h-full">
                        <img 
                          src={hostel.images[currentIndex]} 
                          alt={`${hostel.name} ${currentIndex + 1}`}
                          className={`shadow-lg rounded-sm w-full h-full object-contain`}
                          style={{ 
                            objectFit: 'contain',
                            width: '100%',
                            height: '100%',
                            display: 'block'
                          }}
                        />
                        {/* Top overlay for hall name: only show in fullscreen, or on desktop/tablet in non-fullscreen */}
                        {(fullscreen || (!fullscreen && typeof window !== 'undefined' && window.innerWidth >= 640)) && (
                          <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-md text-lg font-semibold z-20 max-w-[90vw] md:max-w-[60vw] truncate shadow-lg">
                            {hostel.name} - {hostel.type}
                          </div>
                        )}
                        {/* Overlay name for mobile: only show in non-fullscreen */}
                        {!fullscreen && (
                          <div className="absolute left-2 right-2 bottom-20 bg-black/60 text-white px-3 py-2 rounded-md text-base font-semibold z-20 text-center truncate shadow">
                            {hostel.name} - {hostel.type}
                          </div>
                        )}
                        {/* Zoom icon button: show Maximize2 when not fullscreen, Minimize2 when fullscreen */}
                        <button
                          className={`absolute top-20 right-6 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors z-40 flex items-center justify-center`}
                          onClick={toggleFullscreen}
                          aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        >
                          {fullscreen ? (
                            <Minimize2 className="h-7 w-7" />
                          ) : (
                            <Maximize2 className="h-7 w-7" />
                          )}
                        </button>
                      </div>
                      {/* Navigation arrows */}
                      {hostel.images.length > 1 && (
                        <>
                          <button
                            className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#FF5500] rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center shadow-lg transition-all hover:scale-105 z-10 opacity-0 group-hover:opacity-100 group-focus:opacity-100"
                            onClick={handlePrevImage}
                            tabIndex={0}
                          >
                            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                          </button>
                          <button
                            className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#FF5500] rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center shadow-lg transition-all hover:scale-105 z-10 opacity-0 group-hover:opacity-100 group-focus:opacity-100"
                            onClick={handleNextImage}
                            tabIndex={0}
                          >
                            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                          </button>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}

                {/* Thumbnails for quick selection - always visible below the main image */}
                {!fullscreen && (
                  <div className="w-full px-2 bg-white pt-2 pb-4 flex flex-col items-center">
                    {/* Image counter */}
                    <div className="text-center text-gray-600 py-1 text-sm md:text-base mb-2">
                      {currentIndex + 1} / {hostel.images.length}
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-1 sm:gap-2 max-w-5xl w-full mt-2">
                      {hostel.images.map((image, idx) => (
                        <button
                          key={idx}
                          className={`relative overflow-hidden rounded-md hover:opacity-90 transition-opacity ${
                            idx === currentIndex ? 'ring-2 ring-[#FF5500]' : ''
                          }`}
                          style={{ aspectRatio: '16/9' }} 
                          onClick={() => handleGoToIndex(idx)}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default HostelImages;