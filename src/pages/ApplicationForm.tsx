
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Upload, FileText, User, Book, GraduationCap, Check } from "lucide-react";

const ApplicationForm = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [progress, setProgress] = useState(25);
  const navigate = useNavigate();
  
  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "Nigerian",
    stateOfOrigin: "",
    phone: "",
    address: "",
  });
  
  const [academicInfo, setAcademicInfo] = useState({
    highSchool: "",
    graduationYear: "",
    programCategory: "",
    program: "",
  });
  
  // File upload states (simplified for demo)
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File | null}>({
    oLevelResult: null,
    birthCertificate: null,
    stateOfOriginCert: null,
    passport: null
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const files = event.target.files;
    if (files && files[0]) {
      setUploadedFiles({
        ...uploadedFiles,
        [fileType]: files[0]
      });
    }
  };
  
  const changeTab = (tab: string) => {
    setActiveTab(tab);
    
    // Update progress based on tab
    if (tab === "personal") setProgress(25);
    else if (tab === "academic") setProgress(50);
    else if (tab === "documents") setProgress(75);
    else if (tab === "review") setProgress(100);
  };
  
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value
    });
  };
  
  const handleAcademicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAcademicInfo({
      ...academicInfo,
      [name]: value
    });
  };
  
  const handleSelectChange = (value: string, field: string) => {
    if (field === "programCategory" || field === "program" || field === "gender" || field === "stateOfOrigin") {
      if (field === "programCategory") {
        setAcademicInfo({
          ...academicInfo,
          programCategory: value,
          program: "" // Reset program when category changes
        });
      } else if (field === "program") {
        setAcademicInfo({
          ...academicInfo,
          program: value
        });
      } else {
        setPersonalInfo({
          ...personalInfo,
          [field]: value
        });
      }
    }
  };
  
  const nextTab = () => {
    if (activeTab === "personal") changeTab("academic");
    else if (activeTab === "academic") changeTab("documents");
    else if (activeTab === "documents") changeTab("review");
  };
  
  const prevTab = () => {
    if (activeTab === "academic") changeTab("personal");
    else if (activeTab === "documents") changeTab("academic");
    else if (activeTab === "review") changeTab("documents");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Application submitted successfully!");
    
    // Redirect to dashboard after submission
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };
  
  // Mock data for select fields
  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
    "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
    "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
    "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
    "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ];
  
  const programCategories = ["undergraduate", "postgraduate", "jupeb"];
  
  const programsByCategory: {[key: string]: string[]} = {
    undergraduate: ["Computer Science", "Business Administration", "Medicine & Surgery", "Law", "Electrical Engineering", "Mass Communication"],
    postgraduate: ["Computer Science (MSc)", "MBA", "Public Health (MPH)", "Civil Engineering (MEng)"],
    jupeb: ["Physics", "Biology", "Chemistry", "Mathematics"]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto border-none shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Admission Application</CardTitle>
                <CardDescription>Complete your application details</CardDescription>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-uni-purple to-uni-blue flex items-center justify-center text-white font-bold text-xl">
                U
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between mb-2 text-sm">
                <span>Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={changeTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="personal" className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="academic" className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Book className="h-4 w-4" />
                  <span className="hidden sm:inline">Academic</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Documents</span>
                </TabsTrigger>
                <TabsTrigger value="review" className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <CheckCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Review</span>
                </TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmit}>
                <TabsContent value="personal" className="mt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={personalInfo.firstName}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={personalInfo.lastName}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        name="middleName"
                        value={personalInfo.middleName}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={personalInfo.gender}
                        onValueChange={(value) => handleSelectChange(value, "gender")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        name="nationality"
                        value={personalInfo.nationality}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="stateOfOrigin">State of Origin</Label>
                      <Select
                        value={personalInfo.stateOfOrigin}
                        onValueChange={(value) => handleSelectChange(value, "stateOfOrigin")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {nigerianStates.map((state) => (
                            <SelectItem key={state} value={state.toLowerCase()}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Home Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={personalInfo.address}
                      onChange={handlePersonalInfoChange}
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button type="button" onClick={nextTab} className="bg-primary">
                      Next Step
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="academic" className="mt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="highSchool">High School/Previous Institution</Label>
                      <Input
                        id="highSchool"
                        name="highSchool"
                        value={academicInfo.highSchool}
                        onChange={handleAcademicInfoChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        name="graduationYear"
                        type="number"
                        placeholder="YYYY"
                        min="1970"
                        max={new Date().getFullYear()}
                        value={academicInfo.graduationYear}
                        onChange={handleAcademicInfoChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="programCategory">Program Category</Label>
                      <Select
                        value={academicInfo.programCategory}
                        onValueChange={(value) => handleSelectChange(value, "programCategory")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {programCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="program">Program</Label>
                      <Select
                        value={academicInfo.program}
                        onValueChange={(value) => handleSelectChange(value, "program")}
                        disabled={!academicInfo.programCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          {academicInfo.programCategory && programsByCategory[academicInfo.programCategory]?.map((program) => (
                            <SelectItem key={program} value={program}>
                              {program}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevTab}>
                      Previous
                    </Button>
                    <Button type="button" onClick={nextTab} className="bg-primary">
                      Next Step
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="mt-0 space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Card className="border border-dashed">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Upload className="h-5 w-5 mr-2" />
                          O'Level Results
                        </CardTitle>
                        <CardDescription>Upload your WAEC/NECO certificate</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center py-4">
                          <Label
                            htmlFor="oLevelResult"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            {uploadedFiles.oLevelResult ? (
                              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-green-500">
                                <Check className="h-8 w-8 mb-2" />
                                <p className="text-sm">{uploadedFiles.oLevelResult.name}</p>
                                <p className="text-xs text-gray-500">{Math.round(uploadedFiles.oLevelResult.size / 1024)} KB</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="h-8 w-8 mb-2 text-gray-400" />
                                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500">PDF, PNG or JPG (MAX. 5MB)</p>
                              </div>
                            )}
                            <Input
                              id="oLevelResult"
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, "oLevelResult")}
                              required
                            />
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-dashed">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Upload className="h-5 w-5 mr-2" />
                          Birth Certificate/Declaration of Age
                        </CardTitle>
                        <CardDescription>Upload your birth certificate</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center py-4">
                          <Label
                            htmlFor="birthCertificate"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            {uploadedFiles.birthCertificate ? (
                              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-green-500">
                                <Check className="h-8 w-8 mb-2" />
                                <p className="text-sm">{uploadedFiles.birthCertificate.name}</p>
                                <p className="text-xs text-gray-500">{Math.round(uploadedFiles.birthCertificate.size / 1024)} KB</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="h-8 w-8 mb-2 text-gray-400" />
                                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500">PDF, PNG or JPG (MAX. 5MB)</p>
                              </div>
                            )}
                            <Input
                              id="birthCertificate"
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, "birthCertificate")}
                              required
                            />
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-dashed">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Upload className="h-5 w-5 mr-2" />
                          Passport Photograph
                        </CardTitle>
                        <CardDescription>Upload your recent passport photograph</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center py-4">
                          <Label
                            htmlFor="passport"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            {uploadedFiles.passport ? (
                              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-green-500">
                                <Check className="h-8 w-8 mb-2" />
                                <p className="text-sm">{uploadedFiles.passport.name}</p>
                                <p className="text-xs text-gray-500">{Math.round(uploadedFiles.passport.size / 1024)} KB</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="h-8 w-8 mb-2 text-gray-400" />
                                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500">PNG or JPG (MAX. 2MB)</p>
                              </div>
                            )}
                            <Input
                              id="passport"
                              type="file"
                              accept=".png,.jpg,.jpeg"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, "passport")}
                              required
                            />
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevTab}>
                      Previous
                    </Button>
                    <Button type="button" onClick={nextTab} className="bg-primary">
                      Review Application
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="review" className="mt-0 space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                    <CheckCircle className="text-green-500 h-5 w-5 mr-2" />
                    <p className="text-green-800">Please review your application before submitting</p>
                  </div>
                  
                  <Card>
                    <CardHeader className="bg-gray-50 pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="space-y-1">
                          <p className="text-gray-500">Full Name</p>
                          <p className="font-medium">{personalInfo.firstName} {personalInfo.middleName} {personalInfo.lastName}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500">Date of Birth</p>
                          <p className="font-medium">{personalInfo.dateOfBirth}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500">Gender</p>
                          <p className="font-medium">{personalInfo.gender ? personalInfo.gender.charAt(0).toUpperCase() + personalInfo.gender.slice(1) : "-"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500">Phone Number</p>
                          <p className="font-medium">{personalInfo.phone || "-"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500">Nationality</p>
                          <p className="font-medium">{personalInfo.nationality}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500">State of Origin</p>
                          <p className="font-medium">
                            {personalInfo.stateOfOrigin 
                              ? personalInfo.stateOfOrigin.charAt(0).toUpperCase() + personalInfo.stateOfOrigin.slice(1) 
                              : "-"}
                          </p>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <p className="text-gray-500">Home Address</p>
                          <p className="font-medium">{personalInfo.address || "-"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="bg-gray-50 pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Book className="h-5 w-5 mr-2" />
                        Academic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="space-y-1">
                          <p className="text-gray-500">Previous Institution</p>
                          <p className="font-medium">{academicInfo.highSchool || "-"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500">Graduation Year</p>
                          <p className="font-medium">{academicInfo.graduationYear || "-"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500">Program Category</p>
                          <p className="font-medium">
                            {academicInfo.programCategory
                              ? academicInfo.programCategory.charAt(0).toUpperCase() + academicInfo.programCategory.slice(1)
                              : "-"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500">Selected Program</p>
                          <p className="font-medium">{academicInfo.program || "-"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="bg-gray-50 pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Uploaded Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between border-b pb-2">
                          <p>O'Level Results</p>
                          {uploadedFiles.oLevelResult ? (
                            <p className="text-green-500 flex items-center">
                              <Check className="h-4 w-4 mr-1" />
                              Uploaded
                            </p>
                          ) : (
                            <p className="text-red-500">Not uploaded</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between border-b pb-2">
                          <p>Birth Certificate</p>
                          {uploadedFiles.birthCertificate ? (
                            <p className="text-green-500 flex items-center">
                              <Check className="h-4 w-4 mr-1" />
                              Uploaded
                            </p>
                          ) : (
                            <p className="text-red-500">Not uploaded</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p>Passport Photograph</p>
                          {uploadedFiles.passport ? (
                            <p className="text-green-500 flex items-center">
                              <Check className="h-4 w-4 mr-1" />
                              Uploaded
                            </p>
                          ) : (
                            <p className="text-red-500">Not uploaded</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevTab}>
                      Previous
                    </Button>
                    <Button type="submit" className="bg-primary">
                      Submit Application
                    </Button>
                  </div>
                </TabsContent>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationForm;
