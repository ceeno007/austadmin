import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Application {
  uuid: string;
  has_paid: boolean;
  first_referee_name: string;
  first_referee_email: string;
  second_referee_name: string;
  second_referee_email: string;
  referee_1: boolean;
  referee_2: boolean;
}

const PostgraduateForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_referee_name: "",
    first_referee_email: "",
    second_referee_name: "",
    second_referee_email: "",
  });

  useEffect(() => {
    const checkAndRedirect = async () => {
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
        console.log("Application data:", data);

        if (data.applications && data.applications.length > 0) {
          const app = data.applications[0];
          console.log("Application found:", app);
          console.log("Has paid status:", app.has_paid);

          if (app.has_paid === true) {
            console.log("User has paid, redirecting to reference status...");
            navigate("/reference-status", { replace: true });
            return;
          }

          console.log("User has not paid, setting form data");
          setApplication(app);
          setFormData({
            first_referee_name: app.first_referee_name || "",
            first_referee_email: app.first_referee_email || "",
            second_referee_name: app.second_referee_name || "",
            second_referee_email: app.second_referee_email || "",
          });
        } else {
          console.log("No applications found");
        }
      } catch (error) {
        console.error("Error in checkAndRedirect:", error);
        toast({
          title: "Error",
          description: "Failed to load application data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAndRedirect();
  }, [navigate, toast]);

  // Early return if loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5500]"></div>
      </div>
    );
  }

  // Don't render the form if application is paid
  if (application?.has_paid === true) {
    console.log("Application is paid, redirecting to reference status...");
    navigate("/reference-status", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Postgraduate Application Form
          </h1>
          <p className="text-gray-600">
            Please fill in your referee details
          </p>
        </div>

        <Card className="p-6">
          <form className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="first_referee_name">First Referee Name</Label>
                <Input
                  id="first_referee_name"
                  value={formData.first_referee_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_referee_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="first_referee_email">First Referee Email</Label>
                <Input
                  id="first_referee_email"
                  type="email"
                  value={formData.first_referee_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_referee_email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="second_referee_name">Second Referee Name</Label>
                <Input
                  id="second_referee_name"
                  value={formData.second_referee_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, second_referee_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="second_referee_email">Second Referee Email</Label>
                <Input
                  id="second_referee_email"
                  type="email"
                  value={formData.second_referee_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, second_referee_email: e.target.value }))}
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#FF5500] hover:bg-[#FF5500]/90">
              Submit
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PostgraduateForm; 