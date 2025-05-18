import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, ChevronLeft, ArrowLeft, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/SEO";
import { programs, type Program } from "@/data/programs";
import { motion, AnimatePresence } from 'framer-motion';

const ProgramDetails: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (!programId) {
      navigate("/programs");
      return;
    }

    // Find program by ID
    const foundProgram = programs.find(p => p.id === programId);

    if (foundProgram) {
      setProgram(foundProgram);
      // Scroll to top when program changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.error("Program not found:", programId);
      navigate("/programs");
    }
  }, [programId, navigate]);

  const handleBackClick = () => {
    if (!program) return;
    
    // Determine which tab to return to based on program category
    let tab = 'undergraduate';
    if (program.category === 'postgraduate') {
      tab = 'postgraduate';
    } else if (program.category === 'foundation' || program.category === 'jupeb') {
      tab = 'foundation';
    }
    
    navigate(`/programs?tab=${tab}`);
  };

  if (!program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="relative h-[60vh] bg-gray-900 rounded-b-3xl shadow-lg overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto grid gap-10">
            <div className="bg-white/90 rounded-2xl shadow-lg p-10 border border-gray-100">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg p-10 border border-gray-100">
              <Skeleton className="h-8 w-64 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg p-10 border border-gray-100">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <SEO
        title={`${program.title} | AUST`}
        description={program.description}
        url={`/programs/${program.id}`}
      />
      <div className="relative h-[60vh] bg-gray-900 rounded-b-3xl shadow-lg overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={program.image}
            alt={program.title}
            className="w-full h-full object-cover opacity-60 scale-105 blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />
        </div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              className="text-white hover:text-white/80 mb-8 bg-black/30 hover:bg-black/40 backdrop-blur-md"
              onClick={handleBackClick}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Programs
            </Button>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
                {program.title}
              </h1>
              <p className="text-xl text-white/80 font-medium">
                Duration: {program.duration}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto grid gap-10">
          <div className="bg-white/90 rounded-2xl shadow-lg p-10 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-[#FF5500]">Program Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Duration</h3>
                <p className="text-gray-700">{program.duration}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Level</h3>
                <p className="text-gray-700">{program.level}</p>
              </div>
              {program.schoolFees && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">School Fees</h3>
                  <p className="text-gray-700">{program.schoolFees}</p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white/90 rounded-2xl shadow-lg p-10 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-[#FF5500] flex items-center gap-2">
              <FileText className="h-6 w-6 text-[#FF5500]" /> Program Description
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {program.description}
            </p>
          </div>
          <div className="bg-white/90 rounded-2xl shadow-lg p-10 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-[#FF5500]">Entry Requirements</h2>
            <ul className="space-y-3">
              {program.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#FF5500] mr-2 mt-1">•</span>
                  <span className="text-gray-700 text-base">{req}</span>
                </li>
              ))}
            </ul>
          </div>
          {program.faqs && program.faqs.length > 0 && (
            <div className="bg-white/90 rounded-2xl shadow-lg p-10 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-[#FF5500]">Frequently Asked Questions</h2>
              <div className="space-y-8">
                {program.faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-700 text-base">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {program.pdf && (
            <div className="bg-white/90 rounded-2xl shadow-lg p-10 border border-gray-100 flex flex-col items-start">
              <h2 className="text-2xl font-bold mb-4 text-[#FF5500] flex items-center gap-2">
                <Download className="h-6 w-6 text-[#FF5500]" /> Program Brochure
              </h2>
              <p className="text-gray-700 mb-6 text-base">
                Download our detailed program brochure for more information about this program.
              </p>
              <Button
                className="bg-[#FF5500] hover:bg-[#FF5500]/90 text-white px-6 py-2 rounded-lg shadow-md"
                onClick={() => window.open(program.pdf, '_blank')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Brochure
              </Button>
            </div>
          )}
          <div className="bg-white/90 rounded-2xl shadow-lg p-10 border border-gray-100 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#FF5500]">Ready to Apply?</h2>
            <p className="text-gray-700 mb-8 max-w-2xl">
              Take the first step towards your future at AUST. Our application process is straightforward and our admissions team is here to help you every step of the way.
            </p>
            <Button
              variant="outline"
              className="border-2 border-[#FF5500] text-[#FF5500] hover:bg-[#FF5500] hover:text-white px-8 py-6 text-lg rounded-lg transition-all duration-200"
              onClick={() => navigate('/signup')}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails; 