import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, CircleCheckBig, DollarSign, Instagram, Mail, Share2, Twitter, Youtube } from "lucide-react";
import TikTokIcon from "../components/icons/tiktok";

const getSocialMediaIcon = (platform?: string) => {
  if (!platform) return <Share2 className="w-5 h-5" />;

  const normalized = platform.toLowerCase().trim();

  switch (normalized) {
    case "instagram":
      return <Instagram className="w-5 h-5 text-pink-500" />;

    case "youtube":
    case "youtube reel":
      return <Youtube className="w-5 h-5 text-red-500" />;

    case "twitter":
    case "twitter / x":
    case "x":
      return <Twitter className="w-5 h-5 text-black" />;

    case "newsletter":
    case "email":
      return <Mail className="w-5 h-5 text-gray-600" />;

    case "tiktok":
      return <TikTokIcon size={20} />;

    default:
      return <Share2 className="w-5 h-5 text-gray-400" />;
  }
};

const CampaignModal = ({ campaign, isOpen, onClose }) => {
  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      {/* Scrollable Content Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white w-full max-w-6xl rounded-lg shadow-xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center pb-4 p-6 sticky top-0 bg-white z-50 shadow-md">
          <h2 className="text-lg md:text-xl font-bold">Campaign Details</h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full transition-colors text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-24">
          <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col lg:flex-row gap-6">
              <Image
                src={campaign.campaignImage || "/images/placeholder.png"}
                alt="Campaign Image"
                width={350}
                height={150}
                className="object-cover aspect-[16/9] rounded-lg"
              />

              <div className="space-y-3">
                <h2 className="text-2xl font-bold">
                  {campaign.campaignTitle || "Campaign Title"}
                </h2>

                <p className="text-lg text-gray-700">
                  {campaign.brandName || "Brand"}
                </p>
              </div>
            </div>

            <hr />

            {/* Description */}
            <section>
              <h3 className="font-semibold mb-1">Campaign Description</h3>
              <p className="text-gray-600">{campaign.campaignDescription}</p>
            </section>

            <hr />

            {/* Target Niche */}
            <section>
              <h3 className="font-semibold mb-2">Target Niche</h3>
              <div className="flex flex-wrap gap-2">
                {campaign.targetNiche && campaign.targetNiche.map((niche, i) => (
                  <span
                    key={i}
                    className="px-4 py-1 rounded-full bg-gray-100 text-sm text-gray-600"
                  >
                    {niche}
                  </span>
                ))}
              </div>
            </section>

            <hr />

            {/* Platforms */}
            <div className="p-4 border rounded-xl space-y-5">
              <div className="flex items-center gap-3">
                {getSocialMediaIcon(campaign.socialPlatforms)}
                <div>
                  <p className="text-xs text-gray-500 ">Platform</p>
                  <p className="font-semibold">{campaign.socialPlatforms}</p>
                </div>
              </div>

              {campaign.expectedDeliverables && campaign.expectedDeliverables.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Expected Deliverables
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {campaign.expectedDeliverables.map((item, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <hr />

            {/* Budget & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-xl flex items-center gap-4">
                <DollarSign className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="font-semibold">{campaign.budgetForCampaign}</p>
                </div>
              </div>

              <div className="p-4 border rounded-xl flex items-center gap-4">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-xs text-gray-500">Deadline</p>
                  <p className="font-semibold">{campaign.deadline}</p>
                </div>
              </div>
            </div>

            <hr />

            {/* Requirements */}
            {campaign.requirements && campaign.requirements?.length > 0 && (
              <section>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <ul className="space-y-2">
                  {campaign.requirements.map((req, i) => (
                    <li key={i} className="flex gap-2 text-gray-600">
                      <CircleCheckBig className="w-5 h-5 text-green-600 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Application Questions */}
            {campaign.applicationQuestions && (
              <div>
                <h4 className="text-lg font-semibold mb-2">
                  Application Questions
                </h4>
                <p className="text-gray-600">
                  {campaign.applicationQuestions}
                </p>
              </div>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default CampaignModal;
