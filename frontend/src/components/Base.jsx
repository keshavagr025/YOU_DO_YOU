import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, BarChart3, Target, Zap, TrendingUp, Award, Users } from "lucide-react";

const Base= () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (file) => {
    if (file && (file.type === "application/pdf" || file.name.endsWith('.pdf'))) {
      setUploadedFile(file);
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisResult({
          score: 92,
          keywords: ["React", "JavaScript", "Leadership", "Python", "Data Analysis"],
          suggestions: [
            "Add more quantifiable achievements",
            "Include industry-specific keywords",
            "Optimize formatting for ATS systems"
          ],
          strength: "Strong technical and leadership skills",
          improvement: "Add more project outcomes"
        });
      }, 3000);
    } else {
      alert("Please upload a PDF file");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section 
    id="base" className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white min-h-screen py-24 px-6 overflow-hidden">
      {/* ANIMATED BACKGROUND ELEMENTS */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-20 relative z-10">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-center lg:text-left space-y-8"
        >
          <motion.h1 
            className="text-6xl font-black leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Smart Resume
            </span>
            <br />
            <span className="text-white drop-shadow-2xl">
              Optimizer & Tracker
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform your career with AI-powered resume analysis, intelligent keyword optimization, and comprehensive application tracking.
          </motion.p>

          <div className="grid grid-cols-2 gap-6 mt-8">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-8 w-8 text-purple-400" />
                <p className="text-3xl font-bold text-purple-300">150K+</p>
              </div>
              <p className="text-gray-300 text-sm">Job Seekers Helped</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-cyan-800/30 to-blue-800/30 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-8 w-8 text-cyan-400" />
                <p className="text-3xl font-bold text-cyan-300">94%</p>
              </div>
              <p className="text-gray-300 text-sm">Success Rate</p>
            </motion.div>
          </div>

          <div className="space-y-4">
            <motion.h3 
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              INTELLIGENT CAREER OPTIMIZATION
            </motion.h3>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            {[
              { name: "AI-Powered Analysis", icon: Zap, colors: "from-purple-500 to-pink-500" },
              { name: "Smart Keyword Matching", icon: Target, colors: "from-cyan-500 to-blue-500" },
              { name: "Performance Tracking", icon: BarChart3, colors: "from-emerald-500 to-teal-500" }
            ].map((tag, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.2 }}
                whileHover={{ scale: 1.1, y: -3 }}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full font-semibold text-white bg-gradient-to-r ${tag.colors} shadow-lg backdrop-blur-sm border border-white/10`}
              >
                <tag.icon className="h-4 w-4" />
                {tag.name}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT SIDE - RESUME UPLOAD */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="w-full max-w-2xl"
        >
          <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-2xl shadow-2xl border border-white/20 relative overflow-hidden">
            
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none"></div>
            
            <div className="relative z-10">
              {!uploadedFile ? (
                // Upload Area
                <div
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                    dragActive 
                      ? "border-purple-400 bg-purple-500/20 scale-105" 
                      : "border-gray-400/50 hover:border-purple-400/70 hover:bg-purple-500/10"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <motion.div
                    animate={{ y: dragActive ? -5 : 0, scale: dragActive ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative">
                      <Upload className="mx-auto h-20 w-20 text-purple-400 mb-6" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3">Upload Your Resume</h3>
                    <p className="text-gray-300 mb-8 text-lg">
                      Drop your PDF here or click to browse
                    </p>
                    
                    <motion.button
                      onClick={onButtonClick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-2xl border border-white/10"
                    >
                      <span className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Choose File
                      </span>
                    </motion.button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleChange}
                      className="hidden"
                    />
                    
                    <p className="text-sm text-gray-400 mt-6">
                      Supports PDF files • Max 10MB • Secure & Private
                    </p>
                  </motion.div>
                </div>
              ) : (
                // Analysis Section
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-400/30"
                  >
                    <FileText className="h-10 w-10 text-emerald-400" />
                    <div className="flex-1">
                      <h4 className="font-bold text-emerald-300 text-lg">{uploadedFile.name}</h4>
                      <p className="text-emerald-200 text-sm">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded successfully
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  </motion.div>

                  {isAnalyzing ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16"
                    >
                      <div className="relative mx-auto w-20 h-20 mb-6">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-20 h-20 border-4 border-purple-300/30 border-t-purple-400 rounded-full"
                        />
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-2 border-4 border-cyan-300/30 border-r-cyan-400 rounded-full"
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        Analyzing Your Resume...
                      </h3>
                      <p className="text-gray-300 text-lg">
                        Our AI is processing your resume with advanced algorithms
                      </p>
                    </motion.div>
                  ) : analysisResult ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="space-y-6"
                    >
                      {/* Score */}
                      <div className="text-center p-8 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl border border-purple-400/30">
                        <Award className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-3">Resume Score</h3>
                        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                          {analysisResult.score}%
                        </div>
                        <p className="text-gray-300">Optimization Score</p>
                      </div>

                      {/* Key Insights */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-400/30">
                          <div className="flex items-center gap-3 mb-3">
                            <Target className="h-6 w-6 text-emerald-400" />
                            <h4 className="font-bold text-emerald-300 text-lg">Key Strength</h4>
                          </div>
                          <p className="text-emerald-100">{analysisResult.strength}</p>
                        </div>
                        
                        <div className="p-5 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-400/30">
                          <div className="flex items-center gap-3 mb-3">
                            <AlertCircle className="h-6 w-6 text-orange-400" />
                            <h4 className="font-bold text-orange-300 text-lg">Improvement Area</h4>
                          </div>
                          <p className="text-orange-100">{analysisResult.improvement}</p>
                        </div>
                      </div>

                      {/* Keywords */}
                      <div className="p-5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-400/30">
                        <div className="flex items-center gap-3 mb-4">
                          <Zap className="h-6 w-6 text-cyan-400" />
                          <h4 className="font-bold text-cyan-300 text-lg">Detected Skills</h4>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {analysisResult.keywords.map((keyword, i) => (
                            <motion.span 
                              key={i} 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="px-4 py-2 bg-gradient-to-r from-cyan-600/50 to-blue-600/50 text-cyan-100 rounded-full text-sm font-semibold border border-cyan-400/30"
                            >
                              {keyword}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-4">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 shadow-xl border border-emerald-400/30"
                        >
                          Get Detailed Report
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setUploadedFile(null);
                            setAnalysisResult(null);
                          }}
                          className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 border border-white/20"
                        >
                          Upload New
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Base;