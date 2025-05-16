import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Sitemap = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Sitemap</h1>
            
            <div className="grid md:grid-cols-2 gap-8">
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Main Pages</h2>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-blue-600 hover:text-blue-800">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-blue-600 hover:text-blue-800">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/programs" className="text-blue-600 hover:text-blue-800">
                      Programs
                    </Link>
                  </li>
                  <li>
                    <Link to="/campus" className="text-blue-600 hover:text-blue-800">
                      Campus Life
                    </Link>
                  </li>
                  <li>
                    <Link to="/hostels" className="text-blue-600 hover:text-blue-800">
                      Hostel
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-blue-600 hover:text-blue-800">
                      Contact
                    </Link>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Portal</h2>
                <ul className="space-y-2">
                  <li>
                    <Link to="/login" className="text-blue-600 hover:text-blue-800">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="text-blue-600 hover:text-blue-800">
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800">
                      Forgot Password
                    </Link>
                  </li>
                 
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Programs</h2>
                <ul className="space-y-2">
                  <li>
                    <Link to="/programs?tab=undergraduate" className="text-blue-600 hover:text-blue-800">
                      Undergraduate Programs
                    </Link>
                  </li>
                  <li>
                    <Link to="/programs?tab=postgraduate" className="text-blue-600 hover:text-blue-800">
                      Postgraduate Programs
                    </Link>
                  </li>
                  <li>
                    <Link to="/programs?tab=jupeb" className="text-blue-600 hover:text-blue-800">
                      JUPEB Program
                    </Link>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Legal</h2>
                <ul className="space-y-2">
                  <li>
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                      Terms of Use
                    </Link>
                  </li>
                </ul>
              </section>
            </div>

            <div className="mt-12 text-sm text-gray-500">
              <p>
                This sitemap provides an overview of all the pages available on the AUST Admissions Portal.
                If you cannot find what you are looking for, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sitemap; 