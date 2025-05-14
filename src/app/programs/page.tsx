import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import foundationScienceImg from "@/assets/images/foundation-science.jpg";

const programs = {
  undergraduate: [
    {
      title: "Bachelor of Science in Computer Science",
      description: "A comprehensive program covering software development, algorithms, and computer systems.",
      duration: "4 Years",
      requirements: "5 O'Level credits including Mathematics and English",
      link: "/apply/undergraduate"
    },
    {
      title: "Bachelor of Science in Information Technology",
      description: "Focuses on IT infrastructure, networking, and system administration.",
      duration: "4 Years",
      requirements: "5 O'Level credits including Mathematics and English",
      link: "/apply/undergraduate"
    },
    {
      title: "Bachelor of Science in Software Engineering",
      description: "Specialized program in software development methodologies and practices.",
      duration: "4 Years",
      requirements: "5 O'Level credits including Mathematics and English",
      link: "/apply/undergraduate"
    }
  ],
  postgraduate: [
    {
      title: "Master of Science in Computer Science",
      description: "Advanced studies in computer science with research focus.",
      duration: "2 Years",
      requirements: "Bachelor's degree in Computer Science or related field",
      link: "/apply/postgraduate"
    },
    {
      title: "Master of Science in Information Technology",
      description: "Advanced IT management and systems development.",
      duration: "2 Years",
      requirements: "Bachelor's degree in IT or related field",
      link: "/apply/postgraduate"
    },
    {
      title: "Master of Science in Software Engineering",
      description: "Advanced software development and project management.",
      duration: "2 Years",
      requirements: "Bachelor's degree in Software Engineering or related field",
      link: "/apply/postgraduate"
    }
  ],
  foundation: [
    {
      title: "Foundation and Remedial Studies Foundation Program",
      description: "A comprehensive foundation program for university admission",
      image: foundationScienceImg,
      link: "/apply/foundation",
      duration: "1 Year",
      requirements: "5 O'Level credits including Mathematics and English"
    }
  ]
};

export default function ProgramsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Our Programs</h1>
        <p className="text-gray-600">Choose from our range of undergraduate, postgraduate, and foundation programs</p>
      </div>

      <Tabs defaultValue="undergraduate" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-3 lg:w-auto lg:inline-flex mb-8">
          <TabsTrigger value="undergraduate" className="text-sm md:text-base">Undergraduate</TabsTrigger>
          <TabsTrigger value="postgraduate" className="text-sm md:text-base">Postgraduate</TabsTrigger>
          <TabsTrigger value="foundation" className="text-sm md:text-base">Foundation and Remedial Studies</TabsTrigger>
        </TabsList>

        <TabsContent value="undergraduate">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.undergraduate.map((program, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">{program.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm"><span className="font-medium">Duration:</span> {program.duration}</p>
                    <p className="text-sm"><span className="font-medium">Requirements:</span> {program.requirements}</p>
                  </div>
                  <Link to={program.link}>
                    <Button className="w-full">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="postgraduate">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.postgraduate.map((program, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">{program.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm"><span className="font-medium">Duration:</span> {program.duration}</p>
                    <p className="text-sm"><span className="font-medium">Requirements:</span> {program.requirements}</p>
                  </div>
                  <Link to={program.link}>
                    <Button className="w-full">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="foundation">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.foundation.map((program, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">{program.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  <div className="space-y-2 mb-6">
                    <p className="text-sm"><span className="font-medium">Duration:</span> {program.duration}</p>
                    <p className="text-sm"><span className="font-medium">Requirements:</span> {program.requirements}</p>
                  </div>
                  <Link to={program.link}>
                    <Button className="w-full">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 