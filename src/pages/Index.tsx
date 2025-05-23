import React, { Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <Suspense fallback={<div className="p-8"><Skeleton className="h-96 w-full rounded-xl" /></div>}>
      <main className="flex-grow">
        <HeroSection />

        {/* Programs Section */}
        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Programs</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our comprehensive range of undergraduate and postgraduate programs in science and technology.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link 
                to="/programs?tab=undergraduate"
                className="block bg-white p-6 rounded-xl border border-gray-200 hover:border-[#FF5500] transition-all duration-300 hover:shadow-lg group cursor-pointer"
              >
                <div className="relative">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#FF5500] transition-colors">Undergraduate Programs</h3>
                  <p className="text-gray-600 mb-4">
                    Bachelor's degrees in Computer Science, Engineering, and more.
                  </p>
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-6 w-6 text-[#FF5500]" />
                  </div>
                </div>
              </Link>

              <Link 
                to="/programs?tab=postgraduate"
                className="block bg-white p-6 rounded-xl border border-gray-200 hover:border-[#FF5500] transition-all duration-300 hover:shadow-lg group cursor-pointer"
              >
                <div className="relative">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#FF5500] transition-colors">Postgraduate Programs</h3>
                  <p className="text-gray-600 mb-4">
                    Master's and Ph.D. programs for advanced research and specialization.
                  </p>
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-6 w-6 text-[#FF5500]" />
                  </div>
                </div>
              </Link>

              <Link 
                to="/programs?tab=foundation"
                className="block bg-white p-6 rounded-xl border border-gray-200 hover:border-[#FF5500] transition-all duration-300 hover:shadow-lg group cursor-pointer"
              >
                <div className="relative">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#FF5500] transition-colors">Foundation Programs</h3>
                  <p className="text-gray-600 mb-4">
                    Foundation and remedial studies to prepare for university education.
                  </p>
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-6 w-6 text-[#FF5500]" />
                  </div>
                </div>
              </Link>
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
                <div className="relative">
                  <ImageWithSkeleton
                    src="https://ik.imagekit.io/nsq6yvxg1/Upload/images/academic.jpg"
                    alt="Academics"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <h3 className="text-xl font-bold mb-1">Stellar Academics</h3>
                    <p className="text-sm text-gray-200">
                      Award-winning faculty, cutting-edge research, and comprehensive curricula designed for real-world success.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden">
                <div className="relative">
                  <ImageWithSkeleton
                    src="https://ik.imagekit.io/nsq6yvxg1/Upload/images/campus.jpg"
                    alt="Community"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <h3 className="text-xl font-bold mb-1">Vibrant Community</h3>
                    <p className="text-sm text-gray-200">
                      Diverse student body from across Africa, creating a rich cultural learning environment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden">
                <div className="relative">
                  <ImageWithSkeleton
                    src="https://ik.imagekit.io/nsq6yvxg1/Upload/images/career_support.jpg"
                    alt="Career Support"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <h3 className="text-xl font-bold mb-1">Career Support</h3>
                    <p className="text-sm text-gray-200">
                      Internship opportunities, career counseling, and strong industry connections to help you launch your career.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Suspense>
  );
};

export default Index;