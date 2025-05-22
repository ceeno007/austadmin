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
    link?: { text: string; url: string };
  }[];
  
}

export const programs: Program[] = [
  {
    id: 'beng-civil-engineering',
    title: 'B.Eng. Civil Engineering',
    duration: '5 years',
    level: 'Undergraduate',
    category: 'undergraduate',
    schoolFees: '₦2,212,727 per session',
    image: imageMap['civil-engineering'],
    description: 'Study the design, construction, and maintenance of infrastructure such as roads, bridges, and buildings.',
    requirements: [
      'Five O Level credits including English, Mathematics, Physics, Chemistry',
      'UTME Subjects: Mathematics, Physics, Chemistry',
      'JAMB score of 200+',
      'Direct Entry: A Level passes in Mathematics, Physics, and Chemistry',
      'Direct Entry: ND/HND in Civil Engineering or related field',
      'Direct Entry: Minimum of 10 points in IJMB'
    ],
    pdf: 'https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Civil%20Engineering%20_Undergraduate_.pdf?updatedAt=1747320125144',
    faqs: [
      { question: 'What are the career prospects?', answer: 'Graduates can work as structural engineers, site engineers, project managers, or in government agencies and construction firms.' },
      { question: 'Are there practical projects?', answer: 'Yes, students participate in real-world projects and industrial training.' },
      { question: 'Is there a focus on sustainability?', answer: 'Yes, sustainable design and construction are emphasized throughout the curriculum.' }
    ]
  },
  {
    id: 'beng-materials-metallurgical',
    title: 'B.Eng. Materials & Metallurgical Engineering',
    duration: '5 years',
    level: 'Undergraduate',
    category: 'undergraduate',
    schoolFees: '₦2,212,727 per session',
    image: imageMap['default'],
    description: 'Study the properties, processing, and applications of engineering materials.',
    requirements: [
      'Five O Level credits including English, Mathematics, Physics, Chemistry',
      'UTME Subjects: Mathematics, Physics, Chemistry',
      'JAMB score of 200+',
      'Direct Entry: A Level passes in Mathematics, Physics, and Chemistry',
      'Direct Entry: ND/HND in Materials/Metallurgical Engineering or related field',
      'Direct Entry: Minimum of 10 points in IJMB'
    ],
    pdf: 'https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Materials%20and%20Metallurgical%20Engineering%20_Undergraduate_.pdf?updatedAt=1747320137372',
    faqs: [
      { question: 'What industries hire graduates?', answer: 'Manufacturing, automotive, aerospace, and materials research sectors.' },
      { question: 'Are there research opportunities?', answer: 'Yes, students can participate in faculty-led research projects.' },
      { question: 'Is there a focus on nanotechnology?', answer: 'Yes, advanced materials and nanotechnology are covered.' }
    ]
  },
  {
    id: 'beng-mechanical-engineering',
    title: 'B.Eng. Mechanical Engineering',
    duration: '5 years',
    level: 'Undergraduate',
    category: 'undergraduate',
    schoolFees: '₦2,212,727 per session',
    image: imageMap['default'],
    description: 'Learn about the design, analysis, and manufacturing of mechanical systems and machines.',
    requirements: [
      'Five O Level credits including English, Mathematics, Physics, Chemistry',
      'UTME Subjects: Mathematics, Physics, Chemistry',
      'JAMB score of 200+',
      'Direct Entry: A Level passes in Mathematics, Physics, and Chemistry',
      'Direct Entry: ND/HND in Mechanical Engineering or related field',
      'Direct Entry: Minimum of 10 points in IJMB'
    ],
    pdf: 'https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Mechanical%20Engineering%20_Undergraduate_.pdf?updatedAt=1747320137644',
    faqs: [
      { question: 'What industries employ mechanical engineers?', answer: 'Automotive, aerospace, energy, manufacturing, and consulting sectors.' },
      { question: 'Are there hands-on labs?', answer: 'Yes, the program includes extensive laboratory and workshop sessions.' },
      { question: 'Can I specialize?', answer: 'Yes, through elective courses in areas like robotics, thermodynamics, and materials.' }
    ]
  },
  {
    id: 'beng-petroleum-engineering',
    title: 'B.Eng. Petroleum Engineering',
    duration: '5 years',
    level: 'Undergraduate',
    category: 'undergraduate',
    schoolFees: '₦2,212,727 per session',
    image: imageMap['petroleum-engineering'],
    description: 'Study oil and gas exploration, production, and processing. Learn about reservoir engineering, drilling operations, and petroleum economics.',
    requirements: [
      'Five O Level credits including English, Mathematics, Physics, Chemistry',
      'UTME Subjects: Mathematics, Physics, Chemistry',
      'JAMB score of 200+',
      'Direct Entry: A Level passes in Mathematics, Physics, and Chemistry',
      'Direct Entry: ND/HND in Petroleum Engineering or related field',
      'Direct Entry: Minimum of 10 points in IJMB'
    ],
    pdf: 'https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Petroleum%20and%20Energy%20Resources%20Engineering%20_Undergraduate_.pdf?updatedAt=1747320137636',
    faqs: [
      { question: 'What career paths are available?', answer: 'Graduates can work as Reservoir Engineers, Drilling Engineers, Production Engineers, or in oil field operations, research, and consulting.' },
      { question: 'Are there field trips and practical training?', answer: 'Yes, the program includes field trips to oil and gas facilities, industry visits, and mandatory industrial training with oil companies.' },
      { question: 'What software and tools will I learn?', answer: 'You\'ll learn industry-standard software like Eclipse, Petrel, CMG, and other tools used in petroleum engineering and reservoir simulation.' }
    ]
  },
  {
    id: 'bsc-accounting',
    title: 'B.Sc. Accounting',
    duration: '4 years',
    level: 'Undergraduate',
    category: 'undergraduate',
    schoolFees: '₦2,212,727 per session',
    image: imageMap['accounting'],
    description: 'Gain knowledge in financial accounting, auditing, taxation, and management accounting.',
    requirements: [
      'Five O Level credits including English, Mathematics, Economics, and two other relevant subjects',
      'UTME Subjects: Mathematics, Economics, and one other Social Science subject',
      'JAMB score of 200+',
      'Direct Entry: A Level passes in Accounting, Economics, or Business',
      'Direct Entry: ND/HND in Accounting or related field',
      'Direct Entry: Minimum of 10 points in IJMB'
    ],
    pdf: 'https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Accounting%20_Undergraduate_.pdf?updatedAt=1747320125310',
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
    schoolFees: '₦2,212,727 per session',
    image: imageMap['business-admin'],
    description: 'Learn about management, marketing, finance, entrepreneurship, and organizational behavior.',
    requirements: [
      'Five O Level credits including English, Mathematics, Economics, and two other relevant subjects',
      'UTME Subjects: Mathematics, Economics, and one other Social Science subject',
      'JAMB score of 200+',
      'Direct Entry: A Level passes in Business, Economics, or related field',
      'Direct Entry: ND/HND in Business Administration or related field',
      'Direct Entry: Minimum of 10 points in IJMB'
    ],
    pdf: 'https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Business%20Administration%20_Undergraduate_.pdf?updatedAt=1747320124999',
    faqs: [
      { question: 'What are the career options?', answer: 'Business manager, entrepreneur, marketing executive, HR manager, and more.' },
      { question: 'Are there entrepreneurship courses?', answer: 'Yes, entrepreneurship and innovation are core parts of the curriculum.' },
      { question: 'Is there a final year project?', answer: 'Yes, all students complete a business research project.' }
    ]
  },
  {
    id: 'bsc-computer-science',
    title: 'B.Sc. Computer Science',
    duration: '4 years',
    level: 'Undergraduate',
    category: 'undergraduate',
    schoolFees: '₦2,212,727 per session',
    image: imageMap['computer-science'],
    description: 'Develop skills in algorithms, software engineering, and computer systems. Study artificial intelligence, data structures, and computer networks.',
    requirements: [
      'Five O Level credits including English, Mathematics, Physics/Data Processing',
      'UTME Subjects: Mathematics, Physics, and one other Science subject',
      'JAMB score of 200+',
      'Direct Entry: A Level passes in Mathematics and Physics',
      'Direct Entry: ND/HND in Computer Science or related field',
      'Direct Entry: Minimum of 10 points in IJMB'
    ],
    pdf: 'https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Computer%20Science%20_Undergraduate_.pdf?updatedAt=1747320137510',
    faqs: [
      { question: 'What’s the difference between Computer Science and Software Engineering?', answer: 'Computer Science focuses more on theoretical foundations and algorithms, while Software Engineering emphasizes practical software development and project management.' },
      { question: 'Can I specialize in a particular area?', answer: 'Yes, you can specialize in areas like Artificial Intelligence, Cybersecurity, Data Science, or Software Development through elective courses and final year projects.' },
      { question: 'What facilities are available for students?', answer: 'Students have access to modern computer labs, high-speed internet, specialized software, and research facilities for practical work and projects.' }
    ]
  },
  {
    id: 'bsc-software-engineering',
    title: 'B.Sc. Software Engineering',
    duration: '4 years',
    level: 'Undergraduate',
    category: 'undergraduate',
    schoolFees: '₦2,212,727 per session',
    image: imageMap['software-engineering'],
    description: 'Focus on software development methodologies, tools, and systems design. Learn programming languages, software architecture, and project management.',
    requirements: [
      'Five O Level credits including English, Mathematics, Physics/Data Processing',
      'UTME Subjects: Mathematics, Physics, and one other Science subject',
      'JAMB score of 200+',
      'Direct Entry: A Level passes in Mathematics and Physics',
      'Direct Entry: ND/HND in Computer Science or related field',
      'Direct Entry: Minimum of 10 points in IJMB'
    ],
    pdf: 'https://ik.imagekit.io/nsq6yvxg1/pdfs/Departmental%20Handbook%20-%20Software%20Engineering%20_Undergraduate_.pdf?updatedAt=1747320137632',
    faqs: [
      { question: 'What career opportunities are available after graduation?', answer: 'Graduates can work as Software Engineers, Web Developers, Mobile App Developers, Systems Analysts, Project Managers, or pursue further studies in Computer Science or related fields.' },
      { question: 'What programming languages will I learn?', answer: 'You’ll learn multiple programming languages including Python, Java, JavaScript, C++, and more, along with modern frameworks and tools used in industry.' },
      { question: 'Are there internship opportunities?', answer: 'Yes, the program includes mandatory industrial training and internship opportunities with our partner companies in the tech industry.' }
    ]
  }
,
{
  id: 'foundation-science',
  title: 'Foundation & Remedial Sciences Programme',
  duration: '1 year',
  level: 'Foundation',
  category: 'foundation',
  schoolFees: '₦993,000 total',
  image: imageMap['foundation-science'],
  description: 'Prepare for undergraduate studies in science and engineering fields. Build strong foundations in Mathematics, Physics, Chemistry, Biology, English, and Computer Science.',
  requirements: [
    'Five O Level credits including English, Mathematics, Physics, Chemistry, Biology',
    'Minimum age of 16 years',
    'Completed secondary education',
    'Pass in Basic Science subjects'
  ],
  pdf: '/pdfs/2024-2025 School of Foundation & Remedial Studies Fees.pdf',
  faqs: [
    {
      question: 'What happens after completing the foundation programme?',
      answer: 'Successful completion allows direct entry into undergraduate programmes in science and engineering fields at AUST.'
    },
    {
      question: 'Can I transfer to another university after foundation?',
      answer: 'Yes, the programme is recognised by other universities, but transfer policies vary by institution.'
    },
    {
      question: 'What subjects are covered?',
      answer: 'Mathematics, Physics, Chemistry, Biology, English, and Computer Science at an advanced level.'
    }
  ]
},
{
  id: 'jupeb-science',
  title: 'JUPEB Programme (School of Foundation & Remedial Studies)',
  duration: '1 year',
  level: 'JUPEB',
  category: 'jupeb',
  schoolFees: '₦1,343,000 total',
  image: imageMap['jupeb-science'],
  description: 'Advanced preparation for direct entry into 200-level university programmes. Intensive study in science subjects and development of academic skills.',
  requirements: [
    'Five O Level credits including English, Mathematics, Physics, Chemistry, Biology',
    'Minimum age of 16 years',
    'Completed secondary education',
    'Pass in Basic Science subjects'
  ],
  faqs: [
    {
      question: 'What is JUPEB?',
      answer: `
        JUPEB (Joint Universities Preliminary Examinations Board) is a national programme
        that prepares students for direct entry into university programmes.
        For more information, visit
        https://jupeb.edu.ng
        
      `
    },
    {
      question: 'What are the benefits of JUPEB?',
      answer: 'Successful candidates gain direct entry into 200-level of their chosen degree programmes, often with advanced standing.'
    },
    {
      question: 'How is the programme assessed?',
      answer: 'Assessment is through continuous evaluation, assignments, and final examinations set by JUPEB.'
    }
  ]
}
,
  
 /* ——— POSTGRADUATE PROGRAMMES (improved FAQs) ——— */
{
  id: 'msc-applied-statistics',
  title: 'M.Sc. Applied Statistics',
  duration: '3 semesters/1.5 Years',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦1,800,000 total',
  image: imageMap['applied-stats'],
  description: 'Rigorous training in statistical modelling, data analytics, and experimental design.',
  requirements: [
    'Minimum CGPA of 2.78/5.0 in Statistics, Mathematics, or related field'
  ],
  faqs: [
    { question: 'Which industries hire our graduates?', answer: 'Sectors like finance, pharmaceuticals, government agencies, and NGOs actively recruit applied statisticians.' },
    { question: 'What does the capstone project involve?', answer: 'You’ll partner with an industry or research sponsor to analyse a large real-world dataset and present findings.' },
    { question: 'Can I join faculty research?', answer: 'Yes—there are ongoing TETFund- and internationally-funded projects you can contribute to.' }
  ]
},
{
  id: 'phd-applied-statistics',
  title: 'Ph.D. Applied Statistics',
  duration: '6 semesters/3 Years',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦4,200,000 total',
  image: imageMap['applied-stats'],
  description: 'Doctoral research in modern statistical theory and its practical applications.',
  requirements: [
    'M.Sc. in Statistics or closely-related discipline with CGPA ≥ 3.25/5.0'
  ],
  faqs: [
    { question: 'What research support is provided?', answer: 'Dedicated faculty supervision, access to HPC clusters, and grant-writing workshops.' },
    { question: 'How many publications are expected?', answer: 'You must publish at least two Scopus-indexed articles before thesis defence.' },
    { question: 'Can I teach as a graduate assistant?', answer: 'Yes—TA positions are available to cover tuition and provide teaching experience.' }
  ]
},
{
  id: 'msc-aerospace-engineering',
  title: 'M.Sc. Aerospace Engineering',
  duration: '3 semesters/1.5 Years',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦1,800,000 total',
  image: imageMap['aerospace'],
  description: 'Research and coursework in aerodynamics, propulsion, and spacecraft design.',
  requirements: [
    'Second Class Lower in any engineering discipline'
  ],
  faqs: [
    { question: 'Which lab facilities will I use?', answer: 'You’ll work in our wind tunnels, propulsion test rigs, and CAD/CAE suites.' },
    { question: 'Can I specialise?', answer: 'Yes—you can focus on structures, propulsion, or space systems via elective modules and projects.' },
    { question: 'What career paths exist?', answer: 'Graduates join aerospace firms, defence contractors, or continue to Ph.D. studies.' }
  ]
},
{
  id: 'phd-aerospace-engineering',
  title: 'Ph.D. Aerospace Engineering',
  duration: '6 semesters/3 Years',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦4,200,000 total',
  image: imageMap['aerospace'],
  description: 'Doctoral research in advanced aerospace systems and space technology.',
  requirements: [
    'Second Class Lower + CGPA ≥ 3.25/5.0 at M.Sc. level'
  ],
  faqs: [
    { question: 'What prior research is recommended?', answer: 'A strong M.Sc. thesis or publications in relevant aerospace journals.' },
    { question: 'Are there scholarships?', answer: 'You can apply for TETFund, university fellowships, and industry-sponsored Ph.D. chairs.' },
    { question: 'What lab support is provided?', answer: 'Dedicated research labs, simulation software licenses, and prototyping workshops.' }
  ]
},
{
  id: 'msc-computer-science',
  title: 'M.Sc. Computer Science',
  duration: '3 semesters/1.5 Years',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦1,800,000 total',
  image: imageMap['computer-science'],
  description: 'Graduate study in algorithms, AI, data science, and systems.',
  requirements: [
    'Second Class Lower in Computer Science, IT, or related field'
  ],
  faqs: [
    { question: 'Which specialisations are offered?', answer: 'AI & ML, Data Science, Cybersecurity, Software Engineering.' },
    { question: 'Is there an industry internship?', answer: 'Yes—optional 12-week placements with tech companies are available.' },
    { question: 'How is the thesis assessed?', answer: 'By a faculty panel based on originality, technical depth, and practical impact.' }
  ]
},
{
  id: 'phd-computer-science',
  title: 'Ph.D. Computer Science',
  duration: '6 semesters/3 Years',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦4,200,000 total',
  image: imageMap['computer-science'],
  description: 'Research-intensive programme in cutting-edge computing domains.',
  requirements: [
    'M.Sc. in Computer Science with CGPA ≥ 3.25/5.0'
  ],
  faqs: [
    { question: 'What is the candidacy exam?', answer: 'An oral defence of your research proposal before a faculty committee.' },
    { question: 'Are teaching roles available?', answer: 'Yes—you can serve as teaching or research assistants with stipend.' },
    { question: 'Publication goals?', answer: 'At least two peer-reviewed conference or journal papers before defence.' }
  ]
},
{
  id: 'msc-geoinformatics-gis',
  title: 'M.Sc. Geoinformatics & GIS',
  duration: '3 semesters/1.5 Years',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦1,800,000 total',
  image: imageMap['gis'],
  description: 'Advanced spatial data analysis, remote sensing, and geospatial modelling.',
  requirements: [
    'Second Class Lower in Geography, Surveying, Geodesy, or related field'
  ],
  faqs: [
    { question: 'Which software tools are taught?', answer: 'ArcGIS, QGIS, ERDAS Imagine, and Python GIS libraries.' },
    { question: 'What fieldwork is involved?', answer: 'Drone surveys, GPS mapping, and ground-truth remote sensing data collection.' },
    { question: 'What roles do graduates fill?', answer: 'GIS analysts, urban planners, environmental modellers, and consultant.' },
   
  ]
},
{
  id: 'phd-geoinformatics-gis',
  title: 'Ph.D. Geoinformatics & GIS',
  duration: '6 semesters/3 Years',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦4,200,000 total',
  image: imageMap['gis'],
  description: 'Doctoral studies in spatial data science and advanced GIS technologies.',
  requirements: [
    'M.Sc. in Geoinformatics/GIS with CGPA ≥ 3.25/5.0'
  ],
  faqs: [
    { question: 'Are there research partnerships?', answer: 'Yes—collaborations with RCMRD, ISPRS working groups, and national agencies.' },
    { question: 'Publication expectations?', answer: 'At least two high-impact GIScience journal papers before submission.' },
    { question: 'Can I teach?', answer: 'Opportunities exist to assist in GIS labs and undergraduate lecturing.' }
  ]
},
{
  id: 'msc-management-of-information-technology',
  title: 'M.Sc. Management of Information Technology',
  duration: '3 semesters/1.5 Years',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦1,800,000 total',
  image: imageMap['default'],
  description: 'Strategy, governance, and leadership for enterprise IT systems.',
  requirements: [
    'Second Class Lower first degree OR HND + PGD in Computing/IT'
  ],
  faqs: [
    { question: 'Does it align with certifications?', answer: 'Yes—syllabus covers ITIL, COBIT, and PMP frameworks.' },
    { question: 'What is the capstone project?', answer: 'A real-world IT governance or digital-transformation consulting project.' },
    { question: 'Is there flexible scheduling?', answer: 'Weekend and evening classes accommodate working professionals.' }
  ]
},
{
  id: 'msc-materials-science-engineering',
  title: 'M.Sc. Materials Science & Engineering',
  duration: '3 semesters/1.5 Years',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦1,800,000 total',
  image: imageMap['default'],
  description: 'Study of advanced materials, nano-structures, and manufacturing processes.',
  requirements: [
    'Second Class Lower in Materials, Metallurgy, Mechanical, or Chemical Engineering'
  ],
  faqs: [
    { question: 'Which labs will I use?', answer: 'SEM, XRD, nano-indentation, and mechanical testing facilities.' },
    { question: 'Are there industry attachments?', answer: 'MoUs with steel, ceramics, and additive-manufacturing firms.' },
    { question: 'Can I apply for scholarships?', answer: 'Yes—merit awards are available via the Energy Materials Centre.' }
  ]
},
{
  id: 'phd-materials-science-engineering',
  title: 'Ph.D. Materials Science & Engineering',
  duration: '6 semesters/3 Years',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦4,200,000 total',
  image: imageMap['default'],
  description: 'Doctoral research in nanomaterials, composites, and functional materials.',
  requirements: [
    'M.Sc. in a materials-related field with CGPA ≥ 3.25/5.0'
  ],
  faqs: [
    { question: 'What research clusters exist?', answer: 'Energy materials, biomaterials, corrosion science, sustainable metallurgy.' },
    { question: 'Is conference travel funded?', answer: 'Partial funding for SCIE-indexed conferences is available.' },
    { question: 'Do I teach?', answer: 'Yes—assist in undergraduate labs and tutorial sessions.' }
  ]
},
{
  id: 'msc-mathematical-modeling',
  title: 'M.Sc. Mathematical Modeling',
  duration: '3 semesters/1.5 Years',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦1,800,000 total',
  image: imageMap['math'],
  description: 'Simulation, optimisation, and applied‐math techniques for complex systems.',
  requirements: [
    'CGPA ≥ 2.78/5.0 in Mathematics, Physics, Engineering, or related field'
  ],
  faqs: [
    { question: 'What software do we use?', answer: 'MATLAB, COMSOL Multiphysics, Python (SciPy), and R.' },
    { question: 'Which industries hire us?', answer: 'Finance, biotech, environmental modelling, and defence.' },
    { question: 'Is there an internship?', answer: 'Optional placement with analytics or engineering firms.' }
  ]
},
{
  id: 'phd-mathematical-modeling',
  title: 'Ph.D. Mathematical Modeling',
  duration: '6 semesters/3 Years',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦4,200,000 total',
  image: imageMap['math'],
  description: 'Doctoral research in advanced mathematical and computational modelling.',
  requirements: [
    'M.Sc. in Mathematics or related field with CGPA ≥ 3.25/5.0'
  ],
  faqs: [
    { question: 'Research topics?', answer: 'Nonlinear dynamics, stochastic modelling, multiscale simulations.' },
    { question: 'Computational support?', answer: 'Access to university HPC cluster and MATLAB/COMSOL licences.' },
    { question: 'Publication targets?', answer: 'Two journal papers in Scopus-indexed outlets before defence.' }
  ]
},
{
  id: 'pgd-petroleum-energy-resources-engineering',
  title: 'PGD Petroleum & Energy Resources Engineering',
  duration: '2 semesters/1 Year',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦1,200,000 total',
  image: imageMap['petroleum-engineering'],
  description: 'Bridging diploma for graduates entering the petroleum and energy sector.',
  requirements: [
    'Second Class Lower in Physical Sciences, Engineering, or Computer Science'
  ],
  faqs: [
    { question: 'What fundamentals are covered?', answer: 'Reservoir basics, drilling principles, and petroleum economics.' },
    { question: 'How is practical training delivered?', answer: 'Field visits to producing wells and short courses at DPR-accredited centres.' },
    { question: 'What’s next after completion?', answer: 'Direct entry into the M.Sc. programme upon meeting CGPA requirements.' }
  ]
},
{
  id: 'msc-petroleum-energy-resources-engineering',
  title: 'M.Sc. Petroleum & Energy Resources Engineering',
  duration: '3 semesters/1.5 Years',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦1,800,000 total',
  image: imageMap['petroleum-engineering'],
  description: 'Reservoir engineering, production optimisation, and energy economics.',
  requirements: [
    'B.Eng./B.Tech. with CGPA ≥ 2.78/5.0 in Petroleum, Chemical, or related Engineering'
  ],
  faqs: [
    { question: 'Which software will I master?', answer: 'Petrel, Eclipse, CMG-GEM, Prosper, and PIPESIM.' },
    { question: 'Is industry attachment mandatory?', answer: 'Yes—a 12-week placement with an oil company in the Niger Delta.' },
    { question: 'Is it COREN-accredited?', answer: 'Yes—the curriculum aligns with COREN and SPE competency standards.' }
  ]
},
{
  id: 'phd-petroleum-energy-resources-engineering',
  title: 'Ph.D. Petroleum & Energy Resources Engineering',
  duration: '6 semesters/3 Years',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦4,200,000 total',
  image: imageMap['petroleum-engineering'],
  description: 'Doctoral research in enhanced oil recovery and sustainable energy resources.',
  requirements: [
    'M.Sc. in Petroleum Engineering or related field with CGPA ≥ 3.25/5.0'
  ],
  faqs: [
    { question: 'What research areas are available?', answer: 'EOR, digital oilfields, carbon capture & storage, reservoir simulation.' },
    { question: 'How is research funded?', answer: 'Through TETFund, industry-sponsored chairs, and Chevron/Total grants.' },
    { question: 'What outputs are expected?', answer: 'Two peer-reviewed papers and one conference presentation prior to defence.' }
  ]
},
{
  id: 'mpa-public-administration',
  title: 'MPA Public Administration',
  duration: '2 semesters/1 Year',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦1,200,000 total',
  image: imageMap['public-admin'],
  description: 'Professional master’s on governance, public finance, and administrative ethics.',
  requirements: [
    'Any first degree with at least Second Class Lower'
  ],
  faqs: [
    { question: 'How is the capstone structured?', answer: 'A policy-analysis project done in partnership with an MDA or NGO.' },
    { question: 'Are there leadership workshops?', answer: 'Yes—executive seminars featuring senior civil-servants and industry experts.' },
    { question: 'What career impact?', answer: 'Enhances promotion prospects and leadership roles in public service.' }
  ]
},
{
  id: 'mpp-public-policy',
  title: 'MPP Public Policy',
  duration: '2 semesters/1 Year',
  level: 'Postgraduate',
  category: 'postgraduate',
  schoolFees: '₦1,200,000 total',
  image: imageMap['policy'],
  description: 'Practice-focused master’s in policy design, analysis, and advocacy.',
  requirements: [
    'First degree or HND + PGD in any discipline'
  ],
  faqs: [
    { question: 'What are policy labs?', answer: 'Simulated public-hearings, bill drafting, and impact assessment exercises.' },
    { question: 'Any consultancy projects?', answer: 'Yes—teams work on real briefs from NGOs and MDAs aligned with SDGs.' },
    { question: 'Certifications offered?', answer: 'Prepares you for IPPA’s Certified Policy Analyst (CPA) credential.' }
  ]
}


]; 