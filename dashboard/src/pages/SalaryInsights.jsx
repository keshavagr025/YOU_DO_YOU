import React, { useState } from 'react';
import { DollarSign, MapPin, Briefcase, Search, AlertCircle, TrendingUp, Users, Star } from 'lucide-react';

const EnhancedSalaryInsights = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock salary data - replace with your API call
  const getSalaryData = async (jobTitle, experience, location) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock data based on inputs
    const baseSalary = {
      'software engineer': 85000,
      'data scientist': 95000,
      'product manager': 110000,
      'designer': 70000,
      'marketing manager': 75000,
      'frontend developer': 80000,
      'backend developer': 88000,
      'devops engineer': 92000
    };
    
    const experienceMultiplier = {
      'entry': 0.8,
      'mid': 1.0,
      'senior': 1.3,
      'lead': 1.6
    };
    
    const locationMultiplier = {
      'san francisco': 1.4,
      'new york': 1.3,
      'seattle': 1.2,
      'austin': 1.1,
      'chicago': 1.0,
      'remote': 0.95,
      'boston': 1.15,
      'los angeles': 1.2
    };
    
    const job = jobTitle.toLowerCase();
    const exp = experience.toLowerCase();
    const loc = location.toLowerCase();
    
    const base = baseSalary[job] || 75000;
    const expMult = experienceMultiplier[exp] || 1.0;
    const locMult = locationMultiplier[loc] || 1.0;
    
    const avgSalary = Math.round(base * expMult * locMult);
    const minSalary = Math.round(avgSalary * 0.85);
    const maxSalary = Math.round(avgSalary * 1.15);
    
    return {
      jobTitle,
      experience,
      location,
      avgSalary,
      minSalary,
      maxSalary,
      confidence: Math.floor(Math.random() * 20) + 80, // 80-99%
      marketTrend: Math.random() > 0.5 ? 'up' : 'stable'
    };
  };

  const handleSearch = async () => {
    if (!jobTitle.trim()) {
      setError('Please enter a job title');
      return;
    }
    
    if (!experience) {
      setError('Please select experience level');
      return;
    }
    
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const data = await getSalaryData(jobTitle, experience, location);
      setSalaryData(data);
    } catch (err) {
      setError('Failed to fetch salary data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const popularRoles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'Designer'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Salary <span className="text-yellow-300">Insights</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover competitive salary ranges tailored to your experience and location
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-50 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Find Your Market Value</h2>
            <p className="text-gray-600">Enter your details to get personalized salary insights</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Job Title */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Job Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                <Briefcase className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {popularRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setJobTitle(role)}
                    className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Experience Level
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
              >
                <option value="">Select experience</option>
                <option value="entry">🌱 Entry Level (0-2 years)</option>
                <option value="mid">🚀 Mid Level (3-5 years)</option>
                <option value="senior">⭐ Senior Level (6-10 years)</option>
                <option value="lead">👑 Lead/Principal (10+ years)</option>
              </select>
            </div>

            {/* Location */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., San Francisco"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Analyzing market data...</span>
              </>
            ) : (
              <>
                <Search className="h-6 w-6" />
                <span>Get Salary Insights</span>
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 flex items-center space-x-3 animate-fadeIn">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        {salaryData && (
          <div className="space-y-8 animate-fadeIn">
            {/* Main Salary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Average Salary */}
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white bg-opacity-20 rounded-full p-3">
                    <DollarSign className="h-8 w-8" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">Market Average</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">
                    ${salaryData.avgSalary.toLocaleString()}
                  </div>
                  <div className="text-green-100">per year</div>
                </div>
              </div>

              {/* Salary Range */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white bg-opacity-20 rounded-full p-3">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">Salary Range</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">
                    ${salaryData.minSalary.toLocaleString()} - ${salaryData.maxSalary.toLocaleString()}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200">25th percentile</span>
                      <span>${salaryData.minSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200">75th percentile</span>
                      <span>${salaryData.maxSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confidence Score */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white bg-opacity-20 rounded-full p-3">
                    <Star className="h-8 w-8" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">Confidence</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-4xl font-bold">{salaryData.confidence}%</div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${salaryData.confidence}%` }}
                    ></div>
                  </div>
                  <div className="text-purple-100 text-sm">Data reliability score</div>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Position Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Role</div>
                  <div className="text-lg font-semibold text-gray-900">{salaryData.jobTitle}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Experience</div>
                  <div className="text-lg font-semibold text-gray-900 capitalize">
                    {salaryData.experience} Level
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Location</div>
                  <div className="text-lg font-semibold text-gray-900">{salaryData.location}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Market Trend</div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className={`w-5 h-5 ${salaryData.marketTrend === 'up' ? 'text-green-500' : 'text-blue-500'}`} />
                    <span className="text-lg font-semibold text-gray-900 capitalize">
                      {salaryData.marketTrend === 'up' ? 'Growing' : 'Stable'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!salaryData && !loading && !error && (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
              <DollarSign className="h-16 w-16 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to explore salaries?</h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Fill in the form above to get comprehensive salary insights tailored to your role and location
            </p>
          </div>
        )}

        {/* Footer Note */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-100 rounded-2xl p-6 mt-12 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <Users className="h-6 w-6 text-blue-600" />
            <p className="text-gray-700 font-medium text-center">
              💡 Salary estimates are based on comprehensive market data and may vary based on company size, industry, benefits, and other factors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSalaryInsights;