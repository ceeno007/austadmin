import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiService from "@/services/api";
import { Upload, X } from "lucide-react";

interface ReferenceFormData {
  known_duration_context: string;
  place_of_work: string;
  final_recommendation: string;
  contact_details: string;
  email_personal: string;
  programme_applied_for: string;
  research_ability: number;
  candidate_name: string;
  intellectual_ability: number;
  name: string;
  additional_comments: string;
  email_official: string;
  leadership_ability: number;
  designation: string;
  teaching_ability: number;
}

const ReferenceForm = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ReferenceFormData>({
    known_duration_context: "",
    place_of_work: "",
    final_recommendation: "",
    contact_details: "",
    email_personal: "",
    programme_applied_for: "",
    research_ability: 0,
    candidate_name: "",
    intellectual_ability: 0,
    name: "",
    additional_comments: "",
    email_official: "",
    leadership_ability: 0,
    designation: "",
    teaching_ability: 0,
  });

  const handleInputChange = (field: keyof ReferenceFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create a new FormData instance
      const formSubmitData = new FormData();
      
      // Append all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        formSubmitData.append(key, value.toString());
      });

      // Append file if uploaded
      if (uploadedFile) {
        formSubmitData.append('uploaded_file', uploadedFile);
      }
      
      // Use the new function that handles UUID extraction and redirect
      await apiService.submitReferenceFormAndRedirect(formSubmitData);
      
      // Show success toast with nice styling
      toast.success("Reference Submitted Successfully!", {
        description: "Thank you for providing the reference. Redirecting to confirmation page...",
        duration: 3000,
        style: {
          background: '#10B981',
          color: 'white',
          border: 'none',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }
      });

      // The redirect will be handled by the submitReferenceFormAndRedirect function

    } catch (error: any) {
      toast.error("Failed to submit reference", {
        description: error.message || "Please try again later",
        duration: 5000,
        style: {
          background: '#EF4444',
          color: 'white',
          border: 'none',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Academic Reference Form</h1>
            <p className="mt-2 text-gray-600">Please provide your assessment of the candidate</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Designation <span className="text-red-500">*</span></Label>
                  <Input
                    required
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                    placeholder="Enter your designation"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Official Email <span className="text-red-500">*</span></Label>
                  <Input
                    required
                    type="email"
                    value={formData.email_official}
                    onChange={(e) => handleInputChange("email_official", e.target.value)}
                    placeholder="Enter your official email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Personal Email</Label>
                  <Input
                    type="email"
                    value={formData.email_personal}
                    onChange={(e) => handleInputChange("email_personal", e.target.value)}
                    placeholder="Enter your personal email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Place of Work <span className="text-red-500">*</span></Label>
                  <Input
                    required
                    value={formData.place_of_work}
                    onChange={(e) => handleInputChange("place_of_work", e.target.value)}
                    placeholder="Enter your place of work"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Details <span className="text-red-500">*</span></Label>
                  <Input
                    required
                    value={formData.contact_details}
                    onChange={(e) => handleInputChange("contact_details", e.target.value)}
                    placeholder="Enter your contact details"
                  />
                </div>
              </div>
            </div>

            {/* Candidate Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Candidate Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Candidate Name <span className="text-red-500">*</span></Label>
                  <Input
                    required
                    value={formData.candidate_name}
                    onChange={(e) => handleInputChange("candidate_name", e.target.value)}
                    placeholder="Enter candidate's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Programme Applied For <span className="text-red-500">*</span></Label>
                  <Input
                    required
                    value={formData.programme_applied_for}
                    onChange={(e) => handleInputChange("programme_applied_for", e.target.value)}
                    placeholder="Enter programme applied for"
                  />
                </div>
              </div>
            </div>

            {/* Assessment Ratings */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Assessment Ratings</h2>
              <p className="text-sm text-gray-600">Please rate the candidate on a scale of 1-5 (1 being lowest, 5 being highest)</p>
              
              <div className="space-y-4">
                {[
                  { label: "Intellectual Ability", field: "intellectual_ability" },
                  { label: "Research Ability", field: "research_ability" },
                  { label: "Teaching Ability", field: "teaching_ability" },
                  { label: "Leadership Ability", field: "leadership_ability" },
                ].map(({ label, field }) => (
                  <div key={field} className="space-y-2">
                    <Label>{label} <span className="text-red-500">*</span></Label>
                    <div className="flex gap-4">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <label key={rating} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={field}
                            value={rating}
                            checked={formData[field as keyof ReferenceFormData] === rating}
                            onChange={() => handleInputChange(field as keyof ReferenceFormData, rating)}
                            className="h-4 w-4 text-blue-600"
                            required
                          />
                          <span className="text-sm text-gray-700">{rating}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>How long have you known the candidate and in what context? <span className="text-red-500">*</span></Label>
                  <Textarea
                    required
                    value={formData.known_duration_context}
                    onChange={(e) => handleInputChange("known_duration_context", e.target.value)}
                    placeholder="Describe your relationship with the candidate"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Final Recommendation <span className="text-red-500">*</span></Label>
                  <Textarea
                    required
                    value={formData.final_recommendation}
                    onChange={(e) => handleInputChange("final_recommendation", e.target.value)}
                    placeholder="Provide your final recommendation"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Additional Comments</Label>
                  <Textarea
                    value={formData.additional_comments}
                    onChange={(e) => handleInputChange("additional_comments", e.target.value)}
                    placeholder="Any additional comments or observations"
                    rows={4}
                  />
                </div>
                
                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Upload Supporting Document (Optional)</Label>
                  <div className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                    uploadedFile ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="file"
                      id="referenceDocument"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="referenceDocument"
                      className="flex flex-col items-center justify-center w-full cursor-pointer"
                    >
                      {uploadedFile ? (
                        <div className="flex items-center justify-center w-full gap-2">
                          <span className="text-sm text-green-800 text-center">{uploadedFile.name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setUploadedFile(null);
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
                            Click to upload supporting document
                          </span>
                          <span className="mt-1 text-xs text-gray-500 text-center">
                            Accepted formats: PDF, DOC, DOCX (Max: 5MB)
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-40"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  "Submit Reference"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReferenceForm; 