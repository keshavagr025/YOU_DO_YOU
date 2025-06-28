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
      "Our advanced AI examines your resume’s structure, content, and formatting to ensure compatibility with Applicant Tracking Systems (ATS).",
    icon: <FaRobot />,
    animation:
      "https://lottie.host/65673587-ff0b-45c9-a5b2-2a8db526fe57/XXEMZNWmgI.lottie",
  },
  {
    title: "Smart Keyword Extraction",
    description:
      "Extracts key qualifications, soft skills, and technical terms from job descriptions using cutting-edge NLP.",
    icon: <FaKey />,
    animation:
      "https://lottie.host/75e24233-8b2d-4ff1-a347-535b34ffc824/koC2uBpqam.lottie",
  },
  {
    title: "Semantic Matching",
    description:
      "Understands the meaning of your experience and compares it with job requirements to find best-fit roles.",
    icon: <FaStream />,
    animation:
      "https://lottie.host/93f41c43-284a-4085-83a3-c1be0601365d/kJ7DHXUSgZ.lottie",
  },
  {
    title: "Parses Resume",
    description:
      "Extracts structured data from resumes — including PDFs and DOCX — recognizing all key sections.",
    icon: <FaFileAlt />,
    animation:
      "https://lottie.host/430d1c47-f57a-4786-b39a-5ccf1b075caf/OPlUFvsOEO.lottie",
  },
  {
    title: "Intelligent Suggestions",
    description:
      "Gives personalized tips to improve tone, keywords, and formatting based on job role and ATS standards.",
    icon: <FaLightbulb />,
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
    <section
      id="features"
      className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white min-h-screen py-24 px-6 overflow-hidden">
  
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-16"
        >
          <span className="bg-gradient-to-r from-pink-400 to-sky-400 bg-clip-text text-transparent">
            Smart AI
          </span>{" "}
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
