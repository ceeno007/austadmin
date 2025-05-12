import React, { useState, useEffect } from "react";
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
import { Upload, X, Check, Search } from "lucide-react";
import { toast } from "sonner";
import { getCurrentAcademicSession } from "@/utils/academicSession";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { apiService } from "../../services/api";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from 'react-router-dom';

interface DateField {
  day: string;
  month: string;
  year: string;
}

interface FormData {
  applicantType: "Nigerian" | "International";
  passportPhoto: File | null;
  academicSession: string;
  programType: "Postgraduate Diploma/Taught Masters" | "MSc" | "PhD";
  program: string;
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
    qualification1: {
      type: string;
      otherType?: string;
      grade: string;
      cgpa: string;
      subject: string;
      institution: string;
      startDate: DateField;
      endDate: DateField;
      documents: File[];
    };
    qualification2?: {
      type: string;
      otherType?: string;
      grade: string;
      cgpa: string;
      subject: string;
      institution: string;
      startDate: DateField;
      endDate: DateField;
      documents: File[];
    };
    otherQualifications: File | null;
  };
  statementOfPurpose: File[];
  applicationFee: File | null;
  paymentEvidence: File | null;
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
  declaration: string;
  nationality: string;
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
  awarding_institution?: string;
  qualification_type?: string;
  subject?: string;
  grade?: string;
  cgpa?: string;
  start_date?: string;
  end_date?: string;
  first_referee_name?: string;
  first_referee_email?: string;
  second_referee_name?: string;
  second_referee_email?: string;
  passport_photo_path?: string;
  transcript_path?: string;
  certificate_path?: string;
  statement_of_purpose_path?: string;
  payment_receipt_path?: string;
  other_qualifications_path?: string;
}

const programs = {
  "MSc": [
    "Applied Statistics",
    "Aerospace Engineering",
    "Computer Science",
    "Geoinformatics and GIS",
    "Energy Resources Engineering",
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
  ],
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
  ],
  "Postgraduate Diploma/Taught Masters": [
    "Management of Information Technology",
    "Petroleum Engineering"
  ]
};

