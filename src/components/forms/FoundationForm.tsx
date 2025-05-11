import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, CheckCircle2, AlertCircle, Check, Copy } from "lucide-react";
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

const FoundationForm = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Incomplete Application", {
        description: "Please fill in all required fields before submitting.",
        style: {
          background: '#EF4444',
          color: 'white',
        }
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Add personal details
      formData.append("surname", foundationRemedialData.personalDetails.surname);
      formData.append("first_name", foundationRemedialData.personalDetails.firstName);
      formData.append("other_names", foundationRemedialData.personalDetails.otherNames);
      formData.append("gender", foundationRemedialData.personalDetails.gender);
      formData.append("date_of_birth", `${foundationRemedialData.personalDetails.dateOfBirth.year}-${foundationRemedialData.personalDetails.dateOfBirth.month}-${foundationRemedialData.personalDetails.dateOfBirth.day}`);
      formData.append("street_address", foundationRemedialData.personalDetails.streetAddress);
      formData.append("city", foundationRemedialData.personalDetails.city);
      formData.append("country", foundationRemedialData.personalDetails.country);
      formData.append("state_of_origin", foundationRemedialData.personalDetails.stateOfOrigin);
      formData.append("nationality", foundationRemedialData.personalDetails.nationality);
      formData.append("phone_number", foundationRemedialData.personalDetails.phoneNumber);
      formData.append("email", foundationRemedialData.personalDetails.email);
      formData.append("has_disability", foundationRemedialData.personalDetails.hasDisabilities === "yes" ? "true" : "false");
      formData.append("disability_description", foundationRemedialData.personalDetails.disabilityDescription);

      // Add academic qualifications
      formData.append("exam_number", foundationRemedialData.academicQualifications.examResults.examNumber);
      formData.append("exam_year", foundationRemedialData.academicQualifications.examResults.examYear);

      // Add files if they exist
      if (foundationRemedialData.passportPhoto) {
        formData.append("passport_photo", foundationRemedialData.passportPhoto);
      }
      if (foundationRemedialData.academicQualifications.examResults.documents) {
        formData.append("waec_result", foundationRemedialData.academicQualifications.examResults.documents);
      }

      // Add program type and academic session
      formData.append("program_type", "foundation_remedial");
      formData.append("academic_session", foundationRemedialData.academicSession);
      formData.append("is_draft", "false");

      // Submit the form data
      const response = await apiService.submitApplication(formData);
      
      // Save to localStorage
      localStorage.setItem('applicationData', JSON.stringify({
        ...response,
        program_type: "foundation_remedial"
      }));

      toast.success("Application submitted successfully", {
        description: "Your application has been submitted. You will receive a confirmation email shortly.",
        style: {
          background: '#10B981',
          color: 'white',
        }
      });

      // Redirect to congratulatory page
      navigate("/application-success");
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Submission failed", {
        description: "There was an error submitting your application. Please try again.",
        style: {
          background: '#EF4444',
          color: 'white',
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
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
              <Label>Surname *</Label>
              <Input
                placeholder="Enter your surname"
                value={foundationRemedialData.personalDetails.surname}
                onChange={(e) => handlePersonalDetailsChange("surname", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>First Name *</Label>
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

          <div className="space-y-2">
            <Label>Gender *</Label>
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

          {/* Date of Birth */}
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label>Day of Birth</Label>
              <Select
                value={foundationRemedialData.personalDetails.dateOfBirth.day}
                onValueChange={(value) => handleDateChange("dateOfBirth", "day", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Month of Birth</Label>
              <Select
                value={foundationRemedialData.personalDetails.dateOfBirth.month}
                onValueChange={(value) => handleDateChange("dateOfBirth", "month", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={(index + 1).toString().padStart(2, "0")}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year of Birth</Label>
              <Select
                value={foundationRemedialData.personalDetails.dateOfBirth.year}
                onValueChange={(value) => handleDateChange("dateOfBirth", "year", value)}
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

          <div className="space-y-2">
            <Label>Nationality *</Label>
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
              <Label>State of Origin *</Label>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone Number *</Label>
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
              <Label>Email *</Label>
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
            <Label htmlFor="streetAddress">Street Address *</Label>
            <Textarea
              id="streetAddress"
              value={foundationRemedialData.personalDetails.streetAddress}
              onChange={(e) => handlePersonalDetailsChange("streetAddress", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={foundationRemedialData.personalDetails.city}
                onChange={(e) => handlePersonalDetailsChange("city", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
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
            <Label>Do you have any disabilities? *</Label>
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
              <Label>Parent/Guardian Name *</Label>
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
              <Label>Occupation *</Label>
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
            <Label>Home Address *</Label>
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
              <Label>Mobile Number *</Label>
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
              <Label>Email Address</Label>
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
            <Label>Programme of Choice *</Label>
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

          <div className="space-y-2">
            <Label>Subject Combination</Label>
            <Textarea
              value={foundationRemedialData.programChoice.subjectCombination}
              onChange={(e) => setFoundationRemedialData(prev => ({
                ...prev,
                programChoice: {
                  ...prev.programChoice,
                  subjectCombination: e.target.value
                }
              }))}
              placeholder="Enter your subject combination"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">First Choice of University, Department and Faculty *</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>University</Label>
                <Input
                  placeholder="Enter university"
                  value={foundationRemedialData.programChoice.firstChoice.university}
                  onChange={(e) => setFoundationRemedialData(prev => ({
                    ...prev,
                    programChoice: {
                      ...prev.programChoice,
                      firstChoice: {
                        ...prev.programChoice.firstChoice,
                        university: e.target.value
                      }
                    }
                  }))}
                  required
                />
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
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Second Choice of University, Department and Faculty *</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>University</Label>
                <Input
                  placeholder="Enter university"
                  value={foundationRemedialData.programChoice.secondChoice.university}
                  onChange={(e) => setFoundationRemedialData(prev => ({
                    ...prev,
                    programChoice: {
                      ...prev.programChoice,
                      secondChoice: {
                        ...prev.programChoice.secondChoice,
                        university: e.target.value
                      }
                    }
                  }))}
                  required
                />
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
      </div>

      {/* Academic Qualifications Section */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Academic Qualifications</h3>
        <div className="space-y-6">
          {/* O'Level Results */}
          <div className="space-y-4">
            <h4 className="font-medium">O'Level Results *</h4>
            
            {/* WAEC Results */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-md">
              <h5 className="font-medium">WAEC Results</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Exam Type</Label>
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

              <div className="space-y-2">
                <Label>Subjects and Grades *</Label>
                <Textarea
                  placeholder="Enter subjects and grades (e.g., Mathematics: A1, English: B2)"
                  value={foundationRemedialData.academicQualifications.examResults.subjects.map(s => `${s.subject}: ${s.grade}`).join(', ')}
                  onChange={(e) => {
                    const subjectsText = e.target.value;
                    const subjectsArray = subjectsText.split(',').map(s => s.trim()).filter(s => s);
                    const subjects = subjectsArray.map(s => {
                      const [subject, grade] = s.split(':').map(part => part.trim());
                      return { subject, grade };
                    });
                    
                    setFoundationRemedialData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        examResults: {
                          ...prev.academicQualifications.examResults,
                          subjects
                        }
                      }
                    }));
                  }}
                  required
                />
              </div>

              <FileUploadField
                id="waecDocuments"
                label="Upload WAEC Results"
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
        <h3 className="text-lg font-semibold">Declaration *</h3>
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
      </div>
    </form>
  );
};

export default FoundationForm; 