 import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
   const socialLinks = [
    { icon: Github, href: "https://github.com/Sachin7017", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/sachin-kumar-517346255", label: "LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/sachin_kum01?igsh=MXdwZ2NnbWZlamh1Zg==", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" }, // agar abhi Twitter nahi hai to ye line hata bhi sakta hai
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-3xl font-bold mb-4">SK</div>
          <p className="text-gray-400 mb-6">Build the future with code, one project at a time.</p>
          <div className="flex justify-center space-x-6 mb-6">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                  asChild
                >
                  <a href={social.href} aria-label={social.label}>
                    <IconComponent className="w-5 h-5" />
                  </a>
                </Button>
              );
            })}
          </div>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-400 text-sm">
              © 2024 Sachin Kumar. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
