import React from "react";
import Navbar from "@/components/Navbar";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Terms of Use</h1>
            <div className="space-y-8 text-gray-600">
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Acceptance of Terms</h2>
                <p className="mb-4">
                  By accessing and using the African University of Science and Technology, Abuja (AUST) admissions portal, you agree to comply with these Terms of Use and all applicable laws and regulations. If you do not agree, please do not use this site.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Use of the Portal</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>This portal is for prospective and current applicants to submit applications, upload documents, track progress, and make payments for AUST programs.</li>
                  <li>You agree to provide accurate, current, and complete information during the application process.</li>
                  <li>Impersonation or providing false information is strictly prohibited and may result in disqualification or legal action.</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">3. User Accounts & Security</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                  <li>Notify AUST immediately at it@aust.edu.ng if you suspect unauthorized use of your account.</li>
                  <li>You are responsible for all activities that occur under your account.</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">4. Application & Payment</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All application fees and payments must be made through the official payment channels provided on this portal.</li>
                  <li>Payments are non-refundable except as expressly stated by AUST policy.</li>
                  <li>Submission of an application does not guarantee admission.</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">5. Document Uploads</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All documents uploaded must be authentic and belong to the applicant.</li>
                  <li>Forgery or misrepresentation of documents will result in immediate disqualification and may be reported to authorities.</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">6. Prohibited Conduct</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Do not attempt to gain unauthorized access to the portal or other users’ data.</li>
                  <li>Do not upload malicious software or engage in any activity that disrupts the portal’s operation.</li>
                  <li>Do not harass, threaten, or abuse other users or AUST staff.</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">7. Intellectual Property</h2>
                <p className="mb-4">
                  All content on this portal, including text, graphics, logos, and software, is the property of AUST or its licensors and is protected by copyright and other laws.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">8. Limitation of Liability</h2>
                <p className="mb-4">
                  AUST is not liable for any indirect, incidental, or consequential damages arising from your use of this portal. Use of the portal is at your own risk.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">9. Changes to Terms</h2>
                <p className="mb-4">
                  AUST may update these Terms of Use at any time. Continued use of the portal after changes constitutes acceptance of the new terms.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">10. Governing Law</h2>
                <p className="mb-4">
                  These terms are governed by the laws of the Federal Republic of Nigeria.
                </p>
              </section>
              <div className="text-sm text-gray-500 mt-8">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms; 