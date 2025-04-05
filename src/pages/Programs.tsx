import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X, FileText } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";



import softwareEngineeringImg from "@/assets/images/software-engineering.jpg";
import computerScienceImg from "@/assets/images/computer-science.jpg";
import petroleumEngineeringImg from "@/assets/images/petroleum-engineering.jpg";
import accountingImg from "@/assets/images/accounting.jpg";
import businessAdminImg from "@/assets/images/business-admin.jpg";
import civilEngineeringImg from "@/assets/images/civil-engineering.jpg";
import materialsEngineeringImg from "@/assets/images/materials-metallurgical.jpg";
import mechanicalEngineeringImg from "@/assets/images/mechanical.jpg";
import defaultProgramImg from "@/assets/images/default.jpg";

import aerospaceImg from "@/assets/images/aerospace.jpg";
import gisImg from "@/assets/images/gis.jpg";
import mitImg from "@/assets/images/mit.jpg";
import systemsImg from "@/assets/images/systems.jpg";
import modelingImg from "@/assets/images/modeling.jpg";
import mathImg from "@/assets/images/math.jpg";
import petroleumImg from "@/assets/images/petroleum.jpg";
import publicAdminImg from "@/assets/images/public-admin.jpg";
import spacePhysicsImg from "@/assets/images/space-physics.jpg";
import PolicyImg from "@/assets/images/policy.jpg";
import physicsImg from "@/assets/images/physics.jpg";
import appliedStatsImg from "@/assets/images/applied-stats.jpg";
import jupebScienceImg from "@/assets/images/jupeb-science.jpg";



