import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Program {
  id: string;
  title: string;
  category: string;
  description: string;
  requirements: string[];
  image: string;
  duration?: string;
}

const programsData: Program[] = [
  {
    id: "cs-ug",
    title: "Computer Science",
    category: "undergraduate",
    description:
      "Develop technical skills in computing theory, programming languages, and software development methodologies.",
    requirements: [
      "Five O'Level credits including Mathematics and English",
      "UTME score of 200 and above",
      "Post-UTME screening",
    ],
    duration: "4 Years",
    image:
      "https://images.unsplash.com/photo-1581092919534-6c2e1b3dcd75?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "business-ug",
    title: "Business Administration",
    category: "undergraduate",
    description:
      "Learn key business principles, management techniques, and organizational leadership.",
    requirements: [
      "Five O'Level credits including Mathematics and English",
      "UTME score of 190 and above",
      "Post-UTME screening",
    ],
    duration: "4 Years",
    image:
      "https://images.unsplash.com/photo-1562577309-2592ab84b1bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "medicine-ug",
    title: "Medicine & Surgery",
    category: "undergraduate",
    description:
      "Train to become a medical doctor with comprehensive clinical and theoretical training.",
    requirements: [
      "Five O'Level credits including Biology, Chemistry, Physics, Mathematics and English",
      "UTME score of 250 and above",
      "Post-UTME screening",
      "Interview",
    ],
    duration: "6 Years",
    image:
      "https://images.unsplash.com/photo-1588776814546-ec7e4eb09b6b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "law-ug",
    title: "Law",
    category: "undergraduate",
    description:
      "Study legal principles, legislation, and the justice system to become a practicing lawyer.",
    requirements: [
      "Five O'Level credits including Literature in English and English",
      "UTME score of 240 and above",
      "Post-UTME screening",
    ],
    duration: "5 Years",
    image:
      "https://images.unsplash.com/photo-1593105240524-5b6ec1f7a215?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cs-pg",
    title: "Computer Science (MSc)",
    category: "postgraduate",
    description:
      "Advance your computing knowledge with specialized research and advanced topics.",
    requirements: [
      "Bachelor's degree with minimum of Second Class Lower in Computer Science or related field",
      "CGPA of 3.0/5.0 or equivalent",
      "Transcript from previous institution",
    ],
    duration: "2 Years",
    image:
      "https://images.unsplash.com/photo-1603570418600-cb746ad81242?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "business-pg",
    title: "MBA",
    category: "postgraduate",
    description:
      "Enhance your business acumen and leadership skills with our comprehensive MBA program.",
    requirements: [
      "Bachelor's degree with minimum of Second Class Lower in any discipline",
      "CGPA of 3.0/5.0 or equivalent",
      "2 years work experience",
      "GMAT score (optional)",
    ],
    duration: "18 Months",
    image:
      "https://images.unsplash.com/photo-1603983227353-3f12f42e9d2d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "physics-foundation",
    title: "Physics",
    category: "foundation",
    description:
      "Preparatory program for university admission focusing on physics and related subjects.",
    requirements: [
      "Five O'Level credits",
      "Foundation and Remedial Studies registration",
      "Internal assessment",
    ],
    duration: "1 Year",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "biology-foundation",
    title: "Biology",
    category: "foundation",
    description:
      "Preparatory program for university admission focusing on biology and related subjects.",
    requirements: [
      "Five O'Level credits",
      "Foundation and Remedial Studies registration",
      "Internal assessment",
    ],
    duration: "1 Year",
    image:
      "https://images.unsplash.com/photo-1627556700081-fbaf8a96f118?auto=format&fit=crop&w=800&q=80",
  },
];

const ProgramTabs = () => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [activeCategory, setActiveCategory] = useState("undergraduate");

  const programsByCategory = programsData.filter(
    (p) => p.category === activeCategory
  );

  useEffect(() => {
    setSelectedProgram(null);
  }, [activeCategory]);

  return (
    <section id="programs" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Discover Our <span className="gradient-text">Programs</span>
          </h2>
          <p className="text-gray-600">
            Explore our diverse range of academic programs designed to prepare you for success in your chosen field.
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md rounded-full p-1 bg-gray-200 dark:bg-gray-700">
              <TabsTrigger value="undergraduate" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white dark:text-gray-200">Undergraduate</TabsTrigger>
              <TabsTrigger value="postgraduate" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white dark:text-gray-200">Postgraduate</TabsTrigger>
              <TabsTrigger value="foundation" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white dark:text-gray-200">Foundation and Remedial Studies</TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-8">
            {selectedProgram ? (
              <div className="animate-scale-in">
                <Card className="max-w-4xl mx-auto overflow-hidden border-t-4 border-t-primary">
                  <img src={selectedProgram.image} alt={selectedProgram.title} className="w-full h-60 object-cover" />
                  <CardHeader>
                    <CardTitle>{selectedProgram.title}</CardTitle>
                    <CardDescription className="mt-1 text-base">
                      {selectedProgram.category === "undergraduate"
                        ? "Bachelor's Degree"
                        : selectedProgram.category === "postgraduate"
                        ? "Master's/PhD Program"
                        : "Foundation and Remedial Studies Program"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-2">Program Overview</h4>
                      <p className="text-gray-700">{selectedProgram.description}</p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-2">Program Duration</h4>
                      <p className="text-gray-700">{selectedProgram.duration}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-2">Admission Requirements</h4>
                      <ul className="space-y-2">
                        {selectedProgram.requirements.map((req, idx) => (
                          <li key={idx} className="flex">
                            <CheckCircle2 className="h-5 w-5 text-uni-green mr-2 flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-white  mt-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-primary button-hover py-2 px-6"
                    >
                      <Link to="/signup" className="flex items-center">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <TabsContent value={activeCategory}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {programsByCategory.map((program) => (
                    <Card
                      key={program.id}
                      className={cn(
                        "cursor-pointer overflow-hidden border-none shadow-md hover:shadow-lg transition-all",
                        "rounded-xl"
                      )}
                      onClick={() => setSelectedProgram(program)}
                    >
                      <img src={program.image} alt={program.title} className="w-full h-48 object-cover" />
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">{program.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          {program.category === "undergraduate"
                            ? "Bachelor's Degree"
                            : program.category === "postgraduate"
                            ? "Master's/PhD Program"
                            : "Foundation and Remedial Studies Program"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-600 line-clamp-3">{program.description}</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          variant="ghost" 
                          className="flex items-center text-primary hover:text-primary/80 hover:bg-primary/5 -ml-2"
                        >
                          View Details <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default ProgramTabs;