import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use the API service to submit the contact form
      await apiService.submitContactForm(formData);
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you soon!",
        style: {
          background: '#10B981', // Green background
          color: 'white',
        }
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again later.",
        variant: "destructive",
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-r from-[#FF5500]/10 via-[#FF7A00]/10 to-[#FFA500]/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Contact <span className="text-[#FF5500]">Us</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions about admission, programs, or campus life? 
                We're here to help. Reach out to us using any of the methods below.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 md:p-8 rounded-xl border-2 border-[#FF5500]">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                    <Input 
                      id="name" 
                      placeholder="Your full name" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Your email address" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                    <Input 
                      id="subject" 
                      placeholder="Message subject" 
                      required 
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <Textarea 
                      id="message" 
                      placeholder="Your message" 
                      className="min-h-32" 
                      required 
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      className="w-full bg-[#FF5500] hover:bg-[#e64d00]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border-2 border-[#FF5500]">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-[#FF5500]/10 flex items-center justify-center mr-4">
                      <MapPin className="h-5 w-5 text-[#FF5500]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">Our Location</h3>
                      <p className="text-gray-600">
                        African University of Science and Technology<br />
                        Km 10 Airport Road, Abuja<br />
                        Federal Capital Territory, Nigeria
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border-2 border-[#FF7A00]">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-[#FF7A00]/10 flex items-center justify-center mr-4">
                      <Phone className="h-5 w-5 text-[#FF7A00]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">Phone Contact</h3>
                      <p className="text-gray-600">
                        <a href="tel:+23491234567" className="hover:text-[#FF7A00] transition-colors">
                          Admissions Office: +234 (0) 9 123 4567
                        </a><br />
                        <a href="tel:+23499876543" className="hover:text-[#FF7A00] transition-colors">
                          Student Services: +234 (0) 9 987 6543
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border-2 border-[#FFA500]">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-[#FFA500]/10 flex items-center justify-center mr-4">
                      <Mail className="h-5 w-5 text-[#FFA500]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">Email Addresses</h3>
                      <p className="text-gray-600">
                        <a href="mailto:admissions@aust.edu.ng" className="hover:text-[#FFA500] transition-colors">
                          Admissions: admissions@aust.edu.ng
                        </a><br />
                        <a href="mailto:academics@aust.edu.ng" className="hover:text-[#FFA500] transition-colors">
                          Academic Affairs: academics@aust.edu.ng
                        </a><br />
                        <a href="mailto:support@aust.edu.ng" className="hover:text-[#FFA500] transition-colors">
                          Student Support: support@aust.edu.ng
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border-2 border-[#FF5500]">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-[#FF5500]/10 flex items-center justify-center mr-4">
                      <Clock className="h-5 w-5 text-[#FF5500]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">Office Hours</h3>
                      <p className="text-gray-600">
                        Monday - Friday: 8:00 AM - 5:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="bg-white">
          <div className="w-full">
            <div className="w-full h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.9999999999995!2d7.4220002!3d9.000923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e733ec975c7a5%3A0x2d2d373a8f08b1f7!2sAfrican%20University%20of%20Science%20and%20Technology!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AUST Location"
              ></iframe>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
