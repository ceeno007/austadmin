import React from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ViewPDF = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pdfSrc = queryParams.get("src");
  const title = queryParams.get("title") || "Program Handbook";

  if (!pdfSrc) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-100 p-4">
        <div className="container mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">{title}</h1>
            <Button asChild variant="outline">
              <Link to="/programs" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
              </Link>
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <iframe
              title="PDF Viewer"
              src={`https://docs.google.com/gview?url=${window.location.origin}${pdfSrc}&embedded=true`}
              className="w-full h-[80vh] border-0 rounded-lg"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewPDF;
