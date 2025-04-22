import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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

        <div className="overflow-y-auto p-6 ">
          <div className="bg-white rounded-lg space-y-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Image Section */}
              <div className=" relative rounded-lg overflow-hidden">
                <Image
                  src={
                    campaign.campaignPost ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="Campaign Image"
                  width={550}
                  height={550}
                  className="object-cover aspect-[16/9] rounded-lg"
                />
              </div>

              {/* Content Section */}
              <div className="w-full space-y-4">
                {/* Title and Brand */}
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl text-gray-900 line-clamp-2 font-bold">
                    {campaign.campaignName || "Campaign Name"}
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <Image
                    src={
                      campaign.campaignPost ||
                      "https://avatar.iran.liara.run/public/boy"
                    }
                    alt="Campaign Image"
                    width={40}
                    height={40} // Make height equal to width for a perfect circle
                    className="object-cover rounded-full h-10 w-10"
                  />
                  <p className="text-black text-lg">
                    {campaign.brandName || "Brand"}
                  </p>
                </div>

                {/* Campaign Objective */}
                <div className="mt-4 flex flex-col gap-4">
                  <h4 className="text-lg font-semibold">Campaign Objective</h4>
                  <p className="text-gray-600">
                    {campaign.campaignObjective
                      ? campaign.campaignObjective
                          .toString()
                          .replace(/[\[\]"]/g, "")
                      : "Awareness  Engagement Sales"}
                  </p>
                </div>

                {/* Campaign Description */}
                <div className="mt-4 flex flex-col gap-4">
                  <h4 className="text-lg font-semibold">
                    Campaign Description
                  </h4>
                  <p className="text-gray-600">
                    {campaign.campaignDescription || "No description available"}
                  </p>
                </div>

                <hr />

                {/* Campaign Description */}
                <div className="mt-4 flex flex-col gap-4">
                  <h4 className="text-lg font-semibold">Brand Brief</h4>
                  <p className="text-gray-600">
                    {campaign.yourBrief || "No brief provided"}
                  </p>
                </div>

                <hr />

                {/* Target Group */}
                <div className="my-3 flex flex-col gap-4">
                <h4 className="text-lg font-semibold">Campaign Concept</h4>
                <p className="text-gray-600">
                  {campaign.campaignConcept || "No campaign concept provided"}
                </p>
                <hr />
              </div>

              {/* Target Audience */}

              <div className="my-7">
                <h4 className="text-2xl font-semibold flex items-center gap-2 mb-4">
                  Target Audience & Demographics
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                  <div>
                    <p className="font-medium ">Target Audience Age</p>
                    <p className="text-gray-600">
                      {campaign?.targetAgeGroup && campaign.targetAgeGroup
                        ? Array.isArray(campaign.targetAgeGroup)
                          ? (campaign.targetAgeGroup as string[])
                              .map((age) =>
                                age.toString().replace(/[\[\]"]/g, " ")
                              )
                              .join(", ")
                          : (campaign.targetAgeGroup as string)
                              .toString()
                              .replace(/[\[\]"]/g, " ")
                        : ""}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Target Audience Gender</p>
                    <p className="text-gray-600">
                      {(campaign?.targetGender &&
                        campaign.targetGender
                          .toString()
                          .replace(/[\[\]"]/g, " ")) ||
                        "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium"> Target Audience Location</p>
                    <p className="text-gray-600">
                      {campaign.targetLocation
                        ? campaign.targetLocation
                            .map((loc) => loc.replace(/[\[\]"]/g, " "))
                            .join(", ")
                        : "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium"> Target Audience Interests</p>
                    <p className="text-gray-600">
                      {campaign.targetInterests
                        ? campaign.targetInterests
                            .map((int) => int.replace(/[\[\]"]/g, " "))
                            .join(", ")
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <hr />

                {/* Content Vibe */}
               <div className="my-7">
                <h4 className="text-2xl font-semibold flex items-center gap-2">
                  What is the Content Vibe?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p>Content Type</p>
                    <p className="text-gray-600">
                      {campaign.contentType || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p>Duration of Video</p>
                    <p className="text-gray-600">
                      {campaign.videoDuration || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p>Call to Action</p>
                    <p className="text-gray-600">
                      {campaign.catchPhrase || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p>Key Message & Hashtags</p>
                    <p className="text-gray-600">
                      {campaign.keyMessage || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p>Tone & Style</p>
                    <p className="text-gray-600">
                      {campaign.toneStyle || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ideal Creator Checklist */}
              <div className="my-7">
                <h4 className="text-2xl font-semibold flex items-center gap-2">
                  Ideal Creator Checklist
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p>Preferred Creator Niche</p>
                    <p className="text-gray-600">
                      {campaign.preferredCreatorNiche
                        ? campaign.preferredCreatorNiche
                            .map((niche) => niche.replace(/[\[\]"]/g, " "))
                            .join(", ")
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p>Preferred Creator Demographics</p>
                    <p className="text-gray-600">
                      {campaign.preferredCreatorDemographics || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p>Preferred Social Media</p>
                    <p className="text-gray-600">
                      {/* {campaign.socialMediaPlatform || "Not specified"} */}
                      {campaign?.socialMediaPlatform &&
                      campaign.socialMediaPlatform
                        ? Array.isArray(campaign.socialMediaPlatform)
                          ? (campaign.socialMediaPlatform as string[])
                              .map((age) =>
                                age.toString().replace(/[\[\]"]/g, " ")
                              )
                              .join(", ")
                          : (campaign.socialMediaPlatform as string)
                              .toString()
                              .replace(/[\[\]"]/g, " ")
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Compensation & Deliverables */}
              <div className="my-7">
                <h4 className="text-2xl font-semibold flex items-center gap-2">
                  Compensation & Deliverables
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-lg">No. Of Days for Delivery</p>
                    <p className="text-gray-600">
                      {campaign.noOfDaysForDelivery || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg">Expected Deliverables</p>
                    <p className="text-gray-600">
                      {campaign.expectedDeliverables || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-lg">Required Documents</p>
                    <p className="text-gray-600">
                      {campaign.campaignPdf ? (
                        <Link
                          href={campaign.campaignPdf || "#"}
                          target="_blank"
                          className="underline italic"
                        >
                          Link
                        </Link>
                      ) : (
                        'Not specified'
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg">Budget</p>
                    <p className="text-gray-600">
                      {campaign?.amount ? `$ ${campaign.amount}` : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg">Additional Information</p>
                    <p className="text-gray-600">
                      {campaign.additionalInstructions || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CampaignModal;
