import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import austLogo from "@/assets/images/austlogo.webp";
import { apiService } from "@/services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    
    // Use the API service for password reset
    apiService.forgotPassword({ email })
      .then(() => {
        setIsSubmitted(true);
        toast.success("Password reset instructions sent to your email");
      })
      .catch((error) => {
        console.error("Error during password reset request:", error);
        toast.error(error.message || "Failed to send reset instructions");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Link to="/login" className="flex items-center mb-8 text-sm text-gray-600 hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to login
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
            <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you instructions to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
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
                
                <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-gray-700">
                  We've sent password reset instructions to <strong>{email}</strong>.
                  Please check your email and follow the link to reset your password.
                </p>
                <p className="text-sm text-gray-500">
                  If you don't receive an email within a few minutes, please check your spam folder.
                </p>
                <Button 
                  onClick={() => navigate("/login")} 
                  className="w-full bg-primary"
                >
                  Return to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword; 