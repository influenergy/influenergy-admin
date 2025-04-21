import React, { useState } from "react";
import { InstagramEmbed } from "react-social-media-embed";
import { api } from "../utils/apiConfig";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: {
    title: string;
    image: string;
    videoLink: string;
    addedAt: string;
    isPublic: "pending" | "approved" | "declined";
    _id: string;
  }[];
  profileId: string;
  onStatusUpdate?: () => void;
  refreshDashboard?: () => void;
}

const VideoModal = ({
  isOpen,
  onClose,
  videos,
  profileId,
  onStatusUpdate,
  refreshDashboard,
}: VideoModalProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  console.log(videos, "videos");
  const handleVideoAction = async (
    videoId: string,
    action: "approved" | "declined"
  ) => {
    try {
      setLoading(videoId);
      await api.put(`/creator/social-videos/status/${profileId}`, {
        status: action,
        videoId,
      });

      if (onStatusUpdate) onStatusUpdate();
      if (refreshDashboard) refreshDashboard();

      alert(`Video ${action} successfully.`);
    } catch (error) {
      alert(`Failed to ${action} video. Please try again.`);
    } finally {
      setLoading(null);
    }
  };

  const getInstagramUrl = (url: string) => {
    const matches = url.match(/(?:reel|p)\/([A-Za-z0-9_-]+)/);
    return matches ? `https://www.instagram.com/reel/${matches[1]}` : url;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white w-full max-w-3xl h-[90vh] rounded-lg shadow-xl flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg md:text-xl font-bold">Creator Videos</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {videos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg
                  className="w-16 h-16 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg">No videos uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {videos.map((video) => (
                  <div
                    key={video._id}
                    className="border rounded-lg shadow-sm overflow-hidden"
                  >
                    {/* Video Header */}
                    <div className="bg-gray-50 px-4 py-3 flex flex-wrap gap-2 justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Added: {formatDate(video.addedAt)}
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          video.isPublic
                        )}`}
                      >
                        {getStatusText(video.isPublic)}
                      </span>
                    </div>

                    {/* Video Content */}
                    <div className="p-4">
                      <div className="flex justify-center max-w-[500px] mx-auto">
                        <div className="w-3/4 max-w-[300px] aspect-[9/12] relative">
                          <Image
                            src={video.image}
                            alt="social video"
                            fill
                            className="object-cover rounded-md cursor-pointer"
                            onClick={() => window.open(video.videoLink, '_blank')}
                            />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {video.isPublic === "pending" && (
                      <div className="px-4 pb-4 flex flex-wrap gap-2 justify-end">
                        <button
                          className={`px-4 py-2 text-sm font-medium rounded-lg
                          ${
                            loading === video._id
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700 active:bg-red-800"
                          } text-white transition-colors flex items-center gap-2`}
                          onClick={() =>
                            handleVideoAction(video._id, "declined")
                          }
                          disabled={loading === video._id}
                        >
                          {loading === video._id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Decline"
                          )}
                        </button>
                        <button
                          className={`px-4 py-2 text-sm font-medium rounded-lg
                          ${
                            loading === video._id
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700 active:bg-green-800"
                          } text-white transition-colors flex items-center gap-2`}
                          onClick={() =>
                            handleVideoAction(video._id, "approved")
                          }
                          disabled={loading === video._id}
                        >
                          {loading === video._id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Approve"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VideoModal;
