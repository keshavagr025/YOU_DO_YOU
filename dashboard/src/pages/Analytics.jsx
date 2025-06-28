import React, { useState, useEffect } from "react";
import {
  FileText,
  Star,
  Target,
  Lightbulb,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  Download,
  BarChart3,
  Brain,
} from "lucide-react";

// API Base URL - Update this to match your backend
const API_BASE_URL = "http://localhost:5000/api";

export default function Analytics() {
  const [resumeData, setResumeData] = useState({
    resumeId: null,
    atsScore: 0,
    extractedSkills: [],
    matchedKeywords: [],
    suggestions: [],
    fileName: null,
    isAnalyzing: false,
    analysisComplete: false,
    uploadProgress: 0,
  });

  const [selectedRole, setSelectedRole] = useState("");
  const [jobRoles, setJobRoles] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  // Fetch available job roles on component mount
  useEffect(() => {
    fetchJobRoles();
  }, []);

  const fetchJobRoles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/job-roles?limit=50`);
      const data = await response.json();

      if (response.ok) {
        setJobRoles(data.jobRoles);
        if (data.jobRoles.length > 0 && !selectedRole) {
          setSelectedRole(data.jobRoles[0]._id);
        }
      } else {
        setError("Failed to fetch job roles");
      }
    } catch (error) {
      console.error("Error fetching job roles:", error);
      setError("Failed to connect to server");
    }
  };

  // Handle file upload and processing
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setError("");
    setDebugInfo(null);
    setResumeData((prev) => ({
      ...prev,
      fileName: file.name,
      isAnalyzing: true,
      analysisComplete: false,
      uploadProgress: 0,
      atsScore: 0,
    }));

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("uploadedBy", "web-user");

      console.log("Uploading file:", file.name);

      const uploadResponse = await fetch(`${API_BASE_URL}/resumes/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || "Failed to upload resume");
      }

      const uploadData = await uploadResponse.json();
      console.log("Upload response:", uploadData);

      const resumeInfo = uploadData.data || uploadData;
      const resumeId = resumeInfo.resumeId;
      const extractedSkills = resumeInfo.extractedSkills || [];

      console.log("Extracted resumeId:", resumeId);
      console.log("Extracted skills:", extractedSkills);

      setResumeData((prev) => ({
        ...prev,
        resumeId: resumeId,
        extractedSkills: extractedSkills,
        uploadProgress: 50,
      }));

      if (selectedRole && resumeId) {
        console.log("Starting analysis with resumeId:", resumeId, "and jobRole:", selectedRole);
        await analyzeResume(resumeId, selectedRole);
      } else {
        console.log("No job role selected or missing resumeId. SelectedRole:", selectedRole, "ResumeId:", resumeId);
        setResumeData((prev) => ({
          ...prev,
          isAnalyzing: false,
          analysisComplete: true,
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Failed to process resume");
      setResumeData((prev) => ({
        ...prev,
        isAnalyzing: false,
        analysisComplete: false,
      }));
    }
  };

  // Analyze resume for specific job role
  const analyzeResume = async (resumeId, jobRoleId) => {
    if (!resumeId || !jobRoleId) {
      setError("Missing resume ID or job role ID");
      return;
    }

    setLoading(true);
    setError("");
    setDebugInfo(null);

    try {
      console.log(`Analyzing resume ${resumeId} for job role ${jobRoleId}`);
      
      const response = await fetch(
        `${API_BASE_URL}/resumes/${resumeId}/analyze/${jobRoleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errRes = await response.json();
        throw new Error(errRes.message || `HTTP ${response.status}: Failed to analyze resume`);
      }

      const analysisData = await response.json();
      console.log("Analysis response:", analysisData);

      const result = analysisData.data || analysisData;
      
      let atsScore = 0;
      if (typeof result.atsScore === 'number') {
        atsScore = result.atsScore;
      } else if (typeof result.score === 'number') {
        atsScore = result.score;
      } else if (typeof result.matchPercentage === 'number') {
        atsScore = result.matchPercentage;
      }

      console.log("Extracted ATS Score:", atsScore);

      setResumeData((prev) => ({
        ...prev,
        atsScore: atsScore,
        matchedKeywords: result.matchedKeywords || [],
        suggestions: result.suggestions || [],
        isAnalyzing: false,
        analysisComplete: true,
        uploadProgress: 100,
      }));

      if (result.aiProcessingUsed === false) {
        console.warn("AI processing was not used for analysis");
      }

    } catch (error) {
      console.error("Analysis error:", error);
      setError(error.message || "Failed to analyze resume");
      setResumeData((prev) => ({
        ...prev,
        isAnalyzing: false,
      }));
    } finally {
      setLoading(false);
    }
  };

  const forceReAnalysis = () => {
    if (resumeData.resumeId && selectedRole) {
      analyzeResume(resumeData.resumeId, selectedRole);
    }
  };

  const handleJobRoleChange = async (newJobRoleId) => {
    setSelectedRole(newJobRoleId);

    if (resumeData.resumeId && newJobRoleId) {
      await analyzeResume(resumeData.resumeId, newJobRoleId);
    }
  };

  const getScoreStatus = (score) => {
    if (score >= 80)
      return {
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        ring: "ring-emerald-200",
        icon: CheckCircle,
        label: "Excellent",
        gradient: "from-emerald-500 to-green-500",
      };
    if (score >= 60)
      return {
        color: "text-amber-600",
        bg: "bg-amber-50",
        ring: "ring-amber-200",
        icon: AlertCircle,
        label: "Good",
        gradient: "from-amber-500 to-orange-500",
      };
    return {
      color: "text-red-600",
      bg: "bg-red-50",
      ring: "ring-red-200",
      icon: XCircle,
      label: "Needs Improvement",
      gradient: "from-red-500 to-pink-500",
    };
  };

  const scoreStatus = getScoreStatus(resumeData.atsScore);
  const ScoreIcon = scoreStatus.icon;
  const selectedJobRole = jobRoles.find((role) => role._id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI-Powered Resume Analytics
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Optimize your resume with advanced AI analysis and get instant ATS compatibility scores
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 rounded-r-lg p-6 shadow-lg animate-pulse">
            <div className="flex items-center space-x-3">
              <XCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="text-red-800 font-semibold">Error Occurred</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ATS Score</p>
                <p className="text-2xl font-bold text-gray-900">{resumeData.atsScore}%</p>
              </div>
              <div className={`p-3 rounded-full ${scoreStatus.bg}`}>
                <BarChart3 className={`w-6 h-6 ${scoreStatus.color}`} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Skills Found</p>
                <p className="text-2xl font-bold text-gray-900">{resumeData.extractedSkills.length}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-50">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Keywords Matched</p>
                <p className="text-2xl font-bold text-gray-900">{resumeData.matchedKeywords.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Suggestions</p>
                <p className="text-2xl font-bold text-gray-900">{resumeData.suggestions.length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Lightbulb className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-full">
              <Upload className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upload Your Resume</h2>
              <p className="text-gray-600">Get instant AI-powered analysis and optimization suggestions</p>
            </div>
          </div>

          <div className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="resumeUpload"
              disabled={resumeData.isAnalyzing}
            />
            <label
              htmlFor="resumeUpload"
              className={`relative block w-full cursor-pointer ${
                resumeData.isAnalyzing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-700">
                      {resumeData.fileName ? resumeData.fileName : "Drop your resume here or click to browse"}
                    </p>
                    <p className="text-gray-500 mt-2">
                      Supports PDF, DOC, DOCX, TXT files • Max 10MB
                    </p>
                  </div>
                </div>
              </div>
            </label>

            {/* Upload Progress */}
            {resumeData.isAnalyzing && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="animate-spin w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-700">
                      {resumeData.uploadProgress < 50
                        ? "Extracting content..."
                        : "Analyzing with AI..."}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {resumeData.uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 relative"
                    style={{ width: `${resumeData.uploadProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Role Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Target Job Role</h3>
            </div>
            {resumeData.resumeId && selectedRole && (
              <button
                onClick={forceReAnalysis}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Re-analyze</span>
              </button>
            )}
          </div>
          
          <select
            value={selectedRole}
            onChange={(e) => handleJobRoleChange(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 font-medium"
            disabled={loading}
          >
            <option value="">Select a target role...</option>
            {jobRoles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.title} • {role.industry}
              </option>
            ))}
          </select>
          
          {selectedJobRole && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 leading-relaxed">
                {selectedJobRole.description}
              </p>
            </div>
          )}
        </div>

        {/* ATS Score Card */}
        <div className={`bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100 ${scoreStatus.ring} ring-2`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`p-4 ${scoreStatus.bg} rounded-xl`}>
                <Award className="text-purple-600 w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">ATS Compatibility Score</h2>
                <p className="text-gray-600">How well your resume passes automated screening</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ScoreIcon className={`w-6 h-6 ${scoreStatus.color}`} />
              <span className={`text-lg font-bold ${scoreStatus.color} px-3 py-1 rounded-full ${scoreStatus.bg}`}>
                {scoreStatus.label}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center space-x-6 mb-4">
              <div className={`text-6xl font-bold bg-gradient-to-r ${scoreStatus.gradient} bg-clip-text text-transparent`}>
                {resumeData.atsScore || 0}%
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-4 rounded-full bg-gradient-to-r ${scoreStatus.gradient} transition-all duration-1000 relative`}
                    style={{ width: `${resumeData.atsScore || 0}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                {resumeData.atsScore >= 80
                  ? "🎉 Excellent! Your resume is highly optimized for ATS systems and should pass most automated screenings."
                  : resumeData.atsScore >= 60
                  ? "👍 Good score! Your resume has solid ATS compatibility. Check the suggestions below for further improvements."
                  : resumeData.atsScore > 0
                  ? "⚠️ Your resume needs optimization to improve ATS compatibility. Follow our AI-powered suggestions below."
                  : "📄 Upload your resume and select a target job role to get your personalized ATS compatibility score."}
              </p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Extracted Skills */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Star className="text-yellow-500 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">AI-Extracted Skills</h3>
                <p className="text-sm text-gray-600">{resumeData.extractedSkills.length} skills identified</p>
              </div>
            </div>
            
            {resumeData.extractedSkills.length > 0 ? (
              <div className="space-y-3">
                {resumeData.extractedSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors"
                  >
                    <span className="font-medium text-yellow-800">{skill}</span>
                    <Zap className="w-4 h-4 text-yellow-600" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No skills extracted yet</p>
                <p className="text-sm text-gray-400 mt-1">Upload a resume to see AI-extracted skills</p>
              </div>
            )}
          </div>

          {/* Matched Keywords */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-xl">
                <FileText className="text-blue-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Matched Keywords</h3>
                <p className="text-sm text-gray-600">{resumeData.matchedKeywords.length} keywords matched</p>
              </div>
            </div>
            
            {resumeData.matchedKeywords.length > 0 ? (
              <div className="space-y-3">
                {resumeData.matchedKeywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <span className="font-medium text-blue-800">{keyword}</span>
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  {resumeData.analysisComplete && selectedRole
                    ? "No keywords matched"
                    : "No analysis completed yet"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {resumeData.analysisComplete && selectedRole
                    ? "Consider adding relevant terms from the suggestions"
                    : "Upload a resume and select a job role"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI-Powered Suggestions */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 bg-green-50 rounded-xl">
              <Lightbulb className="text-green-600 w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI-Powered Optimization Suggestions</h2>
              <p className="text-gray-600">Personalized recommendations to improve your ATS score</p>
            </div>
          </div>

          {resumeData.suggestions.length > 0 ? (
            <div className="space-y-4">
              {resumeData.suggestions.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-6 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors group"
                >
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Lightbulb className="text-green-600 w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed">{tip}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-green-400 group-hover:text-green-600 transition-colors" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {resumeData.analysisComplete
                  ? "Great job! No suggestions needed"
                  : "Ready to optimize your resume?"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {resumeData.analysisComplete
                  ? "Your resume is already well-optimized for ATS systems!"
                  : "Upload your resume and select a target job role to receive personalized AI suggestions."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}