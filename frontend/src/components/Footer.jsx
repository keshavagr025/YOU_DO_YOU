import React from "react";
import { motion } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUp 
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  


  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating 3D Cubes */}
        <motion.div
          animate={{ 
            rotateX: [0, 360],
            rotateY: [0, 360],
            y: [0, -20, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15, 
            ease: "linear" 
          }}
          className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 transform-gpu"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 100%, 0% 100%)',
            transformStyle: 'preserve-3d'
          }}
        />
        
        <motion.div
          animate={{ 
            rotateX: [360, 0],
            rotateZ: [0, 360],
            x: [0, 30, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20, 
            ease: "linear" 
          }}
          className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10 rounded-full transform-gpu"
          style={{ transformStyle: 'preserve-3d' }}
        />

        {/* Geometric Patterns */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="absolute top-10 right-10 w-32 h-32 text-white opacity-5" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        {/* Top Section */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-12 mb-16">
          
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="relative">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ReadyBoss
              </h2>
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 blur-xl rounded-lg transform -skew-y-1"></div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              Revolutionizing career success with AI-powered resume optimization and intelligent job tracking.
            </p>
            
            {/* Social Links with 3D effect */}
            <div className="flex space-x-4">
              {[
                { icon: Github, href: "#", color: "hover:text-gray-400" },
                { icon: Linkedin, href: "#", color: "hover:text-blue-400" },
                { icon: Twitter, href: "#", color: "hover:text-cyan-400" },
                { icon: Mail, href: "#", color: "hover:text-red-400" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ 
                    scale: 1.2,
                    rotateY: 15,
                    z: 20
                  }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-xl ${social.color} transform-gpu`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-blue-300 mb-6">Quick Links</h3>
            <div className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Features", href: "#features" },
                { label: "Testimonials", href: "#testimonials" },
                { label: "Sign Up", href: "/signup" }
              ].map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5, scale: 1.05 }}
                  className="transform-gpu"
                >
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-all duration-300 block py-1 px-3 rounded-md hover:bg-white/10 backdrop-blur-sm"
                  >
                    {link.label}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-blue-300 mb-6">Contact Info</h3>
            <div className="space-y-4">
              {[
                { icon: Mail, text: "support@readyboss.com", color: "text-red-400" },
                { icon: Phone, text: "+91 9876543210", color: "text-green-400" },
                { icon: MapPin, text: "Mumbai, Maharashtra", color: "text-blue-400" }
              ].map((contact, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center ${contact.color} shadow-lg`}>
                    <contact.icon size={16} />
                  </div>
                  <span className="text-sm">{contact.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-blue-300 mb-6">Stay Updated</h3>
            <p className="text-gray-300 text-sm">
              Get the latest updates on new features and career tips.
            </p>
            
            <div className="space-y-4">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 transition-all duration-300"
              />
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(168, 85, 247, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform-gpu"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ReadyBoss. All rights reserved.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex space-x-6 text-sm"
          >
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
          </motion.div>

          {/* Scroll to Top Button */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ 
              scale: 1.1,
              rotateY: 180,
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform-gpu"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>

        {/* Inspirational Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12 pt-8 border-t border-white/10"
        >
          <p className="text-lg font-medium italic bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            "Transform your career with intelligence, precision, and confidence."
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;