import express from 'express';
import Groq from 'groq-sdk';
import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';
import Interview from '../models/Interview.js';

const router = express.Router();

// Initialize Groq (Free ChatGPT alternative)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Get free key from console.groq.com
});

// Multer for audio file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

// Interview roles configuration
// Interview roles configuration
const INTERVIEW_ROLES = {
  frontend: {
    name: 'Frontend Developer',
    questions: [
      "Tell me about your experience with React and its ecosystem.",
      "How do you handle state management in large applications?",
      "Explain the difference between controlled and uncontrolled components.",
      "How do you optimize React application performance?",
      "What's your approach to responsive design and CSS?"
    ]
  },
  backend: {
    name: 'Backend Developer',
    questions: [
      "Explain your experience with Node.js and Express.js.",
      "How do you handle database optimization and queries?",
      "Describe your approach to API design and RESTful services.",
      "How do you implement authentication and authorization?",
      "What's your experience with microservices architecture?"
    ]
  },
  fullstack: {
    name: 'Full Stack Developer',
    questions: [
      "Walk me through building a complete web application from scratch.",
      "How do you manage data flow between frontend and backend?",
      "Explain your approach to testing across the full stack.",
      "How do you handle deployment and DevOps processes?",
      "Describe a challenging technical problem you solved recently."
    ]
  },
  devops: {
    name: 'DevOps Engineer',
    questions: [
      "Explain the CI/CD pipeline you’ve worked with.",
      "How do you ensure application scalability and high availability?",
      "What tools do you use for infrastructure as code?",
      "How do you monitor application performance and availability?",
      "Describe how you handle system outages and rollback procedures."
    ]
  },
  dataScientist: {
    name: 'Data Scientist',
    questions: [
      "Describe your process for building a machine learning model.",
      "What’s the difference between supervised and unsupervised learning?",
      "How do you handle missing or imbalanced data?",
      "Which tools/libraries do you use for data visualization?",
      "Explain a data science project you’re particularly proud of."
    ]
  },
  mobile: {
    name: 'Mobile App Developer',
    questions: [
      "What’s your experience with Flutter or React Native?",
      "How do you manage performance optimization on mobile devices?",
      "Explain the app deployment process for iOS and Android.",
      "How do you handle offline data and sync scenarios?",
      "Describe your approach to secure mobile app development."
    ]
  },
  uiux: {
    name: 'UI/UX Designer',
    questions: [
      "How do you balance user needs with business goals in design?",
      "Walk me through your design process.",
      "What tools do you use for wireframing and prototyping?",
      "How do you gather and incorporate user feedback?",
      "Describe a successful project where your design impacted user engagement."
    ]
  },
  cybersecurity: {
    name: 'Cybersecurity Analyst',
    questions: [
      "How do you detect and prevent common cyber threats?",
      "Explain the difference between symmetric and asymmetric encryption.",
      "What’s your experience with incident response?",
      "How do you stay updated with evolving cybersecurity threats?",
      "Describe a time when you identified and mitigated a major vulnerability."
    ]
  }
};


// Get available interview roles
router.get('/roles', (req, res) => {
  try {
    res.json({
      success: true,
      data: INTERVIEW_ROLES
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview roles'
    });
  }
});

// Start new interview session
router.post('/start', async (req, res) => {
  try {
    const { role, candidateName, candidateEmail } = req.body;

    if (!role || !INTERVIEW_ROLES[role]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid interview role'
      });
    }

    const interview = new Interview({
      role,
      candidateName: candidateName || 'Anonymous',
      candidateEmail: candidateEmail || null,
      questions: INTERVIEW_ROLES[role].questions,
      status: 'in_progress'
    });

    await interview.save();

    // Get first question
    const firstQuestion = INTERVIEW_ROLES[role].questions[0];

    res.json({
      success: true,
      data: {
        interviewId: interview._id,
        role: INTERVIEW_ROLES[role].name,
        firstQuestion,
        totalQuestions: INTERVIEW_ROLES[role].questions.length
      }
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start interview'
    });
  }
});

