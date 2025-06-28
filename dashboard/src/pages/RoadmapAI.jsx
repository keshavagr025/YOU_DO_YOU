import React, { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, Video, Trophy, Clock, Star, Zap, Code, Brain, Database, Globe, Smartphone, Palette, BarChart } from 'lucide-react';

const LearningRoadmapGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    name: '',
    currentLevel: '',
    targetRole: '',
    timeCommitment: '',
    learningStyle: '',
    budget: ''
  });
  const [roadmap, setRoadmap] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const roles = [
    { id: 'fullstack', name: 'Full Stack Developer', icon: Code, color: 'from-blue-500 to-purple-600' },
    { id: 'ai-engineer', name: 'AI Engineer', icon: Brain, color: 'from-green-500 to-blue-500' },
    { id: 'data-scientist', name: 'Data Scientist', icon: BarChart, color: 'from-purple-500 to-pink-500' },
    { id: 'mobile-dev', name: 'Mobile Developer', icon: Smartphone, color: 'from-orange-500 to-red-500' },
    { id: 'devops', name: 'DevOps Engineer', icon: Database, color: 'from-teal-500 to-cyan-500' },
    { id: 'ui-ux', name: 'UI/UX Designer', icon: Palette, color: 'from-pink-500 to-rose-500' }
  ];

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];
  const timeCommitments = ['1-2 hours/day', '3-4 hours/day', '5+ hours/day'];
  const learningStyles = ['Visual (Videos)', 'Reading (Documentation)', 'Hands-on (Projects)', 'Mixed'];
  const budgets = ['Free only', 'Under $50/month', 'Under $100/month', 'No budget limit'];

  const generateRoadmap = () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const roadmapData = {
        'fullstack': {
          title: 'Full Stack Developer Roadmap',
          duration: '4-6 months',
          phases: [
            {
              name: 'Frontend Fundamentals',
              duration: '4-6 weeks',
              skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Responsive Design'],
              resources: [
                { type: 'youtube', name: 'FreeCodeCamp HTML/CSS', url: 'youtube.com/freecodecamp', rating: 4.9 },
                { type: 'course', name: 'JavaScript Complete Course', price: 'Free', rating: 4.8 },
                { type: 'project', name: 'Build Portfolio Website', difficulty: 'Beginner' }
              ]
            },
            {
              name: 'React Mastery',
              duration: '3-4 weeks',
              skills: ['React Hooks', 'State Management', 'Component Design', 'React Router'],
              resources: [
                { type: 'youtube', name: 'React Official Tutorial', url: 'react.dev', rating: 4.9 },
                { type: 'course', name: 'React - The Complete Guide', price: '$49', rating: 4.7 },
                { type: 'project', name: 'Todo App with React', difficulty: 'Intermediate' }
              ]
            },
            {
              name: 'Backend Development',
              duration: '4-5 weeks',
              skills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
              resources: [
                { type: 'youtube', name: 'Node.js Crash Course', url: 'youtube.com/traversymedia', rating: 4.8 },
                { type: 'course', name: 'The Complete Node.js Course', price: '$59', rating: 4.6 },
                { type: 'project', name: 'Full Stack CRUD App', difficulty: 'Advanced' }
              ]
            }
          ]
        },
        'ai-engineer': {
          title: 'AI Engineer Roadmap',
          duration: '6-8 months',
          phases: [
            {
              name: 'Python & Math Foundations',
              duration: '3-4 weeks',
              skills: ['Python Programming', 'Linear Algebra', 'Statistics', 'NumPy/Pandas'],
              resources: [
                { type: 'youtube', name: 'Python for AI - FreeCodeCamp', url: 'youtube.com/freecodecamp', rating: 4.9 },
                { type: 'course', name: 'Mathematics for ML', price: 'Free (Coursera)', rating: 4.8 },
                { type: 'project', name: 'Data Analysis Project', difficulty: 'Beginner' }
              ]
            },
            {
              name: 'Machine Learning',
              duration: '6-8 weeks',
              skills: ['Scikit-learn', 'Supervised Learning', 'Unsupervised Learning', 'Model Evaluation'],
              resources: [
                { type: 'youtube', name: 'Machine Learning Course - Stanford', url: 'youtube.com/stanfordonline', rating: 4.9 },
                { type: 'course', name: 'ML Specialization - Andrew Ng', price: '$49/month', rating: 4.9 },
                { type: 'project', name: 'Prediction Model', difficulty: 'Intermediate' }
              ]
            },
            {
              name: 'Deep Learning & Neural Networks',
              duration: '8-10 weeks',
              skills: ['TensorFlow', 'PyTorch', 'CNN', 'RNN', 'Transformers'],
              resources: [
                { type: 'youtube', name: 'Deep Learning Specialization', url: 'youtube.com/deeplearningai', rating: 4.8 },
                { type: 'course', name: 'PyTorch Complete Course', price: '$79', rating: 4.7 },
                { type: 'project', name: 'Computer Vision App', difficulty: 'Advanced' }
              ]
            }
          ]
        }
      };

      setRoadmap(roadmapData[userProfile.targetRole] || roadmapData['fullstack']);
      setIsGenerating(false);
    }, 2000);
  };

  const steps = [
    { title: 'Personal Info', icon: '👤' },
    { title: 'Skill Assessment', icon: '📊' },
    { title: 'Career Goal', icon: '🎯' },
    { title: 'Preferences', icon: '⚙️' },
    { title: 'Roadmap', icon: '🗺️' }
  ];

  const renderStepContent = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Let's Get Started! 🚀
              </h2>
              <p className="text-gray-600">Tell us about yourself to create your personalized learning journey</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What's your name?</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={userProfile.name}
                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Skill Assessment 📊
              </h2>
              <p className="text-gray-600">Help us understand your current programming level</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Current Programming Level</label>
              <div className="grid grid-cols-1 gap-3">
                {skillLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setUserProfile({...userProfile, currentLevel: level})}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      userProfile.currentLevel === level
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        {level === 'Beginner' && '🌱'}
                        {level === 'Intermediate' && '🌿'}
                        {level === 'Advanced' && '🌳'}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{level}</div>
                        <div className="text-sm text-gray-500">
                          {level === 'Beginner' && 'New to programming'}
                          {level === 'Intermediate' && 'Some experience with coding'}
                          {level === 'Advanced' && 'Experienced developer'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Choose Your Dream Role 🎯
              </h2>
              <p className="text-gray-600">Select the career path you want to pursue</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => {
                const IconComponent = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setUserProfile({...userProfile, targetRole: role.id})}
                    className={`p-6 border-2 rounded-xl transition-all ${
                      userProfile.targetRole === role.id
                        ? 'border-transparent bg-gradient-to-r ' + role.color + ' text-white transform scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center">
                      <IconComponent size={24} className="mr-3" />
                      <span className="font-medium">{role.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
                Learning Preferences ⚙️
              </h2>
              <p className="text-gray-600">Customize your learning experience</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Time Commitment</label>
                <div className="grid grid-cols-1 gap-2">
                  {timeCommitments.map((time) => (
                    <button
                      key={time}
                      onClick={() => setUserProfile({...userProfile, timeCommitment: time})}
                      className={`p-3 border rounded-lg transition-all ${
                        userProfile.timeCommitment === time
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <Clock size={16} className="inline mr-2" />
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Learning Style</label>
                <div className="grid grid-cols-1 gap-2">
                  {learningStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => setUserProfile({...userProfile, learningStyle: style})}
                      className={`p-3 border rounded-lg transition-all ${
                        userProfile.learningStyle === style
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Budget</label>
                <div className="grid grid-cols-1 gap-2">
                  {budgets.map((budget) => (
                    <button
                      key={budget}
                      onClick={() => setUserProfile({...userProfile, budget: budget})}
                      className={`p-3 border rounded-lg transition-all ${
                        userProfile.budget === budget
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {!roadmap ? (
              <div className="text-center space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Generate Your Roadmap 🗺️
                  </h2>
                  <p className="text-gray-600">AI is analyzing your profile to create the perfect learning path</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-lg mb-4">Your Profile Summary:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Name:</span>
                      <span>{userProfile.name || 'Not set'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Level:</span>
                      <span>{userProfile.currentLevel || 'Not set'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Goal:</span>
                      <span>{roles.find(r => r.id === userProfile.targetRole)?.name || 'Not set'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Time:</span>
                      <span>{userProfile.timeCommitment || 'Not set'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={generateRoadmap}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2">⚡</div>
                      AI is generating your roadmap...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Zap className="mr-2" size={20} />
                      Generate AI Roadmap
                    </div>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                    Your Personalized Roadmap! 🎉
                  </h2>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold">{roadmap.title}</h3>
                    <p className="text-gray-600">Estimated completion: {roadmap.duration}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {roadmap.phases.map((phase, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="flex items-center mb-4">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{phase.name}</h3>
                          <p className="text-gray-600">{phase.duration}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Skills to Master:</h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.skills.map((skill, skillIndex) => (
                            <span key={skillIndex} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Recommended Resources:</h4>
                        <div className="space-y-3">
                          {phase.resources.map((resource, resourceIndex) => (
                            <div key={resourceIndex} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center">
                                {resource.type === 'youtube' && <Video className="text-red-500 mr-2" size={16} />}
                                {resource.type === 'course' && <BookOpen className="text-blue-500 mr-2" size={16} />}
                                {resource.type === 'project' && <Trophy className="text-yellow-500 mr-2" size={16} />}
                                <div>
                                  <div className="font-medium">{resource.name}</div>
                                  {resource.price && <div className="text-sm text-gray-600">{resource.price}</div>}
                                  {resource.difficulty && <div className="text-sm text-gray-600">Difficulty: {resource.difficulty}</div>}
                                </div>
                              </div>
                              {resource.rating && (
                                <div className="flex items-center">
                                  <Star className="text-yellow-400 mr-1" size={14} />
                                  <span className="text-sm">{resource.rating}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => {
                      setCurrentStep(0);
                      setRoadmap(null);
                      setUserProfile({
                        name: '',
                        currentLevel: '',
                        targetRole: '',
                        timeCommitment: '',
                        learningStyle: '',
                        budget: ''
                      });
                    }}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 transition-all"
                  >
                    Create New Roadmap
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch(currentStep) {
      case 0: return userProfile.name.trim() !== '';
      case 1: return userProfile.currentLevel !== '';
      case 2: return userProfile.targetRole !== '';
      case 3: return userProfile.timeCommitment !== '' && userProfile.learningStyle !== '' && userProfile.budget !== '';
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            AI Learning Roadmap
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized learning paths powered by AI to achieve your dream tech career
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <span className="text-lg">{step.icon}</span>
                </div>
                <div className="ml-3 hidden md:block">
                  <div className={`font-medium ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 rounded ${
                    index < currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="flex justify-between max-w-4xl mx-auto">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                disabled={!canProceed()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <ChevronRight className="ml-2" size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningRoadmapGenerator;
