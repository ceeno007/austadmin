import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Mail, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";
import austLogo from "@/assets/images/austlogo.webp";
import apiService from "@/services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
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
      toast.error("Please enter a valid email address", {
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await apiService.sendPasswordResetOtp(email);
      setIsOtpSent(true);
      toast.success("Verification code sent to your email", {
        style: {
          background: '#10B981', // Green background
          color: 'white',
        }
      });
    } catch (error) {
      console.error("Error sending password reset OTP:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send verification code", {
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode) {
      toast.error("Please enter the verification code", {
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
      return;
    }
    
    setIsVerifyingOtp(true);
    
    try {
      await apiService.verifyPasswordResetOtp({ email, code: otpCode });
      setIsOtpVerified(true);
      toast.success("Email verified successfully", {
        style: {
          background: '#10B981', // Green background
          color: 'white',
        }
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error instanceof Error ? error.message : "Failed to verify code", {
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordsMatch) {
      toast.error("Passwords don't match", {
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
      return;
    }
    
    if (!(hasMinLength && hasUpperCase && hasNumber)) {
      toast.error("Password doesn't meet requirements", {
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
      return;
    }
    
    setIsResetting(true);
    
    try {
      await apiService.resetPassword({ 
        email, 
        code: otpCode,
        password: newPassword
      });
      
      toast.success("Password reset successful", {
        style: {
          background: '#10B981', // Green background
          color: 'white',
        }
      });
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error instanceof Error ? error.message : "Failed to reset password", {
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
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
                : !isOtpVerified
                  ? "Enter the verification code sent to your email"
                  : "Create a new password for your account"
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
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </form>
            ) : !isOtpVerified ? (
              // Step 2: OTP verification
              <form onSubmit={handleVerifyOtp} className="space-y-4">
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
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary" 
                  disabled={isVerifyingOtp || !otpCode}
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
                
                <div className="text-center">
                  <button 
                    type="button" 
                    className="text-sm text-primary hover:underline"
                    onClick={() => {
                      setOtpCode("");
                      setIsOtpSent(false);
                    }}
                  >
                    Use a different email
                  </button>
                </div>
              </form>
            ) : (
              // Step 3: New password
              <form onSubmit={handleResetPassword} className="space-y-4">
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
                  disabled={isResetting || !passwordsMatch || !hasMinLength || !hasUpperCase || !hasNumber}
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword; 