import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import austLogo from "@/assets/images/austlogo.webp";

const Index = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/login");
  };

  // Compute academic session dynamically (e.g., 2025/2026)
  const now = new Date();
  const currentYear = now.getFullYear();
  const sessionLabel = `${currentYear}/${currentYear + 1}`;

  return (
    <main className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-2xl shadow-md border p-8 md:p-12 text-center">
          <div className="flex items-center justify-center">
            <img src={austLogo} alt="AUST Logo" className="h-16 w-auto object-contain" />
          </div>

          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-4 py-1.5 text-gray-700">
            <span className="text-sm font-medium">Admissions {sessionLabel} now open</span>
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight">Start your journey</h1>

          <div className="mx-auto mt-10 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
            <Button onClick={() => navigate("/signup")} className="h-12 rounded-xl text-base bg-[#FF5500] hover:bg-[#e64d00]">
              <PlayCircle className="mr-2 h-5 w-5" /> Start application
            </Button>
            <Button onClick={handleContinue} variant="secondary" className="h-12 rounded-xl text-base border border-gray-200">
              <ArrowRight className="mr-2 h-5 w-5" /> Continue where you stopped
            </Button>
          </div>

          <p className="mt-6 text-sm text-gray-500">Returning applicants can continue after signing in.</p>
        </div>
      </div>
    </main>
  );
};

export default Index;