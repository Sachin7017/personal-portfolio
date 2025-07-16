import { GraduationCap, Tag, School, Briefcase, Code, Globe, Database, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Education() {
  const educationItems = [
    {
      type: "education",
      icon: GraduationCap,
      title: "B.Tech in Computer Science",
      institution: "Dr. A P J Abdul Kalam Technical University, Lucknow",
      year: "2025 (Pursuing)",
      status: "Current",
      statusColor: "bg-blue-100 text-blue-700",
    },
    {
      type: "education",
      icon: Tag,
      title: "Intermediate",
      institution: "Board of Technical Education, Lucknow",
      year: "2022",
      status: "70%",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      type: "education",
      icon: School,
      title: "High School",
      institution: "Kendriya Vidyalaya, Hathras",
      year: "2018",
      status: "55%",
      statusColor: "bg-green-100 text-green-700",
    },
  ];

  const interests = [
    { name: "Software Development", icon: Code },
    { name: "Web Development", icon: Globe },
    { name: "Machine Learning", icon: Brain },
    { name: "Database Systems", icon: Database },
  ];

  return (
    <section id="education" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Education & Experience</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            My educational journey and professional experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education Timeline */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Education</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-8">
                {educationItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="relative timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="ml-12">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                          <div className="flex items-center mb-2">
                            <IconComponent className="w-5 h-5 text-primary mr-2" />
                            <span className="text-sm font-medium text-primary">{item.year}</span>
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h4>
                          <p className="text-gray-600 mb-2">{item.institution}</p>
                          <div className="flex items-center">
                            <Badge className={`text-sm ${item.statusColor}`}>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Experience & Certifications */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Experience & Certifications</h3>
            <div className="space-y-6">
              {/* Apprenticeship */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Apprenticeship</h4>
                    <p className="text-gray-600 mb-2">SMPS Innovation Electronics (P) Ltd.</p>
                    <p className="text-sm text-gray-500 mb-3">Oct 1, 2021 - Nov 15, 2021 (45 Days)</p>
                    <p className="text-gray-600">
                      Gained hands-on experience in electronics and technical problem-solving, 
                      working on innovative projects and learning industry best practices.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Certification */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Tag className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Java Programming Fundamentals</h4>
                    <p className="text-gray-600 mb-2">Infosys Springboard</p>
                    <p className="text-sm text-gray-500 mb-3">Completed: April 18, 2025</p>
                    <div className="flex items-center">
                      <Badge className="text-sm bg-blue-100 text-blue-700">
                        Certified
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Areas of Interest */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Areas of Interest</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {interests.map((interest) => {
                    const IconComponent = interest.icon;
                    return (
                      <div key={interest.name} className="flex items-center">
                        <IconComponent className="w-5 h-5 text-primary mr-3" />
                        <span className="text-gray-700">{interest.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
