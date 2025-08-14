import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ViewPDF = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pdfSrc = queryParams.get("src");
  const title = queryParams.get("title") || "Program Handbook";
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    if (pdfSrc) {
      // Use exactly what was provided (no prefixing)
      setPdfUrl(pdfSrc);
    }
  }, [pdfSrc]);

  if (!pdfSrc) {
    return (
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error: No PDF Source</h1>
          <p className="text-gray-600 mb-6">The PDF source was not provided.</p>
          <Button asChild>
            <Link to="/programs" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-gray-100 p-4">
      <div className="container mx-auto">
        {/* Header section becomes more responsive on small screens */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">{title}</h1>
          <Button asChild variant="outline">
            <Link to="/programs" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg p-4">
          {/* Object wrapper for the PDF; reduced height on mobile */}
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-[60vh] sm:h-[80vh] border-0 rounded-lg"
          >
            <iframe 
              src={pdfUrl} 
              className="w-full h-[60vh] sm:h-[80vh] border-0 rounded-lg"
              title={title}
            >
              <div className="text-center p-4">
                <p className="mb-4">It appears you don't have a PDF plugin for this browser.</p>
                <Button asChild>
                  <a href={pdfUrl} download className="flex items-center">
                    Download PDF
                  </a>
                </Button>
              </div>
            </iframe>
          </object>
        </div>
      </div>
    </main>
  );
};

export default ViewPDF;
