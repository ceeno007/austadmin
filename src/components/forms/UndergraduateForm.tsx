import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, CheckCircle2, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { getCurrentAcademicSession } from "@/utils/academicSession";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import apiService from "@/services/api";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import PaymentModal from "@/components/PaymentModal";

interface DocumentField {
  id: string;
  label: string;
  required: boolean;
  file: File | null;
}

interface DateField {
  day: string;
  month: string;
  year: string;
}
const nigeriaStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
    "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
    "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
    "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
  ];
interface ApplicationData {
  academic_session?: string;
  selected_program?: string;
  program_type?: string;
  surname?: string;
  first_name?: string;
  other_names?: string;
  gender?: string;
  date_of_birth?: string;
  street_address?: string;
  city?: string;
  country?: string;
  state_of_origin?: string;
  nationality?: string;
  phone_number?: string;
  email?: string;
  has_disability?: boolean;
  disability_description?: string;
  blood_group?: string;
  jamb_reg_number?: string;
  jamb_score?: string;
  jamb_year?: string;
  exam_number?: string;
  exam_year?: string;
  exam_type?: string;
  subjects?: string;
  passport_photo_path?: string;
  payment_receipt_path?: string;
  waec_result_path?: string;
  jamb_result_path?: string;
  other_qualifications_path?: string;
}

interface ExamResults {
  examNumber: string;
  examYear: string;
  subjects: Array<{
    subject: string;
    grade: string;
  }>;
  documents: File | null;
}

interface UndergraduateFormData {
  passportPhoto: File | null;
  academicSession: string;
  program: string;
  selectedCourse: string;
  personalDetails: {
    surname: string;
    firstName: string;
    otherNames: string;
    gender: string;
    dateOfBirth: DateField;
    streetAddress: string;
    city: string;
    country: string;
    stateOfOrigin: string;
    nationality: string;
    phoneNumber: string;
    email: string;
    hasDisabilities: string;
    disabilityDescription: string;
    bloodGroup?: string;
  };
  academicQualifications: {
    waecResults: ExamResults;
    necoResults: ExamResults;
    nabtebResults: ExamResults;
    jambResults: {
      regNumber: string;
      examYear: string;
      score: string;
      documents: File | null;
    };
  };
  declaration: string;
  programChoice?: {
    program: string;
    subjectCombination: string;
    firstChoice: {
      university: string;
      department: string;
      faculty: string;
    };
    secondChoice: {
      university: string;
      department: string;
      faculty: string;
    };
  };
}

