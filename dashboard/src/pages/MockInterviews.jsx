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

  const recognitionRef = useRef(null);
  const speechSynthRef = useRef(null);
  const timerRef = useRef(null);

  // API base URL
  const API_BASE = "http://localhost:5000/api";

  // Fetch interview roles from API
  const fetchInterviewRoles = async () => {
    try {
      const response = await fetch(`${API_BASE}/mock/roles`);
      const data = await response.json();
      if (data.success) {
        setApiRoles(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch interview roles:", error);
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

    // Fetch interview roles on component mount
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
    if (speechSynthRef.current) {
      // Stop any current speech
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
      // Call API to start interview
      const response = await fetch(`${API_BASE}/mock/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: selectedRole,
          candidateName: "Test User", // You can add a form to collect this
          candidateEmail: null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentInterviewId(data.data.interviewId);
        setCurrentQuestionIndex(0);
        setInterviewStarted(true);
        setConversation([]);
        setTimeElapsed(0);

        const firstQuestion = data.data.firstQuestion;
        setCurrentQuestion(firstQuestion);

        const welcomeMessage = `Hello! I'm your AI interviewer for the ${data.data.role} position. Let's begin with our first question: ${firstQuestion}`;

        setConversation([
          {
            type: "ai",
            content: welcomeMessage,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);

        speakText(welcomeMessage);
      } else {
        console.error("Failed to start interview:", data.message);
        alert("Failed to start interview. Please try again.");
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      alert("Failed to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!transcript.trim() || !currentInterviewId) return;

    const userAnswer = transcript.trim();
    setIsLoading(true);

    // Add user response to conversation
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
      // Call API to submit answer and get AI feedback
      const response = await fetch(`${API_BASE}/mock/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interviewId: currentInterviewId,
          answer: userAnswer,
          questionIndex: currentQuestionIndex,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const {
          feedback,
          nextQuestion,
          nextQuestionIndex,
          isComplete,
          overallScore,
        } = data.data;

        // Create feedback message
        let aiMessage = `Thank you for your answer. Here's my feedback: ${feedback.strengths}`;

        if (feedback.improvements) {
          aiMessage += ` Areas for improvement: ${feedback.improvements}`;
        }

        if (feedback.suggestions) {
          aiMessage += ` Suggestions: ${feedback.suggestions}`;
        }

        aiMessage += ` I'd rate this answer ${feedback.score}/10.`;

        if (nextQuestion) {
          aiMessage += ` Now, let's move to the next question: ${nextQuestion}`;
          setCurrentQuestion(nextQuestion);
          setCurrentQuestionIndex(nextQuestionIndex);
        } else {
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
        speakText(aiMessage);
        setTranscript("");

        // Store feedback for display
        setFeedback(feedback);
      } else {
        console.error("Failed to submit answer:", data.message);
        alert("Failed to submit answer. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Failed to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Optional: Transcribe audio using API
  const transcribeAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      const response = await fetch(`${API_BASE}/mock/transcribe`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setTranscript(data.data.text);
      }
    } catch (error) {
      console.error("Transcription error:", error);
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

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              AI Mock Interview
            </h1>
            <p className="text-lg text-gray-600">
              Practice your interview skills with AI-powered feedback
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Select Your Interview Role
            </h2>

            {/* Role Search & Selection Grid */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Choose Your Role
              </h2>

              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value.toLowerCase())}
                  placeholder="Search for a role (e.g., frontend, data scientist)..."
                  className="w-full px-5 py-3 text-base border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Role Grid */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                {Object.entries(apiRoles)
                  .filter(([_, role]) =>
                    role.name.toLowerCase().includes(search)
                  )
                  .map(([key, role], i) => (
                    <div
                      key={key}
                      onClick={() => setSelectedRole(key)}
                      className={`relative group bg-white/80 border-2 backdrop-blur-md rounded-xl p-5 cursor-pointer hover:shadow-xl transition-all duration-300 ${
                        selectedRole === key
                          ? "border-blue-500 ring-2 ring-blue-300"
                          : "border-transparent hover:border-blue-300"
                      }`}
                    >
                      {/* Icon placeholder */}
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full mb-3">
                        <span className="text-sm font-bold uppercase">
                          {role.name[0]}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {role.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {role.questions.length} Questions
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Example: {role.questions[0].substring(0, 55)}...
                      </p>

                      {/* Selection tick */}
                      {selectedRole === key && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                          ✓
                        </div>
                      )}
                    </div>
                  ))}

                {/* No match fallback */}
                {Object.entries(apiRoles).filter(([_, role]) =>
                  role.name.toLowerCase().includes(search)
                ).length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-4">
                    No roles found for “{search}”
                  </div>
                )}
              </div>
              
            </div>
<br></br>
            <div className="text-center">
              <button
                onClick={startInterview}
                disabled={!selectedRole}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  selectedRole
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Start Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {apiRoles[selectedRole]?.name || "Interview"} Interview
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeElapsed)}</span>
                </div>
                <div>
                  Question {currentQuestionIndex + 1} of{" "}
                  {apiRoles[selectedRole]?.questions?.length || 0}
                </div>
              </div>
            </div>
            <button
              onClick={resetInterview}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start gap-3 max-w-[80%] ${
                      msg.type === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.type === "user" ? "bg-blue-100" : "bg-green-100"
                      }`}
                    >
                      {msg.type === "user" ? (
                        <User className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Bot className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        msg.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white border rounded-lg p-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <span className="text-sm text-gray-600 ml-2">
                      AI is analyzing...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Voice Input Section */}
            <div className="border-t pt-4">
              <div className="mb-4">
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Your answer will appear here as you speak, or you can type directly..."
                  className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isRecording
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </button>

                <button
                  onClick={() => speakText(currentQuestion)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Repeat Question
                </button>

                <button
                  onClick={submitAnswer}
                  disabled={!transcript.trim() || isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    transcript.trim() && !isLoading
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Submit Answer
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Question */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Current Question
              </h3>
              <p className="text-gray-700 leading-relaxed">{currentQuestion}</p>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Interview Tips
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Provide specific examples from your experience</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Structure your answers with clear points</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Ask clarifying questions if needed</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Avoid giving overly short answers</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Progress
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Questions Completed</span>
                    <span>
                      {currentQuestionIndex}/
                      {apiRoles[selectedRole]?.questions?.length || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (currentQuestionIndex /
                            (apiRoles[selectedRole]?.questions?.length || 1)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Duration: {formatTime(timeElapsed)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterviewApp;
