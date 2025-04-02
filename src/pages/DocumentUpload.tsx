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
import { Upload, X, CheckCircle2, AlertCircle, Info, AlertTriangle, CreditCard } from "lucide-react";
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
  declaration: boolean;
}

// Add Flutterwave types
declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

const DocumentUpload = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("undergraduate");
  const [notes, setNotes] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    content: "",
  });
  const [postgraduateData, setPostgraduateData] = useState<PostgraduateFormData>({
    academicSession: "2024/2025",
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
    declaration: false,
  });
  const [isPaymentMade, setIsPaymentMade] = useState(false);
  const [nationality, setNationality] = useState<"nigerian" | "foreign">("nigerian");

  const [documents, setDocuments] = useState<Record<string, DocumentField[]>>({
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
      { id: "medical", label: "Medical Certificate", required: true, file: null },
    ],
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

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

  const handleFileUpload = (programType: string, fieldId: string, file: File) => {
    setDocuments((prev) => ({
      ...prev,
      [programType]: prev[programType].map((doc) =>
        doc.id === fieldId ? { ...doc, file } : doc
      ),
    }));
  };

  const handleClearFile = (programType: string, fieldId: string) => {
    setDocuments((prev) => ({
      ...prev,
      [programType]: prev[programType].map((doc) =>
        doc.id === fieldId ? { ...doc, file: null } : doc
      ),
    }));
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

  const handleSubmit = () => {
    if (activeTab === "postgraduate") {
      // Validate postgraduate form
      if (!postgraduateData.declaration) {
        toast({
          title: "Declaration Required",
          description: "Please accept the declaration to proceed.",
          variant: "destructive",
          className: "bg-red-50 text-red-800",
        });
        return;
      }
    }

    // Check if all required fields are filled
    const requiredFields = documents[activeTab].filter((doc) => doc.required);
    const missingFields = requiredFields.filter((doc) => !doc.file);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Documents",
        description: `Please upload all required documents: ${missingFields.map((doc) => doc.label).join(", ")}`,
        variant: "destructive",
        className: "bg-red-50 text-red-800",
      });
      return;
    }

    // Simulate submission
    toast({
      title: "Application Submitted",
      description: "Your application has been submitted successfully!",
      className: "bg-green-50 text-green-800",
    });
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

  return (
    <div className="min-h-screen bg-[hsl(var(--accent)/0.02)]">
      <PortalNav />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="undergraduate">Undergraduate</TabsTrigger>
              <TabsTrigger value="postgraduate">Postgraduate</TabsTrigger>
              <TabsTrigger value="jupeb">JUPEB</TabsTrigger>
            </TabsList>

            {activeTab === "postgraduate" ? (
              <TabsContent value="postgraduate">
                <div className="space-y-8">
                  {/* Payment Container */}
                  {activeTab === "postgraduate" && !isPaymentMade && (
                    <Card className="border-2 border-[#FF5500]">
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
                                  onValueChange={(value: "nigerian" | "foreign") => setNationality(value)}
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
                    </Card>
                  )}

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
                              value="2024/2025 Academic Session"
                              disabled
                              className="bg-gray-50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="programType">Program Type</Label>
                            <Select
                              value={postgraduateData.programType}
                              onValueChange={(value) => handlePostgraduateChange("programType", value)}
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
                              disabled={!isPaymentMade}
                            >
                              <SelectTrigger id="program" className="w-full">
                                <SelectValue placeholder="Select program" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="applied_stats">Applied Statistics (MSc only)</SelectItem>
                                <SelectItem value="aerospace">Aerospace Engineering (MSc/PhD)</SelectItem>
                                <SelectItem value="cs">Computer Science (MSc/PhD)</SelectItem>
                                <SelectItem value="geoinformatics">Geoinformatics and GIS (MSc/PhD)</SelectItem>
                                <SelectItem value="energy">Energy Resources Engineering (MSc only)</SelectItem>
                                <SelectItem value="mit_taught">Management of Information Technology (Taught Masters)</SelectItem>
                                <SelectItem value="mit_msc">Management of Information Technology (MSc only)</SelectItem>
                                <SelectItem value="materials">Materials Science & Engineering (MSc/PhD)</SelectItem>
                                <SelectItem value="math_modeling">Mathematical Modeling (MSc only)</SelectItem>
                                <SelectItem value="petroleum">Petroleum Engineering (Postgraduate Diploma/MSc/PhD)</SelectItem>
                                <SelectItem value="public_admin">Public Administration (MSc only)</SelectItem>
                                <SelectItem value="public_policy">Public Policy (MSc only)</SelectItem>
                                <SelectItem value="pure_math">Pure and Applied Mathematics (MSc/PhD)</SelectItem>
                                <SelectItem value="space_physics">Space Physics (MSc/PhD)</SelectItem>
                                <SelectItem value="systems">Systems Engineering (MSc/PhD)</SelectItem>
                                <SelectItem value="physics">Theoretical and Applied Physics (MSc/PhD)</SelectItem>
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
                            />
                            <Label
                              htmlFor="passport"
                              className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300"
                            >
                              Upload Photo
                            </Label>
                          </div>
                          <p className="text-sm text-gray-500">Supported formats: PDF or image. Max 100 MB.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="surname">Surname *</Label>
                            <Input
                              id="surname"
                              placeholder="Enter your surname"
                              disabled={!isPaymentMade}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              placeholder="Enter your first name"
                              disabled={!isPaymentMade}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="otherNames">Other Names</Label>
                            <Input
                              id="otherNames"
                              placeholder="Enter your other names"
                              disabled={!isPaymentMade}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Gender *</Label>
                            <RadioGroup
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
                              disabled={!isPaymentMade}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nationality">Nationality *</Label>
                            <Select
                              value={postgraduateData.personalDetails.nationality}
                              onValueChange={(value) => handlePersonalDetailsChange("nationality", value)}
                              disabled={!isPaymentMade}
                            >
                              <SelectTrigger id="nationality" className="w-full">
                                <SelectValue placeholder="Select your nationality" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="nigeria" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Nigeria</SelectItem>
                                <SelectItem value="ghana" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Ghana</SelectItem>
                                <SelectItem value="kenya" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Kenya</SelectItem>
                                <SelectItem value="south_africa" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">South Africa</SelectItem>
                                <SelectItem value="tanzania" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Tanzania</SelectItem>
                                <SelectItem value="uganda" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Uganda</SelectItem>
                                <SelectItem value="zimbabwe" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Zimbabwe</SelectItem>
                                <SelectItem value="zambia" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Zambia</SelectItem>
                                <SelectItem value="malawi" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Malawi</SelectItem>
                                <SelectItem value="mozambique" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Mozambique</SelectItem>
                                <SelectItem value="angola" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Angola</SelectItem>
                                <SelectItem value="botswana" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Botswana</SelectItem>
                                <SelectItem value="namibia" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Namibia</SelectItem>
                                <SelectItem value="lesotho" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Lesotho</SelectItem>
                                <SelectItem value="eswatini" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Eswatini</SelectItem>
                                <SelectItem value="cameroon" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Cameroon</SelectItem>
                                <SelectItem value="gabon" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Gabon</SelectItem>
                                <SelectItem value="congo" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Congo</SelectItem>
                                <SelectItem value="drc" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">DR Congo</SelectItem>
                                <SelectItem value="central_african_republic" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Central African Republic</SelectItem>
                                <SelectItem value="chad" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Chad</SelectItem>
                                <SelectItem value="sudan" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Sudan</SelectItem>
                                <SelectItem value="south_sudan" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">South Sudan</SelectItem>
                                <SelectItem value="ethiopia" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Ethiopia</SelectItem>
                                <SelectItem value="eritrea" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Eritrea</SelectItem>
                                <SelectItem value="djibouti" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Djibouti</SelectItem>
                                <SelectItem value="somalia" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Somalia</SelectItem>
                                <SelectItem value="burundi" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Burundi</SelectItem>
                                <SelectItem value="rwanda" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Rwanda</SelectItem>
                                <SelectItem value="senegal" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Senegal</SelectItem>
                                <SelectItem value="gambia" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Gambia</SelectItem>
                                <SelectItem value="guinea" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Guinea</SelectItem>
                                <SelectItem value="guinea_bissau" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Guinea-Bissau</SelectItem>
                                <SelectItem value="sierra_leone" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Sierra Leone</SelectItem>
                                <SelectItem value="liberia" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Liberia</SelectItem>
                                <SelectItem value="cote_divoire" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Côte d'Ivoire</SelectItem>
                                <SelectItem value="mali" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Mali</SelectItem>
                                <SelectItem value="burkina_faso" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Burkina Faso</SelectItem>
                                <SelectItem value="niger" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Niger</SelectItem>
                                <SelectItem value="benin" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Benin</SelectItem>
                                <SelectItem value="togo" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Togo</SelectItem>
                                <SelectItem value="mauritania" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Mauritania</SelectItem>
                                <SelectItem value="cape_verde" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Cape Verde</SelectItem>
                                <SelectItem value="sao_tome" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">São Tomé and Príncipe</SelectItem>
                                <SelectItem value="equatorial_guinea" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Equatorial Guinea</SelectItem>
                                <SelectItem value="other" className="text-gray-900 hover:bg-gray-100 hover:text-gray-900">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {nationality === "nigerian" && (
                            <div className="space-y-2">
                              <Label htmlFor="stateOfOrigin">State of Origin</Label>
                              <Input
                                id="stateOfOrigin"
                                placeholder="Enter your state of origin"
                                disabled={!isPaymentMade}
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
                              disabled={!isPaymentMade}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your email address"
                              disabled={!isPaymentMade}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Street Address *</Label>
                            <Input
                              id="address"
                              placeholder="Enter your street address"
                              disabled={!isPaymentMade}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              placeholder="Enter your city"
                              disabled={!isPaymentMade}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country *</Label>
                            <Input
                              id="country"
                              placeholder="Enter your country"
                              disabled={!isPaymentMade}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Do you have any disabilities/special needs? *</Label>
                            <RadioGroup
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
                          <div className="space-y-2">
                            <Label htmlFor="disabilityDescription">If yes, provide a brief description:</Label>
                            <Textarea
                              id="disabilityDescription"
                              placeholder="Describe your disability or special needs"
                              disabled={!isPaymentMade}
                            />
                          </div>
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
                              <Select disabled={!isPaymentMade}>
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
                              <Select disabled={!isPaymentMade}>
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
                                disabled={!isPaymentMade}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subject1">Subject *</Label>
                              <Input
                                id="subject1"
                                placeholder="Enter subject"
                                disabled={!isPaymentMade}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="institution1">Awarding Institution/University *</Label>
                              <Input
                                id="institution1"
                                placeholder="Enter institution name"
                                disabled={!isPaymentMade}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="startDate1">Start Date (Month/Year) *</Label>
                              <div className="flex gap-2">
                                <Select
                                  onValueChange={(value) => {
                                    const [month, year] = postgraduateData.academicQualifications.qualification1.startDate.split('/');
                                    setPostgraduateData({
                                      ...postgraduateData,
                                      academicQualifications: {
                                        ...postgraduateData.academicQualifications,
                                        qualification1: {
                                          ...postgraduateData.academicQualifications.qualification1,
                                          startDate: `${value}/${year || ''}`
                                        }
                                      }
                                    });
                                  }}
                                  value={postgraduateData.academicQualifications.qualification1.startDate.split('/')[0] || ''}
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
                                    const [month] = postgraduateData.academicQualifications.qualification1.startDate.split('/');
                                    setPostgraduateData({
                                      ...postgraduateData,
                                      academicQualifications: {
                                        ...postgraduateData.academicQualifications,
                                        qualification1: {
                                          ...postgraduateData.academicQualifications.qualification1,
                                          startDate: `${month || ''}/${value}`
                                        }
                                      }
                                    });
                                  }}
                                  value={postgraduateData.academicQualifications.qualification1.startDate.split('/')[1] || ''}
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
                              <Label htmlFor="endDate1">End Date (Month/Year) *</Label>
                              <div className="flex gap-2">
                                <Select
                                  onValueChange={(value) => {
                                    const [month, year] = postgraduateData.academicQualifications.qualification1.endDate.split('/');
                                    setPostgraduateData({
                                      ...postgraduateData,
                                      academicQualifications: {
                                        ...postgraduateData.academicQualifications,
                                        qualification1: {
                                          ...postgraduateData.academicQualifications.qualification1,
                                          endDate: `${value}/${year || ''}`
                                        }
                                      }
                                    });
                                  }}
                                  value={postgraduateData.academicQualifications.qualification1.endDate.split('/')[0] || ''}
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
                                    const [month] = postgraduateData.academicQualifications.qualification1.endDate.split('/');
                                    setPostgraduateData({
                                      ...postgraduateData,
                                      academicQualifications: {
                                        ...postgraduateData.academicQualifications,
                                        qualification1: {
                                          ...postgraduateData.academicQualifications.qualification1,
                                          endDate: `${month || ''}/${value}`
                                        }
                                      }
                                    });
                                  }}
                                  value={postgraduateData.academicQualifications.qualification1.endDate.split('/')[1] || ''}
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
                            <Label htmlFor="transcript1">Attach Academic Transcripts and Certificate *</Label>
                            <div className="flex items-center space-x-4">
                              <Input
                                id="transcript1"
                                type="file"
                                accept=".pdf,image/*"
                                multiple
                                className="hidden"
                                disabled={!isPaymentMade}
                              />
                              <Label
                                htmlFor="transcript1"
                                className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300"
                              >
                                Upload Files
                              </Label>
                            </div>
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
                                <Input
                                  id="startDate2"
                                  placeholder="e.g., August/2011"
                                  disabled={!isPaymentMade}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="endDate2">End Date (Month/Year)</Label>
                                <Input
                                  id="endDate2"
                                  placeholder="e.g., December/2012"
                                  disabled={!isPaymentMade}
                                />
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
                          <Label htmlFor="otherQualifications">Other Academic Qualifications</Label>
                          <div className="flex items-center space-x-4">
                            <Input
                              id="otherQualifications"
                              type="file"
                              accept=".pdf,.doc,.docx,image/*"
                              className="hidden"
                              disabled={!isPaymentMade}
                            />
                            <Label
                              htmlFor="otherQualifications"
                              className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300"
                            >
                              Upload File
                            </Label>
                          </div>
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
                          <Textarea
                            id="statement"
                            placeholder="Write your statement of purpose here..."
                            className="min-h-[200px]"
                            disabled={!isPaymentMade}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="statementFile">Upload Statement of Purpose</Label>
                          <div className="flex items-center space-x-4">
                            <Input
                              id="statementFile"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              multiple
                              className="hidden"
                              disabled={!isPaymentMade}
                            />
                            <Label
                              htmlFor="statementFile"
                              className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300"
                            >
                              Upload Files
                            </Label>
                          </div>
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
                            It is your responsibility to ensure that you provide TWO references to support your application. Your referees must be able to comment on your academic suitability for the program.
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
                                disabled={!isPaymentMade}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="referee1Email">Email Address *</Label>
                              <Input
                                id="referee1Email"
                                type="email"
                                placeholder="Enter referee's email address"
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
                                disabled={!isPaymentMade}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="referee2Email">Email Address *</Label>
                              <Input
                                id="referee2Email"
                                type="email"
                                placeholder="Enter referee's email address"
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
                            By signing below, I confirm that the information I have provided in this form is true, complete and accurate, and no information or other material information has been omitted. I acknowledge that knowingly providing false information gives AUST the right to:
                          </p>
                          <ul className="list-disc list-inside text-sm text-yellow-800 mt-2">
                            <li>cancel my application.</li>
                            <li>if admitted, be dismissed from the University.</li>
                            <li>if degree already awarded, rescind degree awarded.</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="declaration">Full Name (in lieu of signature) *</Label>
                          <Input
                            id="declaration"
                            placeholder="Type your full name"
                            disabled={!isPaymentMade}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      className="border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/10"
                      disabled={!isPaymentMade}
                    >
                      Save as Draft
                    </Button>
                    <Button
                      className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
                      disabled={!isPaymentMade}
                    >
                      Submit Application
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ) : (
              Object.entries(documents).map(([type, fields]) => (
                <TabsContent key={type} value={type}>
                  <div className="space-y-6">
                    {type === "undergraduate" && (
                      <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="bg-gray-50 border-b">
                          <CardTitle className="text-xl text-gray-800">JAMB Application</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <p className="text-gray-700">
                              All undergraduate applications must be made through the JAMB E-facility Portal. Please visit the JAMB portal to complete your application process.
                            </p>
                            <Button
                              onClick={() => window.open('https://jamb.gov.ng/efacility', '_blank')}
                              className="bg-[#FF5500] hover:bg-[#e64d00]"
                            >
                              Visit JAMB Portal
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {fields.map((field) => (
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
                                  onClick={() => handleClearFile(type, field.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <div className="flex-1">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
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
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file && file.size <= 5 * 1024 * 1024) {
                                        handleFileUpload(type, field.id, file);
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
                      <Button
                        variant="outline"
                        onClick={handleSaveDraft}
                        className="border-gray-300"
                      >
                        Save Draft
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        className="bg-[#FF5500] hover:bg-[#e64d00]"
                      >
                        Submit Application
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              ))
            )}
          </Tabs>
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