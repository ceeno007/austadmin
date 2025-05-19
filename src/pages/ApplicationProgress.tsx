import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, CreditCard, LogOut } from "lucide-react";

const ApplicationProgress = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const application = location.state?.application;

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">No Application Data</h2>
          <p className="mb-4">We couldn't find your application progress. Please sign in again.</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const { has_paid, referee_1, referee_2, surname, first_name, program_type, email } = application;
  const allDone = has_paid && referee_1 && referee_2;

  const steps = [
    {
      label: "Payment",
      done: has_paid,
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      label: "Referee 1",
      done: referee_1,
      icon: <User className="w-6 h-6" />,
    },
    {
      label: "Referee 2",
      done: referee_2,
      icon: <User className="w-6 h-6" />,
    },
  ];

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2 relative">
      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="absolute top-6 right-8 flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 shadow"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Application Progress</h1>
          <div className="text-gray-600 text-sm mb-1">{surname} {first_name} &bull; {program_type} &bull; {email}</div>
        </div>
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex-1 flex flex-col items-center relative">
              <div className={`rounded-full border-4 w-12 h-12 flex items-center justify-center mb-2 z-10 ${step.done ? 'border-green-500 bg-green-100 text-green-600' : 'border-gray-300 bg-gray-100 text-gray-400'}`}>
                {step.done ? <CheckCircle className="w-7 h-7 text-green-500" /> : step.icon}
              </div>
              <span className={`text-xs font-medium ${step.done ? 'text-green-700' : 'text-gray-500'}`}>{step.label}</span>
              {idx < steps.length - 1 && (
                <div className={`absolute top-6 left-1/2 w-full h-1 ${steps[idx + 1].done ? 'bg-green-400' : 'bg-gray-300'} z-0`} style={{ width: '100%', left: '50%', transform: 'translateX(0%)' }}></div>
              )}
            </div>
          ))}
        </div>
        {/* Status Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Payment</span>
            <span className={`px-3 py-1 rounded-full text-white ${has_paid ? "bg-green-500" : "bg-yellow-500"}`}>
              {has_paid ? "Completed" : "Pending"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Referee 1</span>
            <span className={`px-3 py-1 rounded-full text-white ${referee_1 ? "bg-green-500" : "bg-yellow-500"}`}>
              {referee_1 ? "Submitted" : "Pending"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Referee 2</span>
            <span className={`px-3 py-1 rounded-full text-white ${referee_2 ? "bg-green-500" : "bg-yellow-500"}`}>
              {referee_2 ? "Submitted" : "Pending"}
            </span>
          </div>
        </div>
        <div className="mt-8 text-center">
          {allDone ? (
            <div className="text-green-600 font-semibold text-lg">All steps completed! Your application is under review.</div>
          ) : (
            <div className="text-yellow-600 font-medium">Please complete all steps to finish your application.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationProgress; 