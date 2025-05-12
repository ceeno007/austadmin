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
import { apiService } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search } from "lucide-react";

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
}

interface FoundationRemedialFormData {
  passportPhoto: File | null;
  academicSession: string;
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
    bloodGroup: string;
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
  "Science": [
    "Physics, Chemistry, Biology",
    "Physics, Chemistry, Mathematics",
    "Biology, Chemistry, Mathematics"
  ],
  "Engineering": [
    "Physics, Chemistry, Mathematics",
    "Physics, Further Mathematics, Mathematics"
  ],
  "Medicine": [
    "Biology, Chemistry, Physics",
    "Biology, Chemistry, Mathematics"
  ],
  "Social Sciences": [
    "Economics, Government, Mathematics",
    "Economics, Government, Literature",
    "Economics, Government, Geography"
  ],
  "Arts": [
    "Literature, Government, History",
    "Literature, Government, Christian Religious Studies",
    "Literature, Government, Islamic Religious Studies"
  ]
};

// Add these constants at the top of the file with other constants
const commonSubjects = [
  "Mathematics",
  "English Language",
  "Physics",
  "Chemistry",
  "Biology",
  "Agricultural Science",
  "Economics",
  "Government",
  "Literature in English",
  "Christian Religious Studies",
  "Islamic Religious Studies",
  "Geography",
  "History",
  "Further Mathematics",
  "Technical Drawing",
  "Food and Nutrition",
  "Commerce",
  "Accounting",
  "Computer Studies",
  "French",
  "Yoruba",
  "Igbo",
  "Hausa"
];

const grades = [
  "A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"
];

// Add this constant at the top of the file with other constants
const universities = {
  "Nigeria": [
    "University of Lagos (UNILAG)",
    "University of Ibadan (UI)",
    "Obafemi Awolowo University (OAU)",
    "University of Nigeria, Nsukka (UNN)",
    "Ahmadu Bello University (ABU)",
    "University of Benin (UNIBEN)",
    "University of Ilorin (UNILORIN)",
    "University of Port Harcourt (UNIPORT)",
    "University of Calabar (UNICAL)",
    "Federal University of Technology, Akure (FUTA)",
    "Covenant University",
    "Babcock University",
    "Afe Babalola University",
    "Bells University of Technology",
    "Bingham University",
    "Bowen University",
    "Caleb University",
    "Caritas University",
    "Chrisland University",
    "Crawford University",
    "Crown Hill University",
    "Edwin Clark University",
    "Elizade University",
    "Evangel University",
    "Fountain University",
    "Godfrey Okoye University",
    "Gregory University",
    "Hallmark University",
    "Hezekiah University",
    "Igbinedion University",
    "Joseph Ayo Babalola University",
    "Kings University",
    "Kola Daisi University",
    "Landmark University",
    "Lead City University",
    "Madonna University",
    "McPherson University",
    "Mountain Top University",
    "Nile University of Nigeria",
    "Novena University",
    "Obong University",
    "Oduduwa University",
    "Pan-Atlantic University",
    "Paul University",
    "Redeemer's University",
    "Rhema University",
    "Ritman University",
    "Salem University",
    "Samuel Adegboyega University",
    "Southwestern University",
    "Summit University",
    "Tansian University",
    "Trinity University",
    "Veritas University",
    "Wellspring University",
    "Wesley University",
    "Western Delta University",
    "Achievers University",
    "Adeleke University",
    "Admiralty University",
    "Al-Hikmah University",
    "Al-Qalam University",
    "Anchor University",
    "Arthur Jarvis University",
    "Atiba University",
    "Augustine University",
    "Baze University",
    "Benson Idahosa University",
    "Bingham University",
    "BlueCrest University",
    "Capital City University",
    "Clifford University",
    "Coal City University",
    "Dominion University",
    "Eastern Palm University",
    "Eko University of Medical and Health Sciences",
    "Elizade University",
    "Evangel University",
    "First Technical University",
    "Fountain University",
    "Godfrey Okoye University",
    "Greenfield University",
    "Hallmark University",
    "Hezekiah University",
    "Igbinedion University",
    "Joseph Ayo Babalola University",
    "Kings University",
    "Kola Daisi University",
    "Landmark University",
    "Lead City University",
    "Madonna University",
    "McPherson University",
    "Mountain Top University",
    "Nile University of Nigeria",
    "Novena University",
    "Obong University",
    "Oduduwa University",
    "Pan-Atlantic University",
    "Paul University",
    "Redeemer's University",
    "Rhema University",
    "Ritman University",
    "Salem University",
    "Samuel Adegboyega University",
    "Southwestern University",
    "Summit University",
    "Tansian University",
    "Trinity University",
    "Veritas University",
    "Wellspring University",
    "Wesley University",
    "Western Delta University"
  ],
  "United States": [
    "Harvard University",
    "Stanford University",
    "Massachusetts Institute of Technology (MIT)",
    "California Institute of Technology (Caltech)",
    "University of California, Berkeley",
    "Yale University",
    "Princeton University",
    "Columbia University",
    "University of Chicago",
    "University of Pennsylvania"
  ],
  "United Kingdom": [
    "University of Oxford",
    "University of Cambridge",
    "Imperial College London",
    "University College London (UCL)",
    "University of Edinburgh",
    "University of Manchester",
    "King's College London",
    "London School of Economics (LSE)",
    "University of Bristol",
    "University of Warwick"
  ],
  "Canada": [
    "University of Toronto",
    "University of British Columbia",
    "McGill University",
    "University of Alberta",
    "University of Montreal",
    "University of Waterloo",
    "University of Calgary",
    "University of Ottawa",
    "University of Western Ontario",
    "Queen's University"
  ],
  "Australia": [
    "University of Melbourne",
    "University of Sydney",
    "University of Queensland",
    "Monash University",
    "University of New South Wales",
    "Australian National University",
    "University of Western Australia",
    "University of Adelaide",
    "University of Technology Sydney",
    "RMIT University"
  ]
};

