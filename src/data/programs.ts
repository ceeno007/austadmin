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
import foundationScienceImg from "@/assets/images/jupeb-science.jpg";

export interface Program {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  category: 'foundation' | 'jupeb' | 'direct-entry';
  requirements: string[];
  pdf?: string;
  schoolFees?: string;
}

export const programs: Program[] = [
  {
    id: 'software-eng',
    title: "B.Sc. Software Engineering",
    duration: "4 years",
    level: "Undergraduate",
    category: 'direct-entry',
    schoolFees: "₦2,212,727 per session",
    image: softwareEngineeringImg,
    description: "Focus on software development methodologies, tools, and systems design.",
    requirements: [
      "Five SSC credits including English, Mathematics, Physics/Data Processing",
      "UTME Subjects: Mathematics, Physics, and one other Science subject",
      "JAMB score of 200+"
    ],
    pdf: "/pdfs/Departmental Handbook - Software Engineering [Undergraduate].pdf"
  },
  {
    id: 'computer-science',
    title: "B.Sc. Computer Science",
    duration: "4 years",
    level: "Undergraduate",
    category: 'direct-entry',
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
    id: 'foundation-science',
    title: "Foundation Science Program",
    duration: "1 year",
    level: "Foundation",
    category: 'foundation',
    image: foundationScienceImg,
    description: "Prepare for undergraduate studies in science and engineering fields.",
    requirements: [
      "Five SSC credits including English, Mathematics, and relevant Science subjects",
      "Minimum age of 16 years",
      "Completed secondary education"
    ]
  },
  {
    id: 'jupeb-science',
    title: "JUPEB Science Program",
    duration: "1 year",
    level: "JUPEB",
    category: 'jupeb',
    image: jupebScienceImg,
    description: "Advanced preparation for direct entry into 200 level university programs.",
    requirements: [
      "Five SSC credits including English, Mathematics, and relevant Science subjects",
      "Minimum age of 16 years",
      "Completed secondary education"
    ]
  }
]; 