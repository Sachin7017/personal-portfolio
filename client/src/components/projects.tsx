import { Brain, Vote, Book, Calendar, Github, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Projects() {
  const projects = [
    {
      title: "Facial Expression Recognition",
      description: "Deep learning-based system using Convolutional Neural Networks (CNN) to identify and classify human facial expressions with high accuracy.",
      icon: Brain,
      gradient: "from-blue-400 to-purple-500",
      technologies: ["Python", "OpenCV", "CNN", "Deep Learning"],
      techColors: ["bg-blue-100 text-blue-700", "bg-green-100 text-green-700", "bg-purple-100 text-purple-700", "bg-orange-100 text-orange-700"],
      year: "2024",
      githubLink: "https://github.com/Sachin7017/Facial-expression-recognization",
    externalLink: "https://your-site.com/facial-expression-recognition"
    },
    {
      title: "E-Voting System",
      description: "Secure online voting platform with user authentication, role-based access control, and advanced security measures to prevent fraud.",
      icon: Vote,
      gradient: "from-green-400 to-teal-500",
      technologies: ["PHP", "MySQL", "HTML/CSS", "Security"],
      techColors: ["bg-purple-100 text-purple-700", "bg-blue-100 text-blue-700", "bg-orange-100 text-orange-700", "bg-green-100 text-green-700"],
      year: "2024",
    },
    {
      title: "Library Management System",
      description: "Web-based library management system with book issuance, return tracking, user management, and responsive UI design.",
      icon: Book,
      gradient: "from-indigo-400 to-blue-500",
      technologies: ["Java", "MySQL", "JavaScript", "HTML/CSS"],
      techColors: ["bg-red-100 text-red-700", "bg-blue-100 text-blue-700", "bg-yellow-100 text-yellow-700", "bg-green-100 text-green-700"],
      year: "2024",
    },
  ];

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const IconComponent = project.icon;
            return (
              <div key={project.title} className="project-card bg-white rounded-xl shadow-lg overflow-hidden">
                <div className={`h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                  <IconComponent className="w-16 h-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <Badge key={tech} className={`text-sm ${project.techColors[index]}`}>
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {project.year}
                    </div>
                    <div className="flex space-x-2">
                     <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
  <Button size="sm" variant="ghost" className="text-primary hover:text-secondary">
    <Github className="w-5 h-5" />
  </Button>
</a>
<a href={project.externalLink} target="_blank" rel="noopener noreferrer">
  <Button size="sm" variant="ghost" className="text-primary hover:text-secondary">
    <ExternalLink className="w-5 h-5" />
  </Button>
</a>

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
