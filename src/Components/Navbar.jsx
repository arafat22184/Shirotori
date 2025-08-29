import React, { useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaShare,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-5 py-3">
        {/* Logo/Brand */}
        <h1 className="text-3xl font-bold text-white">
          <a href="/" className="flex items-center">
            <span className="bg-white text-blue-600 rounded-lg px-2 py-1 mr-2">
              S
            </span>
            Shirotori
          </a>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-around gap-6 items-center">
          <div className="flex items-center text-white">
            <FaShare className="mr-2" />
            <span className="font-medium">Share</span>
          </div>
          <div className="flex gap-4">
            <a
              href={"https://facebook.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors shadow-sm"
              aria-label="Share on Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href={"https://twitter.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-2 rounded-full text-blue-400 hover:bg-blue-100 transition-colors shadow-sm"
              aria-label="Share on Twitter"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 px-5 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center text-white">
              <FaShare className="mr-2" />
              <span className="font-medium">Share</span>
            </div>
            <div className="flex gap-4">
              <a
                href={"https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                aria-label="Share on Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href={"https://twitter.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full text-blue-400 hover:bg-blue-100 transition-colors"
                aria-label="Share on Twitter"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
