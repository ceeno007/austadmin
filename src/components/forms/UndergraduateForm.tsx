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
    waecResults: {
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

const UndergraduateForm = () => {
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

  // Generate years from current year to 5 years back
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
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
          disabilityDescription: disability_description || prev.personalDetails.disabilityDescription
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

  const handleSaveAsDraft = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Application saved as draft", {
        description: "Your application has been saved successfully. You can continue editing later.",
        style: {
          background: '#10B981', // Green background
          color: 'white',
        }
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error("Failed to save draft", {
        description: "There was an error saving your application. Please try again.",
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
      toast.error("Incomplete Application", {
        description: "Please fill in all required fields before submitting.",
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Application submitted successfully", {
        description: "Your application has been submitted. You will receive a confirmation email shortly.",
        action: {
          label: "View Status →",
          onClick: () => console.log("Navigate to status page")
        },
        style: {
          background: '#10B981', // Green background
          color: 'white',
        }
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Submission failed", {
        description: "There was an error submitting your application. Please try again.",
        style: {
          background: '#EF4444', // Red background
          color: 'white',
        }
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <li>Meet the minimum cutoff mark (140 for 2024/2025)</li>
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
        <Label htmlFor="surname">Surname *</Label>
        <Input id="surname" value={undergraduateData.personalDetails.surname} onChange={(e) => handlePersonalDetailsChange('surname', e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name *</Label>
        <Input id="firstName" value={undergraduateData.personalDetails.firstName} onChange={(e) => handlePersonalDetailsChange('firstName', e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="otherNames">Other Names</Label>
        <Input id="otherNames" value={undergraduateData.personalDetails.otherNames} onChange={(e) => handlePersonalDetailsChange('otherNames', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gender">Gender *</Label>
        <Select value={undergraduateData.personalDetails.gender} onValueChange={(value) => handlePersonalDetailsChange('gender', value)}>
          <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Date of Birth *</Label>
        <div className="grid grid-cols-3 gap-2">
          <Select value={undergraduateData.personalDetails.dateOfBirth.day} onValueChange={(value) => handleDateChange('dateOfBirth', 'day', value)}>
            <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
            <SelectContent>{days.map((day) => (<SelectItem key={day} value={day}>{day}</SelectItem>))}</SelectContent>
          </Select>
          <Select value={undergraduateData.personalDetails.dateOfBirth.month} onValueChange={(value) => handleDateChange('dateOfBirth', 'month', value)}>
            <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
            <SelectContent>{months.map((month, index) => (<SelectItem key={month} value={(index + 1).toString().padStart(2, '0')}>{month}</SelectItem>))}</SelectContent>
          </Select>
          <Select value={undergraduateData.personalDetails.dateOfBirth.year} onValueChange={(value) => handleDateChange('dateOfBirth', 'year', value)}>
            <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent>{years.map((year) => (<SelectItem key={year} value={year.toString()}>{year}</SelectItem>))}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="nationality">Nationality *</Label>
        <Select value={undergraduateData.personalDetails.nationality} onValueChange={(value) => handlePersonalDetailsChange('nationality', value)}>
          <SelectTrigger><SelectValue placeholder="Select nationality" /></SelectTrigger>
          <SelectContent>{countries.map((country) => (<SelectItem key={country} value={country}>{country}</SelectItem>))}</SelectContent>
        </Select>
      </div>
      {undergraduateData.personalDetails.nationality === 'Nigeria' && (
        <div className="space-y-2">
          <Label htmlFor="stateOfOrigin">State of Origin *</Label>
          <Select value={undergraduateData.personalDetails.stateOfOrigin} onValueChange={(value) => handlePersonalDetailsChange('stateOfOrigin', value)}>
            <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
            <SelectContent>{nigeriaStates.map((state) => (<SelectItem key={state} value={state}>{state}</SelectItem>))}</SelectContent>
          </Select>
        </div>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Phone Number *</Label>
        <PhoneInput
          international
          defaultCountry="NG"
          value={undergraduateData.personalDetails.phoneNumber}
          onChange={(value) => handlePersonalDetailsChange("phoneNumber", value || "")}
          className="!flex !items-center !gap-2 [&>input]:!flex-1 [&>input]:!h-10 [&>input]:!rounded-md [&>input]:!border [&>input]:!border-input [&>input]:!bg-background [&>input]:!px-3 [&>input]:!py-2 [&>input]:!text-sm [&>input]:!ring-offset-background [&>input]:!placeholder:text-muted-foreground [&>input]:!focus-visible:outline-none [&>input]:!focus-visible:ring-2 [&>input]:!focus-visible:ring-ring [&>input]:!focus-visible:ring-offset-2 [&>input]:!disabled:cursor-not-allowed [&>input]:!disabled:opacity-50"
          placeholder="Enter phone number"
        />
      </div>
      <div className="space-y-2">
        <Label>Email *</Label>
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
      <Label>Do you have any disabilities? *</Label>
      <Select
        value={undergraduateData.personalDetails.hasDisabilities}
        onValueChange={(value) => handlePersonalDetailsChange("hasDisabilities", value)}
      >
        <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Yes">Yes</SelectItem>
          <SelectItem value="No">No</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {undergraduateData.personalDetails.hasDisabilities === "Yes" && (
      <div className="space-y-2">
        <Label>Please specify your disabilities *</Label>
        <Textarea
          placeholder="Describe your disabilities"
          value={undergraduateData.personalDetails.disabilityDescription}
          onChange={(e) => handlePersonalDetailsChange("disabilityDescription", e.target.value)}
          required
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
            <h4 className="font-medium">O'Level Results *</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Exam Number *</Label>
                <Input
                  placeholder="Enter exam number"
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
                <Label>Exam Year *</Label>
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
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.slice(-10).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <FileUploadField
              id="waecDocuments"
              label="Upload O'Level Results"
              accept=".pdf"
              value={undergraduateData.academicQualifications.waecResults.documents ? [undergraduateData.academicQualifications.waecResults.documents] : null}
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
          </div>

          {/* JAMB Results */}
          <div className="space-y-4">
            <h4 className="font-medium">JAMB Results *</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Registration Number *</Label>
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
                <Label>JAMB Score *</Label>
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
                <Label>JAMB Year *</Label>
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
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
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

            <FileUploadField
              id="jambDocuments"
              label="Upload JAMB Result"
              accept=".pdf"
              value={undergraduateData.academicQualifications.jambResults.documents ? [undergraduateData.academicQualifications.jambResults.documents] : null}
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
        <h3 className="text-lg font-semibold">Declaration *</h3>
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
            <Label>Full Name (in lieu of signature) *</Label>
            <Input
              placeholder="Type your full name"
              value={undergraduateData.declaration}
              onChange={(e) => setUndergraduateData(prev => ({ ...prev, declaration: e.target.value }))}
              required
            />
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