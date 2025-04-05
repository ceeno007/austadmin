import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, CheckCircle2, ArrowRight, X, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

const Hostels = () => {
  const [selectedHostel, setSelectedHostel] = useState<any | null>(null);

  // Hostel data
  const hostels = [
    {
      name: "Nnamdi Azikiwe Hall",
      type: "Shared Room",
      duration: "1 year lease",
      feePerSemester: "N280,000",
      totalFee: "N560,000",
      images: [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1000",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
        "https://images.unsplash.com/photo-1590080875621-cdd43e49ef88?q=80&w=1000"
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
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1000",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
        "https://images.unsplash.com/photo-1590080875621-cdd43e49ef88?q=80&w=1000"
      ],
      description: "Affordable shared accommodation with modern amenities.",
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
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1000",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
        "https://images.unsplash.com/photo-1590080875621-cdd43e49ef88?q=80&w=1000"
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
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
        "https://images.unsplash.com/photo-1590080875621-cdd43e49ef88?q=80&w=1000",
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1000"
      ],
      description: "Premium single room with modern amenities and privacy.",
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
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1000",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
        "https://images.unsplash.com/photo-1590080875621-cdd43e49ef88?q=80&w=1000"
      ],
      description: "Economical shared accommodation in a premium hall.",
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
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
                    src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1000"
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

        {/* Modal for Selected Hostel */}
        {selectedHostel && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl relative my-8">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50"
                onClick={() => setSelectedHostel(null)}
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  {selectedHostel.name} – {selectedHostel.type}
                </h2>

                <Swiper
                  modules={[Pagination, Navigation]}
                  spaceBetween={20}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  navigation
                  className="mb-6"
                >
                  {selectedHostel.images.map((img: string, i: number) => (
                    <SwiperSlide key={i}>
                      <img
                        src={img}
                        alt={`Slide ${i + 1}`}
                        className="rounded-lg w-full h-[300px] md:h-[400px] object-cover mx-auto"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 mb-4">{selectedHostel.description}</p>
                    
                    <h3 className="text-xl font-semibold mb-2">Pricing</h3>
                    <div className="space-y-2 mb-4">
                      <p className="flex justify-between">
                        <span>Per Semester:</span>
                        <span className="font-medium">{selectedHostel.feePerSemester}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Total (1 year):</span>
                        <span className="font-medium text-[#FF5500]">{selectedHostel.totalFee}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Features</h3>
                    <ul className="space-y-2">
                      {selectedHostel.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Hostels;
