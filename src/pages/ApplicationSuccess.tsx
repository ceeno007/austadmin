import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, Mail, Sparkles, Bell, Calendar, LogOut, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

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
  const { logout, user } = useAuth();
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

  // Removed scroll lock to allow scrolling on this page

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderProgramSpecificContent = () => {
    switch (programType.toLowerCase()) {
      case 'postgraduate':
        return (
          <motion.div 
            className="mt-8 border-t border-gray-200 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-amber-500" />
              Reference Status
            </h3>
            {refereeStatus && (
              <div className="space-y-4">
                {/* Referee 1 Status */}
                <motion.div 
                  className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <div>
                    <p className="font-medium text-gray-800">Referee 1</p>
                    <p className="text-sm text-gray-600">{refereeStatus.referee1.email}</p>
                  </div>
                  {refereeStatus.referee1.submitted ? (
                    <div className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      <span className="font-medium">Submitted</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Pending</span>
                    </div>
                  )}
                </motion.div>

                {/* Referee 2 Status */}
                <motion.div 
                  className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div>
                    <p className="font-medium text-gray-800">Referee 2</p>
                    <p className="text-sm text-gray-600">{refereeStatus.referee2.email}</p>
                  </div>
                  {refereeStatus.referee2.submitted ? (
                    <div className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      <span className="font-medium">Submitted</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Pending</span>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
        );
      
      case 'foundation':
      case 'undergraduate':
      default:
        return (
          <motion.div 
            className="mt-8 border-t border-gray-200 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="flex items-center justify-center text-blue-600 mb-4">
              <Mail className="h-8 w-8 mr-2" />
              <h3 className="text-xl font-semibold">Check Your Email</h3>
            </div>
            <p className="text-center text-gray-600">
              We have sent a confirmation email to {user?.email}. Please check your email for updates on your application status.
            </p>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-8 px-4 sm:px-6 lg:px-8 overflow-auto">
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="bg-white dark:bg-gray-900/60 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
        >
          {/* Header with confetti-like decoration */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-10 px-8">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 20 + 5 + 'px',
                    height: Math.random() * 20 + 5 + 'px',
                    backgroundColor: ['#FCD34D', '#FCA5A5', '#93C5FD', '#A7F3D0', '#C4B5FD'][Math.floor(Math.random() * 5)],
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                  }}
                ></div>
              ))}
            </div>
            <motion.div 
              className="relative flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
            >
              <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </motion.div>
            <motion.h2 
              className="mt-6 text-3xl font-bold text-white text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Application Submitted Successfully!
            </motion.h2>
            <motion.p 
              className="mt-2 text-lg text-blue-100 text-center max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Thank you for submitting your application to AUST. We're excited to review your qualifications.
            </motion.p>
          </div>

          <div className="p-8">
            {/* Email notification section */}
            <motion.div 
              className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 rounded-xl p-6 shadow-sm border border-amber-100 dark:border-gray-700 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 dark:bg-slate-700">
                  <Bell className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-900 dark:text-gray-100 mb-2 text-center sm:text-left">
                    Important: Check Your Email Regularly
                  </h3>
                  <p className="text-amber-700 dark:text-gray-300 mb-3 text-center sm:text-left">
                    We will be sending important updates about your application status and next steps to your registered email address.
                  </p>
                  
                  <ul className="space-y-2 text-sm text-amber-800 dark:text-gray-200">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>Check your inbox (and spam folder) daily for communications from AUST</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>Add <strong>admissions@aust.edu.ng</strong> to your contacts to prevent emails going to spam</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>Respond promptly to any requests for additional information</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Next steps section */}
            <motion.div 
              className="bg-blue-50 dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-blue-100 dark:border-gray-700 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-slate-700">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-gray-100 mb-2 text-center sm:text-left">
                    What Happens Next
                  </h3>
                  <ol className="space-y-3 text-sm text-blue-800 dark:text-gray-300 list-decimal list-inside">
                    <li className="pl-2">Our admissions team will review your application</li>
                    <li className="pl-2">You may be contacted for additional documents or information</li>
                    <li className="pl-2">Shortlisted candidates may be invited for an interview</li>
                    <li className="pl-2">Final admission decision will be sent to your email</li>
                  </ol>
                  
                  {/* <div className="mt-4">
                    <p className="text-sm text-blue-700">
                      The review process typically takes 2-3 weeks. You can check your application status by logging in to your account.
                    </p>
                  </div> */}
                </div>
              </div>
            </motion.div>

            {/* Program specific content */}
            {renderProgramSpecificContent()}

            {/* Contact section */}
            <motion.div 
              className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Need Help?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about your application, please contact our admissions team:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="mailto:admissions@aust.edu.ng" 
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  admissions@aust.edu.ng
                </a>
                {/* <a 
                  href="https://www.aust.edu.ng/admissions/faq" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View FAQs
                </a> */}
              </div>
            </motion.div>

            {/* Logout button */}
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white dark:border-gray-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Home
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ApplicationSuccess; 