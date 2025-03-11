"use client";

import { useEffect } from "react";
import Sidebar from "../../../components/SideBar";
import Header from "../../../components/Header";
import DataTable from "../../../components/DataTable";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import { setActiveTab } from "../../../store/slices/tabSlice";
import { setCreators } from "../../../store/slices/creatorSlice";
import { setBrands } from "../../../store/slices/brandSlice";
import { api } from "../../../utils/apiConfig";
import { logout } from "../../../store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.tab.activeTab);
  const creators = useSelector((state: RootState) => state.creators.list);
  const brands = useSelector((state: RootState) => state.brands.list);
  const router = useRouter();

  const handleStatusChange = () => {
    if (activeTab === "creators") {
      fetchCreatorsData();
    }
  };
  
  const fetchCreatorsData = async () => {
    try {
      const res = await api.get("/admin/get-creators");
      const formattedData = res.data.data?.map((creator: any) => ({
        id: creator._id,
        name: creator.fullName,
        email: creator.email,
        profileIcon: creator.profileIcon,
        isProfileCompleted: creator.isProfileCompleted ? "Yes" : "No",
        isAccountDeleted: creator.isAccountDeleted ? "Yes" : "No",
        isEmailVerified: creator.isEmailVerified ? "Yes" : "No",
        profile: creator.profile,
        videos: creator.socialVideos,
      }));
  
      dispatch(setCreators(formattedData));
    } catch (err) {
      console.error("Error fetching creators:", err);
    }
  };

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res: { data: { data: any[] } }, formattedData: any[];

        if (activeTab === "creators") {
          await fetchCreatorsData();
        } else if (activeTab === "brands") {
          res = await api.get("/admin/get-brands");
          formattedData = res.data.data?.map((brand: any) => ({
            id: brand._id,
            name: brand.fullName,
            companyName: brand.companyName,
            companyEmail: brand.companyEmail,
            companyWebsite: brand.companyWebsite,
            isAccountDeleted: brand.isAccountDeleted ? "Yes" : "No",
            isAccountVerified: brand.isAccountVerified ? "Yes" : "No",
          }));

          dispatch(setBrands(formattedData));
        }
      } catch (err) {
        if (err.status === 403) {
          await api.post("/logout");
          dispatch(logout());
          router.push("/login");
        }
        console.error(`Error fetching ${activeTab}:`, err);
      }
    };

    fetchData();
  }, [activeTab, dispatch, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen ">
          {/* Header */}
          <Header />

          {/* Content Area */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-200">
            {/* Content Container */}
            <div className="max-w-[2000px] mx-auto">

              {/* Data Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold mb-4">
                    {activeTab === "creators" ? "Creators List" : "Brands List"}
                  </h2>
                  <div className="overflow-x-auto">
                    {activeTab === "creators" && (
                      <DataTable type="creators" data={creators} onStatusChange={handleStatusChange} />
                    )}
                    {activeTab === "brands" && (
                      <DataTable type="brands" data={brands} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
