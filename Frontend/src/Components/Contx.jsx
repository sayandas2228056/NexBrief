import React, { useEffect, useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  ExternalLink,
  Copy,
  Check,
  Linkedin,
  Github
} from "lucide-react";

const Conx = () => {
  const [copiedEmail, setCopiedEmail] = React.useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  
  useEffect(() => {
    // Trigger entrance animation on component mount
    setIsVisible(true);
    
    // Add scroll animation triggers
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);
  
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(type);
    
    setTimeout(() => {
      setCopiedEmail(null);
    }, 2000);
  };

  return (
    <section className={`px-4 py-16 text-gray-100 transition-all duration-1000 transform sm:px-6 md:px-10 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-16 animate-on-scroll" style={{transitionDelay: "200ms"}}>
          <h2 className="mb-4 text-3xl font-bold text-transparent sm:text-4xl md:text-5xl bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 animate-pulse">
            Get in Touch
          </h2>
          <p className="max-w-2xl mx-auto text-base text-gray-300 transition-all duration-700 transform sm:text-lg hover:scale-105">
            Feel free to reach out for collaborations, opportunities, or just a friendly chat. 
            I'm always open to new ideas and connections!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
          {/* Contact Information */}
          <div 
            className="p-6 transition-all duration-500 bg-black border border-gray-700 shadow-lg backdrop-blur-md bg-opacity-30 rounded-xl sm:p-8 animate-on-scroll hover:shadow-orange-500/20 hover:shadow-xl" 
            style={{transitionDelay: "400ms"}}
          >
            <h3 className="relative mb-6 text-xl font-semibold text-orange-300 sm:text-2xl">
              Contact Information
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 animate-expand"></span>
            </h3>
            
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start transition-all duration-500 transform hover:translate-x-2">
                <div className="p-3 mr-4 transition-all duration-300 bg-orange-600 rounded-lg bg-opacity-20 hover:bg-opacity-40 hover:scale-110">
                  <Phone className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="mb-1 text-sm text-gray-400">Phone</h4>
                  <a 
                    href="tel:+918918577218" 
                    className="flex items-center text-base font-medium text-gray-200 transition-colors sm:text-lg hover:text-orange-300"
                  >
                    +91 8918577218
                    <ExternalLink className="w-4 h-4 ml-2 transition-transform duration-300 opacity-70 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>

              {/* Emails */}
              <div className="flex items-start transition-all duration-500 transform hover:translate-x-2">
                <div className="p-3 mr-4 transition-all duration-300 bg-orange-600 rounded-lg bg-opacity-20 hover:bg-opacity-40 hover:scale-110">
                  <Mail className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 text-sm text-gray-400">Email</h4>
                  <div className="space-y-3">
                    {[ 
                      { label: "primary", email: "sayandas010124@gmail.com" },
                      { label: "secondary", email: "offcsayantubecode@gmail.com" }
                    ].map(({ label, email }) => (
                      <div key={label} className="flex flex-wrap items-center justify-between gap-2 group">
                        <a 
                          href={`mailto:${email}`} 
                          className="relative flex items-center overflow-hidden text-base font-medium text-gray-200 transition-colors sm:text-lg hover:text-orange-300"
                        >
                          <span className="relative z-10">{email}</span>
                          <ExternalLink className="w-4 h-4 ml-2 transition-transform duration-300 opacity-70 group-hover:translate-x-1" />
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
                        </a>
                        <button 
                          onClick={() => copyToClipboard(email, label)}
                          className="p-1 transition-all duration-300 transform rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-700 hover:scale-110"
                          aria-label="Copy email"
                        >
                          {copiedEmail === label ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start transition-all duration-500 transform hover:translate-x-2">
                <div className="p-3 mr-4 transition-all duration-300 bg-orange-600 rounded-lg bg-opacity-20 hover:bg-opacity-40 hover:scale-110">
                  <MapPin className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="mb-1 text-sm text-gray-400">Location</h4>
                  <p className="text-base font-medium text-gray-200 sm:text-lg">KIIT University, Bhubaneshwar-751024, India</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-10">
              <h4 className="mb-4 text-sm text-gray-400">Connect with me</h4>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://wa.me/918918577218" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 transition-all duration-300 transform bg-green-600 rounded-lg bg-opacity-20 hover:bg-opacity-30 hover:scale-110 hover:rotate-6"
                >
                  <MessageCircle className="w-5 h-5 text-green-400" />
                </a>
                <a 
                  href="https://www.instagram.com/__sdx__007/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 transition-all duration-300 transform bg-pink-600 rounded-lg bg-opacity-20 hover:bg-opacity-30 hover:scale-110 hover:rotate-6"
                >
                  <Instagram className="w-5 h-5 text-pink-400" />
                </a>
                <a 
                  href="https://www.facebook.com/offcsayantubecode" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 transition-all duration-300 transform bg-blue-600 rounded-lg bg-opacity-20 hover:bg-opacity-30 hover:scale-110 hover:rotate-6"
                >
                  <Facebook className="w-5 h-5 text-blue-400" />
                </a>
                <a 
                  href="https://github.com/sayandas2228056" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 transition-all duration-300 transform bg-gray-600 rounded-lg bg-opacity-20 hover:bg-opacity-30 hover:scale-110 hover:rotate-6"
                >
                  <Github className="w-5 h-5 text-gray-400" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/sayan-das-b99810213/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 transition-all duration-300 transform bg-blue-600 rounded-lg bg-opacity-20 hover:bg-opacity-30 hover:scale-110 hover:rotate-6"
                >
                  <Linkedin className="w-5 h-5 text-blue-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Contact Cards */}
          <div 
            className="p-6 transition-all duration-500 bg-black border border-gray-700 shadow-lg backdrop-blur-md bg-opacity-30 rounded-xl sm:p-8 animate-on-scroll hover:shadow-orange-500/20 hover:shadow-xl" 
            style={{transitionDelay: "600ms"}}
          >
            <h3 className="relative mb-6 text-xl font-semibold text-orange-300 sm:text-2xl">
              Quick Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 animate-expand"></span>
            </h3>

            <div className="space-y-8">
              {[ 
                {
                  label: "primary-card",
                  color: "from-orange-500 to-orange-700",
                  email: "sayandas010124@gmail.com",
                  description: "Reach out for professional inquiries, project collaborations, or any questions about my work and services."
                },
                {
                  label: "secondary-card",
                  color: "from-orange-600 to-yellow-500",
                  email: "offcsayantubecode@gmail.com",
                  description: "Contact for general inquiries, personal collaborations, or informal discussions about potential opportunities."
                }
              ].map(({ label, color, email, description }) => (
                <div 
                  key={label} 
                  className={`overflow-hidden transition-all duration-500 bg-gray-900 border border-gray-700 shadow-md bg-opacity-40 rounded-xl group hover:border-orange-500 transform ${activeCard === label ? 'scale-105' : ''}`}
                  onMouseEnter={() => setActiveCard(label)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div 
                        className="flex items-center justify-center w-12 h-12 mr-4 transition-all duration-500 rounded-full bg-opacity-20 group-hover:scale-110 group-hover:rotate-12"
                        style={{ backgroundColor: label.includes("primary") ? "#f97316" : "#ea580c" }}
                      >
                        <Mail className={`w-6 h-6 text-orange-400 transition-all duration-500 ${activeCard === label ? 'animate-bounce' : ''}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-200">{label === "primary-card" ? "Primary Email" : "Secondary Email"}</h4>
                        <p className="text-sm text-gray-400">{email}</p>
                      </div>
                    </div>
                    <p className="mb-6 text-gray-300">{description}</p>
                  </div>
                  <div className="p-4 transition-all duration-300 bg-gray-800 border-t border-gray-700 bg-opacity-40 group-hover:bg-opacity-60">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <a 
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Hello+from+your+website`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`flex-1 flex items-center justify-center bg-gradient-to-r ${color} text-white py-3 px-4 rounded-lg hover:brightness-110 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg`}
                      >
                        <Mail className={`w-4 h-4 mr-2 ${activeCard === label ? 'animate-pulse' : ''}`} />
                        <span>Open Gmail</span>
                      </a>
                      <button 
                        onClick={() => copyToClipboard(email, label)}
                        className="px-4 py-2 text-gray-200 transition-all duration-300 transform bg-gray-700 rounded-lg hover:bg-gray-600 hover:scale-105"
                      >
                        {copiedEmail === label ? (
                          <Check className="w-5 h-5 text-green-400 animate-bounce" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 mt-8 transition-all duration-300 bg-gray-800 border border-gray-600 border-dashed rounded-lg bg-opacity-30 backdrop-blur-sm hover:bg-opacity-50 hover:border-orange-500 animate-on-scroll" style={{transitionDelay: "800ms"}}>
              <h4 className="mb-2 text-sm font-medium text-orange-300">Quick Tip</h4>
              <p className="text-sm text-gray-400">
                Click the "Open Gmail" button to start composing an email directly in your Gmail account.
                You can also click on the copy button to easily copy the email address to your clipboard.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add global styles for animations */}
      <style jsx>{`
        @keyframes expandWidth {
          from { width: 0; }
          to { width: 100%; }
        }
        
        .animate-expand {
          animation: expandWidth 1.5s ease-in-out infinite alternate;
        }
        
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease-out;
        }
        
        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
};

export default Conx;