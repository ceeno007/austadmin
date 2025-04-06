import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import austLogo from "@/assets/images/austlogo.webp";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const navLinks = [
    { path: "/", label: t('home') },
    { path: "/about", label: t('about') },
    { path: "/programs", label: t('programs') },
    { path: "/campus", label: t('campusLife') },
    { path: "/hostels", label: t('hostels') },
    { path: "/contact", label: t('contact') },
  ];

  return (
    <nav className="relative z-20 w-full backdrop-blur-md bg-white/80 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={austLogo} 
                alt="AUST Logo" 
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={cn(
                  "font-medium transition-colors",
                  isActive(link.path) ? "text-[#FF5500]" : "hover:text-[#FF5500]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center gap-4">
              {/* Language Toggle - Commented out
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              >
                <Globe className="h-4 w-4 mr-2" />
                {language.toUpperCase()}
              </Button>
              */}
              <Button asChild variant="outline" size="sm">
                <Link to="/login">{t('login')}</Link>
              </Button>
              <Button asChild size="sm" className="bg-[#FF5500] hover:bg-[#e64d00]">
                <Link to="/signup">{t('applyNow')}</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Language Toggle - Commented out
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="text-gray-600 hover:text-gray-900"
            >
              <Globe className="h-5 w-5" />
              <span className="ml-2 text-sm font-medium">{language.toUpperCase()}</span>
            </Button>
            */}
            <button 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={cn(
                  "block font-medium transition-colors",
                  isActive(link.path) ? "text-[#FF5500]" : "hover:text-[#FF5500]"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">{t('login')}</Link>
              </Button>
              <Button asChild className="w-full bg-[#FF5500] hover:bg-[#e64d00]">
                <Link to="/signup">{t('applyNow')}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
