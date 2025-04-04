import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
      cgpa: string;
      subject: string;
      institution: string;
      startDate: DateField;
      endDate: DateField;
      documents: File[];
    };
    otherQualifications?: File;
  };
  statementOfPurpose: File[];
  applicationFee: File | null;
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
                Accepted formats: {acceptedTypes} (Max: {maxSize})
              </span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

const PostgraduateForm: React.FC = () => {
  const [postgraduateData, setPostgraduateData] = useState<FormData>({
    applicantType: "Nigerian",
    passportPhoto: null,
    academicSession: getCurrentAcademicSession(),
    programType: "MSc",
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
        documents: [],
      }
    },
    statementOfPurpose: [],
    references: {
      referee1: { name: "", email: "" },
      referee2: { name: "", email: "" },
    },
    applicationFee: null,
    declaration: "",
    nationality: "Nigerian",
  });
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

  // Add countries array
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

  const isFormValid = () => {
    // Check required fields
    if (!postgraduateData.passportPhoto) return false;
    if (!postgraduateData.applicationFee) return false;
    if (!postgraduateData.program) return false;
    
    // Check personal details
    const pd = postgraduateData.personalDetails;
    if (!pd.surname || !pd.firstName || !pd.gender || !pd.dateOfBirth.day || 
        !pd.dateOfBirth.month || !pd.dateOfBirth.year || !pd.streetAddress || 
        !pd.city || !pd.country || !pd.stateOfOrigin || !pd.nationality || 
        !pd.phoneNumber || !pd.email) return false;

    // Check academic qualifications
    const aq = postgraduateData.academicQualifications.qualification1;
    if (!aq.type || !aq.grade || !aq.cgpa || !aq.subject || !aq.institution || 
        !aq.documents.length) return false;

    // Check statement of purpose
    if (!postgraduateData.statementOfPurpose.length) return false;

    // Check references
    const refs = postgraduateData.references;
    if (!refs.referee1.name || !refs.referee1.email || !refs.referee2.name || 
        !refs.referee2.email) return false;

    // Check declaration
    if (!postgraduateData.declaration) return false;

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
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft', {
        description: 'There was an error saving your application. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error('Incomplete Application', {
        description: 'Please fill in all required fields before submitting.',
        duration: 5000,
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Add your submit logic here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      // Submit to your backend
      toast.custom((t) => (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <Check className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-900">Application submitted successfully</h3>
            <p className="text-green-700 text-sm mt-1">
              Your application has been submitted. You will receive a confirmation email shortly.
            </p>
            <button 
              onClick={() => console.log('Navigate to status page')}
              className="mt-2 text-sm font-medium text-green-600 hover:text-green-800"
            >
              View Status →
            </button>
          </div>
        </div>
      ), {
        duration: 8000,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Submission failed', {
        description: 'There was an error submitting your application. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
     <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
  <h3 className="text-lg font-semibold">Application Fee Payment *</h3>
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

    {/* Applicant Type Selection */}
    <div className="space-y-2">
      <Label>Are you a Nigerian or International Applicant? *</Label>
      <Select
        value={postgraduateData.applicantType}
        onValueChange={(value: "Nigerian" | "International") =>
          setPostgraduateData((prev) => ({
            ...prev,
            applicantType: value,
            personalDetails: {
              ...prev.personalDetails,
              nationality: value === "Nigerian" ? "Nigerian" : prev.personalDetails.nationality
            }
          }))
        }
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

    {/* Upload Payment Evidence */}
    <FileUploadField
      id="applicationFee"
      label="Payment Evidence"
      accept=".pdf,.jpg,.jpeg,.png"
      value={postgraduateData.applicationFee ? [postgraduateData.applicationFee] : null}
      onChange={(files) => setPostgraduateData(prev => ({
        ...prev,
        applicationFee: files ? files[0] : null
      }))}
      onRemove={() => setPostgraduateData(prev => ({
        ...prev,
        applicationFee: null
      }))}
      maxSize="10MB"
    />
  </div>
</div>


      {/* Passport Photo Upload */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Passport Photograph *</h3>
        <div className="space-y-4">
          <FileUploadField
            id="passportPhoto"
            label="Passport Photograph"
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
            <Label>Academic Session *</Label>
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
            <Label>Program Type *</Label>
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
            <Label>Program *</Label>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Surname *</Label>
              <Input
                placeholder="Enter your surname"
                value={postgraduateData.personalDetails.surname}
                onChange={(e) => handlePersonalDetailsChange("surname", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>First Name *</Label>
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

          <div className="space-y-2">
            <Label>Gender *</Label>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Day of Birth</Label>
              <Select
                value={postgraduateData.personalDetails.dateOfBirth.day}
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
                value={postgraduateData.personalDetails.dateOfBirth.month}
                onValueChange={(value) => handleDateChange("dateOfBirth", "month", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year of Birth</Label>
              <Select
                value={postgraduateData.personalDetails.dateOfBirth.year}
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
            <Label>Street Address *</Label>
            <Input
              placeholder="Enter your street address"
              value={postgraduateData.personalDetails.streetAddress}
              onChange={(e) => handlePersonalDetailsChange("streetAddress", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City *</Label>
              <Input
                placeholder="Enter your city"
                value={postgraduateData.personalDetails.city}
                onChange={(e) => handlePersonalDetailsChange("city", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Country *</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>State of Origin *</Label>
              <Input
                placeholder="Enter your state of origin"
                value={postgraduateData.personalDetails.stateOfOrigin}
                onChange={(e) => handlePersonalDetailsChange("stateOfOrigin", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Nationality *</Label>
              {postgraduateData.applicantType === "Nigerian" ? (
                <Input
                  value="Nigerian"
                  disabled
                  className="bg-gray-100"
                />
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={postgraduateData.personalDetails.phoneNumber}
                onChange={(e) => handlePersonalDetailsChange("phoneNumber", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
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
            <Label>Do you have any disabilities?</Label>
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

          {postgraduateData.personalDetails.hasDisabilities === "Yes" && (
            <div className="space-y-2">
              <Label>Please describe your disability</Label>
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
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Please provide accurate information about your academic qualifications. All fields marked with * are required.
            </p>
          </div>

          {/* First Degree */}
          <div className="space-y-4">
            <h4 className="font-medium">First Degree *</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select
                  value={postgraduateData.academicQualifications.qualification1.type}
                  onValueChange={(value) => {
                    setPostgraduateData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        qualification1: {
                          ...prev.academicQualifications.qualification1,
                          type: value
                        }
                      }
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BSc">BSc</SelectItem>
                    <SelectItem value="BA">BA</SelectItem>
                    <SelectItem value="BEng">BEng</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {postgraduateData.academicQualifications.qualification1.type === "Other" && (
                <div className="space-y-2">
                  <Label>Specify Other Type *</Label>
                  <Input
                    placeholder="Enter degree type"
                    value={postgraduateData.academicQualifications.qualification1.otherType}
                    onChange={(e) => {
                      setPostgraduateData(prev => ({
                        ...prev,
                        academicQualifications: {
                          ...prev.academicQualifications,
                          qualification1: {
                            ...prev.academicQualifications.qualification1,
                            otherType: e.target.value
                          }
                        }
                      }));
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Grade *</Label>
                <Select
                  value={postgraduateData.academicQualifications.qualification1.grade}
                  onValueChange={(value) => {
                    setPostgraduateData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        qualification1: {
                          ...prev.academicQualifications.qualification1,
                          grade: value
                        }
                      }
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Class">First Class</SelectItem>
                    <SelectItem value="Second Class Upper">Second Class Upper</SelectItem>
                    <SelectItem value="Second Class Lower">Second Class Lower</SelectItem>
                    <SelectItem value="Third Class">Third Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>CGPA *</Label>
                <Input
                  placeholder="Enter CGPA"
                  value={postgraduateData.academicQualifications.qualification1.cgpa}
                  onChange={(e) => {
                    setPostgraduateData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        qualification1: {
                          ...prev.academicQualifications.qualification1,
                          cgpa: e.target.value
                        }
                      }
                    }));
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject/Course *</Label>
                <Input
                  placeholder="Enter your course of study"
                  value={postgraduateData.academicQualifications.qualification1.subject}
                  onChange={(e) => {
                    setPostgraduateData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        qualification1: {
                          ...prev.academicQualifications.qualification1,
                          subject: e.target.value
                        }
                      }
                    }));
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Institution *</Label>
                <Input
                  placeholder="Enter institution name"
                  value={postgraduateData.academicQualifications.qualification1.institution}
                  onChange={(e) => {
                    setPostgraduateData(prev => ({
                      ...prev,
                      academicQualifications: {
                        ...prev.academicQualifications,
                        qualification1: {
                          ...prev.academicQualifications.qualification1,
                          institution: e.target.value
                        }
                      }
                    }));
                  }}
                />
              </div>
            </div>

            {/* Qualification 1 Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <div className="grid grid-cols-2 gap-2">
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
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>
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
                <Label>End Date</Label>
                <div className="grid grid-cols-2 gap-2">
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
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>
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

            <div className="space-y-2">
              <Label>Upload Documents *</Label>
              <FileUploadField
                id="qualification1Documents"
                label="Upload Documents (Certificate, Transcripts)"
                accept=".pdf"
                value={postgraduateData.academicQualifications.qualification1.documents}
                onChange={(files) => setPostgraduateData(prev => ({
                  ...prev,
                  academicQualifications: {
                    ...prev.academicQualifications,
                    qualification1: {
                      ...prev.academicQualifications.qualification1,
                      documents: files || []
                    }
                  }
                }))}
                onRemove={() => setPostgraduateData(prev => ({
                  ...prev,
                  academicQualifications: {
                    ...prev.academicQualifications,
                    qualification1: {
                      ...prev.academicQualifications.qualification1,
                      documents: []
                    }
                  }
                }))}
                multiple={true}
                maxSize="10MB"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statement of Purpose */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Statement of Purpose/Personal Statement</h3>
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
            label="Statement of Purpose"
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
            multiple={false}
            maxSize="10MB"
          />
        </div>
      </div>

      {/* Other Academic Qualifications */}
      <div className="space-y-6 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold">Other Academic Qualifications</h3>
        <div className="space-y-4">
          <FileUploadField
            id="otherQualifications"
            label="Additional Qualifications"
            accept=".pdf"
            value={postgraduateData.academicQualifications.otherQualifications ? [postgraduateData.academicQualifications.otherQualifications] : null}
            onChange={(files) => setPostgraduateData(prev => ({
              ...prev,
              academicQualifications: {
                ...prev.academicQualifications,
                otherQualifications: files ? files[0] : undefined
              }
            }))}
            onRemove={() => setPostgraduateData(prev => ({
              ...prev,
              academicQualifications: {
                ...prev.academicQualifications,
                otherQualifications: undefined
              }
            }))}
            maxSize="10MB"
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
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
                <Label>Email Address</Label>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
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
                <Label>Email Address</Label>
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