import React from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FaBolt, FaUserCheck, FaBrain } from "react-icons/fa";

const Upcoming = () => {
  return (
    <section
      className=" py-20 px-6"
      id="upcoming"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-20">
          🚀 Upcoming Features
        </h2>

        {/* Feature 1 — Lottie on left, text on right */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center gap-12 mb-24"
        >
          <div className="w-full md:w-1/2 h-[300px] flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/2e50c7cc-bf1e-434f-9b7b-f2bb5fa50c46/udBqbwkA8v.lottie"
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-xl shadow-md p-8">
              <FaBrain className="text-3xl text-indigo-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                Real-Time LLM Feedback
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Get on-the-spot suggestions using cutting-edge large language models. Improve grammar, tone, clarity, and keyword match in real-time as you write or upload your resume.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature 2 — Text on left, no animation */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row-reverse items-center gap-12 mb-24"
        >
          <div className="w-full md:w-1/2">
            <img
              src="https://via.placeholder.com/500x300"
              alt="Resume Score Placeholder"
              className="rounded-xl shadow-lg w-full"
            />
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-xl shadow-md p-8">
              <FaBolt className="text-3xl text-yellow-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                Resume Performance Score
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Know how your resume stacks up. Get scores based on ATS compatibility, keyword match, readability, and structure — all in a simplified report.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature 3 — Lottie again on left */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center gap-12 mb-24"
        >
          <div className="w-full md:w-1/2 h-[300px] flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/8e93ed3c-1e8e-405b-9e00-8f6fc0663a7c/8XbNl2q4PY.lottie"
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-xl shadow-md p-8">
              <FaUserCheck className="text-3xl text-green-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                Auto-Tailored Resume Generator
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Paste any job description, and our engine will craft a resume optimized for that role, matching responsibilities, tone, and keywords.
              </p>
            </div>
          </div>
        </motion.div>

        {/* You can continue adding more blocks this way */}
      </div>
    </section>
  );
};

export default Upcoming;
