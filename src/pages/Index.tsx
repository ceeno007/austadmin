
import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProgramTabs from "@/components/ProgramTabs";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, UserPlus, Users, GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main>
        <HeroSection />
        
        <section className="py-16 bg-gradient-to-r from-uni-purple/10 via-uni-blue/10 to-uni-green/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Why Choose <span className="gradient-text">UniNigeria</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We are committed to academic excellence, innovation, and developing well-rounded graduates who excel in their chosen fields.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-uni-purple/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-uni-purple" />
                </div>
                <h3 className="text-xl font-bold mb-2">Stellar Academics</h3>
                <p className="text-gray-600">
                  Award-winning faculty, cutting-edge research, and comprehensive curricula designed for real-world success.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-uni-blue/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-uni-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Vibrant Community</h3>
                <p className="text-gray-600">
                  Diverse student body from across Nigeria and beyond, creating a rich cultural learning environment.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-uni-green/10 flex items-center justify-center mb-4">
                  <UserPlus className="h-6 w-6 text-uni-green" />
                </div>
                <h3 className="text-xl font-bold mb-2">Career Support</h3>
                <p className="text-gray-600">
                  Internship opportunities, career counseling, and strong industry connections to help you launch your career.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <ProgramTabs />
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-uni-purple to-uni-blue rounded-2xl overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 text-white">
                  <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
                  <p className="mb-6 opacity-90">
                    Take the first step toward your academic and professional success. Apply now to join our community of scholars and innovators.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Application Deadline</p>
                        <p className="text-sm opacity-90">August 31, 2024 for Fall Semester</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Campus Tours</p>
                        <p className="text-sm opacity-90">Available every weekend - Book online</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Button asChild size="lg" className="bg-white text-uni-purple hover:bg-gray-100">
                      <Link to="/signup" className="flex items-center">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="relative h-64 md:h-auto">
                  <img
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2000"
                    alt="Students in campus"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
