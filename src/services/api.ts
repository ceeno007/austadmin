// API Base URL
const API_BASE_URL = "https://admissions-qmt4.onrender.com";

// API Endpoints
export const API_ENDPOINTS = {
  SIGNUP: `${API_BASE_URL}/signup`,
  LOGIN: `${API_BASE_URL}/token`,
  DOCUMENT_UPLOAD: `${API_BASE_URL}/document-upload`,
  FORGOT_PASSWORD: `${API_BASE_URL}/forgot-password`,
  CONTACT: `${API_BASE_URL}/contact`,
  SEND_VERIFICATION: `${API_BASE_URL}/send-verification`,
  VERIFY_EMAIL: `${API_BASE_URL}/verify-email`,
  SEND_PASSWORD_RESET_OTP: `${API_BASE_URL}/send-password-reset-otp`,
  VERIFY_PASSWORD_RESET_OTP: `${API_BASE_URL}/verify-password-reset-otp`,
  RESET_PASSWORD: `${API_BASE_URL}/reset-password`,
  APPLICATION_UPLOAD: `${API_BASE_URL}/application/upload`,
  APPLICATION_DRAFT: `${API_BASE_URL}/postgraduate_saved`,
};

// Default Headers for JSON requests
const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Helper function to get authentication headers
const getAuthHeaders = (includeContentType = true) => {
  const token = localStorage.getItem('accessToken');
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  }
  
  return headers;
};

// API Service
export const apiService = {
  /**
   * Sign up a new user
   * @param userData - User registration data
   * @returns Promise with the API response
   */
  signup: async (userData: {
    email: string;
    full_name: string;
    program: string;
    password: string;
  }) => {
    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Signup failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  /**
   * Log in a user with username and password
   * @param credentials - User login credentials
   * @returns Promise with the API response
   */
  login: async (credentials: { username: string; password: string }) => {
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
  
    try {
      console.log("Attempting login to:", API_ENDPOINTS.LOGIN);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log("Login response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Login error response:", errorData);
        throw new Error(errorData.detail || `Login failed with status ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Login successful, received data:", { ...data, access_token: data.access_token ? "present" : "missing" });
      return data;
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error("Login request timed out. Please try again.");
        }
        throw error;
      }
      throw new Error("An unexpected error occurred during login");
    }
  },
  

  /**
   * Upload a document
   * @param documentData - Document upload FormData
   * @returns Promise with the API response
   */
  uploadDocument: async (documentData: FormData) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('accessToken');
      
      // Create headers with the token
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(API_ENDPOINTS.DOCUMENT_UPLOAD, {
        method: "POST",
        headers,
        body: documentData, // Do not manually set Content-Type; browser handles it
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Document upload failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Document upload error:", error);
      throw error;
    }
  },

  /**
   * Request a password reset
   * @param data - Object containing user's email
   * @returns Promise with the API response
   */
  forgotPassword: async (data: { email: string }) => {
    try {
      const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Password reset request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Password reset request error:", error);
      throw error;
    }
  },

  /**
   * Submit a contact form
   * @param contactData - Contact form data
   * @returns Promise with the API response
   */
  submitContactForm: async (contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    try {
      const response = await fetch(API_ENDPOINTS.CONTACT, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send message");
      }

      return await response.json();
    } catch (error) {
      console.error("Contact form submission error:", error);
      throw error;
    }
  },

  /**
   * Send email verification code
   * @param email - User's email address
   * @returns Promise with the API response
   */
  sendVerificationCode: async (email: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.SEND_VERIFICATION, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send verification code");
      }

      return await response.json();
    } catch (error) {
      console.error("Verification code sending error:", error);
      throw error;
    }
  },

  /**
   * Verify email with OTP code
   * @param data - Object containing email and verification code
   * @returns Promise with the API response
   */
  verifyEmail: async (data: { email: string; code: string }) => {
    try {
      const response = await fetch(API_ENDPOINTS.VERIFY_EMAIL, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to verify email");
      }

      return await response.json();
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    }
  },

  /**
   * Send password reset OTP
   * @param email - User's email address
   * @returns Promise with the API response
   */
  sendPasswordResetOtp: async (email: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.SEND_PASSWORD_RESET_OTP, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send password reset OTP");
      }

      return await response.json();
    } catch (error) {
      console.error("Password reset OTP sending error:", error);
      throw error;
    }
  },

  /**
   * Verify password reset OTP
   * @param data - Object containing email and OTP code
   * @returns Promise with the API response
   */
  verifyPasswordResetOtp: async (data: { email: string; code: string }) => {
    try {
      const response = await fetch(API_ENDPOINTS.VERIFY_PASSWORD_RESET_OTP, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to verify password reset OTP");
      }

      return await response.json();
    } catch (error) {
      console.error("Password reset OTP verification error:", error);
      throw error;
    }
  },

  /**
   * Reset password with verified OTP
   * @param data - Object containing email, OTP code, and new password
   * @returns Promise with the API response
   */
  resetPassword: async (data: { email: string; code: string; password: string }) => {
    try {
      const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to reset password");
      }

      return await response.json();
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  },

  /**
   * Upload postgraduate application
   * @param formData - FormData containing all fields and files
   * @returns Promise with the API response
   */
  uploadPostgraduateApplication: async (formData: FormData) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('accessToken');
      
      // Create headers with the token
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(API_ENDPOINTS.APPLICATION_UPLOAD, {
        method: "POST",
        headers,
        body: formData, // Do not manually set Content-Type; browser handles it
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Postgraduate application upload failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Postgraduate application upload error:", error);
      throw error;
    }
  },

  /**
   * Submit a postgraduate application
   * @param formData - Application form data
   * @returns Promise with the API response
   */
  submitApplication: async (formData: FormData) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('accessToken');
      
      // Create headers with the token
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(API_ENDPOINTS.APPLICATION_UPLOAD, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Application submission failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Application submission error:", error);
      throw error;
    }
  },

  /**
   * Submit a draft application
   * @param formData - Application form data with is_draft flag
   * @returns Promise with the API response
   */
  submitDraftApplication: async (formData: FormData) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('accessToken');
      
      // Create headers with the token
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(API_ENDPOINTS.APPLICATION_DRAFT, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Draft application submission failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Draft application submission error:", error);
      throw error;
    }
  },

};