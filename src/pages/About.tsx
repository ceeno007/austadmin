
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, BookOpen, Globe, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-r from-[#FF5500]/10 via-[#FF7A00]/10 to-[#FFA500]/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  About <span className="text-[#FF5500]">AUST Abuja</span>
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  The African University of Science and Technology (AUST) is a world-class center for training and research in science, engineering, and technology.
                </p>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <p className="text-xl font-semibold mb-2 text-[#FF5500]">"Knowledge is Freedom"</p>
                  <p className="text-gray-600">
                    Our vision is to become the premier pan-African center of excellence for research and education in science and engineering.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 ml-0 md:ml-8">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000"
                    alt="AUST Campus"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Mission & Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-[#FF5500]/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-[#FF5500]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We are committed to academic excellence and innovation in research and teaching.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-[#FF7A00]/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-[#FF7A00]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Pan-African</h3>
                <p className="text-gray-600">
                  We serve students from across Africa, fostering continental integration through education.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-[#FFA500]/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[#FFA500]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Diversity</h3>
                <p className="text-gray-600">
                  We embrace diversity and create an inclusive environment for all students and faculty.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-[#FF5500]/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-[#FF5500]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We drive innovation to solve Africa's most pressing challenges through research and technology.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our History</h2>
            
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
                <p className="mb-4">
                  The African University of Science and Technology (AUST) was established in Abuja, Nigeria as a Pan-African institution in 2007. It was created through the collaboration of the Nelson Mandela Institution and the World Bank Institute to address the critical shortage of scientists and engineers in Africa.
                </p>
                <p className="mb-4">
                  Since its inception, AUST has been dedicated to providing world-class education in science and engineering disciplines to students from various African countries. The university has maintained strong partnerships with leading global institutions and industries.
                </p>
                <p>
                  Today, AUST stands as a center of excellence in education and research, with a focus on addressing Africa's unique challenges through science, technology, and innovation. Our graduates are making significant contributions in various sectors across the continent and beyond.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
