import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, CheckCircle2, AlertCircle, Info, AlertTriangle, CreditCard, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import PortalNav from "@/components/PortalNav";
import austLogo from "@/assets/images/austlogo.webp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DocumentField {
  id: string;
  label: string;
  required: boolean;
  file: File | null;
}

interface PostgraduateFormData {
  academicSession: string;
  programType: string;
  program: string;
  personalDetails: {
    surname: string;
    firstName: string;
    otherNames: string;
    gender: string;
    dateOfBirth: string;
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
      grade: string;
      cgpa: string;
      subject: string;
      institution: string;
      startDate: string;
      endDate: string;
      documents: File | null;
    };
    qualification2?: {
      type: string;
      cgpa: string;
      subject: string;
      institution: string;
      startDate: string;
      endDate: string;
      documents: File | null;
    };
  };
  statementOfPurpose: File | null;
  applicationFee: File | null;
  references: {
    referee1: { name: string; email: string };
    referee2: { name: string; email: string };
  };
  declaration: string;
}

// Add Flutterwave types
declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

const DocumentUpload = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("programType") || "undergraduate";
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("userName") || "User";
  });
  const [programType, setProgramType] = useState(() => {
    return localStorage.getItem("programType") || "undergraduate";
  });
  const [selectedProgram, setSelectedProgram] = useState("");
  const [notes, setNotes] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    content: "",
  });

  // Get user ID from URL or localStorage
  const [userId, setUserId] = useState(() => {
    const pathParts = window.location.pathname.split('/');
    const idFromUrl = pathParts[pathParts.length - 1];
    return idFromUrl === 'documents' ? '' : idFromUrl;
  });

  // Update URL when userId changes
  useEffect(() => {
    if (userId && window.location.pathname !== `/documents/${userId}`) {
      window.history.pushState({}, '', `/documents/${userId}`);
    }
  }, [userId]);

  // Function to get current academic session
  const getCurrentAcademicSession = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    
    // If we're in the second half of the year (August or later), show next year
    if (currentMonth >= 8) {
      return `${currentYear}/${currentYear + 1}`;
    }
    // Otherwise show current year
    return `${currentYear - 1}/${currentYear}`;
  };

  // List of all countries in the world
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
    "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba",
    "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
    "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
    "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
    "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
    "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman",
    "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
    "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
    "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
    "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
    "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ].sort((a, b) => a.localeCompare(b));

  const [postgraduateData, setPostgraduateData] = useState<PostgraduateFormData>(() => {
    const storedData = localStorage.getItem("applicationData");
    if (storedData) {
      const data = JSON.parse(storedData);
      const application = data.applications?.[0];
      if (application) {
        // Split full name into parts
        const nameParts = application.full_name?.split(" ") || [];
        const surname = nameParts[0] || "";
        const firstName = nameParts[1] || "";
        const otherNames = nameParts.slice(2).join(" ") || "";

        return {
          academicSession: application.academic_session || getCurrentAcademicSession(),
          programType: application.program_type || "",
          program: application.selected_program || "",
          personalDetails: {
            surname,
            firstName,
            otherNames,
            gender: application.gender || "",
            dateOfBirth: application.date_of_birth?.split("T")[0] || "",
            streetAddress: application.street_address || "",
            city: application.city || "",
            country: application.country || "",
            stateOfOrigin: application.state_of_origin || "",
            nationality: application.nationality || "",
            phoneNumber: application.phone_number || "",
            email: data.user?.email || "",
            hasDisabilities: application.has_disability ? "yes" : "no",
            disabilityDescription: application.disability_description || "",
          },
          academicQualifications: {
            qualification1: {
              type: application.qualification_type || "",
              grade: application.grade || "",
              cgpa: application.cgpa || "",
              subject: application.subject || "",
              institution: application.awarding_institution || "",
              startDate: application.start_date?.split("T")[0] || "",
              endDate: application.end_date?.split("T")[0] || "",
              documents: null,
            },
          },
          statementOfPurpose: null,
          applicationFee: null,
          references: {
            referee1: { 
              name: application.first_referee_name || "", 
              email: application.first_referee_email || "" 
            },
            referee2: { 
              name: application.second_referee_name || "", 
              email: application.second_referee_email || "" 
            },
          },
          declaration: "",
        };
      }
    }
    return {
      academicSession: getCurrentAcademicSession(),
      programType: "",
      program: "",
      personalDetails: {
        surname: "",
        firstName: "",
        otherNames: "",
        gender: "",
        dateOfBirth: "",
        streetAddress: "",
        city: "",
        country: "",
        stateOfOrigin: "",
        nationality: "",
        phoneNumber: "",
        email: "",
        hasDisabilities: "",
        disabilityDescription: "",
      },
      academicQualifications: {
        qualification1: {
          type: "",
          grade: "",
          cgpa: "",
          subject: "",
          institution: "",
          startDate: "",
          endDate: "",
          documents: null,
        },
      },
      statementOfPurpose: null,
      applicationFee: null,
      references: {
        referee1: { name: "", email: "" },
        referee2: { name: "", email: "" },
      },
      declaration: "",
    };
  });

  // Add useEffect to update form data when user signs in
  useEffect(() => {
    const storedData = localStorage.getItem("applicationData");
    console.log("Stored Application Data:", storedData);
    
    if (!storedData) {
      console.log("No stored data found, initializing with empty values");
      setPostgraduateData({
        academicSession: getCurrentAcademicSession(),
        programType: "",
        program: "",
        personalDetails: {
          surname: "",
          firstName: "",
          otherNames: "",
          gender: "",
          dateOfBirth: "",
          streetAddress: "",
          city: "",
          country: "",
          stateOfOrigin: "",
          nationality: "",
          phoneNumber: "",
          email: "",
          hasDisabilities: "no",
          disabilityDescription: "",
        },
        academicQualifications: {
          qualification1: {
            type: "",
            grade: "",
            cgpa: "",
            subject: "",
            institution: "",
            startDate: "",
            endDate: "",
            documents: null,
          },
        },
        statementOfPurpose: null,
        applicationFee: null,
        references: {
          referee1: { name: "", email: "" },
          referee2: { name: "", email: "" },
        },
        declaration: "",
      });
      return;
    }

    try {
      const data = JSON.parse(storedData);
      console.log("Parsed Application Data:", data);
      
      // Get user data from the response
      const userData = data.user;
      console.log("User Data:", userData);
      
      // Get application data
      const application = data.applications?.[0];
      console.log("First Application:", application);
      
      if (!application) {
        console.log("No application found in data");
        setPostgraduateData({
          academicSession: getCurrentAcademicSession(),
          programType: "",
          program: "",
          personalDetails: {
            surname: "",
            firstName: "",
            otherNames: "",
            gender: "",
            dateOfBirth: "",
            streetAddress: "",
            city: "",
            country: "",
            stateOfOrigin: "",
            nationality: "",
            phoneNumber: "",
            email: userData?.email || "",
            hasDisabilities: "no",
            disabilityDescription: "",
          },
          academicQualifications: {
            qualification1: {
              type: "",
              grade: "",
              cgpa: "",
              subject: "",
              institution: "",
              startDate: "",
              endDate: "",
              documents: null,
            },
          },
          statementOfPurpose: null,
          applicationFee: null,
          references: {
            referee1: { name: "", email: "" },
            referee2: { name: "", email: "" },
          },
          declaration: "",
        });
        return;
      }

      // Create updated postgraduate data
      const updatedData = {
        academicSession: application.academic_session || getCurrentAcademicSession(),
        programType: application.program_type || "",
        program: application.selected_program || "",
        personalDetails: {
          surname: application.surname || "",
          firstName: application.first_name || "",
          otherNames: application.other_names || "",
          gender: application.gender || "",
          dateOfBirth: application.date_of_birth?.split("T")[0] || "",
          streetAddress: application.street_address || "",
          city: application.city || "",
          country: application.country || "",
          stateOfOrigin: application.state_of_origin || "",
          nationality: application.nationality || "",
          phoneNumber: application.phone_number || "",
          email: userData?.email || "",
          hasDisabilities: application.has_disability ? "yes" : "no",
          disabilityDescription: application.disability_description || "",
        },
        academicQualifications: {
          qualification1: {
            type: application.qualification_type || "",
            grade: application.grade || "",
            cgpa: application.cgpa || "",
            subject: application.subject || "",
            institution: application.awarding_institution || "",
            startDate: application.start_date?.split("T")[0] || "",
            endDate: application.end_date?.split("T")[0] || "",
            documents: null,
          },
        },
        statementOfPurpose: null,
        applicationFee: null,
        references: {
          referee1: { 
            name: application.first_referee_name || "", 
            email: application.first_referee_email || "" 
          },
          referee2: { 
            name: application.second_referee_name || "", 
            email: application.second_referee_email || "" 
          },
        },
        declaration: "",
      };

      console.log("Updated Postgraduate Data:", updatedData);
      setPostgraduateData(updatedData);
      
      // Update userId if available
      if (userData?.uuid) {
        setUserId(userData.uuid);
        localStorage.setItem("userId", userData.uuid);
      }
    } catch (error) {
      console.error("Error parsing application data:", error);
      // Initialize with empty values if there's an error
      setPostgraduateData({
        academicSession: getCurrentAcademicSession(),
        programType: "",
        program: "",
        personalDetails: {
          surname: "",
          firstName: "",
          otherNames: "",
          gender: "",
          dateOfBirth: "",
          streetAddress: "",
          city: "",
          country: "",
          stateOfOrigin: "",
          nationality: "",
          phoneNumber: "",
          email: "",
          hasDisabilities: "no",
          disabilityDescription: "",
        },
        academicQualifications: {
          qualification1: {
            type: "",
            grade: "",
            cgpa: "",
            subject: "",
            institution: "",
            startDate: "",
            endDate: "",
            documents: null,
          },
        },
        statementOfPurpose: null,
        applicationFee: null,
        references: {
          referee1: { name: "", email: "" },
          referee2: { name: "", email: "" },
        },
        declaration: "",
      });
    }
  }, [localStorage.getItem("applicationData")]);

  const [isPaymentMade, setIsPaymentMade] = useState(false);
  const [nationality, setNationality] = useState<"nigerian" | "foreign">("nigerian");
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, boolean>>({});

  const [documents, setDocuments] = useState<Record<string, DocumentField[]>>(() => {
    const storedData = localStorage.getItem("applicationData");
    if (storedData) {
      const data = JSON.parse(storedData);
      const application = data.applications?.[0];
      if (application) {
        return {
          undergraduate: [
            { id: "ssce", label: "SSCE Result", required: true, file: null },
            { id: "passport", label: "Passport Photo", required: true, file: null },
            { id: "birth", label: "Birth Certificate", required: true, file: null },
            { id: "statement", label: "Statement of Result", required: true, file: null },
            { id: "jamb", label: "JAMB Result", required: true, file: null },
          ],
          postgraduate: [
            { id: "passport", label: "Recent Passport Photograph", required: true, file: null },
            { id: "degree", label: "Degree Certificate", required: true, file: null },
            { id: "transcript", label: "Academic Transcript", required: true, file: null },
            { id: "statement", label: "Statement of Purpose", required: true, file: null },
            { id: "fee", label: "Application Fee Payment Evidence", required: true, file: null },
            { id: "other", label: "Other Academic Qualifications", required: false, file: null },
          ],
          jupeb: [
            { id: "ssce", label: "SSCE Result", required: true, file: null },
            { id: "passport", label: "Passport Photo", required: true, file: null },
            { id: "birth", label: "Birth Certificate", required: true, file: null },
            { id: "medical", label: "Medical Certificate", required: true, file: null }
          ],
        };
      }
    }
    return {
      undergraduate: [
        { id: "ssce", label: "SSCE Result", required: true, file: null },
        { id: "passport", label: "Passport Photo", required: true, file: null },
        { id: "birth", label: "Birth Certificate", required: true, file: null },
        { id: "statement", label: "Statement of Result", required: true, file: null },
        { id: "jamb", label: "JAMB Result", required: true, file: null },
      ],
      postgraduate: [
        { id: "passport", label: "Recent Passport Photograph", required: true, file: null },
        { id: "degree", label: "Degree Certificate", required: true, file: null },
        { id: "transcript", label: "Academic Transcript", required: true, file: null },
        { id: "statement", label: "Statement of Purpose", required: true, file: null },
        { id: "fee", label: "Application Fee Payment Evidence", required: true, file: null },
        { id: "other", label: "Other Academic Qualifications", required: false, file: null },
      ],
      jupeb: [
        { id: "ssce", label: "SSCE Result", required: true, file: null },
        { id: "passport", label: "Passport Photo", required: true, file: null },
        { id: "birth", label: "Birth Certificate", required: true, file: null },
        { id: "medical", label: "Medical Certificate", required: true, file: null }
      ],
    };
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

  // Add useEffect to check if user is logged in
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
        className: "bg-red-50 text-red-800",
      });
      // Redirect to login page
      window.location.href = "/login";
    }
  }, [toast]);

  // Add useEffect to set active tab based on program type
  useEffect(() => {
    const storedProgramType = localStorage.getItem("programType");
    if (storedProgramType) {
      setProgramType(storedProgramType);
      setActiveTab(storedProgramType);
    }
  }, []);

  // Add useEffect to show undergraduate popup on mount
  useEffect(() => {
    const hasShownUndergraduatePopup = localStorage.getItem('hasShownUndergraduatePopup');
    if (!hasShownUndergraduatePopup) {
      setModalContent({
        title: "Undergraduate Programs",
        content: `Applications for all our first-year undergraduate degrees must be made online through the JAMB E-facility Portal. Walk-in applicants who did not select AUST as their school of first choice will also need to visit the JAMB Portal to make the necessary changes to their choice of school on their page. For Direct Entry students applying for our 200 Level programs should send an email to admissions@aust.edu.ng or visit the Admissions Office (MH 113, Mandela Hall).

The minimum cutoff JAMB score for the University for the 2024/2025 Session is 140.

Applicants with a minimum score of 140 who had previously selected AUST as their first choice will automatically be given admission, after meeting the entry requirements for the program being applied for. Walk-in applicants who did not select AUST as their school of first choice, and have met the entry requirements for their program, should take the following steps:

• Visit the JAMB E-facility Portal at https://jamb.gov.ng/efacility and log in with your email address and password.
• Click on the 'Application for Correction of Data (2024)' from the list of services on the left panel.
• From the drop-down menu, select the 'Course/Institution' option and make the necessary changes to AUST.`,
      });
      setShowInfoModal(true);
      localStorage.setItem('hasShownUndergraduatePopup', 'true');
    }
  }, []); // Empty dependency array means this runs once on mount

  // Add useEffect to load Flutterwave script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Add useEffect to update form data when application data changes
  useEffect(() => {
    const storedData = localStorage.getItem("applicationData");
    if (storedData) {
      const data = JSON.parse(storedData);
      const application = data.applications?.[0];
      if (application) {
        // Split full name into parts
        const nameParts = application.full_name?.split(" ") || [];
        const surname = nameParts[0] || "";
        const firstName = nameParts[1] || "";
        const otherNames = nameParts.slice(2).join(" ") || "";

        setPostgraduateData(prev => ({
          ...prev,
          academicSession: application.academic_session || getCurrentAcademicSession(),
          programType: application.program_type || "",
          program: application.selected_program || "",
          personalDetails: {
            ...prev.personalDetails,
            surname,
            firstName,
            otherNames,
            gender: application.gender || "",
            dateOfBirth: application.date_of_birth?.split("T")[0] || "",
            streetAddress: application.street_address || "",
            city: application.city || "",
            country: application.country || "",
            stateOfOrigin: application.state_of_origin || "",
            nationality: application.nationality || "",
            phoneNumber: application.phone_number || "",
            email: data.user?.email || "",
            hasDisabilities: application.has_disability ? "yes" : "no",
            disabilityDescription: application.disability_description || "",
          },
          academicQualifications: {
            ...prev.academicQualifications,
            qualification1: {
              ...prev.academicQualifications.qualification1,
              type: application.qualification_type || "",
              grade: application.grade || "",
              cgpa: application.cgpa || "",
              subject: application.subject || "",
              institution: application.awarding_institution || "",
              startDate: application.start_date?.split("T")[0] || "",
              endDate: application.end_date?.split("T")[0] || "",
            },
          },
          references: {
            referee1: { 
              name: application.first_referee_name || "", 
              email: application.first_referee_email || "" 
            },
            referee2: { 
              name: application.second_referee_name || "", 
              email: application.second_referee_email || "" 
            },
          },
        }));
      }
    }
  }, []);

  const handleFileUpload = (programType: string, fieldId: string, file: File) => {
    setDocuments((prev) => ({
      ...prev,
      [programType]: prev[programType].map((doc) =>
        doc.id === fieldId ? { ...doc, file } : doc
      ),
    }));
    
    // Update uploaded files status
    setUploadedFiles(prev => ({
      ...prev,
      [`${programType}_${fieldId}`]: true
    }));
    
    // If payment receipt is uploaded, enable all fields
    if ((programType === "postgraduate" || programType === "jupeb") && fieldId === "fee") {
      setIsPaymentMade(true);
    }
    
    // Show success toast
    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been uploaded.`,
      className: "bg-green-50 text-green-800",
    });
  };

  const handleClearFile = (programType: string, fieldId: string) => {
    setDocuments((prev) => ({
      ...prev,
      [programType]: prev[programType].map((doc) =>
        doc.id === fieldId ? { ...doc, file: null } : doc
      ),
    }));
    
    // Update uploaded files status
    setUploadedFiles(prev => ({
      ...prev,
      [`${programType}_${fieldId}`]: false
    }));
    
    // If payment receipt is removed, disable all fields
    if ((programType === "postgraduate" || programType === "jupeb") && fieldId === "fee") {
      setIsPaymentMade(false);
    }
    
    // Show info toast
    toast({
      title: "File removed",
      description: "The file has been removed.",
      className: "bg-blue-50 text-blue-800",
    });
  };

  const isFieldEnabled = (fieldId: string) => {
    if (programType === "jupeb") {
      const paymentReceipt = documents.jupeb.find(doc => doc.id === "payment");
      return paymentReceipt?.file !== null;
    }
    return true;
  };

  const handlePostgraduateChange = (field: string, value: any) => {
    setPostgraduateData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePersonalDetailsChange = (field: string, value: string) => {
    setPostgraduateData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value,
      },
    }));
  };

  const handleSaveDraft = () => {
    const draftData = {
      documents: documents[activeTab],
      notes,
      postgraduateData: activeTab === "postgraduate" ? postgraduateData : undefined,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("applicationDraft", JSON.stringify(draftData));
    toast({
      title: "Draft Saved",
      description: "Your application has been saved as a draft.",
      className: "bg-green-50 text-green-800",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === "postgraduate") {
      // Validate declaration
      if (!postgraduateData.declaration) {
        toast({
          title: "Declaration Required",
          description: "Please enter your full name in the declaration section.",
          variant: "destructive",
          className: "bg-red-50 text-red-800",
        });
        return;
      }

      // Validate required fields
      const requiredFields = [
        { field: postgraduateData.personalDetails.surname, message: "Surname is required" },
        { field: postgraduateData.personalDetails.firstName, message: "First name is required" },
        { field: postgraduateData.personalDetails.gender, message: "Gender is required" },
        { field: postgraduateData.personalDetails.dateOfBirth, message: "Date of birth is required" },
        { field: postgraduateData.personalDetails.nationality, message: "Nationality is required" },
        { field: postgraduateData.personalDetails.phoneNumber, message: "Phone number is required" },
        { field: postgraduateData.personalDetails.streetAddress, message: "Street address is required" },
        { field: postgraduateData.personalDetails.city, message: "City is required" },
        { field: postgraduateData.personalDetails.country, message: "Country is required" },
        { field: postgraduateData.programType, message: "Program type is required" },
        { field: postgraduateData.program, message: "Program is required" },
        { field: postgraduateData.academicQualifications.qualification1.type, message: "Qualification type is required" },
        { field: postgraduateData.academicQualifications.qualification1.grade, message: "Grade is required" },
        { field: postgraduateData.academicQualifications.qualification1.cgpa, message: "CGPA is required" },
        { field: postgraduateData.academicQualifications.qualification1.subject, message: "Subject is required" },
        { field: postgraduateData.academicQualifications.qualification1.institution, message: "Institution is required" },
        { field: postgraduateData.academicQualifications.qualification1.startDate, message: "Start date is required" },
        { field: postgraduateData.academicQualifications.qualification1.endDate, message: "End date is required" },
        { field: postgraduateData.references.referee1.name, message: "First referee name is required" },
        { field: postgraduateData.references.referee1.email, message: "First referee email is required" },
        { field: postgraduateData.references.referee2.name, message: "Second referee name is required" },
        { field: postgraduateData.references.referee2.email, message: "Second referee email is required" },
      ];

      for (const { field, message } of requiredFields) {
        if (!field) {
          toast({
            title: "Required Field Missing",
            description: message,
            variant: "destructive",
            className: "bg-red-50 text-red-800",
          });
          return;
        }
      }

      // Validate required files
      const requiredFiles = [
        { id: "passport", label: "Passport Photo" },
        { id: "transcript", label: "Academic Transcript" },
        { id: "degree", label: "Degree Certificate" },
        { id: "statement", label: "Statement of Purpose" },
        { id: "fee", label: "Application Fee Payment Evidence" },
      ];

      for (const { id, label } of requiredFiles) {
        const file = documents.postgraduate.find(doc => doc.id === id)?.file;
        if (!file) {
          toast({
            title: "Required Document Missing",
            description: `${label} is required`,
            variant: "destructive",
            className: "bg-red-50 text-red-800",
          });
          return;
        }
      }

      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          toast({
            title: "Authentication Required",
            description: "Please log in to continue.",
            variant: "destructive",
            className: "bg-red-50 text-red-800",
          });
          return;
        }

        // Create FormData for file uploads
        const formData = new FormData();

        // Add files to FormData
        const passportPhoto = documents.postgraduate.find(doc => doc.id === "passport")?.file;
        const transcript = documents.postgraduate.find(doc => doc.id === "transcript")?.file;
        const certificate = documents.postgraduate.find(doc => doc.id === "degree")?.file;
        const statementOfPurpose = documents.postgraduate.find(doc => doc.id === "statement")?.file;
        const paymentReceipt = documents.postgraduate.find(doc => doc.id === "fee")?.file;
        const otherQualifications = documents.postgraduate.find(doc => doc.id === "other")?.file;

        if (passportPhoto) formData.append('passport_photo', passportPhoto);
        if (transcript) formData.append('transcript', transcript);
        if (certificate) formData.append('certificate', certificate);
        if (statementOfPurpose) formData.append('statement_of_purpose', statementOfPurpose);
        if (paymentReceipt) formData.append('payment_receipt', paymentReceipt);
        if (otherQualifications) formData.append('other_qualifications', otherQualifications);

        // Add query parameters
        const queryParams = new URLSearchParams({
          nationality: postgraduateData.personalDetails.nationality,
          gender: postgraduateData.personalDetails.gender,
          date_of_birth: postgraduateData.personalDetails.dateOfBirth,
          phone_number: postgraduateData.personalDetails.phoneNumber,
          street_address: postgraduateData.personalDetails.streetAddress,
          city: postgraduateData.personalDetails.city,
          country: postgraduateData.personalDetails.country,
          academic_session: postgraduateData.academicSession,
          program_type: postgraduateData.programType,
          selected_program: postgraduateData.program,
          qualification_type: postgraduateData.academicQualifications.qualification1.type,
          grade: postgraduateData.academicQualifications.qualification1.grade,
          cgpa: postgraduateData.academicQualifications.qualification1.cgpa,
          subject: postgraduateData.academicQualifications.qualification1.subject,
          awarding_institution: postgraduateData.academicQualifications.qualification1.institution,
          start_date: postgraduateData.academicQualifications.qualification1.startDate,
          end_date: postgraduateData.academicQualifications.qualification1.endDate,
          first_referee_name: postgraduateData.references.referee1.name,
          first_referee_email: postgraduateData.references.referee1.email,
          second_referee_name: postgraduateData.references.referee2.name,
          second_referee_email: postgraduateData.references.referee2.email,
          state_of_origin: postgraduateData.personalDetails.stateOfOrigin,
          has_disability: postgraduateData.personalDetails.hasDisabilities === "yes" ? "true" : "false",
          disability_description: postgraduateData.personalDetails.disabilityDescription || "",
          declaration: postgraduateData.declaration,
        });

        // Make API call
        const response = await fetch(`https://admissions-qmt4.onrender.com/application/upload?${queryParams.toString()}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to submit application');
        }

        const data = await response.json();
        
        toast({
          title: "Application Submitted",
          description: "Your application has been submitted successfully!",
          className: "bg-green-50 text-green-800",
        });

      } catch (error) {
        console.error('Error submitting application:', error);
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your application. Please try again.",
          variant: "destructive",
          className: "bg-red-50 text-red-800",
        });
      }
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "undergraduate") {
      const hasShownUndergraduatePopup = localStorage.getItem('hasShownUndergraduatePopup');
      if (!hasShownUndergraduatePopup) {
        setModalContent({
          title: "Undergraduate Programs",
          content: `Applications for all our first-year undergraduate degrees must be made online through the JAMB E-facility Portal. Walk-in applicants who did not select AUST as their school of first choice will also need to visit the JAMB Portal to make the necessary changes to their choice of school on their page. For Direct Entry students applying for our 200 Level programs should send an email to admissions@aust.edu.ng or visit the Admissions Office (MH 113, Mandela Hall).

The minimum cutoff JAMB score for the University for the 2024/2025 Session is 140.

Applicants with a minimum score of 140 who had previously selected AUST as their first choice will automatically be given admission, after meeting the entry requirements for the program being applied for. Walk-in applicants who did not select AUST as their school of first choice, and have met the entry requirements for their program, should take the following steps:

• Visit the JAMB E-facility Portal at https://jamb.gov.ng/efacility and log in with your email address and password.
• Click on the 'Application for Correction of Data (2024)' from the list of services on the left panel.
• From the drop-down menu, select the 'Course/Institution' option and make the necessary changes to AUST.`,
        });
        setShowInfoModal(true);
        localStorage.setItem('hasShownUndergraduatePopup', 'true');
      }
    } else if (value === "postgraduate") {
      const hasShownPostgraduatePopup = localStorage.getItem('hasShownPostgraduatePopup');
      if (!hasShownPostgraduatePopup) {
        setModalContent({
          title: "Postgraduate Programs",
          content: `All postgraduate applications are made directly to the African University of Science and Technology. Your applications will be checked by the admissions team and will then be sent to the relevant Department for review and approval. We aim to respond to your application within two weeks.

Postgraduate Entry Requirements:

• Postgraduate Diploma: a minimum of Second Class Lower in their undergraduate program.
• Taught Masters: a minimum of Second Class lower in their undergraduate program.
• Master of Science (MSc): a minimum of Second Class lower in their undergraduate program. Shortlisted applicants will also be required to sit for an online common entrance examination.
• Doctor of Philosophy (Ph.D.): a minimum of Second Class lower in their undergraduate program and also a minimum of a 3.50 CGPA (out of a possible 4.00), or its equivalent, at the masters level.

Note that you will need to pay a non-refundable application form fee of N10,000 during this process.`,
        });
        setShowInfoModal(true);
        localStorage.setItem('hasShownPostgraduatePopup', 'true');
      }
    }
  };

  const handleFlutterwavePayment = () => {
    window.FlutterwaveCheckout({
      public_key: "FLWPUBK_TEST-828dea316e78341d46846add516336fb-X",
      tx_ref: `AUST-PG-${Date.now()}`,
      amount: nationality === "nigerian" ? 10000 : 50,
      currency: nationality === "nigerian" ? "NGN" : "USD",
      payment_options: "card,ussd",
      customer: {
        email: "applicant@example.com", // Temporary mock email
        name: `${postgraduateData.personalDetails.surname} ${postgraduateData.personalDetails.firstName}`,
      },
      customizations: {
        title: "AUST Postgraduate Application Fee",
        description: "Non-refundable application fee for postgraduate programs",
        logo: austLogo
      },
      callback: function(payment: any) {
        if (payment.status === "successful") {
          setIsPaymentMade(true);
          
          // If nationality is Nigerian, set country to Nigeria in personal details
          if (nationality === "nigerian") {
            setPostgraduateData(prev => ({
              ...prev,
              personalDetails: {
                ...prev.personalDetails,
                nationality: "nigeria",
                country: "Nigeria"
              }
            }));
          }
          
          toast({
            title: "Payment Successful",
            description: "You can now proceed with your application.",
            className: "bg-green-50 text-green-800",
          });
        }
      },
      onclose: function() {
        // Handle when payment modal is closed
      }
    });
  };

  // Add a function to handle nationality change
  const handleNationalityChange = (value: "nigerian" | "foreign") => {
    setNationality(value);
    
    // If nationality is Nigerian, set nationality to nigeria in personal details
    if (value === "nigerian") {
      setPostgraduateData(prev => ({
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          nationality: "nigeria"
        }
      }));
    }
  };

  // Function to check if a tab should be disabled
  const isTabDisabled = (tab: string) => {
    return tab !== programType;
  };

  // Program types and their corresponding programs
  const programOptions = {
    undergraduate: [
      { value: "computer_science", label: "Computer Science" },
      { value: "electrical_engineering", label: "Electrical Engineering" },
      { value: "mechanical_engineering", label: "Mechanical Engineering" },
      { value: "civil_engineering", label: "Civil Engineering" },
      { value: "chemical_engineering", label: "Chemical Engineering" },
    ],
    postgraduate: [
      { value: "msc_computer_science", label: "M.Sc. Computer Science" },
      { value: "msc_electrical_engineering", label: "M.Sc. Electrical Engineering" },
      { value: "msc_mechanical_engineering", label: "M.Sc. Mechanical Engineering" },
      { value: "msc_civil_engineering", label: "M.Sc. Civil Engineering" },
      { value: "msc_chemical_engineering", label: "M.Sc. Chemical Engineering" },
    ],
    phd: [
      { value: "phd_computer_science", label: "Ph.D. Computer Science" },
      { value: "phd_electrical_engineering", label: "Ph.D. Electrical Engineering" },
      { value: "phd_mechanical_engineering", label: "Ph.D. Mechanical Engineering" },
      { value: "phd_civil_engineering", label: "Ph.D. Civil Engineering" },
      { value: "phd_chemical_engineering", label: "Ph.D. Chemical Engineering" },
    ],
    jupeb: [
      { value: "jupeb_science", label: "JUPEB Science" },
      { value: "jupeb_engineering", label: "JUPEB Engineering" },
    ],
  };

  // Add postgraduate program options based on program type
  const postgraduateProgramOptions = {
    pgd: [
      { value: "petroleum_engineering_pgd", label: "Petroleum Engineering" },
    ],
    taught: [
      { value: "mit_taught", label: "Management of Information Technology" },
    ],
    msc: [
      { value: "applied_stats", label: "Applied Statistics" },
      { value: "aerospace_engineering", label: "Aerospace Engineering" },
      { value: "computer_science", label: "Computer Science" },
      { value: "geoinformatics", label: "Geoinformatics and GIS" },
      { value: "energy_resources", label: "Energy Resources Engineering" },
      { value: "mit_msc", label: "Management of Information Technology" },
      { value: "materials_science", label: "Materials Science & Engineering" },
      { value: "math_modeling", label: "Mathematical Modeling" },
      { value: "petroleum_engineering", label: "Petroleum Engineering" },
      { value: "public_admin", label: "Public Administration" },
      { value: "public_policy", label: "Public Policy" },
      { value: "pure_math", label: "Pure and Applied Mathematics" },
      { value: "space_physics", label: "Space Physics" },
      { value: "systems_engineering", label: "Systems Engineering" },
      { value: "theoretical_physics", label: "Theoretical and Applied Physics" },
    ],
    phd: [
      { value: "aerospace_engineering_phd", label: "Aerospace Engineering" },
      { value: "computer_science_phd", label: "Computer Science" },
      { value: "geoinformatics_phd", label: "Geoinformatics and GIS" },
      { value: "materials_science_phd", label: "Materials Science & Engineering" },
      { value: "petroleum_engineering_phd", label: "Petroleum Engineering" },
      { value: "pure_math_phd", label: "Pure and Applied Mathematics" },
      { value: "space_physics_phd", label: "Space Physics" },
      { value: "systems_engineering_phd", label: "Systems Engineering" },
      { value: "theoretical_physics_phd", label: "Theoretical and Applied Physics" },
    ],
  };

  // Function to handle program type change
  const handleProgramTypeChange = (value: string) => {
    setPostgraduateData(prev => ({
      ...prev,
      programType: value,
      program: "", // Reset program when program type changes
    }));
  };

  // Add authentication check
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        console.log("No access token found");
        // Clear any existing data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("applicationData");
        localStorage.removeItem("userId");
        // Redirect to login page
        window.location.href = "/login";
        return;
      }
    };

    // Check auth immediately
    checkAuth();

    // Set up interval to check auth every 5 minutes
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handleAcademicQualificationChange = (qualification: 'qualification1' | 'qualification2', field: string, value: string) => {
    setPostgraduateData(prev => ({
      ...prev,
      academicQualifications: {
        ...prev.academicQualifications,
        [qualification]: {
          ...prev.academicQualifications[qualification],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--accent)/0.02)]">
      <PortalNav userName={userName} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {programType === "undergraduate" && "Undergraduate Program"}
              {programType === "postgraduate" && "Postgraduate Program"}
              {programType === "phd" && "Ph.D. Program"}
              {programType === "jupeb" && "JUPEB Program"}
            </h1>
            <p className="text-gray-600 mt-2">Please upload your required documents below</p>
          </div>

          <div className="space-y-6">
            {programType === "postgraduate" ? (
              <div className="space-y-8">
                {/* Payment Container - Commented out as requested */}
                {/* <Card className="border-2 border-[#FF5500]">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-[#FF6B00]">Application Fee Payment</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      A non-refundable application fee is required to proceed with your postgraduate application.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="mb-4 sm:mb-0">
                          <h4 className="text-base sm:text-lg font-semibold">Application Fee</h4>
                          <p className="text-sm text-gray-600">Required for all postgraduate applications</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xl sm:text-2xl font-bold text-[#FF6B00]">
                            {nationality === "nigerian" ? "₦10,000" : "$50"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {nationality === "nigerian" ? "Nigerian Applicants" : "International Applicants"}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-yellow-800">Important Notice</h4>
                            <p className="text-sm text-yellow-700">
                              This fee is non-refundable. Please ensure you have selected the correct nationality before proceeding with payment.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Label className="text-base">Select your nationality:</Label>
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroup
                              value={nationality}
                              onValueChange={handleNationalityChange}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="nigerian" id="nigerian" />
                                <Label htmlFor="nigerian" className="text-base">Nigerian</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="foreign" id="foreign" />
                                <Label htmlFor="foreign" className="text-base">International</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={handleFlutterwavePayment}
                        size="lg"
                        className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white px-8 py-2 text-base sm:text-lg"
                      >
                        Pay Application Fee
                      </Button>
                    </div>
                  </CardContent>
                </Card> */}

                {/* New Payment Information Card */}
                <Card className="border-2 border-[#FF5500]">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-[#FF6B00]">Application Fee Payment</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Please make your payment to the bank account below and upload your payment receipt.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="mb-4 sm:mb-0">
                          <h4 className="text-base sm:text-lg font-semibold">Application Fee</h4>
                          <p className="text-sm text-gray-600">Required for all postgraduate applications</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xl sm:text-2xl font-bold text-[#FF6B00]">
                            {nationality === "nigerian" ? "₦10,000" : "$50"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {nationality === "nigerian" ? "Nigerian Applicants" : "International Applicants"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-start">
                          <CreditCard className="h-5 w-5 text-blue-600 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-blue-800">Bank Account Details</h4>
                            <div className="mt-2 space-y-1 text-sm text-blue-700">
                              <div className="flex items-center justify-between">
                                <p><span className="font-medium">Bank Name:</span> UBA</p>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-blue-600 hover:text-blue-800"
                                  onClick={() => {
                                    navigator.clipboard.writeText("UBA");
                                    toast({
                                      title: "Copied!",
                                      description: "Bank name copied to clipboard",
                                      className: "bg-green-50 text-green-800",
                                    });
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between">
                                <p><span className="font-medium">Account Name:</span> African University of Science and Technology</p>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-blue-600 hover:text-blue-800"
                                  onClick={() => {
                                    navigator.clipboard.writeText("African University of Science and Technology");
                                    toast({
                                      title: "Copied!",
                                      description: "Account name copied to clipboard",
                                      className: "bg-green-50 text-green-800",
                                    });
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between">
                                <p><span className="font-medium">Account Number:</span> 0123456789</p>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-blue-600 hover:text-blue-800"
                                  onClick={() => {
                                    navigator.clipboard.writeText("0123456789");
                                    toast({
                                      title: "Copied!",
                                      description: "Account number copied to clipboard",
                                      className: "bg-green-50 text-green-800",
                                    });
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between">
                                <p><span className="font-medium">Swift Code:</span> UNAFNGLAXXX</p>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-blue-600 hover:text-blue-800"
                                  onClick={() => {
                                    navigator.clipboard.writeText("UNAFNGLAXXX");
                                    toast({
                                      title: "Copied!",
                                      description: "Swift code copied to clipboard",
                                      className: "bg-green-50 text-green-800",
                                    });
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-yellow-800">Important Notice</h4>
                            <p className="text-sm text-yellow-700">
                              This fee is non-refundable. Please ensure you have selected the correct nationality before proceeding with payment.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Label className="text-base">Select your nationality:</Label>
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroup
                              value={nationality}
                              onValueChange={handleNationalityChange}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="nigerian" id="nigerian" />
                                <Label htmlFor="nigerian" className="text-base">Nigerian</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="foreign" id="foreign" />
                                <Label htmlFor="foreign" className="text-base">International</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="payment-receipt" className="text-base">Upload Payment Receipt</Label>
                        <div className="flex items-center space-x-4">
                          <Input
                            id="payment-receipt"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload("postgraduate", "fee", file);
                              }
                            }}
                          />
                          {documents.postgraduate.find(doc => doc.id === "fee")?.file && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleClearFile("postgraduate", "fee")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Supported formats: PDF, JPG, PNG. Max 5MB.</p>
                        {documents.postgraduate.find(doc => doc.id === "fee")?.file && (
                          <p className="text-sm text-green-600 flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" /> 
                            {documents.postgraduate.find(doc => doc.id === "fee")?.file?.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Program Selection */}
                <Card className="shadow-sm border border-gray-200">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-xl text-gray-800">Program Selection</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="academicSession">Academic Session</Label>
                          <Input
                            id="academicSession"
                            value={`${getCurrentAcademicSession()} Academic Session`}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="programType">Program Type</Label>
                          <Select
                            value={postgraduateData.programType}
                            onValueChange={handleProgramTypeChange}
                            disabled={!isPaymentMade}
                          >
                            <SelectTrigger id="programType" className="w-full">
                              <SelectValue placeholder="Select program type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pgd">Postgraduate Diploma</SelectItem>
                              <SelectItem value="taught">Taught Masters</SelectItem>
                              <SelectItem value="msc">MSc</SelectItem>
                              <SelectItem value="phd">PhD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="program">Select Program</Label>
                          <Select
                            value={postgraduateData.program}
                            onValueChange={(value) => handlePostgraduateChange("program", value)}
                            disabled={!isPaymentMade || !postgraduateData.programType}
                          >
                            <SelectTrigger id="program" className="w-full">
                              <SelectValue placeholder="Select program" />
                            </SelectTrigger>
                            <SelectContent>
                              {postgraduateData.programType && 
                                postgraduateProgramOptions[postgraduateData.programType as keyof typeof postgraduateProgramOptions]?.map((program) => (
                                  <SelectItem key={program.value} value={program.value}>
                                    {program.label}
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Details */}
                <Card className="shadow-sm border border-gray-200">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-xl text-gray-800">A. Personal Details</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="passport">Passport Photograph</Label>
                        <div className="flex items-center space-x-4">
                          <Input
                            id="passport"
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            disabled={!isPaymentMade}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload("postgraduate", "passport", file);
                              }
                            }}
                          />
                          <Label
                            htmlFor="passport"
                            className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300"
                          >
                            Upload Photo
                          </Label>
                          {documents.postgraduate.find(doc => doc.id === "passport")?.file && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleClearFile("postgraduate", "passport")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Supported formats: PDF or image. Max 100 MB.</p>
                        {documents.postgraduate.find(doc => doc.id === "passport")?.file && (
                          <p className="text-sm text-green-600 flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" /> 
                            {documents.postgraduate.find(doc => doc.id === "passport")?.file?.name}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="surname">Surname *</Label>
                          <Input
                            id="surname"
                            placeholder="Enter your surname"
                            value={postgraduateData.personalDetails.surname}
                            onChange={(e) => handlePersonalDetailsChange("surname", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            placeholder="Enter your first name"
                            value={postgraduateData.personalDetails.firstName}
                            onChange={(e) => handlePersonalDetailsChange("firstName", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="otherNames">Other Names</Label>
                          <Input
                            id="otherNames"
                            placeholder="Enter your other names"
                            value={postgraduateData.personalDetails.otherNames}
                            onChange={(e) => handlePersonalDetailsChange("otherNames", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Gender *</Label>
                          <RadioGroup
                            value={postgraduateData.personalDetails.gender}
                            onValueChange={(value) => handlePersonalDetailsChange("gender", value)}
                            disabled={!isPaymentMade}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male">Male</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female">Female</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={postgraduateData.personalDetails.dateOfBirth}
                            onChange={(e) => handlePersonalDetailsChange("dateOfBirth", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nationality">Nationality *</Label>
                          <Select
                            value={postgraduateData.personalDetails.nationality}
                            onValueChange={(value) => handlePersonalDetailsChange("nationality", value)}
                            disabled={!isFieldEnabled("nationality") || nationality === "nigerian"}
                          >
                            <SelectTrigger id="nationality" className="w-full">
                              <SelectValue placeholder="Select your nationality" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country.toLowerCase().replace(/\s+/g, '_')}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {nationality === "nigerian" && (
                          <div className="space-y-2">
                            <Label htmlFor="stateOfOrigin">State of Origin</Label>
                            <Input
                              id="stateOfOrigin"
                              placeholder="Enter your state of origin"
                              value={postgraduateData.personalDetails.stateOfOrigin}
                              onChange={(e) => handlePersonalDetailsChange("stateOfOrigin", e.target.value)}
                              disabled={!isFieldEnabled("stateOfOrigin")}
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telephone / Mobile Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            pattern="[0-9]*"
                            placeholder="Enter your phone number"
                            value={postgraduateData.personalDetails.phoneNumber}
                            onChange={(e) => handlePersonalDetailsChange("phoneNumber", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={postgraduateData.personalDetails.email}
                            onChange={(e) => handlePersonalDetailsChange("email", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Street Address *</Label>
                          <Input
                            id="address"
                            placeholder="Enter your street address"
                            value={postgraduateData.personalDetails.streetAddress}
                            onChange={(e) => handlePersonalDetailsChange("streetAddress", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            placeholder="Enter your city"
                            value={postgraduateData.personalDetails.city}
                            onChange={(e) => handlePersonalDetailsChange("city", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country *</Label>
                          <Select
                            value={postgraduateData.personalDetails.country}
                            onValueChange={(value) => handlePersonalDetailsChange("country", value)}
                            disabled={!isPaymentMade}
                          >
                            <SelectTrigger id="country" className="w-full">
                              <SelectValue placeholder="Select your country" />
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
                          <Label>Do you have any disabilities/special needs? *</Label>
                          <RadioGroup
                            value={postgraduateData.personalDetails.hasDisabilities}
                            onValueChange={(value) => handlePersonalDetailsChange("hasDisabilities", value)}
                            disabled={!isPaymentMade}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="disability_yes" />
                              <Label htmlFor="disability_yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="disability_no" />
                              <Label htmlFor="disability_no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        {postgraduateData.personalDetails.hasDisabilities === "yes" && (
                          <div className="space-y-2">
                            <Label htmlFor="disabilityDescription">Disability Description</Label>
                            <Textarea
                              id="disabilityDescription"
                              placeholder="Please describe your disability/special needs"
                              value={postgraduateData.personalDetails.disabilityDescription}
                              onChange={(e) => handlePersonalDetailsChange("disabilityDescription", e.target.value)}
                              disabled={!isPaymentMade}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Academic Qualifications */}
                <Card className="shadow-sm border border-gray-200">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-xl text-gray-800">B. Academic Qualifications</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          Please list all academic qualifications in chronological order. Evidence of qualifications you have completed must be submitted with this application form. A student copy of your academic transcripts and a copy of the certificate/diploma for degrees received (with notarized English translations where applicable) MUST be sent with this application form.
                        </p>
                      </div>
                      
                      {/* First Qualification */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Academic Qualification 1 *</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="qualification1">Qualification Type *</Label>
                            <Select 
                              value={postgraduateData.academicQualifications.qualification1.type}
                              onValueChange={(value) => handleAcademicQualificationChange('qualification1', 'type', value)}
                              disabled={!isPaymentMade}
                            >
                              <SelectTrigger id="qualification1" className="w-full">
                                <SelectValue placeholder="Select qualification" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bsc">BSc</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="grade1">Grade *</Label>
                            <Select 
                              value={postgraduateData.academicQualifications.qualification1.grade}
                              onValueChange={(value) => handleAcademicQualificationChange('qualification1', 'grade', value)}
                              disabled={!isPaymentMade}
                            >
                              <SelectTrigger id="grade1" className="w-full">
                                <SelectValue placeholder="Select grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="first">First Class</SelectItem>
                                <SelectItem value="second_upper">Second Class Upper</SelectItem>
                                <SelectItem value="second_lower">Second Class Lower</SelectItem>
                                <SelectItem value="third">Third Class</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cgpa1">CGPA (or its equivalent) *</Label>
                            <Input
                              id="cgpa1"
                              type="number"
                              step="0.01"
                              placeholder="Enter CGPA"
                              value={postgraduateData.academicQualifications.qualification1.cgpa}
                              onChange={(e) => handleAcademicQualificationChange('qualification1', 'cgpa', e.target.value)}
                              disabled={!isPaymentMade}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject1">Subject *</Label>
                            <Input
                              id="subject1"
                              placeholder="Enter subject"
                              value={postgraduateData.academicQualifications.qualification1.subject}
                              onChange={(e) => handleAcademicQualificationChange('qualification1', 'subject', e.target.value)}
                              disabled={!isPaymentMade}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="institution1">Institution *</Label>
                            <Input
                              id="institution1"
                              placeholder="Enter institution"
                              value={postgraduateData.academicQualifications.qualification1.institution}
                              onChange={(e) => handleAcademicQualificationChange('qualification1', 'institution', e.target.value)}
                              disabled={!isPaymentMade}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="startDate1">Start Date *</Label>
                            <Input
                              id="startDate1"
                              type="date"
                              value={postgraduateData.academicQualifications.qualification1.startDate}
                              onChange={(e) => handleAcademicQualificationChange('qualification1', 'startDate', e.target.value)}
                              disabled={!isPaymentMade}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endDate1">End Date *</Label>
                            <Input
                              id="endDate1"
                              type="date"
                              value={postgraduateData.academicQualifications.qualification1.endDate}
                              onChange={(e) => handleAcademicQualificationChange('qualification1', 'endDate', e.target.value)}
                              disabled={!isPaymentMade}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="transcript1">Attach Academic Transcripts and Certificate *</Label>
                          <div className="flex items-center space-x-4">
                            <Input
                              id="transcript1"
                              type="file"
                              accept=".pdf,image/*"
                              multiple
                              className="hidden"
                              disabled={!isPaymentMade}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload("postgraduate", "transcript", file);
                                }
                              }}
                            />
                            <Label
                              htmlFor="transcript1"
                              className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300"
                            >
                              Upload Files
                            </Label>
                            {documents.postgraduate.find(doc => doc.id === "transcript")?.file && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleClearFile("postgraduate", "transcript")}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">Supported formats: PDF or image. Max 5MB.</p>
                          {documents.postgraduate.find(doc => doc.id === "transcript")?.file && (
                            <p className="text-sm text-green-600 flex items-center">
                              <CheckCircle2 className="h-4 w-4 mr-1" /> 
                              {documents.postgraduate.find(doc => doc.id === "transcript")?.file?.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Second Qualification (for PhD only) */}
                      {postgraduateData.programType === "phd" && (
                        <div className="space-y-4">
                          <h3 className="font-semibold">Academic Qualification 2</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="qualification2">Qualification Type</Label>
                              <Select disabled={!isPaymentMade}>
                                <SelectTrigger id="qualification2" className="w-full">
                                  <SelectValue placeholder="Select qualification" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="msc">MSc</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cgpa2">CGPA (or its equivalent)</Label>
                              <Input
                                id="cgpa2"
                                type="number"
                                step="0.01"
                                placeholder="Enter CGPA"
                                disabled={!isPaymentMade}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subject2">Subject</Label>
                              <Input
                                id="subject2"
                                placeholder="Enter subject"
                                disabled={!isPaymentMade}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="institution2">Awarding Institution/University</Label>
                              <Input
                                id="institution2"
                                placeholder="Enter institution name"
                                disabled={!isPaymentMade}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="startDate2">Start Date (Month/Year)</Label>
                              <div className="flex gap-2">
                                <Select
                                  onValueChange={(value) => {
                                    const [month, year] = postgraduateData.academicQualifications.qualification2?.startDate?.split('/') || ['', ''];
                                    setPostgraduateData({
                                      ...postgraduateData,
                                      academicQualifications: {
                                        ...postgraduateData.academicQualifications,
                                        qualification2: {
                                          ...postgraduateData.academicQualifications.qualification2,
                                          startDate: `${value}/${year || ''}`
                                        }
                                      }
                                    });
                                  }}
                                  value={postgraduateData.academicQualifications.qualification2?.startDate?.split('/')[0] || ''}
                                  disabled={!isPaymentMade}
                                >
                                  <SelectTrigger className="w-[140px]">
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
                                  onValueChange={(value) => {
                                    const [month] = postgraduateData.academicQualifications.qualification2?.startDate?.split('/') || ['', ''];
                                    setPostgraduateData({
                                      ...postgraduateData,
                                      academicQualifications: {
                                        ...postgraduateData.academicQualifications,
                                        qualification2: {
                                          ...postgraduateData.academicQualifications.qualification2,
                                          startDate: `${month || ''}/${value}`
                                        }
                                      }
                                    });
                                  }}
                                  value={postgraduateData.academicQualifications.qualification2?.startDate?.split('/')[1] || ''}
                                  disabled={!isPaymentMade}
                                >
                                  <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Year" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {years.map((year) => (
                                      <SelectItem key={year} value={year}>
                                        {year}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="endDate2">End Date (Month/Year)</Label>
                              <div className="flex gap-2">
                                <Select
                                  onValueChange={(value) => {
                                    const [month, year] = postgraduateData.academicQualifications.qualification2?.endDate?.split('/') || ['', ''];
                                    setPostgraduateData({
                                      ...postgraduateData,
                                      academicQualifications: {
                                        ...postgraduateData.academicQualifications,
                                        qualification2: {
                                          ...postgraduateData.academicQualifications.qualification2,
                                          endDate: `${value}/${year || ''}`
                                        }
                                      }
                                    });
                                  }}
                                  value={postgraduateData.academicQualifications.qualification2?.endDate?.split('/')[0] || ''}
                                  disabled={!isPaymentMade}
                                >
                                  <SelectTrigger className="w-[140px]">
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
                                  onValueChange={(value) => {
                                    const [month] = postgraduateData.academicQualifications.qualification2?.endDate?.split('/') || ['', ''];
                                    setPostgraduateData({
                                      ...postgraduateData,
                                      academicQualifications: {
                                        ...postgraduateData.academicQualifications,
                                        qualification2: {
                                          ...postgraduateData.academicQualifications.qualification2,
                                          endDate: `${month || ''}/${value}`
                                        }
                                      }
                                    });
                                  }}
                                  value={postgraduateData.academicQualifications.qualification2?.endDate?.split('/')[1] || ''}
                                  disabled={!isPaymentMade}
                                >
                                  <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Year" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {years.map((year) => (
                                      <SelectItem key={year} value={year}>
                                        {year}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="transcript2">Attach Academic Transcripts and Certificate</Label>
                            <div className="flex items-center space-x-4">
                              <Input
                                id="transcript2"
                                type="file"
                                accept=".pdf,image/*"
                                multiple
                                className="hidden"
                                disabled={!isPaymentMade}
                              />
                              <Label
                                htmlFor="transcript2"
                                className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300"
                              >
                                Upload Files
                              </Label>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Other Qualifications */}
                      <div className="space-y-2">
                        <Label htmlFor="other">Other Academic Qualifications</Label>
                        <div className="flex items-center space-x-4">
                          <Input
                            id="other"
                            type="file"
                            accept=".pdf,.doc,.docx,image/*"
                            className="hidden"
                            disabled={!isPaymentMade}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload("postgraduate", "other", file);
                              }
                            }}
                          />
                          <Label
                            htmlFor="other"
                            className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300"
                          >
                            Upload File
                          </Label>
                          {documents.postgraduate.find(doc => doc.id === "other")?.file && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleClearFile("postgraduate", "other")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX, or image. Max 5MB.</p>
                        {documents.postgraduate.find(doc => doc.id === "other")?.file && (
                          <p className="text-sm text-green-600 flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" /> 
                            {documents.postgraduate.find(doc => doc.id === "other")?.file?.name}
                          </p>
                        )}
                      </div>

                      {/* Degree Certificate */}
                      <div className="space-y-2">
                        <Label htmlFor="degree">Degree Certificate</Label>
                        <div className="flex items-center space-x-4">
                          <Input
                            id="degree"
                            type="file"
                            accept=".pdf,image/*"
                            className="hidden"
                            disabled={!isPaymentMade}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload("postgraduate", "degree", file);
                              }
                            }}
                          />
                          <Label
                            htmlFor="degree"
                            className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300"
                          >
                            Upload Certificate
                          </Label>
                          {documents.postgraduate.find(doc => doc.id === "degree")?.file && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleClearFile("postgraduate", "degree")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Supported formats: PDF or image. Max 5MB.</p>
                        {documents.postgraduate.find(doc => doc.id === "degree")?.file && (
                          <p className="text-sm text-green-600 flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" /> 
                            {documents.postgraduate.find(doc => doc.id === "degree")?.file?.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statement of Purpose */}
                <Card className="shadow-sm border border-gray-200">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-xl text-gray-800">C. Statement of Purpose</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          As an applicant, please provide a one page summary of your reason for selecting the course for which you are applying. You should include your interest and experience in this subject area, a brief research proposal (compulsory for all Ph.D. applicants), your reason for choosing the particular course, and how the course of study connects to your future plan.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="statement">Statement of Purpose</Label>
                        <div className="flex items-center space-x-4">
                          <Input
                            id="statement"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            disabled={!isPaymentMade}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload("postgraduate", "statement", file);
                              }
                            }}
                          />
                          <Label
                            htmlFor="statement"
                            className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300"
                          >
                            Upload Statement
                          </Label>
                          {documents.postgraduate.find(doc => doc.id === "statement")?.file && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleClearFile("postgraduate", "statement")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX. Max 5MB.</p>
                        {documents.postgraduate.find(doc => doc.id === "statement")?.file && (
                          <p className="text-sm text-green-600 flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" /> 
                            {documents.postgraduate.find(doc => doc.id === "statement")?.file?.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* References */}
                <Card className="shadow-sm border border-gray-200">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-xl text-gray-800">E. Academic References</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          It is your responsibility to provide two referees to support your application.
Your referees must be able to comment on your academic suitability for the program.
A secure reference link will be sent directly to each referee for them to complete.
Please ensure that the referee's email address is an official institutional or company email (e.g., .edu, .org, or company domain). Personal email addresses like Gmail or Yahoo will not be accepted.
<br/>
<br/><b>
🔗 Only referees with valid professional email addresses will receive the reference request form.</b>
                        </p>
                      </div>

                      {/* First Referee */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">First Referee *</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="referee1Name">Full Name *</Label>
                            <Input
                              id="referee1Name"
                              placeholder="Enter referee's full name"
                              value={postgraduateData.references.referee1.name}
                              onChange={(e) => {
                                setPostgraduateData(prev => ({
                                  ...prev,
                                  references: {
                                    ...prev.references,
                                    referee1: {
                                      ...prev.references.referee1,
                                      name: e.target.value
                                    }
                                  }
                                }));
                              }}
                              disabled={!isPaymentMade}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="referee1Email">Email Address *</Label>
                            <Input
                              id="referee1Email"
                              type="email"
                              placeholder="Enter referee's email address"
                              value={postgraduateData.references.referee1.email}
                              onChange={(e) => {
                                setPostgraduateData(prev => ({
                                  ...prev,
                                  references: {
                                    ...prev.references,
                                    referee1: {
                                      ...prev.references.referee1,
                                      email: e.target.value
                                    }
                                  }
                                }));
                              }}
                              disabled={!isPaymentMade}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Second Referee */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Second Referee *</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="referee2Name">Full Name *</Label>
                            <Input
                              id="referee2Name"
                              placeholder="Enter referee's full name"
                              value={postgraduateData.references.referee2.name}
                              onChange={(e) => {
                                setPostgraduateData(prev => ({
                                  ...prev,
                                  references: {
                                    ...prev.references,
                                    referee2: {
                                      ...prev.references.referee2,
                                      name: e.target.value
                                    }
                                  }
                                }));
                              }}
                              disabled={!isPaymentMade}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="referee2Email">Email Address *</Label>
                            <Input
                              id="referee2Email"
                              type="email"
                              placeholder="Enter referee's email address"
                              value={postgraduateData.references.referee2.email}
                              onChange={(e) => {
                                setPostgraduateData(prev => ({
                                  ...prev,
                                  references: {
                                    ...prev.references,
                                    referee2: {
                                      ...prev.references.referee2,
                                      email: e.target.value
                                    }
                                  }
                                }));
                              }}
                              disabled={!isPaymentMade}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Declaration */}
                <Card className="shadow-sm border border-gray-200">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-xl text-gray-800">Declaration</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          I declare that the information provided in this application is true and complete to the best of my knowledge. I understand that any false or misleading information may result in the rejection of my application or termination of my admission.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="declaration">Full Name (in lieu of signature) *</Label>
                        <Input
                          id="declaration"
                          placeholder="Enter your full name"
                          value={postgraduateData.declaration}
                          onChange={(e) => handlePostgraduateChange("declaration", e.target.value)}
                          disabled={!isPaymentMade}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  {/* <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="border-gray-300"
                  >
                    Save Draft
                  </Button> */}
                  <Button
                    onClick={handleSubmit}
                    className="bg-[#FF5500] hover:bg-[#e64d00]"
                  >
                    Submit Application
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* JAMB Notice Card for Undergraduate */}
                {programType === "undergraduate" && (
                  <Card className="shadow-sm border-2 border-[#FF5500]">
                    <CardHeader className="bg-[#FFF5EE] border-b">
                      <CardTitle className="text-xl text-[#FF5500] flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Important JAMB Admission Notice
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Please note:</strong> The African University of Science and Technology (AUST) requires all undergraduate applicants to first obtain admission through the Joint Admissions and Matriculation Board (JAMB) before completing this document upload form.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-800">JAMB Admission Process:</h3>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                            <li>Register for JAMB UTME/DE examination</li>
                            <li>Select AUST as your first choice institution</li>
                            <li>Take the JAMB examination</li>
                            <li>Meet the minimum cutoff mark (140 for 2024/2025)</li>
                            <li>Receive admission from JAMB</li>
                            <li>Then complete this document upload form</li>
                          </ol>
                        </div>
                        
                        <div className="flex justify-center pt-2">
                          <Button 
                            className="bg-[#FF5500] hover:bg-[#FF5500]/90 text-white"
                            onClick={() => window.open('https://jamb.gov.ng/efacility', '_blank')}
                          >
                            Go to JAMB Portal
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {programType === "jupeb" && (
                  <Card className="border-2 border-[#FF5500]">
                    <CardHeader>
                      <CardTitle className="text-xl sm:text-2xl font-bold text-[#FF6B00]">Application Fee Payment</CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Please make your payment to the bank account below and upload your payment receipt.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="mb-4 sm:mb-0">
                            <h4 className="text-base sm:text-lg font-semibold">Application Fee</h4>
                            <p className="text-sm text-gray-600">Required for all JUPEB applications</p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-xl sm:text-2xl font-bold text-[#FF6B00]">₦10,000</p>
                            <p className="text-sm text-gray-600">Nigerian Applicants</p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-start">
                            <CreditCard className="h-5 w-5 text-blue-600 mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-blue-800">Bank Account Details</h4>
                              <div className="mt-2 space-y-1 text-sm text-blue-700">
                                <div className="flex items-center justify-between">
                                  <p><span className="font-medium">Bank Name:</span> UBA</p>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 text-blue-600 hover:text-blue-800"
                                    onClick={() => {
                                      navigator.clipboard.writeText("UBA");
                                      toast({
                                        title: "Copied!",
                                        description: "Bank name copied to clipboard",
                                        className: "bg-green-50 text-green-800",
                                      });
                                    }}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p><span className="font-medium">Account Name:</span> African University of Science and Technology</p>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 text-blue-600 hover:text-blue-800"
                                    onClick={() => {
                                      navigator.clipboard.writeText("African University of Science and Technology");
                                      toast({
                                        title: "Copied!",
                                        description: "Account name copied to clipboard",
                                        className: "bg-green-50 text-green-800",
                                      });
                                    }}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p><span className="font-medium">Account Number:</span> 0123456789</p>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 text-blue-600 hover:text-blue-800"
                                    onClick={() => {
                                      navigator.clipboard.writeText("0123456789");
                                      toast({
                                        title: "Copied!",
                                        description: "Account number copied to clipboard",
                                        className: "bg-green-50 text-green-800",
                                      });
                                    }}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p><span className="font-medium">Swift Code:</span> UNAFNGLAXXX</p>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 text-blue-600 hover:text-blue-800"
                                    onClick={() => {
                                      navigator.clipboard.writeText("UNAFNGLAXXX");
                                      toast({
                                        title: "Copied!",
                                        description: "Swift code copied to clipboard",
                                        className: "bg-green-50 text-green-800",
                                      });
                                    }}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-yellow-800">Important Notice</h4>
                              <p className="text-sm text-yellow-700">
                                This fee is non-refundable.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="payment-receipt" className="text-base">Upload Payment Receipt</Label>
                        <div className="flex items-center space-x-4">
                          <Input
                            id="payment-receipt"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload("jupeb", "payment", file);
                              }
                            }}
                          />
                          {documents.jupeb.find(doc => doc.id === "payment")?.file && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleClearFile("jupeb", "payment")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Supported formats: PDF, JPG, PNG. Max 5MB.</p>
                        {documents.jupeb.find(doc => doc.id === "payment")?.file && (
                          <p className="text-sm text-green-600 flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" /> 
                            {documents.jupeb.find(doc => doc.id === "payment")?.file?.name}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Personal Information Card for Undergraduate and JUPEB */}
                <Card className="shadow-sm border border-gray-200">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-xl text-gray-800">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="surname">Surname *</Label>
                          <Input
                            id="surname"
                            placeholder="Enter your surname"
                            value={postgraduateData.personalDetails.surname}
                            onChange={(e) => handlePersonalDetailsChange("surname", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            placeholder="Enter your first name"
                            value={postgraduateData.personalDetails.firstName}
                            onChange={(e) => handlePersonalDetailsChange("firstName", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="otherNames">Other Names</Label>
                          <Input
                            id="otherNames"
                            placeholder="Enter your other names"
                            value={postgraduateData.personalDetails.otherNames}
                            onChange={(e) => handlePersonalDetailsChange("otherNames", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Gender *</Label>
                          <RadioGroup
                            value={postgraduateData.personalDetails.gender}
                            onValueChange={(value) => handlePersonalDetailsChange("gender", value)}
                            disabled={!isPaymentMade}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male">Male</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female">Female</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={postgraduateData.personalDetails.dateOfBirth}
                            onChange={(e) => handlePersonalDetailsChange("dateOfBirth", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nationality">Nationality *</Label>
                          <Select
                            value={postgraduateData.personalDetails.nationality}
                            onValueChange={(value) => handlePersonalDetailsChange("nationality", value)}
                            disabled={!isFieldEnabled("nationality") || nationality === "nigerian"}
                          >
                            <SelectTrigger id="nationality" className="w-full">
                              <SelectValue placeholder="Select your nationality" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country.toLowerCase().replace(/\s+/g, '_')}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {nationality === "nigerian" && (
                          <div className="space-y-2">
                            <Label htmlFor="stateOfOrigin">State of Origin</Label>
                            <Input
                              id="stateOfOrigin"
                              placeholder="Enter your state of origin"
                              value={postgraduateData.personalDetails.stateOfOrigin}
                              onChange={(e) => handlePersonalDetailsChange("stateOfOrigin", e.target.value)}
                              disabled={!isFieldEnabled("stateOfOrigin")}
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telephone / Mobile Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            pattern="[0-9]*"
                            placeholder="Enter your phone number"
                            value={postgraduateData.personalDetails.phoneNumber}
                            onChange={(e) => handlePersonalDetailsChange("phoneNumber", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={postgraduateData.personalDetails.email}
                            onChange={(e) => handlePersonalDetailsChange("email", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Street Address *</Label>
                          <Input
                            id="address"
                            placeholder="Enter your street address"
                            value={postgraduateData.personalDetails.streetAddress}
                            onChange={(e) => handlePersonalDetailsChange("streetAddress", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            placeholder="Enter your city"
                            value={postgraduateData.personalDetails.city}
                            onChange={(e) => handlePersonalDetailsChange("city", e.target.value)}
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country *</Label>
                          <Select
                            value={postgraduateData.personalDetails.country}
                            onValueChange={(value) => handlePersonalDetailsChange("country", value)}
                            disabled={!isPaymentMade}
                          >
                            <SelectTrigger id="country" className="w-full">
                              <SelectValue placeholder="Select your country" />
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
                          <Label>Do you have any disabilities/special needs? *</Label>
                          <RadioGroup
                            value={postgraduateData.personalDetails.hasDisabilities}
                            onValueChange={(value) => handlePersonalDetailsChange("hasDisabilities", value)}
                            disabled={!isPaymentMade}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="disability_yes" />
                              <Label htmlFor="disability_yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="disability_no" />
                              <Label htmlFor="disability_no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        {postgraduateData.personalDetails.hasDisabilities === "yes" && (
                          <div className="space-y-2">
                            <Label htmlFor="disabilityDescription">Disability Description</Label>
                            <Textarea
                              id="disabilityDescription"
                              placeholder="Please describe your disability/special needs"
                              value={postgraduateData.personalDetails.disabilityDescription}
                              onChange={(e) => handlePersonalDetailsChange("disabilityDescription", e.target.value)}
                              disabled={!isPaymentMade}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Document Upload Section */}
                {documents[programType].map((field) => (
                  <Card key={field.id} className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{field.label}</span>
                        {field.required && (
                          <span className="text-red-500 text-sm">Required</span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        {field.file ? (
                          <>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600">{field.file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(field.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleClearFile(programType, field.id)}
                              className="text-red-500 hover:text-red-700"
                              disabled={!isFieldEnabled(field.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <div className="flex-1">
                            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${!isFieldEnabled(field.id) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="h-8 w-8 mb-2 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PDF, JPG, or PNG (MAX. 5MB)</p>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                disabled={!isFieldEnabled(field.id)}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file && file.size <= 5 * 1024 * 1024) {
                                    handleFileUpload(programType, field.id, file);
                                  } else {
                                    toast({
                                      title: "File Too Large",
                                      description: "Please upload a file smaller than 5MB",
                                      variant: "destructive",
                                      className: "bg-red-50 text-red-800",
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Additional Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add any additional information or comments..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-4">
                  {/* <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="border-gray-300"
                  >
                    Save Draft
                  </Button> */}
                  <Button
                    onClick={handleSubmit}
                    className="bg-[#FF5500] hover:bg-[#e64d00]"
                  >
                    Submit Application
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Toaster />

      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#FF5500] flex items-center gap-2">
              <Info className="h-6 w-6" />
              {modalContent.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Please read the following information carefully before proceeding with your application.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4 text-gray-700">
            {modalContent.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentUpload; 