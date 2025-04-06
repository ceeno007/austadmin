import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import communityImage from "@/assets/images/community.jpg";
import academicImage from "@/assets/images/academic.jpg";
import careerSupportImage from "@/assets/images/career_support.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />

        {/* Programs Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Programs</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our comprehensive range of undergraduate and postgraduate programs in science and technology.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <h3 className="text-xl font-bold mb-3">Undergraduate Programs</h3>
                <p className="text-gray-600 mb-4">
                  Bachelor's degrees in Computer Science, Engineering, and more.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#FF5500] text-[#FF5500] hover:bg-[#ff550011]"
                >
                  <Link to="/programs">Learn More</Link>
                </Button>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <h3 className="text-xl font-bold mb-3">Postgraduate Programs</h3>
                <p className="text-gray-600 mb-4">
                  Master's and Ph.D. programs for advanced research and specialization.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#FF5500] text-[#FF5500] hover:bg-[#ff550011]"
                >
                  <Link to="/programs">Learn More</Link>
                </Button>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <h3 className="text-xl font-bold mb-3">JUPEB Program</h3>
                <p className="text-gray-600 mb-4">
                  One-year pre-university program for direct entry admission.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#FF5500] text-[#FF5500] hover:bg-[#ff550011]"
                >
                  <Link to="/programs">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose AUST Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Why Choose <span className="text-[#FF5500]">AUST</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We are committed to academic excellence, innovation, and developing well-rounded graduates who excel in their chosen fields.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden">
                <img
                  src={academicImage}
                  alt="Academics"
                  className="w-full h-40 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Stellar Academics</h3>
                  <p className="text-gray-600">
                    Award-winning faculty, cutting-edge research, and comprehensive curricula designed for real-world success.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden">
                <img
                  src={communityImage}
                  alt="Community"
                  className="w-full h-40 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Vibrant Community</h3>
                  <p className="text-gray-600">
                    Diverse student body from across Africa, creating a rich cultural learning environment.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden">
                <img
                  src={careerSupportImage}
                  alt="Career Support"
                  className="w-full h-40 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Career Support</h3>
                  <p className="text-gray-600">
                    Internship opportunities, career counseling, and strong industry connections to help you launch your career.
                  </p>
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
