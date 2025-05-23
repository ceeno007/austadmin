import axios from 'axios';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admissions-jcvy.onrender.com';
const FASTAPI_BASE_URL = 'https://admissions-jcvy.onrender.com';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  SIGNUP: `${FASTAPI_BASE_URL}/auth/signup`,
  LOGIN: `${FASTAPI_BASE_URL}/auth/token`,
  FORGOT_PASSWORD: `${FASTAPI_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${FASTAPI_BASE_URL}/auth/reset-password`,
  SEND_VERIFICATION: `${FASTAPI_BASE_URL}/auth/send-verification`,
  VERIFY_EMAIL: `${FASTAPI_BASE_URL}/auth/verify-email`,
  SEND_PASSWORD_RESET_OTP: `${FASTAPI_BASE_URL}/auth/send-password-reset-otp`,
  VERIFY_PASSWORD_RESET_OTP: `${FASTAPI_BASE_URL}/auth/verify-password-reset-otp`,
  EMAIL_OTP_REQUEST: `${FASTAPI_BASE_URL}/auth/verify-email/request`,
  EMAIL_OTP_VERIFY: `${FASTAPI_BASE_URL}/auth/verify-email/verify`,
  
  // Application endpoints
  UNDERGRADUATE: `${FASTAPI_BASE_URL}/undergraduate/applications`,
  POSTGRADUATE: `${FASTAPI_BASE_URL}/postgraduate/upload`,
  FOUNDATION: `${FASTAPI_BASE_URL}/foundation/applications`,
  POSTGRADUATE_REFERENCE: `${FASTAPI_BASE_URL}/postgraduate/references`,
  
  // Document endpoints
  DOCUMENT_UPLOAD: `${FASTAPI_BASE_URL}/documents/upload`,
  
  // Payment endpoints
  INITIALIZE_PAYMENT: `${FASTAPI_BASE_URL}/payments/initialize`,
  VERIFY_PAYMENT: `${FASTAPI_BASE_URL}/payments/verify`,
  
  // Contact endpoints
  CONTACT: `${FASTAPI_BASE_URL}/contact`,
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

// Helper function to extract UUID from URL path
const extractUuidFromUrl = (path: string): string | null => {
  // Looking for patterns like /references/uuid
  const uuidPattern = /\/references\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
  const match = path.match(uuidPattern);
  return match ? match[1] : null;
};

// Type definitions
interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  user?: any;
  applications?: any[];
}

interface PostgraduateDocumentData {
  // Personal information
  first_name: string;
  surname: string;
  other_names?: string;
  gender: string;
  date_of_birth: string;
  blood_group: string;
  nationality: string;
  state_of_origin: string;
  has_disability: boolean;
  disability_description?: string;
  
  // Contact information
  street_address: string;
  city: string;
  country: string;
  phone_number: string;
  email: string;
  
  // Academic information
  o_level_exam_type: string;
  o_level_exam_year: string;
  o_level_exam_number: string;
  o_level_subjects: string;
  jamb_registration_number: string;
  jamb_exam_year: string;
  jamb_score: string;
  
  // University information
  first_degree_institution: string;
  first_degree_course: string;
  first_degree_class: string;
  first_degree_year: string;
  
  // Second degree (optional)
  second_degree_institution?: string;
  second_degree_course?: string;
  second_degree_class?: string;
  second_degree_year?: string;
  
  // Program details
  program_level: string;
  preferred_course: string;
  second_choice_course?: string;
  research_area?: string;
  
  // Referee information
  first_referee_name: string;
  first_referee_email: string;
  second_referee_name: string;
  second_referee_email: string;
  
  // Supervisor (if applicable)
  supervisor_name?: string;
}

interface PaymentMetadata {
  applicationType: string;
  programType: string;
  program: string;
  academicSession: string;
}

