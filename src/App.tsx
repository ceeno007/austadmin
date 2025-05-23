import React, { Suspense, lazy, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/ProtectedRoute";
import { HelmetProvider } from 'react-helmet-async';
import ConditionalNavbar from './components/ConditionalNavbar';
import ConditionalFooter from './components/ConditionalFooter';
import PerformanceOptimizer from './components/PerformanceOptimizer';
import { addResourceHints, registerServiceWorker } from './utils/performance';
import ProgramDetails from "./pages/ProgramDetails";
import ApplicationSuccess from '@/pages/ApplicationSuccess';
import ReferenceForm from "@/pages/ReferenceForm";
import ApplicationProgress from "@/pages/ApplicationProgress";
import PaymentPage from "@/pages/PaymentPage";
import ReferenceStatus from "@/pages/ReferenceStatus";
import PaymentSuccess from "@/pages/PaymentSuccess";
import FoundationSuccess from "@/pages/FoundationSuccess";

// Lazy load all page components for better performance
const Index = lazy(() => import('./pages/Index'));
const Programs = lazy(() => import('./pages/Programs'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ViewPDF = lazy(() => import('./pages/ViewPDF'));
const ApplicationForm = lazy(() => import("./pages/ApplicationForm"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CampusLife = lazy(() => import("./pages/CampusLife"));
const DocumentUpload = lazy(() => import("./pages/DocumentUpload"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Hostels = lazy(() => import("./pages/Hostels"));
const HostelImages = lazy(() => import("./pages/HostelImages"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5500]"></div>
  </div>
);

// Create a QueryClient instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// App Layout component that uses the location hook
const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);
  const isPaymentPage = ['/payment', '/payment-success', '/foundation-success'].includes(location.pathname);
  const isReferenceStatus = location.pathname === '/reference-status';
  const isDocumentUpload = location.pathname === '/document-upload';
  const isApplicationSuccess = location.pathname === '/application-success';

  // Add hardware acceleration to main content
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.style.transform = 'translateZ(0)';
      mainContent.style.backfaceVisibility = 'hidden';
      mainContent.style.perspective = '1000px';
      // Optimize for scrolling and content changes
      mainContent.style.willChange = 'transform, scroll-position, contents';
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!isAuthPage && !isPaymentPage && !isReferenceStatus && !isApplicationSuccess && <ConditionalNavbar />}
      <main className={`flex-grow ${!isAuthPage && !isDocumentUpload && !isReferenceStatus && !isApplicationSuccess ? 'pt-[72px]' : ''} bg-white`}>
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
          <Route path="/hostel-images" element={<HostelImages />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/application-success" element={<ApplicationSuccess />} />
          <Route path="/reference-status" element={
            <ProtectedRoute>
              <ReferenceStatus />
            </ProtectedRoute>
          } />

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

          {/* Program Details Route */}
          <Route path="/programs/:programId" element={<ProgramDetails />} />

          {/* Reference Form Route */}
          <Route path="/references/:uuid" element={<ReferenceForm />} />

          {/* Application Progress Route */}
          <Route path="/application-progress" element={<ApplicationProgress />} />

          {/* Payment Routes */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/foundation-success" element={<FoundationSuccess />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAuthPage && !isPaymentPage && !isReferenceStatus && !isApplicationSuccess && <ConditionalFooter />}
    </div>
  );
};

const App: React.FC = () => {
  // Initialize performance optimizations
  useEffect(() => {
    addResourceHints();
    registerServiceWorker();

    // Add global styles to prevent white flash
    const style = document.createElement('style');
    style.textContent = `
      html {
        background-color: #ffffff;
      }
      body {
        background-color: #ffffff;
        overflow-x: hidden;
      }
      * {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <BrowserRouter future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}>
            <AuthProvider>
              <PerformanceOptimizer>
                <Suspense fallback={<LoadingSpinner />}>
                  <AppLayout />
                </Suspense>
                <Toaster />
              </PerformanceOptimizer>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;