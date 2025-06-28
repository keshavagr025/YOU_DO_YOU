import React, { useState } from "react";
import { X, Plus, Star, Send } from "lucide-react";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Senior Software Engineer at Google",
      message: "ResumeTracker helped me organize my job applications and land my dream role. The tracking features are incredibly useful!",
      company: "Google",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Product Manager at Microsoft",
      message: "The resume builder and application tracking made my job search 10x more efficient. Highly recommended!",
      company: "Microsoft",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "UX Designer at Airbnb",
      message: "Clean interface, powerful features. ResumeTracker is a game-changer for job seekers!",
      company: "Airbnb",
      rating: 5
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: '',
    company: '',
    message: '',
    rating: 5
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const testimonial = {
      id: Date.now(),
      ...newTestimonial
    };

    // Add new testimonial and keep only latest 3
    setTestimonials(prev => {
      const updated = [testimonial, ...prev];
      return updated.slice(0, 3); // Keep only first 3
    });

    // Reset form
    setNewTestimonial({ name: '', role: '', company: '', message: '', rating: 5 });
    setShowForm(false);
  };

  const closeForm = () => {
    setShowForm(false);
    setNewTestimonial({ name: '', role: '', company: '', message: '', rating: 5 });
  };

  return (
    <div id = "testimonials" className="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
            What Our Users Say
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            Hear from professionals who've used ResumeTracker to upgrade their job hunt.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group relative"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* 3D Card Effect */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 
                             border border-white/20 shadow-2xl transform transition-all duration-500 
                             hover:scale-105 hover:rotate-1 hover:shadow-purple-500/30 
                             relative overflow-hidden group-hover:border-purple-400/50">
                
                {/* Glowing effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="font-bold text-xl text-white mb-2 group-hover:text-purple-200 transition-colors">
                      {testimonial.name}
                    </h3>
                    <p className="text-purple-200 text-sm">
                      {testimonial.role}
                      {testimonial.company && (
                        <span className="text-purple-300 font-medium"> at {testimonial.company}</span>
                      )}
                    </p>
                  </div>

                  {/* Star Rating */}
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                      />
                    ))}
                  </div>

                  {/* Message */}
                  <blockquote className="text-white/90 italic leading-relaxed">
                    "{testimonial.message}"
                  </blockquote>
                </div>

                {/* Floating elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-60 
                               group-hover:scale-150 transition-transform duration-300"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-pink-400 rounded-full opacity-40 
                               group-hover:scale-200 transition-transform duration-300 delay-100"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Feedback Button */}
        {!showForm && (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="group relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                         px-8 py-4 rounded-full font-semibold text-lg shadow-2xl 
                         hover:from-purple-500 hover:to-indigo-500 
                         transform hover:scale-110 transition-all duration-300 
                         hover:shadow-purple-500/50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Share Your Success Story
              </span>
              
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        )}

        {/* Feedback Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 
                           max-w-2xl w-full max-h-[90vh] overflow-y-auto 
                           border border-purple-500/30 shadow-2xl 
                           transform animate-in slide-in-from-bottom-4 duration-500">
              
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-white">Share Your Experience</h3>
                <button
                  onClick={closeForm}
                  className="text-white/70 hover:text-white p-2 rounded-full 
                           hover:bg-white/10 transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-purple-200 text-sm font-semibold mb-2">Name *</label>
                    <input
                      type="text"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                      className="w-full bg-white/10 border border-purple-400/30 rounded-xl px-4 py-3 
                               text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 
                               focus:border-transparent transition-all duration-200"
                      placeholder="Your Full Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-purple-200 text-sm font-semibold mb-2">Company</label>
                    <input
                      type="text"
                      value={newTestimonial.company}
                      onChange={(e) => setNewTestimonial({...newTestimonial, company: e.target.value})}
                      className="w-full bg-white/10 border border-purple-400/30 rounded-xl px-4 py-3 
                               text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 
                               focus:border-transparent transition-all duration-200"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-purple-200 text-sm font-semibold mb-2">Role *</label>
                  <input
                    type="text"
                    value={newTestimonial.role}
                    onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})}
                    className="w-full bg-white/10 border border-purple-400/30 rounded-xl px-4 py-3 
                             text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 
                             focus:border-transparent transition-all duration-200"
                    placeholder="Your Job Title"
                    required
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-purple-200 text-sm font-semibold mb-4">Rating *</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewTestimonial({...newTestimonial, rating: star})}
                        className="transition-all duration-200 hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${star <= newTestimonial.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-purple-200 text-sm font-semibold mb-2">Your Experience *</label>
                  <textarea
                    value={newTestimonial.message}
                    onChange={(e) => setNewTestimonial({...newTestimonial, message: e.target.value})}
                    rows={4}
                    className="w-full bg-white/10 border border-purple-400/30 rounded-xl px-4 py-3 
                             text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 
                             focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Share your experience with ResumeTracker..."
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                             px-6 py-3 rounded-xl font-semibold 
                             hover:from-purple-500 hover:to-indigo-500 
                             transform hover:scale-105 transition-all duration-200 
                             shadow-lg hover:shadow-purple-500/30 
                             flex items-center justify-center"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Feedback
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-6 py-3 border border-purple-400/50 text-purple-200 rounded-xl 
                             hover:bg-white/10 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <p className="text-purple-300 text-sm mb-6">Trusted by professionals at</p>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <span className="text-white font-bold text-lg hover:text-purple-300 transition-colors">Google</span>
            <span className="text-white font-bold text-lg hover:text-purple-300 transition-colors">Microsoft</span>
            <span className="text-white font-bold text-lg hover:text-purple-300 transition-colors">Airbnb</span>
            <span className="text-white font-bold text-lg hover:text-purple-300 transition-colors">Netflix</span>
            <span className="text-white font-bold text-lg hover:text-purple-300 transition-colors">Amazon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;