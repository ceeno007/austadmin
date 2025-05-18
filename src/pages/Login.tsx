import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import austLogo from "@/assets/images/austlogo.webp";
import apiService, { API_ENDPOINTS } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

interface TokenResponse {
  access_token: string;
  token_type: string;
  user?: {
    email: string;
    program?: string;
    full_name: string;
  };
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Prefill email and password from location.state if present
  useEffect(() => {
    if (location.state?.email) setEmail(location.state.email);
    if (location.state?.password) setPassword(location.state.password);
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    console.log("Attempting login with email:", email);
    
    const loadingToast = toast.loading("Logging in...");
    
    try {
      // Test mode - bypass authentication for testing
      if (email === "test1@test.com" || email === "test2@test.com" || email === "test3@test.com") {
        const testData = {
          access_token: "test_token",
          user: {
            email: email,
            full_name: "Test User",
            program: email === "test1@test.com" ? "undergraduate" : 
                    email === "test2@test.com" ? "postgraduate" : "foundation"
          }
        };
        
        login(testData.access_token, testData);
        toast.dismiss(loadingToast);
        toast.success("Login successful!");
        
        const programType = testData.user.program;
        const destination = `/document-upload?type=${programType}`;
        navigate(destination, { replace: true });
        return;
      }
      
      console.log("Making fastApiSignin request to:", API_ENDPOINTS.FASTAPI_TOKEN);
      
      const data = await apiService.fastApiSignin({
        username: email,
        password
      }) as TokenResponse;
      
      console.log("Login response received:", data);
      
      if (!data.access_token) {
        throw new Error("No access token received from server");
      }
      
      console.log("Logging in user with data:", data);
      login(data.access_token, data);
      
      toast.dismiss(loadingToast);
      toast.success("Login successful!");
      
      let programType = data.user?.program?.toLowerCase() || "undergraduate";
      localStorage.setItem("programType", programType);
      
      let destination = location.state?.from?.pathname;
      if (!destination) {
        destination = `/document-upload?type=${programType}`;
      }
      
      console.log("Navigating to:", destination, "with program type:", programType);
      navigate(destination, { replace: true });
      
    } catch (error) {
      console.error("Login error details:", error); 
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request - no response received:", error.request);
      }
      
      toast.dismiss(loadingToast);
      toast.error(error instanceof Error ? error.message : "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center mb-8 text-sm text-gray-600 hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to homepage
        </Link>
        
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-2">
              <img 
                src={austLogo} 
                alt="AUST Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold">Log in to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access your application
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center"><span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#FF5500] mr-2"></span>Logging in...</span>
                ) : (
                  "Log in"
                )}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-500">Don't have an account?</span>{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
