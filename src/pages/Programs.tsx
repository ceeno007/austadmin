import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Image as ImageIcon, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SEO from "@/components/SEO";

// Import all program images
import softwareEngineeringImg from "@/assets/images/software-engineering.jpg";
import computerScienceImg from "@/assets/images/computer-science.jpg";
import petroleumEngineeringImg from "@/assets/images/petroleum-engineering.jpg";
import accountingImg from "@/assets/images/accounting.jpg";
import businessAdminImg from "@/assets/images/business-admin.jpg";
import civilEngineeringImg from "@/assets/images/civil-engineering.jpg";
import materialsEngineeringImg from "@/assets/images/materials-metallurgical.jpg";
import mechanicalEngineeringImg from "@/assets/images/mechanical.jpg";
import academicImg from "@/assets/images/academic.jpg";
import aerospaceImg from "@/assets/images/aerospace.jpg";
import gisImg from "@/assets/images/gis.jpg";
import systemsImg from "@/assets/images/systems.jpg";
import modelingImg from "@/assets/images/modeling.jpg";
import mathImg from "@/assets/images/math.jpg";
import petroleumImg from "@/assets/images/petroleum-engineering.jpg";
import publicAdminImg from "@/assets/images/public-admin.jpg";
import spacePhysicsImg from "@/assets/images/space-physics.jpg";
import policyImg from "@/assets/images/policy.jpg";
import physicsImg from "@/assets/images/physics.jpg";
import appliedStatsImg from "@/assets/images/applied-stats.jpg";
import jupebScienceImg from "@/assets/images/jupeb-science.jpg";
import foundationScienceImg from "@/assets/images/jupeb-science.jpg";

// Create an image map for reliable fallbacks
const imageMap: Record<string, string> = {
  "software-engineering": softwareEngineeringImg,
  "computer-science": computerScienceImg,
  "petroleum-engineering": petroleumEngineeringImg,
  "accounting": accountingImg,
  "business-admin": businessAdminImg,
  "civil-engineering": civilEngineeringImg,
  "materials-metallurgical": materialsEngineeringImg,
  "mechanical": mechanicalEngineeringImg,
  "aerospace": aerospaceImg,
  "gis": gisImg,
  "systems": systemsImg,
  "modeling": modelingImg,
  "math": mathImg,
  "petroleum": petroleumImg,
  "public-admin": publicAdminImg,
  "space-physics": spacePhysicsImg,
  "policy": policyImg,
  "physics": physicsImg,
  "applied-stats": appliedStatsImg,
  "jupeb-science": jupebScienceImg,
  "foundation-science": foundationScienceImg,
  "default": academicImg
};

