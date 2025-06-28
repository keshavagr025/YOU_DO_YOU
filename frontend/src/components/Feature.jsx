import React from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  FaRobot,
  FaKey,
  FaStream,
  FaFileAlt,
  FaLightbulb,
} from "react-icons/fa";
import document from '../assets/document.gif';

const features = [
  {
    title: "AI Resume Analysis",
    description:
      "Instantly evaluate your resume with deep-learning models trained on thousands of job-winning profiles. Our analyzer scores your resume across formatting, clarity, impact, and relevance — so you're always application-ready.",
    icon: <FaRobot />,
    animation:
      "https://lottie.host/65673587-ff0b-45c9-a5b2-2a8db526fe57/XXEMZNWmgI.lottie",
  },
  {
    title: "Smart Keyword Extraction",
    description:
      "Stop guessing what recruiters want. Our intelligent system scans job descriptions and pulls the most crucial keywords, then checks your resume for alignment — helping you bypass keyword-based filters and rank higher in ATS.",
    icon: <FaKey />,
    animation:
      "https://lottie.host/75e24233-8b2d-4ff1-a347-535b34ffc824/koC2uBpqam.lottie",
  },
  {
    title: "Semantic Matching",
    description:
      "We don’t just look at words — we understand meaning. Our semantic engine maps your experience and skills to job requirements contextually, increasing your chances of getting shortlisted, even for roles that don't exactly match your title.",
    icon: <FaStream />,
    animation:
      "https://lottie.host/93f41c43-284a-4085-83a3-c1be0601365d/kJ7DHXUSgZ.lottie",
  },
  {
    title: "Parses Resume",
    description:
      "Your resume is decoded and structured into clean, machine-readable sections. We extract job roles, durations, tools, skills, achievements, and more — making it easy for the AI to analyze and recruiters to understand.",
    icon: <FaFileAlt />,
    animation:
      "https://lottie.host/430d1c47-f57a-4786-b39a-5ccf1b075caf/OPlUFvsOEO.lottie",
  },
  {
    title: "Intelligent Suggestions",
    description:
      "Think of it as your personal career assistant. Whether it's rewriting weak bullet points, recommending missing sections, or improving action verbs — our AI gives you smart, personalized tips to sharpen your profile for every job you apply to.",
    icon: <FaLightbulb />,
    animation:
      "https://lottie.host/1cb1e2ee-076c-440b-9963-9b3047723aed/KkR1iMLein.lottie",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Features = () => {
  return (
    <section
      id="features"
      className="relative text-white min-h-screen py-24 px-6 overflow-hidden ">
  
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-16"
        >
          <span className="bg-gradient-to-r from-pink-400 to-sky-400 bg-clip-text text-transparent ">
            Smart AI
          </span>{" "}
           <img src={document} alt="icon" className="w-13 h-14 inline-block m-2 " />
          Features
        </motion.h2>

        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`flex flex-col md:flex-row ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            } items-center gap-10 mb-20`}
          >
            {/* Animation */}
            <div className="w-full md:w-1/2">
              <DotLottieReact
                src={feature.animation}
                autoplay
                loop
                style={{ height: "340px", width: "110%" }}
              />
            </div>

            {/* Text Card */}
            <div className="w-full md:w-1/2 px-4">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm shadow-lg shadow-purple-400">
                  {React.cloneElement(feature.icon, {
                    className: "text-white text-2xl",
                  })}
                </div>
                <h3 className="text-2xl font-semibold ml-4 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-md">
                  {feature.title}
                </h3>
              </div>
              <p className="text-lg leading-relaxed text-white/90 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10 shadow-xl hover:scale-[1.02] transition-all duration-300">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;