// API Service
const apiService = {
  //======================================
  // Authentication Functions
  //======================================
  
  /**
   * Sign up a new user using FastAPI endpoint
   * @param userData - User registration data
   * @returns Promise with the API response
   */
  fastApiSignup: async (userData: {
    email: string;
    full_name: string;
    program: string;
    password: string;
  }) => {
    try {
      const response = await axios.post(
        API_ENDPOINTS.SIGNUP,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.error("FastAPI Signup error:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("An error occurred during signup");
    }
  },

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
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      formData.append('scope', '');
      formData.append('client_id', 'string');
      formData.append('client_secret', 'string');

      // console.log('Sending login request with form data:', formData.toString());

      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });
      
      // console.log('Login response status:', response.status);
      // console.log('Login response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      // console.log('Login response data:', data);
      
      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }
      
      // Store the access token in localStorage
      if (data.access_token) {
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('fastApiAccessToken', data.access_token);
      } else {
        console.warn('No access token in response:', data);
      }
      
      return data;
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred during login");
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
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send password reset email');
      }

      return await response.json();
    } catch (error: any) {
      console.error("Password reset request error:", error);
      throw new Error(error.message || 'Failed to send password reset email');
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
  resetPassword: async (data: { 
    email: string; 
    otp_code: string; 
    new_password: string 
  }) => {
    try {
      const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          otp_code: data.otp_code,
          new_password: data.new_password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to reset password');
      }

      return await response.json();
    } catch (error: any) {
      console.error("Password reset error:", error);
      throw new Error(error.message || 'Failed to reset password');
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
   * Request OTP for email verification
   */
  requestEmailOtp: async (email: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.EMAIL_OTP_REQUEST, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to send code');
      }
      return true;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send code');
    }
  },

  /**
   * Verify OTP for email verification
   */
  verifyEmailOtp: async (email: string, otp_code: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.EMAIL_OTP_VERIFY, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp_code })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Invalid verification code');
      }
      return true;
    } catch (error: any) {
      throw new Error(error.message || 'Invalid verification code');
    }
  },

  //======================================
  // Application Functions
  //======================================
  
  /**
   * Submit undergraduate application
   * @param formData - FormData containing the application details
   * @returns Promise with the API response
   */
  submitUndergraduateApplication: async (formData: FormData) => {
    try {
      const response = await fetch(API_ENDPOINTS.UNDERGRADUATE, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to submit application");
      }

      return await response.json();
    } catch (error) {
      console.error("Undergraduate application submission error:", error);
      throw error;
    }
  },

  /**
   * Submit postgraduate application
   * @param formData - FormData object containing all form fields and files
   * @returns Promise with the API response
   */
  submitPostgraduateApplication: async (formData: FormData) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('fastApiAccessToken');
      // Make the request to the endpoint
      const response = await axios.post(
        API_ENDPOINTS.POSTGRADUATE,
        formData,
        {
          headers: {
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Submit postgraduate application error:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("An error occurred while submitting the application");
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
      
      const response = await fetch(API_ENDPOINTS.POSTGRADUATE, {
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
   * Save postgraduate application as draft
   * @param formData - FormData object containing fields and files to save
   * @returns Promise with the API response
   */
  savePostgraduateFormDataAsDraft: async (formData: FormData) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('fastApiAccessToken');
      // Ensure is_draft=true is set
      if (!formData.has('is_draft')) {
        formData.append('is_draft', 'true');
      }
      // Make the request to the same endpoint as submit
      const response = await axios.post(
        API_ENDPOINTS.POSTGRADUATE,
        formData,
        {
          headers: {
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Save postgraduate application as draft error:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("An error occurred while saving the application as draft");
    }
  },

  /**
   * Create foundation program application
   * @param formData - FormData containing the application details
   * @returns Promise with the API response
   */
  createFoundationApplication: async (formData: FormData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers: HeadersInit = {
        'Accept': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(API_ENDPOINTS.FOUNDATION, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || 'Failed to submit foundation application');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting foundation application:', error);
      throw error;
    }
  },
  
  //======================================
  // Document Functions
  //======================================
  
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
  
  //======================================
  // Payment Functions
  //======================================
  
  // Payment functions would go here
  
  //======================================
  // Contact Functions
  //======================================
  
  /**
   * Submit contact form
   * @param formData - Contact form data (name, email, subject, message)
   * @returns Promise with the API response
   */
  submitContactForm: async (formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    try {
      const url = `${FASTAPI_BASE_URL}/contact/send`; // Corrected endpoint
      
      const formBody = new URLSearchParams();
      formBody.append('full_name', formData.name); // Map 'name' to 'full_name'
      formBody.append('email', formData.email);
      formBody.append('subject', formData.subject);
      formBody.append('message', formData.message);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody.toString()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to submit contact form");
      }

      return await response.json();
    } catch (error) {
      console.error("Contact form submission error:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("An error occurred while submitting the contact form");
    }
  },

  /**
   * Change referee details for a postgraduate application
   * @param data - Object containing referee_number, new_referee_name, and new_referee_email
   * @returns Promise with the API response
   */
  changePostgraduateReferee: async (data: {
    referee_number: 1 | 2;
    new_referee_name: string;
    new_referee_email: string;
  }) => {
    try {
      const url = `${FASTAPI_BASE_URL}/postgraduate/change-reference`;
      
      const formBody = new URLSearchParams();
      formBody.append('referee_number', data.referee_number.toString());
      formBody.append('new_referee_name', data.new_referee_name);
      formBody.append('new_referee_email', data.new_referee_email);

      const token = localStorage.getItem('accessToken');
      const headers: HeadersInit = {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: formBody.toString()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to change referee details");
      }

      return await response.json();
    } catch (error) {
      console.error("Change referee error:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("An error occurred while changing referee details");
    }
  },

  //======================================
  // Reference Form Functions
  //======================================
  
  /**
   * Submit a reference form for postgraduate application
   * @param formData - Reference form data as FormData
   * @param uuid - UUID from the URL
   * @returns Promise with the API response
   */
  submitReferenceForm: async (formData: FormData, uuid: string) => {
    try {
      // Ensure UUID is provided
      if (!uuid) {
        throw new Error("Application UUID is required");
      }
      
      // Make the API request
      const response = await fetch(`${API_ENDPOINTS.POSTGRADUATE_REFERENCE}/${uuid}`, {
        method: "POST",
        headers: {
          'accept': 'application/json',
          // No need to set Content-Type for FormData - browser will set it automatically
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to submit reference form");
      }

      return await response.json();
    } catch (error) {
      console.error("Reference form submission error:", error);
      throw error;
    }
  },
  
  /**
   * Submit reference form and handle redirect to success page
   * @param formData - Reference form data
   * @returns Promise resolving to true on success
   */
  submitReferenceFormAndRedirect: async (formData: FormData) => {
    try {
      // Extract UUID from current URL
      const currentPath = window.location.pathname;
      const uuid = extractUuidFromUrl(currentPath);
      
      if (!uuid) {
        throw new Error("Could not extract application UUID from URL");
      }
      
      // Submit the form
      await apiService.submitReferenceForm(formData, uuid);
      
      // Redirect to success page on successful submission
      window.location.href = '/application-success';
      
      return true;
    } catch (error) {
      console.error("Reference form submission and redirect error:", error);
      throw error;
    }
  },
};

export default apiService;