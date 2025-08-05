import React from "react";
import { 
  GraduationCap, 
  Globe, 
  Lightbulb, 
  Users, 
  BookOpen, 
  HeartHandshake,
  Target,
  Award,
  Brain,
  Rocket,
  Shield,
  Leaf,
  CheckCircle2
} from "lucide-react";
import SEO from "@/components/SEO";

const About = () => {
  return (
    <>
      <SEO 
        title="About AUST"
        description="Learn about AUST's mission, vision, and commitment to academic excellence in science and technology education."
        keywords="AUST, African University of Science and Technology, mission, vision, academic excellence, science and technology"
        url={`${window.location.origin}/about`}
        type="website"
      />
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-r from-[#FF5500]/10 via-[#FF7A00]/10 to-[#FFA500]/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  About <span className="text-[#FF5500]">AUST</span>
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  AUST is a world-class center for training and research in science, engineering, and technology.
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
                    src="https://ik.imagekit.io/nsq6yvxg1/Upload/SKF00909.jpg?updatedAt=1747908548002"
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FF6B00]/10 rounded-full">
                    <GraduationCap className="h-6 w-6 text-[#FF6B00]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Academic Excellence</h3>
                </div>
                <p className="text-gray-600">
                  We are committed to maintaining the highest standards of academic rigor and intellectual inquiry.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FF6B00]/10 rounded-full">
                    <Globe className="h-6 w-6 text-[#FF6B00]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Global Perspective</h3>
                </div>
                <p className="text-gray-600">
                  We prepare students to be global citizens, equipped to navigate and contribute to an interconnected world.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FF6B00]/10 rounded-full">
                    <Lightbulb className="h-6 w-6 text-[#FF6B00]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Innovation</h3>
                </div>
                <p className="text-gray-600">
                  We foster a culture of creativity and forward-thinking, encouraging new ideas and solutions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FF6B00]/10 rounded-full">
                    <Users className="h-6 w-6 text-[#FF6B00]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Community</h3>
                </div>
                <p className="text-gray-600">
                  We build a supportive and inclusive community where every member can thrive.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FF6B00]/10 rounded-full">
                    <BookOpen className="h-6 w-6 text-[#FF6B00]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Lifelong Learning</h3>
                </div>
                <p className="text-gray-600">
                  We instill a passion for continuous learning and personal growth.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FF6B00]/10 rounded-full">
                    <HeartHandshake className="h-6 w-6 text-[#FF6B00]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Integrity</h3>
                </div>
                <p className="text-gray-600">
                  We uphold the highest ethical standards in all our endeavors.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our History</h2>

            <div className="max-w-6xl mx-auto">
              <div className="bg-white border-2 border-[#FF6B00] rounded-xl overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-8 md:p-12">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed mb-6">
                        AUST was established in Abuja, Nigeria as a Pan-African institution in 2007. It was created through the collaboration of the Nelson Mandela Institution and the World Bank Institute to address the critical shortage of scientists and engineers in Africa.
                      </p>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        Located at Km 10, Airport Road, Galadimawa, Abuja, FCT, Nigeria, AUST has been dedicated to providing world-class education in science and engineering disciplines to students from various African countries.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Today, AUST stands as a center of excellence in education and research, with a focus on addressing Africa's unique challenges through science, technology, and innovation.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100">
                    <iframe
                      className="w-full h-full min-h-[400px]"
                      src="https://www.youtube.com/embed/6r_ZztNbG-M"
                      title="AUST Campus Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
