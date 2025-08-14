import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, CheckCircle2, AlertCircle, Check, User, MapPin, Phone, Mail, FileCheck, Camera, Award, Calendar, Building2, Save } from "lucide-react";
import MediaPreviewDialog from "@/components/MediaPreviewDialog";
import { toast } from "sonner";
import { getCurrentAcademicSession } from "@/utils/academicSession";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import apiService from "@/services/api";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import PaymentModal from "@/components/PaymentModal";
import { useAuth } from "@/contexts/AuthContext";

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
  // Additional properties for application status
  submitted?: boolean;
  exam_type_1?: string;
  exam_type_2?: string;
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
    hearAboutUs?: string;
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
  value: File | File[] | string | null;
  onChange: (files: File[] | null) => void;
  onRemove: () => void;
  maxSize?: string;
  multiple?: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasFiles = value && (Array.isArray(value) ? value.length > 0 : true);
  
  // Extract filename from URL
  const getFileNameFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop() || 'document.pdf';
      return decodeURIComponent(filename);
    } catch {
      return 'document.pdf';
    }
  };

  // Check if the value is a URL (from backend) or a File object
  const isUrl = typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://') || value.includes('cloudinary.com'));
  const isFile = value instanceof File || (Array.isArray(value) && value.length > 0 && value[0] instanceof File);
  
  // Check if File object has originalPath (URL from backend)
  const getOriginalPath = (file: File) => {
    return (file as any).originalPath || null;
  };
  
  const hasOriginalPath = isFile && (
    Array.isArray(value) 
      ? value.length > 0 && getOriginalPath(value[0])
      : getOriginalPath(value as File)
  );
  
  const originalPath = hasOriginalPath ? (
    Array.isArray(value) 
      ? getOriginalPath(value[0])
      : getOriginalPath(value as File)
  ) : null;
  
  // Determine if the file is a PDF (either File or URL)
  const isPdf = (isFile && ((Array.isArray(value) ? value[0] : value)?.type === 'application/pdf')) ||
    (isUrl && value.toLowerCase().endsWith('.pdf')) ||
    (hasOriginalPath && originalPath?.toLowerCase().endsWith('.pdf'));

  const fileNames = hasFiles 
    ? Array.isArray(value) 
      ? value.map(f => f.name).join(", ") 
      : value instanceof File 
        ? value.name 
        : isUrl 
          ? getFileNameFromUrl(value)
          : ""
    : "";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    if (multiple) {
      onChange(files);
    } else {
      onChange(files[0] ? [files[0]] : null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleContainerClick = () => {
    if (!hasFiles) {
      fileInputRef.current?.click();
    }
  };

  return (
    <>
    <div className="space-y-2">
      <Label>{label}</Label>
      <div 
        className={`border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer ${
          isPdf ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-blue-500 bg-white dark:bg-slate-800'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleContainerClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          accept={accept}
          onChange={handleFileChange}
          multiple={multiple}
          className="hidden"
        />
        
        {hasFiles ? (
          <div className="flex flex-col items-center">
            {isUrl ? (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPreviewUrl(value as string); }}
                className="text-green-700 dark:text-green-300 underline break-all text-sm text-center hover:text-green-900"
                title={value as string}
              >
                {getFileNameFromUrl(value as string)}
              </button>
            ) : hasOriginalPath ? (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPreviewUrl(originalPath as string); }}
                className="text-green-700 dark:text-green-300 underline break-all text-sm text-center hover:text-green-900"
                title={originalPath as string}
              >
                {getFileNameFromUrl(originalPath as string)}
              </button>
            ) : (
              <span className="text-sm text-gray-800 text-center">{fileNames}</span>
            )}
            {(isUrl || hasOriginalPath) && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPreviewUrl((isUrl ? (value as string) : (originalPath as string)) as string); }}
                className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:text-blue-200 dark:hover:bg-slate-600 text-xs transition-colors"
              >
                View previously uploaded
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="mt-2 p-1 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-red-600" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <Upload className="h-8 w-8 text-gray-600" />
            <span className="mt-2 text-sm text-gray-800 text-center">
              Click to upload {label}
            </span>
            <span className="mt-1 text-xs text-gray-700 text-center">
              Accepted formats: {accept.split(',').map(type => type.replace('.', '').toUpperCase()).join(', ')} (Max: {maxSize})
            </span>
          </div>
        )}
      </div>
    </div>
    {previewUrl && (
      <MediaPreviewDialog url={previewUrl} open={!!previewUrl} onOpenChange={(o) => !o && setPreviewUrl(null)} title={getFileNameFromUrl(previewUrl)} />
    )}
    </>
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
  
  // Construct full URL for the original path
  const fullUrl = filePath.startsWith('http') || filePath.includes('cloudinary.com') ? filePath : `https://admissions-jcvy.onrender.com/${filePath}`;
  
  // Add the original path as a custom property
  Object.defineProperty(placeholderFile, 'originalPath', {
    value: fullUrl,
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
      // Add exam type
      formData.append(`exam_type_${examNumber}`, examType);
      
      // Add exam number
      if (examData.examNumber) {
        formData.append(`exam_number_${examNumber}`, examData.examNumber);
      }
      
      // Add exam year
      if (examData.examYear) {
        formData.append(`exam_year_${examNumber}`, examData.examYear);
      }
      
      // Add subjects
      if (examData.subjects && examData.subjects.length > 0) {
        const validSubjects = examData.subjects.filter(s => s.subject && s.grade);
        const subjectsJson = JSON.stringify(validSubjects);
        formData.append(`subjects_${examNumber}`, subjectsJson);
      }
      
      // Add document
      if (examData.documents) {
        formData.append(`exam_type_${examNumber}_result`, examData.documents);
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
  }
  
  return formData;
}

// Update the autofillFromApplication function to correctly set selected exams
const autofillFromApplication = (application: any, prev: UndergraduateFormData): UndergraduateFormData => {
  // console.log('Autofilling from application:', application);
  
  // Set selected exams based on exam types
  const selectedExams = [];
  if (application.exam_type_1) selectedExams.push(application.exam_type_1);
  if (application.exam_type_2) selectedExams.push(application.exam_type_2);
  
  // console.log('Selected exams for autofill:', selectedExams);

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
  const { user } = useAuth();
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
          
          // Check if the application is already submitted
          if (application.submitted === true) {
            // If already submitted, redirect to success page
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
          setSelectedExams(selectedExams);
          
          setUndergraduateData(prev => autofillFromApplication(application, prev));
        }
      }
    } catch (error) {
      console.error('Error processing stored application data:', error);
    }
  }, []);

  // Set user email from context when user data is available
  useEffect(() => {
    if (user?.email) {
      setUndergraduateData(prev => ({
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          email: user.email
        }
      }));
    }
  }, [user]);

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
      hearAboutUs: "",
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

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('applicationData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.applications && parsedData.applications.length > 0) {
          const application = parsedData.applications[0];
          setApplicationData(application);
          setUndergraduateData(prev => autofillFromApplication(application, prev));
        }
      }
    } catch (error) {
      // Handle error silently
    }
  }, []);

  // Add beforeunload event listener for auto-save
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Auto-save functionality will be added later when handleSaveAsDraft is defined
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [undergraduateData]);

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

  const handleAutoSave = () => {
    // Auto-save after a short delay to avoid too many API calls
    setTimeout(() => {
      // Check if there's any meaningful data to save
      const hasPersonalData = Object.values(undergraduateData.personalDetails).some(value => 
        value && (typeof value === 'string' ? value.trim() !== '' : true)
      );
      const hasExamData = selectedExams.length > 0;
      
      if (hasPersonalData || hasExamData) {
        handleSaveAsDraft();
      }
    }, 2000);
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
    
    // Check declaration first
    if (declaration !== "true") {
      toast.error("Please agree to the declaration before proceeding");
      return false;
    }
    // Check academic session
    if (!undergraduateData.academicSession) {
      toast.error("Please select an academic session");
      return false;
    }
    
    // Check personal details with specific error messages
    if (!personalDetails.surname) {
      toast.error("Please enter your surname");
      return false;
    }
    
    if (!personalDetails.firstName) {
      toast.error("Please enter your first name");
      return false;
    }
    
    if (!personalDetails.gender) {
      toast.error("Please select your gender");
      return false;
    }
    
    // Check date of birth fields
    if (!personalDetails.dateOfBirth.day || !personalDetails.dateOfBirth.month || !personalDetails.dateOfBirth.year) {
      toast.error("Please enter your complete date of birth");
      return false;
    }
    
    if (!personalDetails.streetAddress) {
      toast.error("Please enter your street address");
      return false;
    }
    
    if (!personalDetails.city) {
      toast.error("Please enter your city");
      return false;
    }
    
    if (!personalDetails.country) {
      toast.error("Please select your country");
      return false;
    }
    
    // Make state of origin required only for Nigerian applicants
    if (personalDetails.nationality === 'Nigeria' && !personalDetails.stateOfOrigin) {
      toast.error("Please select your state of origin");
      return false;
    }
    
    if (!personalDetails.nationality) {
      toast.error("Please select your nationality");
      return false;
    }
    
    if (!personalDetails.phoneNumber) {
      toast.error("Please enter your phone number");
      return false;
    }
    
    if (!personalDetails.email) {
      toast.error("Please enter your email address");
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(personalDetails.email)) {
      toast.error("Please enter a valid email address");
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
    
    if (!firstExam || !firstExam.examNumber) {
      toast.error(`Please enter your ${firstExamType.toUpperCase()} exam number`);
      return false;
    }
    
    if (!firstExam || !firstExam.examYear) {
      toast.error(`Please select your ${firstExamType.toUpperCase()} exam year`);
      return false;
    }
    
    if (!firstExam || !firstExam.subjects || firstExam.subjects.length === 0) {
      toast.error(`Please enter at least one subject for your selected ${firstExamType ? firstExamType.toUpperCase() : ''} result`);
      return false;
    }
    // JAMB fields are only required for Nigerian applicants
    if (personalDetails.nationality === 'Nigeria') {
      if (!academicQualifications.jambResults.regNumber || 
          !academicQualifications.jambResults.examYear || 
          !academicQualifications.jambResults.score) {
        toast.error("Please fill in all required JAMB fields");
        return false;
      }
    }
    
    // Check if all subjects have both subject and grade
    const incompleteSubjects = firstExam.subjects.some(s => !s.subject || !s.grade);
    if (incompleteSubjects) {
      toast.error(`Please complete all subject entries for ${firstExamType.toUpperCase()} results`);
      return false;
    }
    
    // Check O'level exam documents
    if (!firstExam.documents) {
      toast.error(`Please upload your ${firstExamType.toUpperCase()} result document`);
      return false;
    }
    
    // Check JAMB fields with specific messages
    if (!academicQualifications.jambResults.regNumber) {
      toast.error("Please enter your JAMB registration number");
      return false;
    }
    
    if (!academicQualifications.jambResults.examYear) {
      toast.error("Please select your JAMB exam year");
      return false;
    }
    
    if (!academicQualifications.jambResults.score) {
      toast.error("Please enter your JAMB score");
      return false;
    }
    
    // Check JAMB documents
    if (!academicQualifications.jambResults.documents) {
      toast.error("Please upload your JAMB result document");
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
      // Payment processing handled by parent component
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
      // Payment processing handled by parent component
    }
  };

  const [selectedExams, setSelectedExams] = useState<string[]>([]);

  // Update the handleExamSelection function to ensure it's working correctly
  const handleExamSelection = (examType: string) => {
    const allowedExams = ['waec', 'neco', 'nabteb'];
    const examTypeLower = examType.toLowerCase();
    
    if (!allowedExams.includes(examTypeLower)) return;
    
    setSelectedExams(prev => {
      // console.log('Current selected exams:', prev);
      // console.log('Toggling exam:', examTypeLower);
      
      if (prev.includes(examTypeLower)) {
        // Remove the exam
        const newSelectedExams = prev.filter(type => type !== examTypeLower);
        // console.log('New selected exams after removal:', newSelectedExams);
        return newSelectedExams;
      }
      
      if (prev.length >= 2) {
        toast.error("You can only select a maximum of 2 exam results");
        return prev;
      }
      
      // Add the exam
      const newSelectedExams = [...prev, examTypeLower];
      // console.log('New selected exams after addition:', newSelectedExams);
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
    
    // Validate the form without showing the generic message
    if (!isFormValid()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = buildUndergraduateFormData(undergraduateData);
      formData.append('is_draft', 'false');
      formData.append('submitted', 'true');
      
      const response = await apiService.submitUndergraduateApplication(formData);
      
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

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Check for submitted application and redirect if needed
  useEffect(() => {
    if (applicationData?.submitted) {
      // console.log('Found submitted application, redirecting to success page');
      navigate('/application-success');
    }
  }, [applicationData, navigate]);

  useEffect(() => {
    // Load real application data if available
    if (applicationData) {
      // console.log('Loading application data:', applicationData);
      
      if (applicationData.submitted) {
        // console.log('Application is already submitted, redirecting to success page');
        navigate('/application-success');
        return;
      }
      
      // Set selected exams from application data
      const updatedSelectedExams: string[] = [];
      if (applicationData.exam_type_1) updatedSelectedExams.push(applicationData.exam_type_1);
      if (applicationData.exam_type_2) updatedSelectedExams.push(applicationData.exam_type_2);
      
      // console.log('Setting selected exams to:', updatedSelectedExams);
      setSelectedExams(updatedSelectedExams);
      
      // More initialization logic...
    }
  }, [applicationData, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
      {/* Accessibility quick controls for forms */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">Make this form easier to read</div>
        <div className="flex items-center gap-2">
          <button type="button" className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Decrease text size" onClick={() => {
            const html = document.documentElement; const current = parseFloat(getComputedStyle(html).getPropertyValue('--a11y-scale') || '1'); html.style.setProperty('--a11y-scale', String(Math.max(0.875, Math.min(1.5, current - 0.125))));
          }}>A-</button>
          <button type="button" className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Reset text size" onClick={() => {
            document.documentElement.style.setProperty('--a11y-scale', '1');
          }}>Reset</button>
          <button type="button" className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Increase text size" onClick={() => {
            const html = document.documentElement; const current = parseFloat(getComputedStyle(html).getPropertyValue('--a11y-scale') || '1'); html.style.setProperty('--a11y-scale', String(Math.max(0.875, Math.min(1.5, current + 0.125))));
          }}>A+</button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Gen-Z style helper banner */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900/60">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#FF5500]/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9v4m0 4h.01M21 12c0 4.971-4.029 9-9 9s-9-4.029-9-9 4.029-9 9-9 9 4.029 9 9z" stroke="#FF5500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="text-sm sm:text-base text-gray-700 dark:text-gray-200">
              Quick tip: Tackle one section at a time. You can save and finish later. You got this!
            </div>
          </div>
        </div>
        {/* JAMB Notice */}
            <div className="bg-white dark:bg-gray-900/60 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-orange-100 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Important JAMB Notice</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Requirements for undergraduate applicants</p>
                </div>
              </div>
              
          <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-200">
              The African University of Science and Technology (AUST) requires all undergraduate applicants to:
            </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>Register for JAMB UTME/DE examination</li>
              <li>Select AUST as your first choice institution</li>
              <li>Take the JAMB examination</li>
              <li>Meet the minimum cutoff mark (140 for {academicYear})</li>
              <li>Receive admission from JAMB</li>
              <li>Complete this application form</li>
            </ol>
                <div className="mt-4 sm:mt-6">
              <a 
                href="https://efacility.jamb.gov.ng/" 
                target="_blank" 
                rel="noopener noreferrer"
                    className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium text-sm sm:text-base"
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
            <div className="bg-white dark:bg-gray-900/60 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 bg-amber-100 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Personal Details</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Enter your personal information</p>
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          Surname
                      <span className="text-red-500 text-xs">*</span>
        </Label>
        <Input 
          id="surname" 
          value={undergraduateData.personalDetails.surname} 
          onChange={(e) => handlePersonalDetailsChange('surname', e.target.value)}
                      onBlur={handleAutoSave}
                      className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
        />
      </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          First Name
                      <span className="text-red-500 text-xs">*</span>
        </Label>
        <Input 
          id="firstName" 
          value={undergraduateData.personalDetails.firstName} 
          onChange={(e) => handlePersonalDetailsChange('firstName', e.target.value)}
                      onBlur={handleAutoSave}
                      className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
        />
      </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Other Names</Label>
                            <Input 
                      id="otherNames" 
                      value={undergraduateData.personalDetails.otherNames} 
                      onChange={(e) => handlePersonalDetailsChange('otherNames', e.target.value)}
                      onBlur={handleAutoSave}
                      className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
                    />
      </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          Academic Session
                      <span className="text-red-500 text-xs">*</span>
        </Label>
        <Select
          value={undergraduateData.academicSession}
          onValueChange={(value) => setUndergraduateData(prev => ({ ...prev, academicSession: value }))}
        >
                      <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          Course of Study
                      <span className="text-red-500 text-xs">*</span>
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
        >
                      <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          Gender
                      <span className="text-red-500 text-xs">*</span>
        </Label>
                              <Select 
                        value={undergraduateData.personalDetails.gender} 
                        onValueChange={(value) => {
                          handlePersonalDetailsChange('gender', value);
                          setTimeout(handleAutoSave, 100);
                        }}
                        required
                      >
                      <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          Date of Birth
                      <span className="text-red-500 text-xs">*</span>
        </Label>
                    <div className="grid grid-cols-3 gap-4">
          <Select 
            value={undergraduateData.personalDetails.dateOfBirth.day} 
            onValueChange={(value) => handleDateChange('dateOfBirth', 'day', value)}
            required
          >
                        <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                        <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                        <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          Nationality
                      <span className="text-red-500 text-xs">*</span>
        </Label>
                              <Select 
                        value={undergraduateData.personalDetails.nationality} 
                        onValueChange={(value) => {
                          handlePersonalDetailsChange('nationality', value);
                          setTimeout(handleAutoSave, 100);
                        }}
                        required
                      >
                      <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            State of Origin
                        <span className="text-red-500 text-xs">*</span>
          </Label>
                                <Select 
                        value={undergraduateData.personalDetails.stateOfOrigin} 
                        onValueChange={(value) => {
                          handlePersonalDetailsChange('stateOfOrigin', value);
                          setTimeout(handleAutoSave, 100);
                        }}
                        required
                      >
                        <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
          Phone Number
        </Label>
        <PhoneInput
          international
          defaultCountry="NG"
          value={undergraduateData.personalDetails.phoneNumber}
          onChange={(value) => handlePersonalDetailsChange("phoneNumber", value || "")}
          className="phone-input-field"
          placeholder="Enter phone number"
        />
      </div>

                              <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Email
                <span className="text-red-500 text-xs">*</span>
              </Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={undergraduateData.personalDetails.email}
                readOnly
                className="h-12 px-4 border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed transition-all duration-200 text-base"
                required
              />
            </div>
    </div>

                <div className="space-y-3">
                  <Label htmlFor="streetAddress" className="text-sm font-medium text-gray-700 flex items-center gap-2">
        Street Address
                    <span className="text-red-500 text-xs">*</span>
      </Label>
                            <Textarea
                        id="streetAddress"
                        value={undergraduateData.personalDetails.streetAddress}
                        onChange={(e) => handlePersonalDetailsChange("streetAddress", e.target.value)}
                        onBlur={handleAutoSave}
                        className="min-h-[48px] px-4 py-3 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base resize-none"
                        required
                      />
    </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      City
                      <span className="text-red-500 text-xs">*</span>
        </Label>
                              <Input
                        id="city"
                        value={undergraduateData.personalDetails.city}
                        onChange={(e) => handlePersonalDetailsChange("city", e.target.value)}
                        onBlur={handleAutoSave}
                        className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
                        required
                      />
      </div>
                  <div className="space-y-3">
                    <Label htmlFor="country" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          Country
                      <span className="text-red-500 text-xs">*</span>
        </Label>
        <Select
          value={undergraduateData.personalDetails.country}
          onValueChange={(value) => handlePersonalDetailsChange("country", value)}
        >
                      <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        Do you have any disabilities?
                    <span className="text-red-500 text-xs">*</span>
      </Label>
      <Select
        value={undergraduateData.personalDetails.hasDisabilities}
        onValueChange={(value) => handlePersonalDetailsChange("hasDisabilities", value)}
        required
      >
                    <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes</SelectItem>
          <SelectItem value="No">No</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {undergraduateData.personalDetails.hasDisabilities === "Yes" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      Disability Description
                      <span className="text-red-500 text-xs">*</span>
                    </Label>
        <Textarea
          placeholder="Describe your disabilities"
          value={undergraduateData.personalDetails.disabilityDescription}
          onChange={(e) => handlePersonalDetailsChange("disabilityDescription", e.target.value)}
                      className="min-h-[48px] px-4 py-3 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base resize-none"
                      required
        />
      </div>
    )}
  </div>
</div>

      {/* Academic Qualifications Section */}
            <div className="bg-white dark:bg-gray-900/60 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-amber-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Academic Qualifications</h3>
                  <p className="text-gray-600 dark:text-gray-300">Enter your examination results</p>
                </div>
              </div>
              
              <div className="space-y-8">
          {/* O'Level Results */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">O'Level Results</h4>
                    <span className="text-red-500 text-xs">*</span>
                  </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Please select a maximum of two exam results for submission</p>
            
            {/* WAEC Results */}
                  <div className="space-y-6 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="waec"
                  checked={selectedExams.includes('waec')}
                  onChange={() => handleExamSelection('waec')}
                        className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                    <Label htmlFor="waec" className="text-base font-medium text-gray-900 dark:text-white">WAEC Results</Label>
              </div>
              
              {selectedExams.includes('waec') && (
                <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        Exam Number
                              <span className="text-red-500 text-xs">*</span>
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
                              className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
                        required
                      />
                    </div>
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        Exam Year
                              <span className="text-red-500 text-xs">*</span>
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
                              <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                      <span className="text-red-500 text-xs">*</span>
                    </h5>
                    {undergraduateData.academicQualifications.waecResults.subjects.map((subject, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject</Label>
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
                            <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Grade</Label>
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
                            <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                      className="px-4 py-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      Add Subject
                    </Button>
                  </div>

                  <FileUploadField
                    id="waecDocuments"
                    label={
                      <div className="flex items-center gap-2">
                        Upload WAEC Results
                        <span className="text-red-500 text-xs">*</span>
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
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        Exam Number
                        <span className="text-red-500 text-xs">*</span>
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
                        className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        Exam Year
                        <span className="text-red-500 text-xs">*</span>
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
                        <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                      <span className="text-red-500 text-xs">*</span>
                    </h5>
                    {undergraduateData.academicQualifications.necoResults.subjects.map((subject, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject</Label>
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
                            <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Grade</Label>
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
                            <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                      className="px-4 py-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
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
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        Exam Number
                        <span className="text-red-500 text-xs">*</span>
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
                        className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        Exam Year
                        <span className="text-red-500 text-xs">*</span>
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
                        <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                      <span className="text-red-500 text-xs">*</span>
                    </h5>
                    {undergraduateData.academicQualifications.nabtebResults.subjects.map((subject, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject</Label>
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
                            <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Grade</Label>
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
                            <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                      className="px-4 py-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
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
              <span className="text-red-500 text-xs">*</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Registration Number
                  <span className="text-red-500 text-xs">*</span>
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
                  className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  JAMB Score
                  <span className="text-red-500 text-xs">*</span>
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
                  className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Exam Year
                  <span className="text-red-500 text-xs">*</span>
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
                  <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
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
                  <span className="text-red-500 text-xs">*</span>
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

      {/* How did you hear about us - at the end */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">How did you hear about us?</Label>
          <Select
            value={undergraduateData.personalDetails.hearAboutUs || ''}
            onValueChange={(value) => handlePersonalDetailsChange('hearAboutUs', value)}
          >
            <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google">Google Search</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="twitter">Twitter/X</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="friend">Friend/Family</SelectItem>
              <SelectItem value="alumni">Alumni</SelectItem>
              <SelectItem value="agent">Student Recruitment Agent</SelectItem>
              <SelectItem value="school">School Counselor/Teacher</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Declaration Section */}
            <div className="bg-white dark:bg-gray-900/60 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <FileCheck className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    Declaration
                    <span className="text-red-500 text-xs">*</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">Confirm your application details</p>
                </div>
              </div>
              
        <div className="space-y-4">
          <div className="alert-warning">
            <div className="alert-content">
              <div className="flex items-start gap-3">
                <AlertCircle className="alert-icon text-amber-600" />
                <div className="flex-1">
                  <h4 className="alert-title">Important Declaration</h4>
                  <div className="alert-message space-y-2">
                    <p>By clicking the checkbox below, I confirm that the information I have provided in this form is true, complete and accurate, and no information or other material information has been omitted. I acknowledge that knowingly providing false information gives AUST the right to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Cancel my application</li>
                      <li>If admitted, be dismissed from the University</li>
                      <li>If degree already awarded, rescind degree awarded</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
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
            <label htmlFor="declaration" className="text-sm text-gray-900 dark:text-white">
              I hereby declare that all the information provided in this application is true and accurate to the best of my knowledge.
            </label>
          </div>
        </div>
      </div>
      
            {/* Form Actions */}
            <div className="bg-white dark:bg-gray-900/60 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="text-center lg:text-left">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Ready to Submit?</h3>
                  <p className="text-gray-600 text-sm md:text-base">Review your information and submit your application</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full lg:w-auto">
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveAsDraft}
          disabled={isProcessingPayment || isSaving}
                    className="w-full sm:w-auto px-6 md:px-8 py-3 rounded-xl border-gray-300 hover:bg-gray-50 transition-all duration-200"
        >
          {isSaving ? (
            <span className="flex items-center justify-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-600 mr-2"></span>
              Saving...
            </span>
          ) : (
                      <span className="flex items-center justify-center">
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </span>
          )}
        </Button>
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto px-6 md:px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all duration-200"
                    disabled={isSubmitting || isSaving}
                  >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                        Submitting...
            </span>
          ) : (
                      <span className="flex items-center justify-center">
                        <Check className="h-4 w-4 mr-2" />
                        Submit Application
                      </span>
          )}
        </Button>
                </div>
              </div>
      </div>
    </form>
        </div>
      </div>
);
};

export default UndergraduateForm; 