const FileUploadField = ({ 
  id, 
  label, 
  accept, 
  value, 
  onChange, 
  onRemove, 
  maxSize = "10MB",
  multiple = false 
}: { 
  id: string;
  label: React.ReactNode;
  accept: string;
  value: File | File[] | null;
  onChange: (files: File[] | null) => void;
  onRemove: () => void;
  maxSize?: string;
  multiple?: boolean;
}) => {
  const hasFiles = value && (Array.isArray(value) ? value.length > 0 : true);
  const fileNames = hasFiles 
    ? Array.isArray(value) 
      ? value.map(f => f.name).join(", ") 
      : (value as File).name
    : "";

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
        hasFiles ? 'border-green-500 bg-green-50' : 'border-gray-300'
      }`}>
        <input
          type="file"
          id={id}
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            onChange(multiple ? files : files[0] ? [files[0]] : null);
          }}
        />
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center w-full cursor-pointer"
        >
          {hasFiles ? (
            <div className="flex items-center justify-center w-full gap-2">
              <span className="text-sm text-green-800 text-center">{fileNames}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onRemove();
                }}
                className="p-1 hover:bg-green-100 rounded-full ml-2"
              >
                <X className="h-4 w-4 text-green-600" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-600 text-center">
                Click to upload {label}
              </span>
              <span className="mt-1 text-xs text-gray-500 text-center">
                Accepted formats: {accept.split(',').map(type => type.replace('.', '').toUpperCase()).join(', ')} (Max: {maxSize})
              </span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman",
  "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// Add SSCE subjects array
const sscEsubjects = [
  "English Language",
  "Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "Agricultural Science",
  "Animal Husbandry",
  "Arabic",
  "Art",
  "Auto Mechanics",
  "Basic Electricity",
  "Book Keeping",
  "Building Construction",
  "Civic Education",
  "Commerce",
  "Computer Studies",
  "Crop Husbandry",
  "Data Processing",
  "Economics",
  "Electronics",
  "Financial Accounting",
  "Food and Nutrition",
  "French",
  "Further Mathematics",
  "Geography",
  "Government",
  "Hausa",
  "Health Education",
  "History",
  "Home Management",
  "Igbo",
  "Insurance",
  "Islamic Studies",
  "Literature in English",
  "Marketing",
  "Metal Work",
  "Music",
  "Office Practice",
  "Physical Education",
  "Principles of Cost Accounting",
  "Religious Studies",
  "Technical Drawing",
  "Typewriting",
  "Woodwork",
  "Yoruba"
];

// Helper function to create a placeholder file from a file path
const createPlaceholderFile = (filePath: string | undefined): File | null => {
  if (!filePath) return null;
  
  // Extract the original filename from the path
  const fileNameMatch = filePath.match(/[^\\\/]+$/);
  const fileName = fileNameMatch ? fileNameMatch[0] : "uploaded-file.png";
  
  // Create an empty file with the extracted name
  // Using a 1x1 px transparent GIF as minimal content
  const base64Data = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const byteCharacters = atob(base64Data);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  // Determine mime type from filename
  let mimeType = 'application/octet-stream';
  if (fileName.endsWith('.png')) mimeType = 'image/png';
  else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) mimeType = 'image/jpeg';
  else if (fileName.endsWith('.pdf')) mimeType = 'application/pdf';
  else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) mimeType = 'application/msword';
  
  // Create the file object
  const placeholderFile = new File(byteArrays, fileName, { type: mimeType });
  
  // Add the original path as a custom property
  Object.defineProperty(placeholderFile, 'originalPath', {
    value: filePath,
    writable: false
  });
  
  return placeholderFile;
};

const undergraduatePrograms = [
  "B.Eng. Civil Engineering",
  "B.Eng. Materials & Metallurgical Engineering",
  "B.Eng. Mechanical Engineering",
  "B.Eng. Petroleum and Energy Resources Engineering",
  "B.Sc. Accounting",
  "B.Sc. Business Administration",
  "B.Sc. Computer Science",
  "B.Sc. Software Engineering"
].sort();

/**
 * Form Data Structure for Backend Submission
 * 
 * Personal Details:
 * {
 *   surname: string,
 *   first_name: string,
 *   other_names: string,
 *   gender: string,
 *   date_of_birth: string (YYYY-MM-DD),
 *   street_address: string,
 *   city: string,
 *   country: string,
 *   state_of_origin: string,
 *   nationality: string,
 *   phone_number: string,
 *   email: string,
 *   has_disability: boolean,
 *   disability_description: string,
 *   blood_group: string
 * }
 * 
 * Academic Qualifications:
 * {
 *   // O'Level Results (WAEC/NECO/NABTEB)
 *   o_level_results: {
 *     exam_type: string, // 'waec', 'neco', or 'nabteb'
 *     exam_number: string,
 *     exam_year: string,
 *     subjects: Array<{
 *       subject: string,
 *       grade: string
 *     }>,
 *     result_document: File // PDF/Image of result
 *   }[],
 * 
 *   // JAMB Results
 *   jamb_results: {
 *     registration_number: string,
 *     exam_year: string,
 *     score: number,
 *     result_document: File // PDF/Image of result
 *   }
 * }
 * 
 * Documents:
 * {
 *   passport_photo: File, // JPEG/PNG
 *   payment_receipt: File // PDF/Image of payment receipt
 * }
 */

interface DraftResponse {
  id: string;
  status: string;
  message: string;
  created_at: string;
  updated_at: string;
  application_details: {
    academic_session: string;
    program_type: string;
    personal_details: {
      surname: string;
      first_name: string;
      other_names: string;
      gender: string;
      date_of_birth: string;
      street_address: string;
      city: string;
      country: string;
      state_of_origin: string;
      nationality: string;
      phone_number: string;
      email: string;
      has_disability: boolean;
      disability_description: string;
      blood_group: string;
    };
    academic_qualifications: {
      o_level: {
        exam_type: string;
        exam_number: string;
        exam_year: string;
        subjects: Array<{
          subject: string;
          grade: string;
        }>;
      };
      jamb: {
        registration_number: string;
        exam_year: string;
        score: string;
      };
    };
    course_preferences: {
      first_choice: string;
      second_choice: string;
    };
    documents: {
      passport_photo: string;
      birth_certificate: string;
      state_of_origin_certificate: string;
      payment_receipt: string;
      o_level_result: string;
      jamb_result: string;
    };
  };
}

interface UndergraduateFormProps {
  onPayment: (amount: number, email: string, metadata: Record<string, any>) => Promise<void>;
  isProcessingPayment: boolean;
}

// Utility to generate years from current year to 1960
function getYearOptions() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 1960; y--) {
    years.push(y);
  }
  return years;
}

// Define a type for our request body
interface UndergraduateRequestBody {
  program_type: string;
  applicant_type: string;
  selected_program?: string;
  academic_session?: string;
  surname?: string;
  first_name?: string;
  other_names?: string;
  gender?: string;
  date_of_birth?: string;
  nationality?: string;
  state_of_origin?: string;
  street_address?: string;
  city?: string;
  country?: string;
  phone_number?: string;
  email?: string;
  has_disability: boolean;
  disability_description?: string;
  exam_type_1?: string;
  exam_number_1?: string;
  exam_year_1?: number;
  subjects_1?: Array<{subject: string; grade: string}>;
  exam_type_2?: string;
  exam_number_2?: string;
  exam_year_2?: number;
  subjects_2?: Array<{subject: string; grade: string}> | null;
  jamb_reg_number?: string;
  jamb_year?: number;
  jamb_score?: number;
  submitted?: boolean;
}

// Helper function to create a request body for the API
function buildUndergraduateFormData(data) {
  console.log('Building form data with raw data:', data);
  console.log('Selected exams:', data.selectedExams);
  
  // Create a FormData object directly
  const formData = new FormData();
  
  // Basic Information
  formData.append('program_type', 'undergraduate');
  formData.append('applicant_type', 'fresh');
  
  // Only append if values exist
  if (data.selectedCourse) {
    formData.append('selected_program', data.selectedCourse);
  }
  
  if (data.academicSession) {
    formData.append('academic_session', data.academicSession);
  }

  // Personal details
  if (data.personalDetails.surname) {
    formData.append('surname', data.personalDetails.surname);
  }
  
  if (data.personalDetails.firstName) {
    formData.append('first_name', data.personalDetails.firstName);
  }
  
  if (data.personalDetails.otherNames) {
    formData.append('other_names', data.personalDetails.otherNames);
  }
  
  if (data.personalDetails.gender) {
    formData.append('gender', data.personalDetails.gender);
  }
  
  // Date of birth
  if (data.personalDetails.dateOfBirth.year && data.personalDetails.dateOfBirth.month && data.personalDetails.dateOfBirth.day) {
    const date = new Date(
      parseInt(data.personalDetails.dateOfBirth.year),
      parseInt(data.personalDetails.dateOfBirth.month) - 1,
      parseInt(data.personalDetails.dateOfBirth.day)
    );
    formData.append('date_of_birth', date.toISOString());
  }
  
  // Contact info
  if (data.personalDetails.nationality) {
    formData.append('nationality', data.personalDetails.nationality);
  }
  
  if (data.personalDetails.stateOfOrigin) {
    formData.append('state_of_origin', data.personalDetails.stateOfOrigin);
  }
  
  if (data.personalDetails.streetAddress) {
    formData.append('street_address', data.personalDetails.streetAddress);
  }
  
  if (data.personalDetails.city) {
    formData.append('city', data.personalDetails.city);
  }
  
  if (data.personalDetails.country) {
    formData.append('country', data.personalDetails.country);
  }
  
  if (data.personalDetails.phoneNumber) {
    formData.append('phone_number', data.personalDetails.phoneNumber);
  }
  
  if (data.personalDetails.email) {
    formData.append('email', data.personalDetails.email);
  }
  
  // Disability
  formData.append('has_disability', data.personalDetails.hasDisabilities === 'yes' ? 'true' : 'false');
  
  if (data.personalDetails.hasDisabilities === 'yes' && data.personalDetails.disabilityDescription) {
    formData.append('disability_description', data.personalDetails.disabilityDescription);
  }
  
  // Handle Exam Types - Search for filled data regardless of selectedExams
  // Check if we have WAEC data
  let examNumber = 1;
  
  // Check each exam type for filled data
  const examTypes = ['waec', 'neco', 'nabteb'];
  for (const examType of examTypes) {
    const examData = data.academicQualifications[`${examType}Results`];
    
    // Check if this exam has data (even if not in selectedExams)
    const hasData = examData && (
      examData.examNumber || 
      examData.examYear || 
      (examData.subjects && examData.subjects.length > 0) ||
      examData.documents
    );
    
    if (hasData) {
      console.log(`Found ${examType} data:`, examData);
      
      // Add exam type
      formData.append(`exam_type_${examNumber}`, examType);
      console.log(`Added exam_type_${examNumber}: ${examType}`);
      
      // Add exam number
      if (examData.examNumber) {
        formData.append(`exam_number_${examNumber}`, examData.examNumber);
        console.log(`Added exam_number_${examNumber}: ${examData.examNumber}`);
      }
      
      // Add exam year
      if (examData.examYear) {
        formData.append(`exam_year_${examNumber}`, examData.examYear);
        console.log(`Added exam_year_${examNumber}: ${examData.examYear}`);
      }
      
      // Add subjects
      if (examData.subjects && examData.subjects.length > 0) {
        const validSubjects = examData.subjects.filter(s => s.subject && s.grade);
        const subjectsJson = JSON.stringify(validSubjects);
        formData.append(`subjects_${examNumber}`, subjectsJson);
        console.log(`Added subjects_${examNumber}: ${subjectsJson}`);
      }
      
      // Add document
      if (examData.documents) {
        formData.append(`exam_type_${examNumber}_result`, examData.documents);
        console.log(`Added exam_type_${examNumber}_result: ${examData.documents.name}`);
      }
      
      // Only process max 2 exams
      examNumber++;
      if (examNumber > 2) break;
    }
  }
  
  // JAMB results
  const jambResults = data.academicQualifications.jambResults;
  if (jambResults?.regNumber) {
    formData.append('jamb_reg_number', jambResults.regNumber);
  }
  
  if (jambResults?.examYear) {
    const year = parseInt(jambResults.examYear);
    if (!isNaN(year)) {
      formData.append('jamb_year', year.toString());
    } else {
      formData.append('jamb_year', '0');
    }
  } else {
    formData.append('jamb_year', '0');
  }
  
  if (jambResults?.score) {
    const score = parseInt(jambResults.score);
    if (!isNaN(score)) {
      formData.append('jamb_score', score.toString());
    } else {
      formData.append('jamb_score', '0');
    }
  } else {
    formData.append('jamb_score', '0');
  }
  
  // Add JAMB results document
  if (jambResults?.documents) {
    formData.append('jamb_result', jambResults.documents);
    console.log('Added JAMB result document:', jambResults.documents.name);
  }
  
  // Add passport photo
  if (data.passportPhoto) {
    formData.append('passport_photo', data.passportPhoto);
    console.log('Added passport photo:', data.passportPhoto.name);
  }
  
  // Log all form data entries
  console.log('Final form data entries:');
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}: [File: ${value.name}]`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }
  
  return formData;
}

