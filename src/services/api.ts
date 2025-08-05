import axios from 'axios';

// API Base URL
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admissions-jcvy.onrender.com';
const FASTAPI_BASE_URL = 'https://admissions-l9fv.onrender.com';

// API Endpoints
export const API_ENDPOINTS = {
  SIGNUP: `${FASTAPI_BASE_URL}/auth/signup`,
  LOGIN: `${FASTAPI_BASE_URL}/auth/token`,
  DOCUMENT_UPLOAD: `${FASTAPI_BASE_URL}/documents/upload`,
  FORGOT_PASSWORD: `${FASTAPI_BASE_URL}/auth/forgot-password`,
  CONTACT: `${FASTAPI_BASE_URL}/contact`,
  SEND_VERIFICATION: `${FASTAPI_BASE_URL}/auth/send-verification`,
  VERIFY_EMAIL: `${FASTAPI_BASE_URL}/auth/verify-email`,
  SEND_PASSWORD_RESET_OTP: `${FASTAPI_BASE_URL}/auth/send-password-reset-otp`,
  VERIFY_PASSWORD_RESET_OTP: `${FASTAPI_BASE_URL}/auth/verify-password-reset-otp`,
  RESET_PASSWORD: `${FASTAPI_BASE_URL}/auth/reset-password`,
  APPLICATION_UPLOAD: `${FASTAPI_BASE_URL}/postgraduate/upload`,
  INITIALIZE_PAYMENT: `${FASTAPI_BASE_URL}/payments/initialize`,
  VERIFY_PAYMENT: `${FASTAPI_BASE_URL}/payments/verify`,
  FASTAPI_TOKEN: `${FASTAPI_BASE_URL}/auth/token`,
  FASTAPI_POSTGRADUATE_UPLOAD: `${FASTAPI_BASE_URL}/postgraduate/upload`,
  FASTAPI_SIGNUP: `${FASTAPI_BASE_URL}/auth/signup`,
  FOUNDATION: `${FASTAPI_BASE_URL}/foundation/applications`,
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

// FastAPI OAuth token response type
interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}

// Postgraduate document upload interface
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

// Add this interface near the top with other interfaces
interface PaymentMetadata {
  applicationType: string;
  programType: string;
  program: string;
  academicSession: string;
}

