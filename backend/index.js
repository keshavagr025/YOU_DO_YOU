// backend/server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import path from 'path';
import multer from 'multer';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Message from './models/Message.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

console.log("OpenAI API Key loaded:", process.env.OPENAI_API_KEY ? "✅ Yes" : "❌ No");
console.log("YouTube API Key loaded:", process.env.YOUTUBE_API_KEY ? "✅ Yes" : "❌ No");

// Required to simulate __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🧠 MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resume_analytics', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// 📦 Middlewares
app.use(cors({
  origin:  ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (e.g., uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🧩 Routes (must be using ES Module exports too)
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoleRoutes from './routes/jobRoleRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import salaryRoutes from './routes/salaryRoutes.js'; 
import mockInterviewRoutes from './routes/mockInterviewRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import jobs from './routes/jobs.js';
import ChatRoute from './routes/ChatRoute.js';

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/job-roles', jobRoleRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/mock', mockInterviewRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/jobs', jobs);
app.use('/api/ai', ChatRoute);

// 🏥 Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Resume Analytics API is running' });
});

// ❌ Not Found handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Not Found' });
});

// 🧯 Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

async function generateAIReply(message) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.log("❌ OPENROUTER_API_KEY is missing.");
      return "⚠️ Server is missing OpenRouter API key.";
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();
    console.log("✅ OpenRouter Response:", data);

    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    } else {
      return '❗ Sorry, no valid reply from AI.';
    }

  } catch (err) {
    console.error('❌ Error calling OpenRouter:', err);
    return '⚠️ Oops! Failed to contact OpenRouter.';
  }
}




// 🔌 Setup socket.io
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('user_message', async (userMessage) => {
  
    const aiReply = await generateAIReply(userMessage);
    console.log('📩 Received from user:', userMessage);
  await Message.create({
    user: socket.id,
    prompt: userMessage,
    aiReply,
  });

  socket.emit('bot reply', aiReply);
});

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// 🚀 Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
