import React, { useState } from 'react';
import { DollarSign, MapPin, Briefcase, Search, AlertCircle } from 'lucide-react';

const SimpleSalaryInsights = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock salary data - replace with your API call
  const getSalaryData = async (jobTitle, experience, location) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data based on inputs
    const baseSalary = {
      'software engineer': 85000,
      'data scientist': 95000,
      'product manager': 110000,
      'designer': 70000,
      'marketing manager': 75000
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
      'remote': 0.95
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
      maxSalary
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Salary Insights</h1>
        <p className="text-gray-600">Get salary estimates based on job title, experience, and location</p>
      </div>

      {/* Search Form */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              placeholder="e.g., Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select experience</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (3-5 years)</option>
              <option value="senior">Senior Level (6-10 years)</option>
              <option value="lead">Lead/Principal (10+ years)</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g., San Francisco"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Get Salary Insights</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Results */}
      {salaryData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Average Salary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <DollarSign className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Average Salary</h3>
            </div>
            <p className="text-3xl font-bold text-green-900">
              ${salaryData.avgSalary.toLocaleString()}
            </p>
            <p className="text-sm text-green-700 mt-1">per year</p>
          </div>

          {/* Salary Range */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Briefcase className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">Salary Range</h3>
            </div>
            <p className="text-lg font-bold text-blue-900">
              ${salaryData.minSalary.toLocaleString()} - ${salaryData.maxSalary.toLocaleString()}
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-blue-700">Min: ${salaryData.minSalary.toLocaleString()}</p>
              <p className="text-sm text-blue-700">Max: ${salaryData.maxSalary.toLocaleString()}</p>
            </div>
          </div>

          {/* Location & Experience */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <MapPin className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-800">Details</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-purple-700">
                <span className="font-medium">Location:</span> {salaryData.location}
              </p>
              <p className="text-sm text-purple-700">
                <span className="font-medium">Experience:</span> {salaryData.experience.charAt(0).toUpperCase() + salaryData.experience.slice(1)} Level
              </p>
              <p className="text-sm text-purple-700">
                <span className="font-medium">Role:</span> {salaryData.jobTitle}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!salaryData && !loading && !error && (
        <div className="text-center py-12">
          <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to explore salaries?</h3>
          <p className="text-gray-500">Fill in the form above to get salary insights for any role</p>
        </div>
      )}

      {/* Footer Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-gray-600 text-center">
          💡 Salary estimates are based on market data and may vary based on company size, industry, and other factors
        </p>
      </div>
    </div>
  );
};

export default SimpleSalaryInsights;