const Programs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("undergraduate");

  // Check for tab parameter in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get("tab");
    if (tabParam && ["undergraduate", "postgraduate", "jupeb"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Updated images for each program to better match the course
  const tabs = {
    undergraduate: [
      {
        title: "B.Sc. Software Engineering",
        duration: "4 years",
        schoolFees: "₦2,212,727 per session",
        image:softwareEngineeringImg,
        description: "Focus on software development methodologies, tools, and systems design.",
        requirements: [
          "Five SSC credits including English, Mathematics, Physics/Data Processing",
          "UTME Subjects: Mathematics, Physics, and one other Science subject",
          "JAMB score of 200+"
        ],
        pdf: "/pdfs/Departmental Handbook - Software Engineering [Undergraduate].pdf"
      },
      {
        title: "B.Sc. Computer Science",
        duration: "4 years",
        schoolFees: "₦2,212,727 per session",
        image: computerScienceImg,
        description: "Develop skills in algorithms, software engineering, and computer systems.",
        requirements: [
          "Five SSC credits including English, Mathematics, Physics/Data Processing",
          "UTME Subjects: Mathematics, Physics, and one other Science subject",
          "JAMB score of 200+"
        ],
        pdf: "/pdfs/Departmental Handbook - Computer Science [Undergraduate].pdf"
      },
      {
        title: "B.Eng. Petroleum and Energy Resources Engineering",
        duration: "5 years",
        schoolFees: "₦2,212,727 per session",
        image: petroleumEngineeringImg,
        description: "Explore oil and gas engineering principles and practices.",
        requirements: [
          "Five SSC credits including Physics, Chemistry, Mathematics, and English",
          "UTME Subjects: Chemistry, Mathematics, Physics",
          "JAMB score of 200+"
        ],
        pdf: "/pdfs/Departmental Handbook - Petroleum and Energy Resources Engineering [Undergraduate].pdf"
      },
      {
        title: "B.Sc. Accounting",
        duration: "4 years",
        schoolFees: "₦2,212,727 per session",
        image: accountingImg ,
        description: "Gain expertise in financial reporting, auditing, and corporate accounting principles.",
        requirements: [
          "Five SSC credits including Mathematics, English, Economics and two other relevant subjects",
          "UTME Subjects: Mathematics, Economics, and one other Social Science subject",
          "JAMB score of 200+"
        ],
        pdf: "/pdfs/Departmental Handbook - Accounting [Undergraduate].pdf"
      },
      {
        title: "B.Sc. Business Administration",
        duration: "4 years",
        schoolFees: "₦2,212,727 per session",
        image: businessAdminImg,
        description: "Understand organizational behavior, management, and entrepreneurship strategies.",
        requirements: [
          "Five SSC credits including Mathematics, English, Economics and two other relevant subjects",
          "UTME Subjects: Mathematics, Economics, and one other Social Science subject",
          "JAMB score of 200+"
        ],
        pdf: "/pdfs/Departmental Handbook - Accounting [Undergraduate].pdf"
      },
      {
        title: "B.Eng. Civil Engineering",
        duration: "5 years",
        schoolFees: "₦2,212,727 per session",
        image: civilEngineeringImg,
        description: "Design and construct infrastructure like roads, bridges, and water systems.",
        requirements: [
          "Five SSC credits including Mathematics, Physics, Chemistry, and English",
          "UTME Subjects: Mathematics, Physics, Chemistry",
          "JAMB score of 200+"
        ],
        pdf: "/pdfs/Departmental Handbook - Civil Engineering [Undergraduate].pdf"
      },
      {
        title: "B.Eng. Materials & Metallurgical Engineering",
        duration: "5 years",
        schoolFees: "₦2,212,727 per session",
        image: materialsEngineeringImg,
        description: "Learn the development and application of metallic and composite materials.",
        requirements: [
          "Five SSC credits including Mathematics, Physics, Chemistry, and English",
          "UTME Subjects: Mathematics, Physics, Chemistry",
          "JAMB score of 200+"
        ],
        pdf: "/pdfs/Departmental Handbook - Materials and Metallurgical Engineering [Undergraduate].pdf"
      },
      {
        title: "B.Eng. Mechanical Engineering",
        duration: "5 years",
        schoolFees: "₦2,212,727 per session",
        image: mechanicalEngineeringImg,
        description: "Apply physics and materials science for the design and analysis of mechanical systems.",
        requirements: [
          "Five SSC credits including Mathematics, Physics, Chemistry, and English",
          "UTME Subjects: Mathematics, Physics, Chemistry",
          "JAMB score of 200+"
        ],
        pdf: "/pdfs/Departmental Handbook - Mechanical Engineering [Undergraduate].pdf"
      }
    ],
    postgraduate: [
   
      {
        title: "M.Sc. Applied Statistics",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: appliedStatsImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "M.Sc. Aerospace Engineering",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: aerospaceImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "Ph.D. Aerospace Engineering",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image: aerospaceImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "M.Sc. Computer Science",
        duration: "2 years",
        schoolFees: "₦2,500,000",
        image: computerScienceImg,
        description: "Advanced study of computer science principles and research methodologies.",
        requirements: [
          "First Class or Second Class Upper",
          "Relevant Bachelor's Degree",
          "Research Proposal",
          "Academic Transcripts",
          "Reference Letters"
        ],
        pdf: "/pdfs/Curriculum Handbook - M.Sc. Computer Science [Class of 2025].pdf",
        type: "Masters"
      },
      {
        title: "Ph.D. Computer Science",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image: computerScienceImg,
        description: "Doctoral research in advanced computer science topics.",
        requirements: [
          "First Class or Second Class Upper",
          "Relevant Master's Degree",
          "Research Proposal",
          "Academic Transcripts",
          "Reference Letters"
        ],
        pdf: "/pdfs/2025 Postgraduate Fees.pdf",
        type: "Ph.D."
      },
      {
        title: "M.Sc. Geoinformatics & GIS",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: gisImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "Ph.D. Geoinformatics & GIS",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image: gisImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "Taught Masters in Management of Information Technology",
        duration: "1 year",
        schoolFees: "₦1,200,000 total",
        image: businessAdminImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "M.Sc. Management of Information Technology",
        duration: "2 years",
        schoolFees: "₦2,500,000",
        image: businessAdminImg,
        description: "Study the intersection of business and technology management.",
        requirements: [
          "First Class or Second Class Upper",
          "Relevant Bachelor's Degree",
          "Research Proposal",
          "Academic Transcripts",
          "Reference Letters"
        ],
        pdf: "/pdfs/Curriculum Handbook - M.Sc. Management of Information Technology [Class of 2025].pdf",
        type: "Masters"
      },
      {
        title: "M.Sc. Materials Science & Engineering",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image:materialsEngineeringImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "Ph.D. Materials Science & Engineering",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image:materialsEngineeringImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "Taught Masters in Mathematical Modeling",
        duration: "1 year",
        schoolFees: "₦1,200,000 total",
        image:modelingImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "M.Sc. Mathematical Modeling",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image:modelingImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "PGD Petroleum Engineering",
        duration: "1 year",
        schoolFees: "₦1,200,000 total",
        image: petroleumEngineeringImg,
        description: "Postgraduate diploma in petroleum engineering fundamentals.",
        requirements: [
          "Bachelor's Degree in relevant field",
          "Academic Transcripts",
          "Reference Letters"
        ],
        pdf: "/pdfs/2025 Postgraduate Fees.pdf",
        type: "PGD"
      },
      {
        title: "M.Sc. Petroleum Engineering",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: petroleumEngineeringImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "Ph.D. Petroleum Engineering",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image:petroleumEngineeringImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "Taught Masters in Public Administration",
        duration: "1 year",
        schoolFees: "₦1,200,000 total",
        image:publicAdminImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "M.Sc. Public Administration",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image:publicAdminImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "Taught Masters in Public Policy",
        duration: "1 year",
        schoolFees: "₦1,200,000 total",
        image: PolicyImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "M.Sc. Public Policy",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: PolicyImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "M.Sc. Pure & Applied Mathematics",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: mathImg,
        pdf: "/pdfs/Curriculum Handbook - M.Sc. Pure and Applied Mathematics [Class of 2025].pdf"
      },
      {
        title: "Ph.D. Pure & Applied Mathematics",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image: mathImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "M.Sc. Space Physics",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: spacePhysicsImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "Ph.D. Space Physics",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image:spacePhysicsImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "M.Sc. Systems Engineering",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: systemsImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "Ph.D. Systems Engineering",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image: systemsImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "M.Sc. Theoretical & Applied Physics",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: physicsImg,
        pdf: "/pdfs/Curriculum Handbook - M.Sc. Theoretical and Applied Physics [Class of 2025].pdf"
      },
      {
        title: "Ph.D. Theoretical & Applied Physics",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image: physicsImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      }
    ],
    jupeb: [
      {
        title: "JUPEB Science",
        duration: "1 year",
        schoolFees: "₦1,343,000 total",
        image: jupebScienceImg,
        description: "Pre-degree program to prepare students for direct entry into science programs.",
        requirements: [
          "SSCE credits in relevant science subjects",
          "Entrance exam",
          "Application form completion"
        ],
        pdf: "/pdfs/2024-2025 School of Foundation & Remedial Studies Fees.pdf"
      }
    ]
  };

  const getLabel = (title: string) => {
    if (title.toLowerCase().includes("ph.d.")) return "Ph.D.";
    if (title.toLowerCase().includes("m.sc") || title.toLowerCase().includes("taught")) return "Masters";
    if (title.toLowerCase().includes("pgd")) return "PGD";
    return null;
  };
  const categorizedPostgrad = {
    Masters: tabs.postgraduate.filter((p) => getLabel(p.title) === "Masters"),
    "Ph.D.": tabs.postgraduate.filter((p) => getLabel(p.title) === "Ph.D."),
    Others: tabs.postgraduate.filter((p) => getLabel(p.title) === "PGD" || getLabel(p.title) === null)
  };

  const getImage = (program: any) =>
    program.image ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80";

  const getDescription = (program: any) =>
    program.description ||
    "A comprehensive program designed to provide students with the knowledge and skills needed for success in their chosen field.";

  const getRequirements = (program: any) =>
    program.requirements || [
      "First Class or Second Class Upper",
      "Relevant Bachelor's Degree",
      "Research Proposal",
      "Academic Transcripts",
      "Reference Letters"
    ];

  const handleProgramClick = (title: string) => {
    setSelectedProgram(title);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-[#FF5500]/10 via-[#FF7A00]/10 to-[#FFA500]/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Explore Our <span className="text-[#FF5500]">Programs</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our wide range of undergraduate, postgraduate, and JUPEB programs designed to prepare you for success in your chosen field.
            </p>
          </div>
        </section>

        {/* Programs Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="undergraduate">Undergraduate</TabsTrigger>
                <TabsTrigger value="postgraduate">Postgraduate</TabsTrigger>
                <TabsTrigger value="jupeb">JUPEB</TabsTrigger>
              </TabsList>

              <TabsContent value="undergraduate">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tabs.undergraduate.map((program) => (
                    <div
                      key={program.title}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative h-48">
                        <img
                          src={getImage(program)}
                          alt={program.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                        <p className="text-gray-600 mb-4">{getDescription(program)}</p>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Duration:</span> {program.duration}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">School Fees:</span> {program.schoolFees}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <Button
                            variant="outline"
                            className="text-[#FF5500] border-[#FF5500] hover:bg-[#FF5500] hover:text-white"
                            onClick={() => handleProgramClick(program.title)}
                          >
                            View Details
                          </Button>
                          <a href={program.pdf} download className="text-[#FF5500] hover:text-[#FF5500]/80">
                            <Button variant="ghost" className="text-[#FF5500]">
                              <FileText className="w-4 h-4 mr-2" />
                              Download PDF
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="postgraduate">
                {Object.entries(categorizedPostgrad).map(([category, programs]) => (
                  <div key={category} className="mb-12">
                    <h2 className="text-2xl font-bold text-[#FF5500] mb-4">{category} Programs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {programs.map((program) => (
                        <div key={program.title} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative h-48">
                            <img src={getImage(program)} alt={program.title} className="w-full h-full object-cover" />
                            {/* {program.type && (
                              <div className="absolute top-2 right-2 bg-[#FF5500] text-white text-xs px-3 py-1 rounded-full">
                                {program.type}
                              </div>
                            )} */}
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                            <p className="text-gray-600 mb-4">{getDescription(program)}</p>
                            <div className="space-y-2 mb-4">
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">Duration:</span> {program.duration}
                              </p>
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">School Fees:</span> {program.schoolFees}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <Button
                                variant="outline"
                                className="text-[#FF5500] border-[#FF5500] hover:bg-[#FF5500] hover:text-white"
                                onClick={() => handleProgramClick(program.title)}
                              >
                                View Details
                              </Button>
                              <a href={program.pdf} download className="text-[#FF5500] hover:text-[#FF5500]/80">
                                <Button variant="ghost" className="text-[#FF5500]">
                                  <FileText className="w-4 h-4 mr-2" /> Download PDF
                                </Button>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="jupeb">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tabs.jupeb.map((program) => (
                    <div
                      key={program.title}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative h-48">
                        <img
                          src={getImage(program)}
                          alt={program.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                        <p className="text-gray-600 mb-4">{getDescription(program)}</p>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Duration:</span> {program.duration}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">School Fees:</span> {program.schoolFees}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Application Fee:</span> ₦20,000
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Acceptance Fee:</span> ₦50,000
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Total Fees:</span> ₦1,413,000
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <Button
                            variant="outline"
                            className="text-[#FF5500] border-[#FF5500] hover:bg-[#FF5500] hover:text-white"
                            onClick={() => handleProgramClick(program.title)}
                          >
                            View Details
                          </Button>
                          <a href={program.pdf} download className="text-[#FF5500] hover:text-[#FF5500]/80">
                            <Button variant="ghost" className="text-[#FF5500]">
                              <FileText className="w-4 h-4 mr-2" />
                              Download PDF
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Modal for Selected Program */}
        {selectedProgram && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-xl p-6 rounded-xl relative animate-fade-in shadow-xl max-h-screen overflow-y-auto">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedProgram(null)}
              >
                <X className="h-5 w-5" />
              </button>
              {(() => {
                const program = tabs[activeTab].find((p: any) => p.title === selectedProgram);
                if (!program) return null;

                return (
                  <>
                    <img
                      src={getImage(program)}
                      alt={program.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h2 className="text-2xl font-bold mb-2">{program.title}</h2>
                    <p className="text-gray-600 mb-2">
                      {getDescription(program)}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      Duration: {program.duration}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      School Fees: {program.schoolFees}
                    </p>
                    <h4 className="font-semibold text-[#FF5500] mb-2">Requirements:</h4>
                    <ul className="space-y-1 mb-6">
                      {getRequirements(program).map((req: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="grid gap-4">
                      <Button
                        asChild
                        className="bg-[#FF5500] hover:bg-[#e64d00] w-full"
                      >
                        <Link to="/signup" className="flex items-center justify-center">
                          Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>

                      {/* View PDF Button (if PDF exists) */}
                      {program.pdf && (
                        <Button
                          onClick={() => {
                            console.log("Navigating to PDF:", program.pdf);
                            navigate(
                              `/view-pdf?src=${encodeURIComponent(program.pdf)}&title=${encodeURIComponent(program.title)}`
                            );
                          }}
                          className="w-full bg-gray-100 border hover:bg-gray-200 text-sm text-gray-700 flex items-center justify-center"
                        >
                          <FileText className="w-4 h-4 mr-2" /> View Full Program Handbook
                        </Button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Programs;
