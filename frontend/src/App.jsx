// App.jsx
// import React, { useState } from "react";
import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// import About from "./components/About";
import Feature from "./components/Feature";
import Testimonials from "./components/Testimonials";
// import SignUp from "./components/SignUp";
// import Login from "./components/Login";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
// import UploadResume from "./components/UploadResume/UploadResume";
// import ResumeAnalyzer from "./components/UploadResume/ResumeAnalyzer";
import ChatBot from "./components/ChatBot";
import Upcoming from "./components/Upcoming";
import Base from "./components/Base";

// Home Page Component
function App()
{
  const heroRef = useRef();
  const baseRef = useRef();
  const featuresRef = useRef();
  const upcomingRef = useRef();
  const testimonialsRef = useRef();

  return (
    <div classNmae="realtive min-h-screen overflow-hidden">
      <div className="relative z-10">
        <Hero
          heroRef={heroRef}
          baseRef={baseRef}
          featuresRef={featuresRef}
          upcomingRef={upcomingRef}
          testimonialsRef={testimonialsRef}
        /> 

      {/* <div className="pt-20" ref={heroRef}><Hero/></div> */}
      <div ref={baseRef}><Base/></div>
      <div ref={featuresRef}><Feature/></div>
      <div ref={upcomingRef}><Upcoming/></div>
      <div ref={testimonialsRef}><Testimonials/></div>
      <Footer />
      <ChatBot />
      </div>
      </div>
  );
}

export default App;
        
       
       