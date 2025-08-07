import React from "react";
import Navbar from "@/components/Navbar";

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
                  This Privacy Policy explains how the African University of Science and Technology, Abuja (AUST) collects, uses, and protects your personal information when you use our admissions portal and related services.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Information We Collect</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personal details (name, date of birth, contact information, nationality, etc.)</li>
                  <li>Academic records and credentials</li>
                  <li>Uploaded documents (certificates, transcripts, passport photo, etc.)</li>
                  <li>Payment and transaction information</li>
                  <li>Application progress and status</li>
                  <li>Technical data (IP address, browser type, device information, usage data)</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">3. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To process and review your application for admission</li>
                  <li>To communicate with you about your application, payments, and university updates</li>
                  <li>To verify your identity and credentials</li>
                  <li>To process payments and issue receipts</li>
                  <li>To improve our portal and services</li>
                  <li>To comply with legal and regulatory requirements</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">4. Data Protection & Security</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your data is stored securely and only accessible to authorized AUST staff and service providers.</li>
                  <li>We use encryption, access controls, and regular security reviews to protect your information.</li>
                  <li>We do not sell or share your personal data with third parties except as required for admissions processing or by law.</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">5. Your Rights</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You may request access to, correction, or deletion of your personal data by contacting us.</li>
                  <li>You may withdraw your application at any time, but some data may be retained as required by law.</li>
                  <li>For privacy-related inquiries, contact it@aust.edu.ng.</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">6. Cookies & Tracking</h2>
                <p className="mb-4">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and improve our services. You can control cookies through your browser settings.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">7. Changes to This Policy</h2>
                <p className="mb-4">
                  We may update this Privacy Policy from time to time. The latest version will always be available on our website.
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

export default Privacy; 