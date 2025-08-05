import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Building2, AlertCircle, CheckCircle } from 'lucide-react';
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

  // Check if Squad widget is loaded
  useEffect(() => {
    const checkSquadWidget = () => {
      if (window.squad) {
        setSquadLoaded(true);
      } else {
        // Retry after a short delay
        setTimeout(checkSquadWidget, 100);
      }
    };
    checkSquadWidget();
  }, []);

  const handlePaymentAsNigerian = async () => {
    if (!squadLoaded || !window.squad) {
      toast.error('Squad payment system not loaded. Please refresh the page.');
      return;
    }

    try {
      setIsProcessingPayment(true);
      // Determine amount based on program type
      let amount = 2000000; // Default ₦20,000 in kobo
      const programType = localStorage.getItem("programType") || "foundation";
      
      if (programType === "foundation") {
        amount = 1000000; // ₦10,000 in kobo (10,000 * 100)
      } else if (programType === "undergraduate") {
        amount = 2000000; // ₦20,000 in kobo (20,000 * 100)
      } else if (programType === "postgraduate") {
        amount = 5000000; // ₦50,000 in kobo (50,000 * 100)
      }
      const email = application.personalDetails?.email || application.user?.email || '';
      const customerName = `${application.personalDetails?.firstName || ''} ${application.personalDetails?.lastName || application.personalDetails?.surname || ''}`;
      const reference = `SQUAD_${Date.now()}`;
      const programType = localStorage.getItem("programType") || "foundation";

      const squadInstance = new window.squad({
        onClose: () => {
          console.log("Squad widget closed");
          setIsProcessingPayment(false);
        },
        onLoad: () => {
          console.log("Squad widget loaded successfully");
        },
        onSuccess: (response: any) => {
          console.log('Squad payment successful:', response);
          // Handle successful payment
          localStorage.setItem("paymentCompleted", "true");
          localStorage.setItem("paymentReference", response.transaction_ref || reference);
          onPaymentSuccess(response.transaction_ref || reference);
          setIsProcessingPayment(false);
          onClose();
          navigate("/application-success");
          toast.success('Payment completed successfully!');
        },
        key: process.env.REACT_APP_SQUAD_PUBLIC_KEY || 'test_pk_sample-public-key-1',
        email: email,
        amount: amount,
        currency_code: "NGN",
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
            }
          ]
        },
        payment_channels: ['card', 'bank', 'ussd', 'transfer']
      });

      squadInstance.setup();
      squadInstance.open();
      
      // Close our selection modal since Squad modal will take over
      onClose();

    } catch (error) {
      console.error('Squad payment error:', error);
      toast.error('Payment initialization failed. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentAsInternational = async () => {
    if (!squadLoaded || !window.squad) {
      toast.error('Squad payment system not loaded. Please refresh the page.');
      return;
    }

    try {
      setIsProcessingPayment(true);
      const amount = 5000; // $50.00 in cents (50 * 100)
      const email = application.personalDetails?.email || application.user?.email || '';
      const customerName = `${application.personalDetails?.firstName || ''} ${application.personalDetails?.lastName || application.personalDetails?.surname || ''}`;
      const reference = `SQUAD_USD_${Date.now()}`;
      const programType = localStorage.getItem("programType") || "foundation";

      const squadInstance = new window.squad({
        onClose: () => {
          console.log("Squad widget closed");
          setIsProcessingPayment(false);
        },
        onLoad: () => {
          console.log("Squad widget loaded successfully");
        },
        onSuccess: (response: any) => {
          console.log('Squad payment successful:', response);
          // Handle successful payment
          localStorage.setItem("paymentCompleted", "true");
          localStorage.setItem("paymentReference", response.transaction_ref || reference);
          onPaymentSuccess(response.transaction_ref || reference);
          setIsProcessingPayment(false);
          onClose();
          navigate("/application-success");
          toast.success('Payment completed successfully!');
        },
        key: process.env.REACT_APP_SQUAD_PUBLIC_KEY || 'test_pk_sample-public-key-1',
        email: email,
        amount: amount,
        currency_code: "USD",
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
            }
          ]
        },
        payment_channels: ['card', 'bank', 'ussd', 'transfer']
      });

      squadInstance.setup();
      squadInstance.open();
      
      // Close our selection modal since Squad modal will take over
      onClose();

    } catch (error) {
      console.error('Squad payment error:', error);
      toast.error('Payment initialization failed. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-green-600" />
            Complete Payment with Squad
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Choose your payment method based on your location and preferred currency.
            </AlertDescription>
          </Alert>

          {!squadLoaded && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Loading Squad payment system...
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Nigerian Payment</h3>
                      <p className="text-sm text-gray-600">Pay with Naira (₦)</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Card, Bank Transfer, USSD supported
                      </p>
                    </div>
                  </div>
                                      <div className="text-right">
                      <Badge variant="secondary" className="mb-1">₦20,000</Badge>
                      <p className="text-xs text-gray-500">Application Fee Only</p>
                      <p className="text-xs text-orange-600 mt-1">*Tuition fees separate</p>
                    </div>
                </div>
                <Button 
                  onClick={handlePaymentAsNigerian}
                  disabled={isProcessingPayment || !squadLoaded}
                  className="w-full mt-3 bg-green-600 hover:bg-green-700"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay ₦20,000 with Squad
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">International Payment</h3>
                      <p className="text-sm text-gray-600">Pay with USD ($)</p>
                      <p className="text-xs text-gray-500 mt-1">
                        International cards supported
                      </p>
                    </div>
                  </div>
                                      <div className="text-right">
                      <Badge variant="secondary" className="mb-1">$50.00</Badge>
                      <p className="text-xs text-gray-500">Application Fee Only</p>
                      <p className="text-xs text-orange-600 mt-1">*Tuition fees separate</p>
                    </div>
                </div>
                <Button 
                  onClick={handlePaymentAsInternational}
                  disabled={isProcessingPayment || !squadLoaded}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay $50.00 with Squad
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Secure payment powered by Squad by GTBank. Multiple payment methods available: Card, Bank Transfer, USSD.
              </AlertDescription>
            </Alert>
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Important:</strong> This is only the application processing fee. Full tuition fees vary by program:
                <br />• <strong>Business Programs:</strong> ₦2.06M (Returning) / ₦2.25M (New)
                <br />• <strong>Engineering/Computing:</strong> ₦2.34M (Returning) / ₦2.55M (New)
                <br />• <strong>Foundation:</strong> ₦1.34M total
                <br />• <strong>Postgraduate:</strong> ₦906K - ₦5.1M (Nigerian) / $1K - $12K (International)
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SquadPaymentModal; 