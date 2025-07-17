import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import VoiceAssistant from "@/components/voice-assistant";
import DeviceControl from "@/components/device-control";
import About from "@/components/about";
import Skills from "@/components/skills";
import Projects from "@/components/projects";
import Education from "@/components/education";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <VoiceAssistant />
      <DeviceControl />
      <About />
      <Skills />
      <Projects />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
}
