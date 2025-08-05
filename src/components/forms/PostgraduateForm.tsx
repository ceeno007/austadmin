import React, { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Check, Search, Building2, CreditCard, FileCheck, User, Camera } from "lucide-react";
import { toast } from "sonner";
import { getCurrentAcademicSession } from "@/utils/academicSession";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import apiService from "@/services/api";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from 'react-router-dom';
import PaymentModal from "@/components/PaymentModal";
import SquadPaymentModal from "@/components/SquadPaymentModal";

interface DateField {
  day: string;
  month: string;
  year: string;
}

interface PostgraduateDocumentData {
  type: string;
  otherType?: string;
  grade: string;
  cgpa: string;
  subject: string;
  institution: string;
  startDate: DateField;
  endDate: DateField;
  degreeCertificate: File | null;
  transcript: File | null;
}

interface PostgraduateFormData {
  academicSession: string;
  programType: "Postgraduate Diploma/Taught Masters" | "MSc" | "PhD";
  program: string;
  applicantType: "Nigerian" | "International";
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
  };
  academicQualifications: {
    qualification1: PostgraduateDocumentData;
    qualification2: PostgraduateDocumentData;
    otherQualifications: File | null;
  };
  statementOfPurpose: File[];
  references: {
    referee1: {
      name: string;
      email: string;
    };
    referee2: {
      name: string;
      email: string;
    };
  };
  nationality: string;
  passportPhoto?: File;
  declaration: string;
  applicationFee?: File;
  paymentEvidence?: File;
}

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
  institution?: string;
  degree?: string;
  qualification_subject?: string;
  class_of_degree?: string;
  qualification_cgpa?: number;
  qualification_start_date?: string;
  qualification_end_date?: string;
  first_referee_name?: string;
  first_referee_email?: string;
  second_referee_name?: string;
  second_referee_email?: string;
  passport_photo_path?: string;
  first_degree_certificate_path?: string;
  first_degree_transcript_path?: string;
  second_degree?: string;
  second_class_of_degree?: string;
  second_qualification_cgpa?: number;
  second_qualification_subject?: string;
  second_institution?: string;
  second_qualification_start_date?: string;
  second_qualification_end_date?: string;
  second_degree_certificate_path?: string;
  second_degree_transcript_path?: string;
  statement_of_purpose_path?: string;
  recommendation_letters_paths?: string;
  has_paid?: boolean;
  id?: number;
  uuid?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: number;
  token_type?: string;
  user?: {
    email: string;
  };
}

const programs = {
  "MSc": [
    "Aerospace Engineering",
    "Applied Statistics",
    "Computer Science",
    "Energy Resources Engineering",
    "Geoinformatics and GIS",
    "Management of Information Technology",
    "Materials Science & Engineering",
    "Mathematical Modeling",
    "Petroleum Engineering",
    "Public Administration",
    "Public Policy",
    "Pure and Applied Mathematics",
    "Space Physics",
    "Systems Engineering",
    "Theoretical and Applied Physics"
  ].sort(),
  "PhD": [
    "Aerospace Engineering",
    "Computer Science",
    "Geoinformatics and GIS",
    "Materials Science & Engineering",
    "Petroleum Engineering",
    "Pure and Applied Mathematics",
    "Space Physics",
    "Systems Engineering",
    "Theoretical and Applied Physics"
  ].sort(),
  "Postgraduate Diploma/Taught Masters": [
    "Management of Information Technology",
    "Petroleum Engineering"
  ].sort()
};

interface FileUploadFieldProps {
  id: string;
  label: string | React.ReactNode;
  accept: string;
  value: File | File[] | string | null;
  onChange: (files: File[] | null) => void;
  onRemove: () => void;
  maxSize?: string;
  multiple?: boolean;
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
}: FileUploadFieldProps) => {
  const hasFiles = value && (Array.isArray(value) ? value.length > 0 : true);
  
  // Check if the value is a URL (from backend) or a File object
  const isUrl = typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));
  const isFile = value instanceof File || (Array.isArray(value) && value.length > 0 && value[0] instanceof File);
  
  const fileNames = hasFiles 
    ? Array.isArray(value) 
      ? value.map(f => f.name).join(", ") 
      : value instanceof File 
        ? value.name 
        : ""
    : "";

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

  const acceptedTypes = accept.split(',').map(type => 
    type.replace('.', '').toUpperCase()
  ).join(', ');

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
            onChange(files.length > 0 ? files : null);
          }}
        />
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center w-full cursor-pointer"
        >
          {hasFiles ? (
            <div className="flex items-center justify-center w-full gap-2">
              {isUrl ? (
                // Show URL as clickable link
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-800">
                    {getFileNameFromUrl(value as string)}
                  </span>
                  <a
                    href={value as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FileCheck className="h-3 w-3 mr-1" />
                    View PDF
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onRemove();
                    }}
                    className="p-1 hover:bg-green-100 rounded-full"
                  >
                    <X className="h-4 w-4 text-green-600" />
                  </button>
                </div>
              ) : isFile ? (
                // Show uploaded file
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-800">{fileNames}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onRemove();
                    }}
                    className="p-1 hover:bg-green-100 rounded-full"
                  >
                    <X className="h-4 w-4 text-green-600" />
                  </button>
                </div>
              ) : (
                // Fallback
                <span className="text-sm text-green-800">{fileNames}</span>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-600 text-center">
                Click to upload {typeof label === 'string' ? label : 'file'}
              </span>
              <span className="mt-1 text-xs text-gray-500 text-center">
                Accepted formats: {acceptedTypes} (Max: {maxSize})
              </span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

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

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde",
  "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
  "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
  "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
  "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara"
];

// Add interface for University
interface University {
  name: string;
  country: string;
  domains: string[];
  web_pages: string[];
}

interface PostgraduateFormProps {
  onPayment: (amount: number, email: string, metadata: Record<string, any>) => Promise<void>;
  isProcessingPayment: boolean;
}

