import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
  onPaymentSuccess: (reference: string) => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: any) => {
        openIframe: () => void;
      };
    };
  }
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  application,
  onPaymentSuccess,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [residency, setResidency] = useState<'nigeria' | 'international'>('nigeria');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaystack, setShowPaystack] = useState(false);

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePaymentAsNigerian = async () => {
    try {
      setIsProcessingPayment(true);
      const amount = 2000000; // ₦20,000 in kobo
      const email = application.personalDetails?.email || application.user?.email || '';
      const phone = application.personalDetails?.phoneNumber || '';
      const name = `${application.personalDetails?.firstName || ''} ${application.personalDetails?.lastName || application.personalDetails?.surname || ''}`;
      const reference = `PG_${Date.now()}`;
      const programType = localStorage.getItem("programType") || "postgraduate";

      const config = {
        key: 'pk_test_7fcc7a1fe3005ff3f99b088e7999c4add0d37bbd', // Your Paystack public key
        email,
        amount,
        currency: 'NGN',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Program",
              variable_name: "program",
              value: application.program || programType
            },
            {
              display_name: "Academic Session",
              variable_name: "academic_session",
              value: application.academicSession || ''
            }
          ]
        },
        customer: {
          email,
          phone,
          name
        },
        callback: (response: any) => {
          // Handle successful payment
          localStorage.setItem("paymentCompleted", "true");
          localStorage.setItem("paymentReference", response.reference);
          onPaymentSuccess(response.reference);
          setShowPaystack(false);
          onClose();
          navigate("/application-success");
        },
        onClose: () => {
          setIsProcessingPayment(false);
          setShowPaystack(false);
          toast({
            title: "Payment Cancelled",
            description: "You can try again when you're ready",
            variant: "default",
          });
        }
      };

      if (window.PaystackPop) {
        setShowPaystack(true);
        const handler = window.PaystackPop.setup(config);
        handler.openIframe();
      } else {
        throw new Error('Paystack script not loaded');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "An error occurred while processing your payment",
        variant: "destructive",
      });
      setIsProcessingPayment(false);
      setShowPaystack(false);
    }
  };

  const handlePaymentAsInternational = async () => {
    try {
      setIsProcessingPayment(true);
      const amount = 5000; // $50 in cents
      const email = application.personalDetails?.email || application.user?.email || '';
      const phone = application.personalDetails?.phoneNumber || '';
      const name = `${application.personalDetails?.firstName || ''} ${application.personalDetails?.lastName || application.personalDetails?.surname || ''}`;
      const reference = `PG_INT_${Date.now()}`;
      const programType = localStorage.getItem("programType") || "postgraduate";

      const config = {
        key: 'pk_test_7fcc7a1fe3005ff3f99b088e7999c4add0d37bbd', // Your Paystack public key
        email,
        amount,
        currency: 'USD',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Program",
              variable_name: "program",
              value: application.program || programType
            },
            {
              display_name: "Academic Session",
              variable_name: "academic_session",
              value: application.academicSession || ''
            }
          ]
        },
        customer: {
          email,
          phone,
          name
        },
        callback: (response: any) => {
          // Handle successful payment
          localStorage.setItem("paymentCompleted", "true");
          localStorage.setItem("paymentReference", response.reference);
          onPaymentSuccess(response.reference);
          setShowPaystack(false);
          onClose();
        },
        onClose: () => {
          setIsProcessingPayment(false);
          setShowPaystack(false);
          toast({
            title: "Payment Cancelled",
            description: "You can try again when you're ready",
            variant: "default",
          });
        }
      };

      if (window.PaystackPop) {
        setShowPaystack(true);
        const handler = window.PaystackPop.setup(config);
        handler.openIframe();
      } else {
        throw new Error('Paystack script not loaded');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "An error occurred while processing your payment",
        variant: "destructive",
      });
      setIsProcessingPayment(false);
      setShowPaystack(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen && !showPaystack} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Application Fee Payment</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Please complete your payment to proceed with your application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Your Residency</Label>
              <Select
                value={residency}
                onValueChange={(value: 'nigeria' | 'international') => setResidency(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your residency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nigeria">Nigeria</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800 space-y-2">
                <strong>Application Fees (Non-refundable):</strong>
                <br />
                <span className="block mt-2">
                  <strong>Nigerian Applicants:</strong> ₦20,000 (Application Fee Only)
                </span>
                <span className="block mt-1">
                  <strong>International Applicants:</strong> $50 (Application Fee Only)
                </span>
                <div className="mt-4">
                  <p className="font-medium">Payment Process:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Payment will be processed through Paystack</li>
                    <li>The Paystack payment window will open when you click "Pay Now"</li>
                    <li>A payment receipt will be automatically generated after successful payment</li>
                  </ul>
                </div>
              </p>
            </div>

            {residency === 'nigeria' ? (
              <Button
                onClick={handlePaymentAsNigerian}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  "Pay ₦20,000"
                )}
              </Button>
            ) : (
              <Button
                onClick={handlePaymentAsInternational}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  "Pay $50"
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showPaystack && (
        <div 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
        />
      )}
    </>
  );
};

export default PaymentModal; 