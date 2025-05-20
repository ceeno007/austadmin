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

// Helper to build FormData for undergraduate application with exact backend field names
function buildUndergraduateFormData(data) {
  const formData = new FormData();
  formData.append('state_of_origin', data.personalDetails.stateOfOrigin || '');
  formData.append('selected_program', data.selectedCourse || '');
  formData.append('gender', data.personalDetails.gender || '');
  formData.append('has_disability', data.personalDetails.hasDisabilities === 'yes' ? 'true' : 'false');
  if (data.passportPhoto) formData.append('passport_photo', data.passportPhoto);
  formData.append('jamb_reg_number', data.academicQualifications.jambResults.regNumber || '');
  formData.append('date_of_birth', `${data.personalDetails.dateOfBirth.year}-${data.personalDetails.dateOfBirth.month}-${data.personalDetails.dateOfBirth.day}`);
  formData.append('city', data.personalDetails.city || '');
  // Exam types and results
  const selectedExams = data.selectedExams || [];
  formData.append('exam_type_1', selectedExams[0] || '');
  formData.append('exam_type_2', selectedExams[1] || '');
  if (selectedExams[0]) {
    formData.append('exam_type_1_result', data.academicQualifications[`${selectedExams[0]}Results`].documents || '');
    formData.append('exam_year_1', data.academicQualifications[`${selectedExams[0]}Results`].examYear || '');
    formData.append('exam_number_1', data.academicQualifications[`${selectedExams[0]}Results`].examNumber || '');
    formData.append('subjects_1', JSON.stringify(data.academicQualifications[`${selectedExams[0]}Results`].subjects || []));
  }
  if (selectedExams[1]) {
    formData.append('exam_type_2_result', data.academicQualifications[`${selectedExams[1]}Results`].documents || '');
    formData.append('exam_year_2', data.academicQualifications[`${selectedExams[1]}Results`].examYear || '');
    formData.append('exam_number_2', data.academicQualifications[`${selectedExams[1]}Results`].examNumber || '');
    formData.append('subjects_2', JSON.stringify(data.academicQualifications[`${selectedExams[1]}Results`].subjects || []));
  }
  if (data.academicQualifications.jambResults.documents) formData.append('jamb_result', data.academicQualifications.jambResults.documents);
  formData.append('jamb_year', data.academicQualifications.jambResults.examYear || '');
  formData.append('program_type', 'undergraduate');
  formData.append('country', data.personalDetails.country || '');
  formData.append('applicant_type', 'fresh');
  formData.append('street_address', data.personalDetails.streetAddress || '');
  formData.append('disability_description', data.personalDetails.disabilityDescription || '');
  formData.append('other_names', data.personalDetails.otherNames || '');
  formData.append('first_name', data.personalDetails.firstName || '');
  formData.append('surname', data.personalDetails.surname || '');
  formData.append('phone_number', data.personalDetails.phoneNumber || '');
  formData.append('nationality', data.personalDetails.nationality || '');
  formData.append('email', data.personalDetails.email || '');
  formData.append('academic_session', data.academicSession || '');
  formData.append('jamb_score', data.academicQualifications.jambResults.score || '');
  return formData;
}

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
    setIsSaving(true);
    try {
      const formData = new FormData();
      // Helper to append only if value is filled
      const appendIfFilled = (key, value) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      };
      // Add personal details
      appendIfFilled("surname", undergraduateData.personalDetails.surname);
      appendIfFilled("first_name", undergraduateData.personalDetails.firstName);
      appendIfFilled("other_names", undergraduateData.personalDetails.otherNames);
      appendIfFilled("gender", undergraduateData.personalDetails.gender);
      if (
        undergraduateData.personalDetails.dateOfBirth.year &&
        undergraduateData.personalDetails.dateOfBirth.month &&
        undergraduateData.personalDetails.dateOfBirth.day
      ) {
        appendIfFilled(
          "date_of_birth",
          `${undergraduateData.personalDetails.dateOfBirth.year}-${undergraduateData.personalDetails.dateOfBirth.month}-${undergraduateData.personalDetails.dateOfBirth.day}`
        );
      }
      appendIfFilled("street_address", undergraduateData.personalDetails.streetAddress);
      appendIfFilled("city", undergraduateData.personalDetails.city);
      appendIfFilled("country", undergraduateData.personalDetails.country);
      appendIfFilled("state_of_origin", undergraduateData.personalDetails.stateOfOrigin);
      appendIfFilled("nationality", undergraduateData.personalDetails.nationality);
      appendIfFilled("phone_number", undergraduateData.personalDetails.phoneNumber);
      appendIfFilled("email", undergraduateData.personalDetails.email);
      appendIfFilled("has_disability", undergraduateData.personalDetails.hasDisabilities);
      appendIfFilled("disability_description", undergraduateData.personalDetails.disabilityDescription);
      // Add academic session and program details
      appendIfFilled("academic_session", undergraduateData.academicSession);
      appendIfFilled("program_type", "undergraduate");
      appendIfFilled("selected_course", undergraduateData.selectedCourse);
      // Add O'Level results
      const examResults = undergraduateData.academicQualifications[`${selectedExamType}Results` as keyof typeof undergraduateData.academicQualifications] as ExamResults;
      appendIfFilled("exam_type", selectedExamType);
      appendIfFilled("exam_number", examResults?.examNumber);
      appendIfFilled("exam_year", examResults?.examYear);
      if (examResults?.subjects && examResults.subjects.length > 0) {
        appendIfFilled("subjects", JSON.stringify(examResults.subjects));
      }
      if (examResults?.documents) {
        formData.append("result_document", examResults.documents);
      }
      // Add JAMB results
      appendIfFilled("jamb_reg_number", undergraduateData.academicQualifications.jambResults.regNumber);
      appendIfFilled("jamb_year", undergraduateData.academicQualifications.jambResults.examYear);
      appendIfFilled("jamb_score", undergraduateData.academicQualifications.jambResults.score);
      if (undergraduateData.academicQualifications.jambResults.documents) {
        formData.append("jamb_result", undergraduateData.academicQualifications.jambResults.documents);
      }
      // Add documents
      if (undergraduateData.passportPhoto) {
        formData.append("passport_photo", undergraduateData.passportPhoto);
      }
      // Add declaration
      appendIfFilled("declaration", undergraduateData.declaration);
      // Set is_draft to true
      formData.append("is_draft", "true");
      // Save the draft
      const response = await apiService.submitUndergraduateApplication(formData) as DraftResponse;
      if (response.id) {
        setDraftId(response.id);
        setIsDraft(true);
        toast.success("Draft saved successfully", {
          description: "Your application has been saved as a draft.",
        });
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error("Failed to save draft", {
        description: "There was an error saving your application. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const [selectedExams, setSelectedExams] = useState<string[]>([]);

  const handleExamSelection = (examType: string) => {
    const allowedExams = ['waec', 'neco', 'nabteb'];
    if (!allowedExams.includes(examType)) return; // Only allow O'Level exams
    setSelectedExams(prev => {
      if (prev.includes(examType)) {
        return prev.filter(type => type !== examType);
      }
      if (prev.length >= 3) {
        toast.error("You can only select a maximum of 3 exam results");
        return prev;
      }
      return [...prev, examType];
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
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      // Helper to append only if value is filled
      const appendIfFilled = (key, value) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      };

      // Add program choice in the exact format required
      if (undergraduateData.programChoice) {
        formData.append('program_choice', JSON.stringify({
          program: undergraduateData.programChoice.program,
          subjectCombination: undergraduateData.programChoice.subjectCombination,
          firstChoice: {
            additionalProp1: "AUST",
            additionalProp2: undergraduateData.programChoice.program,
            additionalProp3: undergraduateData.programChoice.program.split('.')[0]
          },
          secondChoice: {
            additionalProp1: "AUST",
            additionalProp2: undergraduateData.programChoice.program,
            additionalProp3: undergraduateData.programChoice.program.split('.')[0]
          }
        }));
      }

      // Add personal details
      appendIfFilled("surname", undergraduateData.personalDetails.surname);
      appendIfFilled("first_name", undergraduateData.personalDetails.firstName);
      appendIfFilled("other_names", undergraduateData.personalDetails.otherNames);
      appendIfFilled("gender", undergraduateData.personalDetails.gender);
      if (
        undergraduateData.personalDetails.dateOfBirth.year &&
        undergraduateData.personalDetails.dateOfBirth.month &&
        undergraduateData.personalDetails.dateOfBirth.day
      ) {
        appendIfFilled(
          "date_of_birth",
          `${undergraduateData.personalDetails.dateOfBirth.year}-${undergraduateData.personalDetails.dateOfBirth.month}-${undergraduateData.personalDetails.dateOfBirth.day}`
        );
      }
      appendIfFilled("street_address", undergraduateData.personalDetails.streetAddress);
      appendIfFilled("city", undergraduateData.personalDetails.city);
      appendIfFilled("country", undergraduateData.personalDetails.country);
      appendIfFilled("state_of_origin", undergraduateData.personalDetails.stateOfOrigin);
      appendIfFilled("nationality", undergraduateData.personalDetails.nationality);
      appendIfFilled("phone_number", undergraduateData.personalDetails.phoneNumber);
      appendIfFilled("email", undergraduateData.personalDetails.email);
      appendIfFilled("has_disability", undergraduateData.personalDetails.hasDisabilities);
      appendIfFilled("disability_description", undergraduateData.personalDetails.disabilityDescription);
      // Add academic session and program details
      appendIfFilled("academic_session", undergraduateData.academicSession);
      appendIfFilled("program_type", "undergraduate");
      appendIfFilled("selected_course", undergraduateData.selectedCourse);
      // Add O'Level results
      const examResults = undergraduateData.academicQualifications[`${selectedExamType}Results` as keyof typeof undergraduateData.academicQualifications] as ExamResults;
      appendIfFilled("exam_type", selectedExamType);
      appendIfFilled("exam_number", examResults?.examNumber);
      appendIfFilled("exam_year", examResults?.examYear);
      if (examResults?.subjects && examResults.subjects.length > 0) {
        appendIfFilled("subjects", JSON.stringify(examResults.subjects));
      }
      if (examResults?.documents) {
        formData.append("result_document", examResults.documents);
      }
      // Add JAMB results
      appendIfFilled("jamb_reg_number", undergraduateData.academicQualifications.jambResults.regNumber);
      appendIfFilled("jamb_year", undergraduateData.academicQualifications.jambResults.examYear);
      appendIfFilled("jamb_score", undergraduateData.academicQualifications.jambResults.score);
      if (undergraduateData.academicQualifications.jambResults.documents) {
        formData.append("jamb_result", undergraduateData.academicQualifications.jambResults.documents);
      }
      // Add documents
      if (undergraduateData.passportPhoto) {
        formData.append("passport_photo", undergraduateData.passportPhoto);
      }
      // Add declaration
      appendIfFilled("declaration", undergraduateData.declaration);
      // Mark as submitted
      formData.append("submitted", "true");
      // Save the application
      await apiService.submitUndergraduateApplication(formData);
      toast.success("Application submitted successfully!");
      // Update localStorage to mark as submitted
      const storedData = localStorage.getItem('applicationData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.applications && parsedData.applications.length > 0) {
          parsedData.applications[0].submitted = true;
          localStorage.setItem('applicationData', JSON.stringify(parsedData));
        }
      }
      navigate("/application-success");
    } catch (err) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                additionalProp1: "AUST",
                additionalProp2: value,
                additionalProp3: value.split('.')[0]
              },
              secondChoice: {
                additionalProp1: "AUST",
                additionalProp2: value,
                additionalProp3: value.split('.')[0]
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