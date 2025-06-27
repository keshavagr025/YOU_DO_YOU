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

const features = [
  {
    title: "AI Resume Analysis",
    description:
      "Analyzes your resume's structure and ensures it's optimized for ATS systems with actionable feedback.",
    icon: <FaRobot className="text-indigo-500 text-2xl mr-3" />,
    animation:
      "https://lottie.host/65673587-ff0b-45c9-a5b2-2a8db526fe57/XXEMZNWmgI.lottie",
  },
  {
    title: "Smart Keyword Extraction",
    description:
      "Extracts relevant keywords from job descriptions to help align your resume perfectly.",
    icon: <FaKey className="text-indigo-500 text-2xl mr-3" />,
    animation:
      "https://lottie.host/75e24233-8b2d-4ff1-a347-535b34ffc824/koC2uBpqam.lottie",
  },
  {
    title: "Semantic Matching",
    description:
      "Understands your resume semantically and finds the best job matches beyond just keyword scanning.",
    icon: <FaStream className="text-indigo-500 text-2xl mr-3" />,
    animation:
      "https://lottie.host/93f41c43-284a-4085-83a3-c1be0601365d/kJ7DHXUSgZ.lottie",
  },
  {
    title: "Resume Parsing",
    description:
      "Extracts and organizes content from uploaded resumes (PDF/DOCX) for smarter analysis.",
    icon: <FaFileAlt className="text-indigo-500 text-2xl mr-3" />,
    animation:
      "https://lottie.host/430d1c47-f57a-4786-b39a-5ccf1b075caf/OPlUFvsOEO.lottie",
  },
  {
    title: "Intelligent Suggestions",
    description:
      "Provides personalized tips to improve tone, content, and layout so your resume shines.",
    icon: <FaLightbulb className="text-indigo-500 text-2xl mr-3" />,
    animation:
      "https://lottie.host/a7ab3291-554d-4272-ab7c-a8ee2c62e280/uRqt8ykrke.lottie",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Features = () => {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-16 text-gray-900"
        >
          <span className="text-indigo-600">Powerful</span> AI Features
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
            {/* Lottie Animation */}
            <div className="w-full md:w-1/2">
              <DotLottieReact
                src={feature.animation}
                autoplay
                loop
                style={{ height: "320px", width: "110%" }}
              />
            </div>

            {/* Feature Description */}
            <div className="w-full md:w-1/2 px-4">
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="text-2xl font-bold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-base md:text-lg text-gray-800 leading-relaxed font-medium">
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
