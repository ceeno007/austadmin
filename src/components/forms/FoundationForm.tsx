'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, CheckCircle2, AlertCircle, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { getCurrentAcademicSession } from "@/utils/academicSession";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import apiService from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search } from "lucide-react";
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
  // Foundation and Remedial Studies specific fields
  exam_number?: string;
  exam_year?: string;
  // File paths
  passport_photo_path?: string;
  payment_receipt_path?: string;
  waec_result_path?: string;
  has_paid?: boolean;
  submitted?: boolean;
  // Add missing fields for linter
  exam_type?: string;
  subjects?: any[];
  program_choice?: any;
  exam_result_path?: string;
}

interface FoundationRemedialFormData {
  passportPhoto: File | string | null;
  academicSession: string;
  program: string;
  has_paid?: boolean;
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
  parentGuardian: {
    name: string;
    occupation: string;
    homeAddress: string;
    officeAddress: string;
    mobileNumber: string;
    email: string;
  };
  programChoice: {
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
  academicQualifications: {
    examResults: {
      examType: string;
      examNumber: string;
      examYear: string;
      subjects: Array<{
        subject: string;
        grade: string;
      }>;
      documents: File | null;
    };
  };
  declaration: string;
}

interface University {
  name: string;
  country: string;
  domains: string[];
  web_pages: string[];
}

interface FoundationFormProps {
  onPayment: (amount: number, email: string, metadata: Record<string, any>) => Promise<void>;
  isProcessingPayment: boolean;
  application?: any;
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
  label: string;
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

const nigeriaStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
    "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
    "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
    "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
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

// Add these predefined subject combinations
const subjectCombinations = {
  "Arts": [
    "Literature, Government, Christian Religious Studies",
    "Literature, Government, History",
    "Literature, Government, Islamic Religious Studies"
  ].sort(),
  "Engineering": [
    "Physics, Chemistry, Mathematics",
    "Physics, Further Mathematics, Mathematics"
  ].sort(),
  "Medicine": [
    "Biology, Chemistry, Mathematics",
    "Biology, Chemistry, Physics"
  ].sort(),
  "Science": [
    "Biology, Chemistry, Mathematics",
    "Physics, Chemistry, Biology",
    "Physics, Chemistry, Mathematics"
  ].sort(),
  "Social Sciences": [
    "Economics, Government, Geography",
    "Economics, Government, Literature",
    "Economics, Government, Mathematics"
  ].sort()
};

// Add these constants at the top of the file with other constants
const commonSubjects = [
  "Accounting",
  "Agricultural Science",
  "Biology",
  "Chemistry",
  "Christian Religious Studies",
  "Commerce",
  "Computer Studies",
  "Economics",
  "English Language",
  "Food and Nutrition",
  "French",
  "Further Mathematics",
  "Geography",
  "Government",
  "Hausa",
  "History",
  "Igbo",
  "Islamic Religious Studies",
  "Literature in English",
  "Mathematics",
  "Physics",
  "Technical Drawing",
  "Yoruba"
].sort();

const grades = [
  "A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"
];

// Add autofillFromApplication function
const autofillFromApplication = (application: any, prev: any) => {
  // Map nationality to match dropdown values
  const mapNationality = (nationality: string) => {
    if (!nationality) return "Nigeria"; // Default to Nigeria if empty
    if (nationality === "Nigerian") return "Nigeria";
    return nationality;
  };

  // Helper function to add endpoint to file path
  const addEndpointToPath = (path: string | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://admissions-jcvy.onrender.com/${path}`;
  };

  // Parse date string to get day, month, year
  const parseDate = (dateString: string) => {
    if (!dateString) return { day: "", month: "", year: "" };
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      year: date.getFullYear().toString()
    };
  };

  // Create a placeholder file for the exam result
  const createExamResultFile = (path: string | undefined) => {
    if (!path) return null;
    const filename = path.split('/').pop() || 'exam_result.pdf';
    return new File([], filename, { type: 'application/pdf' });
  };

  // Create a placeholder file for the passport photo
  const createPassportPhotoFile = (path: string | undefined) => {
    if (!path) return null;
    const filename = path.split('/').pop() || 'passport.jpg';
    return new File([], filename, { type: 'image/jpeg' });
  };

