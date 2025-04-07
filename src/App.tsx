import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { 
  HashRouter as Router,  // <-- Use HashRouter
  Routes, 
  Route 
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ApplicationForm from "./pages/ApplicationForm";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Programs from "./pages/Programs";
import CampusLife from "./pages/CampusLife";
import Contact from "./pages/Contact";
import ViewPDF from "./pages/ViewPDF";
import DocumentUpload from "./pages/DocumentUpload";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Sitemap from "./pages/Sitemap";
import ForgotPassword from "./pages/ForgotPassword";
import Hostels from "./pages/Hostels";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            {/*
              Use HashRouter instead of BrowserRouter
              So direct URLs like chino.com/#/programs 
              won't lead to a 404 on servers that don't have rewrite rules
            */}
            <Router>
              <AuthProvider>
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
                  <Route
                    path="/application"
                    element={
                      <ProtectedRoute>
                        <ApplicationForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/document-upload"
                    element={
                      <ProtectedRoute>
                        <DocumentUpload />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/view-pdf" element={<ViewPDF />} />

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </Router>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
