"use client";

import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaEnvelope,
  FaInfoCircle,
  FaCogs,
} from "react-icons/fa";

export default function ResponsiveNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu toggle

  return (
    <nav className="bg-transparent shadow-md font-poppins">
      <div className="mx-auto max-w-[1100px] px-6 flex items-center justify-between h-16">
        {/* Brand Section */}
        <div className="text-lg font-bold text-black flex items-center">
          Neuro Kodes
        </div>

        {/* Hamburger Menu Icon (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black hover:text-blue-600 focus:outline-none"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Navigation Links (Desktop) */}
        <ul className={`hidden md:flex space-x-6 text-black items-center`}>
          <li className="flex items-center">
            <FaHome className="mr-2" />
            <a href="/" className="hover:text-blue-600">
              Home
            </a>
          </li>

          <li className="flex items-center">
            <FaCogs className="mr-2" /> {/* Services Icon */}
            <a href="/services" className="hover:text-blue-600">
              Services
            </a>
          </li>

          <li className="flex items-center">
            <FaUsers className="mr-2" />
            <a href="/managing" className="hover:text-blue-600">
              Managing
            </a>
          </li>
          <li className="flex items-center">
            <FaEnvelope className="mr-2" />
            <a href="/contact" className="hover:text-blue-600">
              Contact Us
            </a>
          </li>
          <li className="flex items-center">
            <FaInfoCircle className="mr-2" />
            <a href="/about" className="hover:text-blue-600">
              About Us
            </a>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="hidden md:flex space-x-4">
          <a
            href="#"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-100 transition"
          >
            Login
          </a>
          <a
            href="#"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </a>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-100 shadow-md">
          <ul className="space-y-4 py-4 px-6 text-black">
            <li className="flex items-center">
              <FaHome className="mr-2" />
              <a href="/" className="hover:text-blue-600">
                Home
              </a>
            </li>

            <li className="flex items-center">
              <FaCogs className="mr-2" /> {/* Services Icon */}
              <a href="/services" className="hover:text-blue-600">
                Services
              </a>
            </li>

            <li className="flex items-center">
              <FaUsers className="mr-2" />
              <a href="/managing" className="hover:text-blue-600">
                Managing
              </a>
            </li>
            <li className="flex items-center">
              <FaEnvelope className="mr-2" />
              <a href="/contact" className="hover:text-blue-600">
                Contact Us
              </a>
            </li>
            <li className="flex items-center">
              <FaInfoCircle className="mr-2" />
              <a href="/about" className="hover:text-blue-600">
                About Us
              </a>
            </li>

            {/* Action Buttons */}
            <div className="space-y-4 mt-4">
              <a
                href="#"
                className="block px-4 py-2 border border-blue-600 text-blue-600 rounded text-center hover:bg-blue-100 transition"
              >
                Login
              </a>
              <a
                href="#"
                className="block px-4 py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700 transition"
              >
                Sign Up
              </a>
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
}
