import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  UserCheck,
  Calendar,
  Target,
  Bell,
  LogOut,
  Award,
  Menu,
  X,
  BarChart3,
  Users,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { pathname } = useLocation();

  const navItems = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/applications", label: "Applications", icon: <FileText size={20} />, badge: "12" },
    { to: "/career-roadmap", label: "Interviews", icon: <UserCheck size={20} />, badge: "3" },
    { to: "/resumes", label: "ResumeTracker", icon: <Calendar size={20} /> },
    { to: "/salary-insights", label: "SalaryInsights", icon: <Target size={20} /> },
    { to: "/analytics", label: "Analytics", icon: <BarChart3 size={20} /> },
    { to: "/mock-interviews", label: "Mock Interviews", icon: <Users size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full transition-all duration-500 ease-in-out z-40
          ${isOpen ? "w-80 px-6" : "w-20 px-3"}
          bg-gradient-to-b from-purple-50/95 via-white/90 to-purple-50/80
          backdrop-blur-2xl border-r border-purple-200/50 
          shadow-[0_20px_70px_rgba(147,51,234,0.15)]`}
      >
        {/* Top Logo Section with Glassmorphism */}
        <div className="flex items-center justify-between h-20 relative">
          {isOpen ? (
            <div className="flex items-center space-x-4 animate-fade-in">
              <div className="relative">
                {/* <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Briefcase size={22} className="text-white drop-shadow-sm" />
                </div> */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 bg-clip-text text-transparent">
                  CareerTrackr
                </h1>
                <p className="text-xs text-purple-500/70 font-medium">Professional Dashboard</p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <Briefcase size={24} className="text-white" />
              </div>
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
          >
            <div className="group-hover:rotate-180 transition-transform duration-300">
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </div>
          </button>
        </div>

        {/* Navigation Items with Enhanced Styling */}
        <div className="flex flex-col h-[calc(100%-8rem)] overflow-y-auto mt-6 space-y-3">
          <nav className="flex-1 space-y-3">
            {navItems.map((item, index) => {
              const isActive = pathname === item.to;
              return (
                <Link
                  key={index}
                  to={item.to}
                  className={`group relative flex items-center gap-4 p-4 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden
                    ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-2xl border border-purple-400/30"
                        : "text-purple-600/70 hover:text-purple-700 hover:bg-purple-50/60 backdrop-blur-sm"
                    }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 animate-pulse" />
                  )}
                  
                  {/* Icon container */}
                  <div className={`relative p-2.5 rounded-xl shadow-sm transition-all duration-300 z-10
                    ${
                      isActive
                        ? "bg-white/20 backdrop-blur-sm shadow-lg"
                        : "bg-white/80 group-hover:bg-white group-hover:shadow-md"
                    }`}
                  >
                    <div className={`transition-colors duration-300 ${
                      isActive ? "text-white" : "text-purple-600"
                    }`}>
                      {item.icon}
                    </div>
                  </div>

                  {/* Label and Badge */}
                  {isOpen && (
                    <div className="flex items-center justify-between flex-1 z-10">
                      <span className={`font-semibold transition-colors duration-300 ${
                        isActive ? "text-white" : "text-purple-700"
                      }`}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                          isActive
                            ? "bg-white/25 text-white backdrop-blur-sm"
                            : "bg-purple-100 text-purple-600 group-hover:bg-purple-200"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section - Resume Score & Logout */}
        <div className="absolute bottom-4 left-0 w-full px-3">
          {/* Resume Score Card */}
          {/* {isOpen && (
            <div className="mb-4 p-5 rounded-2xl bg-gradient-to-br from-purple-100/80 via-white/60 to-indigo-100/80 backdrop-blur-xl border border-purple-200/50 shadow-xl animate-fade-in">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-sm">
                  <Award size={16} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-purple-700">Resume Score</span>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                85%
              </div>
              <div className="relative w-full bg-purple-200/50 rounded-full h-3 overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 rounded-full shadow-sm transition-all duration-1000 ease-out"
                  style={{ width: "85%" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
              <p className="text-xs text-purple-600/70 mt-2 font-medium">Great progress! 🚀</p>
            </div> */}
          {/* )} */}

          {/* Logout Button */}
          <button
            className={`group flex items-center gap-3 p-4 w-full rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
              ${isOpen ? "justify-start" : "justify-center"}
              text-red-500 hover:text-red-600 hover:bg-red-50/60 backdrop-blur-sm border border-red-200/30 hover:border-red-300/50 hover:shadow-lg`}
          >
            <div className="p-2 rounded-xl bg-red-100/80 group-hover:bg-red-200/80 transition-colors duration-300">
              <LogOut size={18} className="group-hover:scale-110 transition-transform duration-300" />
            </div>
            {isOpen && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
};

export default Sidebar;