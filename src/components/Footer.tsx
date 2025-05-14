import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, X } from "lucide-react";
import XLogo from "@/components/icons/XLogo"; // Update path as needed
import austLogo from "@/assets/images/austlogo.webp";

const Footer = () => {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Check if badge was previously dismissed
    const badgeDismissed = localStorage.getItem('austinspireBadgeDismissed');
    
    if (!badgeDismissed) {
      // Show badge after 20 seconds if not previously dismissed
      const timer = setTimeout(() => {
        setShowBadge(true);
      }, 20000); // 20 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismissBadge = () => {
    setShowBadge(false);
    // Store dismissal in localStorage
    localStorage.setItem('austinspireBadgeDismissed', 'true');
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and About */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img
                src={austLogo}
                alt="AUST Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="ml-2 text-xl font-clash-display font-bold">
                AUST
              </span>
            </Link>
            <p className="text-gray-300 mb-4">
              Advancing science, technology, and innovation in Africa. AUST is
              committed to academic excellence and research for a better
              continent.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/AUSTAbuja"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>

              {/* X (formerly Twitter) - our custom icon */}
              <a
                href="https://twitter.com/AUSTAbuja"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <XLogo className="h-5 w-5" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/AUSTAbuja"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@AUSTAbuja"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/programs"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Programs
                </Link>
              </li>
              <li>
                <Link
                  to="/campus"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Campus Life
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Programs</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/programs?tab=undergraduate"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Undergraduate Programs
                </Link>
              </li>
              <li>
                <Link
                  to="/programs?tab=postgraduate"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Postgraduate Programs
                </Link>
              </li>
              <li>
                <Link
                  to="/programs?tab=foundation"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Foundation and Remedial Studies Programs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0 text-primary" />
                <span className="text-gray-300">
                  Km 10 Airport Road, Galadimawa, Abuja, Nigeria
                </span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0 text-primary" />
                <a
                  href="tel:+2347012345678"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  +234 701 234 5678
                </a>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0 text-primary" />
                <a
                  href="mailto:admissions@aust.edu.ng"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  admissions@aust.edu.ng
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom section */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} African University of Science and
            Technology, Abuja. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
          {/* Lovable, cancelable badge */}
          {showBadge && (
            <div className="fixed bottom-4 right-4 z-50 animate-fade-in" style={{ animationDelay: '20s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-3 flex items-center space-x-3">
                <span className="text-[10px] sm:text-xs text-white/90">
                  Made with ❤️ by Austinspire
                </span>
                <button
                  onClick={handleDismissBadge}
                  className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
