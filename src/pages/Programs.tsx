import React, { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/SEO";
import { programs, type Program } from "@/data/programs";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";

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
const ProgramCard = React.memo<{ program: Program }>(({ program }) => {
  const navigate = useNavigate();
  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/programs/${program.id}`);
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[16/9]">
        <ImageWithSkeleton
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
});

const Programs: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>(TABS.UNDERGRADUATE);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Prefetch threshold
  const PREFETCH_THRESHOLD = 3;

  // Effect for URL params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get("tab") as TabType;
    if (tabParam && Object.values(TABS).includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Reset visible items when tab changes or filters change
  useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE);
  }, [activeTab, search, filterCategory]);

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

  // Enhanced filter logic
  const filteredPrograms = useMemo(() => {
    // When filters are active, search through all programs, not just current tab
    let list = (search.trim() || filterCategory) ? programs : getCurrentPrograms();
    
    if (search.trim()) {
      list = list.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterCategory) {
      if (filterCategory === "M.Sc.") {
        list = list.filter(p => p.title.startsWith("M.Sc."));
      } else if (filterCategory === "Ph.D.") {
        list = list.filter(p => p.title.startsWith("Ph.D."));
      } else if (filterCategory === "Taught Masters") {
        list = list.filter(p => p.title.includes("Taught Masters"));
      } else {
      list = list.filter(p => p.category === filterCategory);
    }
    }
    return list;
  }, [search, filterCategory, activeTab]);

  const displayedPrograms = filteredPrograms.slice(0, visibleItems);

  // Optimized scroll handler with debounce
  const handleScroll = useMemo(() => debounce(() => {
    if (isLoading) return;
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    // Use filtered programs for pagination
    if (visibleItems >= filteredPrograms.length) return;
    const bufferIndex = visibleItems - PREFETCH_THRESHOLD;
    const bufferElement = document.querySelectorAll('.program-card')[bufferIndex];
    let bufferOffset = 0;
    if (bufferElement) {
      bufferOffset = (bufferElement as HTMLElement).getBoundingClientRect().bottom;
    }
    if (
      scrollPosition >= documentHeight - 100 ||
      (bufferOffset && bufferOffset < window.innerHeight + 200)
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleItems(prev => Math.min(prev + ITEMS_PER_PAGE, filteredPrograms.length));
        setIsLoading(false);
      }, 400);
    }
  }, 100), [isLoading, visibleItems, filteredPrograms.length]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Generate structured data for programs
  const generateStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": filteredPrograms.map((program, index) => ({
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
        {/* Search & Filter UI */}
        <section className="py-4 bg-white border-b">
          <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center gap-4">
            <input
              type="text"
              placeholder="Search programs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
            />
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="programs-select w-full md:w-1/4"
            >
              <option value="">All Categories</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="M.Sc.">M.Sc.</option>
              <option value="Ph.D.">Ph.D.</option>
              <option value="Taught Masters">Taught Masters</option>
              <option value="foundation">Foundation</option>
              <option value="jupeb">JUPEB</option>
            </select>
            {(search || filterCategory) && (
              <button
                onClick={() => { setSearch(""); setFilterCategory(""); }}
                className="text-sm text-[#FF5500] underline ml-2"
              >
                Clear
              </button>
            )}
          </div>
        </section>
        {/* Programs Section */}
        <section className="py-8 sm:py-16" aria-label="Academic Programs">
          <div className="container mx-auto px-4">
            {/* Show Tab Navigation only when no filters are active */}
            {!search && !filterCategory && (
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
            )}



            {/* Show Results Header when filters are active */}
            {(search || filterCategory) && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Search Results
                </h2>
                <p className="text-gray-600">
                  {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} found
                  {search && ` for "${search}"`}
                  {filterCategory && ` in ${filterCategory}`}
                </p>
              </div>
            )}
            {/* Program Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPrograms.map(program => (
                <div className="program-card" key={program.id}>
                  <ProgramCard program={program} />
                </div>
              ))}
              {/* Always fill the grid with skeletons up to ITEMS_PER_PAGE */}
              {(() => {
                const skeletonCount = Math.max(
                  0,
                  ITEMS_PER_PAGE - (displayedPrograms.length % ITEMS_PER_PAGE || ITEMS_PER_PAGE)
                );
                // If there are more items to load, show a full batch of skeletons
                if (visibleItems < filteredPrograms.length) {
                  return Array.from({ length: skeletonCount }).map((_, i) => (
                    <SkeletonCard key={`skeleton-${i}`} />
                  ));
                }
                // If all items are loaded but the last row is not full, fill the row with invisible divs for visual consistency
                if (displayedPrograms.length % ITEMS_PER_PAGE !== 0) {
                  return Array.from({ length: skeletonCount }).map((_, i) => (
                    <div key={`empty-${i}`} className="invisible" />
                  ));
                }
                return null;
              })()}
            </div>
          </div>
        </section>
      </main>
    </Suspense>
  );
};

export default Programs;