// Image URLs for programs
const imageMap = {
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

export interface Program {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  category: 'foundation' | 'jupeb' | 'direct-entry' | 'undergraduate' | 'postgraduate';
  requirements: string[];
  pdf?: string;
  schoolFees?: string;
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export const programs: Program[] = [
  {
    id: 'bsc-software-engineering',
    title: "B.Sc. Software Engineering",
    duration: "4 years",
    level: "Undergraduate",
    category: 'undergraduate',
    schoolFees: "₦2,338,182 (Returning Students) / ₦2,553,182 (New Students) per session",
    image: imageMap["software-engineering"],
    description: "Focus on software development methodologies, tools, and systems design. Learn programming languages, software architecture, and project management.",
    requirements: [
      "Five O Level credits including English, Mathematics, Physics/Data Processing",
      "UTME Subjects: Mathematics, Physics, and one other Science subject",
      "JAMB score of 150+",
      "Direct Entry: A Level passes in Mathematics and Physics",
      "Direct Entry: ND/HND in Computer Science or related field",
      "Direct Entry: Minimum of 10 points in IJMB"
    ],
    pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Software%20Engineering%20_Undergraduate_.pdf?updatedAt=1747320137632",
    faqs: [
      {
        question: "What career opportunities are available after graduation?",
        answer: "Graduates can work as Software Engineers, Web Developers, Mobile App Developers, Systems Analysts, Project Managers, or pursue further studies in Computer Science or related fields."
      },
      {
        question: "What programming languages will I learn?",
        answer: "You'll learn multiple programming languages including Python, Java, JavaScript, C++, and more, along with modern frameworks and tools used in industry."
      },
      {
        question: "Are there internship opportunities?",
        answer: "Yes, the program includes mandatory industrial training and internship opportunities with our partner companies in the tech industry."
      }
    ]
  },
  {
    id: 'bsc-computer-science',
    title: "B.Sc. Computer Science",
    duration: "4 years",
    level: "Undergraduate",
    category: 'undergraduate',
    schoolFees: "₦2,338,182 (Returning Students) / ₦2,553,182 (New Students) per session",
    image: imageMap["computer-science"],
    description: "Develop skills in algorithms, software engineering, and computer systems. Study artificial intelligence, data structures, and computer networks.",
    requirements: [
      "Five O Level credits including English, Mathematics, Physics/Data Processing",
      "UTME Subjects: Mathematics, Physics, and one other Science subject",
      "JAMB score of 150+",
      "Direct Entry: A Level passes in Mathematics and Physics",
      "Direct Entry: ND/HND in Computer Science or related field",
      "Direct Entry: Minimum of 10 points in IJMB"
    ],
    pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Computer%20Science%20_Undergraduate_.pdf?updatedAt=1747320137510",
    faqs: [
      {
        question: "What's the difference between Computer Science and Software Engineering?",
        answer: "Computer Science focuses more on theoretical foundations and algorithms, while Software Engineering emphasizes practical software development and project management."
      },
      {
        question: "Can I specialize in a particular area?",
        answer: "Yes, you can specialize in areas like Artificial Intelligence, Cybersecurity, Data Science, or Software Development through elective courses and final year projects."
      },
      {
        question: "What facilities are available for students?",
        answer: "Students have access to modern computer labs, high-speed internet, specialized software, and research facilities for practical work and projects."
      }
    ]
  },
  {
    id: 'beng-petroleum-engineering',
    title: "B.Eng. Petroleum Engineering",
    duration: "5 years",
    level: "Undergraduate",
    category: 'undergraduate',
    schoolFees: "₦2,338,182 (Returning Students) / ₦2,553,182 (New Students) per session",
    image: imageMap["petroleum-engineering"],
    description: "Study oil and gas exploration, production, and processing. Learn about reservoir engineering, drilling operations, and petroleum economics.",
    requirements: [
      "Five O Level credits including English, Mathematics, Physics, Chemistry",
      "UTME Subjects: Mathematics, Physics, Chemistry",
      "JAMB score of 150+",
      "Direct Entry: A Level passes in Mathematics, Physics, and Chemistry",
      "Direct Entry: ND/HND in Petroleum Engineering or related field",
      "Direct Entry: Minimum of 10 points in IJMB"
    ],
    pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Petroleum%20and%20Energy%20Resources%20Engineering%20_Undergraduate_.pdf?updatedAt=1747320137636",
    faqs: [
      {
        question: "What career paths are available?",
        answer: "Graduates can work as Reservoir Engineers, Drilling Engineers, Production Engineers, or in oil field operations, research, and consulting."
      },
      {
        question: "Are there field trips and practical training?",
        answer: "Yes, the program includes field trips to oil and gas facilities, industry visits, and mandatory industrial training with oil companies."
      },
      {
        question: "What software and tools will I learn?",
        answer: "You'll learn industry-standard software like Eclipse, Petrel, CMG, and other tools used in petroleum engineering and reservoir simulation."
      }
    ]
  },
  {
    id: 'beng-civil-engineering',
    title: 'B.Eng. Civil Engineering',
    duration: '5 years',
    level: 'Undergraduate',
    category: 'undergraduate',
    schoolFees: '₦2,338,182 (Returning Students) / ₦2,553,182 (New Students) per session',
    image: imageMap["civil-engineering"],
    description: 'Study the design, construction, and maintenance of infrastructure such as roads, bridges, and buildings.',
    requirements: [
      'Five O Level credits including English, Mathematics, Physics, Chemistry',
      'UTME Subjects: Mathematics, Physics, Chemistry',
      'JAMB score of 150+',
      'Direct Entry: A Level passes in Mathematics, Physics, and Chemistry',
      'Direct Entry: ND/HND in Civil Engineering or related field',
      'Direct Entry: Minimum of 10 points in IJMB'
    ],
    pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Civil%20Engineering%20_Undergraduate_.pdf?updatedAt=1747320125144",
    faqs: [
      { question: 'What are the career prospects?', answer: 'Graduates can work as structural engineers, site engineers, project managers, or in government agencies and construction firms.' },
      { question: 'Are there practical projects?', answer: 'Yes, students participate in real-world projects and industrial training.' },
      { question: 'Is there a focus on sustainability?', answer: 'Yes, sustainable design and construction are emphasized throughout the curriculum.' }
    ]
  },
  {
    id: 'beng-mechanical-engineering',
    title: 'B.Eng. Mechanical Engineering',
    duration: '5 years',
    level: 'Undergraduate',
    category: 'undergraduate',
    schoolFees: '₦2,338,182 (Returning Students) / ₦2,553,182 (New Students) per session',
    image: imageMap["default"],
    description: 'Learn about the design, analysis, and manufacturing of mechanical systems and machines.',
    requirements: [
      'Five O Level credits including English, Mathematics, Physics, Chemistry',
      'UTME Subjects: Mathematics, Physics, Chemistry',
      'JAMB score of 150+',
      'Direct Entry: A Level passes in Mathematics, Physics, and Chemistry',
      'Direct Entry: ND/HND in Mechanical Engineering or related field',
      'Direct Entry: Minimum of 10 points in IJMB'
    ],
    pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Mechanical%20Engineering%20_Undergraduate_.pdf?updatedAt=1747320137644",
    faqs: [
      { question: 'What industries employ mechanical engineers?', answer: 'Automotive, aerospace, energy, manufacturing, and consulting sectors.' },
      { question: 'Are there hands-on labs?', answer: 'Yes, the program includes extensive laboratory and workshop sessions.' },
      { question: 'Can I specialize?', answer: 'Yes, through elective courses in areas like robotics, thermodynamics, and materials.' }
    ]
  },
  {
    id: 'beng-materials-metallurgical',
    title: 'B.Eng. Materials & Metallurgical Engineering',
    duration: '5 years',
    level: 'Undergraduate',
    category: 'undergraduate',
    schoolFees: '₦2,338,182 (Returning Students) / ₦2,553,182 (New Students) per session',
    image: imageMap["default"],
    description: 'Study the properties, processing, and applications of engineering materials.',
    requirements: [
      'Five O Level credits including English, Mathematics, Physics, Chemistry',
      'UTME Subjects: Mathematics, Physics, Chemistry',
      'JAMB score of 150+',
      'Direct Entry: A Level passes in Mathematics, Physics, and Chemistry',
      'Direct Entry: ND/HND in Materials/Metallurgical Engineering or related field',
      'Direct Entry: Minimum of 10 points in IJMB'
    ],
    pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Materials%20and%20Metallurgical%20Engineering%20_Undergraduate_.pdf?updatedAt=1747320137372",
    faqs: [
      { question: 'What industries hire graduates?', answer: 'Manufacturing, automotive, aerospace, and materials research sectors.' },
      { question: 'Are there research opportunities?', answer: 'Yes, students can participate in faculty-led research projects.' },
      { question: 'Is there a focus on nanotechnology?', answer: 'Yes, advanced materials and nanotechnology are covered.' }
    ]
  },
  {
    id: 'bsc-accounting',
    title: 'B.Sc. Accounting',
    duration: '4 years',
    level: 'Undergraduate',
    category: 'undergraduate',
    schoolFees: '₦2,060,727 (Returning Students) / ₦2,253,182 (New Students) per session',
    image: imageMap["accounting"],
    description: 'Gain knowledge in financial accounting, auditing, taxation, and management accounting.',
    requirements: [
      "Five O Level credits including English, Mathematics, Economics, and two other relevant subjects",
      "UTME Subjects: Mathematics, Economics, and one other Social Science subject",
      "JAMB score of 150+",
      "Direct Entry: A Level passes in Accounting, Economics, or Business",
      "Direct Entry: ND/HND in Accounting or related field",
      "Direct Entry: Minimum of 10 points in IJMB"
    ],
    pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Accounting%20_Undergraduate_.pdf?updatedAt=1747320125310",
    faqs: [
      { question: 'What certifications can I pursue?', answer: 'ICAN, ACCA, and other professional accounting certifications.' },
      { question: 'Are there internship opportunities?', answer: 'Yes, students intern with top accounting firms.' },
      { question: 'Is there a focus on technology?', answer: 'Yes, accounting information systems and software are covered.' }
    ]
  },
  {
    id: 'bsc-business-admin',
    title: 'B.Sc. Business Administration',
    duration: '4 years',
    level: 'Undergraduate',
    category: 'undergraduate',
    schoolFees: '₦2,060,727 (Returning Students) / ₦2,253,182 (New Students) per session',
    image: imageMap["business-admin"],
    description: 'Learn about management, marketing, finance, entrepreneurship, and organizational behavior.',
    requirements: [
      "Five O Level credits including English, Mathematics, Economics, and two other relevant subjects",
      "UTME Subjects: Mathematics, Economics, and one other Social Science subject",
      "JAMB score of 150+",
      "Direct Entry: A Level passes in Business, Economics, or related field",
      "Direct Entry: ND/HND in Business Administration or related field",
      "Direct Entry: Minimum of 10 points in IJMB"
    ],
    pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Business%20Administration%20_Undergraduate_.pdf?updatedAt=1747320124999",
    faqs: [
      { question: 'What are the career options?', answer: 'Business manager, entrepreneur, marketing executive, HR manager, and more.' },
      { question: 'Are there entrepreneurship courses?', answer: 'Yes, entrepreneurship and innovation are core parts of the curriculum.' },
      { question: 'Is there a final year project?', answer: 'Yes, all students complete a business research project.' }
    ]
  },
  {
    id: 'foundation-science',
    title: "Remedial/NABTEB O’Level",
    duration: "1 year",
    level: "Foundation",
    category: 'foundation',
    schoolFees: "₦1,200,000 total",
    image: imageMap["foundation-science"],
    description: "Remedial/NABTEB O’Level program under the School of Foundation & Remedial Studies. Prepare for O’Level examinations with structured classes and academic support. Total fees: ₦1,200,000.",
    requirements: [
      "Five O Level credits including English, Mathematics, Physics, Chemistry, Biology",
      "Minimum age of 16 years",
      "Completed secondary education",
      "Good conduct certificate",
      "Pass in Basic Science subjects"
    ],
    pdf: "/pdfs/2024-2025 School of Foundation & Remedial Studies Fees.pdf",
    faqs: [
      {
        question: "What happens after completing the foundation program?",
        answer: "Successful completion allows direct entry into undergraduate programs in science and engineering fields at AUST."
      },
      {
        question: "Can I transfer to another university after foundation?",
        answer: "Yes, the foundation program is recognized by other universities, but transfer policies vary by institution."
      },
      {
        question: "What subjects are covered?",
        answer: "The program covers Mathematics, Physics, Chemistry, Biology, English, and Computer Science at an advanced level."
      }
    ]
  },
  {
    id: 'jupeb-science',
    title: "JUPEB A Levels",
    duration: "1 year",
    level: "JUPEB",
    category: 'jupeb',
    schoolFees: "₦1,500,000 total",
    image: imageMap["jupeb-science"],
    description: "JUPEB A Levels pathway to 200-level direct entry after successful completion. Intensive study with robust academic support. Total fees: ₦1,500,000.",
    requirements: [
      "Five O Level credits including English, Mathematics, Physics, Chemistry, Biology",
      "Minimum age of 16 years",
      "Completed secondary education",
      "Good conduct certificate",
      "Pass in Basic Science subjects"
    ],
    faqs: [
      {
        question: "What is JUPEB?",
        answer: "JUPEB (Joint Universities Preliminary Examinations Board) is a national program that prepares students for direct entry into university programs."
      },
      {
        question: "What are the benefits of JUPEB?",
        answer: "JUPEB provides a recognized pathway to university education, with successful students gaining direct entry into 200 level of their chosen programs."
      },
      {
        question: "How is the program assessed?",
        answer: "Assessment is through continuous evaluation, assignments, and final examinations set by JUPEB."
      }
    ]
  },
  {
    id: 'msc-computer-science',
    title: "M.Sc. Computer Science",
    duration: "3 semesters/1.5 Years",
    level: "Postgraduate",
    category: 'postgraduate',
    schoolFees: "₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦2,718,182 / $3,000",
    image: imageMap["computer-science"],
    description: "Advanced study of computer science principles and research methodologies. Focus on artificial intelligence, machine learning, and software systems.",
    requirements: [
      "First Class, Second Class Upper, or Second Class Lower in Computer Science or related field",
      "Minimum CGPA of 2.5/5.0",
      "Academic Transcripts",
      "Research Proposal",
      "Two Academic Reference Letters",
      "Statement of Purpose"
    ],
    pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Curriculum%20Handbook%20-%20M.Sc.%20Computer%20Science%20_Class%20of%202025_.pdf?updatedAt=1747320125550",
    faqs: [
      {
        question: "What research areas are available?",
        answer: "Research areas include Artificial Intelligence, Machine Learning, Data Science, Cybersecurity, Software Engineering, and Computer Networks."
      },
      {
        question: "Is there a thesis requirement?",
        answer: "Yes, students must complete a research thesis under the supervision of faculty members."
      },
      {
        question: "Can I work while studying?",
        answer: "The program is designed for full-time study, but part-time options may be available for working professionals."
      }
    ]
  },
  {
    id: 'phd-computer-science',
    title: "Ph.D. Computer Science",
    duration: "6 semesters/3 Years",
    level: "Postgraduate",
    category: 'postgraduate',
    schoolFees: "₦853,030 (Nigerian) / $2,000 (International) per semester | Total: ₦5,118,182 / $12,000",
    image: imageMap["computer-science"],
    description: "Doctoral research program focusing on computer science innovations, artificial intelligence, data science, and software engineering methodologies.",
    requirements: [
      "Masters degree in Computer Science or related field with minimum CGPA of 3.5/5.0",
      "Strong research background in computer science",
      "Proficiency in programming and analytical skills",
      "Academic Transcripts (B.Sc. and M.Sc.)",
      "Detailed Research Proposal",
      "Three Academic Reference Letters",
      "Statement of Purpose",
      "Research publications (if any)"
    ],
    faqs: [
      {
        question: "What is the research process like?",
        answer: "The program involves original research, publication of papers, and defense of a doctoral thesis. Students work closely with faculty advisors."
      },
      {
        question: "Are there teaching opportunities?",
        answer: "Yes, Ph.D. students can work as teaching assistants and gain valuable teaching experience."
      },
      {
        question: "What funding options are available?",
        answer: "Various funding options including research grants, teaching assistantships, and scholarships are available for qualified students."
      }
    ]
  },
  {
    id: 'msc-petroleum-engineering',
    title: "M.Sc. Petroleum & Energy Resources Engineering",
    duration: "3 semesters/1.5 Years",
    level: "Postgraduate",
    category: 'postgraduate',
    schoolFees: "₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦2,718,182 / $3,000",
    image: imageMap["petroleum-engineering"],
    description: "Advanced study of petroleum engineering principles, reservoir management, and enhanced oil recovery techniques.",
    requirements: [
      "First Class, Second Class Upper, or Second Class Lower in Petroleum Engineering or related field",
      "Minimum CGPA of 2.5/5.0",
      "Academic Transcripts",
      "Research Proposal",
      "Two Academic Reference Letters",
      "Statement of Purpose"
    ],
    pdf: "/pdfs/Curriculum Handbook - M.Sc. Petroleum Engineering [Class of 2025].pdf",
    faqs: [
      {
        question: "What research areas are available?",
        answer: "Research areas include Reservoir Engineering, Enhanced Oil Recovery, Drilling Technology, and Petroleum Economics."
      },
      {
        question: "Are there industry partnerships?",
        answer: "Yes, the program has strong ties with major oil and gas companies for research and internship opportunities."
      },
      {
        question: "What career opportunities are available?",
        answer: "Graduates can work as Reservoir Engineers, Research Scientists, Technical Consultants, or pursue Ph.D. studies."
      }
    ]
  },
  {
    id: 'phd-petroleum-engineering',
    title: "Ph.D. Petroleum & Energy Resources Engineering",
    duration: "6 semesters/3 Years",
    level: "Postgraduate",
    category: 'postgraduate',
    schoolFees: "₦853,030 (Nigerian) / $2,000 (International) per semester | Total: ₦5,118,182 / $12,000",
    image: imageMap["petroleum-engineering"],
    description: "Doctoral research program focusing on advanced petroleum engineering concepts, reservoir simulation, and enhanced oil recovery methods.",
    requirements: [
      "Masters degree in Petroleum Engineering or related field with minimum CGPA of 3.5/5.0",
      "Strong research background in petroleum engineering",
      "Academic Transcripts (B.Sc. and M.Sc.)",
      "Detailed Research Proposal",
      "Three Academic Reference Letters",
      "Statement of Purpose",
      "Research publications (if any)"
    ],
    faqs: [
      {
        question: "What research facilities are available?",
        answer: "Students have access to advanced laboratories, simulation software, and research centers focused on petroleum engineering."
      },
      {
        question: "Are there funding opportunities?",
        answer: "Yes, various funding options including research grants, teaching assistantships, and industry-sponsored projects are available."
      },
      {
        question: "What is the typical research output?",
        answer: "Students are expected to publish in high-impact journals and present at international conferences during their studies."
      }
    ]
  },
  {
    id: 'pgd-petroleum-energy-resources-engineering',
    title: 'Postgraduate Diploma Petroleum & Energy Resources Engineering',
    duration: '2 semesters/1 Year',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦1,812,120 / $2,000',
    image: imageMap["petroleum-engineering"],
    description: 'Practice-oriented diploma covering core concepts in petroleum and energy resources engineering.',
    requirements: [
      'First degree (minimum Third Class) or HND in Engineering or related field',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ]
  },
  {
    id: 'pm-applied-statistics',
    title: 'Professional Masters Applied Statistics',
    duration: '2 semesters/1 Year',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦1,812,120 / $2,000',
    image: imageMap["applied-stats"] || imageMap["default"],
    description: 'Applied statistical methods for data-driven decision making across industries.',
    requirements: [
      'First degree in any discipline with quantitative background',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ]
  },
  {
    id: 'msc-applied-statistics',
    title: 'M.Sc. Applied Statistics',
    duration: '3 semesters/1.5 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦2,718,182 / $3,000',
    image: imageMap["applied-stats"] || imageMap["default"],
    description: 'Advanced study of statistical theory and applications in science and industry.',
    requirements: [
      'First degree in Statistics, Mathematics, Computer Science, or related field',
      'Minimum CGPA of 2.5/5.0',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ]
  },
  {
    id: 'msc-geoinformatics-gis',
    title: 'M.Sc. Geoinformatics & GIS',
    duration: '3 semesters/1.5 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦2,718,182 / $3,000',
    image: imageMap["gis"],
    description: 'Geospatial data acquisition, analysis, and GIS applications for decision support.',
    requirements: [
      'First degree in Geography, Geoinformatics, Surveying, Computer Science, or related field',
      'Minimum CGPA of 2.5/5.0',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ]
  },
  {
    id: 'phd-geoinformatics-gis',
    title: 'Ph.D. Geoinformatics & GIS',
    duration: '6 semesters/3 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦853,030 (Nigerian) / $2,000 (International) per semester | Total: ₦5,118,182 / $12,000',
    image: imageMap["gis"],
    description: 'Doctoral research in geospatial science, remote sensing, and spatial analytics.',
    requirements: [
      'Masters degree in Geoinformatics, GIS, or related field',
      'Strong research background',
      'Academic transcripts',
      'Research proposal'
    ]
  },
  {
    id: 'msc-materials-science-engineering',
    title: 'M.Sc. Materials Science & Engineering',
    duration: '3 semesters/1.5 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦2,718,182 / $3,000',
    image: imageMap["default"],
    description: 'Advanced materials characterization, processing, and engineering applications.',
    requirements: [
      'First degree in Materials/Metallurgical Engineering or related field',
      'Minimum CGPA of 2.5/5.0',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ]
  },
  {
    id: 'phd-materials-science-engineering',
    title: 'Ph.D. Materials Science & Engineering',
    duration: '6 semesters/3 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦853,030 (Nigerian) / $2,000 (International) per semester | Total: ₦5,118,182 / $12,000',
    image: imageMap["default"],
    description: 'Doctoral research on materials design, synthesis, and advanced applications.',
    requirements: [
      'Masters degree in Materials/Metallurgical Engineering or related field',
      'Strong research background',
      'Academic transcripts',
      'Research proposal'
    ]
  },
  {
    id: 'pm-mathematical-modeling',
    title: 'Professional Masters Mathematical Modeling',
    duration: '2 semesters/1 Year',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦1,812,120 / $2,000',
    image: imageMap["math"] || imageMap["default"],
    description: 'Practice-oriented program focusing on applied mathematical modeling for real-world problems.',
    requirements: [
      'First degree in Mathematics, Engineering, or related field',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ]
  },
  {
    id: 'msc-mathematical-modeling',
    title: 'M.Sc. Mathematical Modeling',
    duration: '3 semesters/1.5 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦2,718,182 / $3,000',
    image: imageMap["math"] || imageMap["default"],
    description: 'Mathematical modeling, simulation, and optimization techniques across domains.',
    requirements: [
      'First degree in Mathematics, Statistics, Physics, Engineering or related field',
      'Minimum CGPA of 2.5/5.0',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ]
  },
  {
    id: 'pm-management-information-technology',
    title: 'Professional Masters Management of Information Technology',
    duration: '2 semesters/1 Year',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦1,812,120 / $2,000',
    image: imageMap["computer-science"],
    description: 'Practice-focused program on IT governance, strategy, and digital transformation.',
    requirements: [
      'First degree in any discipline',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ]
  },
  {
    id: 'msc-management-information-technology',
    title: 'M.Sc. Management of Information Technology',
    duration: '3 semesters/1.5 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦2,718,182 / $3,000',
    image: imageMap["computer-science"],
    description: 'Advanced study of IT management, systems strategy, and enterprise technology leadership.',
    requirements: [
      'First degree in IT, Computer Science, Engineering, or related field',
      'Minimum CGPA of 2.5/5.0',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ]
  },
  {
    id: 'msc-aerospace-engineering',
    title: "M.Sc. Aerospace Engineering",
    duration: "3 semesters/1.5 Years",
    level: "Postgraduate",
    category: 'postgraduate',
    schoolFees: "₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦2,718,182 / $3,000",
    image: imageMap["aerospace"],
    description: "Advanced study of aerospace systems, aerodynamics, propulsion, and space technology.",
    requirements: [
      "First Class, Second Class Upper, or Second Class Lower in Aerospace Engineering or related field",
      "Minimum CGPA of 2.5/5.0",
      "Academic Transcripts",
      "Research Proposal",
      "Two Academic Reference Letters",
      "Statement of Purpose"
    ],
    pdf: "/pdfs/Curriculum Handbook - M.Sc. Aerospace Engineering [Class of 2025].pdf",
    faqs: [
      {
        question: "What research areas are available?",
        answer: "Research areas include Aerodynamics, Propulsion Systems, Space Technology, and Aircraft Design."
      },
      {
        question: "Are there practical projects?",
        answer: "Yes, students work on real aerospace projects and have access to wind tunnels and simulation facilities."
      },
      {
        question: "What career paths are available?",
        answer: "Graduates can work in aerospace companies, research institutions, or pursue Ph.D. studies."
      }
    ]
  },
  {
    id: 'phd-aerospace-engineering',
    title: "Ph.D. Aerospace Engineering",
    duration: "6 semesters/3 Years",
    level: "Postgraduate",
    category: 'postgraduate',
    schoolFees: "₦853,030 (Nigerian) / $2,000 (International) per semester | Total: ₦5,118,182 / $12,000",
    image: imageMap["aerospace"],
    description: "Doctoral research program focusing on advanced aerospace concepts, propulsion systems, and space technology innovations.",
    requirements: [
      "Masters degree in Aerospace Engineering or related field with minimum CGPA of 3.5/5.0",
      "Strong research background in aerospace engineering",
      "Academic Transcripts (B.Sc. and M.Sc.)",
      "Detailed Research Proposal",
      "Three Academic Reference Letters",
      "Statement of Purpose",
      "Research publications (if any)"
    ],
    faqs: [
      {
        question: "What research facilities are available?",
        answer: "Students have access to advanced wind tunnels, propulsion labs, and space technology research centers."
      },
      {
        question: "Are there industry collaborations?",
        answer: "Yes, the program collaborates with major aerospace companies and research institutions."
      },
      {
        question: "What is the research output expectation?",
        answer: "Students are expected to publish in top aerospace journals and present at international conferences."
      }
    ]
  },
  {
    id: 'msc-public-admin',
    title: 'M.Sc. Public Administration',
    duration: '3 semesters/1.5 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦2,718,182 / $3,000',
    image: imageMap["public-admin"] || imageMap["default"],
    description: 'Advanced study in public sector management, policy analysis, and governance.',
    requirements: [
      'First degree in Public Administration or related field',
      'Minimum CGPA of 2.5/5.0',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ],
    faqs: [
      { question: 'What career paths are available?', answer: 'Graduates can work in government, NGOs, international organizations, or pursue doctoral studies.' },
      { question: 'Is there a research component?', answer: 'Yes, students complete a research project or thesis.' },
      { question: 'Are there evening classes?', answer: 'Some courses may be offered in the evenings for working professionals.' }
    ]
  },
  {
    id: 'taught-masters-public-admin',
    title: 'Professional Masters Public Administration',
    duration: '2 semesters/1 Year',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦1,812,120 / $2,000',
    image: imageMap["public-admin"] || imageMap["default"],
    description: 'Professional program focused on practical skills for public sector leadership.',
    requirements: [
      'First degree in any discipline',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ],
    faqs: [
      { question: 'Is this program suitable for non-public sector professionals?', answer: 'Yes, it is open to graduates from any discipline.' },
      { question: 'What is the difference from the M.Sc.?', answer: 'The taught masters is more practice-oriented and shorter in duration.' },
      { question: 'Are internships available?', answer: 'Yes, there are opportunities for practical placements.' }
    ]
  },
  {
    id: 'msc-public-policy',
    title: 'M.Sc. Public Policy',
    duration: '3 semesters/1.5 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦2,718,182 / $3,000',
    image: imageMap["policy"] || imageMap["default"],
    description: 'In-depth study of policy formulation, analysis, and implementation in the public sector.',
    requirements: [
      'First degree in Public Policy, Political Science, or related field',
      'Minimum CGPA of 2.5/5.0',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ],
    faqs: [
      { question: 'What skills will I gain?', answer: 'Policy analysis, research, and communication skills.' },
      { question: 'Are there policy labs?', answer: 'Yes, students participate in policy simulation exercises.' },
      { question: 'Can I work in international organizations?', answer: 'Yes, graduates are well-prepared for roles in NGOs and international agencies.' }
    ]
  },
  {
    id: 'taught-masters-public-policy',
    title: 'Professional Masters Public Policy',
    duration: '2 semesters/1 Year',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦1,812,120 / $2,000',
    image: imageMap["policy"] || imageMap["default"],
    description: 'Professional program for practical policy skills and leadership.',
    requirements: [
      'First degree in any discipline',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ],
    faqs: [
      { question: 'Is this program suitable for non-policy professionals?', answer: 'Yes, it is open to graduates from any discipline.' },
      { question: 'What is the difference from the M.Sc.?', answer: 'The taught masters is more practice-oriented and shorter in duration.' },
      { question: 'Are internships available?', answer: 'Yes, there are opportunities for practical placements.' }
    ]
  },
  {
    id: 'msc-applied-math',
    title: 'M.Sc. Pure & Applied Mathematics',
    duration: '3 semesters/1.5 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦2,718,182 / $3,000',
    image: imageMap["math"] || imageMap["default"],
    description: 'Advanced mathematical theory, modeling, and computational methods.',
    requirements: [
      'First degree in Mathematics or related field',
      'Minimum CGPA of 2.5/5.0',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ],
    pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Curriculum%20Handbook%20-%20M.Sc.%20Pure%20and%20Applied%20Mathematics%20_Class%20of%202025_.pdf?updatedAt=1747320125483",
    faqs: [
      { question: 'What research areas are available?', answer: 'Mathematical modeling, statistics, and computational mathematics.' },
      { question: 'Is there a thesis?', answer: 'Yes, students complete a research thesis.' },
      { question: 'Are there teaching opportunities?', answer: 'Yes, students may assist in undergraduate courses.' }
    ]
  },
  {
    id: 'phd-applied-math',
    title: 'Ph.D. Pure & Applied Mathematics',
    duration: '6 semesters/3 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦853,030 (Nigerian) / $2,000 (International) per semester | Total: ₦5,118,182 / $12,000',
    image: imageMap["math"] || imageMap["default"],
    description: 'Doctoral research in advanced mathematics and its applications.',
    requirements: [
      'Masters degree in Mathematics or related field',
      'Strong research background',
      'Academic transcripts',
      'Research proposal'
    ],
    faqs: [
      { question: 'What is the research focus?', answer: 'Original research in pure or applied mathematics.' },
      { question: 'Are there funding opportunities?', answer: 'Yes, through research grants and assistantships.' },
      { question: 'What is the expected research output?', answer: 'Publication in peer-reviewed journals and conference presentations.' }
    ]
  },
  {
    id: 'msc-space-physics',
    title: 'M.Sc. Space Physics',
    duration: '3 semesters/1.5 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦2,718,182 / $3,000',
    image: imageMap["space-physics"] || imageMap["default"],
    description: 'Study of space environment, plasma physics, and astrophysics.',
    requirements: [
      'First degree in Physics or related field',
      'Minimum CGPA of 2.5/5.0',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ],
    faqs: [
      { question: 'What are the research areas?', answer: 'Space weather, plasma physics, and astrophysics.' },
      { question: 'Are there observatory facilities?', answer: 'Yes, students have access to research labs and observatories.' },
      { question: 'What are the career prospects?', answer: 'Research, academia, and space agencies.' }
    ]
  },
  {
    id: 'phd-space-physics',
    title: 'Ph.D. Space Physics',
    duration: '6 semesters/3 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦853,030 (Nigerian) / $2,000 (International) per semester | Total: ₦5,118,182 / $12,000',
    image: imageMap["space-physics"] || imageMap["default"],
    description: 'Doctoral research in space physics, astrophysics, and plasma science.',
    requirements: [
      'Masters degree in Physics or related field',
      'Strong research background',
      'Academic transcripts',
      'Research proposal'
    ],
    faqs: [
      { question: 'What is the research focus?', answer: 'Original research in space and plasma physics.' },
      { question: 'Are there collaborations with space agencies?', answer: 'Yes, there are opportunities for international collaboration.' },
      { question: 'What is the expected research output?', answer: 'Publication in peer-reviewed journals and conference presentations.' }
    ]
  },
  {
    id: 'msc-systems-engineering',
    title: 'M.Sc. Systems Engineering',
    duration: '3 semesters/1.5 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦2,718,182 / $3,000',
    image: imageMap["default"],
    description: 'Advanced study in systems design, optimization, and integration.',
    requirements: [
      'First degree in Engineering or related field',
      'Minimum CGPA of 2.5/5.0',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ],
    faqs: [
      { question: 'What are the research areas?', answer: 'Systems modeling, optimization, and control.' },
      { question: 'Are there industry projects?', answer: 'Yes, students work on real-world engineering projects.' },
      { question: 'What are the career prospects?', answer: 'Engineering, consulting, and research.' }
    ]
  },
  {
    id: 'phd-systems-engineering',
    title: 'Ph.D. Systems Engineering',
    duration: '6 semesters/3 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦853,030 (Nigerian) / $2,000 (International) per semester | Total: ₦5,118,182 / $12,000',
    image: imageMap["default"],
    description: 'Doctoral research in systems engineering, optimization, and integration.',
    requirements: [
      'Masters degree in Engineering or related field',
      'Strong research background',
      'Academic transcripts',
      'Research proposal'
    ],
    faqs: [
      { question: 'What is the research focus?', answer: 'Original research in systems engineering and optimization.' },
      { question: 'Are there industry collaborations?', answer: 'Yes, with engineering firms and research centers.' },
      { question: 'What is the expected research output?', answer: 'Publication in peer-reviewed journals and conference presentations.' }
    ]
  },
  {
    id: 'msc-theoretical-applied-physics',
    title: 'M.Sc. Theoretical & Applied Physics',
    duration: '3 semesters/1.5 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦906,060 (Nigerian) / $1,000 (International) per semester | Total: ₦2,718,182 / $3,000',
    image: imageMap["default"],
    description: 'Advanced study in theoretical and applied physics, including quantum mechanics and materials science.',
    requirements: [
      'First degree in Physics or related field',
      'Minimum CGPA of 2.5/5.0',
      'Academic transcripts',
      'Reference letters',
      'Statement of purpose'
    ],
    pdf: "https://ik.imagekit.io/nsq6yvxg1/pdfs/Curriculum%20Handbook%20-%20M.Sc.%20Theoretical%20and%20Applied%20Physics%20_Class%20of%202025_.pdf?updatedAt=1747320124938",
    faqs: [
      { question: 'What are the research areas?', answer: 'Quantum mechanics, condensed matter, and materials science.' },
      { question: 'Are there laboratory facilities?', answer: 'Yes, students have access to advanced physics labs.' },
      { question: 'What are the career prospects?', answer: 'Research, academia, and industry.' }
    ]
  },
  {
    id: 'phd-theoretical-applied-physics',
    title: 'Ph.D. Theoretical & Applied Physics',
    duration: '6 semesters/3 Years',
    level: 'Postgraduate',
    category: 'postgraduate',
    schoolFees: '₦853,030 (Nigerian) / $2,000 (International) per semester | Total: ₦5,118,182 / $12,000',
    image: imageMap["default"],
    description: 'Doctoral research in theoretical and applied physics.',
    requirements: [
      'Masters degree in Physics or related field',
      'Strong research background',
      'Academic transcripts',
      'Research proposal'
    ],
    faqs: [
      { question: 'What is the research focus?', answer: 'Original research in theoretical and applied physics.' },
      { question: 'Are there collaborations with research institutes?', answer: 'Yes, national and international collaborations are encouraged.' },
      { question: 'What is the expected research output?', answer: 'Publication in peer-reviewed journals and conference presentations.' }
    ]
  }
]; 