import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import PortalNav from "@/components/PortalNav";
import austLogo from "@/assets/images/austlogo.webp";
import Footer from "@/components/Footer";
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
  sourceOfInformation: string;
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
    sourceOfInformation: "",
  });
  const [isPaymentMade, setIsPaymentMade] = useState(false);

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
    // For testing purposes, simulate successful payment
    setIsPaymentMade(true);
    toast({
      title: "Payment Successful",
      description: "You can now proceed with your application.",
      className: "bg-green-50 text-green-800",
    });

    // Comment out the actual Flutterwave integration for now
    /*
    window.FlutterwaveCheckout({
      public_key: "FLWPUBK_TEST-XXXXXXXXXXXXXXXXXXXXXXXX-X", // Replace with your test public key
      tx_ref: `AUST-PG-${Date.now()}`,
      amount: 10000,
      currency: "NGN",
      payment_options: "card,ussd",
      customer: {
        email: "test@example.com",
        name: "Test User",
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
    */
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PortalNav />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <img src={austLogo} alt="AUST Logo" className="h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Document Upload</h1>
            <p className="text-gray-600">Please complete all required sections and upload necessary documents</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="undergraduate">Undergraduate</TabsTrigger>
              <TabsTrigger value="postgraduate">Postgraduate</TabsTrigger>
              <TabsTrigger value="jupeb">JUPEB</TabsTrigger>
            </TabsList>

            {activeTab === "postgraduate" ? (
              <TabsContent value="postgraduate">
                <div className="space-y-8">
                  {!isPaymentMade ? (
                    <Card className="shadow-sm border border-gray-200">
                      <CardHeader className="bg-gray-50 border-b">
                        <CardTitle className="text-xl text-gray-800">Application Fee Payment</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-6">
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Postgraduate Application Fee</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Application Fee (Non-refundable)</span>
                                <span className="text-xl font-bold text-[#FF5500]">₦10,000</span>
                              </div>
                              <div className="border-t pt-4">
                                <p className="text-sm text-gray-600 mb-4">
                                  Please note that this is a non-refundable application fee. The payment must be completed before you can proceed with your application.
                                </p>
                                <div className="flex justify-center">
                                  <Button
                                    onClick={handleFlutterwavePayment}
                                    className="bg-[#FF5500] hover:bg-[#e64d00] px-8 py-2 text-sm"
                                    size="sm"
                                  >
                                    Pay Application Fee
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {/* Program Selection */}
                      <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="bg-gray-50 border-b">
                          <CardTitle className="text-xl text-gray-800">Program Selection</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="text-gray-700 font-medium">Academic Session</Label>
                              <Select
                                value={postgraduateData.academicSession}
                                onValueChange={(value) => handlePostgraduateChange("academicSession", value)}
                              >
                                <SelectTrigger className="w-full bg-white border-gray-300 hover:bg-gray-50">
                                  <SelectValue placeholder="Select Academic Session" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="2024/2025" className="text-gray-700 hover:bg-gray-100">2024/2025 Academic Session</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-700 font-medium">Program Type</Label>
                              <Select
                                value={postgraduateData.programType}
                                onValueChange={(value) => handlePostgraduateChange("programType", value)}
                              >
                                <SelectTrigger className="w-full bg-white border-gray-300 hover:bg-gray-50">
                                  <SelectValue placeholder="Select Program Type" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="pgd" className="text-gray-700 hover:bg-gray-100">Postgraduate Diploma</SelectItem>
                                  <SelectItem value="taught" className="text-gray-700 hover:bg-gray-100">Taught Masters</SelectItem>
                                  <SelectItem value="msc" className="text-gray-700 hover:bg-gray-100">MSc</SelectItem>
                                  <SelectItem value="phd" className="text-gray-700 hover:bg-gray-100">PhD</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-700 font-medium">Program</Label>
                            <Select
                              value={postgraduateData.program}
                              onValueChange={(value) => handlePostgraduateChange("program", value)}
                            >
                              <SelectTrigger className="w-full bg-white border-gray-300 hover:bg-gray-50">
                                <SelectValue placeholder="Select Program" />
                              </SelectTrigger>
                              <SelectContent className="bg-white max-h-[300px]">
                                <SelectItem value="applied_stats" className="text-gray-700 hover:bg-gray-100">Applied Statistics (MSc only)</SelectItem>
                                <SelectItem value="aerospace" className="text-gray-700 hover:bg-gray-100">Aerospace Engineering (MSc/PhD)</SelectItem>
                                <SelectItem value="cs" className="text-gray-700 hover:bg-gray-100">Computer Science (MSc/PhD)</SelectItem>
                                <SelectItem value="geoinformatics" className="text-gray-700 hover:bg-gray-100">Geoinformatics and GIS (MSc/PhD)</SelectItem>
                                <SelectItem value="energy" className="text-gray-700 hover:bg-gray-100">Energy Resources Engineering (MSc only)</SelectItem>
                                <SelectItem value="mit_taught" className="text-gray-700 hover:bg-gray-100">Management of Information Technology (Taught Masters)</SelectItem>
                                <SelectItem value="mit_msc" className="text-gray-700 hover:bg-gray-100">Management of Information Technology (MSc only)</SelectItem>
                                <SelectItem value="materials" className="text-gray-700 hover:bg-gray-100">Materials Science & Engineering (MSc/PhD)</SelectItem>
                                <SelectItem value="math_modeling" className="text-gray-700 hover:bg-gray-100">Mathematical Modeling (MSc only)</SelectItem>
                                <SelectItem value="petroleum" className="text-gray-700 hover:bg-gray-100">Petroleum Engineering (Postgraduate Diploma/MSc/PhD)</SelectItem>
                                <SelectItem value="public_admin" className="text-gray-700 hover:bg-gray-100">Public Administration (MSc only)</SelectItem>
                                <SelectItem value="public_policy" className="text-gray-700 hover:bg-gray-100">Public Policy (MSc only)</SelectItem>
                                <SelectItem value="pure_math" className="text-gray-700 hover:bg-gray-100">Pure and Applied Mathematics (MSc/PhD)</SelectItem>
                                <SelectItem value="space_physics" className="text-gray-700 hover:bg-gray-100">Space Physics (MSc/PhD)</SelectItem>
                                <SelectItem value="systems" className="text-gray-700 hover:bg-gray-100">Systems Engineering (MSc/PhD)</SelectItem>
                                <SelectItem value="physics" className="text-gray-700 hover:bg-gray-100">Theoretical and Applied Physics (MSc/PhD)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Personal Details */}
                      <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="bg-gray-50 border-b">
                          <CardTitle className="text-xl text-gray-800">Personal Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="text-gray-700 font-medium">Surname *</Label>
                              <Input
                                value={postgraduateData.personalDetails.surname}
                                onChange={(e) => handlePersonalDetailsChange("surname", e.target.value)}
                                placeholder="Enter your surname"
                                className="border-gray-300 focus:border-[#FF5500] focus:ring-[#FF5500]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-700 font-medium">First Name *</Label>
                              <Input
                                value={postgraduateData.personalDetails.firstName}
                                onChange={(e) => handlePersonalDetailsChange("firstName", e.target.value)}
                                placeholder="Enter your first name"
                                className="border-gray-300 focus:border-[#FF5500] focus:ring-[#FF5500]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-700 font-medium">Other Names</Label>
                              <Input
                                value={postgraduateData.personalDetails.otherNames}
                                onChange={(e) => handlePersonalDetailsChange("otherNames", e.target.value)}
                                placeholder="Enter your other names"
                                className="border-gray-300 focus:border-[#FF5500] focus:ring-[#FF5500]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-700 font-medium">Gender *</Label>
                              <RadioGroup
                                value={postgraduateData.personalDetails.gender}
                                onValueChange={(value) => handlePersonalDetailsChange("gender", value)}
                                className="flex space-x-6"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="male" id="male" className="text-[#FF5500]" />
                                  <Label htmlFor="male" className="text-gray-700">Male</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="female" id="female" className="text-[#FF5500]" />
                                  <Label htmlFor="female" className="text-gray-700">Female</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-700 font-medium">Date of Birth *</Label>
                              <Input
                                type="date"
                                value={postgraduateData.personalDetails.dateOfBirth}
                                onChange={(e) => handlePersonalDetailsChange("dateOfBirth", e.target.value)}
                                className="border-gray-300 focus:border-[#FF5500] focus:ring-[#FF5500]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-700 font-medium">Nationality *</Label>
                              <Input
                                value={postgraduateData.personalDetails.nationality}
                                onChange={(e) => handlePersonalDetailsChange("nationality", e.target.value)}
                                placeholder="Enter your nationality"
                                className="border-gray-300 focus:border-[#FF5500] focus:ring-[#FF5500]"
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-gray-700 font-medium">Street Address *</Label>
                              <Input
                                value={postgraduateData.personalDetails.streetAddress}
                                onChange={(e) => handlePersonalDetailsChange("streetAddress", e.target.value)}
                                placeholder="Enter your street address"
                                className="border-gray-300 focus:border-[#FF5500] focus:ring-[#FF5500]"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-2">
                                <Label className="text-gray-700 font-medium">City *</Label>
                                <Input
                                  value={postgraduateData.personalDetails.city}
                                  onChange={(e) => handlePersonalDetailsChange("city", e.target.value)}
                                  placeholder="Enter your city"
                                  className="border-gray-300 focus:border-[#FF5500] focus:ring-[#FF5500]"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-gray-700 font-medium">Country *</Label>
                                <Input
                                  value={postgraduateData.personalDetails.country}
                                  onChange={(e) => handlePersonalDetailsChange("country", e.target.value)}
                                  placeholder="Enter your country"
                                  className="border-gray-300 focus:border-[#FF5500] focus:ring-[#FF5500]"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-gray-700 font-medium">State of Origin</Label>
                                <Input
                                  value={postgraduateData.personalDetails.stateOfOrigin}
                                  onChange={(e) => handlePersonalDetailsChange("stateOfOrigin", e.target.value)}
                                  placeholder="Enter your state of origin"
                                  className="border-gray-300 focus:border-[#FF5500] focus:ring-[#FF5500]"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="text-gray-700 font-medium">Phone Number *</Label>
                                <Input
                                  value={postgraduateData.personalDetails.phoneNumber}
                                  onChange={(e) => handlePersonalDetailsChange("phoneNumber", e.target.value)}
                                  placeholder="Enter your phone number"
                                  className="border-gray-300 focus:border-[#FF5500] focus:ring-[#FF5500]"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-gray-700 font-medium">Email Address *</Label>
                                <Input
                                  type="email"
                                  value={postgraduateData.personalDetails.email}
                                  onChange={(e) => handlePersonalDetailsChange("email", e.target.value)}
                                  placeholder="Enter your email address"
                                  className="border-gray-300 focus:border-[#FF5500] focus:ring-[#FF5500]"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-700 font-medium">Do you have any disabilities/special needs? *</Label>
                              <RadioGroup
                                value={postgraduateData.personalDetails.hasDisabilities}
                                onValueChange={(value) => handlePersonalDetailsChange("hasDisabilities", value)}
                                className="flex space-x-6"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="yes" id="disability_yes" className="text-[#FF5500]" />
                                  <Label htmlFor="disability_yes" className="text-gray-700">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="no" id="disability_no" className="text-[#FF5500]" />
                                  <Label htmlFor="disability_no" className="text-gray-700">No</Label>
                                </div>
                              </RadioGroup>
                              {postgraduateData.personalDetails.hasDisabilities === "yes" && (
                                <div className="mt-4">
                                  <Label className="text-gray-700 font-medium">Please describe your disabilities/special needs</Label>
                                  <Textarea
                                    value={postgraduateData.personalDetails.disabilityDescription}
                                    onChange={(e) => handlePersonalDetailsChange("disabilityDescription", e.target.value)}
                                    placeholder="Describe your disabilities or special needs"
                                    className="mt-2 border-gray-300 focus:border-[#FF5500] focus:ring-[#FF5500]"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Academic Qualifications */}
                      <Card className="shadow-sm">
                        <CardHeader>
                          <CardTitle>Academic Qualifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            <h3 className="font-semibold">Qualification 1</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Qualification Type *</Label>
                                <Select
                                  value={postgraduateData.academicQualifications.qualification1.type}
                                  onValueChange={(value) => handlePostgraduateChange("academicQualifications", {
                                    ...postgraduateData.academicQualifications,
                                    qualification1: {
                                      ...postgraduateData.academicQualifications.qualification1,
                                      type: value,
                                    },
                                  })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select qualification type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="bsc">BSc</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Grade *</Label>
                                <Select
                                  value={postgraduateData.academicQualifications.qualification1.grade}
                                  onValueChange={(value) => handlePostgraduateChange("academicQualifications", {
                                    ...postgraduateData.academicQualifications,
                                    qualification1: {
                                      ...postgraduateData.academicQualifications.qualification1,
                                      grade: value,
                                    },
                                  })}
                                >
                                  <SelectTrigger>
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
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>CGPA *</Label>
                                <Input
                                  value={postgraduateData.academicQualifications.qualification1.cgpa}
                                  onChange={(e) => handlePostgraduateChange("academicQualifications", {
                                    ...postgraduateData.academicQualifications,
                                    qualification1: {
                                      ...postgraduateData.academicQualifications.qualification1,
                                      cgpa: e.target.value,
                                    },
                                  })}
                                  placeholder="Enter your CGPA"
                                />
                              </div>
                              <div>
                                <Label>Subject *</Label>
                                <Input
                                  value={postgraduateData.academicQualifications.qualification1.subject}
                                  onChange={(e) => handlePostgraduateChange("academicQualifications", {
                                    ...postgraduateData.academicQualifications,
                                    qualification1: {
                                      ...postgraduateData.academicQualifications.qualification1,
                                      subject: e.target.value,
                                    },
                                  })}
                                  placeholder="Enter your subject"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Awarding Institution/University *</Label>
                                <Input
                                  value={postgraduateData.academicQualifications.qualification1.institution}
                                  onChange={(e) => handlePostgraduateChange("academicQualifications", {
                                    ...postgraduateData.academicQualifications,
                                    qualification1: {
                                      ...postgraduateData.academicQualifications.qualification1,
                                      institution: e.target.value,
                                    },
                                  })}
                                  placeholder="Enter institution name"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Start Date *</Label>
                                  <Input
                                    type="month"
                                    value={postgraduateData.academicQualifications.qualification1.startDate}
                                    onChange={(e) => handlePostgraduateChange("academicQualifications", {
                                      ...postgraduateData.academicQualifications,
                                      qualification1: {
                                        ...postgraduateData.academicQualifications.qualification1,
                                        startDate: e.target.value,
                                      },
                                    })}
                                  />
                                </div>
                                <div>
                                  <Label>End Date *</Label>
                                  <Input
                                    type="month"
                                    value={postgraduateData.academicQualifications.qualification1.endDate}
                                    onChange={(e) => handlePostgraduateChange("academicQualifications", {
                                      ...postgraduateData.academicQualifications,
                                      qualification1: {
                                        ...postgraduateData.academicQualifications.qualification1,
                                        endDate: e.target.value,
                                      },
                                    })}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label>Upload Documents *</Label>
                              <div className="mt-2">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="h-8 w-8 mb-2 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500">
                                      <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PDF or image (MAX. 10MB)</p>
                                  </div>
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file && file.size <= 10 * 1024 * 1024) {
                                        handlePostgraduateChange("academicQualifications", {
                                          ...postgraduateData.academicQualifications,
                                          qualification1: {
                                            ...postgraduateData.academicQualifications.qualification1,
                                            documents: file,
                                          },
                                        });
                                      } else {
                                        toast({
                                          title: "File Too Large",
                                          description: "Please upload a file smaller than 10MB",
                                          variant: "destructive",
                                          className: "bg-red-50 text-red-800",
                                        });
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Qualification 2 (for PhD only) */}
                          {postgraduateData.programType === "phd" && (
                            <div className="space-y-4 pt-6 border-t">
                              <h3 className="font-semibold">Qualification 2 (MSc)</h3>
                              {/* Similar structure as Qualification 1 */}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Statement of Purpose */}
                      <Card className="shadow-sm">
                        <CardHeader>
                          <CardTitle>Statement of Purpose</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p className="text-gray-600">
                              Please provide a one-page summary of your reason for selecting the course, including your interest and experience in this subject area, a brief research proposal (compulsory for all Ph.D. applicants), your reason for choosing the particular course, and how the course of study connects to your future plan.
                            </p>
                            <div>
                              <Label>Upload Statement of Purpose *</Label>
                              <div className="mt-2">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="h-8 w-8 mb-2 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500">
                                      <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PDF or document (MAX. 10MB)</p>
                                  </div>
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file && file.size <= 10 * 1024 * 1024) {
                                        handlePostgraduateChange("statementOfPurpose", file);
                                      } else {
                                        toast({
                                          title: "File Too Large",
                                          description: "Please upload a file smaller than 10MB",
                                          variant: "destructive",
                                          className: "bg-red-50 text-red-800",
                                        });
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Application Fee */}
                      <Card className="shadow-sm">
                        <CardHeader>
                          <CardTitle>Application Fee Payment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">Application Fees (Non-refundable):</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Nigerian applicants: N10,000</li>
                                <li>Foreign applicants: $50</li>
                              </ul>
                              <div className="mt-4">
                                <h4 className="font-semibold mb-2">Bank Details:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  <li>Account Name: African University of Science and Technology (AUST)</li>
                                  <li>Account Number: 1016087221</li>
                                  <li>Account Type: Naira</li>
                                  <li>Bank: UBA Plc</li>
                                </ul>
                              </div>
                            </div>
                            <div>
                              <Label>Upload Payment Evidence *</Label>
                              <div className="mt-2">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="h-8 w-8 mb-2 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500">
                                      <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PDF or image (MAX. 10MB)</p>
                                  </div>
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file && file.size <= 10 * 1024 * 1024) {
                                        handlePostgraduateChange("applicationFee", file);
                                      } else {
                                        toast({
                                          title: "File Too Large",
                                          description: "Please upload a file smaller than 10MB",
                                          variant: "destructive",
                                          className: "bg-red-50 text-red-800",
                                        });
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* References */}
                      <Card className="shadow-sm">
                        <CardHeader>
                          <CardTitle>Academic References</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p className="text-gray-600">
                              Please provide TWO references to support your application. Your referees must be able to comment on your academic suitability for the program.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h4 className="font-semibold">Referee 1</h4>
                                <div>
                                  <Label>Name</Label>
                                  <Input
                                    value={postgraduateData.references.referee1.name}
                                    onChange={(e) => handlePostgraduateChange("references", {
                                      ...postgraduateData.references,
                                      referee1: {
                                        ...postgraduateData.references.referee1,
                                        name: e.target.value,
                                      },
                                    })}
                                    placeholder="Enter referee's name"
                                  />
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <Input
                                    type="email"
                                    value={postgraduateData.references.referee1.email}
                                    onChange={(e) => handlePostgraduateChange("references", {
                                      ...postgraduateData.references,
                                      referee1: {
                                        ...postgraduateData.references.referee1,
                                        email: e.target.value,
                                      },
                                    })}
                                    placeholder="Enter referee's email"
                                  />
                                </div>
                              </div>
                              <div className="space-y-4">
                                <h4 className="font-semibold">Referee 2</h4>
                                <div>
                                  <Label>Name</Label>
                                  <Input
                                    value={postgraduateData.references.referee2.name}
                                    onChange={(e) => handlePostgraduateChange("references", {
                                      ...postgraduateData.references,
                                      referee2: {
                                        ...postgraduateData.references.referee2,
                                        name: e.target.value,
                                      },
                                    })}
                                    placeholder="Enter referee's name"
                                  />
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <Input
                                    type="email"
                                    value={postgraduateData.references.referee2.email}
                                    onChange={(e) => handlePostgraduateChange("references", {
                                      ...postgraduateData.references,
                                      referee2: {
                                        ...postgraduateData.references.referee2,
                                        email: e.target.value,
                                      },
                                    })}
                                    placeholder="Enter referee's email"
                                  />
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              Note: Your referees will receive an email with a link to submit their references.
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Declaration */}
                      <Card className="shadow-sm">
                        <CardHeader>
                          <CardTitle>Declaration</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-start space-x-2">
                              <Checkbox
                                id="declaration"
                                checked={postgraduateData.declaration}
                                onCheckedChange={(checked) => handlePostgraduateChange("declaration", checked)}
                              />
                              <Label htmlFor="declaration" className="text-sm">
                                By signing below, I confirm that the information I have provided in this form is true, complete and accurate, and no information or other material information has been omitted. I acknowledge that knowingly providing false information gives AUST the right to:
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                  <li>cancel my application.</li>
                                  <li>if admitted, be dismissed from the University.</li>
                                  <li>if degree already awarded, rescind degree awarded.</li>
                                </ul>
                              </Label>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Source of Information */}
                      <Card className="shadow-sm">
                        <CardHeader>
                          <CardTitle>How did you hear about us?</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <RadioGroup
                              value={postgraduateData.sourceOfInformation}
                              onValueChange={(value) => handlePostgraduateChange("sourceOfInformation", value)}
                              className="space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="search" id="search" />
                                <Label htmlFor="search">Search Engine</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="twitter" id="twitter" />
                                <Label htmlFor="twitter">Social Media Platform: Twitter</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="facebook" id="facebook" />
                                <Label htmlFor="facebook">Social Media Platform: Facebook</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="instagram" id="instagram" />
                                <Label htmlFor="instagram">Social Media Platform: Instagram</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="linkedin" id="linkedin" />
                                <Label htmlFor="linkedin">Social Media Platform: LinkedIn</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="radio" id="radio" />
                                <Label htmlFor="radio">Radio</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="tv" id="tv" />
                                <Label htmlFor="tv">TV</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="print" id="print" />
                                <Label htmlFor="print">Print media</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="friend" id="friend" />
                                <Label htmlFor="friend">Friend</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="word" id="word" />
                                <Label htmlFor="word">Word of mouth</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Action Buttons */}
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
                    </>
                  )}
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
      <Footer />
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