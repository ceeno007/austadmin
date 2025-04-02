
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
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
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-uni-purple to-uni-blue flex items-center justify-center text-white font-bold text-xl">U</div>
              <span className="ml-2 text-xl font-clash-display font-bold">UniNigeria</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="font-medium hover:text-primary transition-colors">About</Link>
            <Link to="/programs" className="font-medium hover:text-primary transition-colors">Programs</Link>
            <Link to="/campus" className="font-medium hover:text-primary transition-colors">Campus Life</Link>
            <Link to="/contact" className="font-medium hover:text-primary transition-colors">Contact</Link>
          </div>

          <div className="hidden md:flex items-center">
            <Button asChild variant="outline" className="mr-3">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-primary">
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
          <Link to="/about" className="block font-medium hover:text-primary">About</Link>
          <Link to="/programs" className="block font-medium hover:text-primary">Programs</Link>
          <Link to="/campus" className="block font-medium hover:text-primary">Campus Life</Link>
          <Link to="/contact" className="block font-medium hover:text-primary">Contact</Link>
          <div className="flex flex-col space-y-3 pt-2">
            <Button asChild variant="outline">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-primary">
              <Link to="/signup">Apply Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
