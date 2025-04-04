import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const getCurrentAcademicYear = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    return currentMonth >= 8
      ? `${currentYear}/${currentYear + 1}`
      : `${currentYear - 1}/${currentYear}`;
  };

  return (
    // 1) Removed "overflow-hidden" so nothing gets clipped on small screens
    <div className="relative bg-gradient-to-r from-primary/90 to-primary text-white">
      
      {/* 2) Smaller background image behind content */}
      {/*    Absolute, centered, with reduced width & height */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-4 sm:mt-0 opacity-20 z-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Hero Background"
          className="w-[250px] h-auto sm:w-[400px] object-cover"
        />
      </div>

      {/* Hero Text Content */}
      {/* Reduced the top/bottom padding so feature boxes fit on mobile */}
      <div className="relative z-10 px-4 py-8 sm:py-16 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {getCurrentAcademicYear()} Admissions Now Open
          </h1>
          <p className="text-lg sm:text-xl mb-6">
            Join our vibrant community of scholars and innovators
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apply">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Apply Now
              </Button>
            </Link>
            <Link to="/programs">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Explore Programs
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* 3) Floating Gradient Circles */}
      {/*    Smaller on mobile (w-16/h-16) to avoid cutting off */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-16 h-16 sm:w-48 sm:h-48 bg-[#FF6B00]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-48 sm:h-48 bg-[#FF6B00]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-48 sm:h-48 bg-[#FF6B00]/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-48 sm:h-48 bg-[#FF6B00]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-16 h-16 sm:w-48 sm:h-48 bg-[#FF6B00]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Feature Boxes Section */}
      {/* 4) Slightly reduced top padding on mobile (py-12 -> py-8) */}
      <div className="relative z-10 px-4 py-8 sm:py-16 bg-primary/90">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Pan-African Student Community',
              desc: 'Join a diverse community of students from across Africa, fostering cultural exchange and collaboration.',
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              ),
            },
            {
              title: 'Excellence in World-Class Education',
              desc: 'Experience top-tier education with internationally recognized programs and expert faculty.',
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              ),
            },
            {
              title: '20+ Programs',
              desc: 'Choose from a wide range of undergraduate and postgraduate programs tailored to your career goals.',
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              ),
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 * index }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-lg text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-[#FF6B00]/20 rounded-full">
                <svg
                  className="w-6 h-6 text-[#FF6B00]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {item.icon}
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-white/80 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
