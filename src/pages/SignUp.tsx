import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, CheckCircle, XCircle, Mail, Loader2, Skeleton } from "lucide-react";
import austLogo from "@/assets/images/austlogo.webp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiService, { API_ENDPOINTS } from "@/services/api";

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
      toast.error("Please enter a valid email address");
      return;
    }

    // Temporarily bypass verification for testing
    setIsEmailVerified(true);
    toast.success("Email verification bypassed");
    
    /* Commented out for testing
    setIsVerifying(true);
    try {
      await apiService.sendVerificationCode(email);
      toast.success("Verification code sent to your email");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send code");
    } finally {
      setIsVerifying(false);
    }
    */
  };

  const handleVerifyOtp = async () => {
    // Temporarily bypass OTP verification for testing
    setIsEmailVerified(true);
    toast.success("OTP verification bypassed");
    
    /* Commented out for testing
    if (!verificationCode) {
      toast.error("Please enter verification code");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      await apiService.verifyEmail({ email, code: verificationCode });
      setIsEmailVerified(true);
      toast.success("Email verified successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid verification code");
    } finally {
      setIsVerifyingOtp(false);
    }
    */
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!programType) {
      toast.error("Please select a program type");
      return;
    }
    
    if (!passwordsMatch) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (!(hasMinLength && hasUpperCase && hasNumber)) {
      toast.error("Password requirements not met");
      return;
    }
    
    setIsLoading(true);
    const loadingToast = toast.loading("Creating account...");
    
    apiService.fastApiSignup({
      email,
      full_name: fullName,
      program: programType,
      password
    })
      .then((data) => {
        localStorage.setItem("userName", fullName);
        localStorage.setItem("programType", programType);
        
        toast.dismiss(loadingToast);
        toast.success("Account created successfully");
        navigate("/login");
      })
      .catch((error) => {
        toast.dismiss(loadingToast);
        toast.error(error.message || "Failed to create account");
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
                  {!isEmailVerified && isEmailValid && (
                    <Button
                      type="button"
                      onClick={handleSendVerification}
                      disabled={isVerifying}
                      className="whitespace-nowrap bg-primary"
                    >
                      {isVerifying ? (
                        <div className="flex items-center">
                          <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Verify Email
                        </>
                      )}
                    </Button>
                  )}
                </div>
                {!isEmailVerified && isEmailValid && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">Email Verification Required</h3>
                        <div className="mt-2 text-sm text-amber-700">
                          <p>Please verify your email to continue:</p>
                          <ol className="list-decimal list-inside mt-1 space-y-1">
                            <li>Click the "Verify Email" button above</li>
                            <li>Check your email inbox (and spam folder)</li>
                            <li>Enter the verification code below</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {showOtpField && !isEmailVerified && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="verificationCode"
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter the code sent to your email"
                        className="flex-grow"
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isVerifyingOtp || !verificationCode}
                        className="whitespace-nowrap bg-primary"
                      >
                        {isVerifyingOtp ? (
                          <div className="flex items-center">
                            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Verify Code
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Didn't receive the code?{" "}
                      <button
                        type="button"
                        onClick={handleSendVerification}
                        disabled={isVerifying}
                        className="text-primary hover:underline"
                      >
                        Resend code
                      </button>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="programType">Program Type</Label>
                <Select value={programType} onValueChange={setProgramType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your program type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    <SelectItem value="foundation">Foundation and Remedial Studies</SelectItem>
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
              
              <Button type="submit" className="w-full bg-primary" disabled={isLoading || !fullName || !email || !programType || !password || !confirmPassword}>
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
