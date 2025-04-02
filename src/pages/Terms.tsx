import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
                  By accessing and using the African University of Science and Technology, Abuja (AUST) website and services, you agree to be bound by these Terms of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Academic Integrity</h2>
                <p className="mb-4">
                  Students and users must maintain the highest standards of academic integrity. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Submitting original work</li>
                  <li>Properly citing sources</li>
                  <li>Not engaging in plagiarism</li>
                  <li>Not sharing account credentials</li>
                  <li>Respecting intellectual property rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">3. User Accounts</h2>
                <p className="mb-4">When creating an account, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any security breaches</li>
                  <li>Not transfer your account to anyone else</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">4. Intellectual Property</h2>
                <p className="mb-4">
                  All content on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and software, is the property of AUST or its content suppliers and is protected by Nigerian and international copyright laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">5. Prohibited Activities</h2>
                <p className="mb-4">Users are prohibited from:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Using the service for any illegal purpose</li>
                  <li>Attempting to gain unauthorized access to systems</li>
                  <li>Interfering with other users' access to the service</li>
                  <li>Uploading malicious software</li>
                  <li>Engaging in harassment or discriminatory behavior</li>
                  <li>Violating any Nigerian laws or regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">6. Payment Terms</h2>
                <p className="mb-4">
                  All fees and charges are subject to the university's current fee structure. Payment terms include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fees must be paid by specified deadlines</li>
                  <li>All transactions are in Nigerian Naira</li>
                  <li>Refunds are subject to university policy</li>
                  <li>Late payment may incur additional charges</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">7. Limitation of Liability</h2>
                <p className="mb-4">
                  AUST shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">8. Changes to Terms</h2>
                <p className="mb-4">
                  AUST reserves the right to modify these terms at any time. We will notify users of any material changes via email or through the website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">9. Governing Law</h2>
                <p className="mb-4">
                  These terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the Nigerian courts.
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

export default Terms; 