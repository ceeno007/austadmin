
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Password strength validation
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordsMatch) {
      toast.error("Passwords don't match!");
      return;
    }
    
    if (!(hasMinLength && hasUpperCase && hasNumber)) {
      toast.error("Password doesn't meet requirements!");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully!");
      navigate("/application");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center mb-8 text-sm text-gray-600 hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to homepage
        </Link>
        
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-uni-purple to-uni-blue flex items-center justify-center text-white font-bold text-xl mb-2">
              U
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
                <Input
                  id="email"
                  placeholder="your.email@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              
              <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-500">Already have an account?</span>{" "}
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
