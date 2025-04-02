
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="text-9xl font-clash-display font-bold gradient-text">404</div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Page not found</h1>
        <p className="text-gray-600 mb-8">
          Oops! We can't seem to find the page you're looking for.
        </p>
        <Button asChild className="bg-primary">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to homepage
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
