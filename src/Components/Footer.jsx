import React from "react";
import { FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-white">
      <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm mb-2 md:mb-0">
          © {new Date().getFullYear()} Shirotori. All rights reserved.
        </p>
        <div className="flex items-center text-sm">
          <span className="mr-1">Made with</span>
          <FaHeart className="text-red-500 mx-1" />
          <span className="ml-1">by Team Shirotori</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
