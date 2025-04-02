
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-uni-purple to-uni-blue flex items-center justify-center text-white font-bold text-xl">U</div>
              <span className="ml-2 text-xl font-clash-display font-bold">UniNigeria</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Transforming lives through education, research, and innovation. Building Nigeria's future leaders since 1990.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="text-gray-300 hover:text-white transition-colors">Programs</Link></li>
              <li><Link to="/admissions" className="text-gray-300 hover:text-white transition-colors">Admissions</Link></li>
              <li><Link to="/campus" className="text-gray-300 hover:text-white transition-colors">Campus Life</Link></li>
              <li><Link to="/research" className="text-gray-300 hover:text-white transition-colors">Research</Link></li>
              <li><Link to="/alumni" className="text-gray-300 hover:text-white transition-colors">Alumni</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Programs</h4>
            <ul className="space-y-2">
              <li><Link to="/programs#undergraduate" className="text-gray-300 hover:text-white transition-colors">Undergraduate Programs</Link></li>
              <li><Link to="/programs#postgraduate" className="text-gray-300 hover:text-white transition-colors">Postgraduate Programs</Link></li>
              <li><Link to="/programs#jupeb" className="text-gray-300 hover:text-white transition-colors">JUPEB Programs</Link></li>
              <li><Link to="/programs#distance" className="text-gray-300 hover:text-white transition-colors">Distance Learning</Link></li>
              <li><Link to="/programs#short" className="text-gray-300 hover:text-white transition-colors">Short Courses</Link></li>
              <li><Link to="/programs#professional" className="text-gray-300 hover:text-white transition-colors">Professional Development</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0 text-primary" />
                <span className="text-gray-300">123 University Road, Lagos, Nigeria</span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0 text-primary" />
                <span className="text-gray-300">+234 800 123 4567</span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0 text-primary" />
                <span className="text-gray-300">admissions@uninigeria.edu.ng</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} UniNigeria. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
