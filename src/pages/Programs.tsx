import React, { useState, useEffect, Suspense, useRef } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/SEO";

// Image URLs from ImageKit
const imageMap: Record<string, string> = {
  "software-engineering": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/software-engineering.jpg",
  "computer-science": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/programming-background-with-person-working-with-codes-computer.jpg",
  "petroleum-engineering": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/petroleum-engineering.jpg",
  "accounting": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/accounting.jpg",
  "business-admin": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/business-admin.jpg",
  "civil-engineering": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/civil-engineering.jpg",
  "aerospace": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/aerospace.jpg",
  "gis": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/gis.jpg",
  "math": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/math.jpg",
  "public-admin": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/public-admin.jpg",
  "space-physics": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/space-physics.jpg",
  "policy": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/policy.jpg",
  "applied-stats": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/applied-stats.jpg",
  "jupeb-science": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/jupeb-science.jpg",
  "foundation-science": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/jupeb-science.jpg",
  "default": "https://ik.imagekit.io/nsq6yvxg1/Upload/images/artturi-jalli-gYrYa37fAKI-unsplash.jpg"
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
    
    return imageMap["default"];
  };

  // Handle image load errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, program: any) => {
    const imgSrc = getImage(program);
    setImageLoadErrors(prev => ({...prev, [imgSrc]: true}));
    e.currentTarget.src = imageMap["default"];
  };

  // Updated program data with detailed requirements
  const tabs = {
    undergraduate: [
      {
        title: "B.Sc. Software Engineering",
        duration: "4 years",
        schoolFees: "₦2,212,727 per session",
        image: imageMap["software-engineering"] || imageMap["default"],
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
        pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Software%20Engineering%20_Undergraduate_.pdf"
      },
      {
        title: "B.Sc. Computer Science",
        duration: "4 years",
        schoolFees: "₦2,212,727 per session",
        image: imageMap["computer-science"] || imageMap["default"],
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
        pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Computer%20Science%20_Undergraduate_.pdf"
      },
      {
        title: "B.Eng. Petroleum and Energy Resources Engineering",
        duration: "5 years",
        schoolFees: "₦2,212,727 per session",
        image: imageMap["petroleum-engineering"] || imageMap["default"],
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
        pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Petroleum%20and%20Energy%20Resources%20Engineering%20_Undergraduate_.pdf"
      },
      {
        title: "B.Sc. Accounting",
        duration: "4 years",
        schoolFees: "₦2,212,727 per session",
        image: imageMap["accounting"] || imageMap["default"],
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
        pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Accounting%20_Undergraduate_.pdf"
      },
      {
        title: "B.Sc. Business Administration",
        duration: "4 years",
        schoolFees: "₦2,212,727 per session",
        image: imageMap["business-admin"] || imageMap["default"],
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
        pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Business%20Administration%20_Undergraduate_.pdf"
      },
      {
        title: "B.Eng. Civil Engineering",
        duration: "5 years",
        schoolFees: "₦2,212,727 per session",
        image: imageMap["civil-engineering"] || imageMap["default"],
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
        pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Civil%20Engineering%20_Undergraduate_.pdf"
      },
      {
        title: "B.Eng. Materials & Metallurgical Engineering",
        duration: "5 years",
        schoolFees: "₦2,212,727 per session",
        image: imageMap["default"],
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
        pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Materials%20and%20Metallurgical%20Engineering%20_Undergraduate_.pdf"
      },
      {
        title: "B.Eng. Mechanical Engineering",
        duration: "5 years",
        schoolFees: "₦2,212,727 per session",
        image: imageMap["default"],
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
        pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Mechanical%20Engineering%20_Undergraduate_.pdf"
      }
    ],
    postgraduate: [
      {
        title: "M.Sc. Computer Science",
        duration: "2 years",
        schoolFees: "₦2,500,000",
        image: imageMap["computer-science"] || imageMap["default"],
        description: "Advanced study of computer science principles and research methodologies.",
        requirements: {
          academic: [
            "• First Class, Second Class Upper, or Second Class Lower in Computer Science or related field",
            "• Minimum CGPA of 2.5/5.0"
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
        pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Curriculum%20Handbook%20-%20M.Sc.%20Computer%20Science%20_Class%20of%202025_.pdf",
        type: "Masters"
      },
      {
        title: "Ph.D. Computer Science",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image: imageMap["computer-science"] || imageMap["default"],
        description: "Advanced research program focusing on computer science innovations, artificial intelligence, data science, and software engineering methodologies.",
        requirements: {
          academic: [
            "• Masters degree in Computer Science or related field with minimum CGPA of 3.5/5.0",
            "• Strong research background in computer science",
            "• Proficiency in programming and analytical skills"
          ],
          documents: [
            "• Academic Transcripts (B.Sc. and M.Sc.)",
            "• Detailed Research Proposal",
            "• Three Academic Reference Letters",
            "• Statement of Purpose"
          ],
          additional: [
            "• Research publications (if any)",
            "• CV/Resume",
            "• IELTS/TOEFL (for international students)"
          ]
        },
        type: "Ph.D."
      },
      {
        title: "M.Sc. Geoinformatics & GIS",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: imageMap["gis"] || imageMap["default"],
        description: "Advanced study in geographical information systems, spatial analysis, remote sensing, and geospatial technologies.",
        requirements: {
          academic: [
            "• First Class or Second Class Upper in Geography, Environmental Science, Computer Science, or related field",
            "• Minimum CGPA of 3.5/5.0"
          ],
          documents: [
            "• Academic Transcripts",
            "• Two Academic Reference Letters",
            "• Statement of Purpose"
          ],
          additional: [
            "• Basic knowledge of GIS software",
            "• Computer literacy",
            "• Evidence of English Proficiency"
          ]
        },
        type: "Masters"
      },
      {
        title: "Ph.D. Geoinformatics & GIS",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image: imageMap["gis"] || imageMap["default"],
        description: "Doctoral research in advanced geospatial technologies, spatial data science, and environmental modeling.",
        requirements: {
          academic: [
            "• Masters degree in GIS, Geography, or related field with minimum CGPA of 3.5/5.0",
            "• Strong research background in geospatial sciences"
          ],
          documents: [
            "• Academic Transcripts",
            "• Detailed Research Proposal",
            "• Three Academic Reference Letters"
          ],
          additional: [
            "• Advanced GIS software proficiency",
            "• Research publications (if any)",
            "• Programming skills"
          ]
        },
        type: "Ph.D."
      },
      {
        title: "M.Sc. Management of Information Technology",
        duration: "2 years",
        schoolFees: "₦2,500,000",
        image: imageMap["business-admin"] || imageMap["default"],
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
        pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Curriculum%20Handbook%20-%20M.Sc.%20Management%20of%20Information%20Technology%20_Class%20of%202025_.pdf",
        type: "Masters"
      },
      {
        title: "M.Sc. Materials Science & Engineering",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: imageMap["default"],
        description: "Study of advanced materials, their properties, processing techniques, and applications in modern engineering.",
        requirements: {
          academic: [
            "• First Class or Second Class Upper in Engineering, Physics, Chemistry, or related field",
            "• Minimum CGPA of 3.5/5.0"
          ],
          documents: [
            "• Academic Transcripts",
            "• Two Academic Reference Letters",
            "• Research Proposal"
          ],
          additional: [
            "• Laboratory experience",
            "• Basic knowledge of materials characterization",
            "• Mathematical and analytical skills"
          ]
        },
        type: "Masters"
      },
      {
        title: "Ph.D. Materials Science & Engineering",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image: imageMap["default"]
      },
      {
        title: "M.Sc. Mathematical Modeling",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: imageMap["math"] || imageMap["default"],
        description: "Advanced study in mathematical modeling, numerical analysis, and computational mathematics for solving real-world problems.",
        requirements: {
          academic: [
            "• First Class or Second Class Upper in Mathematics, Physics, Engineering, or related field",
            "• Strong background in advanced mathematics"
          ],
          documents: [
            "• Academic Transcripts",
            "• Two Academic Reference Letters",
            "• Statement of Purpose"
          ],
          additional: [
            "• Programming skills",
            "• Knowledge of mathematical software",
            "• Analytical problem-solving ability"
          ]
        },
        type: "Masters"
      },
      {
        title: "Taught Masters in Mathematical Modeling",
        duration: "1 year",
        schoolFees: "₦1,200,000 total",
        image: imageMap["default"]
      },
      {
        title: "PGD Petroleum Engineering",
        duration: "1 year",
        schoolFees: "₦1,200,000 total",
        image: imageMap["petroleum-engineering"] || imageMap["default"],
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
        type: "PGD"
      },
      {
        title: "M.Sc. Petroleum Engineering",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: imageMap["petroleum-engineering"] || imageMap["default"],
        description: "Advanced study in petroleum engineering principles, reservoir management, and energy resources optimization.",
        requirements: {
          academic: [
            "• First Class, Second Class Upper, or Second Class Lower in Petroleum Engineering or related field",
            "• Minimum CGPA of 2.5/5.0"
          ],
          documents: [
            "• Academic Transcripts",
            "• Research Proposal",
            "• Two Academic Reference Letters"
          ],
          additional: [
            "• Statement of Purpose",
            "• CV/Resume",
            "• Industry experience (if any)"
          ]
        },
        type: "Masters"
      },
      {
        title: "Ph.D. Petroleum Engineering",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image: imageMap["petroleum-engineering"] || imageMap["default"],
        description: "Advanced research in petroleum engineering, focusing on innovative extraction methods and sustainable energy solutions.",
        requirements: {
          academic: [
            "• Masters degree in Petroleum Engineering or related field",
            "• Minimum CGPA of 3.0/5.0 at Masters level"
          ],
          documents: [
            "• Academic Transcripts (B.Eng/B.Sc. and M.Sc.)",
            "• Detailed Research Proposal",
            "• Three Academic Reference Letters"
          ],
          additional: [
            "• Research publications (if any)",
            "• Industry experience",
            "• IELTS/TOEFL (for international students)"
          ]
        },
        type: "Ph.D."
      },
      {
        title: "Taught Masters in Public Administration",
        duration: "1 year",
        schoolFees: "₦1,200,000 total",
        image: imageMap["public-admin"] || imageMap["default"]
      },
      {
        title: "M.Sc. Public Administration",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: imageMap["public-admin"] || imageMap["default"],
        description: "Advanced study in public sector management, policy implementation, and administrative theory.",
        requirements: {
          academic: [
            "• First Class, Second Class Upper, or Second Class Lower in Public Administration or related field",
            "• Minimum CGPA of 2.5/5.0"
          ],
          documents: [
            "• Academic Transcripts",
            "• Research Proposal",
            "• Two Academic Reference Letters"
          ],
          additional: [
            "• Statement of Purpose",
            "• CV/Resume",
            "• Public sector experience (if any)"
          ]
        },
        type: "Masters"
      },
      {
        title: "Taught Masters in Public Policy",
        duration: "1 year",
        schoolFees: "₦1,200,000 total",
        image: imageMap["policy"] || imageMap["default"]
      },
      {
        title: "M.Sc. Public Policy",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: imageMap["policy"] || imageMap["default"]
      },
      {
        title: "M.Sc. Pure & Applied Mathematics",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: imageMap["math"] || imageMap["default"],
        description: "Advanced study in pure and applied mathematics, focusing on mathematical analysis, algebra, and applications.",
        requirements: {
          academic: [
            "• First Class, Second Class Upper, or Second Class Lower in Mathematics or related field",
            "• Minimum CGPA of 2.5/5.0"
          ],
          documents: [
            "• Academic Transcripts",
            "• Research Proposal",
            "• Two Academic Reference Letters"
          ],
          additional: [
            "• Strong background in advanced mathematics",
            "• Statement of Purpose",
            "• CV/Resume"
          ]
        },
        pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Curriculum%20Handbook%20-%20M.Sc.%20Pure%20and%20Applied%20Mathematics%20_Class%20of%202025_.pdf",
        type: "Masters"
      },
      {
        title: "Ph.D. Pure & Applied Mathematics",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image: imageMap["math"] || imageMap["default"],
        description: "Doctoral research in mathematical theory and applications, including analysis, algebra, and mathematical modeling.",
        requirements: {
          academic: [
            "• Masters degree in Mathematics or related field",
            "• Minimum CGPA of 3.0/5.0 at Masters level"
          ],
          documents: [
            "• Academic Transcripts",
            "• Detailed Research Proposal",
            "• Three Academic Reference Letters"
          ],
          additional: [
            "• Research publications (if any)",
            "• Advanced mathematical knowledge",
            "• Teaching/Research experience preferred"
          ]
        },
        type: "Ph.D."
      },
      {
        title: "M.Sc. Space Physics",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: imageMap["space-physics"] || imageMap["default"],
        description: "Advanced study in space physics, astrophysics, and cosmic radiation.",
        requirements: {
          academic: [
            "• First Class, Second Class Upper, or Second Class Lower in Physics or related field",
            "• Minimum CGPA of 2.5/5.0"
          ],
          documents: [
            "• Academic Transcripts",
            "• Research Proposal",
            "• Two Academic Reference Letters"
          ],
          additional: [
            "• Strong background in physics and mathematics",
            "• Programming skills",
            "• Laboratory experience"
          ]
        },
        type: "Masters"
      },
      {
        title: "Ph.D. Space Physics",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image: imageMap["space-physics"] || imageMap["default"],
        description: "Doctoral research in space physics, focusing on solar-terrestrial relationships and space weather.",
        requirements: {
          academic: [
            "• Masters degree in Space Physics, Physics or related field",
            "• Minimum CGPA of 3.0/5.0 at Masters level"
          ],
          documents: [
            "• Academic Transcripts",
            "• Detailed Research Proposal",
            "• Three Academic Reference Letters"
          ],
          additional: [
            "• Research publications (if any)",
            "• Advanced programming skills",
            "• Research experience in physics"
          ]
        },
        type: "Ph.D."
      },
      {
        title: "M.Sc. Systems Engineering",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: imageMap["default"],
        description: "Advanced study in systems engineering principles, system design, and integration methodologies.",
        requirements: {
          academic: [
            "• First Class, Second Class Upper, or Second Class Lower in Engineering or related field",
            "• Minimum CGPA of 2.5/5.0"
          ],
          documents: [
            "• Academic Transcripts",
            "• Research Proposal",
            "• Two Academic Reference Letters"
          ],
          additional: [
            "• Knowledge of systems modeling",
            "• Programming/Technical skills",
            "• Industry experience (preferred)"
          ]
        },
        type: "Masters"
      },
      {
        title: "Ph.D. Systems Engineering",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image: imageMap["default"]
      },
      {
        title: "M.Sc. Theoretical & Applied Physics",
        duration: "1.5 years",
        schoolFees: "₦1,800,000 total",
        image: imageMap["default"],
        description: "Advanced study in theoretical physics principles and their practical applications in modern technology.",
        requirements: {
          academic: [
            "• First Class, Second Class Upper, or Second Class Lower in Physics or related field",
            "• Minimum CGPA of 2.5/5.0"
          ],
          documents: [
            "• Academic Transcripts",
            "• Research Proposal",
            "• Two Academic Reference Letters"
          ],
          additional: [
            "• Strong mathematical background",
            "• Laboratory experience",
            "• Programming skills"
          ]
        },
        pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Curriculum%20Handbook%20-%20M.Sc.%20Theoretical%20and%20Applied%20Physics%20_Class%20of%202025_.pdf",
        type: "Masters"
      },
      {
        title: "Ph.D. Theoretical & Applied Physics",
        duration: "3 years",
        schoolFees: "₦4,200,000 total",
        image: imageMap["default"],
        description: "Doctoral research in theoretical and applied physics, focusing on quantum mechanics, particle physics, and modern physics applications.",
        requirements: {
          academic: [
            "• Masters degree in Physics or related field",
            "• Minimum CGPA of 3.0/5.0 at Masters level"
          ],
          documents: [
            "• Academic Transcripts",
            "• Detailed Research Proposal",
            "• Three Academic Reference Letters"
          ],
          additional: [
            "• Research publications (if any)",
            "• Advanced mathematical skills",
            "• Research experience in physics"
          ]
        },
        type: "Ph.D."
      }
    ],
    foundation: [
      {
        id: "foundation-science",
        title: "Foundation Science",
        description: "A comprehensive foundation program in science subjects",
        image: imageMap["foundation-science"] || imageMap["default"],
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
        pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/2024-2025%20School%20of%20Foundation%20&%20Remedial%20Studies%20Fees.pdf"
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

  // Update the ProgramCard component
  const ProgramCard = ({ program, index }) => {
    return (
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg"
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
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
          <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
            {program.description}
          </p>
          
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
              <Button 
                variant="outline" 
                className="text-[#FF5500] border-[#FF5500] hover:bg-[#FF5500] hover:text-white"
              >
                View More <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              {/* ... existing dialog content ... */}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
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
                <span className="hidden sm:inline">Foundation and Remedial Studies</span>
                <span className="sm:hidden">Foundation</span>
              </button>
            </div>

            {/* Program Cards */}
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
            >
              {getCurrentPrograms().map((program, index) => (
                <ProgramCard 
                  key={program.title + index}
                  program={program} 
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Programs;