import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Send,
  User,
  Bot,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Star,
  Target,
  TrendingUp,
  Award,
  Zap,
  Brain,
  MessageSquare,
  Volume2,
  VolumeX,
  Settings,
  ChevronRight,
} from "lucide-react";

const MockInterviewApp = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentInterviewId, setCurrentInterviewId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [apiRoles, setApiRoles] = useState({});
  const [search, setSearch] = useState("");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);

  const recognitionRef = useRef(null);
  const speechSynthRef = useRef(null);
  const timerRef = useRef(null);

  // Mock API roles for demo purposes
  const mockRoles = {
    "frontend": {
      name: "Frontend Developer",
      questions: [
        "Tell me about your experience with React and modern JavaScript frameworks.",
        "How do you ensure cross-browser compatibility in your applications?",
        "Describe your approach to responsive web design.",
        "How do you optimize web applications for performance?",
        "What's your experience with state management libraries?"
      ]
    },
    "backend": {
      name: "Backend Developer",
      questions: [
        "Explain your experience with RESTful API design and implementation.",
        "How do you handle database optimization and scaling?",
        "Describe your approach to microservices architecture.",
        "How do you ensure security in backend applications?",
        "What's your experience with cloud services and deployment?"
      ]
    },
    "fullstack": {
      name: "Full Stack Developer",
      questions: [
        "How do you manage the communication between frontend and backend?",
        "Describe a complex project you've worked on end-to-end.",
        "How do you approach database design for web applications?",
        "What's your experience with DevOps and CI/CD?",
        "How do you ensure code quality across the entire stack?"
      ]
    },
    "data_scientist": {
      name: "Data Scientist",
      questions: [
        "Explain your approach to data preprocessing and cleaning.",
        "How do you select appropriate machine learning algorithms?",
        "Describe your experience with statistical analysis.",
        "How do you communicate complex findings to non-technical stakeholders?",
        "What tools do you use for data visualization?"
      ]
    },
    "product_manager": {
      name: "Product Manager",
      questions: [
        "How do you prioritize features in a product roadmap?",
        "Describe your experience with user research and feedback collection.",
        "How do you work with engineering teams to deliver products?",
        "What metrics do you use to measure product success?",
        "How do you handle conflicting stakeholder requirements?"
      ]
    },
    "devops": {
      name: "DevOps Engineer",
      questions: [
        "Explain your experience with containerization and orchestration.",
        "How do you implement and maintain CI/CD pipelines?",
        "Describe your approach to infrastructure monitoring.",
        "How do you handle incident response and system reliability?",
        "What's your experience with Infrastructure as Code?"
      ]
    }
  };

  // API base URL
  const API_BASE = "http://localhost:5000/api";

  // Fetch interview roles from API (fallback to mock data)
  const fetchInterviewRoles = async () => {
    try {
      const response = await fetch(`${API_BASE}/mock/roles`);
      const data = await response.json();
      if (data.success) {
        setApiRoles(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch interview roles, using mock data:", error);
      setApiRoles(mockRoles);
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };
    }

    speechSynthRef.current = window.speechSynthesis;
    fetchInterviewRoles();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Timer for interview duration
  useEffect(() => {
    if (interviewStarted) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [interviewStarted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      setTranscript("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const speakText = (text) => {
    if (speechSynthRef.current && isSpeechEnabled) {
      if (speechSynthRef.current.speaking) {
        speechSynthRef.current.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthRef.current.speak(utterance);
    }
  };

  const startInterview = async () => {
    if (!selectedRole) return;

    setIsLoading(true);

    try {
      // Mock API response for demo
      const mockResponse = {
        success: true,
        data: {
          interviewId: `interview_${Date.now()}`,
          role: apiRoles[selectedRole].name,
          firstQuestion: apiRoles[selectedRole].questions[0]
        }
      };

      setTimeout(() => {
        setCurrentInterviewId(mockResponse.data.interviewId);
        setCurrentQuestionIndex(0);
        setInterviewStarted(true);
        setConversation([]);
        setTimeElapsed(0);

        const firstQuestion = mockResponse.data.firstQuestion;
        setCurrentQuestion(firstQuestion);

        const welcomeMessage = `Hello! I'm your AI interviewer for the ${mockResponse.data.role} position. Let's begin with our first question: ${firstQuestion}`;

        setConversation([
          {
            type: "ai",
            content: welcomeMessage,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);

        if (isSpeechEnabled) {
          speakText(welcomeMessage);
        }
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error starting interview:", error);
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!transcript.trim() || !currentInterviewId) return;

    const userAnswer = transcript.trim();
    setIsLoading(true);

    const newConversation = [
      ...conversation,
      {
        type: "user",
        content: userAnswer,
        timestamp: new Date().toLocaleTimeString(),
      },
    ];
    setConversation(newConversation);

    try {
      // Mock feedback generation
      setTimeout(() => {
        const mockFeedback = {
          score: Math.floor(Math.random() * 3) + 7, // 7-10
          strengths: "Great technical knowledge and clear communication.",
          improvements: "Could provide more specific examples.",
          suggestions: "Consider using the STAR method for behavioral questions."
        };

        const nextIndex = currentQuestionIndex + 1;
        const nextQuestion = apiRoles[selectedRole]?.questions[nextIndex];

        let aiMessage = `Thank you for your answer. Here's my feedback: ${mockFeedback.strengths}`;
        
        if (mockFeedback.improvements) {
          aiMessage += ` Areas for improvement: ${mockFeedback.improvements}`;
        }

        aiMessage += ` I'd rate this answer ${mockFeedback.score}/10.`;

        if (nextQuestion) {
          aiMessage += ` Now, let's move to the next question: ${nextQuestion}`;
          setCurrentQuestion(nextQuestion);
          setCurrentQuestionIndex(nextIndex);
        } else {
          const overallScore = Math.floor(Math.random() * 2) + 8;
          aiMessage += ` That completes our interview. Your overall score is ${overallScore}/10. Thank you for your time!`;
          setInterviewStarted(false);
        }

        const updatedConversation = [
          ...newConversation,
          {
            type: "ai",
            content: aiMessage,
            timestamp: new Date().toLocaleTimeString(),
          },
        ];

        setConversation(updatedConversation);
        if (isSpeechEnabled) {
          speakText(aiMessage);
        }
        setTranscript("");
        setFeedback(mockFeedback);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setIsLoading(false);
    }
  };

  const resetInterview = () => {
    setInterviewStarted(false);
    setConversation([]);
    setCurrentQuestion("");
    setTranscript("");
    setFeedback(null);
    setTimeElapsed(0);
    setCurrentInterviewId(null);
    setCurrentQuestionIndex(0);
    setIsRecording(false);

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (speechSynthRef.current && speechSynthRef.current.speaking) {
      speechSynthRef.current.cancel();
    }
  };

  // const getRoleIcon = (roleKey) => {
  //   const icons = {
  //     frontend: "🎨",
  //     backend: "⚙️",
  //     fullstack: "🔄",
  //     data_scientist: "📊",
  //     product_manager: "📋",
  //     devops: "🚀"
  //   };
  //   return icons[roleKey] || "💼";
  // };

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                AI Mock Interview
              </h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Practice with our advanced AI interviewer and get instant feedback to ace your next interview
            </p>
          </div>

          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Target, label: "Practice Questions", value: "50+" },
              { icon: TrendingUp, label: "Success Rate", value: "94%" },
              { icon: Award, label: "Skill Areas", value: "15+" },
              { icon: Zap, label: "Instant Feedback", value: "Real-time" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <stat.icon className="w-8 h-8 text-blue-300 mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div> */}

          {/* Main Selection Panel */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Choose Your Interview Role</h2>
              <p className="text-blue-200">Select the position you want to practice for</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
                placeholder="Search for roles (e.g., frontend, data scientist)..."
                className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
              />
            </div>

            {/* Role Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Object.entries(apiRoles)
                .filter(([_, role]) =>
                  role.name.toLowerCase().includes(search)
                )
                .map(([key, role]) => (
                  <div
                    key={key}
                    onClick={() => setSelectedRole(key)}
                    className={`group relative overflow-hidden bg-white/10 backdrop-blur-md rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-105 border ${
                      selectedRole === key
                        ? "border-blue-400 ring-2 ring-blue-400/50 bg-white/20"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative">
                      {/* Role Icon */}
                      <div className="text-4xl mb-4"></div>
                      
                      {/* Role Info */}
                      <h3 className="text-xl font-bold text-white mb-2">{role.name}</h3>
                      <p className="text-blue-200 text-sm mb-4">
                        {role.questions.length} Questions • {Math.floor(Math.random() * 20) + 15} mins
                      </p>
                      <p className="text-blue-300/80 text-xs leading-relaxed">
                        {role.questions[0].substring(0, 80)}...
                      </p>

                      {/* Selection Indicator */}
                      {selectedRole === key && (
                        <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}

                      {/* Hover Arrow */}
                      <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                ))}
            </div>

            {/* No Results */}
            {Object.entries(apiRoles).filter(([_, role]) =>
              role.name.toLowerCase().includes(search)
            ).length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-blue-200 text-lg">No roles found for "{search}"</p>
                <p className="text-blue-300 text-sm mt-2">Try searching for frontend, backend, or data scientist</p>
              </div>
            )}

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={startInterview}
                disabled={!selectedRole || isLoading}
                className={`group relative inline-flex items-center gap-3 px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  selectedRole && !isLoading
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Preparing Interview...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Start Interview
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Custom Styles */}
        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 mb-6 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl">
                {/* {getRoleIcon(selectedRole)} */}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {apiRoles[selectedRole]?.name || "Interview"} Interview
                </h1>
                <div className="flex items-center gap-6 text-sm text-blue-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono">{formatTime(timeElapsed)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Question {currentQuestionIndex + 1} of {apiRoles[selectedRole]?.questions?.length || 0}</span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                    isRecording ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isRecording ? "bg-red-400 animate-pulse" : "bg-green-400"}`}></div>
                    {isRecording ? "Recording" : "Ready"}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white border border-white/20"
              >
                {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden md:inline">{isSpeechEnabled ? "Audio On" : "Audio Off"}</span>
              </button>
              <button
                onClick={resetInterview}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white border border-white/20"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden md:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (currentQuestionIndex / (apiRoles[selectedRole]?.questions?.length || 1)) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Chat Interface */}
          <div className="lg:col-span-3 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl">
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto mb-6 space-y-4 custom-scrollbar">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start gap-3 max-w-[85%] ${
                      msg.type === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        msg.type === "user" 
                          ? "bg-gradient-to-r from-blue-500 to-purple-600" 
                          : "bg-gradient-to-r from-green-500 to-teal-600"
                      }`}
                    >
                      {msg.type === "user" ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div
                      className={`relative p-4 rounded-2xl ${
                        msg.type === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-white/20 text-white border border-white/30"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/20 border border-white/30 rounded-2xl p-4 flex items-center gap-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                      ))}
                    </div>
                    <span className="text-sm text-blue-200">AI is analyzing your response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Input Section */}
            <div className="border-t border-white/20 pt-6">
              <div className="mb-4">
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Your answer will appear here as you speak, or you can type directly..."
                  className="w-full p-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm resize-none"
                  rows="4"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isRecording
                      ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                      : "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      Stop Recording
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse ml-2"></div>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Start Recording
                    </>
                  )}
                </button>

                <button
                  onClick={() => speakText(currentQuestion)}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
                >
                  <Play className="w-4 h-4" />
                  Repeat Question
                </button>

                <button
                  onClick={submitAnswer}
                  disabled={!transcript.trim() || isLoading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    transcript.trim() && !isLoading
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Answer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Current Question Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Current Question</h3>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                <p className="text-white leading-relaxed">{currentQuestion}</p>
              </div>
              {isSpeechEnabled && (
                <button
                  onClick={() => speakText(currentQuestion)}
                  className="mt-3 flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors text-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  Listen to question
                </button>
              )}
            </div>

            {/* Interview Tips */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Interview Tips</h3>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { icon: CheckCircle, text: "Use specific examples from your experience", color: "text-green-300" },
                  { icon: CheckCircle, text: "Structure answers with clear points", color: "text-green-300" },
                  { icon: CheckCircle, text: "Ask clarifying questions when needed", color: "text-green-300" },
                  { icon: XCircle, text: "Avoid overly short or vague answers", color: "text-red-300" }
                ].map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/10 rounded-xl border border-white/20">
                    <tip.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tip.color}`} />
                    <span className="text-blue-100">{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress & Stats */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Progress</h3>
              </div>
              
              <div className="space-y-4">
                {/* Questions Progress */}
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-blue-200">Questions Completed</span>
                    <span className="text-white font-mono">
                      {currentQuestionIndex}/{apiRoles[selectedRole]?.questions?.length || 0}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (currentQuestionIndex / (apiRoles[selectedRole]?.questions?.length || 1)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-blue-300">
                    {Math.round((currentQuestionIndex / (apiRoles[selectedRole]?.questions?.length || 1)) * 100)}% Complete
                  </div>
                </div>

                {/* Time Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-3 border border-white/20 text-center">
                    <div className="text-lg font-bold text-white font-mono">{formatTime(timeElapsed)}</div>
                    <div className="text-xs text-blue-200">Total Time</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 border border-white/20 text-center">
                    <div className="text-lg font-bold text-white">
                      {currentQuestionIndex > 0 ? Math.round(timeElapsed / currentQuestionIndex) : 0}s
                    </div>
                    <div className="text-xs text-blue-200">Avg/Question</div>
                  </div>
                </div>

                {/* Recent Feedback */}
                {feedback && (
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-4 border border-green-400/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-white">Latest Score</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{feedback.score}/10</div>
                    <p className="text-xs text-green-200 leading-relaxed">{feedback.strengths}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => speakText(currentQuestion)}
                  className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 text-white border border-white/20"
                >
                  <Play className="w-4 h-4" />
                  <span>Repeat Question</span>
                </button>
                
                <button
                  onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                  className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 text-white border border-white/20"
                >
                  {isSpeechEnabled ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeechEnabled ? "Disable" : "Enable"} Audio</span>
                </button>
                
                <button
                  onClick={() => setTranscript("")}
                  className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 text-white border border-white/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear Answer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default MockInterviewApp;