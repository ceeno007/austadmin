import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/SEO";
import { programs, type Program } from "@/data/programs";

// Constants
const TABS = {
  UNDERGRADUATE: 'undergraduate',
  POSTGRADUATE: 'postgraduate',
  FOUNDATION: 'foundation'
} as const;

const ITEMS_PER_PAGE = 6;

type TabType = typeof TABS[keyof typeof TABS];

// Create loading fallback component
const ProgramsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[1,2,3].map(i => (
      <Skeleton key={i} className="h-[400px] w-full" />
    ))}
  </div>
);

const Programs: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>(TABS.UNDERGRADUATE);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Effect for URL params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get("tab") as TabType;
    if (tabParam && Object.values(TABS).includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Reset visible items when tab changes
  useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE);
  }, [activeTab]);

  // Get current programs based on active tab
  const getCurrentPrograms = (): Program[] => {
    switch (activeTab) {
      case TABS.UNDERGRADUATE:
        return programs.filter(p => p.level === "Undergraduate");
      case TABS.POSTGRADUATE:
        return programs.filter(p => p.level === "Postgraduate");
      case TABS.FOUNDATION:
        return programs.filter(p => p.category === "foundation" || p.category === "jupeb");
      default:
        return [];
    }
  };

  // Handle scroll event
  const handleScroll = useCallback(() => {
    if (isLoading) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const threshold = 100; // pixels from bottom

    if (scrollPosition >= documentHeight - threshold) {
      const currentPrograms = getCurrentPrograms();
      if (visibleItems < currentPrograms.length) {
        setIsLoading(true);
        // Simulate loading delay
        setTimeout(() => {
          setVisibleItems(prev => Math.min(prev + ITEMS_PER_PAGE, currentPrograms.length));
          setIsLoading(false);
        }, 500);
      }
    }
  }, [visibleItems, isLoading, activeTab]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Generate structured data for programs
  const generateStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": getCurrentPrograms().map((program, index) => ({
      "@type": "EducationalProgram",
      "name": program.title,
      "description": program.description,
      "provider": {
        "@type": "CollegeOrUniversity",
        "name": "African University of Science and Technology"
      },
      "timeToComplete": program.duration,
      "educationalProgramMode": "full-time",
      "position": index + 1
    }))
  });

  const ProgramCard: React.FC<{ program: Program }> = ({ program }) => {
    const navigate = useNavigate();

    const handleViewDetails = (e: React.MouseEvent) => {
      e.preventDefault();
      navigate(`/programs/${program.id}`);
    };

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative aspect-[16/9]">
          <img
            src={program.image}
            alt={program.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-semibold mb-1">{program.title}</h3>
            <p className="text-sm opacity-90">{program.duration}</p>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-600 mb-4 line-clamp-2">{program.description}</p>
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              className="border-[#FF5500] text-[#FF5500] hover:bg-[#FF5500] hover:text-white transition-all duration-200 ease-in-out"
              onClick={handleViewDetails}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const currentPrograms = getCurrentPrograms();
  const displayedPrograms = currentPrograms.slice(0, visibleItems);

  return (
    <Suspense fallback={<ProgramsSkeleton />}>
      <SEO 
        title="Academic Programs | AUST"
        description="Explore AUST's comprehensive range of undergraduate, postgraduate, and foundation programs in science, technology, and business. Find your path to success with our world-class education."
        keywords="AUST programs, undergraduate degrees, postgraduate programs, foundation courses, science and technology education, African university"
        url={`${window.location.origin}/programs`}
        type="website"
        structuredData={generateStructuredData()}
      />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="py-8 sm:py-16 bg-gradient-to-r from-[#FF5500]/10 via-[#FF7A00]/10 to-[#FFA500]/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Explore Our <span className="text-[#FF5500]">Programs</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our wide range of undergraduate, postgraduate, and foundation programs designed to prepare you for success in your chosen field.
            </p>
          </div>
        </section>

        {/* Programs Section */}
        <section className="py-8 sm:py-16" aria-label="Academic Programs">
          <div className="container mx-auto px-4">
            {/* Simple Tab Navigation */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
              {Object.entries(TABS).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(value)}
                  className={`px-4 py-2 rounded text-sm sm:text-base ${
                    activeTab === value
                      ? "bg-[#FF5500] text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {key === 'FOUNDATION' ? (
                    <>
                      <span className="hidden sm:inline">Foundation and Remedial Studies</span>
                      <span className="sm:hidden">Foundation</span>
                    </>
                  ) : (
                    key.charAt(0) + key.slice(1).toLowerCase()
                  )}
                </button>
              ))}
            </div>

            {/* Program Cards */}
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
            >
              {displayedPrograms.map((program) => (
                <ProgramCard 
                  key={program.id}
                  program={program}
                />
              ))}
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Skeleton className="aspect-[16/9] w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="pt-2">
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </Suspense>
  );
};

export default Programs;