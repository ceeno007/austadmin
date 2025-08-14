import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const FoundationSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { application, paymentReference } = location.state || {};

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">No Application Data</h2>
          <p className="mb-4">
            We couldn't find your application. Please sign in again.
          </p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Application Complete!</h1>
          <p className="text-gray-600">
            Your foundation application has been submitted successfully.
          </p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded">
          <div className="mb-2 text-gray-700 font-medium">
            Application Summary
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Name:{" "}
            <span className="font-semibold">
              {application.surname} {application.first_name}
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Program:{" "}
            <span className="font-semibold">{application.program_type}</span>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Email:{" "}
            <span className="font-semibold">{application.email}</span>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Payment Reference:{" "}
            <span className="font-semibold">{paymentReference}</span>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full"
            onClick={() => navigate("/login")}
          >
            Sign In to Continue
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/")}
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoundationSuccess; 