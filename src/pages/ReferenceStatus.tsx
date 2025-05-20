import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle, AlertCircle, Mail } from "lucide-react";

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
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:8000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch application data");
        }

        const data = await response.json();
        if (data.applications && data.applications.length > 0) {
          setApplication(data.applications[0]);
        }
      } catch (error) {
        console.error("Error fetching application:", error);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5500]"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Application Found</h2>
          <p className="mb-4">Please complete your application first.</p>
          <Button onClick={() => navigate("/application")}>Start Application</Button>
        </div>
      </div>
    );
  }

  const referees: Referee[] = [
    {
      name: application.first_referee_name,
      email: application.first_referee_email,
      status: application.referee_1,
    },
    {
      name: application.second_referee_name,
      email: application.second_referee_email,
      status: application.referee_2,
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reference Status
          </h1>
          <p className="text-gray-600">
            Track the status of your referee submissions
          </p>
        </div>

        {/* Success Message when both referees have submitted */}
        {application.referee_1 && application.referee_2 && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100 shadow-sm">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-green-800 text-center mb-2">
              All References Received! 🎉
            </h2>
            <p className="text-green-700 text-center mb-4">
              Both of your referees have submitted their recommendations. Your application is now complete!
            </p>
            <div className="bg-white p-4 rounded-lg border border-green-100">
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
            <Card key={index} className="p-6 bg-white shadow-lg rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Referee {index + 1}
                  </h3>
                  <p className="text-gray-600 mb-2">{referee.name}</p>
                  <p className="text-gray-500 text-sm">{referee.email}</p>
                </div>
                <div className="flex flex-col items-center">
                  {getStatusIcon(referee.status)}
                  <span className={`mt-2 font-medium ${getStatusColor(referee.status)}`}>
                    {getStatusText(referee.status)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          {!application.referee_1 || !application.referee_2 ? (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <AlertCircle className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-blue-700">
                Your referees will receive an email with instructions to submit their
                recommendations.
              </p>
            </div>
          ) : null}

          <Button
            onClick={() => navigate("/application-progress")}
            className="bg-[#FF5500] hover:bg-[#FF5500]/90"
          >
            View Application Progress
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferenceStatus; 