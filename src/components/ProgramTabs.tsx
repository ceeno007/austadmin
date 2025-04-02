
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Program data structure
interface Program {
  id: string;
  title: string;
  category: string;
  description: string;
  requirements: string[];
  emoji: string;
}

// Sample program data
const programsData: Program[] = [
  {
    id: "cs-ug",
    title: "Computer Science",
    category: "undergraduate",
    description: "Develop technical skills in computing theory, programming languages, and software development methodologies.",
    requirements: [
      "Five O'Level credits including Mathematics and English",
      "UTME score of 200 and above",
      "Post-UTME screening"
    ],
    emoji: "💻"
  },
  {
    id: "business-ug",
    title: "Business Administration",
    category: "undergraduate",
    description: "Learn key business principles, management techniques, and organizational leadership.",
    requirements: [
      "Five O'Level credits including Mathematics and English",
      "UTME score of 190 and above",
      "Post-UTME screening"
    ],
    emoji: "📊"
  },
  {
    id: "medicine-ug",
    title: "Medicine & Surgery",
    category: "undergraduate",
    description: "Train to become a medical doctor with comprehensive clinical and theoretical training.",
    requirements: [
      "Five O'Level credits including Biology, Chemistry, Physics, Mathematics and English",
      "UTME score of 250 and above",
      "Post-UTME screening",
      "Interview"
    ],
    emoji: "⚕️"
  },
  {
    id: "law-ug",
    title: "Law",
    category: "undergraduate",
    description: "Study legal principles, legislation, and the justice system to become a practicing lawyer.",
    requirements: [
      "Five O'Level credits including Literature in English and English",
      "UTME score of 240 and above",
      "Post-UTME screening"
    ],
    emoji: "⚖️"
  },
  {
    id: "engineering-ug",
    title: "Electrical Engineering",
    category: "undergraduate",
    description: "Learn to design and develop electrical systems, circuits, and electronic devices.",
    requirements: [
      "Five O'Level credits including Physics, Mathematics and English",
      "UTME score of 200 and above",
      "Post-UTME screening"
    ],
    emoji: "🔌"
  },
  {
    id: "mass-comm-ug",
    title: "Mass Communication",
    category: "undergraduate",
    description: "Learn about media production, journalism, advertising, and public relations.",
    requirements: [
      "Five O'Level credits including English",
      "UTME score of 180 and above",
      "Post-UTME screening"
    ],
    emoji: "🎙️"
  },
  {
    id: "cs-pg",
    title: "Computer Science (MSc)",
    category: "postgraduate",
    description: "Advance your computing knowledge with specialized research and advanced topics.",
    requirements: [
      "Bachelor's degree with minimum of Second Class Lower in Computer Science or related field",
      "CGPA of 3.0/5.0 or equivalent",
      "Transcript from previous institution"
    ],
    emoji: "🖥️"
  },
  {
    id: "business-pg",
    title: "MBA",
    category: "postgraduate",
    description: "Enhance your business acumen and leadership skills with our comprehensive MBA program.",
    requirements: [
      "Bachelor's degree with minimum of Second Class Lower in any discipline",
      "CGPA of 3.0/5.0 or equivalent",
      "2 years work experience",
      "GMAT score (optional)"
    ],
    emoji: "💼"
  },
  {
    id: "physics-jupeb",
    title: "Physics",
    category: "jupeb",
    description: "Preparatory program for university admission focusing on physics and related subjects.",
    requirements: [
      "Five O'Level credits",
      "JUPEB registration",
      "Internal assessment"
    ],
    emoji: "⚛️"
  },
  {
    id: "biology-jupeb",
    title: "Biology",
    category: "jupeb",
    description: "Preparatory program for university admission focusing on biology and related subjects.",
    requirements: [
      "Five O'Level credits",
      "JUPEB registration",
      "Internal assessment"
    ],
    emoji: "🧬"
  }
];

const ProgramTabs = () => {
  // State for the selected program to display details
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [activeCategory, setActiveCategory] = useState("undergraduate");
  
  // Filter programs by category
  const programsByCategory = programsData.filter(program => program.category === activeCategory);
  
  // Reset selected program when category changes
  useEffect(() => {
    setSelectedProgram(null);
  }, [activeCategory]);

  // Animated emojis for tabs
  const categoryEmojis = {
    undergraduate: "👨‍🎓",
    postgraduate: "👩‍🔬",
    jupeb: "📚"
  };

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
        
        <Tabs defaultValue="undergraduate" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md rounded-full p-1 bg-muted">
              <TabsTrigger value="undergraduate" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <span className="mr-2 animate-bounce">{categoryEmojis.undergraduate}</span> Undergraduate
              </TabsTrigger>
              <TabsTrigger value="postgraduate" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <span className="mr-2 animate-bounce">{categoryEmojis.postgraduate}</span> Postgraduate
              </TabsTrigger>
              <TabsTrigger value="jupeb" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <span className="mr-2 animate-bounce">{categoryEmojis.jupeb}</span> JUPEB
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-8">
            {selectedProgram ? (
              <div className="animate-scale-in">
                <Card className="max-w-4xl mx-auto overflow-hidden border-t-4 border-t-primary">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center text-2xl">
                          <span className="text-4xl mr-2">{selectedProgram.emoji}</span>
                          {selectedProgram.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-base">
                          {selectedProgram.category === "undergraduate" 
                            ? "Bachelor's Degree" 
                            : selectedProgram.category === "postgraduate" 
                              ? "Master's/PhD Program" 
                              : "JUPEB Program"}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" onClick={() => setSelectedProgram(null)} className="text-gray-500">
                        Back to list
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-2">Program Overview</h4>
                      <p className="text-gray-700">{selectedProgram.description}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-2">Admission Requirements</h4>
                      <ul className="space-y-2">
                        {selectedProgram.requirements.map((req, index) => (
                          <li key={index} className="flex">
                            <CheckCircle2 className="h-5 w-5 text-uni-green mr-2 flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t">
                    <Button asChild size="lg" className="bg-primary button-hover">
                      <Link to="/signup" className="flex items-center">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <TabsContent value={activeCategory} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {programsByCategory.map((program) => (
                    <Card key={program.id} 
                      className={cn(
                        "cursor-pointer card-hover border-l-4",
                        program.category === "undergraduate" ? "border-l-uni-purple" :
                        program.category === "postgraduate" ? "border-l-uni-blue" :
                        "border-l-uni-orange"
                      )}
                      onClick={() => setSelectedProgram(program)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <span className="text-2xl mr-2">{program.emoji}</span>
                          {program.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{program.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" className="flex items-center text-primary">
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
