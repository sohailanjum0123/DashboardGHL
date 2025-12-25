import React from "react";
import { Link, useNavigate } from "react-router-dom";

const HomeHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl text-gray-800">GHL Dashboard</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-yellow-500 font-medium">
            Home
          </Link>
          <Link to="/portfolio" className="text-gray-700 hover:text-yellow-500 font-medium">
            Portfolio
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-yellow-500 font-medium">
            About
          </Link>
          <Link to="/service" className="text-gray-700 hover:text-yellow-500 font-medium">
            Service
          </Link>
          <Link to="/faqs" className="text-gray-700 hover:text-yellow-500 font-medium">
            FAQs
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-yellow-500 font-medium">
            Contact Us
          </Link>
        </nav>

        {/* Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="ml-4 bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition"
        >
          Login
        </button>

        {/* Mobile Menu (optional toggle) */}
        {/* You can add hamburger menu here for mobile */}
      </div>
    </header>
  );
};

export default HomeHeader;
