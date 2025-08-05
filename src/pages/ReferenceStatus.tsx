import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle, AlertCircle, Mail, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import apiService from "@/services/api";

interface Referee {
  name: string;
  email: string;
  status: boolean;
}

interface Application {
  uuid: string;
  first_referee_name: string;
  first_referee_email: string;
  second_referee_name: string;
  second_referee_email: string;
  referee_1: boolean;
  referee_2: boolean;
  program_type: string;
}

const ReferenceStatus: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingRefereeIndex, setEditingRefereeIndex] = useState<number | null>(null);
  const [newRefereeName, setNewRefereeName] = useState("");
  const [newRefereeEmail, setNewRefereeEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }
        const applicationData = localStorage.getItem("applicationData");
        if (applicationData) {
          try {
            const data = JSON.parse(applicationData);
            if (data.applications && data.applications.length > 0) {
              setApplication(data.applications[0]);
              setLoading(false);
              return;
            }
          } catch {}
        }
        const response = await fetch("http://localhost:8000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (data.applications && data.applications.length > 0) {
          setApplication(data.applications[0]);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load application data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchApplicationData();
  }, [navigate, toast]);

  useEffect(() => {
    if (application && application.referee_1 && application.referee_2) {
      navigate("/application-success");
    }
  }, [application, navigate]);

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const handleEditClick = (index: number) => {
    const currentReferee = referees[index];
    setEditingRefereeIndex(index);
    setNewRefereeName(currentReferee.name === "Not provided" ? "" : currentReferee.name);
    setNewRefereeEmail(currentReferee.email === "Not provided" ? "" : currentReferee.email);
    setEmailError(""); // Clear previous errors
  };

  const handleCancelClick = () => {
    setEditingRefereeIndex(null);
    setNewRefereeName("");
    setNewRefereeEmail("");
    setEmailError("");
  };

  const validateAcademicEmail = (email: string) => {
    // Basic validation for academic email (ends with .edu or similar academic domains)
    const academicEmailRegex = /^[\w.-]+@(?:[a-zA-Z0-9-]+\.)+(?:edu|ac|university|college|inst)\b/i;
    if (!email) {
        return "Email is required.";
    }
    if (!academicEmailRegex.test(email)) {
        return "Please enter a valid academic email address.";
    }
    return "";
  };

  const handleSaveClick = async (index: number) => {
    if (!newRefereeName || !newRefereeEmail) {
        setEmailError("Name and Email are required.");
        return;
    }

    const emailValidationMessage = validateAcademicEmail(newRefereeEmail);
    if (emailValidationMessage) {
        setEmailError(emailValidationMessage);
        return;
    }

    // Check if the new email is the same as the other referee's email
    if (application) {
        const otherRefereeEmail = index === 0 ? application.second_referee_email : application.first_referee_email;
        if (newRefereeEmail.toLowerCase() === otherRefereeEmail.toLowerCase()) {
            setEmailError("Referee emails cannot be the same.");
            return;
        }
    }

    setIsSaving(true);
    setEmailError("");

    try {
        const refereeNumber = index === 0 ? 1 : 2; // 1 for first referee, 2 for second
        await apiService.changePostgraduateReferee({
            referee_number: refereeNumber as 1 | 2,
            new_referee_name: newRefereeName,
            new_referee_email: newRefereeEmail,
        });

        // Update local application state and localStorage
        if (application) {
            const updatedApplication = { ...application };
            if (index === 0) {
                updatedApplication.first_referee_name = newRefereeName;
                updatedApplication.first_referee_email = newRefereeEmail;
                updatedApplication.referee_1 = false; // Reset status after change
            } else {
                updatedApplication.second_referee_name = newRefereeName;
                updatedApplication.second_referee_email = newRefereeEmail;
                updatedApplication.referee_2 = false; // Reset status after change
            }
            setApplication(updatedApplication);
            // Assuming applicationData in localStorage stores an object with an applications array
            const storedData = localStorage.getItem("applicationData");
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    if (parsedData.applications && parsedData.applications.length > 0) {
                        parsedData.applications[0] = updatedApplication;
                        localStorage.setItem("applicationData", JSON.stringify(parsedData));
                    }
                } catch(e) {
                    console.error("Failed to parse or update applicationData in localStorage", e);
                }
            } else {
                 // If no applicationData in localStorage, maybe just store the updated application directly
                 // This might depend on how the app uses this storage.
                 // For now, logging a warning. Consider a more robust localStorage strategy.
                 console.warn("applicationData not found in localStorage, cannot update.");
            }

        }

        toast({
            title: "Success",
            description: `Referee ${index + 1} details updated.`,
            style: {
                background: '#10B981', // Green background
                color: 'white',
            }
        });
        handleCancelClick(); // Exit editing mode

    } catch (error: any) {
        console.error("Error changing referee:", error);
        toast({
            title: "Error",
            description: error.message || "Failed to update referee details. Please try again.",
            variant: "destructive",
            style: {
              background: '#EF4444', // Red background
              color: 'white',
            }
        });
    } finally {
        setIsSaving(false);
    }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5500]"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
        <div className="text-center bg-white/80 rounded-2xl shadow-xl p-10">
          <h2 className="text-2xl font-bold mb-4">No Application Found</h2>
          <p className="mb-4">Please complete your application first.</p>
          <Button onClick={() => navigate("/application")}>Start Application</Button>
        </div>
      </div>
    );
  }

  const referees: Referee[] = [
    {
      name: application.first_referee_name || "Not provided",
      email: application.first_referee_email || "Not provided",
      status: application.referee_1 || false,
    },
    {
      name: application.second_referee_name || "Not provided",
      email: application.second_referee_email || "Not provided",
      status: application.referee_2 || false,
    },
  ];

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle2 className="h-8 w-8 text-green-500" />
    ) : (
      <XCircle className="h-8 w-8 text-red-500" />
    );
  };

  const getStatusText = (status: boolean) => {
    return status ? "Submitted" : "Pending";
  };

  const getStatusColor = (status: boolean) => {
    return status ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 md:p-8 relative">
        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-700 font-medium shadow"
          style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)" }}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>

        <div className="text-center mb-8 pt-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reference Status</h1>
          <p className="text-gray-600">Track the status of your referee submissions</p>
        </div>

        {application.referee_1 && application.referee_2 && (
          <motion.div 
            className="mb-6 p-4 bg-green-100 border border-green-200 rounded-md flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <CheckCircle2 className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-lg font-semibold text-green-800">All References Received!</h2>
          </motion.div>
        )}

        <div className="space-y-4">
          {referees.map((referee, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-md border border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            >
              {editingRefereeIndex === index ? (
                // Editing mode
                <div className="flex flex-col w-full space-y-3">
                    <h3 className="text-base font-medium text-gray-900">Editing Referee {index + 1}</h3>
                    <div>
                        <label htmlFor={`new-referee-name-${index}`} className="sr-only">New Name</label>
                        <Input
                            id={`new-referee-name-${index}`}
                            placeholder="New Referee Name"
                            value={newRefereeName}
                            onChange={(e) => setNewRefereeName(e.target.value)}
                            disabled={isSaving}
                        />
                    </div>
                    <div>
                        <label htmlFor={`new-referee-email-${index}`} className="sr-only">New Email</label>
                        <Input
                            id={`new-referee-email-${index}`}
                            type="email"
                            placeholder="New Referee Academic Email"
                            value={newRefereeEmail}
                            onChange={(e) => {
                                setNewRefereeEmail(e.target.value);
                                setEmailError(""); // Clear error on change
                            }}
                            disabled={isSaving}
                        />
                         {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="secondary" 
                            onClick={handleCancelClick} 
                            disabled={isSaving}
                            className="flex-grow"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => handleSaveClick(index)} 
                            disabled={isSaving} 
                            className="flex-grow bg-[#FF5500] hover:bg-[#e64d00]"
                        >
                             {isSaving ? (
                                <div className="flex items-center justify-center">
                                    Saving...
                                </div>
                                ) : (
                                    "Save"
                                )
                            }
                        </Button>
                    </div>
                </div>
              ) : (
                // Display mode
                <div className="flex items-center justify-between w-full">
                    <div>
                        <h3 className="text-base font-medium text-gray-900">Referee {index + 1}</h3>
                        <p className="text-gray-700 text-sm break-words">{referee.name}</p>
                        <p className="text-gray-500 text-xs break-words">{referee.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {!referee.status && ( // Only show edit if status is not submitted
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(index)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <XCircle className="h-5 w-5" />
                            </Button>
                        )}
                        {getStatusIcon(referee.status)}
                        <span className={`font-semibold text-sm ${getStatusColor(referee.status)}`}>
                            {getStatusText(referee.status)}
                        </span>
                    </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {!application.referee_1 || !application.referee_2 ? (
          <motion.div 
            className="bg-blue-100 border border-blue-200 p-4 rounded-md mt-6 flex items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + referees.length * 0.1, duration: 0.5 }}
          >
             <AlertCircle className="h-6 w-6 text-blue-600 mr-3" />
            <p className="text-blue-800 text-sm">
              Your referees will receive an email with instructions to submit their recommendations.
            </p>
          </motion.div>
        ) : null}
        
        {/* Optional: Add a button to resend reminder emails if needed */}
        {/* {!application.referee_1 || !application.referee_2 ? (
          <div className="text-center mt-6">
            <Button variant="outline" className="text-blue-600 hover:text-blue-800">
              <Mail className="h-4 w-4 mr-2" /> Resend Reminder Emails
            </Button>
          </div>
        ) : null} */}

      </div>
    </div>
  );
};

export default ReferenceStatus; 