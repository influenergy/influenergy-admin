import { useTransition, useEffect, useState } from "react";
import {
  FaUsers,
  FaBuilding,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { setActiveTab } from "../store/slices/tabSlice";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../store/slices/authSlice";
import { api } from "../utils/apiConfig";

const Sidebar = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "creators";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const activeTab = useSelector((state: any) => state.tab.activeTab);
  const router = useRouter();

  useEffect(() => {
    startTransition(() => {
      dispatch(setActiveTab(currentTab as "creators" | "brands"));
    });
  }, [currentTab, dispatch]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentTab]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      dispatch(logout());
      router.push("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const navigationItems = [
    {
      name: "Creators",
      href: "/dashboard?tab=creators",
      icon: <FaUsers className="text-xl" />,
    },
    {
      name: "Brands",
      href: "/dashboard?tab=brands",
      icon: <FaBuilding className="text-xl" />,
    },
  ];

  const sidebarContent = (
    <>
      <div className="p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-center tracking-wide">
          Admin Panel
        </h2>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2 md:space-y-3">
          {navigationItems.map(({ name, href, icon }) => (
            <motion.li
              key={name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={href}
                className={`flex items-center space-x-3 px-4 md:px-5 py-2 md:py-3 rounded-lg text-base md:text-lg font-medium transition-all ${
                  activeTab === name.toLowerCase()
                    ? "bg-blue-500 text-white shadow-lg"
                    : "hover:bg-gray-800 hover:text-blue-400"
                }`}
              >
                {icon} <span>{name}</span>
                {isPending && activeTab === name.toLowerCase() && (
                  <span className="ml-2 text-sm animate-pulse">Loading...</span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="p-4 md:p-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 md:px-4 py-2 md:py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all shadow-md cursor-pointer"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="">
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-900 text-white md:hidden"
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 h-screen bg-gray-900 text-white flex-col justify-between shadow-lg fixed left-0 top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 bg-gray-900 text-white flex flex-col justify-between shadow-lg z-40 md:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Content Margin for Desktop */}
      <div className="hidden md:block w-64 lg:w-72 flex-shrink-0" />
    </div>
  );
};

export default Sidebar;