// Update the autofillFromApplication function to correctly set selected exams
const autofillFromApplication = (application: any, prev: UndergraduateFormData): UndergraduateFormData => {
  console.log('Autofilling from application:', application);
  
  // Set selected exams based on exam types
  const selectedExams = [];
  if (application.exam_type_1) selectedExams.push(application.exam_type_1);
  if (application.exam_type_2) selectedExams.push(application.exam_type_2);
  
  console.log('Selected exams for autofill:', selectedExams);

  // Safely parse subjects
  let subjects1 = [];
  let subjects2 = [];
  try {
    if (application.subjects_1 && typeof application.subjects_1 === 'string') {
      subjects1 = JSON.parse(application.subjects_1);
    } else if (Array.isArray(application.subjects_1)) {
      subjects1 = application.subjects_1;
    }
    
    if (application.subjects_2 && typeof application.subjects_2 === 'string') {
      subjects2 = JSON.parse(application.subjects_2);
    } else if (Array.isArray(application.subjects_2)) {
      subjects2 = application.subjects_2;
    }
  } catch (error) {
    console.error('Error parsing subjects:', error);
  }

  return {
    ...prev,
    academicSession: application.academic_session || prev.academicSession,
    selectedCourse: application.selected_program || prev.selectedCourse,
    programChoice: application.selected_program ? {
      program: application.selected_program,
      subjectCombination: application.selected_program,
      firstChoice: {
        university: "AUST",
        department: application.selected_program,
        faculty: application.selected_program.split('.')[0]
      },
      secondChoice: {
        university: "AUST",
        department: application.selected_program,
        faculty: application.selected_program.split('.')[0]
      }
    } : prev.programChoice,
    personalDetails: {
      ...prev.personalDetails,
      surname: application.surname || prev.personalDetails.surname,
      firstName: application.first_name || prev.personalDetails.firstName,
      otherNames: application.other_names || prev.personalDetails.otherNames,
      gender: application.gender || prev.personalDetails.gender,
      dateOfBirth: application.date_of_birth ? {
        year: new Date(application.date_of_birth).getFullYear().toString(),
        month: (new Date(application.date_of_birth).getMonth() + 1).toString().padStart(2, '0'),
        day: new Date(application.date_of_birth).getDate().toString().padStart(2, '0')
      } : prev.personalDetails.dateOfBirth,
      streetAddress: application.street_address || prev.personalDetails.streetAddress,
      city: application.city || prev.personalDetails.city,
      country: application.country || prev.personalDetails.country,
      stateOfOrigin: application.state_of_origin || prev.personalDetails.stateOfOrigin,
      nationality: application.nationality || prev.personalDetails.nationality,
      phoneNumber: application.phone_number || prev.personalDetails.phoneNumber,
      email: application.email || prev.personalDetails.email,
      hasDisabilities: application.has_disability ? "yes" : "no",
      disabilityDescription: application.disability_description || prev.personalDetails.disabilityDescription
    },
    academicQualifications: {
      ...prev.academicQualifications,
      waecResults: application.exam_type_1 === 'waec' ? {
        examNumber: application.exam_number_1 || '',
        examYear: application.exam_year_1?.toString() || '',
        subjects: subjects1,
        documents: application.exam_type_1_result_path ? createPlaceholderFile(application.exam_type_1_result_path) : null
      } : prev.academicQualifications.waecResults,
      necoResults: application.exam_type_1 === 'neco' ? {
        examNumber: application.exam_number_1 || '',
        examYear: application.exam_year_1?.toString() || '',
        subjects: subjects1,
        documents: application.exam_type_1_result_path ? createPlaceholderFile(application.exam_type_1_result_path) : null
      } : (application.exam_type_2 === 'neco' ? {
        examNumber: application.exam_number_2 || '',
        examYear: application.exam_year_2?.toString() || '',
        subjects: subjects2,
        documents: application.exam_type_2_result_path ? createPlaceholderFile(application.exam_type_2_result_path) : null
      } : prev.academicQualifications.necoResults),
      nabtebResults: application.exam_type_1 === 'nabteb' ? {
        examNumber: application.exam_number_1 || '',
        examYear: application.exam_year_1?.toString() || '',
        subjects: subjects1,
        documents: application.exam_type_1_result_path ? createPlaceholderFile(application.exam_type_1_result_path) : null
      } : (application.exam_type_2 === 'nabteb' ? {
        examNumber: application.exam_number_2 || '',
        examYear: application.exam_year_2?.toString() || '',
        subjects: subjects2,
        documents: application.exam_type_2_result_path ? createPlaceholderFile(application.exam_type_2_result_path) : null
      } : prev.academicQualifications.nabtebResults),
      jambResults: {
        regNumber: application.jamb_reg_number || '',
        examYear: application.jamb_year?.toString() || '',
        score: application.jamb_score?.toString() || '',
        documents: application.jamb_result_path ? createPlaceholderFile(application.jamb_result_path) : null
      }
    },
    passportPhoto: application.passport_photo_path ? createPlaceholderFile(application.passport_photo_path) : null,
    declaration: application.submitted ? "true" : prev.declaration
  };
};

