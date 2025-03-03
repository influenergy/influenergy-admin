import { motion } from "framer-motion";

interface TabsProps {
  activeTab: "creators" | "brands";
  setActiveTab: (tab: "creators" | "brands") => void;
}

const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
  return (
    <div className="flex space-x-4">
      {["creators", "brands"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as "creators" | "brands")}
          className={`relative px-6 py-2 rounded-lg text-lg font-semibold ${
            activeTab === tab ? "text-white bg-blue-600" : "text-gray-600 bg-gray-300"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
          {activeTab === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-blue-600 rounded-lg"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
