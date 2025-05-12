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
import { apiService } from "@/services/api";
import { useNavigate } from "react-router-dom";

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
  jamb_reg_number?: string;
  jamb_score?: string;
  jamb_year?: string;
  exam_number?: string;
  exam_year?: string;
  // File paths
  passport_photo_path?: string;
  payment_receipt_path?: string;
  waec_result_path?: string;
  jamb_result_path?: string;
  other_qualifications_path?: string;
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
    bloodGroup: string;
  };
  academicQualifications: {
    waecResults: {
      examNumber: string;
      examYear: string;
      subjects: Array<{
        subject: string;
        grade: string;
      }>;
      documents: File | null;
    };
    necoResults: {
      examNumber: string;
      examYear: string;
      subjects: Array<{
        subject: string;
        grade: string;
      }>;
      documents: File | null;
    };
    nabtebResults: {
      examNumber: string;
      examYear: string;
      subjects: Array<{
        subject: string;
        grade: string;
      }>;
      documents: File | null;
    };
    jambResults: {
      regNumber: string;
      examYear: string;
      score: string;
      documents: File | null;
    };
  };
  declaration: string;
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
  "B.Sc. Software Engineering",
  "B.Sc. Computer Science",
  "B.Eng. Petroleum and Energy Resources Engineering",
  "B.Sc. Accounting",
  "B.Sc. Business Administration",
  "B.Eng. Civil Engineering",
  "B.Eng. Materials & Metallurgical Engineering",
  "B.Eng. Mechanical Engineering"
];

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

