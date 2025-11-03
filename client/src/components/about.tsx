import { Code, Lightbulb, CheckCircle, MapPin, Phone, Mail, Calendar } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About Me</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">My Journey</h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              I'm a passionate Computer Science student at Dr. A P J Abdul Kalam Technical University, Lucknow, 
              currently pursuing my B.Tech degree. My journey in programming began with a curiosity about how 
              technology can solve real-world problems.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Through various projects and hands-on experience, I've developed skills in web development, 
              machine learning, and database management. I'm particularly interested in creating user-friendly 
              applications that make a positive impact.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <Code className="w-8 h-8 text-primary mb-3 mx-auto" />
                <h4 className="font-semibold text-gray-900">Clean Code</h4>
                <p className="text-sm text-gray-600">Writing maintainable, efficient code</p>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <Lightbulb className="w-8 h-8 text-primary mb-3 mx-auto" />
                <h4 className="font-semibold text-gray-900">Innovation</h4>
                <p className="text-sm text-gray-600">Creative problem-solving approach</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-slate-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Personal Details</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-600">West Patel Nagar, Delhi,India</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-600">+91-7017453895</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-600">ks900137@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-600">July 5, 2002</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Key Strengths</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600">Quick Learner</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600">Pro-Active</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600">Technical Skills</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600">Multitasking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
