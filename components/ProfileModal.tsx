"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileModalProps {
  profile: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal = ({ profile, isOpen, onClose }: ProfileModalProps) => {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!profile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Profile Details</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
              >
                ✖
              </button>
            </div>

            {/* User Info */}
            <div className="space-y-3 text-gray-700">
              <p><span className="font-semibold">Name:</span> {profile.fullName} ({profile.stageName})</p>
              <p><span className="font-semibold">Gender:</span> {profile.gender}</p>
              <p><span className="font-semibold">City:</span> {profile.city}</p>
              <p><span className="font-semibold">Date of Birth:</span> {new Date(profile.dob).toLocaleDateString()}</p>
              <p><span className="font-semibold">Category:</span> {profile.category.join(", ")}</p>
              <p><span className="font-semibold">Languages:</span> {profile.languages.join(", ")}</p>
            </div>

            {/* Audience Info */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">Audience</h3>
              <p><span className="font-semibold">Locations:</span> {profile.audience.audienceLocations.join(", ")}</p>
              <p><span className="font-semibold">Age Bracket:</span> {profile.audience.ageBracket}</p>
              <p><span className="font-semibold">Gender Distribution:</span> {profile.audience.genderDistribution}</p>
            </div>

            {/* Social Links */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">Social Links</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">{profile.socialLinks?.primary?.platform}:</span> 
                  <a
                    href={profile.socialLinks?.primary?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    {profile.socialLinks?.primary?.link}
                  </a> 
                  ({profile.socialLinks?.primary?.followers} followers)
                </p>
                <p>
                  <span className="font-semibold">{profile.socialLinks?.secondary?.platform}:</span> 
                  <a
                    href={profile.socialLinks?.secondary?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    {profile.socialLinks?.secondary?.link}
                  </a> 
                  ({profile.socialLinks?.secondary?.followers} followers)
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 space-y-2">
              <p><span className="font-semibold">Growth Rate:</span> {profile.growthRate}%</p>
              <p><span className="font-semibold">Avg Views:</span> {profile.averageView}</p>
              <p><span className="font-semibold">Favorite Brands:</span> {profile.favouriteBrands}</p>
              <p><span className="font-semibold">Paid Campaigns:</span> {profile.paidCampaigns}</p>
              <p><span className="font-semibold">Worked with AI Consumer Apps:</span> {profile.workedWithAIConsumerApps ? "Yes" : "No"}</p>
              <p><span className="font-semibold">Activated:</span> {profile.isActivated ? "Yes" : "No"}</p>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
