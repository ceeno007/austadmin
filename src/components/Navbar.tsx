import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ExternalLink } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import austLogo from "@/assets/images/austlogo.webp";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleStoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowStoreDialog(true);
  };

  const handleConfirmNavigation = () => {
    window.open("https://yahvebrand.store/aust-store", "_blank");
    setShowStoreDialog(false);
  };

  const handleNavigation = (path: string) => {
    scrollToTop();
    setIsMenuOpen(false);
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/programs", label: "Programs" },
    { path: "/campus", label: "Campus Life" },
    { path: "/hostels", label: "Hostels" },
    { path: "/contact", label: "Contact" },
    { 
      path: "https://yahvebrand.store/aust-store", 
      label: "Store",
      external: true 
    },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b shadow-sm">
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
                link.external ? (
                  <a 
                    key={link.path}
                    href={link.path} 
                    onClick={handleStoreClick}
                    className={cn(
                      "font-medium transition-colors hover:text-[#FF5500]"
                    )}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={cn(
                      "font-medium transition-colors",
                      isActive(link.path) ? "text-[#FF5500]" : "hover:text-[#FF5500]"
                    )}
                    onClick={() => handleNavigation(link.path)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-[#FF5500] hover:bg-[#e64d00]">
                  <Link to="/signup">Apply Now</Link>
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-4">
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
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="fixed top-[72px] left-0 right-0 bg-white/95 backdrop-blur-md border-b shadow-lg">
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                link.external ? (
                  <a 
                    key={link.path}
                    href={link.path} 
                    onClick={(e) => {
                      handleStoreClick(e);
                      setIsMenuOpen(false);
                    }}
                    className="block font-medium transition-colors py-3 px-4 rounded-lg hover:bg-gray-50 hover:text-[#FF5500]"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={cn(
                      "block font-medium transition-colors py-3 px-4 rounded-lg",
                      isActive(link.path) ? "text-[#FF5500] bg-gray-50" : "hover:bg-gray-50 hover:text-[#FF5500]"
                    )}
                    onClick={() => handleNavigation(link.path)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <div className="pt-6 space-y-3">
                <Button asChild variant="outline" className="w-full rounded-xl">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="w-full rounded-xl bg-[#FF5500] hover:bg-[#e64d00]">
                  <Link to="/signup">Apply Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showStoreDialog} onOpenChange={setShowStoreDialog}>
        <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] sm:w-full sm:max-w-md rounded-2xl border-gray-200/50 shadow-xl">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold">External Link</DialogTitle>
            <DialogDescription className="text-gray-600">
              You are about to visit the AUST Store on an external website. Would you like to continue?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-3 mt-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <DialogClose asChild>
                <Button variant="secondary" className="w-full sm:w-auto">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleConfirmNavigation}
                className="w-full sm:w-auto bg-[#FF5500] hover:bg-[#e64d00] flex items-center gap-2"
              >
                Continue to Store
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
