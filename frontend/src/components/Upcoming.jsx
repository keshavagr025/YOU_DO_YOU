import React from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FaBolt, FaUserCheck, FaBrain } from "react-icons/fa";
import rocket from '../assets/rocket.gif';
const Upcoming = () => {
  return (
    <section
    id = "upcoming" className="relative  text-white min-h-screen py-24 px-6 overflow-hidden">
      {/* Snow Effect Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full animate-snowfall bg-[url('/snow.png')] opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-pink-300 to-sky-300 bg-clip-text text-transparent font-mono">
           <img src={rocket} alt="icon" className="w-13 h-12 inline-block " /> Upcoming Features
        </h2>

        {/* Feature 1 */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center gap-12 mb-24"
        >
          <div className="w-full md:w-1/2 h-[300px] flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/46f5415c-9508-459a-8eb3-87f9b1e14384/sxmGhFZVMi.lottie"
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl">
              <FaBrain className="text-3xl text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-white">
                Real-Time LLM Feedback
              </h3>
              <p className="text-white/90 leading-relaxed   ">
                Get on-the-spot suggestions using cutting-edge large language
                models. Improve grammar, tone, clarity, and keyword match in
                real-time.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row-reverse items-center gap-12 mb-24"
        >
          <div className="w-full md:w-1/2 h-[300px] flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/76fe4811-ba2e-44a8-a4cc-f699010473d1/jhYeqFPaS2.lottie"
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl">
              <FaBolt className="text-3xl text-yellow-400 mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-white">
                Resume Performance Score
              </h3>
              <p className="text-white/90 leading-relaxed">
                Know how your resume stacks up. Get scores based on ATS
                compatibility, keyword match, readability, and structure.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center gap-12"
        >
          <div className="w-full md:w-1/2 h-[300px] flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/00bb328a-f87b-4ae4-913b-642a49bc69ac/e2MYucT089.lottie"
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl">
              <FaUserCheck className="text-3xl text-green-400 mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-white">
                Auto-Tailored Resume Generator
              </h3>
              <p className="text-white/90 leading-relaxed">
                Paste any job description, and our engine will craft a resume
                optimized for that role, matching responsibilities, tone, and
                keywords.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Upcoming;