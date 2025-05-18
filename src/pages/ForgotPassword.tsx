import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Mail, CheckCircle, Eye, EyeOff } from "lucide-react";
import austLogo from "@/assets/images/austlogo.webp";
import apiService from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSpinner from "@/components/LoadingSpinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showEmailField, setShowEmailField] = useState(true);
  const navigate = useNavigate();

  // Validate email format
  useEffect(() => {
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  }, [email]);

  // Password validation
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== "";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailValid) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await apiService.forgotPassword({ email });
      setIsOtpSent(true);
      setShowEmailField(false);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      console.error("Error sending password reset:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send password reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordsMatch) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (!(hasMinLength && hasUpperCase && hasNumber)) {
      toast.error("Password doesn't meet requirements");
      return;
    }
    
    if (!otpCode) {
      toast.error("Please enter the verification code");
      return;
    }
    
    setIsResetting(true);
    
    try {
      await apiService.resetPassword({ 
        email,
        otp_code: otpCode,
        new_password: newPassword
      });
      
      toast.success("Password reset successful");
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setIsResetting(false);
    }
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
              {!isOtpSent 
                ? "Enter your email address and we'll send you a verification code"
                : "Enter the verification code and your new password"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isOtpSent ? (
              // Step 1: Email input
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className={isEmailValid ? "border-green-500" : ""}
                    />
                    {isEmailValid && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary" 
                  disabled={isLoading || !isEmailValid}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center"><span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#FF5500] mr-2"></span>Sending...</span>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </form>
            ) : (
              // Step 2: OTP and New Password
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className={isEmailValid ? "border-green-500" : ""}
                      readOnly={!showEmailField}
                    />
                    {isEmailValid && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter the code sent to your email"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We've sent a verification code to <strong>{email}</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
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
                  
                  {/* Password strength indicators */}
                  <div className="space-y-1 mt-1 text-xs">
                    <div className="flex items-center">
                      {hasMinLength ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-gray-300 mr-1" />
                      )}
                      <span className={hasMinLength ? "text-green-600" : "text-gray-500"}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center">
                      {hasUpperCase ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-gray-300 mr-1" />
                      )}
                      <span className={hasUpperCase ? "text-green-600" : "text-gray-500"}>
                        At least one uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center">
                      {hasNumber ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-gray-300 mr-1" />
                      )}
                      <span className={hasNumber ? "text-green-600" : "text-gray-500"}>
                        At least one number
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                      className={`pr-10 ${confirmPassword && !passwordsMatch ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary" 
                  disabled={isResetting || !passwordsMatch || !hasMinLength || !hasUpperCase || !hasNumber || !otpCode}
                >
                  {isResetting ? (
                    <span className="flex items-center justify-center"><span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#FF5500] mr-2"></span>Resetting...</span>
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                <div className="text-center">
                  <button 
                    type="button" 
                    className="text-sm text-primary hover:underline"
                    onClick={() => {
                      setOtpCode("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setIsOtpSent(false);
                      setShowEmailField(true);
                    }}
                  >
                    Use a different email
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword; 