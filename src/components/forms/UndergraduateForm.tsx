import React, { useState } from "react";
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

const UndergraduateForm = () => {
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
      description: `${file.name} has been uploaded.`
    });
  };

  const handleClearFile = (fieldId: string) => {
    setUndergraduateData((prev) => ({
      ...prev,
      passportPhoto: null
    }));
    
    toast.info("File removed", {
      description: "The file has been removed."
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
        description: "Your application has been saved successfully. You can continue editing later."
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error("Failed to save draft", {
        description: "There was an error saving your application. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Incomplete Application", {
        description: "Please fill in all required fields before submitting."
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
        }
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Submission failed", {
        description: "There was an error submitting your application. Please try again."
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
              <Input
                id="surname"
                value={undergraduateData.personalDetails.surname}
                onChange={(e) => handlePersonalDetailsChange('surname', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={undergraduateData.personalDetails.firstName}
                onChange={(e) => handlePersonalDetailsChange('firstName', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherNames">Other Names</Label>
              <Input
                id="otherNames"
                value={undergraduateData.personalDetails.otherNames}
                onChange={(e) => handlePersonalDetailsChange('otherNames', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={undergraduateData.personalDetails.gender}
                onValueChange={(value) => handlePersonalDetailsChange('gender', value)}
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
              <Label>Date of Birth *</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={undergraduateData.personalDetails.dateOfBirth.day}
                  onValueChange={(value) => handleDateChange('dateOfBirth', 'day', value)}
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
              <Label htmlFor="nationality">Nationality *</Label>
              <Select
                value={undergraduateData.personalDetails.nationality}
                onValueChange={(value) => handlePersonalDetailsChange('nationality', value)}
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

            <div className="space-y-2">
              <Label htmlFor="stateOfOrigin">State of Origin *</Label>
              <Input
                id="stateOfOrigin"
                value={undergraduateData.personalDetails.stateOfOrigin}
                onChange={(e) => handlePersonalDetailsChange('stateOfOrigin', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={undergraduateData.personalDetails.email}
                onChange={(e) => handlePersonalDetailsChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={undergraduateData.personalDetails.phoneNumber}
                onChange={(e) => handlePersonalDetailsChange('phoneNumber', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="streetAddress">Street Address *</Label>
            <Textarea
              id="streetAddress"
              value={undergraduateData.personalDetails.streetAddress}
              onChange={(e) => handlePersonalDetailsChange('streetAddress', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={undergraduateData.personalDetails.city}
                onChange={(e) => handlePersonalDetailsChange('city', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select
                value={undergraduateData.personalDetails.country}
                onValueChange={(value) => handlePersonalDetailsChange('country', value)}
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
            <RadioGroup
              value={undergraduateData.personalDetails.hasDisabilities}
              onValueChange={(value) => handlePersonalDetailsChange('hasDisabilities', value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="disabilities-yes" />
                <Label htmlFor="disabilities-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="disabilities-no" />
                <Label htmlFor="disabilities-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {undergraduateData.personalDetails.hasDisabilities === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="disabilityDescription">Please describe your disability *</Label>
              <Textarea
                id="disabilityDescription"
                value={undergraduateData.personalDetails.disabilityDescription}
                onChange={(e) => handlePersonalDetailsChange('disabilityDescription', e.target.value)}
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