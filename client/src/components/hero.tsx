import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const handleViewProjects = () => {
    const element = document.querySelector("#projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGetInTouch = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="gradient-bg text-white min-h-screen flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Hi, I'm <span className="text-accent">Sachin Kumar</span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 opacity-90">Aspiring Software Developer</p>
            <p className="text-lg mb-8 opacity-80 max-w-xl">
              Computer Science student passionate about building innovative solutions with modern web technologies and machine learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleViewProjects}
                className="bg-accent hover:bg-accent/90 text-white px-8 py-3 text-lg font-semibold"
              >
                View Projects
              </Button>
              <Button
                onClick={handleGetInTouch}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-800 px-8 py-3 text-lg font-semibold"
              >
                Get In Touch
              </Button>
            </div>
          </div>
          <div className="animate-slide-up">
            <div className="relative">
              <div className="w-80 h-80 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-24 h-24 text-white/60" />
              </div>
              <div className="absolute inset-0 w-80 h-80 mx-auto rounded-full border-4 border-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