// API Service
const apiService = {
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
        API_ENDPOINTS.FASTAPI_SIGNUP,
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
   * Log in a user with email and password
   * @param credentials - User login credentials
   * @returns Promise with the API response
   */
  login: async (credentials: { email: string; password: string }) => {
    try {
      // Use FastAPI OAuth2 token endpoint
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', credentials.email); // FastAPI expects 'username' field
      formData.append('password', credentials.password);
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();

      // Store token with consistent key
      localStorage.setItem('accessToken', data.access_token);
      
      // Store full application data
      localStorage.setItem('applicationData', JSON.stringify(data));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
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
      const response = await fetch(`${FASTAPI_BASE_URL}/auth/forgot-password`, {
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
  resetPassword: async (data: { 
    email: string; 
    otp_code: string; 
    new_password: string 
  }) => {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/auth/reset-password`, {
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
    const response = await axios.post(`${FASTAPI_BASE_URL}/applications`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Sign in using FastAPI token endpoint (OAuth2 password flow)
   * @param credentials - User login credentials
   * @returns Promise with the token response
   */
  fastApiSignin: async (credentials: { 
    username: string; 
    password: string;
    client_id?: string;
    client_secret?: string;
    scope?: string;
  }): Promise<TokenResponse> => {
    try {
      // Create form data for x-www-form-urlencoded format
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      formData.append('scope', credentials.scope || '');
      formData.append('client_id', credentials.client_id || '');
      formData.append('client_secret', credentials.client_secret || '');
      
      const response = await axios.post<TokenResponse>(API_ENDPOINTS.FASTAPI_TOKEN, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      });
      
      // Store the token in localStorage
      if (response.data.access_token) {
        localStorage.setItem('fastApiAccessToken', response.data.access_token);
        
        // If there's a refresh token, store it too
        if (response.data.refresh_token) {
          localStorage.setItem('fastApiRefreshToken', response.data.refresh_token);
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error("FastAPI Signin error:", error);
      // Check if error has a response property (typical for Axios errors)
      if (error.response && error.response.data && error.response.data.detail) {
        // The FastAPI error format is { "detail": "Incorrect email or password" }
        throw new Error(error.response.data.detail);
      }
      throw new Error("An unexpected error occurred during authentication");
    }
  },

  /**
   * Upload postgraduate documents to FastAPI endpoint
   * @param data - Object containing all postgraduate document fields and files
   * @returns Promise with the API response
   */
  uploadPostgraduateDocuments: async (
    data: PostgraduateDocumentData,
    files: {
      passport_photo: File;
      o_level_result: File;
      birth_certificate: File;
      state_of_origin_certificate: File;
      first_degree_certificate: File;
      first_degree_transcript: File;
      second_degree_certificate?: File;
      second_degree_transcript?: File;
      jamb_result?: File;
      cv: File;
      research_proposal?: File;
      recommendation_letters: File;
      payment_receipt: File;
    }
  ) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('fastApiAccessToken');
      
      // Create a FormData object
      const formData = new FormData();
      
      // Add all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          // Convert boolean to string
          if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value);
          }
        }
      });
      
      // Add all files
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });
      
      // Make the request
      const response = await axios.post(
        API_ENDPOINTS.FASTAPI_POSTGRADUATE_UPLOAD,
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
      console.error("Postgraduate document upload error:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("An error occurred during document upload");
    }
  },

  /**
   * Upload postgraduate documents using a pre-built FormData object
   * This allows for more flexibility when building the form data
   * @param formData - FormData object containing all fields and files
   * @returns Promise with the API response
   */
  uploadPostgraduateFormData: async (formData: FormData) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('fastApiAccessToken');
      
      // Make the request
      const response = await axios.post(
        API_ENDPOINTS.FASTAPI_POSTGRADUATE_UPLOAD,
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
      console.error("Postgraduate document upload error:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("An error occurred during document upload");
    }
  },

  /**
   * Save postgraduate application as draft
   * @param data - Object containing all postgraduate document fields and files
   * @returns Promise with the API response
   */
  savePostgraduateAsDraft: async (
    data: Partial<PostgraduateDocumentData>,
    files?: Partial<{
      passport_photo: File;
      o_level_result: File;
      birth_certificate: File;
      state_of_origin_certificate: File;
      first_degree_certificate: File;
      first_degree_transcript: File;
      second_degree_certificate: File;
      second_degree_transcript: File;
      jamb_result: File;
      cv: File;
      research_proposal: File;
      recommendation_letters: File;
      payment_receipt: File;
    }>
  ) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('fastApiAccessToken');
      // Create a FormData object
      const formData = new FormData();
      // Add all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          // Convert boolean to string
          if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value as string);
          }
        }
      });
      // Add files if provided
      if (files) {
        Object.entries(files).forEach(([key, file]) => {
          if (file) {
            formData.append(key, file);
          }
        });
      }
      // Ensure is_draft=true is set
      if (!formData.has('is_draft')) {
        formData.append('is_draft', 'true');
      }
      // Make the request to the correct endpoint
      const response = await axios.post(
        API_ENDPOINTS.FASTAPI_POSTGRADUATE_UPLOAD,
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
   * Save postgraduate application as draft using a pre-built FormData object
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
        API_ENDPOINTS.FASTAPI_POSTGRADUATE_UPLOAD,
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
   * Request OTP for email verification
   */
  requestEmailOtp: async (email: string) => {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/auth/verify-email/request`, {
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
      const response = await fetch(`${FASTAPI_BASE_URL}/auth/verify-email/verify`, {
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

  /**
   * Submit undergraduate application (or draft) as multipart/form-data
   */
  submitUndergraduateApplication: async (formData: FormData) => {
    // Get the token from localStorage
    const token = localStorage.getItem('accessToken') || localStorage.getItem('fastApiAccessToken');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${FASTAPI_BASE_URL}/undergraduate/applications`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!response.ok) {
      let error;
      try {
        error = await response.json();
      } catch {
        error = { detail: 'Unknown error' };
      }
      throw new Error(error.detail || 'Failed to submit application');
    }
    return await response.json();
  },

  /**
   * Fetch the current user's undergraduate application
   */
  getUndergraduateApplication: async () => {
    // Get the token from localStorage
    const token = localStorage.getItem('accessToken') || localStorage.getItem('fastApiAccessToken');
    const headers = {
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${FASTAPI_BASE_URL}/undergraduate/applications/me`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      throw new Error('Failed to fetch undergraduate application');
    }
    return await response.json();
  },

  async submitReferenceForm(uuid: string, formData: FormData) {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/postgraduate/references/${uuid}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit reference form');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting reference form:', error);
      throw error;
    }
  },

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

  /**
   * Initialize payment
   * @param amount - Payment amount
   * @param email - User's email
   * @param metadata - Payment metadata
   * @returns Promise with the API response
   */
  initializePayment: async (amount: number, email: string, metadata: PaymentMetadata) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
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

      return response.data;
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error("Failed to initialize payment");
    }
  },

  
};

export default apiService;