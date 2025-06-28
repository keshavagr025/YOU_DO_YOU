import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import ResumeTracker from "./pages/ResumeTracker";
import RoadmapAI from "./pages/RoadmapAI";
import MockInterviews from "./pages/MockInterviews";
import SalaryPrediction from "./pages/SalaryInsights";
import  Applications  from "./pages/Applications";
import Analytics from "./pages/Analytics";
import Sidebar from "./components/Sidebar";
import ChatBot from './components/ChatBot';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar with global control */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-72" : "ml-20"
        } p-4`}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/Applications" element={<Applications />} />
          <Route path="/resumes" element={<ResumeTracker />} />
          <Route path="/career-roadmap" element={<RoadmapAI />} />
          <Route path="/mock-interviews" element={<MockInterviews />} />
          <Route path="/salary-insights" element={<SalaryPrediction />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>

        <ChatBot/>
      </div>
    </div>
  );
}