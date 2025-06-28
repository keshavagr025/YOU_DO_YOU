import React, { useState } from "react";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Khushal Kumar Sahu",
      role: "Software Engineer",
      message: "ResumeTracker ne meri job search ko bahut easy bana diya!",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5
    },
    {
      id: 2,
      name: "Keshav Agarwal",
      role: "Product Manager",
      message: "Is app ki wajah se mera resume bahut professional dikhta hai.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5
    },
    {
      id: 3,
      name: "Khushi Agarwal",
      role: "UI/UX Designer",
      message: "User-friendly aur simple design, mujhe bahut pasand aaya!",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
      rating: 4
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: "",
    avatar: "",
    rating: 5
  });

  const [showForm, setShowForm] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.message) return;

    const newTestimonial = {
      ...formData,
      id: Date.now(),
      avatar: formData.avatar || `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 10)}.jpg`,
      rating: parseInt(formData.rating)
    };

    setTestimonials((prev) => {
      const updated = [...prev, newTestimonial];
      return updated.length > 3 ? updated.slice(1) : updated;
    });

    setFormData({ name: "", role: "", message: "", avatar: "", rating: 5 });
    setShowForm(false);
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex justify-center space-x-1 mb-3">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-purple-300/40'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const backgroundStyle = {
    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4338ca 50%, #6366f1 75%, #8b5cf6 100%)"
  };

  return (
    <section
      id="testimonials"
      className="w-full py-24 px-4 relative overflow-hidden"
      style={backgroundStyle}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl animate-ping"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-300/10 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-violet-300/10 rounded-full blur-xl animate-bounce"></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Enhanced Header */}
        <div className="mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-300 to-indigo-300 mb-6 tracking-tight drop-shadow-2xl font-mono">
            What Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-300 font-mono">
              Users Say
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-violet-400 mx-auto mb-8 rounded-full shadow-lg"></div>
          <p className="text-purple-200 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light font-mono">
            Discover how professionals worldwide are revolutionizing their job hunt with{" "}
            <span className="text-violet-300 font-semibold">ResumeTracker</span>
          </p>
        </div>

        {/* 3D Testimonial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map(({ id, name, role, message, avatar, rating }) => (
            <div
              key={id}
              className={`group relative transition-all duration-700 transform hover:-translate-y-6 ${
                hoveredCard === id ? 'scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredCard(id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* 3D Card Container */}
              <div className="relative">
                {/* Multiple Glow Effects for 3D */}
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-700"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 rounded-3xl blur-lg opacity-40 group-hover:opacity-80 transition duration-700"></div>
                
                {/* Main Card with 3D Transform */}
                <div 
                  className="relative bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-violet-900/80 backdrop-blur-xl p-8 rounded-3xl border border-purple-400/30 shadow-2xl transform transition-all duration-700"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: hoveredCard === id 
                      ? 'rotateY(8deg) rotateX(8deg) translateZ(20px)' 
                      : 'rotateY(0deg) rotateX(0deg) translateZ(0px)',
                    boxShadow: hoveredCard === id 
                      ? '0 30px 60px rgba(139, 92, 246, 0.3), 0 0 50px rgba(168, 85, 247, 0.2)' 
                      : '0 20px 40px rgba(139, 92, 246, 0.1)'
                  }}
                >
                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-6 h-6 bg-purple-400/30 rounded-full animate-bounce shadow-lg"></div>
                  <div className="absolute bottom-6 left-6 w-4 h-4 bg-violet-400/30 rounded-full animate-bounce shadow-lg"></div>
                  <div className="absolute top-1/2 right-8 w-3 h-3 bg-indigo-400/20 rounded-full animate-ping"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 text-center space-y-6">
                    {/* Avatar with Enhanced 3D effect */}
                    <div className="relative mx-auto w-24 h-24">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full blur-lg opacity-60"></div>
                      <div className="absolute inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-md opacity-40"></div>
                      <img
                        src={avatar}
                        alt={name}
                        className="relative w-24 h-24 rounded-full object-cover border-4 border-purple-400/60 shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                        style={{
                          filter: 'drop-shadow(0 10px 20px rgba(139, 92, 246, 0.4))'
                        }}
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-purple-400 rounded-full flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:scale-125">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    <StarRating rating={rating} />

                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-violet-200 drop-shadow-lg">
                      {name}
                    </h3>
                    
                    <p className="text-purple-300 font-medium text-lg tracking-wide">
                      {role}
                    </p>
                    
                    <div className="relative">
                      <svg className="absolute -top-2 -left-2 w-8 h-8 text-purple-400/40" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                      </svg>
                      <p className="text-purple-100 italic leading-relaxed text-lg px-4 py-2 relative z-10">
                        "{message}"
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Animated Border */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700">
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-border animate-pulse"></div>
                  </div>

                  {/* 3D Inner Glow */}
                  <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Toggle Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all duration-500 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl hover:from-purple-700 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transform hover:scale-110 hover:shadow-2xl"
            style={{
              filter: 'drop-shadow(0 10px 20px rgba(139, 92, 246, 0.3))'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500"></div>
            <span className="relative flex items-center space-x-3">
              <svg className={`w-6 h-6 transition-transform duration-500 ${showForm ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span>{showForm ? "Close Feedback Form" : "Give Feedback"}</span>
            </span>
          </button>
        </div>

        {/* Enhanced Feedback Form */}
        {showForm && (
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              {/* Form Multiple Glows for 3D Effect */}
              <div className="absolute -inset-3 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 rounded-3xl blur-lg opacity-30"></div>
              
              <div
                className="relative bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-violet-900/90 backdrop-blur-xl p-12 rounded-3xl border border-purple-400/40 shadow-2xl space-y-8 transform transition-all duration-700"
                style={{
                  boxShadow: '0 30px 60px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-violet-200 mb-10 text-center drop-shadow-lg">
                  Share Your Experience
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-purple-200 font-medium text-lg">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full bg-purple-800/30 border border-purple-400/40 rounded-xl p-4 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      style={{
                        boxShadow: 'inset 0 2px 4px rgba(139, 92, 246, 0.1)'
                      }}
                      required
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-purple-200 font-medium text-lg">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="Your Role"
                      className="w-full bg-purple-800/30 border border-purple-400/40 rounded-xl p-4 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      style={{
                        boxShadow: 'inset 0 2px 4px rgba(139, 92, 246, 0.1)'
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-purple-200 font-medium text-lg">Rating</label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full bg-purple-800/30 border border-purple-400/40 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    style={{
                      boxShadow: 'inset 0 2px 4px rgba(139, 92, 246, 0.1)'
                    }}
                  >
                    {[5,4,3,2,1].map(num => (
                      <option key={num} value={num} className="bg-purple-900">{num} Star{num !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="text-purple-200 font-medium text-lg">Feedback</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share your experience with ResumeTracker..."
                    rows={4}
                    className="w-full bg-purple-800/30 border border-purple-400/40 rounded-xl p-4 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-300 resize-none backdrop-blur-sm"
                    style={{
                      boxShadow: 'inset 0 2px 4px rgba(139, 92, 246, 0.1)'
                    }}
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-purple-200 font-medium text-lg">Avatar URL (Optional)</label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder="https://example.com/your-photo.jpg"
                    className="w-full bg-purple-800/30 border border-purple-400/40 rounded-xl p-4 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    style={{
                      boxShadow: 'inset 0 2px 4px rgba(139, 92, 246, 0.1)'
                    }}
                  />
                </div>
                
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-5 px-8 rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-violet-500/50 text-lg"
                  style={{
                    filter: 'drop-shadow(0 10px 20px rgba(139, 92, 246, 0.3))'
                  }}
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;