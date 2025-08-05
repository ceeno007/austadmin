import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PaystackConsumer } from "react-paystack";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import PaymentSuccessPopup from "@/components/PaymentSuccessPopup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiService from '@/services/api';
import axios from 'axios';

// Import API endpoints
const API_ENDPOINTS = {
  INITIALIZE_PAYMENT: 'https://admissions-jcvy.onrender.com/payments/initialize'
};

interface PaymentMetadata {
  applicationType: string;
  programType: string;
  program: string;
  academicSession: string;
  application_id: string;
  user_id: string;
}

interface PaymentResponse {
  reference: string;
  status: string;
  data: any;
}

type Residency = "nigeria" | "international";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const application = location.state?.application;
  const [residency, setResidency] = useState<Residency>("nigeria");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    // Store the application data in localStorage when component mounts
    if (application) {
      localStorage.setItem('applicationData', JSON.stringify(application));
    }
  }, [application]);

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

  const programType = application.program_type?.toLowerCase() || "undergraduate";

  const getAmount = () => {
    switch (programType) {
      case "phd":
        return residency === "nigeria" ? 2000000 : 0;
      case "msc":
        return residency === "nigeria" ? 2000000 : 5000;
      case "foundation":
      case "jupeb":
        return residency === "nigeria" ? 1000000 : 0;
      default:
        return 0;
    }
  };

  const getCurrency = () =>
    residency === "international" && programType === "msc" ? "USD" : "NGN";

  const createReference = () => {
    return `${programType.substring(0, 3)}_${Date.now()}`;
  };

  const redirectToSuccessPage = () => {
    if (programType === "phd") return navigate("/reference-status");
    if (programType === "foundation" || programType === "jupeb")
      return navigate("/foundation-success");
    return navigate("/payment-success");
  };

  const handlePaymentSuccess = (reference: string) => {
    // Show success message
    toast({
      title: "Success",
      description: "Payment successful!",
      variant: "default",
    });
    
    // Navigate to application success page
    navigate('/application-success', { 
      state: { 
        application: application,
        paymentReference: reference
      },
      replace: true 
    });
  };

  const handlePaymentAsNigerian = async () => {
    try {
      setIsProcessingPayment(true);
      
      // Get the token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error("No authentication token found");
      }

      const amount = 50000; // ₦50,000 in kobo
      const email = application.email;
      const metadata: PaymentMetadata = {
        applicationType: application.application_type,
        programType: application.program_type,
        program: application.program,
        academicSession: application.academic_session,
        application_id: application.id,
        user_id: application.user_id
      };

      // Initialize payment
      const response = await axios.post<PaymentResponse>(
        API_ENDPOINTS.INITIALIZE_PAYMENT,
        {
          amount,
          email,
          metadata
        },
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Open Paystack payment window
      const handler = window.PaystackPop.setup({
        key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
        email,
        amount: amount * 100, // Convert to kobo
        currency: 'NGN',
        ref: response.data.reference,
        callback: (response: any) => {
          handlePaymentSuccess(response.reference);
        },
        onClose: () => {
          setIsProcessingPayment(false);
          toast({
            title: "Payment Cancelled",
            description: "Payment window closed",
            variant: "default",
          });
        }
      });
      
      handler.openIframe();
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentAsInternational = async () => {
    try {
      setIsProcessingPayment(true);
      
      // Get the token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error("No authentication token found");
      }

      const amount = 100; // $100
      const email = application.email;
      const metadata: PaymentMetadata = {
        applicationType: application.application_type,
        programType: application.program_type,
        program: application.program,
        academicSession: application.academic_session,
        application_id: application.id,
        user_id: application.user_id
      };

      // Initialize payment
      const response = await axios.post<PaymentResponse>(
        API_ENDPOINTS.INITIALIZE_PAYMENT,
        {
          amount,
          email,
          metadata
        },
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Open Paystack payment window
      const handler = window.PaystackPop.setup({
        key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
        email,
        amount: amount * 100, // Convert to cents
        currency: 'USD',
        ref: response.data.reference,
        reference: response.data.reference,
        callback: (response: any) => {
          handlePaymentSuccess(response.reference);
        },
        onClose: () => {
          setIsProcessingPayment(false);
          toast({
            title: "Payment Cancelled",
            description: "Payment window closed",
            variant: "default",
          });
        }
      });
      
      handler.openIframe();
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessingPayment(false);
    }
  };

  // No payment needed for undergrads or intl foundation
  if (
    programType === "undergraduate" ||
    (programType === "foundation" && residency === "international")
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Application Complete
          </h1>

          {/* Application Summary */}
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
            <Button
              variant="outline"
              className="mt-2"
              onClick={() =>
                navigate("/document-upload", { state: { application } })
              }
            >
              Edit Application
            </Button>
          </div>

          <p className="text-center text-gray-700">
            No payment required for this program.
          </p>
        </div>
      </div>
    );
  }

  const config = {
    reference: createReference(),
    email: application.email,
    amount: getAmount(),
    currency: getCurrency(),
    publicKey: "pk_test_7fcc7a1fe3005ff3f99b088e7999c4add0d37bbd",
    metadata: {
      custom_fields: [
        {
          display_name: "Program Type",
          variable_name: "program_type",
          value: programType
        },
        {
          display_name: "Residency",
          variable_name: "residency",
          value: residency
        },
        {
          display_name: "Timestamp",
          variable_name: "timestamp",
          value: new Date().toISOString()
        }
      ]
    },
    onSuccess: () => {
      handlePaymentSuccess(createReference());
    },
    onClose: () => {
      toast({
        title: "Payment Cancelled",
        description: "You can try again when you're ready.",
        variant: "destructive",
        duration: 5000,
      });
    },
  };

  const payButtonText = (() => {
    if (programType === "phd" || programType === "msc") {
      return residency === "nigeria" ? "₦20,000" : "$50";
    }
    if (programType === "foundation") {
      return "₦10,000";
    }
    return "Free";
  })();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Application Fee Payment</h1>
            <Button
              variant="outline"
              onClick={() => {
                const formType = programType === "foundation" || programType === "jupeb"
                  ? "foundation"
                  : programType === "phd" || programType === "msc"
                  ? "postgraduate"
                  : "undergraduate";
                
                // Get the stored application data
                const storedData = localStorage.getItem('applicationData');
                const applicationData = storedData ? JSON.parse(storedData) : application;
                
                // For foundation form, navigate to the foundation form directly
                if (formType === "foundation") {
                  navigate("/foundation-form", {
                    state: {
                      application: applicationData,
                      savedFormData: applicationData,
                      isEdit: true
                    }
                  });
                } else {
                  navigate(`/document-upload?type=${formType}`, {
                    state: {
                      application: applicationData,
                      savedFormData: applicationData
                    }
                  });
                }
              }}
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m15 18-6-6 6-6"/></svg>
              Back
            </Button>
          </div>

          {/* Application Summary */}
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
          </div>

          {/* Residency Selector */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Your Residency</Label>
              <Select
                value={residency}
                onValueChange={(v: Residency) => setResidency(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Residency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nigeria">Nigeria</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <h2 className="text-lg font-semibold text-center">Payment Required</h2>
            <p className="text-gray-700 text-center">
              You must complete payment to continue your application.
            </p>

            <PaystackConsumer {...config}>
              {({ initializePayment }) => (
                <Button
                  onClick={() => initializePayment()}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Pay {payButtonText} Application Fee
                </Button>
              )}
            </PaystackConsumer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
