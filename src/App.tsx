import React, { Suspense, lazy } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { lazyLoad } from "@/utils/performance";
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Index from './pages/Index';
import Programs from './pages/Programs';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ViewPDF from './pages/ViewPDF';

// Lazy load components for code splitting
const ApplicationForm = lazy(() => import("./pages/ApplicationForm"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CampusLife = lazy(() => import("./pages/CampusLife"));
const DocumentUpload = lazy(() => import("./pages/DocumentUpload"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Hostels = lazy(() => import("./pages/Hostels"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5500]"></div>
  </div>
);

// Create a new QueryClient instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create a component to conditionally render the Navbar
const ConditionalNavbar = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Don't show Navbar on these routes
  const noNavbarRoutes = [
    '/document-upload',
    '/application'
  ];
  
  if (noNavbarRoutes.includes(path)) {
    return null;
  }
  
  return <Navbar />;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <LanguageProvider>
            <BrowserRouter>
              <AuthProvider>
                <Suspense fallback={<LoadingSpinner />}>
                  <div className="flex flex-col min-h-screen">
                    <ConditionalNavbar />
                    <main className="flex-grow">
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/programs" element={<Programs />} />
                        <Route path="/campus" element={<CampusLife />} />
                        <Route path="/hostels" element={<Hostels />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/sitemap" element={<Sitemap />} />

                        {/* Protected Routes */}
                        <Route path="/application" element={
                          <ProtectedRoute>
                            <ApplicationForm />
                          </ProtectedRoute>
                        } />
                        <Route path="/document-upload" element={
                          <ProtectedRoute>
                            <DocumentUpload />
                          </ProtectedRoute>
                        } />
                        <Route path="/view-pdf" element={<ViewPDF />} />

                        {/* Catch-all route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </Suspense>
                <Toaster 
                  position="top-right"
                  expand={true}
                  richColors
                  closeButton
                />
              </AuthProvider>
            </BrowserRouter>
          </LanguageProvider>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App; 