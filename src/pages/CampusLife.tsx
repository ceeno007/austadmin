import React, { Suspense, useState, useCallback } from "react";
import { Link } from "react-router-dom";
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
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const CampusLife = () => {
  const [showFlickrDialog, setShowFlickrDialog] = useState(false);

  const handleFlickrClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowFlickrDialog(true);
  }, []);

  const handleConfirmNavigation = useCallback(() => {
    window.open("https://www.flickr.com/photos/austabuja/albums/72157719735619470/with/51380207850/", "_blank");
    setShowFlickrDialog(false);
  }, []);

  return (
    <Suspense fallback={<div className="p-8"><Skeleton className="h-96 w-full rounded-xl" /></div>}>
      <SEO 
        title="Campus Life | AUST"
        description="Experience vibrant campus life at AUST with modern facilities, student organizations, and enriching activities. Discover our library, computer labs, research facilities, and more."
        keywords="AUST campus life, student facilities, library, computer labs, research facilities, student organizations, campus events"
        url={`${window.location.origin}/campus-life`}
        type="website"
      />
      
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
                    src="https://ik.imagekit.io/nsq6yvxg1/Upload/_dsc9428_51379905094_o.jpg?updatedAt=1747307174844"
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
                    src="https://ik.imagekit.io/nsq6yvxg1/Upload/images/library.jpg"
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
                    src="https://ik.imagekit.io/nsq6yvxg1/Upload/computer-lab-education-technology.jpg?updatedAt=1747333577322"
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
                    src="https://ik.imagekit.io/nsq6yvxg1/Upload/51379926499_24295c4ce0_o.jpg?updatedAt=1747332863644"
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
                  
                  <Button 
                    onClick={handleFlickrClick}
                    variant="outline" 
                    className="mt-4 border-[#FF5500] text-[#FF5500] hover:bg-[#ff550011]"
                  >
                    View Images <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://ik.imagekit.io/nsq6yvxg1/Upload/images/housing.jpg"
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
                    src="https://ik.imagekit.io/nsq6yvxg1/Upload/aust3.jpg?updatedAt=1747928047990"
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
                    src='https://ik.imagekit.io/nsq6yvxg1/Upload/aust2.jpg?updatedAt=1747928050526'
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
      
      {/* Flickr External Link Confirmation Dialog */}
      <Dialog open={showFlickrDialog} onOpenChange={setShowFlickrDialog}>
        <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] sm:w-full sm:max-w-md rounded-2xl border-gray-200/50 shadow-xl">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold">External Link</DialogTitle>
            <DialogDescription className="text-gray-600">
              You are about to visit an external website to view images of our research facilities. Would you like to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex flex-col items-center justify-center gap-3 mt-6 w-full">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <DialogClose asChild>
                  <Button variant="secondary" className="w-full sm:w-auto">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={handleConfirmNavigation}
                  className="w-full sm:w-auto bg-[#FF5500] hover:bg-[#e64d00] flex items-center gap-2"
                >
                  Continue to Flickr
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Suspense>
  );
};

export default CampusLife;
