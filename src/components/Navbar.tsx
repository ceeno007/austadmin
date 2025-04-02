
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Book, GraduationCap, Building, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="relative z-20 w-full backdrop-blur-md bg-white/80 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/6a1e28f7-230a-4381-a505-3a8a8586f90c.png" 
                alt="AUST Logo" 
                className="h-12 w-12 object-contain"
              />
              <span className="ml-2 text-xl font-clash-display font-bold">AUST Abuja</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Book className="h-4 w-4" />
              About
            </Link>
            <Link to="/programs" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              Programs
            </Link>
            <Link to="/campus" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Building className="h-4 w-4" />
              Campus Life
            </Link>
            <Link to="/contact" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Phone className="h-4 w-4" />
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Button asChild variant="outline" className="mr-3">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-[#FF5500] hover:bg-[#e64d00]">
              <Link to="/signup">Apply Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
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
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 invisible'} overflow-hidden`}>
        <div className="container mx-auto px-4 py-4 space-y-4">
          <Link to="/" className="block font-medium hover:text-primary">Home</Link>
          <Link to="/about" className="block font-medium hover:text-primary flex items-center">
            <Book className="h-4 w-4 mr-2" /> About
          </Link>
          <Link to="/programs" className="block font-medium hover:text-primary flex items-center">
            <GraduationCap className="h-4 w-4 mr-2" /> Programs
          </Link>
          <Link to="/campus" className="block font-medium hover:text-primary flex items-center">
            <Building className="h-4 w-4 mr-2" /> Campus Life
          </Link>
          <Link to="/contact" className="block font-medium hover:text-primary flex items-center">
            <Phone className="h-4 w-4 mr-2" /> Contact
          </Link>
          <div className="flex flex-col space-y-3 pt-2">
            <Button asChild variant="outline">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-[#FF5500] hover:bg-[#e64d00]">
              <Link to="/signup">Apply Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
