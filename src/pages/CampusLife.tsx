import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Coffee, 
  Home, 
  Laptop, 
  Library, 
  Users, 
  Dumbbell, 
  Gamepad2,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import campusLife from "@/assets/images/campusLife.jpg";
import research from "@/assets/images/research.jpg";
import housing from "@/assets/images/housing.jpg";
import cafeteria from "@/assets/images/Cafeteria.jpg";
// import gym from "@/assets/images/gym.jpg";
import library from "@/assets/images/library.jpg";

const CampusLife = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-r from-[#FF5500]/10 via-[#FF7A00]/10 to-[#FFA500]/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Campus <span className="text-[#FF5500]">Life</span>
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  Experience a vibrant and enriching campus life at AUST Abuja. Our community 
                  offers students a perfect blend of academic excellence and personal growth opportunities.
                </p>
              </div>
              <div className="md:w-1/2 ml-0 md:ml-8">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={campusLife}
                    alt="AUST Campus Life"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Campus Facilities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                     src={library}
                    alt="AUST Library"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-[#FF5500]/10 flex items-center justify-center mr-3">
                      <Library className="h-5 w-5 text-[#FF5500]" />
                    </div>
                    <h3 className="text-xl font-bold">Modern Library</h3>
                  </div>
                  <p className="text-gray-600">
                    Our state-of-the-art library houses thousands of books, journals, and digital resources to support your academic journey.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000"
                    alt="Computer Labs"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-[#FF7A00]/10 flex items-center justify-center mr-3">
                      <Laptop className="h-5 w-5 text-[#FF7A00]" />
                    </div>
                    <h3 className="text-xl font-bold">Computer Labs</h3>
                  </div>
                  <p className="text-gray-600">
                    Equipped with the latest hardware and software, our computer labs provide the perfect environment for tech innovation.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={research}
                    alt="Research Facilities"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-[#FFA500]/10 flex items-center justify-center mr-3">
                      <BookOpen className="h-5 w-5 text-[#FFA500]" />
                    </div>
                    <h3 className="text-xl font-bold">Research Facilities</h3>
                  </div>
                  <p className="text-gray-600">
                    Our research facilities are equipped with cutting-edge technology and resources to support innovative research across various disciplines:
                  </p>
                
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={housing}
                    alt="Student Housing"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-[#FF5500]/10 flex items-center justify-center mr-3">
                      <Home className="h-5 w-5 text-[#FF5500]" />
                    </div>
                    <h3 className="text-xl font-bold">Student Housing</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Comfortable and secure accommodation options to make you feel at home while you focus on your studies.
                  </p>
                  <Button asChild variant="outline" className="border-[#FF5500] text-[#FF5500] hover:bg-[#ff550011]">
                    <Link to="/hostels" className="flex items-center">
                      See All Hostels <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={cafeteria}
                    alt="Cafeteria"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-[#FF7A00]/10 flex items-center justify-center mr-3">
                      <Coffee className="h-5 w-5 text-[#FF7A00]" />
                    </div>
                    <h3 className="text-xl font-bold">Cafeteria</h3>
                  </div>
                  <p className="text-gray-600">
                    Our cafeteria serves nutritious and delicious meals, catering to various dietary preferences.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    // src={library}
                    alt="Sports Facilities"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-[#FFA500]/10 flex items-center justify-center mr-3">
                      <Dumbbell className="h-5 w-5 text-[#FFA500]" />
                    </div>
                    <h3 className="text-xl font-bold">Sports Facilities</h3>
                  </div>
                  <p className="text-gray-600">
                    Stay active with our comprehensive sports facilities including basketball courts, football field, and gym.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Student Life & Activities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#FF5500]/10 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-[#FF5500]" />
                  </div>
                  <h3 className="text-xl font-bold">Student Organizations</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Join one of our many student-led organizations to develop leadership skills and build lifelong connections.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Student Government Association</li>
                  <li>Academic Clubs (Engineering Society, Computing Club)</li>
                  <li>Cultural Associations</li>
                  <li>Community Service Groups</li>
                  <li>Professional Development Networks</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#FF7A00]/10 flex items-center justify-center mr-3">
                    <Gamepad2 className="h-5 w-5 text-[#FF7A00]" />
                  </div>
                  <h3 className="text-xl font-bold">Campus Events</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Experience a vibrant campus life with regular events that enrich your university experience.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Annual Tech Festival</li>
                  <li>Cultural Celebrations</li>
                  <li>Guest Lectures and Seminars</li>
                  <li>Sports Competitions</li>
                  <li>Career Fairs and Networking Events</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CampusLife;
