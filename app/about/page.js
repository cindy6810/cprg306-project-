'use client'
 
import Link from 'next/link';
import { useState } from 'react';
 
export default function About() {
  const [isHovered, setIsHovered] = useState(false);
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
      <div
        className="bg-white/90 backdrop-blur rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all duration-300 hover:shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="text-center">
          <h1 className={`text-3xl font-bold mb-6 text-emerald-600 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
            About Us
          </h1>
         
          <p className="text-gray-700 mb-8">
            Greetings, and welcome to Sean Quinn & Yailing Wei's interactive weather app, our job was to design a weather app that would satisfy the learning content from our CPRG306 class at SAIT, ENJOY!!
          </p>
 
          <Link href="/">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg group transition-all duration-300 hover:shadow-lg">
              <span className="inline-flex items-center">
                <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
                <span className="ml-2">Back to Weather</span>
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
