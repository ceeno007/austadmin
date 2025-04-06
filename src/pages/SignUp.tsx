import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, CheckCircle, XCircle, Mail, Loader2 } from "lucide-react";
import austLogo from "@/assets/images/austlogo.webp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiService } from "@/services/api";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [programType, setProgramType] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const navigate = useNavigate();

  // Password strength validation
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== "";
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Show OTP field when email is entered
  useEffect(() => {
    if (isEmailValid && !isEmailVerified) {
      setShowOtpField(true);
    }
  }, [email, isEmailValid, isEmailVerified]);

  const handleSendVerification = async () => {
    if (!isEmailValid) {
      toast.error("Please enter a valid email address", {
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
      return;
    }

    setIsVerifying(true);
    try {
      await apiService.sendVerificationCode(email);
      toast.success("Verification code sent to your email", {
        style: {
          background: '#10B981', // Green background
          color: 'white',
        }
      });
    } catch (error) {
      console.error("Error sending verification code:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send verification code", {
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!verificationCode) {
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
      await apiService.verifyEmail({ email, code: verificationCode });
      setIsEmailVerified(true);
      toast.success("Email verified successfully", {
        style: {
          background: '#10B981', // Green background
          color: 'white',
        }
      });
    } catch (error) {
      console.error("Error verifying email:", error);
      toast.error(error instanceof Error ? error.message : "Failed to verify email", {
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!programType) {
      toast.error("Please select a program type!", {
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
      return;
    }
    
    if (!passwordsMatch) {
      toast.error("Passwords don't match!", {
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
      return;
    }
    
    if (!(hasMinLength && hasUpperCase && hasNumber)) {
      toast.error("Password doesn't meet requirements!", {
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
      return;
    }

    if (!isEmailVerified) {
      toast.error("Please verify your email address first!", {
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
      return;
    }
    
    setIsLoading(true);
    
    // Use the API service for signup
    apiService.signup({
      email,
      full_name: fullName,
      program: programType,
      password
    })
      .then((data) => {
        // Store user's name and program type
        localStorage.setItem("userName", fullName);
        localStorage.setItem("programType", programType);
        toast.success("Account created successfully! Please log in to continue.", {
          style: {
            background: '#10B981', // Green background
            color: 'white',
          }
        });
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        toast.error(error.message || "Failed to create account. Please try again.", {
          style: {
            background: '#EF4444', // Red background
            color: 'white',
          }
        });
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
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Enter your details to start your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className={isEmailVerified ? "border-green-500" : ""}
                      disabled={isEmailVerified}
                    />
                    {isEmailVerified && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleSendVerification}
                    disabled={!isEmailValid || isVerifying || isEmailVerified}
                    className="whitespace-nowrap"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : isEmailVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Verified
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {showOtpField && !isEmailVerified && (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="verificationCode"
                      placeholder="Enter verification code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleVerifyOtp}
                      disabled={!verificationCode || isVerifyingOtp}
                      className="whitespace-nowrap"
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
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="programType">Program Type</Label>
                <Select value={programType} onValueChange={setProgramType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your program type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    <SelectItem value="jupeb">JUPEB</SelectItem>
                  </SelectContent>
                </Select>
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
                
                {/* Password strength indicators */}
                <div className="space-y-1 mt-1 text-xs">
                  <div className="flex items-center">
                    {hasMinLength ? (
                      <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={hasMinLength ? "text-green-600" : "text-gray-500"}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center">
                    {hasUpperCase ? (
                      <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={hasUpperCase ? "text-green-600" : "text-gray-500"}>
                      At least one uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center">
                    {hasNumber ? (
                      <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={hasNumber ? "text-green-600" : "text-gray-500"}>
                      At least one number
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
              
              <Button type="submit" className="w-full bg-primary" disabled={isLoading || !isEmailVerified}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
