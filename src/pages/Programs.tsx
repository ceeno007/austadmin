import React, { useState, useEffect, Suspense, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/SEO";
import { programs, type Program } from "@/data/programs";
import SequentialImageLoader from "@/components/SequentialImageLoader";

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
    {[1,2,3,4,5,6].map(i => (
      <Skeleton key={i} className="h-[400px] w-full" />
    ))}
  </div>
);

// Debounce utility
function debounce(fn: (...args: any[]) => void, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// SkeletonCard for loading state
const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <Skeleton className="w-full aspect-[16/9]" />
    <div className="p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

// Memoized ProgramCard
const ProgramCard = React.memo<{ program: Program, index: number, scrollDirection: 'up' | 'down' | null }>(
  ({ program, index, scrollDirection }) => {
    const navigate = useNavigate();
    const handleViewDetails = (e: React.MouseEvent) => {
      e.preventDefault();
      navigate(`/programs/${program.id}`);
    };
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative aspect-[16/9]">
          <SequentialImageLoader
            src={program.image}
            alt={program.title}
            className="w-full h-full object-cover"
            index={index}
            scrollDirection={scrollDirection}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-semibold mb-1">{program.title}</h3>
            <p className="text-sm opacity-90">{program.duration}</p>
          </div>
        </div>
        <div className="p-4">
          <p
            className="text-gray-600 mb-4 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: program.description }}
          />
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
  }
);

const Programs: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>(TABS.UNDERGRADUATE);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>('down');
  const lastScrollY = useRef<number>(0);
  const navigate = useNavigate();

  const PREFETCH_THRESHOLD = 3;

  // Track scroll direction
  useEffect(() => {
    const handleScrollDirection = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScrollDirection);
    return () => window.removeEventListener('scroll', handleScrollDirection);
  }, []);

  // Sync tab with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab") as TabType;
    if (tabParam && Object.values(TABS).includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Reset pagination on tab change
  useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE);
  }, [activeTab]);

  // Filter programs by tab
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

  // Infinite scroll handler
  const handleScroll = useMemo(
    () =>
      debounce(() => {
        if (isLoading) return;
        const scrollPos = window.innerHeight + window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const current = getCurrentPrograms();
        if (visibleItems >= current.length) return;

        const bufferIndex = visibleItems - PREFETCH_THRESHOLD;
        const bufferEl = document.querySelectorAll('.program-card')[bufferIndex];
        let bufferOffset = 0;
        if (bufferEl) {
          bufferOffset = (bufferEl as HTMLElement).getBoundingClientRect().bottom;
        }

        if (
          scrollPos >= docHeight - 100 ||
          (bufferOffset && bufferOffset < window.innerHeight + 200)
        ) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleItems(prev => Math.min(prev + ITEMS_PER_PAGE, current.length));
            setIsLoading(false);
          }, 400);
        }
      }, 100),
    [isLoading, visibleItems, activeTab]
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Structured data for SEO
  const generateStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": getCurrentPrograms().map((program, idx) => ({
      "@type": "EducationalProgram",
      "name": program.title,
      "description": program.description,
      "provider": {
        "@type": "CollegeOrUniversity",
        "name": "African University of Science and Technology"
      },
      "timeToComplete": program.duration,
      "educationalProgramMode": "full-time",
      "position": idx + 1
    }))
  });

  const currentPrograms = getCurrentPrograms();
  const displayedPrograms = currentPrograms.slice(0, visibleItems);

  return (
    <Suspense fallback={<ProgramsSkeleton />}>
      <SEO
        title="Academic Programs | AUST"
        description="Explore AUST's comprehensive range of undergraduate, postgraduate, and foundation programs."
        keywords="AUST programs, undergraduate, postgraduate, foundation"
        url={`${window.location.origin}/programs`}
        type="website"
        structuredData={generateStructuredData()}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="py-8 sm:py-16 bg-gradient-to-r from-[#FF5500]/10 via-[#FF7A00]/10 to-[#FFA500]/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Explore Our <span className="text-[#FF5500]">Programs</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our wide range of undergraduate, postgraduate, and foundation programs.
            </p>
          </div>
        </section>

        {/* Tabs & Cards */}
        <section className="py-8 sm:py-16" aria-label="Academic Programs">
          <div className="container mx-auto px-4">
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
              {Object.entries(TABS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(val)}
                  className={`px-4 py-2 rounded text-sm sm:text-base ${
                    activeTab === val ? "bg-[#FF5500] text-white" : "bg-gray-200 text-gray-700"
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

            {/* Program Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPrograms.map((prog, index) => (
                <div className="program-card" key={prog.id}>
                  <ProgramCard 
                    program={prog} 
                    index={index} 
                    scrollDirection={scrollDirection}
                  />
                </div>
              ))}

              {/* Skeleton / Spacer filler */}
              {(() => {
                const remainder = displayedPrograms.length % ITEMS_PER_PAGE;
                const fillCount = remainder === 0 ? 0 : ITEMS_PER_PAGE - remainder;
                if (visibleItems < currentPrograms.length) {
                  return Array.from({ length: fillCount }).map((_, i) => (
                    <SkeletonCard key={`skel-${i}`} />
                  ));
                }
                if (remainder !== 0) {
                  return Array.from({ length: fillCount }).map((_, i) => (
                    <div key={`spacer-${i}`} className="invisible"></div>
                  ));
                }
                return null;
              })()}
            </div>

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF5500]"></div>
              </div>
            )}

            {/* End of results indicator */}
            {visibleItems >= currentPrograms.length && currentPrograms.length > 0 && (
              <div className="text-center mt-8 text-gray-500">
                That's all the programs in this category
              </div>
            )}
          </div>
        </section>
      </main>
    </Suspense>
  );
};

export default Programs;