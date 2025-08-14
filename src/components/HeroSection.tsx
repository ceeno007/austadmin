import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, GraduationCap, Globe } from "lucide-react";

const HeroSection = () => {
  // Get current and next year for academic session
  const currentYear = new Date().getFullYear();
  const academicSession = `${currentYear}/${currentYear + 1}`;

  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://ik.imagekit.io/nsq6yvxg1/Upload/images/campus.jpg"
        >
          <source src="https://ik.imagekit.io/nsq6yvxg1/Upload/Timeline%201.mov/ik-video.mp4?updatedAt=1748013435253" type="video/mp4" />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Pause background video control (visually subtle) */}
        <button
          type="button"
          aria-label="Pause background video"
          className="absolute bottom-4 right-4 z-10 text-xs px-2 py-1 rounded bg-black/40 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => {
            const vid = document.querySelector('section video') as HTMLVideoElement | null;
            if (!vid) return;
            if (vid.paused) { vid.play(); } else { vid.pause(); }
          }}
        >
          Pause
        </button>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-12">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-4 border border-white/20">
            <Calendar className="mr-2 h-4 w-4 text-[#FF5500]" />
            {academicSession} Admissions Now Open
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Begin Your Journey at <span className="text-[#FF5500]">AUST</span>
          </h1>

          <p className="text-base md:text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
            Join Africa's premier institution for science and technology. 
            Apply now for undergraduate and postgraduate programs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button asChild size="lg" className="bg-[#FF5500] hover:bg-[#e64d00] text-white">
              <Link to="/signup" className="flex items-center">
                Start Your Application <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 text-white border-white hover:bg-white/20">
              <Link to="/programs">View Programs</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <GraduationCap className="h-6 w-6 text-[#FF5500] mx-auto mb-1" />
              <p className="text-xl font-bold">20+</p>
              <p className="text-xs text-gray-300">Academic Programs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <Globe className="h-6 w-6 text-[#FF5500] mx-auto mb-1" />
              <p className="text-xl font-bold">30+</p>
              <p className="text-xs text-gray-300">Countries</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <Calendar className="h-6 w-6 text-[#FF5500] mx-auto mb-1" />
              <p className="text-xl font-bold">100%</p>
              <p className="text-xs text-gray-300">Online Application</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



