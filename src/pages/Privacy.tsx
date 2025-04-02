import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="space-y-8 text-gray-600">
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Introduction</h2>
                <p className="mb-4">
                  This Privacy Policy explains how the African University of Science and Technology, Abuja (AUST) collects, uses, and protects your personal information in accordance with the Nigeria Data Protection Regulation (NDPR) and other applicable laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Information We Collect</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personal identification information (Name, email address, phone number, etc.)</li>
                  <li>Academic records and credentials</li>
                  <li>Financial information for payment processing</li>
                  <li>Application and admission-related documents</li>
                  <li>Website usage data and cookies information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">3. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process admission applications and enrollment</li>
                  <li>Provide educational services and support</li>
                  <li>Communicate important updates and announcements</li>
                  <li>Process payments and financial aid</li>
                  <li>Improve our services and website functionality</li>
                  <li>Comply with legal obligations and academic regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">4. Data Protection</h2>
                <p className="mb-4">
                  We implement appropriate security measures to protect your personal information in accordance with the NDPR. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of sensitive data</li>
                  <li>Secure servers and databases</li>
                  <li>Regular security audits and updates</li>
                  <li>Staff training on data protection</li>
                  <li>Access controls and authentication measures</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">5. Your Rights</h2>
                <p className="mb-4">Under the NDPR, you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Request corrections to your data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to data processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">6. Contact Information</h2>
                <p className="mb-4">
                  For any privacy-related inquiries or requests, please contact our Data Protection Officer at:
                </p>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p>Email: privacy@aust.edu.ng</p>
                  <p>Phone: +234 701 234 5678</p>
                  <p>Address: Km 10 Airport Road, Galadimawa, Abuja, Nigeria</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">7. Updates to This Policy</h2>
                <p>
                  We may update this Privacy Policy periodically. The latest version will always be available on our website, with the effective date clearly stated.
                </p>
              </section>

              <div className="text-sm text-gray-500 mt-8">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy; 