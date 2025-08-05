import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
      console.log('Checking for Squad widget...', window.squad);
      if (window.squad && typeof window.squad === 'function') {
        console.log('Squad widget found and is a function');
        setSquadLoaded(true);
      } else {
        console.log('Squad widget not found, retrying...');
        // Retry after a short delay
        setTimeout(checkSquadWidget, 500);
      }
    };
    checkSquadWidget();
  }, []);

  // Open Squad popup when modal is opened
  useEffect(() => {
    console.log('Modal opened, squadLoaded:', squadLoaded, 'isOpen:', isOpen);
    if (isOpen && squadLoaded) {
      console.log('Triggering Squad payment...');
      handleSquadPayment();
    }
  }, [isOpen, squadLoaded]);

  const handleSquadPayment = async () => {
    if (!squadLoaded || !window.squad) {
      toast.error('Squadco payment system not loaded. Please refresh the page.');
      onClose();
      return;
    }

    try {
      setIsProcessingPayment(true);
      
      // Determine if payment is needed
      
      // If undergraduate, no payment needed
      if (programType === "undergraduate") {
        toast.success("No payment required for undergraduate applications!");
        onPaymentSuccess("NO_PAYMENT_REQUIRED");
        onClose();
        navigate("/application-success");
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

      const email = application.personalDetails?.email || application.user?.email || '';
      const customerName = `${application.personalDetails?.firstName || ''} ${application.personalDetails?.lastName || application.personalDetails?.surname || ''}`;

      // Create Squad instance with proper configuration
      const squadInstance = new window.squad({
        key: process.env.REACT_APP_SQUAD_PUBLIC_KEY || 'test_pk_sample-public-key-1',
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
          console.log('Squad widget loaded successfully');
        },
        onClose: () => {
          console.log('Squad widget closed');
          setIsProcessingPayment(false);
          onClose();
        },
        onSuccess: (response: any) => {
          console.log('Payment successful:', response);
          // Handle successful payment
          localStorage.setItem("paymentCompleted", "true");
          localStorage.setItem("paymentReference", response.transaction_ref || reference);
          onPaymentSuccess(response.transaction_ref || reference);
          setIsProcessingPayment(false);
          onClose();
          navigate("/application-success");
          toast.success('Payment completed successfully!');
        },
        onError: (error: any) => {
          console.error('Payment error:', error);
          toast.error('Payment failed. Please try again.');
          setIsProcessingPayment(false);
          onClose();
        }
      });

      // Open the Squad modal
      squadInstance.open();

    } catch (error) {
      console.error('Squad initialization error:', error);
      toast.error('Payment initialization failed. Please try again.');
      setIsProcessingPayment(false);
      onClose();
    }
  };

  // Return null since we don't need a custom modal - Squad popup will handle everything
  return null;
};

export default SquadPaymentModal; 