// Helper to build FormData for postgraduate application with exact backend field names
function buildPostgraduateFormData(data: PostgraduateFormData): FormData {
  const formData = new FormData();
  const appendIfFilled = (key, value) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  };

  // Add these fields first
  appendIfFilled('academic_session', data.academicSession || '');
  appendIfFilled('selected_program', data.program || '');
  appendIfFilled('program_type', data.programType || '');

  appendIfFilled('state_of_origin', data.personalDetails.stateOfOrigin);
  appendIfFilled('gender', data.personalDetails.gender);
  appendIfFilled('has_disability', data.personalDetails.hasDisabilities === 'yes' ? 'true' : 'false');
  if (data.academicQualifications.qualification1.endDate && data.academicQualifications.qualification1.endDate.year && data.academicQualifications.qualification1.endDate.month && data.academicQualifications.qualification1.endDate.day) {
    appendIfFilled('qualification_end_date', `${data.academicQualifications.qualification1.endDate.year}-${data.academicQualifications.qualification1.endDate.month}-${data.academicQualifications.qualification1.endDate.day}`);
  }
  appendIfFilled('second_class_of_degree', data.academicQualifications.qualification2?.grade);
  appendIfFilled('qualification_cgpa', data.academicQualifications.qualification1.cgpa);
  if (data.passportPhoto && !data.passportPhoto.name.includes('http')) {
    formData.append('passport_photo', data.passportPhoto);
  }
  if (data.academicQualifications.qualification2?.startDate && data.academicQualifications.qualification2.startDate.year && data.academicQualifications.qualification2.startDate.month && data.academicQualifications.qualification2.startDate.day) {
    appendIfFilled('second_qualification_start_date', `${data.academicQualifications.qualification2.startDate.year}-${data.academicQualifications.qualification2.startDate.month}-${data.academicQualifications.qualification2.startDate.day}`);
  }
  if (data.statementOfPurpose && data.statementOfPurpose[0]) formData.append('statement_of_purpose', data.statementOfPurpose[0]);
  if (data.academicQualifications.otherQualifications) formData.append('recommendation_letters', data.academicQualifications.otherQualifications);
  appendIfFilled('second_year', data.academicQualifications.qualification2?.endDate?.year);
  if (data.personalDetails.dateOfBirth && data.personalDetails.dateOfBirth.year && data.personalDetails.dateOfBirth.month && data.personalDetails.dateOfBirth.day) {
    appendIfFilled('date_of_birth', `${data.personalDetails.dateOfBirth.year}-${data.personalDetails.dateOfBirth.month}-${data.personalDetails.dateOfBirth.day}`);
  }
  appendIfFilled('city', data.personalDetails.city);
  appendIfFilled('degree', data.academicQualifications.qualification1.type);
  appendIfFilled('class_of_degree', data.academicQualifications.qualification1.grade);
  if (data.academicQualifications.qualification2?.endDate && data.academicQualifications.qualification2.endDate.year && data.academicQualifications.qualification2.endDate.month && data.academicQualifications.qualification2.endDate.day) {
    appendIfFilled('second_qualification_end_date', `${data.academicQualifications.qualification2.endDate.year}-${data.academicQualifications.qualification2.endDate.month}-${data.academicQualifications.qualification2.endDate.day}`);
  }
  appendIfFilled('second_institution', data.academicQualifications.qualification2?.institution);
  appendIfFilled('first_referee_email', data.references.referee1.email);
  if (data.academicQualifications.qualification2?.degreeCertificate) formData.append('second_degree_certificate', data.academicQualifications.qualification2.degreeCertificate);
  appendIfFilled('second_qualification_cgpa', data.academicQualifications.qualification2?.cgpa);
  appendIfFilled('second_qualification_subject', data.academicQualifications.qualification2?.subject);
  appendIfFilled('second_referee_email', data.references.referee2.email);
  if (data.academicQualifications.qualification1.degreeCertificate) formData.append('first_degree_certificate', data.academicQualifications.qualification1.degreeCertificate);
  appendIfFilled('applicant_type', data.applicantType);
  appendIfFilled('second_referee_name', data.references.referee2.name);
  appendIfFilled('country', data.personalDetails.country);
  appendIfFilled('second_degree', data.academicQualifications.qualification2?.type);
  appendIfFilled('institution', data.academicQualifications.qualification1.institution);
  appendIfFilled('street_address', data.personalDetails.streetAddress);
  appendIfFilled('disability_description', data.personalDetails.disabilityDescription);
  appendIfFilled('other_names', data.personalDetails.otherNames);
  appendIfFilled('first_referee_name', data.references.referee1.name);
  appendIfFilled('first_name', data.personalDetails.firstName);
  appendIfFilled('phone_number', data.personalDetails.phoneNumber);
  if (data.academicQualifications.qualification1.transcript) formData.append('first_degree_transcript', data.academicQualifications.qualification1.transcript);
  appendIfFilled('surname', data.personalDetails.surname);
  if (data.academicQualifications.qualification1.startDate && data.academicQualifications.qualification1.startDate.year && data.academicQualifications.qualification1.startDate.month && data.academicQualifications.qualification1.startDate.day) {
    appendIfFilled('qualification_start_date', `${data.academicQualifications.qualification1.startDate.year}-${data.academicQualifications.qualification1.startDate.month}-${data.academicQualifications.qualification1.startDate.day}`);
  }
  appendIfFilled('nationality', data.personalDetails.nationality);
  appendIfFilled('qualification_subject', data.academicQualifications.qualification1.subject);
  appendIfFilled('email', data.personalDetails.email);
  appendIfFilled('year', data.academicQualifications.qualification1.endDate?.year);
  appendIfFilled('academic_session', data.academicSession);
  if (data.academicQualifications.qualification2?.transcript) formData.append('second_degree_transcript', data.academicQualifications.qualification2.transcript);
  return formData;
}

