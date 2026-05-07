import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaGooglePlusG, FaYoutube, FaFacebookMessenger } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white ">

      {/* Top Section */}
      <div className="max-w-6xl mx-auto text-center pb-3 pt-8 border-b border-white">
        <h2 className="text-3xl font-bold tracking-wide">VITAL EASE</h2>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center px-4">
        <div className="flex flex-wrap justify-center gap-3 py-3 border-b">
          <div className="w-19 h-12 flex items-center justify-center border border-white rounded-full hover:bg-gray-900 transition">
            <FaFacebookF size={20} />
          </div>

          <div className="w-19 h-12 flex items-center justify-center border border-white rounded-full hover:bg-gray-900 transition">
            <FaInstagram size={20} />
          </div>

          <div className="w-19 h-12 flex items-center justify-center border border-white rounded-full hover:bg-gray-900 transition">
            <FaTwitter size={20} />
          </div>

          <div className="w-19 h-12 flex items-center justify-center border border-white rounded-full hover:bg-gray-900 transition">
            <FaGooglePlusG size={20} />
          </div>

          <div className="w-19 h-12 flex items-center justify-center border border-white rounded-full hover:bg-gray-900 transition">
            <FaYoutube size={20} />
          </div>

          <div className="w-19 h-12 flex items-center justify-center border border-white rounded-full hover:bg-gray-900 transition">
            <FaFacebookMessenger size={20} />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center text-sm py-6">
        <p>Copyright &copy; 2026, All rights reserved. Vital Ease</p>
        <p>
          Designed & made by <span className="font-bold font-heading">HIMANSHU</span>
        </p>
      </div>

    </footer>
  );
};

export default Footer;