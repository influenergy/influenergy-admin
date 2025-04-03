import { motion, AnimatePresence } from "framer-motion";

const CollaborationVideoModal = ({ videos, isOpen, onClose }) => {
  if (!isOpen || !videos || videos.length === 0) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white w-full max-w-4xl rounded-lg shadow-xl p-6 overflow-y-auto max-h-[90vh]"
        >
          <div className="flex justify-between items-center pb-4 border-b">
            <h2 className="text-lg md:text-xl font-bold">Video Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          <div className="overflow-x-auto py-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full"
            >
              <table className="w-full border-collapse border border-gray-300 text-left text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="p-2">Video Link</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Message</th>
                    <th className="p-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map(({ link, status, message, timestamp }, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-2">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Watch Video
                        </a>
                      </td>
                      <td className="p-2">{status}</td>
                      <td className="p-2">{message || ""}</td>
                      <td className="p-2">{new Date(timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CollaborationVideoModal;
