import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PaystackConsumer } from "react-paystack";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import PaymentSuccessPopup from "@/components/PaymentSuccessPopup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Residency = "nigeria" | "international";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const application = location.state?.application;
  const [residency, setResidency] = useState<Residency>("nigeria");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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

  const handlePaymentSuccess = (referenceObj: any) => {
    console.log("Handling payment success with:", referenceObj);
    const paymentRef = referenceObj.reference || referenceObj.trxref || referenceObj;
    
    // Save payment data
    localStorage.setItem("paymentCompleted", "true");
    localStorage.setItem("paymentReference", paymentRef);
    localStorage.setItem(
      "paymentData",
      JSON.stringify({
        reference: paymentRef,
        programType,
        amount: getAmount(),
        currency: getCurrency(),
        timestamp: new Date().toISOString(),
      })
    );

    // Show success popup
    setShowSuccessPopup(true);
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    // Clear auth data and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleClose = () => {
    // Get the saved application data from localStorage
    const savedApplicationData = localStorage.getItem("applicationData");
    const applicationData = savedApplicationData ? JSON.parse(savedApplicationData) : application;
    
    // Navigate back to payment page with the application data
    navigate('/payment', { 
      state: { 
        application: applicationData
      }
    });

    toast({
      title: "Payment Cancelled",
      description: "You can try again when you're ready.",
      variant: "destructive",
      duration: 5000,
    });
  };

  // Handle Paystack redirect callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    const status = params.get("status");
    
    if (reference && status === "success") {
      console.log("Payment successful with reference:", reference);
      handlePaymentSuccess({ reference });
    }
  }, []);

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
      handlePaymentSuccess({ reference: config.reference });
    },
    onClose: handleClose,
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
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Complete Your Application
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
            {/* <Button
              variant="outline"
              className="mt-2"
              onClick={() => {
                // Get the saved application data from localStorage
                const savedApplicationData = localStorage.getItem("applicationData");
                const applicationData = savedApplicationData ? JSON.parse(savedApplicationData) : application;
                
                navigate(
                  `/document-upload?type=${
                    programType === "foundation" || programType === "jupeb"
                      ? "foundation"
                      : programType === "phd" || programType === "msc"
                      ? "postgraduate"
                      : "undergraduate"
                  }`,
                  { 
                    state: { 
                      application: applicationData,
                      savedFormData: applicationData
                    }
                  }
                );
              }}
            >
              Edit Application
            </Button> */}
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
      <PaymentSuccessPopup 
        isOpen={showSuccessPopup} 
        onClose={handleSuccessPopupClose} 
      />
    </>
  );
};

export default PaymentPage;
