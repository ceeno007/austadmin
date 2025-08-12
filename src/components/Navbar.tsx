import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ExternalLink, Accessibility, Moon, SunMedium, Contrast, Check } from "lucide-react";
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

// At the top, import the lazy-loaded pages for preloading
const preloaders: Record<string, () => void> = {
  "/": () => import("@/pages/Index"),
  "/about": () => import("@/pages/About"),
  "/programs": () => import("@/pages/Programs"),
  "/campus": () => import("@/pages/CampusLife"),
  "/hostels": () => import("@/pages/Hostels"),
  "/contact": () => import("@/pages/Contact"),
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [scale, setScale] = useState<number>(1);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [colorFilter, setColorFilter] = useState<'none' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'grayscale'>('none');
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const location = useLocation();

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const isActive = useCallback((path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleStoreClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowStoreDialog(true);
  }, []);

  const handleConfirmNavigation = useCallback(() => {
    window.open("https://yahvebrand.store/aust-store", "_blank");
    setShowStoreDialog(false);
  }, []);

  const handleNavigation = useCallback((path: string) => {
    scrollToTop();
    setIsMenuOpen(false);
  }, [scrollToTop]);

  // Accessibility preferences helpers
  const applyScale = (scale: number) => {
    const html = document.documentElement;
    html.style.setProperty('--a11y-scale', String(scale));
    localStorage.setItem('a11y-scale', String(scale));
    setScale(scale);
  };

  const applyTheme = (mode: 'light' | 'dark') => {
    const html = document.documentElement;
    const isDark = mode === 'dark';
    html.classList.toggle('theme-dark', isDark);
    html.classList.toggle('dark', isDark); // Enable Tailwind dark: variants globally
    localStorage.setItem('a11y-theme', mode);
    setThemeMode(mode);
  };

  const applyContrast = (enabled: boolean) => {
    const html = document.documentElement;
    html.classList.toggle('a11y-high-contrast', enabled);
    localStorage.setItem('a11y-contrast', enabled ? 'high' : 'normal');
    setHighContrast(enabled);
  };

  const FILTERS: Record<string, string> = {
    none: 'none',
    deuteranopia: 'grayscale(20%) contrast(1.1) saturate(0.8)',
    protanopia: 'grayscale(20%) contrast(1.15) saturate(0.75) hue-rotate(-10deg)',
    tritanopia: 'grayscale(20%) contrast(1.15) saturate(0.75) hue-rotate(35deg)',
    grayscale: 'grayscale(100%) contrast(1.1)'
  };

  const applyFilter = (mode: keyof typeof FILTERS) => {
    const html = document.documentElement as HTMLElement;
    html.style.setProperty('--a11y-filter', FILTERS[mode]);
    localStorage.setItem('a11y-filter', mode);
    setColorFilter(mode);
  };

  const resetA11y = () => {
    applyScale(1);
    applyTheme('light');
    applyContrast(false);
    applyFilter('none');
  };

  React.useEffect(() => {
    // load saved preferences
    const savedScale = parseFloat(localStorage.getItem('a11y-scale') || '1');
    const theme = (localStorage.getItem('a11y-theme') as 'light' | 'dark') || 'light';
    const contrast = localStorage.getItem('a11y-contrast') === 'high';
    const filter = (localStorage.getItem('a11y-filter') as keyof typeof FILTERS) || 'none';
    applyScale(savedScale);
    applyTheme(theme);
    applyContrast(contrast);
    applyFilter(filter);
  }, []);

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
      <nav id="site-navigation" className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b shadow-sm will-change-transform" role="navigation" aria-label="Primary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src={austLogo} 
                  alt="AUST Logo" 
                  className="h-12 w-auto object-contain"
                  loading="eager"
                  width={48}
                  height={48}
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
                    onMouseEnter={() => preloaders[link.path]?.()}
                    onFocus={() => preloaders[link.path]?.()}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center gap-4">
                {/* Accessibility settings trigger */}
                <button
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5500]"
                  aria-label="Open accessibility settings"
                  onClick={() => setIsA11yOpen(true)}
                  title="Accessibility settings"
                >
                  <Accessibility className="h-5 w-5" />
                </button>
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
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5500]"
                onClick={toggleMenu}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                aria-controls="primary-navigation"
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
          <div id="primary-navigation" className="fixed top-[72px] left-0 right-0 bg-white/95 backdrop-blur-md border-b shadow-lg" role="dialog" aria-modal="true" aria-label="Mobile navigation">
              <div className="container mx-auto px-4 py-6 space-y-4">
              <button
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5500]"
                onClick={() => setIsA11yOpen(true)}
                aria-label="Open accessibility settings"
              >
                <Accessibility className="h-5 w-5" /> Accessibility settings
              </button>
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
                    onMouseEnter={() => preloaders[link.path]?.()}
                    onFocus={() => preloaders[link.path]?.()}
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

      {/* Accessibility Settings Dialog */}
      <Dialog open={isA11yOpen} onOpenChange={setIsA11yOpen}>
        <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] sm:w-full sm:max-w-lg rounded-2xl border-gray-200/50 shadow-xl">
          <DialogHeader>
            <DialogTitle>Accessibility</DialogTitle>
            <DialogDescription>Adjust display settings to suit your needs.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Text size */}
            <div>
              <h3 className="font-medium mb-2">Text size</h3>
              <div className="flex items-center gap-2">
                <Button aria-pressed={scale === 0.875} variant={scale === 0.875 ? 'default' : 'outline'} size="sm" onClick={() => applyScale(0.875)} className="flex items-center gap-2">{scale === 0.875 && <Check className="h-4 w-4"/>} Small</Button>
                <Button aria-pressed={scale === 1} variant={scale === 1 ? 'default' : 'outline'} size="sm" onClick={() => applyScale(1)} className="flex items-center gap-2">{scale === 1 && <Check className="h-4 w-4"/>} Default</Button>
                <Button aria-pressed={scale === 1.25} variant={scale === 1.25 ? 'default' : 'outline'} size="sm" onClick={() => applyScale(1.25)} className="flex items-center gap-2">{scale === 1.25 && <Check className="h-4 w-4"/>} Large</Button>
              </div>
            </div>

            {/* Theme */}
            <div>
              <h3 className="font-medium mb-2">Theme</h3>
              <div className="flex items-center gap-2">
                <Button aria-pressed={themeMode === 'light'} variant={themeMode === 'light' ? 'default' : 'outline'} size="sm" onClick={() => applyTheme('light')} className="flex items-center gap-2">{themeMode === 'light' && <Check className="h-4 w-4"/>}<SunMedium className="h-4 w-4"/> Light</Button>
                <Button aria-pressed={themeMode === 'dark'} variant={themeMode === 'dark' ? 'default' : 'outline'} size="sm" onClick={() => applyTheme('dark')} className="flex items-center gap-2">{themeMode === 'dark' && <Check className="h-4 w-4"/>}<Moon className="h-4 w-4"/> Dark</Button>
              </div>
            </div>

            {/* Contrast */}
            <div>
              <h3 className="font-medium mb-2">Contrast</h3>
              <div className="flex items-center gap-2">
                <Button aria-pressed={!highContrast} variant={!highContrast ? 'default' : 'outline'} size="sm" onClick={() => applyContrast(false)} className="flex items-center gap-2">{!highContrast && <Check className="h-4 w-4"/>}<Contrast className="h-4 w-4"/> Normal</Button>
                <Button aria-pressed={highContrast} variant={highContrast ? 'default' : 'outline'} size="sm" onClick={() => applyContrast(true)} className="flex items-center gap-2">{highContrast && <Check className="h-4 w-4"/>}<Contrast className="h-4 w-4"/> High</Button>
              </div>
            </div>

            {/* Color vision */}
            <div>
              <h3 className="font-medium mb-2">Color vision</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Button aria-pressed={colorFilter === 'none'} variant={colorFilter === 'none' ? 'default' : 'outline'} size="sm" onClick={() => applyFilter('none')} className="flex items-center gap-2">{colorFilter === 'none' && <Check className="h-4 w-4"/>} Normal</Button>
                <Button aria-pressed={colorFilter === 'deuteranopia'} variant={colorFilter === 'deuteranopia' ? 'default' : 'outline'} size="sm" onClick={() => applyFilter('deuteranopia')} className="flex items-center gap-2">{colorFilter === 'deuteranopia' && <Check className="h-4 w-4"/>} Deuteranopia</Button>
                <Button aria-pressed={colorFilter === 'protanopia'} variant={colorFilter === 'protanopia' ? 'default' : 'outline'} size="sm" onClick={() => applyFilter('protanopia')} className="flex items-center gap-2">{colorFilter === 'protanopia' && <Check className="h-4 w-4"/>} Protanopia</Button>
                <Button aria-pressed={colorFilter === 'tritanopia'} variant={colorFilter === 'tritanopia' ? 'default' : 'outline'} size="sm" onClick={() => applyFilter('tritanopia')} className="flex items-center gap-2">{colorFilter === 'tritanopia' && <Check className="h-4 w-4"/>} Tritanopia</Button>
                <Button aria-pressed={colorFilter === 'grayscale'} variant={colorFilter === 'grayscale' ? 'default' : 'outline'} size="sm" onClick={() => applyFilter('grayscale')} className="flex items-center gap-2">{colorFilter === 'grayscale' && <Check className="h-4 w-4"/>} Grayscale</Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" onClick={resetA11y}>Reset all</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default React.memo(Navbar);