// Utility function to check application status and redirect if needed
export const checkApplicationStatusAndRedirect = (authResponse: any) => {
  try {
    // Check if there's an application in the response
    if (authResponse?.applications?.length > 0) {
      const application = authResponse.applications[0];
      
      // If the application is already submitted, redirect to success page
      if (application.submitted === true) {
        console.log('Found submitted application, redirecting to success page');
        
        // Store the application data for reference on the success page
        localStorage.setItem('applicationData', JSON.stringify(authResponse));
        
        // Show success notification
        toast.success("You have an existing application!", {
          description: "Redirecting to your application status...",
          duration: 2000,
          style: {
            background: '#10B981',
            color: 'white',
            border: 'none',
          },
          icon: <CheckCircle2 className="h-5 w-5" />
        });
        
        // Redirect to application success page after a short delay
        setTimeout(() => {
          window.location.href = '/application-success';
        }, 2000);
        
        return true; // Indicate that redirection is happening
      }
    }
    
    // No submitted application found
    return false;
  } catch (error) {
    console.error('Error checking application status:', error);
    return false;
  }
};

const UndergraduateForm = ({ onPayment, isProcessingPayment }: UndergraduateFormProps) => {
  const navigate = useNavigate();
  // Get application data from localStorage if available
  const [applicationData, setApplicationData] = useState<ApplicationData>({});
  
  // Get current year for cutoff mark
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const academicYear = `${currentYear}/${nextYear}`;

  // Generate years from current year down to 1960 for year dropdowns
  const years = Array.from({ length: currentYear - 1960 + 1 }, (_, i) => currentYear - i);

  // Add state for showing payment selection modal
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);

  // Update the useEffect to properly set selected exams and check application status
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('applicationData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.applications && parsedData.applications.length > 0) {
          const application = parsedData.applications[0];
          console.log('Loading application data:', application);
          
          // Check if the application is already submitted
          if (application.submitted === true) {
            // If already submitted, redirect to success page
            console.log('Application is already submitted, redirecting to success page');
            toast.success("You have an existing submitted application", {
              description: "Redirecting to application status...",
              duration: 2000,
            });
            
            setTimeout(() => {
              window.location.href = '/application-success';
            }, 2000);
            
            return;
          }
          
          // If not submitted, continue with form initialization
          setApplicationData(application);
          
          // Set selected exams based on exam types
          const selectedExams = [];
          if (application.exam_type_1) selectedExams.push(application.exam_type_1);
          if (application.exam_type_2) selectedExams.push(application.exam_type_2);
          console.log('Setting selected exams to:', selectedExams);
          setSelectedExams(selectedExams);
          
          setUndergraduateData(prev => autofillFromApplication(application, prev));
        }
      }
    } catch (error) {
      console.error('Error processing stored application data:', error);
    }
  }, []);

  const [undergraduateData, setUndergraduateData] = useState<UndergraduateFormData>({
    passportPhoto: null,
    academicSession: getCurrentAcademicSession(),
    program: "",
    selectedCourse: "",
    personalDetails: {
      surname: "",
      firstName: "",
      otherNames: "",
      gender: "",
      dateOfBirth: { day: "", month: "", year: "" },
      streetAddress: "",
      city: "",
      country: "Nigeria",
      stateOfOrigin: "",
      nationality: "Nigerian",
      phoneNumber: "",
      email: "",
      hasDisabilities: "no",
      disabilityDescription: "",
    },
    academicQualifications: {
      waecResults: {
        examNumber: "",
        examYear: "",
        subjects: [],
        documents: null
      },
      necoResults: {
        examNumber: "",
        examYear: "",
        subjects: [],
        documents: null
      },
      nabtebResults: {
        examNumber: "",
        examYear: "",
        subjects: [],
        documents: null
      },
      jambResults: {
        regNumber: "",
        examYear: "",
        score: "",
        documents: null
      }
    },
    declaration: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedExamType, setSelectedExamType] = useState<string>("waec");
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});

  // Replace the static years array with the dynamic one
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ ...copyStatus, [field]: true });
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [field]: false });
      }, 2000);
    } catch (err) {
      // Handle error silently
    }
  };

  const handleFileUpload = (fieldId: string, file: File) => {
    setUndergraduateData((prev) => ({
      ...prev,
      passportPhoto: file
    }));
    
    toast.success("File uploaded successfully", {
      description: `${file.name} has been uploaded.`,
      style: {
        background: '#10B981', // Green background
        color: 'white',
      }
    });
  };

  const handleClearFile = (fieldId: string) => {
    setUndergraduateData((prev) => ({
      ...prev,
      passportPhoto: null
    }));
    
    toast.info("File removed", {
      description: "The file has been removed.",
      style: {
        background: '#3B82F6', // Blue background
        color: 'white',
      }
    });
  };

  const handlePersonalDetailsChange = (field: string, value: string) => {
    setUndergraduateData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value
      }
    }));
  };

  const handleDateChange = (field: string, type: "day" | "month" | "year", value: string) => {
    setUndergraduateData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        dateOfBirth: {
          ...prev.personalDetails.dateOfBirth,
          [type]: value
        }
      }
    }));
  };

  const isFormValid = () => {
    const { personalDetails, academicQualifications, declaration } = undergraduateData;
    if (declaration !== "true") {
      toast.error("Please agree to the declaration before proceeding");
      return false;
    }
    if (!personalDetails.surname || !personalDetails.firstName || !personalDetails.gender || 
        !personalDetails.dateOfBirth.day || !personalDetails.dateOfBirth.month || !personalDetails.dateOfBirth.year ||
        !personalDetails.streetAddress || !personalDetails.city || !personalDetails.stateOfOrigin ||
        !personalDetails.phoneNumber || !personalDetails.email) {
      toast.error("Please fill in all required personal details fields");
      return false;
    }
    // Only require at least one exam result
    if (selectedExams.length < 1) {
      toast.error("Please select at least one O'Level exam result (WAEC, NECO, or NABTEB)");
      return false;
    }
    // Only require at least one subject for the first selected exam
    const firstExamType = selectedExams[0];
    const firstExam = academicQualifications[`${firstExamType}Results`];
    if (!firstExam || !firstExam.subjects || firstExam.subjects.length === 0) {
      toast.error(`Please enter at least one subject for your selected ${firstExamType ? firstExamType.toUpperCase() : ''} result`);
      return false;
    }
    if (!academicQualifications.jambResults.regNumber || 
        !academicQualifications.jambResults.examYear || 
        !academicQualifications.jambResults.score) {
      toast.error("Please fill in all required JAMB fields");
      return false;
    }
    return true;
  };

  // Add state for tracking draft status
  const [isDraft, setIsDraft] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);

  const handleSaveAsDraft = async () => {
    try {
      setIsSaving(true);
      const formData = buildUndergraduateFormData(undergraduateData);
      formData.append('is_draft', 'true');
      
      const response = await apiService.submitUndergraduateApplication(formData);
      
      // Check if the application is marked as submitted
      if (response?.applications?.[0]?.submitted === true) {
        // If submitted, redirect to success page
        toast.success("Application submitted successfully!", {
          duration: 2000,
          style: {
            background: '#10B981',
            color: 'white',
            border: 'none',
          },
          icon: <CheckCircle2 className="h-5 w-5" />
        });
        
        // Save to localStorage for reference
        localStorage.setItem('applicationData', JSON.stringify(response));
        
        // Redirect to success page after toast is shown
        setTimeout(() => {
          window.location.href = '/application-success';
        }, 2000);
        
        return;
      }
      
      // If not submitted, show the draft saved notification
      toast.success("Draft saved successfully!", {
        description: "Your application has been saved as a draft and can be completed later.",
        duration: 4000,
        style: {
          background: '#10B981', // Green background
          color: 'white',
          border: 'none',
        },
        icon: <CheckCircle2 className="h-5 w-5" />
      });
      
      // Store response data
      if (response) {
        // Save to localStorage for later retrieval
        localStorage.setItem('applicationData', JSON.stringify(response));
        
        // Set draft ID if available
        if (response.applications?.[0]?.id) {
          setDraftId(response.applications[0].id);
        }
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save draft", {
        duration: 4000,
        style: {
          background: '#EF4444', // Red background
          color: 'white',
          border: 'none',
        },
        icon: <AlertCircle className="h-5 w-5" />
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleProceedToPayment = async () => {
    try {
      setIsProcessingPaymentState(true);
      const formData = buildUndergraduateFormData(undergraduateData);
      formData.append('is_draft', 'false');
      
      const response = await apiService.submitUndergraduateApplication(formData);
      
      // Check if user has already paid
      if (response.applications?.[0]?.has_paid) {
        // If paid, redirect to success page
        navigate('/success', { 
          state: { 
            applicationId: response.applications[0].id,
            programType: 'undergraduate'
          }
        });
      } else {
        // If not paid, show payment modal
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit application");
    } finally {
      setIsProcessingPaymentState(false);
    }
  };

  const [selectedExams, setSelectedExams] = useState<string[]>([]);

  // Update the handleExamSelection function to ensure it's working correctly
  const handleExamSelection = (examType: string) => {
    const allowedExams = ['waec', 'neco', 'nabteb'];
    const examTypeLower = examType.toLowerCase();
    
    if (!allowedExams.includes(examTypeLower)) return;
    
    setSelectedExams(prev => {
      console.log('Current selected exams:', prev);
      console.log('Toggling exam:', examTypeLower);
      
      if (prev.includes(examTypeLower)) {
        // Remove the exam
        const newSelectedExams = prev.filter(type => type !== examTypeLower);
        console.log('New selected exams after removal:', newSelectedExams);
        return newSelectedExams;
      }
      
      if (prev.length >= 2) {
        toast.error("You can only select a maximum of 2 exam results");
        return prev;
      }
      
      // Add the exam
      const newSelectedExams = [...prev, examTypeLower];
      console.log('New selected exams after addition:', newSelectedExams);
      return newSelectedExams;
    });
  };

  const handlePaymentAsNigerian = async () => {
    const amount = 20000; // ₦20,000 in kobo
    const email = undergraduateData.personalDetails.email;
    const metadata = {
      program_type: "undergraduate",
      academic_session: undergraduateData.academicSession,
      selected_course: undergraduateData.selectedCourse,
      residence: "nigerian"
    };

    await onPayment(amount, email, metadata);
  };

  const handlePaymentAsInternational = async () => {
    const amount = 50 * 100; // $50 in cents
    const email = undergraduateData.personalDetails.email;
    const metadata = {
      program_type: "undergraduate",
      academic_session: undergraduateData.academicSession,
      selected_course: undergraduateData.selectedCourse,
      residence: "international"
    };

    await onPayment(amount, email, metadata);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = buildUndergraduateFormData(undergraduateData);
      formData.append('is_draft', 'false');
      formData.append('submitted', 'true');
      
      console.log('Final form data before submission:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? '[File: ' + value.name + ']' : value}`);
      }
      
      console.log('Making API call to submit application...');
      const response = await apiService.submitUndergraduateApplication(formData);
      console.log('API Response:', response);
      
      // Store the response in localStorage
      localStorage.setItem('applicationData', JSON.stringify(response));
      
      // Add a small delay to ensure data is saved
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Always show success and redirect - we're setting submitted=true in the request
      toast.success("Application submitted successfully!");
      
      // Use setTimeout to ensure the toast is shown before navigation
      setTimeout(() => {
        // Make sure to use the correct path with leading slash
        window.location.href = '/application-success';
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isProcessingPaymentState, setIsProcessingPaymentState] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* JAMB Notice */}
        <div className="space-y-6 rounded-lg border-2 border-dashed border-orange-500 p-6 bg-orange-50">
          <h3 className="text-lg font-semibold text-orange-700">Important JAMB Notice</h3>
          <div className="space-y-4">
            <p className="text-orange-700">
              The African University of Science and Technology (AUST) requires all undergraduate applicants to:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-orange-700">
              <li>Register for JAMB UTME/DE examination</li>
              <li>Select AUST as your first choice institution</li>
              <li>Take the JAMB examination</li>
              <li>Meet the minimum cutoff mark (140 for {academicYear})</li>
              <li>Receive admission from JAMB</li>
              <li>Complete this application form</li>
            </ol>
            <div className="mt-4">
              <a 
                href="https://efacility.jamb.gov.ng/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Visit JAMB Portal
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

{/* Personal Details Section */}
<div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
  <h3 className="text-lg font-semibold">Personal Details</h3>
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Surname
          <span className="text-red-500 text-xs italic">Required</span>
        </Label>
        <Input 
          id="surname" 
          value={undergraduateData.personalDetails.surname} 
          onChange={(e) => handlePersonalDetailsChange('surname', e.target.value)}
          required 
        />
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          First Name
          <span className="text-red-500 text-xs italic">Required</span>
        </Label>
        <Input 
          id="firstName" 
          value={undergraduateData.personalDetails.firstName} 
          onChange={(e) => handlePersonalDetailsChange('firstName', e.target.value)}
          required 
        />
      </div>
      <div className="space-y-2">
        <Label>Other Names</Label>
        <Input 
          id="otherNames" 
          value={undergraduateData.personalDetails.otherNames} 
          onChange={(e) => handlePersonalDetailsChange('otherNames', e.target.value)} 
        />
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Academic Session
          <span className="text-red-500 text-xs italic">Required</span>
        </Label>
        <Select
          value={undergraduateData.academicSession}
          onValueChange={(value) => setUndergraduateData(prev => ({ ...prev, academicSession: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select academic session" />
          </SelectTrigger>
          <SelectContent>
            {(() => {
              const currentYear = new Date().getFullYear();
              return [
                <SelectItem key={`${currentYear}/${currentYear+1}`} value={`${currentYear}/${currentYear+1}`}>
                  {`${currentYear}/${currentYear+1} Academic Session`}
                </SelectItem>,
                <SelectItem key={`${currentYear+1}/${currentYear+2}`} value={`${currentYear+1}/${currentYear+2}`}>
                  {`${currentYear+1}/${currentYear+2} Academic Session`}
                </SelectItem>
              ];
            })()}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Course of Study
          <span className="text-red-500 text-xs italic">Required</span>
        </Label>
        <Select 
          value={undergraduateData.selectedCourse} 
          onValueChange={(value) => setUndergraduateData(prev => ({
            ...prev,
            selectedCourse: value,
            programChoice: {
              program: value,
              subjectCombination: value,
              firstChoice: {
                university: "AUST",
                department: value,
                faculty: value.split('.')[0]
              },
              secondChoice: {
                university: "AUST",
                department: value,
                faculty: value.split('.')[0]
              }
            }
          }))}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your course" />
          </SelectTrigger>
          <SelectContent>
            {undergraduatePrograms.map((course) => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Gender
          <span className="text-red-500 text-xs italic">Required</span>
        </Label>
        <Select 
          value={undergraduateData.personalDetails.gender} 
          onValueChange={(value) => handlePersonalDetailsChange('gender', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Date of Birth
          <span className="text-red-500 text-xs italic">Required</span>
        </Label>
        <div className="grid grid-cols-3 gap-2">
          <Select 
            value={undergraduateData.personalDetails.dateOfBirth.day} 
            onValueChange={(value) => handleDateChange('dateOfBirth', 'day', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={undergraduateData.personalDetails.dateOfBirth.month} 
            onValueChange={(value) => handleDateChange('dateOfBirth', 'month', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={(index + 1).toString().padStart(2, '0')}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={undergraduateData.personalDetails.dateOfBirth.year} 
            onValueChange={(value) => handleDateChange('dateOfBirth', 'year', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Nationality
          <span className="text-red-500 text-xs italic">Required</span>
        </Label>
        <Select 
          value={undergraduateData.personalDetails.nationality} 
          onValueChange={(value) => handlePersonalDetailsChange('nationality', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select nationality" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {undergraduateData.personalDetails.nationality === 'Nigeria' && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            State of Origin
            <span className="text-red-500 text-xs italic">Required</span>
          </Label>
          <Select 
            value={undergraduateData.personalDetails.stateOfOrigin} 
            onValueChange={(value) => handlePersonalDetailsChange('stateOfOrigin', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {nigeriaStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Phone Number
          <span className="text-red-500 text-xs italic">Required</span>
        </Label>
        <PhoneInput
          international
          defaultCountry="NG"
          value={undergraduateData.personalDetails.phoneNumber}
          onChange={(value) => handlePersonalDetailsChange("phoneNumber", value || "")}
          className="!flex !items-center !gap-2 [&>input]:!flex-1 [&>input]:!h-10 [&>input]:!rounded-md [&>input]:!border [&>input]:!border-input [&>input]:!bg-background [&>input]:!px-3 [&>input]:!py-2 [&>input]:!text-sm [&>input]:!ring-offset-background [&>input]:!placeholder:text-muted-foreground [&>input]:!focus-visible:outline-none [&>input]:!focus-visible:ring-2 [&>input]:!focus-visible:ring-ring [&>input]:!focus-visible:ring-offset-2 [&>input]:!disabled:cursor-not-allowed [&>input]:!disabled:opacity-50"
          placeholder="Enter phone number"
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Email
          <span className="text-red-500 text-xs italic">Required</span>
        </Label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={undergraduateData.personalDetails.email}
          onChange={(e) => handlePersonalDetailsChange("email", e.target.value)}
          required
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="streetAddress" className="flex items-center gap-2">
        Street Address
        <span className="text-red-500 text-xs italic">Required</span>
      </Label>
      <Textarea
        id="streetAddress"
        value={undergraduateData.personalDetails.streetAddress}
        onChange={(e) => handlePersonalDetailsChange("streetAddress", e.target.value)}
        required
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="city" className="flex items-center gap-2">
          City
          <span className="text-red-500 text-xs italic">Required</span>
        </Label>
        <Input
          id="city"
          value={undergraduateData.personalDetails.city}
          onChange={(e) => handlePersonalDetailsChange("city", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country" className="flex items-center gap-2">
          Country
          <span className="text-red-500 text-xs italic">Required</span>
        </Label>
        <Select
          value={undergraduateData.personalDetails.country}
          onValueChange={(value) => handlePersonalDetailsChange("country", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        Do you have any disabilities?
        <span className="text-red-500 text-xs italic">Required</span>
      </Label>
      <Select
        value={undergraduateData.personalDetails.hasDisabilities}
        onValueChange={(value) => handlePersonalDetailsChange("hasDisabilities", value)}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes</SelectItem>
          <SelectItem value="No">No</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {undergraduateData.personalDetails.hasDisabilities === "Yes" && (
      <div className="space-y-2">
        <Label>Please specify your disabilities</Label>
        <Textarea
          placeholder="Describe your disabilities"
          value={undergraduateData.personalDetails.disabilityDescription}
          onChange={(e) => handlePersonalDetailsChange("disabilityDescription", e.target.value)}
        />
      </div>
    )}


  </div>
</div>

      {/* Academic Qualifications Section */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Academic Qualifications</h3>
        <div className="space-y-6">
          {/* O'Level Results */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              O'Level Results
              <span className="text-red-500 text-xs italic">Required</span>
            </h4>
            <p className="text-sm text-gray-600">Please select a maximum of two exam results for submission</p>
            
            {/* WAEC Results */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-md">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="waec"
                  checked={selectedExams.includes('waec')}
                  onChange={() => handleExamSelection('waec')}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="waec" className="font-medium">WAEC Results</Label>
              </div>
              
              {selectedExams.includes('waec') && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Exam Number
                        <span className="text-red-500 text-xs italic">Required</span>
                      </Label>
                      <Input
                        placeholder="Enter WAEC exam number"
                        value={undergraduateData.academicQualifications.waecResults.examNumber}
                        onChange={(e) => setUndergraduateData(prev => ({
                          ...prev,
                          academicQualifications: {
                            ...prev.academicQualifications,
                            waecResults: {
                              ...prev.academicQualifications.waecResults,
                              examNumber: e.target.value.toUpperCase()
                            }
                          }
                        }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Exam Year
                        <span className="text-red-500 text-xs italic">Required</span>
                      </Label>
                      <Select
                        value={undergraduateData.academicQualifications.waecResults.examYear}
                        onValueChange={(value) => setUndergraduateData(prev => ({
                          ...prev,
                          academicQualifications: {
                            ...prev.academicQualifications,
                            waecResults: {
                              ...prev.academicQualifications.waecResults,
                              examYear: value
                            }
                          }
                        }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {getYearOptions().map(year => (
                            <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* WAEC Subjects */}
                  <div className="space-y-4">
                    <h5 className="font-medium flex items-center gap-2">
                      Subjects and Grades
                      <span className="text-red-500 text-xs italic">Required</span>
                    </h5>
                    {undergraduateData.academicQualifications.waecResults.subjects.map((subject, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Subject</Label>
                          <Select
                            value={subject.subject}
                            onValueChange={(value) => {
                              const newSubjects = [...undergraduateData.academicQualifications.waecResults.subjects];
                              newSubjects[index] = { ...subject, subject: value };
                              setUndergraduateData(prev => ({
                                ...prev,
                                academicQualifications: {
                                  ...prev.academicQualifications,
                                  waecResults: {
                                    ...prev.academicQualifications.waecResults,
                                    subjects: newSubjects
                                  }
                                }
                              }));
                            }}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {sscEsubjects.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Grade</Label>
                          <Select
                            value={subject.grade}
                            onValueChange={(value) => {
                              const newSubjects = [...undergraduateData.academicQualifications.waecResults.subjects];
                              newSubjects[index] = { ...subject, grade: value };
                              setUndergraduateData(prev => ({
                                ...prev,
                                academicQualifications: {
                                  ...prev.academicQualifications,
                                  waecResults: {
                                    ...prev.academicQualifications.waecResults,
                                    subjects: newSubjects
                                  }
                                }
                              }));
                            }}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A1">A1</SelectItem>
                              <SelectItem value="B2">B2</SelectItem>
                              <SelectItem value="B3">B3</SelectItem>
                              <SelectItem value="C4">C4</SelectItem>
                              <SelectItem value="C5">C5</SelectItem>
                              <SelectItem value="C6">C6</SelectItem>
                              <SelectItem value="D7">D7</SelectItem>
                              <SelectItem value="E8">E8</SelectItem>
                              <SelectItem value="F9">F9</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setUndergraduateData(prev => ({
                          ...prev,
                          academicQualifications: {
                            ...prev.academicQualifications,
                            waecResults: {
                              ...prev.academicQualifications.waecResults,
                              subjects: [...prev.academicQualifications.waecResults.subjects, { subject: '', grade: '' }]
                            }
                          }
                        }));
                      }}
                    >
                      Add Subject
                    </Button>
                  </div>

                  <FileUploadField
                    id="waecDocuments"
                    label={
                      <div className="flex items-center gap-2">
                        Upload WAEC Results
                        <span className="text-red-500 text-xs italic">Required</span>
                      </div>
                    }
                    accept=".pdf,.jpg,.jpeg,.png"
                    value={undergraduateData.academicQualifications.waecResults.documents}
                    onChange={(files) => setUndergraduateData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        waecResults: {
                          ...prev.academicQualifications.waecResults,
                          documents: files ? files[0] : null
                        }
                      }
                    }))}
                    onRemove={() => setUndergraduateData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        waecResults: {
                          ...prev.academicQualifications.waecResults,
                          documents: null
                        }
                      }
                    }))}
                  />
                </>
              )}
            </div>

            {/* NECO Results */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-md">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="neco"
                  checked={selectedExams.includes('neco')}
                  onChange={() => handleExamSelection('neco')}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="neco" className="font-medium">NECO Results</Label>
              </div>
              
              {selectedExams.includes('neco') && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Exam Number
                        <span className="text-red-500 text-xs italic">Required</span>
                      </Label>
                      <Input
                        placeholder="Enter NECO exam number"
                        value={undergraduateData.academicQualifications.necoResults.examNumber}
                        onChange={(e) => setUndergraduateData(prev => ({
                          ...prev,
                          academicQualifications: {
                            ...prev.academicQualifications,
                            necoResults: {
                              ...prev.academicQualifications.necoResults,
                              examNumber: e.target.value.toUpperCase()
                            }
                          }
                        }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Exam Year
                        <span className="text-red-500 text-xs italic">Required</span>
                      </Label>
                      <Select
                        value={undergraduateData.academicQualifications.necoResults.examYear}
                        onValueChange={(value) => setUndergraduateData(prev => ({
                          ...prev,
                          academicQualifications: {
                            ...prev.academicQualifications,
                            necoResults: {
                              ...prev.academicQualifications.necoResults,
                              examYear: value
                            }
                          }
                        }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {getYearOptions().map(year => (
                            <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* NECO Subjects */}
                  <div className="space-y-4">
                    <h5 className="font-medium flex items-center gap-2">
                      Subjects and Grades
                      <span className="text-red-500 text-xs italic">Required</span>
                    </h5>
                    {undergraduateData.academicQualifications.necoResults.subjects.map((subject, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Subject</Label>
                          <Select
                            value={subject.subject}
                            onValueChange={(value) => {
                              const newSubjects = [...undergraduateData.academicQualifications.necoResults.subjects];
                              newSubjects[index] = { ...subject, subject: value };
                              setUndergraduateData(prev => ({
                                ...prev,
                                academicQualifications: {
                                  ...prev.academicQualifications,
                                  necoResults: {
                                    ...prev.academicQualifications.necoResults,
                                    subjects: newSubjects
                                  }
                                }
                              }));
                            }}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {sscEsubjects.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Grade</Label>
                          <Select
                            value={subject.grade}
                            onValueChange={(value) => {
                              const newSubjects = [...undergraduateData.academicQualifications.necoResults.subjects];
                              newSubjects[index] = { ...subject, grade: value };
                              setUndergraduateData(prev => ({
                                ...prev,
                                academicQualifications: {
                                  ...prev.academicQualifications,
                                  necoResults: {
                                    ...prev.academicQualifications.necoResults,
                                    subjects: newSubjects
                                  }
                                }
                              }));
                            }}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A1">A1</SelectItem>
                              <SelectItem value="B2">B2</SelectItem>
                              <SelectItem value="B3">B3</SelectItem>
                              <SelectItem value="C4">C4</SelectItem>
                              <SelectItem value="C5">C5</SelectItem>
                              <SelectItem value="C6">C6</SelectItem>
                              <SelectItem value="D7">D7</SelectItem>
                              <SelectItem value="E8">E8</SelectItem>
                              <SelectItem value="F9">F9</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setUndergraduateData(prev => ({
                          ...prev,
                          academicQualifications: {
                            ...prev.academicQualifications,
                            necoResults: {
                              ...prev.academicQualifications.necoResults,
                              subjects: [...prev.academicQualifications.necoResults.subjects, { subject: '', grade: '' }]
                            }
                          }
                        }));
                      }}
                    >
                      Add Subject
                    </Button>
                  </div>

                  <FileUploadField
                    id="necoDocuments"
                    label="Upload NECO Results"
                    accept=".pdf,.jpg,.jpeg,.png"
                    value={undergraduateData.academicQualifications.necoResults.documents}
                    onChange={(files) => setUndergraduateData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        necoResults: {
                          ...prev.academicQualifications.necoResults,
                          documents: files ? files[0] : null
                        }
                      }
                    }))}
                    onRemove={() => setUndergraduateData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        necoResults: {
                          ...prev.academicQualifications.necoResults,
                          documents: null
                        }
                      }
                    }))}
                  />
                </>
              )}
            </div>

            {/* NABTEB Results */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-md">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="nabteb"
                  checked={selectedExams.includes('nabteb')}
                  onChange={() => handleExamSelection('nabteb')}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="nabteb" className="font-medium">NABTEB Results</Label>
              </div>
              
              {selectedExams.includes('nabteb') && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Exam Number
                        <span className="text-red-500 text-xs italic">Required</span>
                      </Label>
                      <Input
                        placeholder="Enter NABTEB exam number"
                        value={undergraduateData.academicQualifications.nabtebResults.examNumber}
                        onChange={(e) => setUndergraduateData(prev => ({
                          ...prev,
                          academicQualifications: {
                            ...prev.academicQualifications,
                            nabtebResults: {
                              ...prev.academicQualifications.nabtebResults,
                              examNumber: e.target.value.toUpperCase()
                            }
                          }
                        }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Exam Year
                        <span className="text-red-500 text-xs italic">Required</span>
                      </Label>
                      <Select
                        value={undergraduateData.academicQualifications.nabtebResults.examYear}
                        onValueChange={(value) => setUndergraduateData(prev => ({
                          ...prev,
                          academicQualifications: {
                            ...prev.academicQualifications,
                            nabtebResults: {
                              ...prev.academicQualifications.nabtebResults,
                              examYear: value
                            }
                          }
                        }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {getYearOptions().map(year => (
                            <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* NABTEB Subjects */}
                  <div className="space-y-4">
                    <h5 className="font-medium flex items-center gap-2">
                      Subjects and Grades
                      <span className="text-red-500 text-xs italic">Required</span>
                    </h5>
                    {undergraduateData.academicQualifications.nabtebResults.subjects.map((subject, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Subject</Label>
                          <Select
                            value={subject.subject}
                            onValueChange={(value) => {
                              const newSubjects = [...undergraduateData.academicQualifications.nabtebResults.subjects];
                              newSubjects[index] = { ...subject, subject: value };
                              setUndergraduateData(prev => ({
                                ...prev,
                                academicQualifications: {
                                  ...prev.academicQualifications,
                                  nabtebResults: {
                                    ...prev.academicQualifications.nabtebResults,
                                    subjects: newSubjects
                                  }
                                }
                              }));
                            }}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {sscEsubjects.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Grade</Label>
                          <Select
                            value={subject.grade}
                            onValueChange={(value) => {
                              const newSubjects = [...undergraduateData.academicQualifications.nabtebResults.subjects];
                              newSubjects[index] = { ...subject, grade: value };
                              setUndergraduateData(prev => ({
                                ...prev,
                                academicQualifications: {
                                  ...prev.academicQualifications,
                                  nabtebResults: {
                                    ...prev.academicQualifications.nabtebResults,
                                    subjects: newSubjects
                                  }
                                }
                              }));
                            }}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A1">A1</SelectItem>
                              <SelectItem value="B2">B2</SelectItem>
                              <SelectItem value="B3">B3</SelectItem>
                              <SelectItem value="C4">C4</SelectItem>
                              <SelectItem value="C5">C5</SelectItem>
                              <SelectItem value="C6">C6</SelectItem>
                              <SelectItem value="D7">D7</SelectItem>
                              <SelectItem value="E8">E8</SelectItem>
                              <SelectItem value="F9">F9</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setUndergraduateData(prev => ({
                          ...prev,
                          academicQualifications: {
                            ...prev.academicQualifications,
                            nabtebResults: {
                              ...prev.academicQualifications.nabtebResults,
                              subjects: [...prev.academicQualifications.nabtebResults.subjects, { subject: '', grade: '' }]
                            }
                          }
                        }));
                      }}
                    >
                      Add Subject
                    </Button>
                  </div>

                  <FileUploadField
                    id="nabtebDocuments"
                    label="Upload NABTEB Results"
                    accept=".pdf,.jpg,.jpeg,.png"
                    value={undergraduateData.academicQualifications.nabtebResults.documents}
                    onChange={(files) => setUndergraduateData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        nabtebResults: {
                          ...prev.academicQualifications.nabtebResults,
                          documents: files ? files[0] : null
                        }
                      }
                    }))}
                    onRemove={() => setUndergraduateData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        nabtebResults: {
                          ...prev.academicQualifications.nabtebResults,
                          documents: null
                        }
                      }
                    }))}
                  />
                </>
              )}
            </div>
          </div>

          {/* JAMB Results - Now separate and compulsory */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              JAMB Results
              <span className="text-red-500 text-xs italic">Required</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Registration Number
                  <span className="text-red-500 text-xs italic">Required</span>
                </Label>
                <Input
                  placeholder="Enter JAMB registration number"
                  value={undergraduateData.academicQualifications.jambResults.regNumber}
                  onChange={(e) => setUndergraduateData(prev => ({
                    ...prev,
                    academicQualifications: {
                      ...prev.academicQualifications,
                      jambResults: {
                        ...prev.academicQualifications.jambResults,
                        regNumber: e.target.value.toUpperCase()
                      }
                    }
                  }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  JAMB Score
                  <span className="text-red-500 text-xs italic">Required</span>
                </Label>
                <Input
                  type="number"
                  placeholder="Enter JAMB score"
                  value={undergraduateData.academicQualifications.jambResults.score}
                  onChange={(e) => setUndergraduateData(prev => ({
                    ...prev,
                    academicQualifications: {
                      ...prev.academicQualifications,
                      jambResults: {
                        ...prev.academicQualifications.jambResults,
                        score: e.target.value
                      }
                    }
                  }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Exam Year
                  <span className="text-red-500 text-xs italic">Required</span>
                </Label>
                <Select
                  value={undergraduateData.academicQualifications.jambResults.examYear}
                  onValueChange={(value) => setUndergraduateData(prev => ({
                    ...prev,
                    academicQualifications: {
                      ...prev.academicQualifications,
                      jambResults: {
                        ...prev.academicQualifications.jambResults,
                        examYear: value
                      }
                    }
                  }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {getYearOptions().map(year => (
                      <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <FileUploadField
              id="jambDocuments"
              label={
                <div className="flex items-center gap-2">
                  Upload JAMB Results
                  <span className="text-red-500 text-xs italic">Required</span>
                </div>
              }
              accept=".pdf,.jpg,.jpeg,.png"
              value={undergraduateData.academicQualifications.jambResults.documents}
              onChange={(files) => setUndergraduateData(prev => ({
                ...prev,
                academicQualifications: {
                  ...prev.academicQualifications,
                  jambResults: {
                    ...prev.academicQualifications.jambResults,
                    documents: files ? files[0] : null
                  }
                }
              }))}
              onRemove={() => setUndergraduateData(prev => ({
                ...prev,
                academicQualifications: {
                  ...prev.academicQualifications,
                  jambResults: {
                    ...prev.academicQualifications.jambResults,
                    documents: null
                  }
                }
              }))}
            />
          </div>
        </div>
      </div>

      {/* Declaration Section */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Declaration</h3>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              By clicking the checkbox below, I confirm that the information I have provided in this form is true, complete and accurate, and no information or other material information has been omitted. I acknowledge that knowingly providing false information gives AUST the right to:
              <br />- cancel my application.
              <br />- if admitted, be dismissed from the University.
              <br />- if degree already awarded, rescind degree awarded.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="declaration"
              checked={undergraduateData.declaration === "true"}
              onChange={(e) => setUndergraduateData(prev => ({ 
                ...prev, 
                declaration: e.target.checked ? "true" : "" 
              }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required
            />
            <label htmlFor="declaration" className="text-sm text-gray-700">
              I hereby declare that all the information provided in this application is true and accurate to the best of my knowledge.
            </label>
          </div>
        </div>
      </div>
      
      {/* Form Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveAsDraft}
          disabled={isProcessingPayment || isSaving}
          className="w-32"
        >
          {isSaving ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#2563eb] mr-2"></span>
              Saving...
            </span>
          ) : (
            "Save as Draft"
          )}
        </Button>
        <Button type="submit" className="w-40 bg-primary" disabled={isSubmitting || isSaving}>
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#2563eb] mr-2"></span>Submitting...
            </span>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  </>
);
};

export default UndergraduateForm; 