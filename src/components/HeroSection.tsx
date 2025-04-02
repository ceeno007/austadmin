
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Award, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden hero-pattern pt-16 md:pt-20 pb-24">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-uni-purple/10 blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-uni-blue/10 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="animate-bounce mr-2">🎓</span> 2024/2025 Admissions Now Open
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your Future Starts <span className="gradient-text">Here</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-lg">
              Join one of Nigeria's leading universities offering world-class education, 
              cutting-edge research, and vibrant campus life. Turn your dreams into reality.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="bg-primary button-hover">
                <Link to="/signup" className="flex items-center">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="button-hover">
                <Link to="/programs">Explore Programs</Link>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 pt-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold">
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-black">2,000+</span> students already enrolled this semester
              </p>
            </div>
          </div>
          
          <div className="md:w-1/2 mt-10 md:mt-0 animate-scale-in">
            <div className="relative">
              <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000" 
                  alt="University Campus" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Stats cards */}
              <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
                <div className="bg-uni-blue/10 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-uni-blue" />
                </div>
                <div>
                  <p className="font-semibold">50+ Programs</p>
                  <p className="text-xs text-gray-500">Undergraduate & Postgraduate</p>
                </div>
              </div>
              
              <div className="absolute -top-5 -right-5 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
                <div className="bg-uni-purple/10 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-uni-purple" />
                </div>
                <div>
                  <p className="font-semibold">Accredited</p>
                  <p className="text-xs text-gray-500">Top-Ranked University</p>
                </div>
              </div>
              
              <div className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
                <div className="bg-uni-green/10 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-uni-green" />
                </div>
                <div>
                  <p className="font-semibold">15,000+</p>
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
