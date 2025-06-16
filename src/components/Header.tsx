"use client";

import React from 'react';

const Header = () => {
  return (
    <header className="max-w-7xl mx-auto mb-12">
      <div className="flex justify-between items-center">
        <div className="relative">
          <h1 className="text-xl font-['Playfair_Display'] font-medium tracking-wide italic">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-gray-100 to-white">
              Reemember
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-white/5 to-transparent blur-xl -z-10" />
          </h1>
        </div>  
        <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 font-medium text-sm tracking-wide uppercase">
          + New Note
        </button>
      </div>
    </header>
  );
};

export default Header; 