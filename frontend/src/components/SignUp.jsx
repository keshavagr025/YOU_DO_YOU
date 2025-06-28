import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, AlertCircle, ArrowRight, Shield, Star } from "lucide-react";

const SignUp = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validatePassword = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Update password strength
    if (name === "password") {
      setPasswordStrength(validatePassword(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.message || "Signup failed" });
      } else {
        // Success - show success message and redirect
        alert("Account created successfully! Welcome to ResumeTracker!");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  const formFields = [
    { 
      label: "Full Name", 
      name: "name", 
      type: "text", 
      placeholder: "Enter your full name",
      icon: User
    },
    { 
      label: "Email Address", 
      name: "email", 
      type: "email", 
      placeholder: "Enter your email address",
      icon: Mail
    },
    { 
      label: "Password", 
      name: "password", 
      type: showPassword ? "text" : "password", 
      placeholder: "Create a strong password",
      icon: Lock,
      showToggle: true,
      toggle: () => setShowPassword(!showPassword),
      showPassword: showPassword
    },
    { 
      label: "Confirm Password", 
      name: "confirmPassword", 
      type: showConfirmPassword ? "text" : "password", 
      placeholder: "Confirm your password",
      icon: Lock,
      showToggle: true,
      toggle: () => setShowConfirmPassword(!showConfirmPassword),
      showPassword: showConfirmPassword
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative w-full max-w-md">
        {/* Trust Indicators */}
        <div className="text-center mb-6 space-y-2">
          <div className="flex justify-center items-center space-x-1 text-yellow-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Trusted by <span className="font-semibold text-gray-800">50,000+</span> professionals
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
                Create Your Account
              </h2>
              <p className="text-blue-100 text-sm">
                Join thousands of professionals advancing their careers
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <div className="space-y-5">
              {formFields.map(({ label, name, type, placeholder, icon: Icon, showToggle, toggle, showPassword }) => (
                <div key={name} className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">
                    {label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      required
                      placeholder={placeholder}
                      className={`w-full pl-10 pr-${showToggle ? '12' : '4'} py-3 border rounded-xl bg-gray-50/50 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[name] ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                    {showToggle && (
                      <button
                        type="button"
                        onClick={toggle}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    )}
                  </div>
                  {errors[name] && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors[name]}</span>
                    </div>
                  )}
                  
                  {/* Password Strength Indicator */}
                  {name === "password" && formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Password strength:</span>
                        <span className={`font-medium ${
                          passwordStrength <= 2 ? 'text-red-600' : 
                          passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Submit Error */}
              {errors.submit && (
                <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.submit}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-green-800 font-medium">Your data is secure</p>
                  <p className="text-green-700">We use industry-standard encryption to protect your information.</p>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => window.location.href = "/login"}
                  className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Shield, text: "Secure" },
            { icon: CheckCircle, text: "Verified" },
            { icon: Star, text: "Trusted" }
          ].map(({ icon: Icon, text }, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/30">
              <Icon className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-gray-700">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