const Programs = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("undergraduate");
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});

  // Get current and next year for academic session
  const currentYear = new Date().getFullYear();
  const academicSession = `${currentYear}/${currentYear + 1}`;

  // Check for tab parameter in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get("tab");
    if (tabParam && ["undergraduate", "postgraduate", "foundation"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Get current programs based on active tab
  const getCurrentPrograms = () => {
    if (activeTab === "postgraduate") {
      return Object.values(categorizedPostgrad).flat();
    }
    return tabs[activeTab] || [];
  };

  // Improved image handling function
  const getImage = (program: any) => {
    if (program.image) {
      return program.image;
    }
    
    const titleKey = program.title?.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    for (const [key, img] of Object.entries(imageMap)) {
      if (titleKey?.includes(key)) {
        return img;
      }
    }
    
    return academicImg;
  };

  // Handle image load errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, program: any) => {
    const imgSrc = getImage(program);
    setImageLoadErrors(prev => ({...prev, [imgSrc]: true}));
    e.currentTarget.src = academicImg;
  };

  // Updated program data with detailed requirements
  const tabs = {
    undergraduate: [
      {
        title: "B.Sc. Software Engineering",
        duration: "4 years",
        schoolFees: "₦2,212,727 per session",
        image: softwareEngineeringImg,
        description: "Focus on software development methodologies, tools, and systems design.",
        requirements: {
          ssc: [
            "Five SSCE/WAEC/NECO credits including:",
            "• English Language",
            "• Mathematics",
            "• Physics",
            "• Any two other Science subjects"
          ],
          jamb: [
            "• Mathematics",
            "• Physics",
            "• One other Science subject",
            `• Minimum JAMB score: 200 for ${academicSession} session`
          ],
          directEntry: [
            "• A Level passes in Mathematics and Physics",
            "• ND/HND in Computer Science or related field",
            "• Minimum of 10 points in IJMB"
          ]
        },
        pdf: "/pdfs/Departmental Handbook - Software Engineering [Undergraduate].pdf"
      },
      {
        title: "B.Sc. Computer Science",
        duration: "4 years",
        schoolFees: "₦2,212,727 per session",
        image: computerScienceImg,
        description: "Develop skills in algorithms, software engineering, and computer systems.",
        requirements: {
          ssc: [
            "Five SSCE/WAEC/NECO credits including:",
            "• English Language",
            "• Mathematics",
            "• Physics",
            "• Any two other Science subjects"
          ],
          jamb: [
            "• Mathematics",
            "• Physics",
            "• One other Science subject",
            `• Minimum JAMB score: 200 for ${academicSession} session`
          ],
          directEntry: [
            "• A Level passes in Mathematics and Physics",
            "• ND/HND in Computer Science or related field",
            "• Minimum of 10 points in IJMB"
          ]
        },
        pdf: "/pdfs/Departmental Handbook - Computer Science [Undergraduate].pdf"
      },
      {
        title: "B.Eng. Petroleum and Energy Resources Engineering",
        duration: "5 years",
        schoolFees: "₦2,212,727 per session",
        image: petroleumEngineeringImg,
        description: "Explore oil and gas engineering principles and practices.",
        requirements: {
          ssc: [
            "Five SSCE/WAEC/NECO credits including:",
            "• English Language",
            "• Mathematics",
            "• Physics",
            "• Chemistry",
            "• One other Science subject"
          ],
          jamb: [
            "• Mathematics",
            "• Physics",
            "• Chemistry",
            `• Minimum JAMB score: 200 for ${academicSession} session`
          ],
          directEntry: [
            "• A Level passes in Mathematics, Physics, and Chemistry",
            "• ND/HND in Petroleum Engineering or related field",
            "• Minimum of 10 points in IJMB"
          ]
        },
        pdf: "/pdfs/Departmental Handbook - Petroleum and Energy Resources Engineering [Undergraduate].pdf"
      },
      {
        title: "B.Sc. Accounting",
        duration: "4 years",
        schoolFees: "₦2,212,727 per session",
        image: accountingImg ,
        description: "Gain expertise in financial reporting, auditing, and corporate accounting principles.",
        requirements: {
          ssc: [
            "Five SSCE/WAEC/NECO credits including:",
            "• English Language",
            "• Mathematics",
            "• Economics",
            "• Two other relevant subjects"
          ],
          jamb: [
            "• Economics",
            "• One other Social Science subject",
            `• Minimum JAMB score: 200 for ${academicSession} session`
          ],
          directEntry: [
            "• A Level passes in Mathematics and Economics",
            "• ND/HND in Accounting or related field",
            "• Minimum of 10 points in IJMB"
          ]
        },
        pdf: "/pdfs/Departmental Handbook - Accounting [Undergraduate].pdf"
      },
      {
        title: "B.Sc. Business Administration",
        duration: "4 years",
        schoolFees: "₦2,212,727 per session",
        image: businessAdminImg,
        description: "Understand organizational behavior, management, and entrepreneurship strategies.",
        requirements: {
          ssc: [
            "Five SSCE/WAEC/NECO credits including:",
            "• English Language",
            "• Mathematics",
            "• Economics",
            "• Two other relevant subjects"
          ],
          jamb: [
            "• Economics",
            "• One other Social Science subject",
            `• Minimum JAMB score: 200 for ${academicSession} session`
          ],
          directEntry: [
            "• A Level passes in Mathematics and Economics",
            "• ND/HND in Business Administration or related field",
            "• Minimum of 10 points in IJMB"
          ]
        },
        pdf: "/pdfs/Departmental Handbook - Accounting [Undergraduate].pdf"
      },
      {
        title: "B.Eng. Civil Engineering",
        duration: "5 years",
        schoolFees: "₦2,212,727 per session",
        image: civilEngineeringImg,
        description: "Design and construct infrastructure like roads, bridges, and water systems.",
        requirements: {
          ssc: [
            "Five SSCE/WAEC/NECO credits including:",
            "• English Language",
            "• Mathematics",
            "• Physics",
            "• Chemistry"
          ],
          jamb: [
            "• Mathematics",
            "• Physics",
            "• Chemistry",
            `• Minimum JAMB score: 200 for ${academicSession} session`
          ],
          directEntry: [
            "• A Level passes in Mathematics, Physics, and Chemistry",
            "• ND/HND in Civil Engineering or related field",
            "• Minimum of 10 points in IJMB"
          ]
        },
        pdf: "/pdfs/Departmental Handbook - Civil Engineering [Undergraduate].pdf"
      },
      {
        title: "B.Eng. Materials & Metallurgical Engineering",
        duration: "5 years",
        schoolFees: "₦2,212,727 per session",
        image: materialsEngineeringImg,
        description: "Learn the development and application of metallic and composite materials.",
        requirements: {
          ssc: [
            "Five SSCE/WAEC/NECO credits including:",
            "• English Language",
            "• Mathematics",
            "• Physics",
            "• Chemistry"
          ],
          jamb: [
            "• Mathematics",
            "• Physics",
            "• Chemistry",
            `• Minimum JAMB score: 200 for ${academicSession} session`
          ],
          directEntry: [
            "• A Level passes in Mathematics, Physics, and Chemistry",
            "• ND/HND in Materials Engineering or related field",
            "• Minimum of 10 points in IJMB"
          ]
        },
        pdf: "/pdfs/Departmental Handbook - Materials and Metallurgical Engineering [Undergraduate].pdf"
      },
      {
        title: "B.Eng. Mechanical Engineering",
        duration: "5 years",
        schoolFees: "₦2,212,727 per session",
        image: mechanicalEngineeringImg,
        description: "Apply physics and materials science for the design and analysis of mechanical systems.",
        requirements: {
          ssc: [
            "Five SSCE/WAEC/NECO credits including:",
            "• English Language",
            "• Mathematics",
            "• Physics",
            "• Chemistry"
          ],
          jamb: [
            "• Mathematics",
            "• Physics",
            "• Chemistry",
            `• Minimum JAMB score: 200 for ${academicSession} session`
          ],
          directEntry: [
            "• A Level passes in Mathematics, Physics, and Chemistry",
            "• ND/HND in Mechanical Engineering or related field",
            "• Minimum of 10 points in IJMB"
          ]
        },
        pdf: "/pdfs/Departmental Handbook - Mechanical Engineering [Undergraduate].pdf"
      }
    ],
    postgraduate: [
      {
        title: "M.Sc. Computer Science",
        duration: "2 years",
        schoolFees: "₦2,500,000",
        image: computerScienceImg,
        description: "Advanced study of computer science principles and research methodologies.",
        requirements: {
          academic: [
            "• First Class or Second Class Upper in Computer Science or related field",
            "• Minimum CGPA of 3.5/5.0 or 4.0/5.0"
          ],
          documents: [
            "• Academic Transcripts",
            "• Research Proposal",
            "• Two Academic Reference Letters"
          ],
          additional: [
            "• Statement of Purpose",
            "• CV/Resume",
            "• Evidence of English Proficiency (if applicable)"
          ]
        },
        pdf: "/pdfs/Curriculum Handbook - M.Sc. Computer Science [Class of 2025].pdf",
        type: "Masters"
      },
      {
        title: "Ph.D. Computer Science",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image: computerScienceImg,
        description: "Doctoral research in advanced computer science topics.",
        requirements: {
          academic: [
            "• First Class or Second Class Upper in Computer Science or related field",
            "• Minimum CGPA of 3.5/5.0 or 4.0/5.0"
          ],
          documents: [
            "• Academic Transcripts",
            "• Research Proposal",
            "• Two Academic Reference Letters"
          ],
          additional: [
            "• Statement of Purpose",
            "• CV/Resume",
            "• Evidence of English Proficiency (if applicable)"
          ]
        },
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
        requirements: {
          academic: [
            "• First Class or Second Class Upper in Computer Science or related field",
            "• Minimum CGPA of 3.5/5.0 or 4.0/5.0"
          ],
          documents: [
            "• Academic Transcripts",
            "• Research Proposal",
            "• Two Academic Reference Letters"
          ],
          additional: [
            "• Statement of Purpose",
            "• CV/Resume",
            "• Evidence of English Proficiency (if applicable)"
          ]
        },
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
        requirements: {
          ssc: [
            "Five SSCE/WAEC/NECO credits including:",
            "• English Language",
            "• Mathematics",
            "• Physics",
            "• Chemistry"
          ],
          jamb: [
            "• Mathematics",
            "• Physics",
            "• Chemistry",
            `• Minimum JAMB score: 200 for ${academicSession} session`
          ],
          directEntry: [
            "• A Level passes in Mathematics, Physics, and Chemistry",
            "• ND/HND in Petroleum Engineering or related field",
            "• Minimum of 10 points in IJMB"
          ]
        },
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
        image: policyImg,
        pdf: "/pdfs/2025 Postgraduate Fees.pdf"
      },
      {
        title: "M.Sc. Public Policy",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: policyImg,
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
    foundation: [
      {
        id: "foundation-science",
        title: "Foundation Science",
        description: "A comprehensive foundation program in science subjects",
        image: foundationScienceImg,
        duration: "1 Year",
        schoolFees: "₦1,343,000 total",
        requirements: {
          ssc: [
            "Five SSCE/WAEC/NECO credits including:",
            "• English Language",
            "• Mathematics",
            "• Physics",
            "• Chemistry",
            "• Biology"
          ],
          additional: [
            "• Minimum age: 16 years",
            "• Pass in Basic Science subjects",
            "• Good conduct certificate"
          ]
        },
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

  // Generate structured data for programs
  const generateStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": getCurrentPrograms().map((program, index) => ({
        "@type": "EducationalProgram",
        "name": program.title,
        "description": program.description,
        "provider": {
          "@type": "CollegeOrUniversity",
          "name": "African University of Science and Technology"
        },
        "timeToComplete": program.duration,
        "educationalProgramMode": "full-time",
        "position": index + 1
      }))
    };
  };

  return (
    <>
      <SEO 
        title="Academic Programs | AUST"
        description="Explore AUST's comprehensive range of undergraduate, postgraduate, and foundation programs in science, technology, and business. Find your path to success with our world-class education."
        keywords="AUST programs, undergraduate degrees, postgraduate programs, foundation courses, science and technology education, African university"
        url={`${window.location.origin}/programs`}
        type="website"
        structuredData={generateStructuredData()}
      />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="py-8 sm:py-16 bg-gradient-to-r from-[#FF5500]/10 via-[#FF7A00]/10 to-[#FFA500]/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Explore Our <span className="text-[#FF5500]">Programs</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our wide range of undergraduate, postgraduate, and JUPEB programs designed to prepare you for success in your chosen field.
            </p>
          </div>
        </section>

        {/* Programs Section */}
        <section className="py-8 sm:py-16" aria-label="Academic Programs">
          <div className="container mx-auto px-4">
            {/* Simple Tab Navigation */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
              <button
                onClick={() => setActiveTab("undergraduate")}
                className={`px-4 py-2 rounded text-sm sm:text-base ${
                  activeTab === "undergraduate"
                    ? "bg-[#FF5500] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Undergraduate
              </button>
              <button
                onClick={() => setActiveTab("postgraduate")}
                className={`px-4 py-2 rounded text-sm sm:text-base ${
                  activeTab === "postgraduate"
                    ? "bg-[#FF5500] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Postgraduate
              </button>
              <button
                onClick={() => setActiveTab("foundation")}
                className={`px-4 py-2 rounded text-sm sm:text-base ${
                  activeTab === "foundation"
                    ? "bg-[#FF5500] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <span className="hidden sm:inline">FOUNDATION AND REMEDIAL STUDIES</span>
                <span className="sm:hidden">Foundation</span>
              </button>
            </div>

            {/* Program Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {getCurrentPrograms().map((program) => (
                <div
                  key={program.title}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow mb-4 sm:mb-0"
                >
                  <div className="relative h-48">
                    <img
                      src={getImage(program)}
                      alt={`${program.title} program`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => handleImageError(e, program)}
                    />
                    {imageLoadErrors[getImage(program)] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-2">{program.title}</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">{program.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-xs sm:text-sm text-gray-500">
                        <span className="font-medium">Duration:</span> {program.duration}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        <span className="font-medium">School Fees:</span> {program.schoolFees}
                      </p>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="text-[#FF5500] border-[#FF5500] hover:bg-[#FF5500] hover:text-white">
                          View More <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-[#FF5500]">{program.title}</DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Program Description</h3>
                            <p className="text-gray-600">{program.description}</p>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                            {program.requirements && (
                              <div className="space-y-4">
                                {program.requirements.ssc && (
                                  <div>
                                    <h4 className="font-medium text-gray-700">SSCE/WAEC/NECO:</h4>
                                    <ul className="list-disc list-inside text-gray-600">
                                      {program.requirements.ssc.map((req, index) => (
                                        <li key={index}>{req}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {program.requirements.jamb && (
                                  <div>
                                    <h4 className="font-medium text-gray-700">JAMB:</h4>
                                    <ul className="list-disc list-inside text-gray-600">
                                      {program.requirements.jamb.map((req, index) => (
                                        <li key={index}>{req}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {program.requirements.directEntry && (
                                  <div>
                                    <h4 className="font-medium text-gray-700">Direct Entry:</h4>
                                    <ul className="list-disc list-inside text-gray-600">
                                      {program.requirements.directEntry.map((req, index) => (
                                        <li key={index}>{req}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {program.requirements.academic && (
                                  <div>
                                    <h4 className="font-medium text-gray-700">Academic Requirements:</h4>
                                    <ul className="list-disc list-inside text-gray-600">
                                      {program.requirements.academic.map((req, index) => (
                                        <li key={index}>{req}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {program.requirements.documents && (
                                  <div>
                                    <h4 className="font-medium text-gray-700">Required Documents:</h4>
                                    <ul className="list-disc list-inside text-gray-600">
                                      {program.requirements.documents.map((req, index) => (
                                        <li key={index}>{req}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {program.requirements.additional && (
                                  <div>
                                    <h4 className="font-medium text-gray-700">Additional Requirements:</h4>
                                    <ul className="list-disc list-inside text-gray-600">
                                      {program.requirements.additional.map((req, index) => (
                                        <li key={index}>{req}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">Duration:</span> {program.duration}
                              </p>
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">School Fees:</span> {program.schoolFees}
                              </p>
                            </div>
                            <a
                              href={program.pdf}
                              download
                              className="text-[#FF5500] hover:text-[#FF5500]/80"
                            >
                              <Button variant="ghost" className="text-[#FF5500]">
                                <FileText className="w-4 h-4 mr-2" />
                                Download Brochure
                              </Button>
                            </a>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Programs; 