interface FileUploadFieldProps {
  id: string;
  label: string | React.ReactNode;
  accept: string;
  value: File | File[] | null;
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
  const fileNames = hasFiles 
    ? Array.isArray(value) 
      ? value.map(f => f.name).join(", ") 
      : (value as File).name
    : "";

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

const PostgraduateForm = () => {
  // Get application data from localStorage if available
  const [applicationData, setApplicationData] = useState<ApplicationData>({});
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const [openUniversityPopover, setOpenUniversityPopover] = useState(false);
  const [openUniversityPopover2, setOpenUniversityPopover2] = useState(false);
  const [universityCache, setUniversityCache] = useState<{ [key: string]: University[] }>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('applicationData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        // Check if there are applications in the response
        const application = parsedData.applications && parsedData.applications.length > 0 
          ? parsedData.applications[0] 
          : null;
        
        if (application) {
          // Use the application data as our source
          setApplicationData(application);
          
          // Check for program_type in the application
          const programType = application.program_type?.toLowerCase();
          
          // Get stored program type from localStorage for comparison
          const savedProgramType = localStorage.getItem("programType");
          
          // Only redirect if program type exists and is different from 'postgraduate'
          if (programType && 
              programType !== 'postgraduate' && 
              programType !== 'msc' && 
              programType !== 'phd' && 
              savedProgramType && 
              savedProgramType !== 'postgraduate') {
            window.location.href = `/document-upload?type=${programType}`;
          } else {
            // If program type matches, update localStorage to be consistent
            localStorage.setItem("programType", "postgraduate");
          }
        } else {
          // No applications found, check if user object has program
          const userProgram = parsedData.user?.program?.toLowerCase();
          
          if (userProgram && 
              userProgram !== 'postgraduate' && 
              userProgram !== 'msc' && 
              userProgram !== 'phd') {
            window.location.href = `/document-upload?type=${userProgram}`;
          }
        }
      }
    } catch (error) {
      // Error handling without console.log
    }
  }, []);

  const [postgraduateData, setPostgraduateData] = useState<FormData>({
    applicantType: "Nigerian",
    passportPhoto: null,
    academicSession: getCurrentAcademicSession(),
    programType: "MSc",
    program: "",
    applicationFee: null,
    paymentEvidence: null,
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
      qualification1: {
        type: "",
        otherType: "",
        grade: "",
        cgpa: "",
        subject: "",
        institution: "",
        startDate: { day: "", month: "", year: "" },
        endDate: { day: "", month: "", year: "" },
        documents: [],
      },
      qualification2: {
        type: "",
        otherType: "",
        grade: "",
        cgpa: "",
        subject: "",
        institution: "",
        startDate: { day: "", month: "", year: "" },
        endDate: { day: "", month: "", year: "" },
        documents: [],
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
    declaration: "",
    nationality: "Nigerian",
  });

  // Fill form data from application data when it's available
  useEffect(() => {
    if (Object.keys(applicationData).length > 0) {
      console.log("Populating form with application data:", applicationData);
      
      // Extract data from the application
      const {
        academic_session,
        selected_program,
        program_type,
        surname,
        first_name,
        other_names,
        nationality,
        gender,
        date_of_birth,
        street_address,
        city,
        country,
        state_of_origin,
        phone_number,
        email,
        has_disability,
        disability_description,
        awarding_institution,
        qualification_type,
        subject,
        grade,
        cgpa,
        start_date,
        end_date,
        first_referee_name,
        first_referee_email,
        second_referee_name,
        second_referee_email,
        passport_photo_path,
        transcript_path,
        certificate_path,
        statement_of_purpose_path,
        payment_receipt_path,
        other_qualifications_path
      } = applicationData;
      
      // Create placeholder files
      const passportPhoto = createPlaceholderFile(passport_photo_path);
      const transcript = createPlaceholderFile(transcript_path);
      const certificate = createPlaceholderFile(certificate_path);
      const statementOfPurpose = createPlaceholderFile(statement_of_purpose_path);
      const paymentReceipt = createPlaceholderFile(payment_receipt_path);
      const otherQualifications = createPlaceholderFile(other_qualifications_path);
      
      // Calculate which document items to include in qualification1.documents
      const qualificationDocs: File[] = [];
      if (transcript) qualificationDocs.push(transcript);
      if (certificate) qualificationDocs.push(certificate);
      
      // Parse date of birth if available
      let parsedDateOfBirth = { day: "", month: "", year: "" };
      if (date_of_birth) {
        const date = new Date(date_of_birth);
        parsedDateOfBirth = {
          day: date.getDate().toString().padStart(2, '0'),
          month: (date.getMonth() + 1).toString().padStart(2, '0'),
          year: date.getFullYear().toString()
        };
      }
      
      // Parse start and end dates if available
      let parsedStartDate = { day: "", month: "", year: "" };
      let parsedEndDate = { day: "", month: "", year: "" };
      
      if (start_date) {
        const startDate = new Date(start_date);
        parsedStartDate = {
          day: startDate.getDate().toString().padStart(2, '0'),
          month: (startDate.getMonth() + 1).toString().padStart(2, '0'),
          year: startDate.getFullYear().toString()
        };
      }
      
      if (end_date) {
        const endDate = new Date(end_date);
        parsedEndDate = {
          day: endDate.getDate().toString().padStart(2, '0'),
          month: (endDate.getMonth() + 1).toString().padStart(2, '0'),
          year: endDate.getFullYear().toString()
        };
      }
      
      setPostgraduateData(prev => ({
        ...prev,
        passportPhoto: passportPhoto || prev.passportPhoto,
        academicSession: academic_session || prev.academicSession,
        programType: (program_type as "Postgraduate Diploma/Taught Masters" | "MSc" | "PhD") || prev.programType,
        program: selected_program || prev.program,
        applicationFee: paymentReceipt || prev.applicationFee,
        paymentEvidence: paymentReceipt || prev.paymentEvidence,
        personalDetails: {
          ...prev.personalDetails,
          surname: surname || prev.personalDetails.surname,
          firstName: first_name || prev.personalDetails.firstName,
          otherNames: other_names || prev.personalDetails.otherNames,
          gender: gender || prev.personalDetails.gender,
          dateOfBirth: {
            day: parsedDateOfBirth.day || prev.personalDetails.dateOfBirth.day,
            month: parsedDateOfBirth.month || prev.personalDetails.dateOfBirth.month,
            year: parsedDateOfBirth.year || prev.personalDetails.dateOfBirth.year
          },
          streetAddress: street_address || prev.personalDetails.streetAddress,
          city: city || prev.personalDetails.city,
          country: country || prev.personalDetails.country,
          stateOfOrigin: state_of_origin || prev.personalDetails.stateOfOrigin,
          nationality: nationality || prev.personalDetails.nationality,
          phoneNumber: phone_number || prev.personalDetails.phoneNumber,
          email: email || prev.personalDetails.email,
          hasDisabilities: has_disability ? "Yes" : "No",
          disabilityDescription: disability_description || prev.personalDetails.disabilityDescription
        },
        academicQualifications: {
          ...prev.academicQualifications,
          qualification1: {
            ...prev.academicQualifications.qualification1,
            type: qualification_type || prev.academicQualifications.qualification1.type,
            grade: grade || prev.academicQualifications.qualification1.grade,
            cgpa: cgpa || prev.academicQualifications.qualification1.cgpa,
            subject: subject || prev.academicQualifications.qualification1.subject,
            institution: awarding_institution || prev.academicQualifications.qualification1.institution,
            startDate: {
              day: parsedStartDate.day || prev.academicQualifications.qualification1.startDate.day,
              month: parsedStartDate.month || prev.academicQualifications.qualification1.startDate.month,
              year: parsedStartDate.year || prev.academicQualifications.qualification1.startDate.year
            },
            endDate: {
              day: parsedEndDate.day || prev.academicQualifications.qualification1.endDate.day,
              month: parsedEndDate.month || prev.academicQualifications.qualification1.endDate.month,
              year: parsedEndDate.year || prev.academicQualifications.qualification1.endDate.year
            },
            documents: qualificationDocs.length > 0 ? qualificationDocs : prev.academicQualifications.qualification1.documents
          },
          otherQualifications: otherQualifications || prev.academicQualifications.otherQualifications
        },
        statementOfPurpose: statementOfPurpose ? [statementOfPurpose] : prev.statementOfPurpose,
        references: {
          referee1: {
            name: first_referee_name || prev.references.referee1.name,
            email: first_referee_email || prev.references.referee1.email
          },
          referee2: {
            name: second_referee_name || prev.references.referee2.name,
            email: second_referee_email || prev.references.referee2.email
          }
        }
      }));
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
    subField: "type" | "grade" | "cgpa" | "subject" | "institution" | "otherType" | "documents" | null,
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
    const { personalDetails, academicQualifications, programType, applicantType } = postgraduateData;
    
    // Basic personal details validation
    if (!personalDetails.surname || !personalDetails.firstName || !personalDetails.gender || 
        !personalDetails.dateOfBirth.day || !personalDetails.dateOfBirth.month || !personalDetails.dateOfBirth.year ||
        !personalDetails.streetAddress || !personalDetails.city || !personalDetails.country ||
        !personalDetails.phoneNumber || !personalDetails.email) {
      return false;
    }

    // Validate nationality based on applicant type
    if ((applicantType === "Nigerian" && personalDetails.nationality !== "Nigerian") ||
        (applicantType === "International" && !personalDetails.nationality)) {
      return false;
    }

    // Validate state of origin only for Nigerian applicants
    if (applicantType === "Nigerian" && !personalDetails.stateOfOrigin) {
      return false;
    }

    // Validate first academic qualification
    const qual1 = academicQualifications.qualification1;
    if (!qual1.type || !qual1.grade || !qual1.cgpa || !qual1.subject || !qual1.institution ||
        !qual1.startDate.day || !qual1.startDate.month || !qual1.startDate.year ||
        !qual1.endDate.day || !qual1.endDate.month || !qual1.endDate.year ||
        qual1.documents.length === 0) {
      return false;
    }

    // Validate second academic qualification for PhD students
    if (programType === "PhD") {
      const qual2 = academicQualifications.qualification2;
      if (!qual2 || !qual2.type || !qual2.grade || !qual2.cgpa || !qual2.subject || !qual2.institution ||
          !qual2.startDate.day || !qual2.startDate.month || !qual2.startDate.year ||
          !qual2.endDate.day || !qual2.endDate.month || !qual2.endDate.year ||
          qual2.documents.length === 0) {
        return false;
      }
    }

    // Validate statement of purpose
    if (postgraduateData.statementOfPurpose.length === 0) {
      return false;
    }

    // Validate references
    const { referee1, referee2 } = postgraduateData.references;
    if (!referee1.name || !referee1.email || !referee2.name || !referee2.email) {
      return false;
    }

    // Validate declaration
    if (!postgraduateData.declaration) {
      return false;
    }

    // Validate required files
    if (!postgraduateData.passportPhoto || !postgraduateData.paymentEvidence) {
      return false;
    }

    return true;
  };

  const handleSaveAsDraft = async () => {
    setIsSaving(true);
    
    try {
      // Create a copy of the form data
      const formData = new FormData();
      
      // Get the access token from localStorage
      const accessToken = localStorage.getItem('accessToken');
      
      // Add the token to the form data
      if (accessToken) {
        formData.append('token', accessToken);
      } else {
        toast.error("Authentication error", {
          description: "You are not logged in. Please log in and try again.",
          duration: 5000,
        });
        return;
      }
      
      // Add is_draft flag
      formData.append('is_draft', 'true');
      
      // Append personal details
      formData.append("surname", postgraduateData.personalDetails.surname);
      formData.append("first_name", postgraduateData.personalDetails.firstName);
      formData.append("gender", postgraduateData.personalDetails.gender);
      formData.append("date_of_birth", `${postgraduateData.personalDetails.dateOfBirth.year}-${postgraduateData.personalDetails.dateOfBirth.month}-${postgraduateData.personalDetails.dateOfBirth.day}`);
      formData.append("street_address", postgraduateData.personalDetails.streetAddress);
      formData.append("city", postgraduateData.personalDetails.city);
      formData.append("country", postgraduateData.personalDetails.country);
      formData.append("nationality", postgraduateData.personalDetails.nationality);
      formData.append("phone_number", postgraduateData.personalDetails.phoneNumber);
      formData.append("email", postgraduateData.personalDetails.email);
      
      // Append program details
      if (postgraduateData.programType) {
        formData.append("program_type", postgraduateData.programType);
      }
      if (postgraduateData.applicantType) {
        formData.append("applicant_type", postgraduateData.applicantType);
      }
      
      // Append academic qualifications
      if (postgraduateData.academicQualifications.qualification1.type) {
        formData.append("degree", postgraduateData.academicQualifications.qualification1.type);
      }
      if (postgraduateData.academicQualifications.qualification1.institution) {
        formData.append("institution", postgraduateData.academicQualifications.qualification1.institution);
      }
      if (postgraduateData.academicQualifications.qualification1.endDate.year) {
        formData.append("year", postgraduateData.academicQualifications.qualification1.endDate.year);
      }
      if (postgraduateData.academicQualifications.qualification1.grade) {
        formData.append("class_of_degree", postgraduateData.academicQualifications.qualification1.grade);
      }
      
      // Append references
      if (postgraduateData.references.referee1.name) {
        formData.append("referee1_name", postgraduateData.references.referee1.name);
      }
      if (postgraduateData.references.referee1.email) {
        formData.append("referee1_email", postgraduateData.references.referee1.email);
      }
      if (postgraduateData.references.referee2.name) {
        formData.append("referee2_name", postgraduateData.references.referee2.name);
      }
      if (postgraduateData.references.referee2.email) {
        formData.append("referee2_email", postgraduateData.references.referee2.email);
      }
      
      // Append statement of purpose
      if (postgraduateData.statementOfPurpose.length > 0) {
        formData.append("statement_of_purpose", postgraduateData.statementOfPurpose[0]);
      }
      
      // Append declaration
      if (postgraduateData.declaration) {
        formData.append("declaration", postgraduateData.declaration.toString());
      }
      
      // Append files if they exist
      if (postgraduateData.passportPhoto) {
        formData.append("passport_photo", postgraduateData.passportPhoto);
      }
      if (postgraduateData.paymentEvidence) {
        formData.append("payment_evidence", postgraduateData.paymentEvidence);
      }
      
      // Use the new submitDraftApplication function instead of submitApplication
      const response = await apiService.submitDraftApplication(formData);
      
      // Save to localStorage for later retrieval
      localStorage.setItem("postgraduateApplicationData", JSON.stringify(postgraduateData));
      
      toast.success("Application saved as draft", {
        description: "Your application has been saved successfully. You can continue editing later.",
        duration: 5000,
      });
    } catch (error) {
      toast.error("Failed to save draft", {
        description: "There was an error saving your application. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const validateRefereeEmail = (email: string): boolean => {
    // Check if it's a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    // Check if it's an academic email (contains .edu, .ac, or other academic domains)
    const academicDomains = [
      '.edu',
      '.ac.',
      '.sch.',
      '.school',
      '.college',
      '.university',
      '.institute',
      '.edu.',
      '.ac',
      '.sch',
      '.school.',
      '.college.',
      '.university.',
      '.institute.'
    ];

    return academicDomains.some(domain => email.toLowerCase().includes(domain));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate referee emails
      if (!validateRefereeEmail(postgraduateData.references.referee1.email) || !validateRefereeEmail(postgraduateData.references.referee2.email)) {
        setError('Please provide valid academic email addresses for both referees');
        setIsSubmitting(false);
        return;
      }

      if (!isFormValid()) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      
      // Get the access token from localStorage
      const accessToken = localStorage.getItem('accessToken');
      
      // Add the token to the form data
      if (accessToken) {
        formData.append('token', accessToken);
      } else {
        toast.error("Authentication error", {
          description: "You are not logged in. Please log in and try again.",
          duration: 5000,
        });
        return;
      }
      
      // Append personal details
      formData.append("surname", postgraduateData.personalDetails.surname);
      formData.append("first_name", postgraduateData.personalDetails.firstName);
      formData.append("gender", postgraduateData.personalDetails.gender);
      formData.append("date_of_birth", `${postgraduateData.personalDetails.dateOfBirth.year}-${postgraduateData.personalDetails.dateOfBirth.month}-${postgraduateData.personalDetails.dateOfBirth.day}`);
      formData.append("street_address", postgraduateData.personalDetails.streetAddress);
      formData.append("city", postgraduateData.personalDetails.city);
      formData.append("country", postgraduateData.personalDetails.country);
      formData.append("nationality", postgraduateData.personalDetails.nationality);
      formData.append("phone_number", postgraduateData.personalDetails.phoneNumber);
      formData.append("email", postgraduateData.personalDetails.email);
      
      // Append program details
      formData.append("program_type", postgraduateData.programType);
      formData.append("applicant_type", postgraduateData.applicantType);
      
      // Append academic qualifications
      formData.append("degree", postgraduateData.academicQualifications.qualification1.type);
      formData.append("institution", postgraduateData.academicQualifications.qualification1.institution);
      formData.append("year", postgraduateData.academicQualifications.qualification1.endDate.year);
      formData.append("class_of_degree", postgraduateData.academicQualifications.qualification1.grade);
      
      // Append references
      formData.append("referee1_name", postgraduateData.references.referee1.name);
      formData.append("referee1_email", postgraduateData.references.referee1.email);
      formData.append("referee2_name", postgraduateData.references.referee2.name);
      formData.append("referee2_email", postgraduateData.references.referee2.email);
      
      // Append statement of purpose
      if (postgraduateData.statementOfPurpose.length > 0) {
        formData.append("statement_of_purpose", postgraduateData.statementOfPurpose[0]);
      }
      
      // Append declaration
      formData.append("declaration", postgraduateData.declaration.toString());
      
      // Append files if they exist
      if (postgraduateData.passportPhoto) {
        formData.append("passport_photo", postgraduateData.passportPhoto);
      }
      if (postgraduateData.paymentEvidence) {
        formData.append("payment_evidence", postgraduateData.paymentEvidence);
      }
      
      const response = await apiService.submitApplication(formData);
      toast.success("Application submitted successfully!");
      
      // Clear form data from localStorage after successful submission
      localStorage.removeItem("postgraduateApplicationData");
      
      // After successful submission
      navigate('/application-success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  // Function to fetch universities with caching and optimization
  const fetchUniversities = async (query: string) => {
    if (query.length < 3) {
      setUniversities([]);
      return;
    }
    
    // Check cache first
    if (universityCache[query]) {
      setUniversities(universityCache[query]);
      return;
    }
    
    setIsLoadingUniversities(true);
    try {
      const response = await fetch(`http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`);
      const data = await response.json();
      // Limit results to 20 universities for better performance
      const limitedData = data.slice(0, 20);
      setUniversities(limitedData);
      // Cache the results
      setUniversityCache(prev => ({
        ...prev,
        [query]: limitedData
      }));
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

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
     <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
  <h3 className="text-lg font-semibold">Application Fee Payment</h3>
  <div className="space-y-4">

    {/* Payment Info */}
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <p className="text-sm text-yellow-800 space-y-2">
        <strong>Application Fees (Non-refundable):</strong>
        <br />
        <span className="block mt-2">
          <strong>Nigerian Applicants:</strong> ₦50,000
        </span>
        <span className="block mt-2">
          <strong>International Applicants:</strong> $100
        </span>
        <div className="mt-4">
          <p className="font-medium">Payment Process:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Payment will be processed through Paystack</li>
            <li>Nigerian applicants will be redirected to Paystack NGN payment gateway</li>
            <li>International applicants will be redirected to Paystack USD payment gateway</li>
            <li>The Paystack payment popup will appear automatically when you click "Submit Application"</li>
            <li>A payment receipt will be automatically generated after successful payment</li>
          </ul>
        </div>
      </p>
    </div>

    {/* Applicant Type Section */}
    <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
      <h3 className="text-lg font-semibold">Applicant Type</h3>
      <div className="max-w-md">
        <div className="space-y-2">
          <Label>Are you a Nigerian or International Applicant? <span className="text-red-500 text-xs italic">Required</span></Label>
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
            <SelectTrigger>
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
  </div>
</div>


      {/* Passport Photo Upload */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Passport Photograph</h3>
        <div className="space-y-4">
          <FileUploadField
            id="passportPhoto"
            label={
              <>
                Passport Photograph <span className="text-red-500 text-xs italic">Required</span>
              </>
            }
            accept=".jpg,.jpeg,.png"
            value={postgraduateData.passportPhoto ? [postgraduateData.passportPhoto] : null}
            onChange={(files) => setPostgraduateData(prev => ({
              ...prev,
              passportPhoto: files ? files[0] : null
            }))}
            onRemove={() => setPostgraduateData(prev => ({
              ...prev,
              passportPhoto: null
            }))}
            maxSize="5MB"
          />
        </div>
      </div>

      {/* Program Selection */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Program Selection</h3>
        <div className="space-y-4">
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
                <SelectItem value="2024/2025">2024/2025 Academic Session</SelectItem>
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
<div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
  <h3 className="text-lg font-semibold">Personal Details</h3>
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Surname <span className="text-red-500 text-xs italic">Required</span></Label>
        <Input
          placeholder="Enter your surname"
          value={postgraduateData.personalDetails.surname}
          onChange={(e) => handlePersonalDetailsChange("surname", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>First Name <span className="text-red-500 text-xs italic">Required</span></Label>
        <Input
          placeholder="Enter your first name"
          value={postgraduateData.personalDetails.firstName}
          onChange={(e) => handlePersonalDetailsChange("firstName", e.target.value)}
          required
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label>Other Names</Label>
      <Input
        placeholder="Enter other names (if any)"
        value={postgraduateData.personalDetails.otherNames}
        onChange={(e) => handlePersonalDetailsChange("otherNames", e.target.value)}
      />
    </div>

    {/* Gender and Date of Birth side by side */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Gender <span className="text-red-500 text-xs italic">Required</span></Label>
        <Select
          value={postgraduateData.personalDetails.gender}
          onValueChange={(value) => handlePersonalDetailsChange("gender", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label>Date of Birth <span className="text-red-500 text-xs italic">Required</span></Label>
        <div className="grid grid-cols-3 gap-2">
          <Select
            value={postgraduateData.personalDetails.dateOfBirth.day}
            onValueChange={(value) => handleDateChange("dateOfBirth", "day", value)}
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
            value={postgraduateData.personalDetails.dateOfBirth.month}
            onValueChange={(value) => handleDateChange("dateOfBirth", "month", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={postgraduateData.personalDetails.dateOfBirth.year}
            onValueChange={(value) => handleDateChange("dateOfBirth", "year", value)}
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

    <div className="space-y-2">
      <Label>Street Address <span className="text-red-500 text-xs italic">Required</span></Label>
      <Input
        placeholder="Enter your street address"
        value={postgraduateData.personalDetails.streetAddress}
        onChange={(e) => handlePersonalDetailsChange("streetAddress", e.target.value)}
        required
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>City <span className="text-red-500 text-xs italic">Required</span></Label>
        <Input
          placeholder="Enter your city"
          value={postgraduateData.personalDetails.city}
          onChange={(e) => handlePersonalDetailsChange("city", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Country <span className="text-red-500 text-xs italic">Required</span></Label>
        <Select
          value={postgraduateData.personalDetails.country}
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

    {/* Nationality and State of Origin side by side */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Nationality <span className="text-red-500 text-xs italic">Required</span></Label>
        {postgraduateData.applicantType === "Nigerian" ? (
          <Input value="Nigerian" disabled className="bg-gray-100" />
        ) : (
          <Select
            value={postgraduateData.personalDetails.nationality}
            onValueChange={(value) => handlePersonalDetailsChange("nationality", value)}
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
        )}
      </div>

      {postgraduateData.applicantType === "Nigerian" && (
        <div className="space-y-2">
          <Label>State of Origin <span className="text-red-500 text-xs italic">Required</span></Label>
          <Select
            value={postgraduateData.personalDetails.stateOfOrigin}
            onValueChange={(value) => handlePersonalDetailsChange("stateOfOrigin", value)}
          >
            <SelectTrigger>
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

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Phone Number <span className="text-red-500 text-xs italic">Required</span></Label>
        <PhoneInput
          international
          defaultCountry="NG"
          value={postgraduateData.personalDetails.phoneNumber}
          onChange={(value) => handlePersonalDetailsChange("phoneNumber", value || "")}
          className="!flex !items-center !gap-2 [&>input]:!flex-1 [&>input]:!h-10 [&>input]:!rounded-md [&>input]:!border [&>input]:!border-input [&>input]:!bg-background [&>input]:!px-3 [&>input]:!py-2 [&>input]:!text-sm [&>input]:!ring-offset-background [&>input]:!placeholder:text-muted-foreground [&>input]:!focus-visible:outline-none [&>input]:!focus-visible:ring-2 [&>input]:!focus-visible:ring-ring [&>input]:!focus-visible:ring-offset-2 [&>input]:!disabled:cursor-not-allowed [&>input]:!disabled:opacity-50"
          placeholder="Enter phone number"
        />
      </div>
      <div className="space-y-2">
        <Label>Email <span className="text-red-500 text-xs italic">Required</span></Label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={postgraduateData.personalDetails.email}
          onChange={(e) => handlePersonalDetailsChange("email", e.target.value)}
          required
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label>Do you have any disabilities? <span className="text-red-500 text-xs italic">Required</span></Label>
      <div className="max-w-md">
        <Select
          value={postgraduateData.personalDetails.hasDisabilities}
          onValueChange={(value) => handlePersonalDetailsChange("hasDisabilities", value)}
        >
          <SelectTrigger>
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
      <div className="space-y-2">
        <Label>Please describe your disability <span className="text-red-500 text-xs italic">Required</span></Label>
        <Input
          placeholder="Describe your disability"
          value={postgraduateData.personalDetails.disabilityDescription}
          onChange={(e) => handlePersonalDetailsChange("disabilityDescription", e.target.value)}
        />
      </div>
    )}
  </div>
</div>


      {/* Academic Qualifications Section */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Academic Qualifications</h3>
        
        {/* Required Documents Section */}
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

          <FileUploadField
            id="degreeCertificate"
            label={
              <>
                Degree Certificate <span className="text-red-500 text-xs italic">Required</span>
              </>
            }
            accept=".pdf,.jpg,.jpeg,.png"
            value={postgraduateData.academicQualifications.qualification1.documents}
            onChange={(files) => handleAcademicQualificationChange("qualification1", "documents", files)}
            onRemove={() => handleAcademicQualificationChange("qualification1", "documents", [])}
            multiple
          />

          <FileUploadField
            id="academicTranscript"
            label={
              <>
                Academic Transcript <span className="text-red-500 text-xs italic">Required</span>
              </>
            }
            accept=".pdf,.jpg,.jpeg,.png"
            value={postgraduateData.academicQualifications.qualification1.documents}
            onChange={(files) => handleAcademicQualificationChange("qualification1", "documents", files)}
            onRemove={() => handleAcademicQualificationChange("qualification1", "documents", [])}
            multiple
          />
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
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {postgraduateData.academicQualifications.qualification1.type === "other" && (
              <div className="space-y-2">
                <Label>Specify Other Qualification <span className="text-red-500">Required</span></Label>
                <Input
                  placeholder="Enter other qualification"
                  value={postgraduateData.academicQualifications.qualification1.otherType}
                  onChange={(e) => handleAcademicQualificationChange("qualification1", "otherType", e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Grade <span className="text-red-500">Required</span></Label>
              <Select
                value={postgraduateData.academicQualifications.qualification1.grade}
                onValueChange={(value) => handleAcademicQualificationChange("qualification1", "grade", value)}
              >
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label>CGPA <span className="text-red-500">Required</span></Label>
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
              />
            </div>

            <div className="space-y-2">
              <Label>Subject <span className="text-red-500">Required</span></Label>
              <Input
                placeholder="Enter subject"
                value={postgraduateData.academicQualifications.qualification1.subject}
                onChange={(e) => handleAcademicQualificationChange("qualification1", "subject", e.target.value)}
              />
            </div>

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

            <div className="space-y-2">
              <Label>Start Date <span className="text-red-500">Required</span></Label>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={postgraduateData.academicQualifications.qualification1.startDate.day}
                  onValueChange={(value) => handleAcademicDateChange("qualification1", "startDate", "day", value)}
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
                  value={postgraduateData.academicQualifications.qualification1.startDate.month}
                  onValueChange={(value) => handleAcademicDateChange("qualification1", "startDate", "month", value)}
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
                  value={postgraduateData.academicQualifications.qualification1.startDate.year}
                  onValueChange={(value) => handleAcademicDateChange("qualification1", "startDate", "year", value)}
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
                  value={postgraduateData.academicQualifications.qualification1.endDate.day}
                  onValueChange={(value) => handleAcademicDateChange("qualification1", "endDate", "day", value)}
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
                  value={postgraduateData.academicQualifications.qualification1.endDate.month}
                  onValueChange={(value) => handleAcademicDateChange("qualification1", "endDate", "month", value)}
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
                    value={postgraduateData.academicQualifications.qualification2?.endDate.year}
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

            <FileUploadField
              id="qualification2Documents"
              label={
                <>
                  Upload Qualification Documents <span className="text-red-500 text-xs italic">Required</span>
                </>
              }
              accept=".pdf,.doc,.docx"
              value={postgraduateData.academicQualifications.qualification2?.documents}
              onChange={(files) => handleAcademicQualificationChange("qualification2", "documents", files)}
              onRemove={() => handleAcademicQualificationChange("qualification2", "documents", [])}
              multiple
            />
          </div>
        

        {/* Other Qualifications */}
        <div className="space-y-4">
          <h4 className="font-medium">Other Qualifications (Optional)</h4>
          <FileUploadField
            id="otherQualifications"
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

      {/* Statement of Purpose */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">
          {postgraduateData.programType === "PhD" ? "Research Proposal" : "Statement of Purpose"}
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              {postgraduateData.programType === "PhD" ? (
                <>
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
                </>
              ) : (
                <>
                  As an applicant, please provide a one page summary of your reason for selecting the course for which you are applying. You should include:
                  <br />- Your interest and experience in this subject area
                  <br />- Your reason for choosing the particular course
                  <br />- How the course of study connects to your future plan
                </>
              )}
            </p>
          </div>
          <FileUploadField
            id="statementOfPurpose"
            label={
              <>
                {postgraduateData.programType === "PhD" ? "Research Proposal" : "Statement of Purpose"} <span className="text-red-500 text-xs italic">Required</span>
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

      {/* Additional Documents for PhD Applicants */}
      {postgraduateData.programType === "PhD" && (
        <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
          <h3 className="text-lg font-semibold">Additional Required Documents for PhD Applicants</h3>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Please upload the following additional documents required for PhD applications:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Updated CV/Resume</li>
                  <li>Birth Certificate or Declaration of Age</li>
                  <li>O'Level Results (WAEC/NECO)</li>
                  <li>Bachelor's Degree Certificate and Transcript</li>
                  <li>Master's Degree Certificate and Transcript</li>
                  <li>Payment Receipt for Application Form</li>
                </ul>
              </p>
            </div>

            <FileUploadField
              id="cv"
              label={
                <>
                  Updated CV/Resume <span className="text-red-500 text-xs italic">Required</span>
                </>
              }
              accept=".pdf,.doc,.docx"
              value={postgraduateData.academicQualifications.otherQualifications ? [postgraduateData.academicQualifications.otherQualifications] : null}
              onChange={(files) => {
                const file = files && files.length > 0 ? files[0] : null;
                handleAcademicQualificationChange("otherQualifications", null, file);
              }}
              onRemove={() => handleAcademicQualificationChange("otherQualifications", null, null)}
            />

            <FileUploadField
              id="birthCertificate"
              label={
                <>
                  Birth Certificate/Declaration of Age <span className="text-red-500 text-xs italic">Required</span>
                </>
              }
              accept=".pdf,.jpg,.jpeg,.png"
              value={postgraduateData.academicQualifications.otherQualifications ? [postgraduateData.academicQualifications.otherQualifications] : null}
              onChange={(files) => {
                const file = files && files.length > 0 ? files[0] : null;
                handleAcademicQualificationChange("otherQualifications", null, file);
              }}
              onRemove={() => handleAcademicQualificationChange("otherQualifications", null, null)}
            />

            <FileUploadField
              id="olevelResults"
              label={
                <>
                  O'Level Results (WAEC/NECO) <span className="text-red-500 text-xs italic">Required</span>
                </>
              }
              accept=".pdf,.jpg,.jpeg,.png"
              value={postgraduateData.academicQualifications.otherQualifications ? [postgraduateData.academicQualifications.otherQualifications] : null}
              onChange={(files) => {
                const file = files && files.length > 0 ? files[0] : null;
                handleAcademicQualificationChange("otherQualifications", null, file);
              }}
              onRemove={() => handleAcademicQualificationChange("otherQualifications", null, null)}
            />
          </div>
        </div>
      )}

     {/* References Section */}
<div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
  <h3 className="text-lg font-semibold">Academic References</h3>
  <div className="space-y-4">
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <p className="text-sm text-yellow-800">
        It is your responsibility to ensure that you provide TWO references to support your application. Your
        referees must be able to comment on your academic suitability for the program. A secure link will be sent to the email address of each referee — they must fill it or you cannot proceed with your application.
        <br />
        ⚠️ <strong>Only institutional or corporate email addresses will receive the reference link.</strong>
        <br />
        <strong>✅ Accepted:</strong> example@university.edu, example@company.com
        <br />
        <strong>❌ Not accepted:</strong> example@gmail.com, example@yahoo.com, example@outlook.com
      </p>
    </div>

    {/* Referee 1 */}
    <div className="space-y-4">
      <h4 className="font-medium">Referee 1</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name <span className="text-red-500 text-xs italic">Required</span></Label>
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
          />
        </div>
        <div className="space-y-2">
          <Label>Email Address <span className="text-red-500 text-xs italic">Required</span></Label>
          <Input
            type="email"
            placeholder="Enter referee's email"
            value={postgraduateData.references.referee1.email}
            onChange={(e) => setPostgraduateData(prev => ({
              ...prev,
              references: {
                ...prev.references,
                referee1: {
                  ...prev.references.referee1,
                  email: e.target.value
                }
              }
            }))}
          />
        </div>
      </div>
    </div>

    {/* Referee 2 */}
    <div className="space-y-4">
      <h4 className="font-medium">Referee 2</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name <span className="text-red-500 text-xs italic">Required</span></Label>
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
          />
        </div>
        <div className="space-y-2">
          <Label>Email Address <span className="text-red-500 text-xs italic">Required</span></Label>
          <Input
            type="email"
            placeholder="Enter referee's email"
            value={postgraduateData.references.referee2.email}
            onChange={(e) => setPostgraduateData(prev => ({
              ...prev,
              references: {
                ...prev.references,
                referee2: {
                  ...prev.references.referee2,
                  email: e.target.value
                }
              }
            }))}
          />
        </div>
      </div>
    </div>
  </div>
</div>


      {/* Declaration */}
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Payment Information</h3>
        <div className="space-y-2 text-blue-800">
          <p className="text-sm">
            <span className="font-medium">Application Fee:</span> ₦50,000 (Nigerian Applicants) / $100 (International Applicants)
          </p>
          <p className="text-sm">
            <span className="font-medium">Payment Method:</span> Paystack
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-sm font-medium">Important Notes:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Nigerian applicants will be redirected to Paystack NGN payment gateway</li>
              <li>International applicants will be redirected to Paystack USD payment gateway</li>
              <li>Payment must be completed to submit your application</li>
              <li>A payment receipt will be automatically generated after successful payment</li>
            </ul>
          </div>
          <p className="text-sm italic text-blue-600 mt-2">
            When you click "Submit Application", the Paystack payment popup will appear automatically.
          </p>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveAsDraft}
          disabled={isSubmitting}
        >
          Save as Draft
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
};

export default PostgraduateForm;