  return {
    ...prev,
    academicSession: application.academic_session || prev.academicSession,
    program: application.program_type || prev.program,
    passportPhoto: application.passport_photo_path ? addEndpointToPath(application.passport_photo_path) : prev.passportPhoto,
    personalDetails: {
      ...prev.personalDetails,
      surname: application.surname || prev.personalDetails.surname,
      firstName: application.first_name || prev.personalDetails.firstName,
      otherNames: application.other_names || prev.personalDetails.otherNames,
      gender: application.gender || prev.personalDetails.gender,
      dateOfBirth: parseDate(application.date_of_birth),
      streetAddress: application.street_address || prev.personalDetails.streetAddress,
      city: application.city || prev.personalDetails.city,
      country: application.country || prev.personalDetails.country,
      stateOfOrigin: application.state_of_origin || prev.personalDetails.stateOfOrigin,
      nationality: mapNationality(application.nationality),
      phoneNumber: application.phone_number || prev.personalDetails.phoneNumber,
      email: application.email || prev.personalDetails.email,
      hasDisabilities: application.has_disability === true ? 'yes' : (application.has_disability === false ? 'no' : prev.personalDetails.hasDisabilities),
      disabilityDescription: application.disability_description || prev.personalDetails.disabilityDescription,
    },
    programChoice: {
      program: application.program_type || prev.programChoice.program,
      subjectCombination: application.program_choice?.subjectCombination || prev.programChoice.subjectCombination,
      firstChoice: {
        university: application.program_choice?.firstChoice?.university || prev.programChoice.firstChoice.university,
        department: application.program_choice?.firstChoice?.department || prev.programChoice.firstChoice.department,
        faculty: application.program_choice?.firstChoice?.faculty || prev.programChoice.firstChoice.faculty,
      },
      secondChoice: {
        university: application.program_choice?.secondChoice?.university || prev.programChoice.secondChoice.university,
        department: application.program_choice?.secondChoice?.department || prev.programChoice.secondChoice.department,
        faculty: application.program_choice?.secondChoice?.faculty || prev.programChoice.secondChoice.faculty,
      },
    },
    academicQualifications: {
      examResults: {
        examType: application.exam_type || prev.academicQualifications.examResults.examType,
        examNumber: application.exam_number || prev.academicQualifications.examResults.examNumber,
        examYear: application.exam_year ? application.exam_year.toString() : prev.academicQualifications.examResults.examYear,
        subjects: application.subjects || prev.academicQualifications.examResults.subjects,
        documents: application.exam_result_path ? createExamResultFile(application.exam_result_path) : prev.academicQualifications.examResults.documents,
      }
    },
  };
};

const FoundationForm: React.FC<FoundationFormProps> = ({ onPayment, isProcessingPayment, application }) => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [foundationRemedialData, setFoundationRemedialData] = useState<FoundationRemedialFormData>({
    passportPhoto: null,
    academicSession: getCurrentAcademicSession(),
    program: "",
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
      nationality: "",
      phoneNumber: "",
      email: "",
      hasDisabilities: "no",
      disabilityDescription: "",
    },
    parentGuardian: {
      name: "",
      occupation: "",
      homeAddress: "",
      officeAddress: "",
      mobileNumber: "",
      email: "",
    },
    programChoice: {
      program: "",
      subjectCombination: "",
      firstChoice: {
        university: "",
        department: "",
        faculty: "",
      },
      secondChoice: {
        university: "",
        department: "",
        faculty: "",
      },
    },
    academicQualifications: {
      examResults: {
        examType: "",
        examNumber: "",
        examYear: "",
        subjects: [],
        documents: null
      },
    },
    declaration: ""
  });

  // Get application data from props or localStorage if available
  useEffect(() => {
    try {
      if (application) {
        // Check if user has already paid
        if (application.has_paid === true) {
          navigate('/application-success', { 
            state: { 
              application: application,
              programType: application.program_type || 'foundation'
            }
          });
          return;
        }
        
        setFoundationRemedialData(prev => autofillFromApplication(application, prev));
      } else {
        const storedData = localStorage.getItem('applicationData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData.applications && parsedData.applications.length > 0) {
            const appData = parsedData.applications[0];
            
            // Check if user has already paid
            if (appData.has_paid === true) {
              navigate('/application-success', { 
                state: { 
                  application: appData,
                  programType: appData.program_type || 'foundation'
                }
              });
              return;
            }
            
            setFoundationRemedialData(prev => autofillFromApplication(appData, prev));
          }
        }
      }
    } catch (error) {
      console.error("Error parsing application data:", error);
    }
  }, [application, navigate]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isProceedingToPayment, setIsProceedingToPayment] = useState(false);

  // Generate years from current year to 30 years back
  const currentYear = new Date().getFullYear();
  const examYears = Array.from({ length: 31 }, (_, i) => (currentYear - i).toString());
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
      console.error('Failed to copy text: ', err);
    }
  };

  const handleFileUpload = (fieldId: string, file: File) => {
    setFoundationRemedialData((prev) => ({
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
    setFoundationRemedialData((prev) => ({
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
    setFoundationRemedialData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value
      }
    }));
  };

  const handleDateChange = (field: string, type: "day" | "month" | "year", value: string) => {
    setFoundationRemedialData(prev => ({
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
    // Check if declaration is checked
    if (foundationRemedialData.declaration !== "true") {
      toast.error("Please agree to the declaration before proceeding");
      return false;
    }
    
    return true;
  };

  // Helper function to convert File to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSaveDraft = async () => {
    try {
      setIsSavingDraft(true);
      const pd = foundationRemedialData.personalDetails;
      const aq = foundationRemedialData.academicQualifications.examResults;
      const pc = foundationRemedialData.programChoice;

      // Create FormData object
      const formData = new FormData();

      // Helper function to check if a value is actually filled
      const isFilled = (value: any): boolean => {
        if (!value) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === 'object' && Object.keys(value).length === 0) return false;
        return true;
      };
      // Helper function to append only if filled
      const appendIfFilled = (key: string, value: any) => {
        if (isFilled(value)) {
          formData.append(key, value);
        }
      };

      appendIfFilled('academic_session', foundationRemedialData.academicSession);
      appendIfFilled('program_type', foundationRemedialData.program);
      appendIfFilled('surname', pd.surname);
      appendIfFilled('first_name', pd.firstName);
      appendIfFilled('other_names', pd.otherNames);
      appendIfFilled('gender', pd.gender);
      if (isFilled(pd.dateOfBirth.day) && isFilled(pd.dateOfBirth.month) && isFilled(pd.dateOfBirth.year)) {
        formData.append('date_of_birth', `${pd.dateOfBirth.year}-${pd.dateOfBirth.month}-${pd.dateOfBirth.day}`);
      }
      appendIfFilled('street_address', pd.streetAddress);
      appendIfFilled('city', pd.city);
      appendIfFilled('country', pd.country);
      if (pd.nationality === "Nigeria" && isFilled(pd.stateOfOrigin)) {
        formData.append('state_of_origin', pd.stateOfOrigin);
      }
      appendIfFilled('nationality', pd.nationality === "Nigeria" ? "Nigerian" : pd.nationality);
      appendIfFilled('phone_number', pd.phoneNumber);
      appendIfFilled('email', pd.email);
      if (pd.hasDisabilities === "yes") {
        formData.append('has_disability', "true");
        if (isFilled(pd.disabilityDescription)) {
          formData.append('disability_description', pd.disabilityDescription);
        }
      } else if (pd.hasDisabilities === "no") {
        formData.append('has_disability', "false");
      }
      appendIfFilled('exam_type', aq.examType);
      appendIfFilled('exam_number', aq.examNumber);
      appendIfFilled('exam_year', aq.examYear);
      if (isFilled(aq.subjects) && aq.subjects.length > 0) {
        formData.append('subjects', JSON.stringify(aq.subjects));
      }

      // Add program choice
      const programChoiceData = {
        program: foundationRemedialData.program,
        subjectCombination: pc.subjectCombination,
        firstChoice: {
          university: pc.firstChoice.university,
          department: pc.firstChoice.department,
          faculty: pc.firstChoice.faculty
        },
        secondChoice: {
          university: pc.secondChoice.university,
          department: pc.secondChoice.department,
          faculty: pc.secondChoice.faculty
        }
      };
      formData.append('program_choice', JSON.stringify(programChoiceData));

      // Add files
      if (foundationRemedialData.passportPhoto instanceof File) {
        formData.append('passport_photo', foundationRemedialData.passportPhoto);
      }
      if (aq.documents instanceof File) {
        formData.append('exam_result', aq.documents);
      }

      // Log the FormData contents for debugging
      // console.log('FormData contents:');
      for (let pair of formData.entries()) {
        // console.log(pair[0], pair[1]);
      }

      const response = await apiService.createFoundationApplication(formData);
      if (response && response.applications && response.applications.length > 0) {
        setFoundationRemedialData(prev => autofillFromApplication(response.applications[0], prev));
      }
      toast.success('Application saved as draft successfully');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft. Please try again.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      const formData = new FormData();
      // Add form data...
      
      const response = await apiService.createFoundationApplication(formData);
      if (response.success) {
        toast.success("Application submitted successfully!");
        navigate('/application-success');
      } else {
        toast.error(response.message || "Failed to submit application");
      }
    } catch (err) {
      toast.error("An error occurred while submitting the application");
    }
  };

  // Detect if user has paid
  const hasPaid = foundationRemedialData && foundationRemedialData.has_paid;

  // Helper function to fetch file from URL
  const fetchFileFromUrl = async (url: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.split('/').pop() || 'image.jpg';
    return new File([blob], filename, { type: blob.type });
  };

  // Payment handler with reference
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fill in all required fields before proceeding to payment.");
      return;
    }

    try {
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Failed to initialize payment. Please try again.");
    }
  };

  const [firstChoiceSearch, setFirstChoiceSearch] = useState("");
  const [secondChoiceSearch, setSecondChoiceSearch] = useState("");
  const [openUniversityPopover, setOpenUniversityPopover] = useState(false);
  const [openUniversityPopover2, setOpenUniversityPopover2] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Add state for university search country
  const [universityCountry, setUniversityCountry] = useState<string>("Nigeria");

  const handleUniversitySelect = (universityName: string, choice: "firstChoice" | "secondChoice") => {
    setFoundationRemedialData(prev => ({
      ...prev,
      programChoice: {
        ...prev.programChoice,
        [choice]: {
          ...prev.programChoice[choice],
          university: universityName
        }
      }
    }));
    setSearchQuery("");
    if (choice === "firstChoice") {
      setOpenUniversityPopover(false);
    } else {
      setOpenUniversityPopover2(false);
    }
  };

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

  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const [universityCache, setUniversityCache] = useState<Record<string, University[]>>({});

  // Update fetchUniversities to use the new API and country
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

  // Update the CommandItem to handle long names and make it selectable
  const renderUniversityItem = (university: University, choice: "firstChoice" | "secondChoice") => (
    <CommandItem
      key={university.name}
      value={university.name}
      onSelect={() => handleUniversitySelect(university.name, choice)}
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
  const renderCommandGroup = (choice: "firstChoice" | "secondChoice") => (
    <CommandGroup className="max-h-[300px] overflow-auto">
      {universities.map((university) => renderUniversityItem(university, choice))}
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
              {foundationRemedialData.programChoice.firstChoice.university || "Search for your institution..."}
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
            {renderCommandGroup("firstChoice")}
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
              {foundationRemedialData.programChoice.secondChoice.university || "Search for your institution..."}
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
            {renderCommandGroup("secondChoice")}
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-xs text-gray-500">
        Start typing to search for your institution. If your institution is not listed, you can type it manually.
      </p>
    </div>
  );

  const getPassportPhotoUrl = () => {
    if (foundationRemedialData.passportPhoto instanceof File) {
      return URL.createObjectURL(foundationRemedialData.passportPhoto);
    }
    if (typeof foundationRemedialData.passportPhoto === 'string') {
      if (foundationRemedialData.passportPhoto.startsWith('http')) {
        return foundationRemedialData.passportPhoto;
      }
      return `https://admissions-jcvy.onrender.com/${foundationRemedialData.passportPhoto}`;
    }
    return '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Passport Photo Section */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Passport Photograph <span className="text-red-500 text-xs italic">Required</span></h3>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="relative w-48 h-48 mb-4">
            {foundationRemedialData.passportPhoto ? (
              <div className="relative w-full h-full">
                <img
                  src={getPassportPhotoUrl()}
                  alt="Passport"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleClearFile("passportPhoto")}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="mt-2 text-sm text-gray-600">No photo uploaded</p>
                </div>
              </div>
            )}
          </div>
          <div className="w-full max-w-md">
            <input
              type="file"
              id="passportPhoto"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    toast.error("File size should be less than 5MB");
                    return;
                  }
                  handleFileUpload("passportPhoto", file);
                }
              }}
            />
            <label
              htmlFor="passportPhoto"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              <Upload className="h-5 w-5 mr-2 text-gray-400" />
              Upload Passport Photograph
            </label>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Accepted formats: JPG, PNG (Max: 5MB)
            </p>
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
                value={foundationRemedialData.personalDetails.surname}
                onChange={(e) => handlePersonalDetailsChange("surname", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>First Name <span className="text-red-500 text-xs italic">Required</span></Label>
              <Input
                placeholder="Enter your first name"
                value={foundationRemedialData.personalDetails.firstName}
                onChange={(e) => handlePersonalDetailsChange("firstName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Other Names</Label>
            <Input
              placeholder="Enter other names (if any)"
              value={foundationRemedialData.personalDetails.otherNames}
              onChange={(e) => handlePersonalDetailsChange("otherNames", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender <span className="text-red-500 text-xs italic">Required</span></Label>
              <Select
                value={foundationRemedialData.personalDetails.gender}
                onValueChange={(value) => handlePersonalDetailsChange("gender", value)}
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

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label>Date of Birth <span className="text-red-500 text-xs italic">Required</span></Label>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={foundationRemedialData.personalDetails.dateOfBirth.day}
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
                  value={foundationRemedialData.personalDetails.dateOfBirth.month}
                  onValueChange={(value) => handleDateChange("dateOfBirth", "month", value)}
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
                  value={foundationRemedialData.personalDetails.dateOfBirth.year}
                  onValueChange={(value) => handleDateChange("dateOfBirth", "year", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {examYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nationality <span className="text-red-500 text-xs italic">Required</span></Label>
              <Select
                value={foundationRemedialData.personalDetails.nationality}
                onValueChange={(value) => {
                  handlePersonalDetailsChange("nationality", value);
                  // Clear state of origin if nationality changes from Nigeria
                  if (value !== "Nigeria") {
                    handlePersonalDetailsChange("stateOfOrigin", "");
                  }
                }}
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
            {foundationRemedialData.personalDetails.nationality === "Nigeria" && (
              <div className="space-y-2">
                <Label>State of Origin <span className="text-red-500 text-xs italic">Required</span></Label>
                <Select
                  value={foundationRemedialData.personalDetails.stateOfOrigin}
                  onValueChange={(value) => handlePersonalDetailsChange("stateOfOrigin", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state of origin" />
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
              <Label>Phone Number <span className="text-red-500 text-xs italic">Required</span></Label>
              <PhoneInput
                international
                defaultCountry="NG"
                value={foundationRemedialData.personalDetails.phoneNumber}
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
                value={foundationRemedialData.personalDetails.email}
                onChange={(e) => handlePersonalDetailsChange("email", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="streetAddress">Street Address <span className="text-red-500 text-xs italic">Required</span></Label>
            <Textarea
              id="streetAddress"
              value={foundationRemedialData.personalDetails.streetAddress}
              onChange={(e) => handlePersonalDetailsChange("streetAddress", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City <span className="text-red-500 text-xs italic">Required</span></Label>
              <Input
                id="city"
                value={foundationRemedialData.personalDetails.city}
                onChange={(e) => handlePersonalDetailsChange("city", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country <span className="text-red-500 text-xs italic">Required</span></Label>
              <Select
                value={foundationRemedialData.personalDetails.country}
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
            <Label>Do you have any disabilities? <span className="text-red-500 text-xs italic">Required</span></Label>
            <Select
              value={foundationRemedialData.personalDetails.hasDisabilities}
              onValueChange={(value) => handlePersonalDetailsChange("hasDisabilities", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {foundationRemedialData.personalDetails.hasDisabilities === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="disabilityDescription">Please describe your disability *</Label>
              <Textarea
                id="disabilityDescription"
                value={foundationRemedialData.personalDetails.disabilityDescription}
                onChange={(e) => handlePersonalDetailsChange("disabilityDescription", e.target.value)}
                required
              />
            </div>
          )}
        </div>
      </div>

      {/* Program Choice Section */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Program Choice</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Academic Session <span className="text-red-500 text-xs italic">Required</span></Label>
              <Select
                value={foundationRemedialData.academicSession}
                onValueChange={(value) => setFoundationRemedialData(prev => ({ ...prev, academicSession: value }))}
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
              <Label>Programme of Choice <span className="text-red-500 text-xs italic">Required</span></Label>
              <Select
                value={foundationRemedialData.programChoice.program}
                onValueChange={(value) => setFoundationRemedialData(prev => ({
                  ...prev,
                  programChoice: {
                    ...prev.programChoice,
                    program: value
                  }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select programme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foundation">Foundation and Remedial Studies (A'level)</SelectItem>
                  <SelectItem value="nabteb_olevel">NABTEB (O'level examination only)</SelectItem>
                  <SelectItem value="nabteb_olevel_classes">NABTEB (O'level examination and classes)</SelectItem>
                  <SelectItem value="jupeb">JUPEB (A'level)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Subject Combination <span className="text-red-500 text-xs italic">Required</span></Label>
            <div className="space-y-4">
              {/* Predefined Combinations */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Select from predefined combinations:</Label>
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value) {
                      setFoundationRemedialData(prev => ({
                        ...prev,
                        programChoice: {
                          ...prev.programChoice,
                          subjectCombination: value
                        }
                      }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a subject combination" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(subjectCombinations).map(([category, combinations]) => (
                      <SelectGroup key={category}>
                        <SelectLabel>{category}</SelectLabel>
                        {combinations.map((combination) => (
                          <SelectItem key={combination} value={combination}>
                            {combination}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Combination */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Or enter your own combination:</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter subject (e.g., Physics)"
                    value={foundationRemedialData.programChoice.subjectCombination}
                    onChange={(e) => setFoundationRemedialData(prev => ({
                      ...prev,
                      programChoice: {
                        ...prev.programChoice,
                        subjectCombination: e.target.value
                      }
                    }))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const currentSubjects = foundationRemedialData.programChoice.subjectCombination
                        .split(',')
                        .map(s => s.trim())
                        .filter(s => s);
                      
                      if (currentSubjects.length < 3) {
                        toast.error("Please enter at least 3 subjects");
                        return;
                      }
                    }}
                  >
                    Validate
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Enter your subjects separated by commas (e.g., Physics, Chemistry, Mathematics)
                </p>
              </div>

              {/* Selected Subjects Display */}
              {foundationRemedialData.programChoice.subjectCombination && (
                <div className="mt-4 p-3 bg-white rounded-md">
                  <h4 className="text-sm font-medium mb-2">Selected Subjects:</h4>
                  <div className="flex flex-wrap gap-2">
                    {foundationRemedialData.programChoice.subjectCombination
                      .split(',')
                      .map((subject, index) => (
                        <div
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                        >
                          {subject.trim()}
                          <button
                            type="button"
                            onClick={() => {
                              const subjects = foundationRemedialData.programChoice.subjectCombination
                                .split(',')
                                .map(s => s.trim())
                                .filter((_, i) => i !== index);
                              setFoundationRemedialData(prev => ({
                                ...prev,
                                programChoice: {
                                  ...prev.programChoice,
                                  subjectCombination: subjects.join(', ')
                                }
                              }));
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              First Choice of University, Department and Faculty
              <span className="text-red-500 text-xs italic">Required</span>
            </h4>
            {renderInstitutionField()}
            <div className="space-y-2">
              <Label>Department</Label>
              <Input
                placeholder="Enter department"
                value={foundationRemedialData.programChoice.firstChoice.department}
                onChange={(e) => setFoundationRemedialData(prev => ({
                  ...prev,
                  programChoice: {
                    ...prev.programChoice,
                    firstChoice: {
                      ...prev.programChoice.firstChoice,
                      department: e.target.value
                    }
                  }
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Faculty</Label>
              <Input
                placeholder="Enter faculty"
                value={foundationRemedialData.programChoice.firstChoice.faculty}
                onChange={(e) => setFoundationRemedialData(prev => ({
                  ...prev,
                  programChoice: {
                    ...prev.programChoice,
                    firstChoice: {
                      ...prev.programChoice.firstChoice,
                      faculty: e.target.value
                    }
                  }
                }))}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              Second Choice of University, Department and Faculty
              <span className="text-red-500 text-xs italic">Required</span>
            </h4>
            {renderInstitutionField2()}
            <div className="space-y-2">
              <Label>Department</Label>
              <Input
                placeholder="Enter department"
                value={foundationRemedialData.programChoice.secondChoice.department}
                onChange={(e) => setFoundationRemedialData(prev => ({
                  ...prev,
                  programChoice: {
                    ...prev.programChoice,
                    secondChoice: {
                      ...prev.programChoice.secondChoice,
                      department: e.target.value
                    }
                  }
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Faculty</Label>
              <Input
                placeholder="Enter faculty"
                value={foundationRemedialData.programChoice.secondChoice.faculty}
                onChange={(e) => setFoundationRemedialData(prev => ({
                  ...prev,
                  programChoice: {
                    ...prev.programChoice,
                    secondChoice: {
                      ...prev.programChoice.secondChoice,
                      faculty: e.target.value
                    }
                  }
                }))}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Academic Qualifications Section */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Academic Qualifications</h3>
        <div className="space-y-6">
          {/* O'Level Results */}
          <div className="space-y-4">
            <h4 className="font-medium">O'Level Results</h4>
            <p className="text-red-500 text-xs italic">Required</p>
            
            {/* WAEC Results */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-md">
              {/* <h5 className="font-medium">O,level Results</h5> */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Exam Type</Label>
                  <p className="text-red-500 text-xs italic">Required</p>
                  <Select
                    value={foundationRemedialData.academicQualifications.examResults.examType}
                    onValueChange={(value) => setFoundationRemedialData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        examResults: {
                          ...prev.academicQualifications.examResults,
                          examType: value
                        }
                      }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waec">WAEC</SelectItem>
                      <SelectItem value="neco">NECO</SelectItem>
                      <SelectItem value="nabteb">NABTEB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Exam Number</Label>
                  <p className="text-red-500 text-xs italic">Required</p>
                  <Input
                    value={foundationRemedialData.academicQualifications.examResults.examNumber}
                    onChange={(e) => setFoundationRemedialData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        examResults: {
                          ...prev.academicQualifications.examResults,
                          examNumber: e.target.value.toUpperCase()
                        }
                      }
                    }))}
                    placeholder="Enter exam number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Exam Year</Label>
                  <p className="text-red-500 text-xs italic">Required</p>
                  <Select
                    value={foundationRemedialData.academicQualifications.examResults.examYear}
                    onValueChange={(value) => setFoundationRemedialData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        examResults: {
                          ...prev.academicQualifications.examResults,
                          examYear: value
                        }
                      }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam year" />
                    </SelectTrigger>
                    <SelectContent>
                      {examYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Subjects and Grades <span className="text-red-500 text-xs italic">Required</span></Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFoundationRemedialData(prev => ({
                        ...prev,
                        academicQualifications: {
                          ...prev.academicQualifications,
                          examResults: {
                            ...prev.academicQualifications.examResults,
                            subjects: [
                              ...prev.academicQualifications.examResults.subjects,
                              { subject: "", grade: "" }
                            ]
                          }
                        }
                      }));
                    }}
                  >
                    Add Subject
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {foundationRemedialData.academicQualifications.examResults.subjects.map((subject, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <Select
                          value={subject.subject}
                          onValueChange={(value) => {
                            const newSubjects = [...foundationRemedialData.academicQualifications.examResults.subjects];
                            newSubjects[index] = { ...newSubjects[index], subject: value };
                            setFoundationRemedialData(prev => ({
                              ...prev,
                              academicQualifications: {
                                ...prev.academicQualifications,
                                examResults: {
                                  ...prev.academicQualifications.examResults,
                                  subjects: newSubjects
                                }
                              }
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {commonSubjects.map((subj) => (
                              <SelectItem key={subj} value={subj}>
                                {subj}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-32">
                        <Select
                          value={subject.grade}
                          onValueChange={(value) => {
                            const newSubjects = [...foundationRemedialData.academicQualifications.examResults.subjects];
                            newSubjects[index] = { ...newSubjects[index], grade: value };
                            setFoundationRemedialData(prev => ({
                              ...prev,
                              academicQualifications: {
                                ...prev.academicQualifications,
                                examResults: {
                                  ...prev.academicQualifications.examResults,
                                  subjects: newSubjects
                                }
                              }
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {grades.map((grade) => (
                              <SelectItem key={grade} value={grade}>
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newSubjects = foundationRemedialData.academicQualifications.examResults.subjects.filter((_, i) => i !== index);
                          setFoundationRemedialData(prev => ({
                            ...prev,
                            academicQualifications: {
                              ...prev.academicQualifications,
                              examResults: {
                                ...prev.academicQualifications.examResults,
                                subjects: newSubjects
                              }
                            }
                          }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {foundationRemedialData.academicQualifications.examResults.subjects.length === 0 && (
                  <div className="text-sm text-gray-500 italic">
                    Click "Add Subject" to add your subjects and grades
                  </div>
                )}

                {foundationRemedialData.academicQualifications.examResults.subjects.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Selected Subjects:</h4>
                    <div className="flex flex-wrap gap-2">
                      {foundationRemedialData.academicQualifications.examResults.subjects.map((subject, index) => (
                        <div
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {subject.subject}: {subject.grade}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Label className="flex items-center gap-2">
                Upload WAEC Results
                <span className="text-red-500 text-xs italic">Required</span>
              </Label>
              <FileUploadField
                id="waecDocuments"
                label=""
                accept=".pdf,.jpg,.jpeg,.png"
                value={foundationRemedialData.academicQualifications.examResults.documents}
                onChange={(files) => setFoundationRemedialData(prev => ({
                  ...prev,
                  academicQualifications: {
                    ...prev.academicQualifications,
                    examResults: {
                      ...prev.academicQualifications.examResults,
                      documents: files ? files[0] : null
                    }
                  }
                }))}
                onRemove={() => setFoundationRemedialData(prev => ({
                  ...prev,
                  academicQualifications: {
                    ...prev.academicQualifications,
                    examResults: {
                      ...prev.academicQualifications.examResults,
                      documents: null
                    }
                  }
                }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Declaration Section */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Declaration <span className="text-red-500 text-xs italic">Required</span></h3>
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
              checked={foundationRemedialData.declaration === "true"}
              onChange={(e) => setFoundationRemedialData(prev => ({ 
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

      {/* Application Fee Payment Section */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Application Fee Payment</h3>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800 space-y-2">
              <strong>Application Fees (Non-refundable):</strong>
              <br />
              <span className="block mt-2">
                <strong>Nigerian Applicants:</strong> ₦20,000
              </span>
              <div className="mt-4">
                <p className="font-medium">Payment Process:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Payment will be processed through Paystack</li>
                  <li>Nigerian applicants will be redirected to Paystack NGN payment gateway</li>
                  <li>The Paystack payment popup will appear automatically when you click "Proceed to Payment"</li>
                  <li>A payment receipt will be automatically generated after successful payment</li>
                </ul>
              </div>
            </p>
          </div>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="space-y-4">
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isProcessingPayment}
          >
            Save Draft
          </Button>
          <Button
            type="button"
            onClick={handleProceedToPayment}
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? "Processing..." : "Proceed to Payment"}
          </Button>
        </div>
      </div>
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        application={foundationRemedialData}
        onPaymentSuccess={(reference) => {
          // Handle successful payment
          localStorage.setItem("paymentCompleted", "true");
          localStorage.setItem("paymentReference", reference);
          setShowPaymentModal(false);
          navigate("/payment-success");
        }}
      />
    </form>
  );
};

export default FoundationForm; 