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
import { Upload, X, Check } from "lucide-react";
import { toast } from "sonner";
import { getCurrentAcademicSession } from "@/utils/academicSession";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

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

const PostgraduateForm = () => {
  // Get application data from localStorage if available
  const [applicationData, setApplicationData] = useState<ApplicationData>({});

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
          
          console.log("Application program_type:", programType);
          console.log("Saved programType:", savedProgramType);
          
          // Only redirect if program type exists and is different from 'postgraduate'
          if (programType && 
              programType !== 'postgraduate' && 
              programType !== 'msc' && 
              programType !== 'phd' && 
              savedProgramType && 
              savedProgramType !== 'postgraduate') {
            console.log(`Redirecting from postgraduate to ${programType} form based on application data`);
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
            console.log(`Redirecting from postgraduate to ${userProgram} form based on user program`);
            window.location.href = `/document-upload?type=${userProgram}`;
          }
        }
      }
    } catch (error) {
      console.error("Error parsing application data:", error);
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
        nationality,
        gender,
        date_of_birth,
        street_address,
        city,
        country,
        state_of_origin,
        phone_number,
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
      
      setPostgraduateData(prev => ({
        ...prev,
        passportPhoto: passportPhoto,
        academicSession: academic_session || prev.academicSession,
        program: selected_program || prev.program,
        applicationFee: paymentReceipt,
        personalDetails: {
          ...prev.personalDetails,
          gender: gender || prev.personalDetails.gender,
          dateOfBirth: date_of_birth ? {
            day: new Date(date_of_birth).getDate().toString().padStart(2, '0'),
            month: (new Date(date_of_birth).getMonth() + 1).toString().padStart(2, '0'),
            year: new Date(date_of_birth).getFullYear().toString()
          } : prev.personalDetails.dateOfBirth,
          streetAddress: street_address || prev.personalDetails.streetAddress,
          city: city || prev.personalDetails.city,
          country: country || prev.personalDetails.country,
          stateOfOrigin: state_of_origin || prev.personalDetails.stateOfOrigin,
          nationality: nationality || prev.personalDetails.nationality,
          phoneNumber: phone_number || prev.personalDetails.phoneNumber,
          hasDisabilities: has_disability ? "Yes" : "No",
          disabilityDescription: disability_description || prev.personalDetails.disabilityDescription
        },
        academicQualifications: {
          ...prev.academicQualifications,
          qualification1: {
            ...prev.academicQualifications.qualification1,
            institution: awarding_institution || prev.academicQualifications.qualification1.institution,
            type: qualification_type || prev.academicQualifications.qualification1.type,
            subject: subject || prev.academicQualifications.qualification1.subject,
            grade: grade || prev.academicQualifications.qualification1.grade,
            cgpa: cgpa || prev.academicQualifications.qualification1.cgpa,
            // Convert start and end dates from API to form format
            startDate: start_date ? {
              day: new Date(start_date).getDate().toString().padStart(2, '0'),
              month: (new Date(start_date).getMonth() + 1).toString().padStart(2, '0'),
              year: new Date(start_date).getFullYear().toString()
            } : prev.academicQualifications.qualification1.startDate,
            endDate: end_date ? {
              day: new Date(end_date).getDate().toString().padStart(2, '0'),
              month: (new Date(end_date).getMonth() + 1).toString().padStart(2, '0'),
              year: new Date(end_date).getFullYear().toString()
            } : prev.academicQualifications.qualification1.endDate,
            documents: qualificationDocs.length > 0 ? qualificationDocs : prev.academicQualifications.qualification1.documents
          },
          qualification2: prev.programType === "PhD" ? {
            type: qualification_type || prev.academicQualifications.qualification2?.type,
            grade: grade || prev.academicQualifications.qualification2?.grade,
            cgpa: cgpa || prev.academicQualifications.qualification2?.cgpa,
            subject: subject || prev.academicQualifications.qualification2?.subject,
            institution: awarding_institution || prev.academicQualifications.qualification2?.institution,
            startDate: start_date ? {
              day: new Date(start_date).getDate().toString().padStart(2, '0'),
              month: (new Date(start_date).getMonth() + 1).toString().padStart(2, '0'),
              year: new Date(start_date).getFullYear().toString()
            } : prev.academicQualifications.qualification2?.startDate,
            endDate: end_date ? {
              day: new Date(end_date).getDate().toString().padStart(2, '0'),
              month: (new Date(end_date).getMonth() + 1).toString().padStart(2, '0'),
              year: new Date(end_date).getFullYear().toString()
            } : prev.academicQualifications.qualification2?.endDate,
            documents: qualificationDocs.length > 0 ? qualificationDocs : prev.academicQualifications.qualification2?.documents
          } : undefined,
          otherQualifications: otherQualifications || prev.academicQualifications.otherQualifications
        },
        statementOfPurpose: statementOfPurpose ? [statementOfPurpose] : prev.statementOfPurpose,
        references: {
          referee1: {
            name: first_referee_name || prev.references.referee1.name,
            email: first_referee_email || prev.references.referee1.email,
          },
          referee2: {
            name: second_referee_name || prev.references.referee2.name,
            email: second_referee_email || prev.references.referee2.email,
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
      console.log('Personal details validation failed:', {
        surname: !!personalDetails.surname,
        firstName: !!personalDetails.firstName,
        gender: !!personalDetails.gender,
        dateOfBirth: !!personalDetails.dateOfBirth,
        streetAddress: !!personalDetails.streetAddress,
        city: !!personalDetails.city,
        country: !!personalDetails.country,
        phoneNumber: !!personalDetails.phoneNumber,
        email: !!personalDetails.email
      });
      return false;
    }

    // Validate nationality based on applicant type
    if ((applicantType === "Nigerian" && personalDetails.nationality !== "Nigerian") ||
        (applicantType === "International" && !personalDetails.nationality)) {
      console.log('Nationality validation failed:', {
        applicantType,
        nationality: personalDetails.nationality
      });
      return false;
    }

    // Validate state of origin only for Nigerian applicants
    if (applicantType === "Nigerian" && !personalDetails.stateOfOrigin) {
      console.log('State of origin validation failed:', {
        stateOfOrigin: personalDetails.stateOfOrigin
      });
      return false;
    }

    // Validate first academic qualification
    const qual1 = academicQualifications.qualification1;
    if (!qual1.type || !qual1.grade || !qual1.cgpa || !qual1.subject || !qual1.institution ||
        !qual1.startDate.day || !qual1.startDate.month || !qual1.startDate.year ||
        !qual1.endDate.day || !qual1.endDate.month || !qual1.endDate.year ||
        qual1.documents.length === 0) {
      console.log('First qualification validation failed:', {
        type: !!qual1.type,
        grade: !!qual1.grade,
        cgpa: !!qual1.cgpa,
        subject: !!qual1.subject,
        institution: !!qual1.institution,
        startDate: !!qual1.startDate,
        endDate: !!qual1.endDate,
        documents: qual1.documents.length > 0
      });
      return false;
    }

    // Validate second academic qualification for PhD students
    if (programType === "PhD") {
      const qual2 = academicQualifications.qualification2;
      if (!qual2 || !qual2.type || !qual2.grade || !qual2.cgpa || !qual2.subject || !qual2.institution ||
          !qual2.startDate.day || !qual2.startDate.month || !qual2.startDate.year ||
          !qual2.endDate.day || !qual2.endDate.month || !qual2.endDate.year ||
          qual2.documents.length === 0) {
        console.log('Second qualification validation failed:', {
          type: !!qual2?.type,
          grade: !!qual2?.grade,
          cgpa: !!qual2?.cgpa,
          subject: !!qual2?.subject,
          institution: !!qual2?.institution,
          startDate: !!qual2?.startDate,
          endDate: !!qual2?.endDate,
          documents: qual2?.documents.length > 0
        });
        return false;
      }
    }

    // Validate statement of purpose
    if (postgraduateData.statementOfPurpose.length === 0) {
      console.log('Statement of purpose validation failed:', {
        statementOfPurpose: postgraduateData.statementOfPurpose
      });
      return false;
    }

    // Validate references
    const { referee1, referee2 } = postgraduateData.references;
    if (!referee1.name || !referee1.email || !referee2.name || !referee2.email) {
      console.log('References validation failed:', {
        referee1: {
          name: !!referee1.name,
          email: !!referee1.email
        },
        referee2: {
          name: !!referee2.name,
          email: !!referee2.email
        }
      });
      return false;
    }

    // Validate declaration
    if (!postgraduateData.declaration) {
      console.log('Declaration validation failed:', {
        declaration: postgraduateData.declaration
      });
      return false;
    }

    // Validate required files
    if (!postgraduateData.passportPhoto || !postgraduateData.paymentEvidence) {
      console.log('Required files validation failed:', {
        passportPhoto: !!postgraduateData.passportPhoto,
        paymentEvidence: !!postgraduateData.paymentEvidence
      });
      return false;
    }

    return true;
  };

  const handleSaveAsDraft = async () => {
    setIsSaving(true);
    try {
      // Add your save logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      // Save to localStorage or your backend
      toast.custom((t) => (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <Check className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-900">Application saved as draft</h3>
            <p className="text-green-700 text-sm mt-1">
              Your application has been saved successfully. You can continue editing later.
            </p>
          </div>
        </div>
      ), {
        duration: 5000,
        style: {
          background: '#10B981', // Green background
          color: 'white',
        }
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft', {
        description: 'There was an error saving your application. Please try again.',
        duration: 5000,
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error('Form Validation Failed', {
        description: 'Please fill in all required fields correctly before submitting.',
        duration: 5000,
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Create FormData object
      const formData = new FormData();

      // Get user ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Authentication Error', {
          description: 'User ID not found. Please log in again.',
          duration: 5000,
        });
        return;
      }
      formData.append('user_id', userId);

      // Personal Details
      formData.append('first_name', postgraduateData.personalDetails.firstName);
      formData.append('last_name', postgraduateData.personalDetails.surname);
      formData.append('other_names', postgraduateData.personalDetails.otherNames);
      formData.append('gender', postgraduateData.personalDetails.gender);
      formData.append('date_of_birth', `${postgraduateData.personalDetails.dateOfBirth.year}-${postgraduateData.personalDetails.dateOfBirth.month}-${postgraduateData.personalDetails.dateOfBirth.day}`);
      formData.append('street_address', postgraduateData.personalDetails.streetAddress);
      formData.append('city', postgraduateData.personalDetails.city);
      formData.append('country', postgraduateData.personalDetails.country);
      formData.append('state_of_origin', postgraduateData.personalDetails.stateOfOrigin);
      formData.append('nationality', postgraduateData.personalDetails.nationality);
      formData.append('phone_number', postgraduateData.personalDetails.phoneNumber);
      formData.append('has_disability', postgraduateData.personalDetails.hasDisabilities === "Yes" ? "true" : "false");
      formData.append('disability_description', postgraduateData.personalDetails.disabilityDescription);

      // Program Details
      formData.append('program_type', postgraduateData.programType);
      formData.append('selected_program', postgraduateData.program);
      formData.append('academic_session', postgraduateData.academicSession);

      // Academic Qualifications
      formData.append('qualification_type', postgraduateData.academicQualifications.qualification1.type);
      formData.append('grade', postgraduateData.academicQualifications.qualification1.grade);
      formData.append('cgpa', postgraduateData.academicQualifications.qualification1.cgpa);
      formData.append('subject', postgraduateData.academicQualifications.qualification1.subject);
      formData.append('awarding_institution', postgraduateData.academicQualifications.qualification1.institution);
      formData.append('start_date', `${postgraduateData.academicQualifications.qualification1.startDate.year}-${postgraduateData.academicQualifications.qualification1.startDate.month}-${postgraduateData.academicQualifications.qualification1.startDate.day}`);
      formData.append('end_date', `${postgraduateData.academicQualifications.qualification1.endDate.year}-${postgraduateData.academicQualifications.qualification1.endDate.month}-${postgraduateData.academicQualifications.qualification1.endDate.day}`);

      // References
      formData.append('first_referee_name', postgraduateData.references.referee1.name);
      formData.append('first_referee_email', postgraduateData.references.referee1.email);
      formData.append('second_referee_name', postgraduateData.references.referee2.name);
      formData.append('second_referee_email', postgraduateData.references.referee2.email);

      // Files
      if (postgraduateData.passportPhoto) {
        formData.append('passport_photo', postgraduateData.passportPhoto);
      }
      if (postgraduateData.statementOfPurpose.length > 0) {
        formData.append('statement_of_purpose', postgraduateData.statementOfPurpose[0]);
      }
      if (postgraduateData.paymentEvidence) {
        formData.append('payment_receipt', postgraduateData.paymentEvidence);
      }
      if (postgraduateData.academicQualifications.qualification1.documents.length > 0) {
        formData.append('credentials_1', postgraduateData.academicQualifications.qualification1.documents[0]);
      }
      if (postgraduateData.academicQualifications.qualification2?.documents.length > 0) {
        formData.append('credentials_2', postgraduateData.academicQualifications.qualification2.documents[0]);
      }
      if (postgraduateData.academicQualifications.otherQualifications) {
        formData.append('other_qualifications', postgraduateData.academicQualifications.otherQualifications);
      }

      // Send the request to the backend
      const response = await fetch('https://admissions-qmt4.onrender.com/application/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      toast.success('Application Submitted Successfully', {
        description: 'Your application has been submitted. You will receive a confirmation email shortly.',
        duration: 5000,
        action: {
          label: "View Status",
          onClick: () => window.location.href = '/application-status'
        },
      });
      
      // Clear form data from localStorage after successful submission
      localStorage.removeItem('applicationData');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Submission Failed', {
        description: error instanceof Error 
          ? `Error: ${error.message}. Please try again or contact support if the problem persists.`
          : 'There was an error submitting your application. Please try again.',
        duration: 8000,
        action: {
          label: "Try Again",
          onClick: () => window.location.reload()
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <strong>Nigerian Applicants:</strong> ₦20,000
        </span>
        <span className="block mt-2">
          <strong>International Applicants:</strong> $50
        </span>

        <div className="mt-4 p-3 bg-white rounded border border-gray-200">
          {postgraduateData.applicantType === "Nigerian" ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Account Name:</span>
                <button
                  type="button"
                  onClick={() => handleCopy("African University of Science and Technology (AUST)", "nairaAccName")}
                  className="text-primary hover:text-primary/80 text-sm flex items-center gap-2"
                >
                  {copyStatus["nairaAccName"] ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="mb-2">African University of Science and Technology (AUST)</p>

              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Account Number (NGN):</span>
                <button
                  type="button"
                  onClick={() => handleCopy("1016087221", "nairaAccNum")}
                  className="text-primary hover:text-primary/80 text-sm flex items-center gap-2"
                >
                  {copyStatus["nairaAccNum"] ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="mb-2">1016087221</p>

              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Bank:</span>
                <button
                  type="button"
                  onClick={() => handleCopy("UBA Plc", "nairaBank")}
                  className="text-primary hover:text-primary/80 text-sm flex items-center gap-2"
                >
                  {copyStatus["nairaBank"] ? "Copied!" : "Copy"}
                </button>
              </div>
              <p>UBA Plc</p>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Account Name:</span>
                <button
                  type="button"
                  onClick={() => handleCopy("African University of Science and Technology (AUST USD)", "usdAccName")}
                  className="text-primary hover:text-primary/80 text-sm flex items-center gap-2"
                >
                  {copyStatus["usdAccName"] ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="mb-2">African University of Science and Technology (AUST USD)</p>

              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Account Number (USD):</span>
                <button
                  type="button"
                  onClick={() => handleCopy("3050500123", "usdAccNum")}
                  className="text-primary hover:text-primary/80 text-sm flex items-center gap-2"
                >
                  {copyStatus["usdAccNum"] ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="mb-2">3050500123</p>

              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Bank:</span>
                <button
                  type="button"
                  onClick={() => handleCopy("Zenith Bank", "usdBank")}
                  className="text-primary hover:text-primary/80 text-sm flex items-center gap-2"
                >
                  {copyStatus["usdBank"] ? "Copied!" : "Copy"}
                </button>
              </div>
              <p>Zenith Bank</p>
            </>
          )}
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

    {/* Upload Payment Evidence */}
    <FileUploadField
      id="paymentEvidence"
      label={
        <>
          Payment Evidence <span className="text-red-500 text-xs italic">Required</span>
        </>
      }
      accept=".jpg,.jpeg,.png,.pdf"
      value={postgraduateData.paymentEvidence ? [postgraduateData.paymentEvidence] : null}
      onChange={(files) => setPostgraduateData(prev => ({
        ...prev,
        paymentEvidence: files ? files[0] : null
      }))}
      onRemove={() => setPostgraduateData(prev => ({
        ...prev,
        paymentEvidence: null
      }))}
      maxSize="5MB"
    />
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
              <Input
                placeholder="Enter grade"
                value={postgraduateData.academicQualifications.qualification1.grade}
                onChange={(e) => handleAcademicQualificationChange("qualification1", "grade", e.target.value)}
              />
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
                  // Only allow numbers and decimal point
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
              <Input
                placeholder="Enter institution name"
                value={postgraduateData.academicQualifications.qualification1.institution}
                onChange={(e) => handleAcademicQualificationChange("qualification1", "institution", e.target.value)}
              />
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
                  value={postgraduateData.academicQualifications.qualification1.endDate.year}
                  onValueChange={(value) => handleAcademicDateChange("qualification1", "endDate", "year", value)}
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
            id="qualification1Documents"
            label={
              <>
                Upload Qualification Documents <span className="text-red-500 text-xs italic">Required</span>
              </>
            }
            accept=".pdf,.doc,.docx"
            value={postgraduateData.academicQualifications.qualification1.documents}
            onChange={(files) => handleAcademicQualificationChange("qualification1", "documents", files)}
            onRemove={() => handleAcademicQualificationChange("qualification1", "documents", [])}
            multiple
          />
        </div>

        {/* Second Academic Qualification (Only for PhD) */}
        {postgraduateData.programType === "PhD" && (
          <div className="space-y-4">
            <h4 className="font-medium"><b>Second Academic Qualification</b></h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Qualification Type <span className="text-red-500">Required</span></Label>
                <Select
                  value={postgraduateData.academicQualifications.qualification2?.type}
                  onValueChange={(value) => handleAcademicQualificationChange("qualification2", "type", value)}
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

              {postgraduateData.academicQualifications.qualification2?.type === "other" && (
                <div className="space-y-2">
                  <Label>Specify Other Qualification <span className="text-red-500">Required</span></Label>
                  <Input
                    placeholder="Enter other qualification"
                    value={postgraduateData.academicQualifications.qualification2.otherType}
                    onChange={(e) => handleAcademicQualificationChange("qualification2", "otherType", e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Grade <span className="text-red-500">Required</span></Label>
                <Input
                  placeholder="Enter grade"
                  value={postgraduateData.academicQualifications.qualification2?.grade}
                  onChange={(e) => handleAcademicQualificationChange("qualification2", "grade", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>CGPA <span className="text-red-500">Required</span></Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  placeholder="Enter CGPA"
                  value={postgraduateData.academicQualifications.qualification2?.cgpa}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers and decimal point
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      handleAcademicQualificationChange("qualification2", "cgpa", value);
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Subject <span className="text-red-500">Required</span></Label>
                <Input
                  placeholder="Enter subject"
                  value={postgraduateData.academicQualifications.qualification2?.subject}
                  onChange={(e) => handleAcademicQualificationChange("qualification2", "subject", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Institution <span className="text-red-500">Required</span></Label>
                <Input
                  placeholder="Enter institution name"
                  value={postgraduateData.academicQualifications.qualification2?.institution}
                  onChange={(e) => handleAcademicQualificationChange("qualification2", "institution", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Start Date <span className="text-red-500">Required</span></Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={postgraduateData.academicQualifications.qualification2?.startDate.day}
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
                    value={postgraduateData.academicQualifications.qualification2?.startDate.month}
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
                    value={postgraduateData.academicQualifications.qualification2?.startDate.year}
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
                    value={postgraduateData.academicQualifications.qualification2?.endDate.day}
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
                    value={postgraduateData.academicQualifications.qualification2?.endDate.month}
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
        )}

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
          Statement of Purpose 
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              As an applicant, please provide a one page summary of your reason for selecting the course for which you are applying. You should include:
              <br />- Your interest and experience in this subject area
              <br />- A brief research proposal (compulsory for all Ph.D. applicants)
              <br />- Your reason for choosing the particular course
              <br />- How the course of study connects to your future plan
              <br /><br />
              It is compulsory that ALL Ph.D. applicants complete this section, as we cannot process your application without it.
            </p>
          </div>
          <FileUploadField
            id="statementOfPurpose"
            label={
              <>
                Statement of Purpose {postgraduateData.programType === "PhD" && <span className="text-red-500 text-xs italic">Required</span>}
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
              By signing below, I confirm that the information I have provided in this form is true, complete and accurate, and no information or other material information has been omitted. I acknowledge that knowingly providing false information gives AUST the right to:
              <br />- cancel my application.
              <br />- if admitted, be dismissed from the University.
              <br />- if degree already awarded, rescind degree awarded.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Full Name (in lieu of signature) <span className="text-red-500 text-xs italic">Required</span></Label>
            <Input
              placeholder="Type your full name"
              value={postgraduateData.declaration}
              onChange={(e) => setPostgraduateData(prev => ({ ...prev, declaration: e.target.value }))}
              required
            />
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

      {/* Form Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-primary border-2 border-primary hover:bg-primary/5 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent"
          onClick={handleSaveAsDraft}
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            "Save as Draft"
          )}
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/80 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={!isFormValid() || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Application"
          )}
        </button>
      </div>
    </form>
  );
};

export default PostgraduateForm;