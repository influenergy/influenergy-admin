"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-700 p-8 sm:p-16 text-gray-200">
      {/* Main Container */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center gap-12">

        {/* Left Section - Image */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Image
            src="/landing_page.webp"
            alt="Brand & Influencer Collaboration"
            width={400}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </motion.div>

        {/* Right Section - Content */}
        <motion.div
          className="flex-1 text-center sm:text-left"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold text-white text-balance flex items-center justify-center text-center">
            Welcome to InfluEnergy Admin Panel
          </h1>
          <p className="text-lg text-gray-300 max-w-lg mt-4">
            Manage influencers, brand collaborations, and platform analytics seamlessly. Stay in control with an intuitive dashboard.
          </p>

          {/* Buttons for Login & Signup */}
          <div className="flex gap-4 mt-6 justify-center sm:justify-start">
            <a
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
              href="/login"
            >
              Login
            </a>
            <a
              className="px-6 py-3 border border-gray-400 text-white rounded-lg hover:bg-gray-600 transition duration-300"
              href="/signup"
            >
              Sign Up
            </a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className="mt-12 text-center text-gray-300 text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <a href="/terms" className="hover:underline">Terms & Conditions</a>
        <p className="mt-2">Copyright © 2025 InfluEnergy</p>
      </motion.footer>
    </div>
  );
}
