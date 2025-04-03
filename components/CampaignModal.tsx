import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const CampaignModal = ({ campaign, isOpen, onClose }) => {
  if (!isOpen || !campaign) return null;

  const campaignData = {
    "Name": campaign.campaignName,
    "Brand": campaign.brandName,
    "Budget": `$${campaign.budgetForCampaign}`,
    "Concept": campaign.campaignConcept,
    "Description": campaign.campaignDescription,
    "Objective": campaign.campaignObjective?.join(", "),
    "Catch Phrase": campaign.catchPhrase,
    "Content Type": campaign.contentType,
    "Creator": campaign.creatorInfluencer,
    "Creator Type": campaign.creatorType,
    "Expected Deliverables": campaign.expectedDeliverables,
    "Key Message & Hashtags": campaign.keyMessage,
    "Minimum Followers": campaign.minimumFollowers,
    "Delivery Time": `${campaign.noOfDaysForDelivery} days`,
    "Past Experience": campaign.pastExperience,
    "Preferred Creator Demographics": campaign.preferredCreatorDemographics,
    "Preferred Creator Niche": campaign.preferredCreatorNiche?.join(", "),
    "Platforms": campaign.socialMediaPlatform?.join(", "),
    "Target Age Group": campaign.targetAgeGroup,
    "Target Gender": campaign.targetGender,
    "Target Interests": campaign.targetInterests?.join(", "),
    "Target Location": campaign.targetLocation?.join(", "),
    "Tone & Style": campaign.toneStyle,
    "Video Duration": campaign.videoDuration,
    "Brief": campaign.yourBrief,
  };

  // Include campaignPost only if it exists
  if (campaign.campaignPost) {
    campaignData["Post"] = (
      <Image
        src={campaign.campaignPost}
        alt="Campaign Post"
        className="w-full max-w-xs rounded-lg"
        width={200} height={200} // Ensure Image component has width and height
      />
    );
  }

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
            <h2 className="text-lg md:text-xl font-bold">Campaign Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
          <div className="overflow-x-auto py-4">
            <table className="w-full border-collapse border border-gray-300 text-left text-sm md:text-base">
              <tbody>
                {Object.entries(campaignData).map(([key, value], index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-2 font-medium bg-gray-100 w-1/3">{key}</td>
                    <td className="p-2">{value || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CampaignModal;
