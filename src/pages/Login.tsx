import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import austLogo from "@/assets/images/austlogo.webp";
import { apiService } from "@/services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    // Use the API service for login
    apiService.login({
      username: email,
      password
    })
      .then((data) => {
        console.log("Login response:", data); // Log the full response
        
        if (!data.access_token) {
          throw new Error("No access token received");
        }
        
        // Store the access token
        localStorage.setItem("accessToken", data.access_token);
        console.log("Access token stored in localStorage");
        
        // Show success message
        toast.success("Login successful!");
        
        // Navigate to the correct route
        console.log("Attempting to navigate to /document-upload");
        // First try the /documents route
        navigate("/documents", { replace: true });
        
        // If that doesn't work, try the alternative route after a short delay
        setTimeout(() => {
          const currentPath = window.location.pathname;
          console.log("Current path after navigation:", currentPath);
          if (currentPath === "/login") {
            console.log("First navigation failed, trying alternative route");
            navigate("/document-upload", { replace: true });
          }
        }, 100);
      })
      .catch((error) => {
        console.error("Login error details:", error);
        toast.error(error.message || "Invalid email or password");
      })
      .finally(() => {
        setIsLoading(false);
      });
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
