# ReadyBoss: AI-Powered Career Platform

ReadyBoss is a full-stack platform designed to supercharge your job search and career growth with AI. It combines resume analysis, job tracking, salary insights, personalized learning roadmaps, and mock interviews—all in one seamless experience.

---

## 🚀 Features

### 1. **AI Resume Analysis**
- Instantly evaluate your resume using advanced AI models.
- Get ATS (Applicant Tracking System) scores, keyword matches, and actionable suggestions.
- Receive tips to optimize formatting, clarity, and impact.

### 2. **Smart Keyword Extraction**
- Extracts the most important keywords from job descriptions.
- Checks your resume for alignment and helps you bypass keyword-based filters.

### 3. **Semantic Matching**
- Goes beyond keywords to understand the context and meaning of your experience.
- Increases your chances of getting shortlisted for relevant roles.

### 4. **Resume Parsing**
- Automatically extracts and structures your resume into clean, machine-readable sections.
- Identifies job roles, durations, skills, achievements, and more.

### 5. **Intelligent Suggestions**
- AI-powered tips for rewriting bullet points, adding missing sections, and improving your resume.
- Personalized feedback for every job you apply to.

### 6. **Job Application Tracker**
- Track all your job applications, statuses, and interview progress in one dashboard.
- Visualize your application trends and outcomes.

### 7. **Salary Insights**
- Get real-time salary estimates and job market data using RapidAPI.
- Explore salary ranges by role, location, and experience.

### 8. **Personalized Learning Roadmaps**
- Generate AI-powered learning paths tailored to your target tech roles.
- Curated resources from YouTube, Udemy, and more.
- Track your progress and skill mastery.

### 9. **Mock Interviews**
- Practice technical interviews with AI-generated questions and instant feedback.
- Covers multiple roles: Frontend, Backend, Full Stack, Data Science, DevOps, UI/UX, and more.

### 10. **Analytics Dashboard**
- Visualize your job search progress, skill trends, and resume performance.
- Get insights into your strengths and areas for improvement.

### 11. **Real-Time Notifications**
- Stay updated with application status changes and new job postings.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Lucide Icons
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **AI/ML:** OpenAI, Cohere, Google Gemini, Groq, AssemblyAI
- **APIs:** RapidAPI (JSearch), YouTube Data API, Udemy/Coursera (optional)
- **Authentication:** JWT-based (bcryptjs, jsonwebtoken)
- **File Uploads:** Multer, PDF/DOCX parsing (pdf-parse, mammoth)
- **Real-Time:** Socket.io

---

## 📁 Project Structure

```
README.md
backend/
  .env
  index.js
  package.json
  config/
  controllers/
  middleware/
  models/
  routes/
  test/
  uploads/
  utils/
dashboard/
  index.html
  package.json
  tailwind.config.js
  vite.config.js
  public/
  src/
frontend/
  index.html
  package.json
  tailwind.config.js
  vite.config.js
  public/
  src/
```

---

## ⚡ Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/readyboss.git
cd readyboss
```

### 2. Backend Setup

```sh
cd backend
npm install
# Copy .env.example to .env and fill in your keys
npm start
```

- The backend runs on `http://localhost:5000`

### 3. Dashboard Frontend Setup

```sh
cd dashboard
npm install
npm run dev
```

- The dashboard runs on `http://localhost:5173`

### 4. Landing Page Frontend Setup

```sh
cd frontend
npm install
npm run dev
```

- The landing page runs on `http://localhost:5174`

---

## 🔑 Environment Variables

See `backend/.env` for all required keys:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret for authentication
- `OPENAI_API_KEY`, `COHERE_API_KEY`, `GEMINI_API_KEY`, etc.
- `RAPIDAPI_KEY` - For job/salary APIs
- `YOUTUBE_API_KEY` - For learning resources

---

## 📚 API Endpoints

- **Auth:** `/api/auth/signup`, `/api/auth/login`
- **Resumes:** `/api/resumes/upload`, `/api/resumes/:id/analyze/:jobRoleId`
- **Jobs:** `/api/jobs`, `/api/salary/estimate`, `/api/salary/search`
- **Learning:** `/api/learning/generate-roadmap`
- **Analytics:** `/api/analytics/dashboard`
- **Mock Interviews:** `/api/mock/generate-question`, `/api/mock/evaluate-answer`

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## Photos 
![alt text](<Screenshot 2025-06-29 005527.png>) ![alt text](<Screenshot 2025-06-29 005559.png>) ![alt text](<Screenshot 2025-06-29 005631.png>) ![alt text](<Screenshot 2025-06-29 005700.png>)
![alt text](<Screenshot 2025-06-29 005723.png>) ![alt text](<Screenshot 2025-06-29 005747.png>) ![alt text](<Screenshot 2025-06-29 005818.png>) ![alt text](<Screenshot 2025-06-29 005844.png>) ![alt text](<Screenshot 2025-06-29 005913.png>)

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [OpenAI](https://openai.com/)
- [Cohere](https://cohere.com/)
- [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch/)
- [Socket.io](https://socket.io/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)