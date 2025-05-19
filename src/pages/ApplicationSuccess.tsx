import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, Mail } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface RefereeStatus {
  referee1: {
    submitted: boolean;
    email: string;
  };
  referee2: {
    submitted: boolean;
    email: string;
  };
}

const ApplicationSuccess = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [refereeStatus, setRefereeStatus] = useState<RefereeStatus | null>(null);
  const [programType, setProgramType] = useState<string>('');

  useEffect(() => {
    // Get application data from localStorage
    const applicationData = localStorage.getItem('applicationData');
    if (applicationData) {
      const data = JSON.parse(applicationData);
      // Extract program type
      setProgramType(data.program_type || data.program || '');
      
      // Extract referee information for postgraduate
      if (data.references) {
        setRefereeStatus({
          referee1: {
            submitted: data.references.referee1?.submitted || false,
            email: data.references.referee1?.email || ''
          },
          referee2: {
            submitted: data.references.referee2?.submitted || false,
            email: data.references.referee2?.email || ''
          }
        });
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderProgramSpecificContent = () => {
    switch (programType.toLowerCase()) {
      case 'postgraduate':
        return (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Reference Status
            </h3>
            {refereeStatus && (
              <div className="space-y-4">
                {/* Referee 1 Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Referee 1</p>
                    <p className="text-sm text-gray-600">{refereeStatus.referee1.email}</p>
                  </div>
                  {refereeStatus.referee1.submitted ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      <span>Submitted</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-600">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>Pending</span>
                    </div>
                  )}
                </div>

                {/* Referee 2 Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Referee 2</p>
                    <p className="text-sm text-gray-600">{refereeStatus.referee2.email}</p>
                  </div>
                  {refereeStatus.referee2.submitted ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      <span>Submitted</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-600">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>Pending</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'foundation':
      case 'undergraduate':
        return (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="flex items-center justify-center text-blue-600 mb-4">
              <Mail className="h-8 w-8 mr-2" />
              <h3 className="text-xl font-semibold">Check Your Email</h3>
            </div>
            <p className="text-center text-gray-600 font-semibold">
              Please check your email regularly for updates on your application status.<br />
              All important information and next steps will be sent to your email address.
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Application Submitted Successfully!
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Thank you for submitting your application. We will review it and get back to you soon.
            </p>
          </div>

          {renderProgramSpecificContent()}

          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="flex justify-center">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuccess; 