"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-700 p-8 sm:p-16 text-gray-200">
      <motion.div
        className="max-w-3xl w-full bg-gray-800 p-6 sm:p-12 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Terms & Conditions
        </h1>
        <p className="text-gray-300 mb-4">
          Welcome to InfuEnergy! By accessing and using this platform, you agree to comply with the following terms and conditions.
        </p>
        
        <h2 className="text-xl font-semibold text-white mt-4">1. User Responsibilities</h2>
        <p className="text-gray-300 mb-4">
          Users must provide accurate information and maintain the confidentiality of their login credentials. Any unauthorized use of the platform is prohibited.
        </p>

        <h2 className="text-xl font-semibold text-white mt-4">2. Platform Usage</h2>
        <p className="text-gray-300 mb-4">
          This platform is for managing influencer-brand collaborations. Any misuse, such as unauthorized data extraction or fraudulent activities, will result in account suspension.
        </p>

        <h2 className="text-xl font-semibold text-white mt-4">3. Privacy & Data Protection</h2>
        <p className="text-gray-300 mb-4">
          InfuEnergy values your privacy. User data will be securely stored and will not be shared without consent. Refer to our Privacy Policy for more details.
        </p>

        <h2 className="text-xl font-semibold text-white mt-4">4. Changes to Terms</h2>
        <p className="text-gray-300 mb-4">
          InfuEnergy reserves the right to modify these terms at any time. Continued use of the platform after changes signifies acceptance of the updated terms.
        </p>

        <h2 className="text-xl font-semibold text-white mt-4">5. Contact Us</h2>
        <p className="text-gray-300 mb-4">
          If you have any questions regarding these terms, please contact our support team.
        </p>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-blue-400 hover:underline hover:text-blue-300"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
