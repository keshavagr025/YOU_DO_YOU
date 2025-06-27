// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Header from './Header';

const Layout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-200px)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;