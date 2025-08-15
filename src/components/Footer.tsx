import React, { useState, useEffect, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, X } from "lucide-react";
import austLogo from "@/assets/images/austlogo.webp";

// Custom X (Twitter) logo component
const XLogo = memo(() => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
));

XLogo.displayName = 'XLogo';

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

  const handleDismissBadge = useCallback(() => {
    setShowBadge(false);
    localStorage.setItem('austinspireBadgeDismissed', 'true');
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-6">
          <img
            src={austLogo}
            alt="AUST Logo"
            className="h-12 w-auto object-contain"
            loading="eager"
            width={48}
            height={48}
          />
        </div>
        <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
          African University of Science and Technology, Abuja.
        </p>
        <div className="border-t border-gray-800 pt-6 mt-6">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AUST. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
