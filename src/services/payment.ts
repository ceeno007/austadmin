import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const PAYMENT_ENDPOINTS = {
  INITIALIZE_PAYMENT: `${API_BASE_URL}/payments/initialize`,
  VERIFY_PAYMENT: `${API_BASE_URL}/payments/verify`,
};

export interface PaymentResponse {
  status: 'success' | 'failed';
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaymentVerificationResponse {
  status: 'success' | 'failed';
  message: string;
  data?: {
    reference: string;
    amount: number;
    status: 'success' | 'failed';
    paid_at: string;
    channel: string;
  };
}

const paymentService = {
  /**
   * Initialize a Paystack payment
   * @param amount - Amount to be paid in kobo
   * @param email - Customer's email
   * @param metadata - Additional payment metadata
   * @returns Promise with the payment initialization response
   */
  initializePayment: async (
    amount: number,
    email: string,
    metadata: Record<string, any> = {}
  ): Promise<PaymentResponse> => {
    try {
      const response = await axios.post(PAYMENT_ENDPOINTS.INITIALIZE_PAYMENT, {
        amount,
        email,
        metadata,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw error;
    }
  },

  /**
   * Verify a Paystack payment
   * @param reference - Payment reference from Paystack
   * @returns Promise with the payment verification response
   */
  verifyPayment: async (reference: string): Promise<PaymentVerificationResponse> => {
    try {
      const response = await axios.get(`${PAYMENT_ENDPOINTS.VERIFY_PAYMENT}/${reference}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  },
};

export default paymentService; 