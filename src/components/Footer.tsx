import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, X } from "lucide-react";
import austLogo from "@/assets/images/austlogo.webp";

// Custom X (Twitter) logo component
const XLogo = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const badgeDismissed = localStorage.getItem('austinspireBadgeDismissed');
    
    if (!badgeDismissed) {
      const timer = setTimeout(() => {
        setShowBadge(true);
      }, 20000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismissBadge = () => {
    setShowBadge(false);
    localStorage.setItem('austinspireBadgeDismissed', 'true');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo and About */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center group" onClick={scrollToTop}>
              <img
                src={austLogo}
                alt="AUST Logo"
                className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="ml-3 text-2xl font-clash-display font-bold text-white">
                AUST
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Advancing science, technology, and innovation in Africa. AUST is
              committed to academic excellence and research for a better
              continent.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/AUSTech/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:bg-[#FF5500] hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </a>

              <a
                href="https://x.com/AUSTNigeria"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:bg-[#FF5500] hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <XLogo />
              </a>

              <a
                href="https://www.instagram.com/austnigeria/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:bg-[#FF5500] hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </a>

              {/* <a
                href="https://www.youtube.com/@AUSTAbuja"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:bg-[#FF5500] hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <Youtube className="h-5 w-5" />
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-[#FF5500] transition-colors flex items-center group"
                  onClick={scrollToTop}
                >
                  <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/programs"
                  className="text-gray-400 hover:text-[#FF5500] transition-colors flex items-center group"
                  onClick={scrollToTop}
                >
                  <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Programs
                </Link>
              </li>
              <li>
                <Link
                  to="/campus"
                  className="text-gray-400 hover:text-[#FF5500] transition-colors flex items-center group"
                  onClick={scrollToTop}
                >
                  <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Campus Life
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Programs</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/programs?tab=undergraduate"
                  className="text-gray-400 hover:text-[#FF5500] transition-colors flex items-center group"
                  onClick={scrollToTop}
                >
                  <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Undergraduate Programs
                </Link>
              </li>
              <li>
                <Link
                  to="/programs?tab=postgraduate"
                  className="text-gray-400 hover:text-[#FF5500] transition-colors flex items-center group"
                  onClick={scrollToTop}
                >
                  <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Postgraduate Programs
                </Link>
              </li>
              <li>
                <Link
                  to="/programs?tab=foundation"
                  className="text-gray-400 hover:text-[#FF5500] transition-colors flex items-center group"
                  onClick={scrollToTop}
                >
                  <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Foundation Programs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="bg-gray-800 p-2 rounded-full mr-3 group-hover:bg-[#FF5500] transition-colors">
                  <MapPin className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </div>
                <a
                  href="https://www.google.com/maps/place/African+University+of+Science+and+Technology/@9.000923,7.4194253,17z/data=!3m1!4b1!4m6!3m5!1s0x104e733ec975c7a5:0x2d2d373a8f08b1f7!8m2!3d9.000923!4d7.4220002!16s%2Fm%2F0275wzx?entry=ttu&g_ep=EgoyMDI1MDUxMi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 group-hover:text-white transition-colors"
                >
                  Km 10 Umaru Musa Yar'Adua Road, Galadimawa, Abuja, Nigeria
                </a>
              </li>
              <li className="flex items-center group">
                <div className="bg-gray-800 p-2 rounded-full mr-3 group-hover:bg-[#FF5500] transition-colors">
                  <Phone className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </div>
                <a
                  href="tel:+2347012345678"
                  className="text-gray-400 group-hover:text-white transition-colors"
                >
                  +234 701 234 5678
                </a>
              </li>
              <li className="flex items-center group">
                <div className="bg-gray-800 p-2 rounded-full mr-3 group-hover:bg-[#FF5500] transition-colors">
                  <Mail className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </div>
                <a
                  href="mailto:admissions@aust.edu.ng"
                  className="text-gray-400 group-hover:text-white transition-colors"
                >
                  admissions@aust.edu.ng
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom section */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} African University of Science and
              Technology, Abuja. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-500 hover:text-[#FF5500] transition-colors text-sm" onClick={scrollToTop}>
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-[#FF5500] transition-colors text-sm" onClick={scrollToTop}>
                Terms of Use
              </Link>
              <Link to="/sitemap" className="text-gray-500 hover:text-[#FF5500] transition-colors text-sm" onClick={scrollToTop}>
                Sitemap
              </Link>
            </div>
          </div>
        </div>

        {/* Dismissible badge */}
        {showBadge && (
          <div className="fixed bottom-4 right-4 z-50 animate-fade-in max-w-[90%] sm:max-w-md mx-auto" style={{ animationDelay: '20s' }}>
            <div className="bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/50 p-4 flex items-center space-x-3 mx-4">
              <span className="text-sm text-white">
                Made with ❤️ by <a href="https://austinspire.com" target="_blank" rel="noopener noreferrer" className="text-[#FF5500] hover:underline font-medium">AUSTInspire</a>
              </span>
              <button
                onClick={handleDismissBadge}
                className="text-white/70 hover:text-white transition-colors flex-shrink-0 hover:bg-gray-700/50 p-1 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
