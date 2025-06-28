import React, { useState } from "react";
import {
  User,
  Settings,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  Moon,
  Sun,
  Edit3,
  Camera,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  Star,
  Download,
  Share2,
  Eye,
  EyeOff,
  ChevronRight,
  X
} from "lucide-react";

const UserProfile = ({ isOpen, setIsOpen }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState('public');

  // Mock user data
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    title: "Senior Software Engineer",
    company: "TechCorp Inc.",
    experience: "5+ years",
    education: "MS Computer Science",
    joinDate: "January 2024",
    profileCompletion: 92,
    resumeScore: 85,
    applicationsCount: 47,
    interviewsCount: 12,
    offersCount: 3
  };

  const achievements = [
    { title: "Profile Champion", description: "Complete your profile 100%", progress: 92, max: 100, icon: <User size={16} /> },
    { title: "Application Master", description: "Apply to 50+ positions", progress: 47, max: 50, icon: <Target size={16} /> },
    { title: "Interview Pro", description: "Complete 10+ interviews", progress: 12, max: 10, icon: <Award size={16} /> },
    { title: "Resume Expert", description: "Achieve 90+ resume score", progress: 85, max: 90, icon: <Star size={16} /> }
  ];

  const recentActivity = [
    { action: "Applied to Senior Developer at Apple", time: "2 hours ago", type: "application" },
    { action: "Updated resume with new skills", time: "1 day ago", type: "update" },
    { action: "Completed mock interview", time: "3 days ago", type: "interview" },
    { action: "Received offer from Google", time: "1 week ago", type: "offer" }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'achievements', label: 'Achievements', icon: <Award size={16} /> },
    { id: 'activity', label: 'Activity', icon: <Clock size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Profile Panel */}
      <div className="fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-purple-50/95 via-white/90 to-purple-50/80 backdrop-blur-2xl border-l border-purple-200/50 shadow-[0_20px_70px_rgba(147,51,234,0.15)] z-50 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-200/30">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
            User Profile
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl bg-gradient-to-r from-purple-400 to-indigo-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-purple-200/30 bg-white/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 p-3 text-xs font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-purple-700 border-b-2 border-purple-500 bg-purple-50/60'
                  : 'text-purple-500 hover:text-purple-700 hover:bg-purple-50/40'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              {/* Profile Header */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <User size={40} className="text-white" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg text-white hover:scale-110 transition-transform duration-300">
                    <Camera size={12} />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-purple-800 mt-4">{userData.name}</h3>
                <p className="text-purple-600/70 font-medium">{userData.title}</p>
                <p className="text-purple-500/60 text-sm">{userData.company}</p>
              </div>

              {/* Profile Completion */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100/80 to-indigo-100/60 backdrop-blur-sm border border-purple-200/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-purple-700">Profile Completion</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {userData.profileCompletion}%
                  </span>
                </div>
                <div className="relative w-full bg-purple-200/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 rounded-full shadow-sm transition-all duration-1000 ease-out"
                    style={{ width: `${userData.profileCompletion}%` }}
                  />
                </div>
                <p className="text-xs text-purple-600/70 mt-2">Almost there! Complete your profile to unlock all features.</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100/80 to-emerald-100/60 backdrop-blur-sm border border-green-200/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-green-600" />
                    <span className="text-xs font-semibold text-green-700">Resume Score</span>
                  </div>
                  <div className="text-2xl font-bold text-green-800">{userData.resumeScore}%</div>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100/80 to-cyan-100/60 backdrop-blur-sm border border-blue-200/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700">Applications</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-800">{userData.applicationsCount}</div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-800">Contact Information</h4>
                <div className="space-y-3">
                  {[
                    { icon: <Mail size={16} />, label: "Email", value: userData.email },
                    { icon: <Phone size={16} />, label: "Phone", value: userData.phone },
                    { icon: <MapPin size={16} />, label: "Location", value: userData.location },
                    { icon: <Calendar size={16} />, label: "Joined", value: userData.joinDate }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-purple-200/30">
                      <div className="p-2 rounded-lg bg-purple-100/80 text-purple-600">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-purple-600/70 font-medium">{item.label}</div>
                        <div className="text-sm font-semibold text-purple-800">{item.value}</div>
                      </div>
                      <button className="p-1 text-purple-500 hover:text-purple-700 transition-colors">
                        <Edit3 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
                  <Award size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-purple-800">Your Achievements</h3>
                <p className="text-purple-600/70 text-sm">Track your career progress</p>
              </div>

              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200/30 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-xl ${
                        achievement.progress >= achievement.max 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-800">{achievement.title}</h4>
                        <p className="text-xs text-purple-600/70">{achievement.description}</p>
                      </div>
                      {achievement.progress >= achievement.max && (
                        <CheckCircle size={20} className="text-green-500" />
                      )}
                    </div>
                    <div className="relative w-full bg-purple-200/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${
                          achievement.progress >= achievement.max
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                        }`}
                        style={{ width: `${Math.min((achievement.progress / achievement.max) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-purple-600/70 mt-2">
                      <span>{achievement.progress}/{achievement.max}</span>
                      <span>{Math.round((achievement.progress / achievement.max) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
                  <Clock size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-purple-800">Recent Activity</h3>
                <p className="text-purple-600/70 text-sm">Your latest career actions</p>
              </div>

              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200/30 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl mt-1 ${
                        activity.type === 'offer' ? 'bg-green-100 text-green-600' :
                        activity.type === 'interview' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'application' ? 'bg-purple-100 text-purple-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {activity.type === 'offer' && <CheckCircle size={16} />}
                        {activity.type === 'interview' && <User size={16} />}
                        {activity.type === 'application' && <Target size={16} />}
                        {activity.type === 'update' && <Edit3 size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-purple-800">{activity.action}</p>
                        <p className="text-xs text-purple-600/70">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full p-3 rounded-2xl border-2 border-dashed border-purple-300 text-purple-600 hover:border-purple-400 hover:bg-purple-50/40 transition-all duration-300 font-medium">
                View All Activity
              </button>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
                  <Settings size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-purple-800">Settings</h3>
                <p className="text-purple-600/70 text-sm">Customize your experience</p>
              </div>

              <div className="space-y-4">
                {/* Theme Toggle */}
                <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                        {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                      </div>
                      <div>
                        <div className="font-semibold text-purple-800">Dark Mode</div>
                        <div className="text-xs text-purple-600/70">Toggle dark theme</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                        isDarkMode ? 'bg-purple-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                        isDarkMode ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                        <Bell size={16} />
                      </div>
                      <div>
                        <div className="font-semibold text-purple-800">Notifications</div>
                        <div className="text-xs text-purple-600/70">Enable push notifications</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                        notificationsEnabled ? 'bg-purple-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                        notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Profile Visibility */}
                <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                        {profileVisibility === 'public' ? <Eye size={16} /> : <EyeOff size={16} />}
                      </div>
                      <div>
                        <div className="font-semibold text-purple-800">Profile Visibility</div>
                        <div className="text-xs text-purple-600/70">Control who can see your profile</div>
                      </div>
                    </div>
                    <select
                      value={profileVisibility}
                      onChange={(e) => setProfileVisibility(e.target.value)}
                      className="text-sm bg-purple-50 border border-purple-200 rounded-lg px-3 py-1 text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="contacts">Contacts Only</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  {[
                    { icon: <Download size={16} />, label: "Export Data", color: "blue" },
                    { icon: <Share2 size={16} />, label: "Share Profile", color: "green" },
                    { icon: <HelpCircle size={16} />, label: "Help & Support", color: "purple" },
                    { icon: <Shield size={16} />, label: "Privacy Policy", color: "gray" }
                  ].map((item, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200/30 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-${item.color}-100 text-${item.color}-600`}>
                          {item.icon}
                        </div>
                        <span className="font-semibold text-purple-800">{item.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-purple-500 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default UserProfile;