const UndergraduateForm = () => {
  const navigate = useNavigate();
  // Get application data from localStorage if available
  const [applicationData, setApplicationData] = useState<ApplicationData>({});
  
  // Get current year for cutoff mark
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const academicYear = `${currentYear}/${nextYear}`;

  // Generate years from current year to 5 years back
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

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
          if (programType !== 'undergraduate' && 
              savedProgramType && 
              savedProgramType !== 'undergraduate') {
            console.log(`Redirecting from undergraduate to ${programType} form based on application data`);
            window.location.href = `/document-upload?type=${programType}`;
          } else {
            // If program type matches, update localStorage to be consistent
            localStorage.setItem("programType", "undergraduate");
          }
        }
      }
    } catch (error) {
      console.error("Error parsing application data:", error);
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
      bloodGroup: "",
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
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});

  // Replace the static years array with the dynamic one
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  // Fill form data from application data when it's available
  useEffect(() => {
    if (Object.keys(applicationData).length > 0) {
      console.log("Populating undergraduate form with application data:", applicationData);
      
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
        jamb_result_path,
        // JAMB specific
        jamb_reg_number,
        jamb_score,
        jamb_year
      } = applicationData;
      
      // Create placeholder files
      const passportPhoto = createPlaceholderFile(passport_photo_path);
      const paymentReceipt = createPlaceholderFile(payment_receipt_path);
      const waecResults = createPlaceholderFile(waec_result_path);
      const jambResults = createPlaceholderFile(jamb_result_path);
      
      setUndergraduateData(prev => ({
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
          disabilityDescription: disability_description || prev.personalDetails.disabilityDescription,
          bloodGroup: applicationData.bloodGroup || prev.personalDetails.bloodGroup,
        },
        academicQualifications: {
          ...prev.academicQualifications,
          waecResults: {
            ...prev.academicQualifications.waecResults,
            examNumber: applicationData.exam_number || prev.academicQualifications.waecResults.examNumber,
            examYear: applicationData.exam_year || prev.academicQualifications.waecResults.examYear,
            documents: waecResults || prev.academicQualifications.waecResults.documents
          },
          jambResults: {
            ...prev.academicQualifications.jambResults,
            regNumber: jamb_reg_number || prev.academicQualifications.jambResults.regNumber,
            examYear: jamb_year || prev.academicQualifications.jambResults.examYear,
            score: jamb_score || prev.academicQualifications.jambResults.score,
            documents: jambResults || prev.academicQualifications.jambResults.documents
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
    // Add validation logic here
    return true;
  };

  // Add state for tracking draft status
  const [isDraft, setIsDraft] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);

  // Load draft data if available
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const response = await apiService.getDraftApplication();
        if (response) {
          setDraftId(response.id);
          setIsDraft(true);
          
          // Populate form with draft data
          setUndergraduateData({
            passportPhoto: response.passport_photo ? createPlaceholderFile(response.passport_photo) : null,
            academicSession: response.academic_session || getCurrentAcademicSession(),
            program: response.program || "",
            selectedCourse: response.selected_course || "",
            personalDetails: {
              surname: response.surname || "",
              firstName: response.first_name || "",
              otherNames: response.other_names || "",
              gender: response.gender || "",
              dateOfBirth: response.date_of_birth ? {
                day: new Date(response.date_of_birth).getDate().toString().padStart(2, '0'),
                month: (new Date(response.date_of_birth).getMonth() + 1).toString().padStart(2, '0'),
                year: new Date(response.date_of_birth).getFullYear().toString()
              } : { day: "", month: "", year: "" },
              streetAddress: response.street_address || "",
              city: response.city || "",
              country: response.country || "Nigeria",
              stateOfOrigin: response.state_of_origin || "",
              nationality: response.nationality || "Nigerian",
              phoneNumber: response.phone_number || "",
              email: response.email || "",
              hasDisabilities: response.has_disability ? "yes" : "no",
              disabilityDescription: response.disability_description || "",
              bloodGroup: response.blood_group || "",
            },
            academicQualifications: {
              waecResults: {
                examNumber: response.waec_exam_number || "",
                examYear: response.waec_exam_year || "",
                subjects: response.waec_subjects || [],
                documents: response.waec_result ? createPlaceholderFile(response.waec_result) : null
              },
              necoResults: {
                examNumber: response.neco_exam_number || "",
                examYear: response.neco_exam_year || "",
                subjects: response.neco_subjects || [],
                documents: response.neco_result ? createPlaceholderFile(response.neco_result) : null
              },
              nabtebResults: {
                examNumber: response.nabteb_exam_number || "",
                examYear: response.nabteb_exam_year || "",
                subjects: response.nabteb_subjects || [],
                documents: response.nabteb_result ? createPlaceholderFile(response.nabteb_result) : null
              },
              jambResults: {
                regNumber: response.jamb_reg_number || "",
                examYear: response.jamb_year || "",
                score: response.jamb_score || "",
                documents: response.jamb_result ? createPlaceholderFile(response.jamb_result) : null
              }
            },
            declaration: ""
          });

          // Set selected exams based on available results
          const selectedExams = [];
          if (response.waec_exam_number) selectedExams.push('waec');
          if (response.neco_exam_number) selectedExams.push('neco');
          if (response.nabteb_exam_number) selectedExams.push('nabteb');
          setSelectedExams(selectedExams);
        }
      } catch (error) {
        console.error('Error loading draft:', error);
        toast.error("Failed to load draft", {
          description: "There was an error loading your saved application. Please try again.",
        });
      }
    };

    loadDraft();
  }, []);

  const handleSaveAsDraft = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      
      // Add personal details
      formData.append("surname", undergraduateData.personalDetails.surname);
      formData.append("first_name", undergraduateData.personalDetails.firstName);
      formData.append("other_names", undergraduateData.personalDetails.otherNames);
      formData.append("gender", undergraduateData.personalDetails.gender);
      formData.append("date_of_birth", `${undergraduateData.personalDetails.dateOfBirth.year}-${undergraduateData.personalDetails.dateOfBirth.month}-${undergraduateData.personalDetails.dateOfBirth.day}`);
      formData.append("street_address", undergraduateData.personalDetails.streetAddress);
      formData.append("city", undergraduateData.personalDetails.city);
      formData.append("country", undergraduateData.personalDetails.country);
      formData.append("state_of_origin", undergraduateData.personalDetails.stateOfOrigin);
      formData.append("nationality", undergraduateData.personalDetails.nationality);
      formData.append("phone_number", undergraduateData.personalDetails.phoneNumber);
      formData.append("email", undergraduateData.personalDetails.email);
      formData.append("has_disability", undergraduateData.personalDetails.hasDisabilities === "yes" ? "true" : "false");
      formData.append("disability_description", undergraduateData.personalDetails.disabilityDescription);
      formData.append("blood_group", undergraduateData.personalDetails.bloodGroup);

      // Add O'Level results
      if (selectedExams.includes('waec')) {
        formData.append("waec_exam_number", undergraduateData.academicQualifications.waecResults.examNumber);
        formData.append("waec_exam_year", undergraduateData.academicQualifications.waecResults.examYear);
        formData.append("waec_subjects", JSON.stringify(undergraduateData.academicQualifications.waecResults.subjects));
        if (undergraduateData.academicQualifications.waecResults.documents) {
          formData.append("waec_result", undergraduateData.academicQualifications.waecResults.documents);
        }
      }

      if (selectedExams.includes('neco')) {
        formData.append("neco_exam_number", undergraduateData.academicQualifications.necoResults.examNumber);
        formData.append("neco_exam_year", undergraduateData.academicQualifications.necoResults.examYear);
        formData.append("neco_subjects", JSON.stringify(undergraduateData.academicQualifications.necoResults.subjects));
        if (undergraduateData.academicQualifications.necoResults.documents) {
          formData.append("neco_result", undergraduateData.academicQualifications.necoResults.documents);
        }
      }

      if (selectedExams.includes('nabteb')) {
        formData.append("nabteb_exam_number", undergraduateData.academicQualifications.nabtebResults.examNumber);
        formData.append("nabteb_exam_year", undergraduateData.academicQualifications.nabtebResults.examYear);
        formData.append("nabteb_subjects", JSON.stringify(undergraduateData.academicQualifications.nabtebResults.subjects));
        if (undergraduateData.academicQualifications.nabtebResults.documents) {
          formData.append("nabteb_result", undergraduateData.academicQualifications.nabtebResults.documents);
        }
      }

      // Add JAMB results
      formData.append("jamb_reg_number", undergraduateData.academicQualifications.jambResults.regNumber);
      formData.append("jamb_year", undergraduateData.academicQualifications.jambResults.examYear);
      formData.append("jamb_score", undergraduateData.academicQualifications.jambResults.score);
      if (undergraduateData.academicQualifications.jambResults.documents) {
        formData.append("jamb_result", undergraduateData.academicQualifications.jambResults.documents);
      }

      // Add files
      if (undergraduateData.passportPhoto) {
        formData.append("passport_photo", undergraduateData.passportPhoto);
      }

      // Add program type and academic session
      formData.append("program_type", "undergraduate");
      formData.append("academic_session", undergraduateData.academicSession);
      formData.append("is_draft", "true");

      // If we have a draft ID, update it; otherwise create new
      const response = draftId 
        ? await apiService.updateDraftApplication(draftId, formData)
        : await apiService.saveDraftApplication(formData);

      setDraftId(response.id);
      setIsDraft(true);

      toast.success("Application saved as draft", {
        description: "Your application has been saved successfully. You can continue editing later.",
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error("Failed to save draft", {
        description: "There was an error saving your application. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Incomplete Application", {
        description: "Please fill in all required fields before submitting.",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Add all the same fields as in handleSaveAsDraft
      // ... (copy all the formData.append calls from handleSaveAsDraft)
      
      // Set is_draft to false for final submission
      formData.append("is_draft", "false");

      // Submit the form data
      const response = await apiService.submitApplication(formData);
      
      // Clear draft data if it exists
      if (draftId) {
        await apiService.deleteDraftApplication(draftId);
        setDraftId(null);
        setIsDraft(false);
      }

      toast.success("Application submitted successfully", {
        description: "Your application has been submitted. You will receive a confirmation email shortly.",
      });

      // Redirect to congratulatory page
      navigate("/application-success");
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Submission failed", {
        description: "There was an error submitting your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [selectedExams, setSelectedExams] = useState<string[]>([]);

  const handleExamSelection = (examType: string) => {
    setSelectedExams(prev => {
      if (prev.includes(examType)) {
        return prev.filter(type => type !== examType);
      }
      if (prev.length >= 2) {
        toast.error("You can only select a maximum of 2 exam results");
        return prev;
      }
      return [...prev, examType];
    });
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
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
          Course of Study
          <span className="text-red-500 text-xs italic">Required</span>
        </Label>
        <Select 
          value={undergraduateData.selectedCourse} 
          onValueChange={(value) => setUndergraduateData(prev => ({
            ...prev,
            selectedCourse: value
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

    <div className="space-y-2">
      <Label>Blood Group</Label>
      <p className="text-red-500 text-xs italic">Required</p>
      <Select
        value={undergraduateData.personalDetails.bloodGroup}
        onValueChange={(value) => handlePersonalDetailsChange("bloodGroup", value)}
      >
        <SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="A">A</SelectItem>
          <SelectItem value="B">B</SelectItem>
          <SelectItem value="AB">AB</SelectItem>
          <SelectItem value="O">O</SelectItem>
          <SelectItem value="Unknown">Unknown</SelectItem>
        </SelectContent>
      </Select>
    </div>
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
            <p className="text-sm text-gray-600">Select up to 2 exam results to submit</p>
            
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
                              examNumber: e.target.value
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
                      <Input
                        placeholder="Enter exam year"
                        value={undergraduateData.academicQualifications.waecResults.examYear}
                        onChange={(e) => setUndergraduateData(prev => ({
                          ...prev,
                          academicQualifications: {
                            ...prev.academicQualifications,
                            waecResults: {
                              ...prev.academicQualifications.waecResults,
                              examYear: e.target.value
                            }
                          }
                        }))}
                        required
                      />
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
                              examNumber: e.target.value
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
                      <Input
                        placeholder="Enter exam year"
                        value={undergraduateData.academicQualifications.necoResults.examYear}
                        onChange={(e) => setUndergraduateData(prev => ({
                          ...prev,
                          academicQualifications: {
                            ...prev.academicQualifications,
                            necoResults: {
                              ...prev.academicQualifications.necoResults,
                              examYear: e.target.value
                            }
                          }
                        }))}
                        required
                      />
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
                              examNumber: e.target.value
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
                      <Input
                        placeholder="Enter exam year"
                        value={undergraduateData.academicQualifications.nabtebResults.examYear}
                        onChange={(e) => setUndergraduateData(prev => ({
                          ...prev,
                          academicQualifications: {
                            ...prev.academicQualifications,
                            nabtebResults: {
                              ...prev.academicQualifications.nabtebResults,
                              examYear: e.target.value
                            }
                          }
                        }))}
                        required
                      />
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
                        regNumber: e.target.value
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
                <Input
                  placeholder="Enter exam year"
                  value={undergraduateData.academicQualifications.jambResults.examYear}
                  onChange={(e) => setUndergraduateData(prev => ({
                    ...prev,
                    academicQualifications: {
                      ...prev.academicQualifications,
                      jambResults: {
                        ...prev.academicQualifications.jambResults,
                        examYear: e.target.value
                      }
                    }
                  }))}
                  required
                />
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
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">
              By clicking submit, you agree that all information provided is true and accurate. You understand that any false information may result in the rejection of your application.
            </p>
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

export default UndergraduateForm; 