// Submit answer and get feedback (Using Groq instead of OpenAI)
router.post('/answer', async (req, res) => {
  try {
    const { interviewId, answer, questionIndex } = req.body;

    if (!interviewId || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Interview ID and answer are required'
      });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Get current question
    const currentQuestion = interview.questions[questionIndex];

    // Generate AI feedback using Groq (FREE!)
    const feedbackPrompt = `
You are an experienced technical interviewer. Analyze this interview answer and provide constructive feedback.

Question: ${currentQuestion}
Answer: ${answer}
Role: ${interview.role}

Please provide feedback in exactly this JSON format:
{
  "score": [number from 1-10],
  "strengths": "[what was good about the answer]",
  "improvements": "[areas that need improvement]",
  "suggestions": "[specific suggestions for better answers]"
}

Be professional, constructive, and encouraging.`;

    let feedback;
    try {
      const aiResponse = await groq.chat.completions.create({
        model: "llama3-8b-8192", // Fast and free model
        messages: [
          {
            role: "system",
            content: "You are an experienced technical interviewer providing constructive feedback. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: feedbackPrompt
          }
        ],
        max_tokens: 400,
        temperature: 0.7,
      });

      // Try to parse JSON response
      const content = aiResponse.choices[0].message.content.trim();
      // Extract JSON if it's wrapped in markdown
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      
      feedback = JSON.parse(jsonString);
      
      // Validate feedback structure
      if (!feedback.score || !feedback.strengths || !feedback.improvements || !feedback.suggestions) {
        throw new Error('Invalid feedback format');
      }
      
    } catch (parseError) {
      console.error('AI feedback parsing error:', parseError);
      // Fallback feedback if AI fails
      feedback = {
        score: 7,
        strengths: "Good technical understanding demonstrated in your response.",
        improvements: "Could provide more specific examples and deeper technical details.",
        suggestions: "Consider adding concrete examples from your experience and explaining your thought process step by step."
      };
    }

    // Save answer and feedback
    interview.answers.push({
      questionIndex,
      question: currentQuestion,
      answer,
      feedback,
      timestamp: new Date()
    });

    // Check if interview is complete
    const nextQuestionIndex = questionIndex + 1;
    const isComplete = nextQuestionIndex >= interview.questions.length;

    if (isComplete) {
      interview.status = 'completed';
      interview.completedAt = new Date();
      
      // Calculate overall score
      const totalScore = interview.answers.reduce((sum, ans) => sum + ans.feedback.score, 0);
      interview.overallScore = Math.round(totalScore / interview.answers.length);
    }

    await interview.save();

    const response = {
      success: true,
      data: {
        feedback,
        nextQuestion: isComplete ? null : interview.questions[nextQuestionIndex],
        nextQuestionIndex: isComplete ? null : nextQuestionIndex,
        isComplete,
        overallScore: isComplete ? interview.overallScore : null
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Answer submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process answer'
    });
  }
});

// Transcribe audio to text (Using AssemblyAI - Free Alternative)
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Audio file is required'
      });
    }

    // Option 1: AssemblyAI (Free tier: 5 hours/month)
    if (process.env.ASSEMBLYAI_API_KEY) {
      try {
        // Upload audio file
        const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
          method: 'POST',
          headers: {
            'Authorization': process.env.ASSEMBLYAI_API_KEY,
            'Content-Type': 'application/octet-stream',
          },
          body: req.file.buffer
        });
        
        const uploadData = await uploadResponse.json();
        
        // Request transcription
        const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
          method: 'POST',
          headers: {
            'Authorization': process.env.ASSEMBLYAI_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audio_url: uploadData.upload_url,
            language_code: 'en'
          })
        });
        
        const transcript = await transcriptResponse.json();
        
        // Poll for completion (simplified - you might want to implement proper polling)
        let result = transcript;
        while (result.status !== 'completed' && result.status !== 'error') {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${result.id}`, {
            headers: { 'Authorization': process.env.ASSEMBLYAI_API_KEY }
          });
          result = await statusResponse.json();
        }
        
        if (result.status === 'completed') {
          return res.json({
            success: true,
            data: { text: result.text }
          });
        }
      } catch (assemblyError) {
        console.error('AssemblyAI transcription error:', assemblyError);
      }
    }

    // Option 2: Browser Web Speech API (Fallback - client-side only)
    // Return instructions for client-side implementation
    res.json({
      success: false,
      message: 'Server-side transcription not available. Please use browser speech recognition.',
      fallback: 'web_speech_api'
    });

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to transcribe audio'
    });
  }
});

// Alternative: Simple text-to-speech endpoint (optional)
router.post('/speak', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    // Return text for client-side speech synthesis
    res.json({
      success: true,
      data: {
        text: text,
        instruction: 'Use browser Speech Synthesis API'
      }
    });

  } catch (error) {
    console.error('Speech error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process speech request'
    });
  }
});

// Get interview results
router.get('/results/:interviewId', async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.interviewId);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.json({
      success: true,
      data: {
        interviewId: interview._id,
        role: interview.role,
        candidateName: interview.candidateName,
        status: interview.status,
        overallScore: interview.overallScore,
        duration: interview.completedAt ? 
          Math.round((interview.completedAt - interview.createdAt) / 1000 / 60) : null,
        answers: interview.answers,
        createdAt: interview.createdAt,
        completedAt: interview.completedAt
      }
    });

  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview results'
    });
  }
});

// Get interview history
router.get('/history', async (req, res) => {
  try {
    const interviews = await Interview.find()
      .select('role candidateName status overallScore createdAt completedAt')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: interviews
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview history'
    });
  }
});

export default router;