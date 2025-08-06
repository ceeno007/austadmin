import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

// Declare Squad widget globally
declare global {
  interface Window {
    squad: any;
  }
}

interface SquadPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
  onPaymentSuccess: (reference: string) => void;
}

const SquadPaymentModal: React.FC<SquadPaymentModalProps> = ({
  isOpen,
  onClose,
  application,
  onPaymentSuccess,
}) => {
  const navigate = useNavigate();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [squadLoaded, setSquadLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'error' | null>(null);
  const [paymentMessage, setPaymentMessage] = useState('');

  // Calculate payment amounts based on program type
  const getPaymentAmounts = () => {
    const programType = localStorage.getItem("programType") || "foundation";
    let baseAmount = 20000; // Default ₦20,000
    
    if (programType === "foundation") {
      baseAmount = 10000; // ₦10,000
    } else if (programType === "undergraduate") {
      baseAmount = 0; // No payment for undergraduate
    } else if (programType === "postgraduate") {
      baseAmount = 20000; // ₦20,000 (changed from ₦50,000)
    }

    const squadCharge = Math.min(baseAmount * 0.019, 2000); // 1.9% capped at ₦2,000
    const totalAmount = baseAmount + squadCharge;

    return { baseAmount, squadCharge, totalAmount, programType };
  };

  const { baseAmount, squadCharge, totalAmount, programType } = getPaymentAmounts();

  // Calculate USD payment amounts
  const getUSDAmounts = () => {
    const baseAmountUSD = 50; // $50.00
    const squadChargeUSD = Math.min(baseAmountUSD * 0.019, 2.5); // 1.9% capped at ~$2.50
    const totalAmountUSD = baseAmountUSD + squadChargeUSD;
    
    return { baseAmountUSD, squadChargeUSD, totalAmountUSD };
  };

  const { baseAmountUSD, squadChargeUSD, totalAmountUSD } = getUSDAmounts();

  // Check if Squad widget is loaded
  useEffect(() => {
    const checkSquadWidget = () => {
      if (window.squad && typeof window.squad === 'function') {
        setSquadLoaded(true);
      } else {
        // Retry after a short delay
        setTimeout(checkSquadWidget, 1000);
      }
    };
    
    // Initial check
    checkSquadWidget();
    
    // Also check when modal opens
    if (isOpen) {
      checkSquadWidget();
    }
  }, [isOpen]);

  // Open Squad popup when modal is opened
  useEffect(() => {
    if (isOpen && squadLoaded) {
      setPaymentStatus('processing');
      setPaymentMessage('Initializing payment...');
      // Add a small delay to ensure everything is ready
      setTimeout(() => {
        handleSquadPayment();
      }, 500);
    }
  }, [isOpen, squadLoaded]);

  // Show toast notification for payment result
  useEffect(() => {
    if (paymentStatus === 'success') {
      toast.success('Payment Successful!', {
        description: paymentMessage || 'Your payment was processed successfully.'
      });
    } else if (paymentStatus === 'error') {
      toast.error('Payment Failed', {
        description: paymentMessage || 'There was a problem processing your payment.'
      });
    }
  }, [paymentStatus]);

  const handleSquadPayment = async () => {
    if (!squadLoaded || !window.squad) {
      console.error('Squad widget not available');
      setPaymentStatus('error');
      setPaymentMessage('Payment system not loaded. Please refresh the page.');
      toast.error('Squadco payment system not loaded. Please refresh the page.');
      return;
    }

    try {
      setIsProcessingPayment(true);
      setPaymentStatus('processing');
      setPaymentMessage('Processing payment...');
      
      // Determine if payment is needed
      
      // If undergraduate, no payment needed
      if (programType === "undergraduate") {
        setPaymentStatus('success');
        setPaymentMessage('No payment required for undergraduate applications!');
        toast.success("No payment required for undergraduate applications!");
        onPaymentSuccess("NO_PAYMENT_REQUIRED");
        setTimeout(() => {
        onClose();
        navigate("/application-success");
        }, 2000);
        return;
      }

      // Determine amount and currency based on program type
      let amount, currency, reference;
      
      if (programType === "postgraduate") {
        // Use USD for postgraduate
        amount = totalAmountUSD * 100; // Convert to cents
        currency = "USD";
        reference = `SQUADCO_USD_${Date.now()}`;
      } else {
        // Use NGN for foundation
        amount = totalAmount * 100; // Convert to kobo
        currency = "NGN";
        reference = `SQUADCO_${Date.now()}`;
      }

      const email = application.personalDetails?.email || application.user?.email || 'test@example.com';
      const customerName = `${application.personalDetails?.firstName || 'Test'} ${application.personalDetails?.lastName || application.personalDetails?.surname || 'User'}`;

      // Create Squad instance with proper configuration
      const squadInstance = new window.squad({
        key: import.meta.env.VITE_REACT_APP_SQUAD_PUBLIC_KEY || process.env.REACT_APP_SQUAD_PUBLIC_KEY || 'pk_8609b506ae331c4815aceaad1a32e51d9ba190a8',
        email: email,
        amount: amount,
        currency_code: currency,
        transaction_ref: reference,
        customer_name: customerName,
        callback_url: window.location.origin + "/application-success",
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
            },
            {
              display_name: "Base Amount",
              variable_name: "base_amount",
              value: (currency === "USD" ? baseAmountUSD : baseAmount).toString()
            },
            {
              display_name: "Squadco Charge",
              variable_name: "squad_charge",
              value: (currency === "USD" ? squadChargeUSD : squadCharge).toString()
            }
          ]
        },
        payment_channels: ['card', 'bank', 'ussd', 'transfer'],
        onLoad: () => {
          setPaymentMessage('Payment widget loaded. Please complete your payment...');
        },
        onClose: () => {
          setIsProcessingPayment(false);
          setPaymentStatus('error');
          setPaymentMessage('Payment was cancelled or failed. Please try again.');
          setTimeout(() => {
          onClose();
          }, 3000);
        },
        onSuccess: (response: any) => {
          // Handle successful payment
          setPaymentStatus('success');
          setPaymentMessage('Payment completed successfully! Redirecting...');
          localStorage.setItem("paymentCompleted", "true");
          localStorage.setItem("paymentReference", response.transaction_ref || reference);
          onPaymentSuccess(response.transaction_ref || reference);
          setIsProcessingPayment(false);
          toast.success('Payment completed successfully!');
          setTimeout(() => {
            onClose();
            navigate("/application-success");
          }, 2000);
        },
        onError: (error: any) => {
          console.error('Payment error:', error);
          setPaymentStatus('error');
          setPaymentMessage('Payment failed. Please try again.');
          setIsProcessingPayment(false);
          toast.error('Payment failed. Please try again.');
          setTimeout(() => {
          onClose();
          }, 3000);
        }
      });

      // Setup and open the Squad modal (following the correct pattern)
      squadInstance.setup();
      squadInstance.open();

    } catch (error) {
      console.error('Squad initialization error:', error);
      setPaymentStatus('error');
      setPaymentMessage('Payment initialization failed. Please try again.');
      setIsProcessingPayment(false);
      toast.error('Payment initialization failed. Please try again.');
      setTimeout(() => {
      onClose();
      }, 3000);
    }
  };

  if (!isOpen) return null;

  const getModalStyles = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderColor: '#10b981'
        };
      case 'error':
        return {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderColor: '#ef4444'
        };
      case 'processing':
        return {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          borderColor: '#f59e0b'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          borderColor: '#f59e0b'
        };
    }
  };

  const getIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-white" />;
      case 'error':
        return <XCircle className="h-16 w-16 text-white" />;
      case 'processing':
        return <Loader2 className="h-16 w-16 text-white animate-spin" />;
      default:
        return <Loader2 className="h-16 w-16 text-white animate-spin" />;
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center overflow-hidden pointer-events-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md mx-4 p-8 rounded-2xl shadow-2xl border-2 text-center"
        style={getModalStyles()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
        >
          <XCircle className="h-6 w-6" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          {getIcon()}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-4">
          {paymentStatus === 'success' && 'Payment Successful!'}
          {paymentStatus === 'error' && 'Payment Failed'}
          {paymentStatus === 'processing' && 'Processing Payment'}
        </h3>

        {/* Message */}
        <p className="text-white text-lg mb-6">
          {paymentMessage}
        </p>

        {/* Additional info for processing */}
        {paymentStatus === 'processing' && (
          <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
            <p className="text-white text-sm">
              Please complete your payment in the popup window. Do not close this page.
            </p>
          </div>
        )}

        {/* Action buttons */}
        {paymentStatus === 'error' && (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Close
            </button>
            <button
              onClick={() => {
                setPaymentStatus('processing');
                setPaymentMessage('Retrying payment...');
                handleSquadPayment();
              }}
              className="flex-1 bg-white text-red-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success action */}
        {paymentStatus === 'success' && (
          <button
            onClick={() => {
              onClose();
              navigate("/application-success");
            }}
            className="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Continue to Application
          </button>
        )}
      </div>
    </div>
  );
};

export default SquadPaymentModal; 