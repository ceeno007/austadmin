import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, CheckCircle2, ArrowRight, X, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import ImageViewer from "@/components/ImageViewer";
import SEO from "@/components/SEO";

const Hostels = () => {
  const [selectedHostel, setSelectedHostel] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Add useEffect to handle body scroll
  useEffect(() => {
    if (selectedHostel || selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedHostel, selectedImage]);

  // Hostel data
  const hostels = [
    {
      name: "Nnamdi Azikiwe Hall",
      type: "Shared Room",
      duration: "1 year lease",
      feePerSemester: "N280,000",
      totalFee: "N560,000",
      images: [
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Nnamdi%20Azikiwe%20Hall/Room%20(2).jpg?updatedAt=1747307202535",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Nnamdi%20Azikiwe%20Hall/Study.jpg?updatedAt=1747307214591",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Nnamdi%20Azikiwe%20Hall/Toilet.jpg?updatedAt=1747307223294"
      ],
      description: "Comfortable shared accommodation in a vibrant community setting.",
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
      type: "Shared Room",
      duration: "1 year lease",
      feePerSemester: "N280,000",
      totalFee: "N560,000",
      images: [
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Shared%20room/IMG_8005.jpg?updatedAt=1747307361297",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Shared%20room/Room%202.jpg?updatedAt=1747307371806",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Shared%20room/Study%20(2).jpg?updatedAt=1747307404873",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Shared%20room/Study.jpg?updatedAt=1747307412176",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Shared%20room/Toilet.jpg?updatedAt=1747307415061"
      ],
      description: "Shared accommodation with modern amenities.",
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
      type: "Single Room",
      duration: "1 year lease",
      feePerSemester: "N350,000",
      totalFee: "N700,000",
      images: [
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Single%20room/Room%202.jpg?updatedAt=1747307444703",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Single%20room/Toilet.jpg?updatedAt=1747307453392",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Kwame%20Nkrumah%20Hall/Single%20room/Study.jpg?updatedAt=1747307450473",
        
      ],
      description: "Private room with enhanced privacy and comfort.",
      features: [
        "Private bathroom",
        "Study desk and chair",
        "Wardrobe",
        "Internet access",
        "24/7 security"
      ]
    },
    {
      name: "Julius Nyerere Hall",
      type: "Single Room",
      duration: "1 year lease",
      feePerSemester: "N455,000",
      totalFee: "N910,000",
      images: [
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Julius%20Nyerere%20Hall/Single%20room/Room%203.jpg?updatedAt=1747307294452",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Julius%20Nyerere%20Hall/Single%20room/Kitchenette.jpg?updatedAt=1747307297156",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Julius%20Nyerere%20Hall/Single%20room/Room%202.jpg?updatedAt=1747307301317",
        "https://ik.imagekit.io/nsq6yvxg1/AUST%20New%20work/Julius%20Nyerere%20Hall/Single%20room/Wardrobe.jpg?updatedAt=1747307455731"
      ],
      description: "Single room with modern amenities and privacy.",
      features: [
        "Private bathroom",
        "Study desk and chair",
        "Wardrobe",
        "Internet access",
        "24/7 security",
        "Air conditioning"
      ]
    },
    {
      name: "Julius Nyerere Hall",
      type: "Shared Room",
      duration: "1 year lease",
      feePerSemester: "N238,000",
      totalFee: "N476,000",
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
  ];

  return (
    <>
      <SEO 
        title="Student Hostels | AUST"
        description="Explore AUST's comfortable and secure student accommodation options. View our hostel facilities, amenities, and pricing for both shared and single rooms."
        keywords="AUST hostels, student accommodation, campus housing, shared rooms, single rooms, student facilities"
        url={`${window.location.origin}/hostels`}
        type="website"
      />
      
      {/* Custom styles for Swiper navigation and pagination */}
      <style>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #FF5500 !important;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .swiper-container:hover .swiper-button-next,
        .swiper-container:hover .swiper-button-prev,
        .swiper:hover .swiper-button-next,
        .swiper:hover .swiper-button-prev {
          opacity: 1;
        }
        
        .swiper-pagination-bullet-active {
          background: #FF5500 !important;
        }
        
        .swiper-button-next::after,
        .swiper-button-prev::after {
          display: none;
        }
      `}</style>
      
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
                  <img 
                    src="https://ik.imagekit.io/nsq6yvxg1/Upload/_dsc9455_51379157351_o.jpg?updatedAt=1747307126141"
                    alt="AUST Student Housing"
                    className="w-full h-80 object-cover"
                  />
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
              {hostels.map((hostel, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={hostel.images[0]}
                      alt={`${hostel.name} - ${hostel.type}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 rounded-full bg-[#FF5500]/10 flex items-center justify-center mr-3">
                        <Home className="h-5 w-5 text-[#FF5500]" />
                      </div>
                      <h3 className="text-xl font-bold">{hostel.name}</h3>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-600 mb-2">{hostel.description}</p>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Type: {hostel.type}</span>
                        <span>Duration: {hostel.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium mt-2">
                        <span>Per Semester: {hostel.feePerSemester}</span>
                        <span className="text-[#FF5500]">Total: {hostel.totalFee}</span>
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
                    <div className="mt-6 flex justify-between items-center">
                      <Button
                        variant="outline"
                        className="text-[#FF5500] border-[#FF5500] hover:bg-[#FF5500] hover:text-white"
                        onClick={() => setSelectedHostel(hostel)}
                      >
                        <Image className="h-4 w-4 mr-2" />
                        View Images
                      </Button>
                      {/* <Button
                        asChild
                        className="bg-[#FF5500] hover:bg-[#e64d00]"
                      >
                        <Link to="/signup" className="flex items-center">
                          Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Hostel Modal */}
        {selectedHostel && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              // Only close if clicking the background overlay
              if (e.target === e.currentTarget) {
                setSelectedHostel(null);
              }
            }}
          >
            <div className="bg-white rounded-xl max-w-4xl w-full my-8 max-h-[85vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{selectedHostel.name}</h2>
                  <button 
                    onClick={() => setSelectedHostel(null)}
                    className="bg-[#FF5500] text-white p-2 rounded-full flex items-center justify-center shadow-md hover:bg-[#e64d00] transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mb-6 relative">
                  <Swiper
                    modules={[Pagination, Navigation]}
                    spaceBetween={20}
                    navigation={{
                      nextEl: '.swiper-button-next',
                      prevEl: '.swiper-button-prev',
                    }}
                    pagination={{ 
                      clickable: true,
                      bulletActiveClass: 'swiper-pagination-bullet-active !bg-[#FF5500]'
                    }}
                    className="rounded-lg overflow-hidden swiper-custom"
                  >
                    {selectedHostel.images.map((image: string, index: number) => (
                      <SwiperSlide key={index}>
                        <div 
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedImage(image);
                            setSelectedImageIndex(index);
                          }}
                        >
                          <img
                            src={image}
                            alt={`${selectedHostel.name} - Image ${index + 1}`}
                            className="w-full h-96 object-cover rounded-lg"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                    <div className="swiper-button-prev absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md cursor-pointer">
                      <ArrowRight className="h-5 w-5 text-[#FF5500] transform rotate-180" />
                    </div>
                    <div className="swiper-button-next absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md cursor-pointer">
                      <ArrowRight className="h-5 w-5 text-[#FF5500]" />
                    </div>
                  </Swiper>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Details</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Type:</span> {selectedHostel.type}</p>
                      <p><span className="font-medium">Duration:</span> {selectedHostel.duration}</p>
                      <p><span className="font-medium">Fee per Semester:</span> {selectedHostel.feePerSemester}</p>
                      <p><span className="font-medium">Total Fee:</span> {selectedHostel.totalFee}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Features</h3>
                    <ul className="space-y-2">
                      {selectedHostel.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Viewer */}
        {selectedImage && selectedHostel && (
          <ImageViewer 
            imageUrl={selectedImage} 
            onClose={() => setSelectedImage(null)} 
            onNext={() => {
              const currentIndex = selectedImageIndex;
              const nextIndex = (currentIndex + 1) % selectedHostel.images.length;
              setSelectedImage(selectedHostel.images[nextIndex]);
              setSelectedImageIndex(nextIndex);
            }}
            onPrevious={() => {
              const currentIndex = selectedImageIndex;
              const prevIndex = (currentIndex - 1 + selectedHostel.images.length) % selectedHostel.images.length;
              setSelectedImage(selectedHostel.images[prevIndex]);
              setSelectedImageIndex(prevIndex);
            }}
            hasNext={selectedHostel.images.length > 1}
            hasPrevious={selectedHostel.images.length > 1}
          />
        )}
      </main>
    </>
  );
};

export default Hostels;
