import React, { useRef } from "react";
import { Routes, Route } from "react-router-dom";

import Feature from "./components/Feature";
import Testimonials from "./components/Testimonials";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import Upcoming from "./components/Upcoming";
import Base from "./components/Base";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
  const heroRef = useRef();
  const baseRef = useRef();
  const featuresRef = useRef();
  const upcomingRef = useRef();
  const testimonialsRef = useRef();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="relative min-h-screen overflow-hidden">
            <div className="relative z-10">
              <Hero
                heroRef={heroRef}
                baseRef={baseRef}
                featuresRef={featuresRef}
                upcomingRef={upcomingRef}
                testimonialsRef={testimonialsRef}
              />

              <div ref={baseRef}><Base /></div>

              {/* ✅ Shared Gradient Background for Feature & Upcoming */}
              <div className=" bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
                <div ref={featuresRef}><Feature /></div>
                <div ref={upcomingRef}><Upcoming /></div>
              </div>

              <div ref={testimonialsRef}><Testimonials /></div>
              <Footer />
              <ChatBot />
            </div>
          </div>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;