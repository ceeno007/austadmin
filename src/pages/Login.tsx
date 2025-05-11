import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import austLogo from "@/assets/images/austlogo.webp";
import { apiService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password", {
        description: "Both fields are required to log in.",
        style: {
          background: '#EF4444',
          color: 'white',
        }
      });
      return;
    }
    
    setIsLoading(true);
    console.log("Starting login process...");
    
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
        
        toast.success("Test login successful!", {
          description: "Welcome to test mode!",
          style: {
            background: '#10B981',
            color: 'white',
          }
        });
        
        const programType = testData.user.program;
        const destination = `/document-upload?type=${programType}`;
        navigate(destination, { replace: true });
        return;
      }
      
      // Normal login flow
      console.log("Calling login API...");
      const data = await apiService.login({
        username: email,
        password
      });
      
      console.log("Login API response received:", data);
      
      if (!data.access_token) {
        console.error("No access token in response:", data);
        throw new Error("No access token received from server");
      }
      
      // Use the auth context to handle login
      console.log("Calling auth context login...");
      login(data.access_token, data);
      
      // Show success message
      toast.success("Login successful!", {
        description: "Welcome back! Redirecting you to your dashboard.",
        style: {
          background: '#10B981',
          color: 'white',
        }
      });
      
      // Get the program type from the response data (check applications array first)
      let programType = null;
      if (data.applications && data.applications.length > 0) {
        programType = data.applications[0].program_type?.toLowerCase();
      }

      // If not found in applications, fallback to other locations
      if (!programType) {
        programType = data.program_type?.toLowerCase() || 
                     data.user?.program?.toLowerCase() || 
                     data.program?.toLowerCase();
      }
      
      console.log("Determined program type:", programType);
      
      // Determine the destination based on program type
      let destination = location.state?.from?.pathname;
      
      if (!destination) {
        // Default to using the program type from response, falling back to undergraduate if not available
        const formType = programType || "undergraduate";
        
        // Construct the destination URL with query parameters
        destination = `/document-upload?type=${formType}`;
      }
      
      console.log("Navigating to:", destination);
      
      // Use navigate with replace to prevent back navigation to login
      navigate(destination, { replace: true });
      
    } catch (error) {
      console.error("Login error details:", error);
      toast.error("Login failed", {
        description: error instanceof Error ? error.message : "Invalid email or password",
        style: {
          background: '#EF4444',
          color: 'white',
        }
      });
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
              
              <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log in"}
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
