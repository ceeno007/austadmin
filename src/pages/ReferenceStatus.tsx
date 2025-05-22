import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle, AlertCircle, Mail, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

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
              <div>
                <h3 className="text-base font-medium text-gray-900">Referee {index + 1}</h3>
                <p className="text-gray-700 text-sm break-words">{referee.name}</p>
                <p className="text-gray-500 text-xs break-words">{referee.email}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(referee.status)}
                <span className={`font-semibold text-sm ${getStatusColor(referee.status)}`}>
                  {getStatusText(referee.status)}
                </span>
              </div>
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