import React, { useMemo, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, CheckCircle2, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/SEO";

// Hostel interface
interface Hostel {
  name: string;
  type: string;
  duration: string;
  feePerSemester: string;
  totalFee: string;
  images: string[];
  description: string;
  features: string[];
}

interface HostelCardProps {
  hostel: Hostel;
  index: number;
  onViewImages: (hostel: Hostel) => void;
}

const Hostels = () => {
  const navigate = useNavigate();
  
  // Memoize hostels data to prevent unnecessary re-renders
  const hostels = useMemo(() => [
    {
      name: "Nnamdi Azikiwe Hall",
      type: "Shared Room - 2 persons",
      duration: "1 year lease",
      feePerSemester: "N400,000",
      totalFee: "N800,000",
      images: [
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Nnamdi%20Azikiwe%20Hall/Room%20(2).jpg?updatedAt=1747307202535",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Nnamdi%20Azikiwe%20Hall/Study.jpg?updatedAt=1747307214591",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Nnamdi%20Azikiwe%20Hall/Toilet.jpg?updatedAt=1747307223294"
      ],
      description: "Comfortable shared accommodation for 2 persons in a vibrant community setting.",
      features: [
        "Shared bathroom facilities",
        "Study desk and chair",
        "Wardrobe",
        "Internet access",
        "24/7 security"
      ]
    },
    {
      name: "Nnamdi Azikiwe Hall",
      type: "Shared Room - 3 persons",
      duration: "1 year lease",
      feePerSemester: "N350,000",
      totalFee: "N700,000",
      images: [
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Nnamdi%20Azikiwe%20Hall/Room%20(2).jpg?updatedAt=1747307202535",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Nnamdi%20Azikiwe%20Hall/Study.jpg?updatedAt=1747307214591",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Nnamdi%20Azikiwe%20Hall/Toilet.jpg?updatedAt=1747307223294"
      ],
      description: "Shared accommodation for 3 persons with modern amenities.",
      features: [
        "Shared bathroom facilities",
        "Study desk and chair",
        "Wardrobe",
        "Internet access",
        "24/7 security"
      ]
    },
    {
      name: "Kwame Nkrumah Hall",
      type: "Shared Room - 2 persons",
      duration: "1 year lease",
      feePerSemester: "N400,000",
      totalFee: "N800,000",
      images: [
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Shared%20room/IMG_8005.jpg?updatedAt=1747307361297",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Shared%20room/Room%202.jpg?updatedAt=1747307371806",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Shared%20room/Study%20(2).jpg?updatedAt=1747307404873",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Shared%20room/Study.jpg?updatedAt=1747307412176",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Shared%20room/Toilet.jpg?updatedAt=1747307415061"
      ],
      description: "Shared accommodation for 2 persons with modern amenities.",
      features: [
        "Shared bathroom facilities",
        "Study desk and chair",
        "Wardrobe",
        "Internet access",
        "24/7 security"
      ]
    },
    {
      name: "Kwame Nkrumah Hall",
      type: "Shared Room - 4 persons",
      duration: "1 year lease",
      feePerSemester: "N340,000",
      totalFee: "N680,000",
      images: [
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Shared%20room/IMG_8005.jpg?updatedAt=1747307361297",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Shared%20room/Room%202.jpg?updatedAt=1747307371806",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Shared%20room/Study%20(2).jpg?updatedAt=1747307404873",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Shared%20room/Study.jpg?updatedAt=1747307412176",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Shared%20room/Toilet.jpg?updatedAt=1747307415061"
      ],
      description: "Shared accommodation for 4 persons with modern amenities.",
      features: [
        "Shared bathroom facilities",
        "Study desk and chair",
        "Wardrobe",
        "Internet access",
        "24/7 security"
      ]
    },
    {
      name: "Julius Nyerere Hall",
      type: "Shared Room - 3 persons",
      duration: "1 year lease",
      feePerSemester: "N340,000",
      totalFee: "N680,000",
      images: [
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Julius%20Nyerere%20Hall/Shared%20room/Room%202.jpg?updatedAt=1747307228940",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Julius%20Nyerere%20Hall/Shared%20room/Kitchenette.jpg?updatedAt=1747307233197",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Julius%20Nyerere%20Hall/Shared%20room/Room.jpg?updatedAt=1747307262597",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Julius%20Nyerere%20Hall/Shared%20room/Toilet.jpg?updatedAt=1747307279402",
        
      ],
      description: "Shared accommodation in a comfortable hall.",
      features: [
        "Shared bathroom facilities",
        "Study desk and chair",
        "Wardrobe",
        "Internet access",
        "24/7 security"
      ]
    }
  ], []);

  const handleViewImages = React.useCallback((hostel: Hostel) => {
    navigate('/hostel-images', { state: { hostel } });
  }, [navigate]);

  // Memoize the HostelCard component
  const HostelCard: React.FC<HostelCardProps> = ({ hostel, index, onViewImages }) => {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={hostel.images[0]}
            alt={hostel.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            fetchPriority={index < 3 ? "high" : "low"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-4 w-full">
              <h3 className="text-xl font-bold text-white">{hostel.name}</h3>
              <p className="text-sm text-white/90">{hostel.type}</p>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <p className="text-gray-600 mb-4">{hostel.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-semibold mb-2">Price:</h4>
              <p className="text-gray-600">
                <span className="font-medium">{hostel.feePerSemester}</span> per semester
                <br />
                <span className="text-sm text-gray-500">Total: {hostel.totalFee}</span>
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Capacity:</h4>
              <p className="text-gray-600">{hostel.type.includes("Shared") ? hostel.type : "Single Room"}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="space-y-1">
              {hostel.features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex justify-start">
            <Button
              variant="outline"
              className="border-[#FF5500] text-[#FF5500] hover:bg-[#FF5500] hover:text-white transition-all duration-200 ease-in-out"
              onClick={() => onViewImages(hostel)}
            >
              <Image className="h-4 w-4 mr-2" />
              View Images
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Memoize the hero image
  const heroImage = useMemo(() => (
    <img 
      src="https://ik.imagekit.io/nsq6yvxg1/Upload/_dsc9455_51379157351_o.jpg?updatedAt=1747307126141"
      alt="AUST Student Housing"
      className="w-full h-80 object-cover"
      loading="eager"
      decoding="async"
      fetchPriority="high"
    />
  ), []);

  return (
    <>
      <SEO 
        title="Student Hostels | AUST"
        description="Explore AUST's comfortable and secure student accommodation options. View our hostel facilities, amenities, and pricing for both shared and single rooms."
        keywords="AUST hostels, student accommodation, campus housing, shared rooms, single rooms, student facilities"
        url={`${window.location.origin}/hostels`}
        type="website"
      />
      
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-r from-[#FF5500]/10 via-[#FF7A00]/10 to-[#FFA500]/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Student <span className="text-[#FF5500]">Housing</span>
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  Explore our comfortable and secure accommodation options designed to make your stay at AUST Abuja as pleasant as possible.
                </p>
              </div>
              <div className="md:w-1/2 ml-0 md:ml-8">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  {heroImage}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Available Hostels</h2>
            <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              We offer a variety of accommodation options to suit different preferences and budgets. All hostels are equipped with essential amenities and are located within the campus for convenience.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Suspense fallback={<div>Loading hostels...</div>}>
                {hostels.map((hostel, index) => (
                  <HostelCard 
                    key={`${hostel.name}-${index}`}
                    hostel={hostel}
                    index={index}
                    onViewImages={handleViewImages}
                  />
                ))}
              </Suspense>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default React.memo(Hostels);