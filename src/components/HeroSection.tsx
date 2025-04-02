import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Award, Users } from "lucide-react";
import campus from "@/assets/images/campus.jpg";
import person1 from "@/assets/images/person1.jpg";
import person2 from "@/assets/images/person2.jpg";
import person3 from "@/assets/images/person3.jpg";
import person4 from "@/assets/images/person4.jpg";

const HeroSection = () => {
  const studentImages = [person1, person2, person3, person4];
  
  return (
    <section className="relative overflow-hidden pt-16 md:pt-20 pb-24 bg-gradient-to-r from-[#FF5500]/10 via-[#FF7A00]/10 to-[#FFA500]/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#FF5500]/10 text-[#FF5500] text-sm font-medium">
              <span className="mr-2">🎓</span> 2024/2025 Admissions Now Open
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Welcome to <span className="text-[#FF5500]">AUST</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-lg">
              Join Africa's leading university in science and technology, where innovation meets excellence. 
              Shape the future through cutting-edge research and world-class education.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="bg-[#FF5500] hover:bg-[#e64d00]">
                <Link to="/signup" className="flex items-center">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/programs">Explore Programs</Link>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 pt-6">
              <div className="flex -space-x-2">
                {studentImages.map((image, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                    <img 
                      src={image} 
                      alt={`Student ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-black">1,000+</span> students from across Africa
              </p>
            </div>
          </div>
          
          <div className="md:w-1/2 mt-10 md:mt-0 animate-scale-in">
            <div className="relative">
              <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={campus}
                  alt="AUST Campus Entrance" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Stats cards */}
              <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
                <div className="bg-[#FF5500]/10 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-[#FF5500]" />
                </div>
                <div>
                  <p className="font-semibold">20+ Programs</p>
                  <p className="text-xs text-gray-500">Undergraduate & Postgraduate</p>
                </div>
              </div>
              
              <div className="absolute -top-5 -right-5 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
                <div className="bg-[#FF5500]/10 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-[#FF5500]" />
                </div>
                <div>
                  <p className="font-semibold">Excellence</p>
                  <p className="text-xs text-gray-500">World-Class Education</p>
                </div>
              </div>
              
              <div className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
                <div className="bg-[#FF5500]/10 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-[#FF5500]" />
                </div>
                <div>
                  <p className="font-semibold">Pan-African</p>
                  <p className="text-xs text-gray-500">Student Community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
