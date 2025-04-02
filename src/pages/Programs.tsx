
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Programs = () => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const programs = {
    undergraduate: [
      {
        title: "B.Sc. Computer Science and Engineering",
        description: "Develop skills in algorithms, software engineering, and computer systems.",
        requirements: ["SSCE or equivalent with credits in Mathematics, Physics, and English", "JAMB score of 200+ or Direct Entry", "Computer literacy"],
        id: "cse"
      },
      {
        title: "B.Sc. Petroleum Engineering",
        description: "Learn about exploration, production, and management of oil and gas resources.",
        requirements: ["SSCE or equivalent with credits in Mathematics, Physics, Chemistry, and English", "JAMB score of 200+ or Direct Entry", "Technical aptitude"],
        id: "pe"
      },
      {
        title: "B.Sc. Materials Science and Engineering",
        description: "Study the properties, structure, and applications of various materials.",
        requirements: ["SSCE or equivalent with credits in Mathematics, Physics, Chemistry, and English", "JAMB score of 200+ or Direct Entry"],
        id: "mse"
      }
    ],
    postgraduate: [
      {
        title: "M.Sc. Computer Science",
        description: "Advanced study in algorithms, AI, machine learning, and software engineering.",
        requirements: ["B.Sc. in Computer Science or related field with 2:1 minimum", "Programming experience", "English proficiency"],
        id: "mscs"
      },
      {
        title: "M.Sc. Petroleum Engineering",
        description: "Advanced concepts in oil exploration, drilling technologies, and energy economics.",
        requirements: ["B.Sc. in Petroleum Engineering or related field with 2:1 minimum", "Industry experience preferred", "English proficiency"],
        id: "mspe"
      },
      {
        title: "Ph.D. Computer Science",
        description: "Research-focused doctorate in specialized areas of computer science.",
        requirements: ["M.Sc. in Computer Science or related field", "Research proposal", "English proficiency"],
        id: "phdcs"
      },
      {
        title: "Ph.D. Materials Science and Engineering",
        description: "Advanced research in materials science, nanotechnology, and sustainable materials.",
        requirements: ["M.Sc. in Materials Science or related field", "Research proposal", "English proficiency"],
        id: "phdmse"
      }
    ],
    jupeb: [
      {
        title: "JUPEB Science",
        description: "One-year pre-university program focused on sciences for direct entry.",
        requirements: ["SSCE or equivalent with credits in relevant subjects", "JAMB registration", "Entrance examination"],
        id: "jupebsci"
      },
      {
        title: "JUPEB Engineering",
        description: "One-year pre-university program tailored for engineering pathways.",
        requirements: ["SSCE or equivalent with credits in Mathematics, Physics, and Chemistry", "JAMB registration", "Entrance examination"],
        id: "jupebeng"
      }
    ]
  };

  const handleProgramClick = (id: string) => {
    setSelectedProgram(id === selectedProgram ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-r from-[#FF5500]/10 via-[#FF7A00]/10 to-[#FFA500]/10">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Academic <span className="text-[#FF5500]">Programs</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                AUST Abuja offers a wide range of accredited programs designed to prepare students 
                for leadership roles in science, technology, engineering, and mathematics.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="undergraduate" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="undergraduate">Undergraduate Programs</TabsTrigger>
                <TabsTrigger value="postgraduate">Postgraduate Programs</TabsTrigger>
                <TabsTrigger value="jupeb">JUPEB Programs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="undergraduate">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold mb-4">Undergraduate Programs</h2>
                  <p className="text-gray-600 mb-8">
                    Our undergraduate programs provide a strong foundation in science and engineering, 
                    preparing students for successful careers in these fields.
                  </p>
                  
                  <div className="space-y-6">
                    {programs.undergraduate.map((program) => (
                      <div 
                        key={program.id}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleProgramClick(program.id)}
                      >
                        <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                        <p className="text-gray-600 mb-2">{program.description}</p>
                        
                        {selectedProgram === program.id && (
                          <div className="mt-4 animate-fade-in">
                            <h4 className="font-semibold text-[#FF5500] mb-2">Requirements:</h4>
                            <ul className="list-none space-y-2">
                              {program.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start">
                                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-6">
                              <Button asChild className="bg-[#FF5500] hover:bg-[#e64d00]">
                                <Link to="/signup" className="flex items-center">
                                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="postgraduate">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold mb-4">Postgraduate Programs</h2>
                  <p className="text-gray-600 mb-8">
                    Our postgraduate programs offer advanced knowledge and research opportunities 
                    in specialized areas of science and technology.
                  </p>
                  
                  <div className="space-y-6">
                    {programs.postgraduate.map((program) => (
                      <div 
                        key={program.id}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleProgramClick(program.id)}
                      >
                        <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                        <p className="text-gray-600 mb-2">{program.description}</p>
                        
                        {selectedProgram === program.id && (
                          <div className="mt-4 animate-fade-in">
                            <h4 className="font-semibold text-[#FF5500] mb-2">Requirements:</h4>
                            <ul className="list-none space-y-2">
                              {program.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start">
                                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-6">
                              <Button asChild className="bg-[#FF5500] hover:bg-[#e64d00]">
                                <Link to="/signup" className="flex items-center">
                                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="jupeb">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold mb-4">JUPEB Programs</h2>
                  <p className="text-gray-600 mb-8">
                    Our Joint Universities Preliminary Examination Board (JUPEB) programs provide an alternative 
                    pathway to undergraduate admission.
                  </p>
                  
                  <div className="space-y-6">
                    {programs.jupeb.map((program) => (
                      <div 
                        key={program.id}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleProgramClick(program.id)}
                      >
                        <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                        <p className="text-gray-600 mb-2">{program.description}</p>
                        
                        {selectedProgram === program.id && (
                          <div className="mt-4 animate-fade-in">
                            <h4 className="font-semibold text-[#FF5500] mb-2">Requirements:</h4>
                            <ul className="list-none space-y-2">
                              {program.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start">
                                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-6">
                              <Button asChild className="bg-[#FF5500] hover:bg-[#e64d00]">
                                <Link to="/signup" className="flex items-center">
                                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Programs;
