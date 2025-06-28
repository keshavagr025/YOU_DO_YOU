import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Briefcase,
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
import UserProfile from './UserProfile';


const Sidebar = ({ isOpen, setIsOpen }) => {
  const { pathname } = useLocation();

  const navItems = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={15} /> },
    { to: "/applications", label: "Applications", icon: <FileText size={15} /> },
    { to: "/career-roadmap", label: "Roadmap", icon: <UserCheck size={15} /> },
    { to: "/salary-insights", label: "SalaryInsights", icon: <Target size={15} /> },
    { to: "/mock-interviews", label: "Mock Interviews", icon: <Users size={15} /> },
    { to: "/analytics", label: "Analytics", icon: <BarChart3 size={15} /> },
  
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
  className={`fixed top-0 left-0 h-full overflow-y-auto transition-all duration-500 ease-in-out z-40
    ${isOpen ? "w-80 px-6" : "w-20 px-3"}
    bg-gradient-to-b from-purple-50/95 via-white/90 to-purple-50/80
    backdrop-blur-2xl border-r border-purple-200/50 
    shadow-[0_20px_70px_rgba(147,51,234,0.15)]`}
>
<UserProfile isOpen={isOpen} />
        {/* Top Logo Section with Glassmorphism */}
        <div className="flex items-center justify-between h-20 relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
          >
            <div className="group-hover:rotate-180 transition-transform duration-300">
              {isOpen ? <X size={18} /> : <Menu size={15} />}
            </div>
          </button>
        </div>

        {/* Navigation Items with Enhanced Styling */}
        <div className="flex flex-col overflow-y-auto mt-6 space-y-3">
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
          {/* Logout Button */}
         
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