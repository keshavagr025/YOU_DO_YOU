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
  const [debugInfo, setDebugInfo] = useState(null); // For debugging API responses

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
      atsScore: 0, // Reset score
    }));

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("uploadedBy", "web-user");

      console.log("Uploading file:", file.name);

      // Upload and process resume
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

      // Handle nested data structure
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

      // If a job role is selected, analyze immediately
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

      // Store debug info
      // setDebugInfo(analysisData);

      // Handle different response structures
      const result = analysisData.data || analysisData;
      
      // Extract ATS score with multiple fallbacks
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

      // Optional: Warn user if AI was not used
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

  // Force re-analysis (for debugging)
  const forceReAnalysis = () => {
    if (resumeData.resumeId && selectedRole) {
      analyzeResume(resumeData.resumeId, selectedRole);
    }
  };

  // Handle job role change
  const handleJobRoleChange = async (newJobRoleId) => {
    setSelectedRole(newJobRoleId);

    if (resumeData.resumeId && newJobRoleId) {
      await analyzeResume(resumeData.resumeId, newJobRoleId);
    }
  };

  // Get score status for styling
  const getScoreStatus = (score) => {
    if (score >= 80)
      return {
        color: "text-green-600",
        bg: "bg-green-50",
        icon: CheckCircle,
        label: "Excellent",
      };
    if (score >= 60)
      return {
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        icon: AlertCircle,
        label: "Good",
      };
    return {
      color: "text-red-600",
      bg: "bg-red-50",
      icon: XCircle,
      label: "Needs Improvement",
    };
  };

  const scoreStatus = getScoreStatus(resumeData.atsScore);
  const ScoreIcon = scoreStatus.icon;
  const selectedJobRole = jobRoles.find((role) => role._id === selectedRole);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        AI-Powered Resume Analytics
      </h1>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      {/* File Upload Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
        <div className="flex items-center space-x-4 mb-4">
          <Upload className="text-blue-600 w-6 h-6" />
          <h2 className="text-xl font-semibold text-gray-800">Upload Resume</h2>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
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
            className={`cursor-pointer flex flex-col items-center space-y-2 ${
              resumeData.isAnalyzing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Upload className="w-12 h-12 text-gray-400" />
            <span className="text-lg font-medium text-gray-600">
              {resumeData.fileName
                ? resumeData.fileName
                : "Click to upload your resume"}
            </span>
            <span className="text-sm text-gray-500">
              Supports PDF, DOC, DOCX, TXT files (Max 10MB)
            </span>
          </label>
        </div>

        {/* Upload Progress */}
        {resumeData.isAnalyzing && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Processing resume...
              </span>
              <span className="text-sm text-gray-600">
                {resumeData.uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${resumeData.uploadProgress}%` }}
              ></div>
            </div>
            <div className="mt-2 flex items-center justify-center space-x-2">
              <RefreshCw className="animate-spin w-4 h-4 text-blue-600" />
              <span className="text-blue-600 text-sm">
                {resumeData.uploadProgress < 50
                  ? "Extracting text and skills..."
                  : "Analyzing with AI..."}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Job Role Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Select Target Job Role:
          </label>
          {resumeData.resumeId && selectedRole && (
            <button
              onClick={forceReAnalysis}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Re-analyze</span>
            </button>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedRole}
            onChange={(e) => handleJobRoleChange(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="">Select a job role...</option>
            {jobRoles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.title} ({role.industry})
              </option>
            ))}
          </select>
          {loading && (
            <RefreshCw className="animate-spin w-5 h-5 text-blue-600" />
          )}
        </div>
        {selectedJobRole && (
          <p className="text-sm text-gray-600 mt-2">
            {selectedJobRole.description}
          </p>
        )}
      </div>

      {/* ATS Score Card */}
      <div
        className={`bg-white rounded-lg shadow p-6 mb-6 border border-gray-200 ${scoreStatus.bg}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Target className="text-purple-600 w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-800">ATS Score</h2>
          </div>
          <div className="flex items-center space-x-2">
            <ScoreIcon className={`w-5 h-5 ${scoreStatus.color}`} />
            <span className={`text-sm font-medium ${scoreStatus.color}`}>
              {scoreStatus.label}
            </span>
          </div>
        </div>

        <div className="flex items-baseline space-x-4 mt-4">
          <p className={`text-4xl font-bold ${scoreStatus.color}`}>
            {resumeData.atsScore || 0}%
          </p>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${
                  resumeData.atsScore >= 80
                    ? "bg-green-500"
                    : resumeData.atsScore >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${resumeData.atsScore || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-gray-500 text-sm">
            {resumeData.atsScore >= 80
              ? "Excellent! Your resume is well-optimized for ATS systems."
              : resumeData.atsScore >= 60
              ? "Good score! Consider the AI suggestions below to improve further."
              : resumeData.atsScore > 0
              ? "Your resume needs optimization. Follow the AI-powered suggestions below."
              : "Upload a resume and select a job role to get your ATS score."}
          </p>
          
          {/* Status indicators */}
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <span>Resume ID: {resumeData.resumeId || 'Not uploaded'}</span>
            <span>Analysis: {resumeData.analysisComplete ? 'Complete' : 'Pending'}</span>
            <span>Score: {resumeData.atsScore || 0}</span>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same... */}
      
      {/* Extracted Skills */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
        <div className="flex items-center space-x-4">
          <Star className="text-yellow-500 w-6 h-6" />
          <h2 className="text-xl font-semibold text-gray-800">
            AI-Extracted Skills ({resumeData.extractedSkills.length})
          </h2>
        </div>
        <div className="mt-4">
          {resumeData.extractedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {resumeData.extractedSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full border border-yellow-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 italic">
                Upload a resume to see AI-extracted skills
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Matched Keywords */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
        <div className="flex items-center space-x-4">
          <FileText className="text-blue-600 w-6 h-6" />
          <h2 className="text-xl font-semibold text-gray-800">
            Matched Keywords ({resumeData.matchedKeywords.length})
          </h2>
        </div>
        <div className="mt-4">
          {resumeData.matchedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {resumeData.matchedKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 italic">
                {resumeData.analysisComplete && selectedRole
                  ? "No keywords matched for this role. Consider adding relevant terms from the suggestions below."
                  : "Upload a resume and select a job role to see matched keywords"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI-Powered Suggestions */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center space-x-4">
          <Lightbulb className="text-green-600 w-6 h-6" />
          <h2 className="text-xl font-semibold text-gray-800">
            AI-Powered Optimization Suggestions
          </h2>
        </div>

        {resumeData.suggestions.length > 0 ? (
          <div className="mt-4">
            <ul className="space-y-3">
              {resumeData.suggestions.map((tip, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <Lightbulb className="text-green-500 mt-1 w-4 h-4" />
                  <span className="text-gray-800 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 italic">
              {resumeData.analysisComplete
                ? "No suggestions available. Your resume looks optimized!"
                : "Upload a resume and select a role to see AI suggestions."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
