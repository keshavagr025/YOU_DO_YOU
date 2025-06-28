import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, CheckCircle, AlertCircle, Star, Zap, Users, TrendingUp } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.message || "Login failed" });
      } else {
        // Store user and token in localStorage (Note: In real app, consider more secure storage)
        if (typeof window !== 'undefined') {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
        }

        // Success feedback
        alert("Welcome back! Login successful!");
        
        // Redirect to dashboard
        window.location.href = "http://localhost:5174";
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: "Network error. Please check your connection and try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@resumetracker.com',
      password: 'demo123'
    });
    setErrors({});
  };

  const handleForgotPassword = () => {
    // In real app, this would open a modal or redirect to reset password page
    alert('Password reset functionality will be implemented soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative w-full max-w-6xl flex items-center justify-center">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/3 items-center justify-center p-8">
          <div className="max-w-lg">
            <div className="mb-8">
              <h1 className="text-4xl xl:text-5xl font-bold text-gray-800 mb-4">
                Welcome Back to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block">
                  ResumeTracker
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Continue your journey to landing your dream job. Track applications, manage resumes, and get hired faster.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[
                { icon: Users, number: "50K+", label: "Active Users" },
                { icon: TrendingUp, number: "85%", label: "Success Rate" },
                { icon: Zap, number: "10x", label: "Faster Hiring" }
              ].map(({ icon: Icon, number, label }, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{number}</div>
                  <div className="text-sm text-gray-600">{label}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                "Track all your job applications in one place",
                "AI-powered resume optimization suggestions",
                "Interview scheduling and preparation tools",
                "Real-time application status updates"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 xl:w-1/3 max-w-md">
          {/* Trust Indicators */}
          <div className="text-center mb-6 space-y-2">
            <div className="flex justify-center items-center space-x-1 text-yellow-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Rated <span className="font-semibold">4.9/5</span> by our users
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Welcome Back
                </h2>
                <p className="text-blue-100 text-sm">
                  Sign in to continue your job search journey
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="px-8 py-6">
              <div className="space-y-5">
                {/* Email Field */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email address"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50/50 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-gray-50/50 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.submit}</span>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Demo Login */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors duration-200"
                >
                  Try Demo Account
                </button>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-blue-800 font-medium">Secure Login</p>
                    <p className="text-blue-700">Your data is encrypted and protected with industry-standard security.</p>
                  </div>
                </div>
              </div>

              {/* Signup Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => window.location.href = "/signup"}
                    className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
                  >
                    Create one here
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">Trusted by professionals at</p>
            <div className="flex justify-center items-center space-x-6 opacity-60">
              <span className="text-sm font-semibold text-gray-600">Google</span>
              <span className="text-sm font-semibold text-gray-600">Microsoft</span>
              <span className="text-sm font-semibold text-gray-600">Amazon</span>
              <span className="text-sm font-semibold text-gray-600">Netflix</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