const PostgraduateForm = ({ onPayment, isProcessingPayment }: PostgraduateFormProps) => {
  // Get application data from localStorage if available
  const [applicationData, setApplicationData] = useState<ApplicationData>({});
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const [openUniversityPopover, setOpenUniversityPopover] = useState(false);
  const [openUniversityPopover2, setOpenUniversityPopover2] = useState(false);
  const [universityCache, setUniversityCache] = useState<Record<string, University[]>>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPaymentState, setIsProcessingPaymentState] = useState(false);

  // Add these state variables after the other state declarations
  const [referee1EmailError, setReferee1EmailError] = useState<string | null>(null);
  const [referee2EmailError, setReferee2EmailError] = useState<string | null>(null);

  // Add state for university search country
  const [universityCountry, setUniversityCountry] = useState<string>("Nigeria");

  // Add state for passport photo URL
  const [passportPhotoUrl, setPassportPhotoUrl] = useState<string | null>(null);
  // Add ref for file input
  const passportPhotoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('applicationData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        if (parsedData.applications && parsedData.applications.length > 0) {
          const application = parsedData.applications[0];
          setApplicationData(application);
          
          // Set application fields
          if (application) {
            setPostgraduateData(prev => ({
              ...prev,
              academicSession: application.academic_session,
              programType: application.program_type as any,
              program: application.selected_program,
              applicantType: application.applicant_type,
              // ... set other fields similarly
            }));
          }
          
          // Handle passport photo if exists
          if (application.passport_photo_path) {
            const fullUrl = `https://admissions-jcvy.onrender.com/${application.passport_photo_path}`;
            setPassportPhotoUrl(fullUrl);
          }
        }
      }
    } catch (error) {
      setError("Failed to load application data");
    }
  }, []);

  const [postgraduateData, setPostgraduateData] = useState<PostgraduateFormData>({
    academicSession: getCurrentAcademicSession(),
    programType: "MSc",
    program: "",
    applicantType: "Nigerian",
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
      hasDisabilities: "No",
      disabilityDescription: "",
    },
    academicQualifications: {
      qualification1: {
        type: "",
        grade: "",
        cgpa: "",
        subject: "",
        institution: "",
        startDate: { day: "", month: "", year: "" },
        endDate: { day: "", month: "", year: "" },
        degreeCertificate: null,
        transcript: null,
      },
      qualification2: {
        type: "",
        grade: "",
        cgpa: "",
        subject: "",
        institution: "",
        startDate: { day: "", month: "", year: "" },
        endDate: { day: "", month: "", year: "" },
        degreeCertificate: null,
        transcript: null,
      },
      otherQualifications: null,
    },
    statementOfPurpose: [],
    references: {
      referee1: {
        name: "",
        email: "",
      },
      referee2: {
        name: "",
        email: "",
      },
    },
    nationality: "Nigerian",
    declaration: "",
  });

  // Fill form data from application data when it's available
  useEffect(() => {
    if (Object.keys(applicationData).length > 0) {
      // Parse date fields
      const parseDate = (dateStr) => {
        if (!dateStr) return { day: "", month: "", year: "" };
        const date = new Date(dateStr);
        return {
          day: date.getDate().toString().padStart(2, '0'),
          month: (date.getMonth() + 1).toString().padStart(2, '0'),
          year: date.getFullYear().toString()
        };
      };

      // Set programType and program from backend response
      let newProgramType = applicationData.program_type || postgraduateData.programType;
      let newProgram = applicationData.selected_program || postgraduateData.program;
      
      // If the loaded program is not in the list, add it temporarily
      let programList = programs[newProgramType] || [];
      if (newProgram && !programList.includes(newProgram)) {
        programList = [newProgram, ...programList];
        programs[newProgramType] = programList;
      }
      
      setPostgraduateData(prev => ({
        ...prev,
        academicSession: applicationData.academic_session || prev.academicSession,
        programType: newProgramType as "Postgraduate Diploma/Taught Masters" | "MSc" | "PhD",
        program: newProgram,
        personalDetails: {
          ...prev.personalDetails,
          surname: applicationData.surname || prev.personalDetails.surname,
          firstName: applicationData.first_name || prev.personalDetails.firstName,
          otherNames: applicationData.other_names || prev.personalDetails.otherNames,
          gender: applicationData.gender || prev.personalDetails.gender,
          dateOfBirth: parseDate(applicationData.date_of_birth),
          streetAddress: applicationData.street_address || prev.personalDetails.streetAddress,
          city: applicationData.city || prev.personalDetails.city,
          country: applicationData.country || prev.personalDetails.country,
          stateOfOrigin: applicationData.state_of_origin || prev.personalDetails.stateOfOrigin,
          nationality: applicationData.nationality || prev.personalDetails.nationality,
          phoneNumber: applicationData.phone_number || prev.personalDetails.phoneNumber,
          email: applicationData.email || prev.personalDetails.email,
          hasDisabilities: applicationData.has_disability ? "Yes" : "No",
          disabilityDescription: applicationData.disability_description || prev.personalDetails.disabilityDescription,
        },
        academicQualifications: {
          ...prev.academicQualifications,
          qualification1: {
            ...prev.academicQualifications.qualification1,
            type: applicationData.degree || "",
            grade: applicationData.class_of_degree || "",
            cgpa: applicationData.qualification_cgpa?.toString() || "",
            subject: applicationData.qualification_subject || "",
            institution: applicationData.institution || "",
            startDate: parseDate(applicationData.qualification_start_date),
            endDate: parseDate(applicationData.qualification_end_date),
            degreeCertificate: applicationData.first_degree_certificate_path ? createPlaceholderFile(applicationData.first_degree_certificate_path) : prev.academicQualifications.qualification1.degreeCertificate,
            transcript: applicationData.first_degree_transcript_path ? createPlaceholderFile(applicationData.first_degree_transcript_path) : prev.academicQualifications.qualification1.transcript,
          },
          qualification2: {
            ...prev.academicQualifications.qualification2,
            type: applicationData.second_degree || "",
            grade: applicationData.second_class_of_degree || "",
            cgpa: applicationData.second_qualification_cgpa?.toString() || "",
            subject: applicationData.second_qualification_subject || "",
            institution: applicationData.second_institution || "",
            startDate: parseDate(applicationData.second_qualification_start_date),
            endDate: parseDate(applicationData.second_qualification_end_date),
            degreeCertificate: applicationData.second_degree_certificate_path ? createPlaceholderFile(applicationData.second_degree_certificate_path) : prev.academicQualifications.qualification2.degreeCertificate,
            transcript: applicationData.second_degree_transcript_path ? createPlaceholderFile(applicationData.second_degree_transcript_path) : prev.academicQualifications.qualification2.transcript,
          },
          otherQualifications: applicationData.recommendation_letters_paths ? createPlaceholderFile(applicationData.recommendation_letters_paths) : prev.academicQualifications.otherQualifications,
        },
        statementOfPurpose: applicationData.statement_of_purpose_path ? [createPlaceholderFile(applicationData.statement_of_purpose_path)] : prev.statementOfPurpose,
        references: {
          referee1: {
            name: applicationData.first_referee_name || prev.references.referee1.name,
            email: applicationData.first_referee_email || prev.references.referee1.email,
          },
          referee2: {
            name: applicationData.second_referee_name || prev.references.referee2.name,
            email: applicationData.second_referee_email || prev.references.referee2.email,
          },
        },
        nationality: applicationData.nationality || prev.nationality,
      }));

      if (applicationData.passport_photo_path) {
        // Add the API URL prefix to the passport photo path with a forward slash
        const fullUrl = `https://admissions-jcvy.onrender.com/${applicationData.passport_photo_path}`;
        setPassportPhotoUrl(fullUrl);
      }
    }
  }, [applicationData]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});

  // Generate years from 1950 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const handlePersonalDetailsChange = (field: string, value: string) => {
    setPostgraduateData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value
      }
    }));
  };

  const handleDateChange = (field: string, type: "day" | "month" | "year", value: string) => {
    setPostgraduateData(prev => ({
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

  const handleAcademicDateChange = (
    qualificationField: "qualification1" | "qualification2",
    dateField: "startDate" | "endDate",
    type: "day" | "month" | "year",
    value: string
  ) => {
    setPostgraduateData(prev => ({
      ...prev,
      academicQualifications: {
        ...prev.academicQualifications,
        [qualificationField]: {
          ...prev.academicQualifications[qualificationField],
          [dateField]: {
            ...prev.academicQualifications[qualificationField][dateField],
            [type]: value
          }
        }
      }
    }));
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ ...copyStatus, [field]: true });
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [field]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleAcademicQualificationChange = (
    qualificationField: "qualification1" | "qualification2" | "otherQualifications",
    subField: "type" | "grade" | "cgpa" | "subject" | "institution" | "otherType" | "degreeCertificate" | "transcript" | null,
    value: string | File | File[] | null
  ) => {
    setPostgraduateData(prev => ({
      ...prev,
      academicQualifications: {
        ...prev.academicQualifications,
        [qualificationField]: subField 
          ? {
          ...prev.academicQualifications[qualificationField],
          [subField]: value
        }
          : value // This handles the case where we're setting the entire field (for otherQualifications)
      }
    }));
  };

  const isFormValid = () => {
    const { personalDetails, academicQualifications, programType } = postgraduateData;
    // Check for referee email validation errors
    if (referee1EmailError || referee2EmailError) {
      toast.error("Please correct the referee email issues before submitting");
      return false;
    }
    // Basic personal details validation
    if (!personalDetails.surname) {
      toast.error("Surname is required");
      return false;
    }
    if (!personalDetails.firstName) {
      toast.error("First name is required");
      return false;
    }
    if (!personalDetails.gender) {
      toast.error("Gender is required");
      return false;
    }
    // Date of Birth validation
    if (!personalDetails.dateOfBirth.day || !personalDetails.dateOfBirth.month || !personalDetails.dateOfBirth.year) {
      toast.error("Date of birth is required");
      return false;
    }
    if (!personalDetails.streetAddress) {
      toast.error("Street address is required");
      return false;
    }
    if (!personalDetails.city) {
      toast.error("City is required");
      return false;
    }
    if (!personalDetails.country) {
      toast.error("Country is required");
      return false;
    }
    if (!personalDetails.phoneNumber) {
      toast.error("Phone number is required");
      return false;
    }
    if (!personalDetails.email) {
      toast.error("Email is required");
      return false;
    }
    // Validate nationality based on applicant type
    if (postgraduateData.applicantType === "Nigerian" && personalDetails.nationality !== "Nigerian") {
      toast.error("Nationality must be Nigerian for Nigerian applicants");
      return false;
    }
    if (postgraduateData.applicantType === "International" && !personalDetails.nationality) {
      toast.error("Nationality is required for international applicants");
      return false;
    }
    // Validate state of origin only for Nigerian applicants
    if (postgraduateData.applicantType === "Nigerian" && !personalDetails.stateOfOrigin) {
      toast.error("State of origin is required for Nigerian applicants");
      return false;
    }
    // Validate first academic qualification
    const qual1 = academicQualifications.qualification1;
    if (!qual1.type) {
      toast.error("First qualification type is required");
      return false;
    }
    if (!qual1.grade) {
      toast.error("First qualification grade is required");
      return false;
    }
    if (!qual1.cgpa) {
      toast.error("First qualification CGPA is required");
      return false;
    }
    if (!qual1.subject) {
      toast.error("First qualification subject is required");
      return false;
    }
    if (!qual1.institution) {
      toast.error("First qualification institution is required");
      return false;
    }
    // First qualification start date
    if (!qual1.startDate.day || !qual1.startDate.month || !qual1.startDate.year) {
      toast.error("First qualification start date is required");
      return false;
    }
    // First qualification end date
    if (!qual1.endDate.day || !qual1.endDate.month || !qual1.endDate.year) {
      toast.error("First qualification end date is required");
      return false;
    }
    if (!qual1.degreeCertificate) {
      toast.error("First degree certificate is required");
      return false;
    }
    if (!qual1.transcript) {
      toast.error("First degree transcript is required");
      return false;
    }
    // Validate second academic qualification for PhD students
    if (programType === "PhD") {
      const qual2 = academicQualifications.qualification2;
      if (!qual2) {
        toast.error("Second qualification is required for PhD applicants");
        return false;
      }
      if (!qual2.type) {
        toast.error("Second qualification type is required");
        return false;
      }
      if (!qual2.grade) {
        toast.error("Second qualification grade is required");
        return false;
      }
      if (!qual2.cgpa) {
        toast.error("Second qualification CGPA is required");
        return false;
      }
      if (!qual2.subject) {
        toast.error("Second qualification subject is required");
        return false;
      }
      if (!qual2.institution) {
        toast.error("Second qualification institution is required");
        return false;
      }
      // Second qualification start date
      if (!qual2.startDate.day || !qual2.startDate.month || !qual2.startDate.year) {
        toast.error("Second qualification start date is required");
        return false;
      }
      // Second qualification end date
      if (!qual2.endDate.day || !qual2.endDate.month || !qual2.endDate.year) {
        toast.error("Second qualification end date is required");
        return false;
      }
      if (!qual2.degreeCertificate) {
        toast.error("Second degree certificate is required");
        return false;
      }
      if (!qual2.transcript) {
        toast.error("Second degree transcript is required");
        return false;
      }
    }
    // Validate statement of purpose
    if (postgraduateData.statementOfPurpose.length === 0) {
      toast.error("Statement of purpose is required");
      return false;
    }
    // Validate references
    const { referee1, referee2 } = postgraduateData.references;
    if (!referee1.name) {
      toast.error("Referee 1 name is required");
      return false;
    }
    if (!referee1.email) {
      toast.error("Referee 1 email is required");
      return false;
    }
    if (!referee2.name) {
      toast.error("Referee 2 name is required");
      return false;
    }
    if (!referee2.email) {
      toast.error("Referee 2 email is required");
      return false;
    }
    // Validate declaration
    if (!postgraduateData.declaration) {
      toast.error("You must agree to the declaration");
      return false;
    }
    // Validate passport photo - check for either file or URL
    if (!postgraduateData.passportPhoto && !passportPhotoUrl) {
      toast.error("Passport photo is required");
      return false;
    }
    return true;
  };

  const handleSaveAsDraft = async () => {
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("fastApiAccessToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const formData = buildPostgraduateFormData(postgraduateData);
      await apiService.uploadPostgraduateFormData(formData);
      toast.success("Draft saved successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  // Replace the validateRefereeEmail function with this improved version
  const validateRefereeEmail = (email: string): boolean => {
    // Check if it's a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    // Check if it's an academic or corporate email
    const academicDomains = [
      '.edu',
      '.ac.',
      '.sch.',
      '.school',
      '.college',
      '.university',
      '.institute',
      '.gov',
      '.org',
      '.mil',
      '.int',
      '.edu.',
      '.ac',
      '.sch',
      '.school.',
      '.college.',
      '.university.',
      '.institute.',
      '.edu.ng'
    ];

    // Skip validation for empty email
    if (!email) return true;

    return academicDomains.some(domain => email.toLowerCase().includes(domain));
  };

  // Add this function to handle referee email validation
  const handleRefereeEmailChange = (refereeNumber: 1 | 2, email: string) => {
    // Set the email value
    setPostgraduateData(prev => ({
      ...prev,
      references: {
        ...prev.references,
        [`referee${refereeNumber}`]: {
          ...prev.references[`referee${refereeNumber}`],
          email: email
        }
      }
    }));

    // Skip validation if the field is empty
    if (!email) {
      if (refereeNumber === 1) {
        setReferee1EmailError(null);
      } else {
        setReferee2EmailError(null);
      }
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorMsg = "Please enter a valid email address";
      if (refereeNumber === 1) {
        setReferee1EmailError(errorMsg);
      } else {
        setReferee2EmailError(errorMsg);
      }
      return;
    }

    // Academic domain validation
    if (!validateRefereeEmail(email)) {
      const errorMsg = "Please use an institutional email (e.g., .edu, .ac, university.*, .org)";
      if (refereeNumber === 1) {
        setReferee1EmailError(errorMsg);
      } else {
        setReferee2EmailError(errorMsg);
      }
      return;
    }

    // Clear error if valid
    if (refereeNumber === 1) {
      setReferee1EmailError(null);
    } else {
      setReferee2EmailError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = buildPostgraduateFormData(postgraduateData);
      
              const response = await apiService.uploadPostgraduateApplication(formData);
      
      if (response.success) {
        // Show payment modal after successful submission
        setShowPaymentModal(true);
      } else {
        throw new Error(response.message || "Failed to submit application");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while submitting the application");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add these functions to handle payment options
  const handlePaymentAsNigerian = async () => {
    try {
      setIsProcessingPaymentState(true);
      await onPayment(20000, postgraduateData.personalDetails.email, {
        program_type: postgraduateData.programType,
        applicant_type: "Nigerian",
        application_data: postgraduateData
      });
      setShowPaymentModal(false);
    } catch (error) {
      toast.error("Failed to process payment");
    } finally {
      setIsProcessingPaymentState(false);
    }
  };

  const handlePaymentAsInternational = async () => {
    try {
      setIsProcessingPaymentState(true);
      await onPayment(50, postgraduateData.personalDetails.email, {
        program_type: postgraduateData.programType,
        applicant_type: "International",
        application_data: postgraduateData
      });
      setShowPaymentModal(false);
    } catch (error) {
      toast.error("Failed to process payment");
    } finally {
      setIsProcessingPaymentState(false);
    }
  };

  // Function to fetch universities with caching and optimization
  const fetchUniversities = async (query: string) => {
    if (query.length < 3) {
      setUniversities([]);
      return;
    }
    // Check cache first
    const cacheKey = `${query}|${universityCountry}`;
    if (universityCache[cacheKey]) {
      setUniversities(universityCache[cacheKey]);
      return;
    }
    setIsLoadingUniversities(true);
    try {
      const response = await fetch(`https://admissions-jcvy.onrender.com/universities?search=${encodeURIComponent(query)}&country=${encodeURIComponent(universityCountry)}`);
      const data = await response.json();
      const limitedData = data.slice(0, 20);
      setUniversities(limitedData);
      setUniversityCache(prev => ({ ...prev, [cacheKey]: limitedData }));
    } catch (error) {
      toast.error("Failed to fetch universities");
      console.error("Error fetching universities:", error);
    } finally {
      setIsLoadingUniversities(false);
    }
  };

  // Set debounce delay to standard 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        fetchUniversities(searchQuery);
      }
    }, 500); // Standard 500ms debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Function to handle university selection
  const handleUniversitySelect = (universityName: string, qualificationField: "qualification1" | "qualification2") => {
    setPostgraduateData(prev => ({
      ...prev,
      academicQualifications: {
        ...prev.academicQualifications,
        [qualificationField]: {
          ...prev.academicQualifications[qualificationField],
          institution: universityName
        }
      }
    }));
    // Clear the search query after selection
    setSearchQuery("");
    // Close the popover
    if (qualificationField === "qualification1") {
      setOpenUniversityPopover(false);
    } else {
      setOpenUniversityPopover2(false);
    }
  };

  // Update the CommandInput to show minimum character message and loading state
  const renderCommandInput = () => (
    <div className="space-y-2">
      {renderUniversityCountrySelect()}
      <CommandInput
        placeholder="Search universities... (minimum 3 characters)"
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      {searchQuery.length > 0 && searchQuery.length < 3 && (
        <p className="px-2 text-xs text-gray-500">Please enter at least 3 characters to search</p>
      )}
      {isLoadingUniversities && (
        <p className="px-2 text-xs text-gray-500">Searching universities...</p>
      )}
    </div>
  );

  // Update the CommandItem to handle long names and make it selectable
  const renderUniversityItem = (university: University, qualificationField: "qualification1" | "qualification2") => (
    <CommandItem
      key={university.name}
      value={university.name}
      onSelect={() => handleUniversitySelect(university.name, qualificationField)}
      className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none aria-selected:bg-orange-100 hover:bg-orange-100 focus:bg-orange-100"
    >
      <div className="flex flex-col w-full">
        <span className="truncate text-gray-900" title={university.name}>
          {university.name}
        </span>
        <span className="text-xs text-gray-500 truncate" title={university.country}>
          {university.country}
        </span>
      </div>
    </CommandItem>
  );

  // Update the CommandGroup to ensure proper scrolling and interaction
  const renderCommandGroup = (qualificationField: "qualification1" | "qualification2") => (
    <CommandGroup className="max-h-[300px] overflow-auto">
      {universities.map((university) => renderUniversityItem(university, qualificationField))}
    </CommandGroup>
  );

  // Update the PopoverContent to ensure proper positioning and interaction
  const renderInstitutionField = () => (
    <div className="space-y-2">
      <Label>Institution <span className="text-red-500">Required</span></Label>
      <Popover open={openUniversityPopover} onOpenChange={setOpenUniversityPopover}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openUniversityPopover}
            className="w-full justify-between"
          >
            <span className="truncate">
              {postgraduateData.academicQualifications.qualification1.institution || "Search for your institution..."}
            </span>
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            {renderCommandInput()}
            <CommandEmpty>
              {isLoadingUniversities ? (
                <div className="p-4 text-center text-sm">Loading...</div>
              ) : searchQuery.length < 3 ? (
                <div className="p-4 text-center text-sm">Enter at least 3 characters to search</div>
              ) : (
                <div className="p-4 text-center text-sm">No universities found.</div>
              )}
            </CommandEmpty>
            {renderCommandGroup("qualification1")}
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-xs text-gray-500">
        Start typing to search for your institution. If your institution is not listed, you can type it manually.
      </p>
    </div>
  );

  // Update renderInstitutionField2 similarly
  const renderInstitutionField2 = () => (
    <div className="space-y-2">
      <Label>Institution <span className="text-red-500">Required</span></Label>
      <Popover open={openUniversityPopover2} onOpenChange={setOpenUniversityPopover2}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openUniversityPopover2}
            className="w-full justify-between"
          >
            <span className="truncate">
              {postgraduateData.academicQualifications.qualification2?.institution || "Search for your institution..."}
            </span>
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            {renderCommandInput()}
            <CommandEmpty>
              {isLoadingUniversities ? (
                <div className="p-4 text-center text-sm">Loading...</div>
              ) : searchQuery.length < 3 ? (
                <div className="p-4 text-center text-sm">Enter at least 3 characters to search</div>
              ) : (
                <div className="p-4 text-center text-sm">No universities found.</div>
              )}
            </CommandEmpty>
            {renderCommandGroup("qualification2")}
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-xs text-gray-500">
        Start typing to search for your institution. If your institution is not listed, you can type it manually.
      </p>
    </div>
  );

  // Add a country select field above the university search input
  const renderUniversityCountrySelect = () => (
    <div className="mb-2">
      <Label>University Country</Label>
      <Select
        value={universityCountry}
        onValueChange={setUniversityCountry}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country} value={country}>{country}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
        {/* Applicant Type Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg">
              <User className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Applicant Type</h3>
          </div>
          <div className="max-w-md">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Are you a Nigerian or International Applicant?
                <span className="text-red-500 text-xs">*</span>
              </Label>
              <Select
                value={postgraduateData.applicantType}
                onValueChange={(value) => {
                  setPostgraduateData(prev => ({
                    ...prev,
                    applicantType: value as "Nigerian" | "International",
                    personalDetails: {
                      ...prev.personalDetails,
                      nationality: value === "Nigerian" ? "Nigerian" : prev.personalDetails.nationality,
                    }
                  }));
                }}
              >
                <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
                  <SelectValue placeholder="Select applicant type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nigerian">Nigerian</SelectItem>
                  <SelectItem value="International">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>


        {/* Passport Photo Upload */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Camera className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Passport Photograph</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Passport Photograph
                <span className="text-red-500 text-xs">*</span>
              </Label>
              <div className={`max-w-[250px] h-[250px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center overflow-hidden transition-colors ${
                postgraduateData.passportPhoto || passportPhotoUrl ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}> 
                {/* Always render the file input, but keep it hidden */}
                <input
                  type="file"
                  id="passportPhoto"
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  ref={passportPhotoInputRef}
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      setPostgraduateData(prev => ({
                        ...prev,
                        passportPhoto: files[0]
                      }));
                      setPassportPhotoUrl(null); // Clear the URL if a new file is selected
                    }
                  }}
                />
                {passportPhotoUrl && !postgraduateData.passportPhoto ? (
                  <div className="relative w-full h-full group">
                    <img 
                      src={passportPhotoUrl}
                      alt="Passport"
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => passportPhotoInputRef.current?.click()}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setPassportPhotoUrl(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </button>
                    {/* Overlay 'Change Photo' button on hover */}
                    <button
                      type="button"
                      onClick={() => passportPhotoInputRef.current?.click()}
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black bg-opacity-60 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : postgraduateData.passportPhoto ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={URL.createObjectURL(postgraduateData.passportPhoto)} 
                      alt="Passport" 
                      className="w-full h-full object-cover"
                      onClick={() => passportPhotoInputRef.current?.click()}
                      style={{ cursor: 'pointer' }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setPostgraduateData(prev => ({
                          ...prev,
                          passportPhoto: null
                        }));
                      }}
                      className="absolute top-2 right-2 p-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </button>
                    {/* Overlay 'Change Photo' button on hover */}
                    <button
                      type="button"
                      onClick={() => passportPhotoInputRef.current?.click()}
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black bg-opacity-60 text-white text-xs rounded opacity-0 hover:opacity-100 transition"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="passportPhoto"
                    className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                    onClick={() => passportPhotoInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-600 text-center">
                      Click to upload passport photo
                    </span>
                    <span className="mt-1 text-xs text-gray-500 text-center">
                      JPG, JPEG, PNG (Max: 5MB)
                    </span>
                    <span className="mt-2 text-xs text-gray-500 text-center">
                      Please upload a recent passport-sized photograph with clear background
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Program Selection */}
        <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
          <h3 className="text-lg font-semibold">Program Selection</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Academic Session <span className="text-red-500 text-xs italic">Required</span></Label>
                <Select
                  value={postgraduateData.academicSession}
                  onValueChange={(value) => setPostgraduateData(prev => ({ ...prev, academicSession: value }))}
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
                <Label>Program Type <span className="text-red-500 text-xs italic">Required</span></Label>
                <Select
                  value={postgraduateData.programType}
                  onValueChange={(value: "Postgraduate Diploma/Taught Masters" | "MSc" | "PhD") => {
                    setPostgraduateData(prev => ({
                      ...prev,
                      programType: value,
                      program: "" // Reset program when type changes
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Postgraduate Diploma/Taught Masters">Postgraduate Diploma/Taught Masters</SelectItem>
                    <SelectItem value="MSc">MSc</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Program <span className="text-red-500 text-xs italic">Required</span></Label>
              <Select
                value={postgraduateData.program}
                onValueChange={(value) => setPostgraduateData(prev => ({ ...prev, program: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs[postgraduateData.programType].map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

       {/* Personal Details Section */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-100 rounded-lg">
          <User className="h-5 w-5 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Surname
              <span className="text-red-500 text-xs">*</span>
            </Label>
            <Input
              placeholder="Enter your surname"
              value={postgraduateData.personalDetails.surname}
              onChange={(e) => handlePersonalDetailsChange("surname", e.target.value)}
              className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
              required
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              First Name
              <span className="text-red-500 text-xs">*</span>
            </Label>
            <Input
              placeholder="Enter your first name"
              value={postgraduateData.personalDetails.firstName}
              onChange={(e) => handlePersonalDetailsChange("firstName", e.target.value)}
              className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Other Names</Label>
          <Input
            placeholder="Enter other names (if any)"
            value={postgraduateData.personalDetails.otherNames}
            onChange={(e) => handlePersonalDetailsChange("otherNames", e.target.value)}
            className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
          />
        </div>

        {/* Gender and Date of Birth side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Gender
              <span className="text-red-500 text-xs">*</span>
            </Label>
            <Select
              value={postgraduateData.personalDetails.gender}
              onValueChange={(value) => handlePersonalDetailsChange("gender", value)}
            >
              <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date of Birth */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Date of Birth
              <span className="text-red-500 text-xs">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={postgraduateData.personalDetails.dateOfBirth.day}
                onValueChange={(value) => handleDateChange("dateOfBirth", "day", value)}
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
                value={postgraduateData.personalDetails.dateOfBirth.month}
                onValueChange={(value) => handleDateChange("dateOfBirth", "month", value)}
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
                value={postgraduateData.personalDetails.dateOfBirth.year}
                onValueChange={(value) => handleDateChange("dateOfBirth", "year", value)}
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
        </div>

        <div className="space-y-3">
          <Label htmlFor="streetAddress" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Street Address
            <span className="text-red-500 text-xs">*</span>
          </Label>
          <Textarea
            id="streetAddress"
            placeholder="Enter your street address"
            value={postgraduateData.personalDetails.streetAddress}
            onChange={(e) => handlePersonalDetailsChange("streetAddress", e.target.value)}
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
              placeholder="Enter your city"
              value={postgraduateData.personalDetails.city}
              onChange={(e) => handlePersonalDetailsChange("city", e.target.value)}
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
              value={postgraduateData.personalDetails.country}
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

        {/* Nationality and State of Origin side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Nationality
              <span className="text-red-500 text-xs">*</span>
            </Label>
            {postgraduateData.applicantType === "Nigerian" ? (
              <Input value="Nigerian" disabled className="h-12 px-4 border-gray-300 rounded-xl bg-gray-100 text-base" />
            ) : (
              <Select
                value={postgraduateData.personalDetails.nationality}
                onValueChange={(value) => handlePersonalDetailsChange("nationality", value)}
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
            )}
          </div>

          {postgraduateData.applicantType === "Nigerian" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                State of Origin
                <span className="text-red-500 text-xs">*</span>
              </Label>
              <Select
                value={postgraduateData.personalDetails.stateOfOrigin}
                onValueChange={(value) => handlePersonalDetailsChange("stateOfOrigin", value)}
              >
                <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
                  <SelectValue placeholder="Select state of origin" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map((state) => (
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
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Phone Number
              <span className="text-red-500 text-xs">*</span>
            </Label>
            <PhoneInput
              international
              defaultCountry="NG"
              value={postgraduateData.personalDetails.phoneNumber}
              onChange={(value) => handlePersonalDetailsChange("phoneNumber", value || "")}
              className="!flex !items-center !gap-2 [&>input]:!flex-1 [&>input]:!h-12 [&>input]:!px-4 [&>input]:!border-gray-300 [&>input]:!rounded-xl [&>input]:!focus:ring-2 [&>input]:!focus:ring-amber-500 [&>input]:!focus:border-amber-500 [&>input]:!transition-all [&>input]:!duration-200 [&>input]:!text-base [&>input]:!bg-background [&>input]:!ring-offset-background [&>input]:!placeholder:text-muted-foreground [&>input]:!focus-visible:outline-none [&>input]:!focus-visible:ring-offset-2 [&>input]:!disabled:cursor-not-allowed [&>input]:!disabled:opacity-50"
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
              value={postgraduateData.personalDetails.email}
              onChange={(e) => handlePersonalDetailsChange("email", e.target.value)}
              className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Do you have any disabilities?
            <span className="text-red-500 text-xs">*</span>
          </Label>
          <div className="max-w-md">
            <Select
              value={postgraduateData.personalDetails.hasDisabilities}
              onValueChange={(value) => handlePersonalDetailsChange("hasDisabilities", value)}
            >
              <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {postgraduateData.personalDetails.hasDisabilities === "Yes" && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Please describe your disability
              <span className="text-red-500 text-xs">*</span>
            </Label>
            <Input
              placeholder="Describe your disability"
              value={postgraduateData.personalDetails.disabilityDescription}
              onChange={(e) => handlePersonalDetailsChange("disabilityDescription", e.target.value)}
              className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
            />
          </div>
        )}
      </div>
    </div>


        {/* Academic Qualifications Section */}
        <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
          <h3 className="text-lg font-semibold">Academic Qualifications</h3>
          {/* Required Documents Section - REMOVE FILE UPLOADS FROM HERE */}
          <div className="space-y-4">
            <h4 className="font-medium">Required Documents</h4>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Please upload the following documents:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Original Degree Certificate</li>
                  <li>Official Academic Transcript</li>
                </ul>
              </p>
            </div>
          </div>

          {/* First Academic Qualification */}
          <div className="space-y-4">
            <h4 className="font-medium"><b>First Academic Qualification</b></h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Qualification Type <span className="text-red-500">Required</span></Label>
                <Select
                  value={postgraduateData.academicQualifications.qualification1.type}
                  onValueChange={(value) => handleAcademicQualificationChange("qualification1", "type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select qualification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undergraduate">Undergraduate Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {postgraduateData.academicQualifications.qualification1.type === "other" && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Specify Other Qualification
                    <span className="text-red-500 text-xs">*</span>
                  </Label>
                  <Input
                    placeholder="Enter other qualification"
                    value={postgraduateData.academicQualifications.qualification1.otherType || ""}
                    onChange={(e) => handleAcademicQualificationChange("qualification1", "otherType", e.target.value)}
                    className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
                  />
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Grade
                  <span className="text-red-500 text-xs">*</span>
                </Label>
                <Select
                  value={postgraduateData.academicQualifications.qualification1.grade}
                  onValueChange={(value) => handleAcademicQualificationChange("qualification1", "grade", value)}
                >
                  <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Class">First Class</SelectItem>
                    <SelectItem value="Second Class Upper">Second Class Upper</SelectItem>
                    <SelectItem value="Second Class Lower">Second Class Lower</SelectItem>
                    <SelectItem value="Third Class">Third Class</SelectItem>
                    <SelectItem value="Pass">Pass</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  CGPA
                  <span className="text-red-500 text-xs">*</span>
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  placeholder="Enter CGPA"
                  value={postgraduateData.academicQualifications.qualification1.cgpa}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      handleAcademicQualificationChange("qualification1", "cgpa", value);
                    }
                  }}
                  className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Subject
                  <span className="text-red-500 text-xs">*</span>
                </Label>
                <Input
                  placeholder="Enter subject"
                  value={postgraduateData.academicQualifications.qualification1.subject}
                  onChange={(e) => handleAcademicQualificationChange("qualification1", "subject", e.target.value)}
                  className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Institution
                  <span className="text-red-500 text-xs">*</span>
                </Label>
                <Popover open={openUniversityPopover} onOpenChange={setOpenUniversityPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openUniversityPopover}
                      className="w-full justify-between h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
                    >
                      <span className="truncate">
                        {postgraduateData.academicQualifications.qualification1.institution || "Search for your institution..."}
                      </span>
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      {renderCommandInput()}
                      <CommandEmpty>
                        {isLoadingUniversities ? (
                          <div className="p-4 text-center text-sm">Loading...</div>
                        ) : searchQuery.length < 3 ? (
                          <div className="p-4 text-center text-sm">Enter at least 3 characters to search</div>
                        ) : (
                          <div className="p-4 text-center text-sm">No universities found.</div>
                        )}
                      </CommandEmpty>
                      {renderCommandGroup("qualification1")}
                    </Command>
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-gray-500">
                  Start typing to search for your institution. If your institution is not listed, you can type it manually.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Start Date
                  <span className="text-red-500 text-xs">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={postgraduateData.academicQualifications.qualification1.startDate.day}
                    onValueChange={(value) => handleAcademicDateChange("qualification1", "startDate", "day", value)}
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
                    value={postgraduateData.academicQualifications.qualification1.startDate.month}
                    onValueChange={(value) => handleAcademicDateChange("qualification1", "startDate", "month", value)}
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
                    value={postgraduateData.academicQualifications.qualification1.startDate.year}
                    onValueChange={(value) => handleAcademicDateChange("qualification1", "startDate", "year", value)}
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
                  End Date
                  <span className="text-red-500 text-xs">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={postgraduateData.academicQualifications.qualification1.endDate.day}
                    onValueChange={(value) => handleAcademicDateChange("qualification1", "endDate", "day", value)}
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
                    value={postgraduateData.academicQualifications.qualification1.endDate.month}
                    onValueChange={(value) => handleAcademicDateChange("qualification1", "endDate", "month", value)}
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
                    value={postgraduateData.academicQualifications.qualification1.endDate.year}
                    onValueChange={(value) => handleAcademicDateChange("qualification1", "endDate", "year", value)}
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
            </div>
            {/* File Uploads for First Academic Qualification */}
            <FileUploadField
              id="degreeCertificate"
              label={
                <>
                  Degree Certificate <span className="text-red-500 text-xs italic">Required</span>
                </>
              }
              accept=".pdf,.jpg,.jpeg,.png"
              value={postgraduateData.academicQualifications.qualification1.degreeCertificate ? [postgraduateData.academicQualifications.qualification1.degreeCertificate] : null}
              onChange={(files) => handleAcademicQualificationChange("qualification1", "degreeCertificate", files && files.length > 0 ? files[0] : null)}
              onRemove={() => handleAcademicQualificationChange("qualification1", "degreeCertificate", null)}
              multiple={false}
            />
            <FileUploadField
              id="academicTranscript"
              label={
                <>
                  Academic Transcript <span className="text-red-500 text-xs italic">Required</span>
                </>
              }
              accept=".pdf,.jpg,.jpeg,.png"
              value={postgraduateData.academicQualifications.qualification1.transcript ? [postgraduateData.academicQualifications.qualification1.transcript] : null}
              onChange={(files) => handleAcademicQualificationChange("qualification1", "transcript", files && files.length > 0 ? files[0] : null)}
              onRemove={() => handleAcademicQualificationChange("qualification1", "transcript", null)}
              multiple={false}
            />
          </div>

          {/* Second Academic Qualification - Only for PhD */}
          {postgraduateData.programType === "PhD" && (
            <div className="space-y-4 mt-8">
              <h4 className="font-medium"><b>Second Academic Qualification (Required for PhD)</b></h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Qualification Type
                    <span className="text-red-500 text-xs">*</span>
                  </Label>
                  <Select
                    value={postgraduateData.academicQualifications.qualification2?.type || ""}
                    onValueChange={(value) => handleAcademicQualificationChange("qualification2", "type", value)}
                  >
                    <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
                      <SelectValue placeholder="Select qualification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {postgraduateData.academicQualifications.qualification2?.type === "other" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      Specify Other Qualification
                      <span className="text-red-500 text-xs">*</span>
                    </Label>
                    <Input
                      placeholder="Enter other qualification"
                      value={postgraduateData.academicQualifications.qualification2?.otherType || ""}
                      onChange={(e) => handleAcademicQualificationChange("qualification2", "otherType", e.target.value)}
                      className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Grade
                    <span className="text-red-500 text-xs">*</span>
                  </Label>
                  <Select
                    value={postgraduateData.academicQualifications.qualification2?.grade || ""}
                    onValueChange={(value) => handleAcademicQualificationChange("qualification2", "grade", value)}
                  >
                    <SelectTrigger className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="First Class">First Class</SelectItem>
                      <SelectItem value="Second Class Upper">Second Class Upper</SelectItem>
                      <SelectItem value="Second Class Lower">Second Class Lower</SelectItem>
                      <SelectItem value="Third Class">Third Class</SelectItem>
                      <SelectItem value="Pass">Pass</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    CGPA
                    <span className="text-red-500 text-xs">*</span>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5"
                    placeholder="Enter CGPA"
                    value={postgraduateData.academicQualifications.qualification2?.cgpa || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        handleAcademicQualificationChange("qualification2", "cgpa", value);
                      }
                    }}
                    className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Subject
                    <span className="text-red-500 text-xs">*</span>
                  </Label>
                  <Input
                    placeholder="Enter subject"
                    value={postgraduateData.academicQualifications.qualification2?.subject || ""}
                    onChange={(e) => handleAcademicQualificationChange("qualification2", "subject", e.target.value)}
                    className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Institution
                    <span className="text-red-500 text-xs">*</span>
                  </Label>
                  <Popover open={openUniversityPopover2} onOpenChange={setOpenUniversityPopover2}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openUniversityPopover2}
                        className="w-full justify-between h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
                      >
                        <span className="truncate">
                          {postgraduateData.academicQualifications.qualification2?.institution || "Search for your institution..."}
                        </span>
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        {renderCommandInput()}
                        <CommandEmpty>
                          {isLoadingUniversities ? (
                            <div className="p-4 text-center text-sm">Loading...</div>
                          ) : searchQuery.length < 3 ? (
                            <div className="p-4 text-center text-sm">Enter at least 3 characters to search</div>
                          ) : (
                            <div className="p-4 text-center text-sm">No universities found.</div>
                          )}
                        </CommandEmpty>
                        {renderCommandGroup("qualification2")}
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-gray-500">
                    Start typing to search for your institution. If your institution is not listed, you can type it manually.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Start Date <span className="text-red-500">Required</span></Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Select
                      value={postgraduateData.academicQualifications.qualification2?.startDate?.day || ""}
                      onValueChange={(value) => handleAcademicDateChange("qualification2", "startDate", "day", value)}
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
                      value={postgraduateData.academicQualifications.qualification2?.startDate?.month || ""}
                      onValueChange={(value) => handleAcademicDateChange("qualification2", "startDate", "month", value)}
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
                      value={postgraduateData.academicQualifications.qualification2?.startDate?.year || ""}
                      onValueChange={(value) => handleAcademicDateChange("qualification2", "startDate", "year", value)}
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
                  <Label>End Date <span className="text-red-500">Required</span></Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Select
                      value={postgraduateData.academicQualifications.qualification2?.endDate?.day || ""}
                      onValueChange={(value) => handleAcademicDateChange("qualification2", "endDate", "day", value)}
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
                      value={postgraduateData.academicQualifications.qualification2?.endDate?.month || ""}
                      onValueChange={(value) => handleAcademicDateChange("qualification2", "endDate", "month", value)}
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
                      value={postgraduateData.academicQualifications.qualification2?.endDate?.year || ""}
                      onValueChange={(value) => handleAcademicDateChange("qualification2", "endDate", "year", value)}
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
              </div>
              {/* File Uploads for Second Academic Qualification */}
              <FileUploadField
                id="qualification2DegreeCertificate"
                label={
                  <>
                    Second Degree Certificate <span className="text-red-500 text-xs italic">Required</span>
                  </>
                }
                accept=".pdf,.jpg,.jpeg,.png"
                value={postgraduateData.academicQualifications.qualification2?.degreeCertificate ? [postgraduateData.academicQualifications.qualification2.degreeCertificate] : null}
                onChange={(files) => handleAcademicQualificationChange("qualification2", "degreeCertificate", files && files.length > 0 ? files[0] : null)}
                onRemove={() => handleAcademicQualificationChange("qualification2", "degreeCertificate", null)}
                multiple={false}
              />
              <FileUploadField
                id="qualification2Transcript"
                label={
                  <>
                    Second Degree Transcript <span className="text-red-500 text-xs italic">Required</span>
                  </>
                }
                accept=".pdf,.jpg,.jpeg,.png"
                value={postgraduateData.academicQualifications.qualification2?.transcript ? [postgraduateData.academicQualifications.qualification2.transcript] : null}
                onChange={(files) => handleAcademicQualificationChange("qualification2", "transcript", files && files.length > 0 ? files[0] : null)}
                onRemove={() => handleAcademicQualificationChange("qualification2", "transcript", null)}
                multiple={false}
              />
            </div>
          )}
          

          {/* Other Qualifications */}
          <div className="space-y-4">
            <h4 className="font-medium">Other Qualifications (Optional)</h4>
            <FileUploadField
              id="recommendationLetters"
              label="Upload Other Qualifications"
              accept=".pdf,.doc,.docx"
              value={postgraduateData.academicQualifications.otherQualifications ? [postgraduateData.academicQualifications.otherQualifications] : null}
              onChange={(files) => {
                const file = files && files.length > 0 ? files[0] : null;
                handleAcademicQualificationChange("otherQualifications", null, file);
              }}
              onRemove={() => handleAcademicQualificationChange("otherQualifications", null, null)}
            />
          </div>
        </div>

        {/* Statement of Purpose or Research Proposal */}
        {postgraduateData.programType === "PhD" ? (
          <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
            <h3 className="text-lg font-semibold">Research Proposal</h3>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  For PhD applicants, please provide a detailed research proposal (not more than two pages) that includes:
                  <br />- Research Title and Abstract
                  <br />- Introduction and Background
                  <br />- Literature Review
                  <br />- Research Objectives and Questions
                  <br />- Methodology and Research Design
                  <br />- Expected Outcomes and Impact
                  <br />- Timeline and Milestones
                  <br />- References
                  <br />- Budget and Resources Required
                  <br /><br />
                  This research proposal is mandatory for all PhD applicants and must not exceed two pages.
                </p>
              </div>
              <FileUploadField
                id="researchProposal"
                label={
                  <>
                    Research Proposal <span className="text-red-500 text-xs italic">Required</span>
                  </>
                }
                accept=".pdf,.doc,.docx"
                value={postgraduateData.statementOfPurpose}
                onChange={(files) => setPostgraduateData(prev => ({
                  ...prev,
                  statementOfPurpose: files || []
                }))}
                onRemove={() => setPostgraduateData(prev => ({
                  ...prev,
                  statementOfPurpose: []
                }))}
                maxSize="5MB"
                multiple
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
            <h3 className="text-lg font-semibold">Statement of Purpose</h3>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  As an applicant, please provide a one page summary of your reason for selecting the course for which you are applying. You should include:
                  <br />- Your interest and experience in this subject area
                  <br />- Your reason for choosing the particular course
                  <br />- How the course of study connects to your future plan
                </p>
              </div>
              <FileUploadField
                id="statementOfPurpose"
                label={
                  <>
                    Statement of Purpose <span className="text-red-500 text-xs italic">Required</span>
                  </>
                }
                accept=".pdf,.doc,.docx"
                value={postgraduateData.statementOfPurpose}
                onChange={(files) => setPostgraduateData(prev => ({
                  ...prev,
                  statementOfPurpose: files || []
                }))}
                onRemove={() => setPostgraduateData(prev => ({
                  ...prev,
                  statementOfPurpose: []
                }))}
                maxSize="5MB"
                multiple
              />
            </div>
          </div>
        )}

       {/* References Section */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-100 rounded-lg">
          <User className="h-5 w-5 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Academic References</h3>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            It is your responsibility to ensure that you provide TWO references to support your application. Your
            referees must be able to comment on your academic suitability for the program. A secure link will be sent to the email address of each referee — they must fill it or you cannot proceed with your application.
            <br />
            ⚠️ <strong>Only institutional or academic email addresses will receive the reference link.</strong>
            <br />
            <strong>✅ Accepted:</strong> example@university.edu, example@institution.ac.uk, example@research.org, example@university.edu.ng, example@government.gov
            <br />
            <strong>❌ Not accepted:</strong> example@gmail.com, example@yahoo.com, example@outlook.com, example@hotmail.com
          </p>
        </div>

        {/* Referee 1 */}
        <div className="space-y-4">
          <h4 className="font-medium">Referee 1</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Full Name
                <span className="text-red-500 text-xs">*</span>
              </Label>
              <Input
                placeholder="Enter referee's full name"
                value={postgraduateData.references.referee1.name}
                onChange={(e) => setPostgraduateData(prev => ({
                  ...prev,
                  references: {
                    ...prev.references,
                    referee1: {
                      ...prev.references.referee1,
                      name: e.target.value
                    }
                  }
                }))}
                className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Email Address
                <span className="text-red-500 text-xs">*</span>
              </Label>
              <Input
                type="email"
                placeholder="Enter referee's email"
                value={postgraduateData.references.referee1.email}
                onChange={(e) => handleRefereeEmailChange(1, e.target.value)}
                className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
              />
              {referee1EmailError && <p className="text-xs text-red-500">{referee1EmailError}</p>}
            </div>
          </div>
        </div>

        {/* Referee 2 */}
        <div className="space-y-4">
          <h4 className="font-medium">Referee 2</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Full Name
                <span className="text-red-500 text-xs">*</span>
              </Label>
              <Input
                placeholder="Enter referee's full name"
                value={postgraduateData.references.referee2.name}
                onChange={(e) => setPostgraduateData(prev => ({
                  ...prev,
                  references: {
                    ...prev.references,
                    referee2: {
                      ...prev.references.referee2,
                      name: e.target.value
                    }
                  }
                }))}
                className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Email Address
                <span className="text-red-500 text-xs">*</span>
              </Label>
              <Input
                type="email"
                placeholder="Enter referee's email"
                value={postgraduateData.references.referee2.email}
                onChange={(e) => handleRefereeEmailChange(2, e.target.value)}
                className="h-12 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-base"
              />
              {referee2EmailError && <p className="text-xs text-red-500">{referee2EmailError}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>


        {/* Declaration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg">
              <FileCheck className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Declaration</h3>
          </div>
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
                checked={postgraduateData.declaration === "true"}
                onChange={(e) => setPostgraduateData(prev => ({ 
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

        {/* Documents Checklist */}
        <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
          <h3 className="text-lg font-semibold">Documents Checklist</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li>A student copy of your academic transcripts and a copy of the certificate/diploma for degrees received (with notarized English translations where applicable) MUST be sent with this application form.</li>
                <li>Applicants should arrange for official transcripts to be sent to the University directly from degree issuing institution(s).</li>
                <li>TWO references should be supplied using the provided reference form link.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
          <div className="space-y-2 text-yellow-800">
            <p className="text-sm">
              <span className="font-medium">Application Fee:</span> ₦20,000 (Nigerian Applicants) / $50 (International Applicants)
        <br />
        <span className="text-sm text-orange-600">*Application fee only. Tuition fees: ₦906K - ₦5.1M (Nigerian) / $1K - $12K (International) depending on program</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Payment Method:</span> Paystack
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium">Important Notes:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Nigerian applicants will use Paystack NGN payment gateway</li>
                <li>International applicants will use Paystack USD payment gateway</li>
                <li>Payment must be completed to submit your application</li>
                <li>A payment receipt will be automatically generated after successful payment</li>
              </ul>
            </div>
            <p className="text-sm italic text-blue-600 mt-2">
              When you click "Proceed to Payment", the Paystack payment popup will appear automatically.
            </p>
          </div>
        </div>

        {/* Form Buttons */}
        <div className="space-y-4">
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveAsDraft}
              disabled={isProcessingPaymentState}
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              disabled={isProcessingPaymentState}
            >
              {isProcessingPaymentState ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>
        </div>
      </form>
      </div>
    </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        application={postgraduateData}
        onPaymentSuccess={(reference) => {
          // Handle successful payment
          localStorage.setItem("paymentCompleted", "true");
          localStorage.setItem("paymentReference", reference);
          setShowPaymentModal(false);
          navigate("/payment-success");
        }}
      />
    </>
  );
};

export default PostgraduateForm;