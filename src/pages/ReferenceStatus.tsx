import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle, AlertCircle, Mail, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex flex-col items-center pt-0 px-2">
      <div className="w-full max-w-2xl rounded-3xl shadow-2xl bg-white/80 backdrop-blur-md border border-gray-200 p-8 mt-8 relative">
        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-700 font-medium shadow"
          style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)" }}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>

        <div className="text-center mb-10 pt-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Reference Status</h1>
          <p className="text-lg text-gray-500">Track the status of your referee submissions</p>
        </div>

        {application.referee_1 && application.referee_2 && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-100 shadow">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full shadow">
                <CheckCircle2 className="h-10 w-10 text-green-600 animate-bounce" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-green-800 text-center mb-2">
              All References Received! 🎉
            </h2>
            <p className="text-green-700 text-center mb-4">
              Both of your referees have submitted their recommendations. Your application is now complete!
            </p>
            <div className="bg-white/80 p-4 rounded-xl border border-green-100">
              <div className="flex items-center text-green-700">
                <Mail className="h-5 w-5 mr-2" />
                <p className="text-sm">
                  Please check your email for further instructions and updates on your application status.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {referees.map((referee, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white/90 rounded-2xl shadow p-6 border border-gray-100 transition hover:shadow-lg"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Referee {index + 1}
                </h3>
                <p className="text-gray-600 mb-1">{referee.name}</p>
                <p className="text-gray-400 text-sm">{referee.email}</p>
              </div>
              <div className="flex flex-col items-center">
                {getStatusIcon(referee.status)}
                <span className={`mt-2 font-semibold text-base ${getStatusColor(referee.status)}`}>
                  {getStatusText(referee.status)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {!application.referee_1 || !application.referee_2 ? (
          <div className="bg-blue-50 p-4 rounded-xl mt-10 flex flex-col items-center">
            <AlertCircle className="h-6 w-6 text-blue-500 mb-2" />
            <p className="text-blue-700 text-center">
              Your referees will receive an email with instructions to submit their recommendations.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ReferenceStatus; 