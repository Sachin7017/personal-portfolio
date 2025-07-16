import { Code, Globe, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Skills() {
  const skillCategories = [
    {
      icon: Code,
      title: "Programming Languages",
      skills: [
        { name: "Java", color: "bg-orange-100 text-orange-700" },
        { name: "PHP", color: "bg-purple-100 text-purple-700" },
        { name: "JavaScript", color: "bg-yellow-100 text-yellow-700" },
        { name: "Python", color: "bg-blue-100 text-blue-700" },
      ],
    },
    {
      icon: Globe,
      title: "Web Technologies",
      skills: [
        { name: "HTML5", color: "bg-red-100 text-red-700" },
        { name: "CSS3", color: "bg-blue-100 text-blue-700" },
        { name: "OpenCV", color: "bg-green-100 text-green-700" },
        { name: "Responsive", color: "bg-indigo-100 text-indigo-700" },
      ],
    },
    {
      icon: Database,
      title: "Database & Tools",
      skills: [
        { name: "MySQL", color: "bg-blue-100 text-blue-700" },
        { name: "Git", color: "bg-gray-100 text-gray-700" },
        { name: "ML/AI", color: "bg-green-100 text-green-700" },
        { name: "CNN", color: "bg-purple-100 text-purple-700" },
      ],
    },
  ];

  return (
    <section id="skills" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Technical Skills</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Here are the technologies and tools I work with to bring ideas to life.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.title} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center mb-6">
                  <IconComponent className="w-8 h-8 text-primary mr-4" />
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {category.skills.map((skill) => (
                    <Badge
                      key={skill.name}
                      className={`skill-badge ${skill.color} px-4 py-2 font-medium text-center justify-center`}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
