import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const AuthWrapper = ({ title, subtitle, children, bottomText, linkText, linkTo }) => (
  <motion.div
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f4f2ff] to-[#ebe4ff] px-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-10 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      {children}
      <p className="text-sm text-gray-600 text-center">
        {bottomText} <Link to={linkTo} className="text-purple-600 font-medium hover:underline">{linkText}</Link>
      </p>
    </div>
  </motion.div>
);

export const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup Data', formData);
  };

  return (
    <AuthWrapper
      title="Join ReadyBoss"
      subtitle="Start optimizing your job hunt now."
      bottomText="Already have an account?"
      linkText="Log in"
      linkTo="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-semibold transition"
        >
          Create Account <FaArrowRight />
        </button>
      </form>
    </AuthWrapper>
  );
};
export default Signup;