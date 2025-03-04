import { useTransition, useEffect } from "react";
import { FaUsers, FaBuilding, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { setActiveTab } from "../store/slices/tabSlice";
import { motion } from "framer-motion";
import { logout } from "../store/slices/authSlice";
import { api } from "../utils/apiConfig";


const Sidebar = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "creators";

  const [isPending, startTransition] = useTransition();
  const activeTab = useSelector((state: any) => state.tab.activeTab);

  const router = useRouter()

  useEffect(() => {
    startTransition(() => {
      dispatch(setActiveTab(currentTab as "creators" | "brands"));
    });
  }, [currentTab, dispatch]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");

      dispatch(logout()); 
      router.push("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <aside className="w-72 h-screen bg-gray-900 text-white flex flex-col justify-between shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center tracking-wide">
          Admin Panel
        </h2>
      </div>

      <nav className="flex-1">
        <ul className="space-y-3">
          {[
            {
              name: "Creators",
              href: "/dashboard?tab=creators",
              icon: <FaUsers />,
            },
            {
              name: "Brands",
              href: "/dashboard?tab=brands",
              icon: <FaBuilding />,
            },
          ].map(({ name, href, icon }) => (
            <motion.li
              key={name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={href}
                className={`flex items-center space-x-3 px-5 py-3 rounded-lg text-lg font-medium transition-all ${
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

      <div className="p-6">
        <button
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all shadow-md cursor-pointer animate-beat"
          onClick={() => handleLogout()}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
