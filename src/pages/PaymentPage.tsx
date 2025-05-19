import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PaystackButton } from "react-paystack";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const application = location.state?.application;

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">No Application Data</h2>
          <p className="mb-4">We couldn't find your application. Please sign in again.</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  // Use the correct Paystack public key for postgraduate
  let publicKey = "YOUR_PAYSTACK_PUBLIC_KEY";
  let reference = `aust_${Date.now()}`;
  if (application.program_type && application.program_type.toLowerCase().includes("postgraduate")) {
    publicKey = "pk_test_7fcc7a1fe3005ff3f99b088e7999c4add0d37bbd";
    reference = `postgraduate_${application.program_type?.toLowerCase() || ''}_${application.selected_program?.toLowerCase().replace(/\s+/g, '_') || ''}_${Date.now()}`;
  }
  const amount = 50000 * 100; // Amount in kobo (e.g., ₦50,000)
  const email = application.email;
  const name = `${application.surname} ${application.first_name}`;

  const handlePaymentSuccess = (reference: any) => {
    // TODO: Call your backend to verify payment and update application status
    // For now, redirect to progress page with has_paid true
    navigate("/application-progress", {
      state: { application: { ...application, has_paid: true } }
    });
  };

  const handleEdit = () => {
    const type = application.program_type?.toLowerCase();
    if (type && type.includes("postgraduate")) {
      navigate("/document-upload?type=postgraduate", { state: { application } });
    } else if (type && type.includes("foundation")) {
      navigate("/document-upload?type=foundation_remedial", { state: { application } });
    } else {
      navigate("/document-upload", { state: { application } });
    }
  };

  const paystackProps = {
    email,
    amount,
    publicKey,
    reference,
    text: "Pay with Paystack",
    onSuccess: handlePaymentSuccess,
    onClose: () => {},
    metadata: {
      custom_fields: [
        { display_name: "Name", variable_name: "name", value: name },
        { display_name: "Program", variable_name: "program", value: application.program_type },
      ],
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Application</h1>
        <div className="mb-6 p-4 bg-blue-50 rounded">
          <div className="mb-2 text-gray-700 font-medium">Application Summary</div>
          <div className="text-sm text-gray-600 mb-2">Name: <span className="font-semibold">{application.surname} {application.first_name}</span></div>
          <div className="text-sm text-gray-600 mb-2">Program: <span className="font-semibold">{application.program_type}</span></div>
          <div className="text-sm text-gray-600 mb-2">Email: <span className="font-semibold">{application.email}</span></div>
          <Button variant="outline" className="mt-2" onClick={handleEdit}>Edit Application</Button>
        </div>
        <h2 className="text-lg font-semibold mb-4 text-center">Payment Required</h2>
        <p className="mb-6 text-gray-700 text-center">You must complete payment to continue your application.</p>
        <PaystackButton {...paystackProps} className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition" />
      </div>
    </div>
  );
};

export default PaymentPage; 