// API Base URL
const API_BASE_URL = "https://admissions-qmt4.onrender.com";

// API Endpoints
export const API_ENDPOINTS = {
  SIGNUP: `${API_BASE_URL}/signup`,
  LOGIN: `${API_BASE_URL}/token`,
  DOCUMENT_UPLOAD: `${API_BASE_URL}/document-upload`,
  FORGOT_PASSWORD: `${API_BASE_URL}/forgot-password`,
  // Add more endpoints as needed
};

// Default Headers for JSON requests
const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
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
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Login failed");
      }
  
      // Return the full response data
      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
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
      const response = await fetch(API_ENDPOINTS.DOCUMENT_UPLOAD, {
        method: "POST",
        body: documentData, // No need to set Content-Type; browser handles it
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

  // Add more methods as needed
};