const FoundationForm = ({ onPayment, isProcessingPayment }: FoundationFormProps) => {
  const navigate = useNavigate();
  // Get application data from localStorage if available
  const [applicationData, setApplicationData] = useState<ApplicationData>({});

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('applicationData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setApplicationData(parsedData);
        
        // Check if this is the correct form type
        // Backend sends 'program' instead of 'program_type'
        const apiProgramType = parsedData.program_type || parsedData.program;
        if (apiProgramType) {
          const programType = apiProgramType.toLowerCase();
          // Get stored program type from localStorage for comparison
          const savedProgramType = localStorage.getItem("programType");
          
          // Only redirect if both values exist and are different, 
          // ensuring we check against localStorage which may have been updated by user choice
          if (programType !== 'foundation_remedial' && 
              savedProgramType && 
              savedProgramType !== 'foundation_remedial') {
            console.log(`Redirecting from Foundation and Remedial Studies to ${programType} form based on application data`);
            window.location.href = `/document-upload?type=${programType}`;
          } else {
            // If program type matches, update localStorage to be consistent
            localStorage.setItem("programType", "foundation_remedial");
          }
        }
      }
    } catch (error) {
      console.error("Error parsing application data:", error);
    }
  }, []);

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
      nationality: "Nigerian",
      phoneNumber: "",
      email: "",
      hasDisabilities: "no",
      disabilityDescription: "",
      bloodGroup: "",
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});

  // Generate years from current year to 30 years back
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 31 }, (_, i) => currentYear - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  // Fill form data from application data when it's available
  useEffect(() => {
    if (Object.keys(applicationData).length > 0) {
      console.log("Populating Foundation and Remedial Studies form with application data:", applicationData);
      
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
        email,
        has_disability,
        disability_description,
        // File paths
        passport_photo_path,
        payment_receipt_path,
        waec_result_path,
        // JAMB specific
        // jamb_reg_number,
        // jamb_score,
        // jamb_year
      } = applicationData;
      
      // Create placeholder files
      const passportPhoto = createPlaceholderFile(passport_photo_path);
      const paymentReceipt = createPlaceholderFile(payment_receipt_path);
      const waecResults = createPlaceholderFile(waec_result_path);
      
      setFoundationRemedialData(prev => ({
        ...prev,
        passportPhoto: passportPhoto,
        paymentReceipt: paymentReceipt,
        academicSession: academic_session || prev.academicSession,
        program: selected_program || prev.program,
        personalDetails: {
          ...prev.personalDetails,
          surname: applicationData.surname || prev.personalDetails.surname,
          firstName: applicationData.first_name || prev.personalDetails.firstName,
          otherNames: applicationData.other_names || prev.personalDetails.otherNames,
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
          email: email || prev.personalDetails.email,
          hasDisabilities: has_disability ? "yes" : "no",
          disabilityDescription: disability_description || prev.personalDetails.disabilityDescription
        },
        academicQualifications: {
          ...prev.academicQualifications,
          examResults: {
            ...prev.academicQualifications.examResults,
            examNumber: applicationData.exam_number || prev.academicQualifications.examResults.examNumber,
            examYear: applicationData.exam_year || prev.academicQualifications.examResults.examYear,
            documents: waecResults ? waecResults : prev.academicQualifications.examResults.documents
          }
        }
      }));
    }
  }, [applicationData]);

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
    // Add validation logic here
    return true;
  };

  const handleSaveAsDraft = async () => {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      // Add files if they exist
      if (foundationRemedialData.passportPhoto) {
        formData.append("passport_photo", foundationRemedialData.passportPhoto);
      }
      if (foundationRemedialData.academicQualifications.examResults.documents) {
        formData.append("waec_result", foundationRemedialData.academicQualifications.examResults.documents);
      }

      // Add is_draft flag
      formData.append("is_draft", "true");
      formData.append("program_type", "foundation_remedial");

      // Submit the draft application
      await apiService.submitDraftApplication(formData);

      // Save to localStorage
      const applicationData = {
        ...formData,
        is_draft: true,
        program_type: "foundation_remedial",
      };
      localStorage.setItem("foundationRemedialApplicationData", JSON.stringify(applicationData));

      toast.success("Application saved as draft successfully");
    } catch (error) {
      toast.error("Failed to save draft application");
    }
  };

  const handlePayment = async () => {
    const amount = 25000; // ₦25,000 in kobo
    const email = foundationRemedialData.personalDetails.email;
    const metadata = {
      program_type: "foundation",
      academic_session: foundationRemedialData.academicSession,
      selected_program: foundationRemedialData.program,
    };

    await onPayment(amount, email, metadata);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Initialize payment first
      await handlePayment();
      
      // The rest of the form submission will be handled after successful payment
      // This will be triggered by the payment verification callback
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("Failed to submit form");
    }
  };

  const [firstChoiceSearch, setFirstChoiceSearch] = useState("");
  const [secondChoiceSearch, setSecondChoiceSearch] = useState("");
  const [openUniversityPopover, setOpenUniversityPopover] = useState(false);
  const [openUniversityPopover2, setOpenUniversityPopover2] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    </div>
  );

  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const [universityCache, setUniversityCache] = useState<{ [key: string]: University[] }>({});

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        fetchUniversities(searchQuery);
      }
    }, 500); // Standard 500ms debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
                  <li>The Paystack payment popup will appear automatically when you click "Submit Application"</li>
                  <li>A payment receipt will be automatically generated after successful payment</li>
                </ul>
              </div>
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
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <p className="text-red-500 text-xs italic">Required</p>
              <Select
                value={foundationRemedialData.personalDetails.bloodGroup}
                onValueChange={(value) => handlePersonalDetailsChange("bloodGroup", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nationality <span className="text-red-500 text-xs italic">Required</span></Label>
              <Select
                value={foundationRemedialData.personalDetails.nationality}
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
            </div>
            {foundationRemedialData.personalDetails.nationality === "Nigerian" && (
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

      {/* Parent/Guardian Information Section */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Parent/Guardian Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Parent/Guardian Name <span className="text-red-500 text-xs italic">Required</span></Label>
              <Input
                placeholder="Enter parent/guardian name"
                value={foundationRemedialData.parentGuardian.name}
                onChange={(e) => setFoundationRemedialData(prev => ({
                  ...prev,
                  parentGuardian: {
                    ...prev.parentGuardian,
                    name: e.target.value
                  }
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Occupation <span className="text-red-500 text-xs italic">Required</span></Label>
              <Input
                placeholder="Enter occupation"
                value={foundationRemedialData.parentGuardian.occupation}
                onChange={(e) => setFoundationRemedialData(prev => ({
                  ...prev,
                  parentGuardian: {
                    ...prev.parentGuardian,
                    occupation: e.target.value
                  }
                }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Home Address <span className="text-red-500 text-xs italic">Required</span></Label>
            <Textarea
              placeholder="Enter home address"
              value={foundationRemedialData.parentGuardian.homeAddress}
              onChange={(e) => setFoundationRemedialData(prev => ({
                ...prev,
                parentGuardian: {
                  ...prev.parentGuardian,
                  homeAddress: e.target.value
                }
              }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Office Address</Label>
            <Textarea
              placeholder="Enter office address"
              value={foundationRemedialData.parentGuardian.officeAddress}
              onChange={(e) => setFoundationRemedialData(prev => ({
                ...prev,
                parentGuardian: {
                  ...prev.parentGuardian,
                  officeAddress: e.target.value
                }
              }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mobile Number <span className="text-red-500 text-xs italic">Required</span></Label>
              <PhoneInput
                international
                defaultCountry="NG"
                value={foundationRemedialData.parentGuardian.mobileNumber}
                onChange={(value) => setFoundationRemedialData(prev => ({
                  ...prev,
                  parentGuardian: {
                    ...prev.parentGuardian,
                    mobileNumber: value || ""
                  }
                }))}
                className="!flex !items-center !gap-2 [&>input]:!flex-1 [&>input]:!h-10 [&>input]:!rounded-md [&>input]:!border [&>input]:!border-input [&>input]:!bg-background [&>input]:!px-3 [&>input]:!py-2 [&>input]:!text-sm [&>input]:!ring-offset-background [&>input]:!placeholder:text-muted-foreground [&>input]:!focus-visible:outline-none [&>input]:!focus-visible:ring-2 [&>input]:!focus-visible:ring-ring [&>input]:!focus-visible:ring-offset-2 [&>input]:!disabled:cursor-not-allowed [&>input]:!disabled:opacity-50"
                placeholder="Enter mobile number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Email Address
                <span className="text-red-500 text-xs italic">Required</span>
              </Label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={foundationRemedialData.parentGuardian.email}
                onChange={(e) => setFoundationRemedialData(prev => ({
                  ...prev,
                  parentGuardian: {
                    ...prev.parentGuardian,
                    email: e.target.value
                  }
                }))}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Program Choice Section */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Program Choice</h3>
        <div className="space-y-4">
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
                <SelectItem value="foundation">FOUNDATION AND REMEDIAL STUDIES (A'level)</SelectItem>
                <SelectItem value="nabteb_olevel">NABTEB (O'level examination only)</SelectItem>
                <SelectItem value="nabteb_olevel_classes">NABTEB (O'level examination and classes)</SelectItem>
                <SelectItem value="jupeb">JUPEB (A'level)</SelectItem>
              </SelectContent>
            </Select>
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
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
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
            <div className="space-y-2">
              <Label>University</Label>
              <Popover open={openUniversityPopover} onOpenChange={setOpenUniversityPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openUniversityPopover}
                    className="w-full justify-between"
                  >
                    <span className="truncate">
                      {foundationRemedialData.programChoice.firstChoice.university || "Search for your university..."}
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
                    <CommandGroup className="max-h-[300px] overflow-auto">
                      {universities.map((university) => (
                        <CommandItem
                          key={university.name}
                          value={university.name}
                          onSelect={() => handleUniversitySelect(university.name, "firstChoice")}
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
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500">
                Start typing to search for your university. If your university is not listed, you can type it manually.
              </p>
            </div>
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
            <div className="space-y-2">
              <Label>University</Label>
              <Popover open={openUniversityPopover2} onOpenChange={setOpenUniversityPopover2}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openUniversityPopover2}
                    className="w-full justify-between"
                  >
                    <span className="truncate">
                      {foundationRemedialData.programChoice.secondChoice.university || "Search for your university..."}
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
                    <CommandGroup className="max-h-[300px] overflow-auto">
                      {universities.map((university) => (
                        <CommandItem
                          key={university.name}
                          value={university.name}
                          onSelect={() => handleUniversitySelect(university.name, "secondChoice")}
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
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500">
                Start typing to search for your university. If your university is not listed, you can type it manually.
              </p>
            </div>
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
            <h4 className="font-medium">O'Level Results *</h4>
            <p className="text-red-500 text-xs italic">Required</p>
            
            {/* WAEC Results */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-md">
              <h5 className="font-medium">WAEC Results</h5>
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
                          examNumber: e.target.value
                        }
                      }
                    }))}
                    placeholder="Enter exam number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Exam Year</Label>
                  <p className="text-red-500 text-xs italic">Required</p>
                  <Input
                    value={foundationRemedialData.academicQualifications.examResults.examYear}
                    onChange={(e) => setFoundationRemedialData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        examResults: {
                          ...prev.academicQualifications.examResults,
                          examYear: e.target.value
                        }
                      }
                    }))}
                    placeholder="Enter exam year"
                  />
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
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">
              By clicking submit, you agree that all information provided is true and accurate. You understand that any false information may result in the rejection of your application.
            </p>
          </div>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Payment Information:</strong>
            <br />
            When you click the "Submit Application" button below, you will be redirected to Paystack to complete your payment of ₦20,000. Please ensure you have your payment details ready.
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveAsDraft}
            disabled={isProcessingPayment}
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? "Processing Payment..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FoundationForm; 