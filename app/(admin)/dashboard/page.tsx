"use client";

import { useCallback, useEffect } from "react";
import Sidebar from "../../../components/SideBar";
import Header from "../../../components/Header";
import DataTable from "../../../components/DataTable";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import { setCreators } from "../../../store/slices/creatorSlice";
import { setBrands } from "../../../store/slices/brandSlice";
import { setCollaborations } from "../../../store/slices/collaborationSlice"; // Import setCollaborations action
import { api } from "../../../utils/apiConfig";
import { logout } from "../../../store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.tab.activeTab);
  const creators = useSelector((state: RootState) => state.creators.list);
  const brands = useSelector((state: RootState) => state.brands.list);
  const collaborations = useSelector(
    (state: RootState) => state.collab.list // Add collaborations to Redux state
  );
  const router = useRouter();

  // Fetch creators data
  const fetchCreatorsData = useCallback(async () => {
    try {
      const res = await api.get("/admin/get-creators");
      const formattedData = res.data.data?.map((creator: any) => ({
        id: creator._id,
        name: creator.fullName,
        email: creator.email,
        profileIcon: creator.profileIcon,
        isProfileCompleted: creator.isProfileCompleted ? "Yes" : "No",
        isEmailVerified: creator.isEmailVerified ? "Yes" : "No",
        isAccountVerified: creator.isAccountVerified ? "Yes" : "No",
        requestToDeleteAccount: creator.requestToDeleteAccount ? "Yes" : "No",
        profile: creator.profile,
      }));

      dispatch(setCreators(formattedData));
    } catch (err) {
      console.error("Error fetching creators:", err);
    }
  }, [dispatch]);

  // Fetch brands data
  const fetchBrandsData = useCallback(async () => {
    try {
      const res = await api.get("/admin/get-brands");
      const formattedData = res.data.data?.map((brand: any) => ({
        id: brand._id,
        name: brand.fullName,
        companyName: brand.companyName,
        companyEmail: brand.companyEmail,
        companyWebsite: brand.companyWebsite,
        isAccountVerified: brand.isAccountVerified ? "Yes" : "No",
        requestToDeleteAccount: brand.requestToDeleteAccount ? "Yes" : "No",
        profileIcon: brand.profileIcon,
      }));

      dispatch(setBrands(formattedData));
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  }, [dispatch]);

  // Fetch collaborations data
  const fetchCollaborationsData = useCallback(async () => {
    try {
      const res = await api.get("/admin/get-collabs"); // Add endpoint to fetch collaborations data
      console.log(res.data,'res.data')
      const formattedData = res.data.data?.map((collab: any) => ({
        id: collab._id,
        campaignName: collab?.campaignId?.campaignName,
        brandName: collab?.campaignId?.brandName,
        campaign: collab?.campaignId, // object
        brandEmail: collab?.brandId?.companyEmail, // Assuming there’s a nested brand object
        creatorEmail: collab.creatorId?.fullName, // Assuming there’s a nested creator object
        creator:collab?.creatorId, // object
        status: collab.status,
        videos:collab?.videos, // array of objects
        createdAt: new Date(collab.createdAt).toLocaleDateString(),
      }));

      dispatch(setCollaborations(formattedData));
    } catch (err) {
      console.error("Error fetching collaborations:", err);
    }
  }, [dispatch]);

  // Fetch data based on the active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "creators") {
          await fetchCreatorsData();
        } else if (activeTab === "brands") {
          await fetchBrandsData();
        } else if (activeTab === "collaborations") {
          await fetchCollaborationsData(); // Fetch collaborations data
        }
      } catch (err) {
        if (err.response?.status === 403) {
          await api.post("/logout");
          dispatch(logout());
          router.push("/login");
        }
        console.error(`Error fetching ${activeTab}:`, err);
      }
    };

    fetchData();
  }, [activeTab, fetchCreatorsData, fetchBrandsData, fetchCollaborationsData, dispatch, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          {/* Header */}
          <Header />

          {/* Content Area */}
          <main className="flex-1 px-4 md:px-6 lg:px-8 py-3 transition-all duration-200">
            {/* Content Container */}
            <div className="max-w-[2000px] mx-auto">
              {/* Data Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-4 md:px-6 py-2">
                  <h2 className="text-xl md:text-2xl font-bold mb-4">
                    {activeTab === "creators"
                      ? "Creators List"
                      : activeTab === "brands"
                      ? "Brands List"
                      : "Collaborations List"} {/* Update header dynamically */}
                  </h2>
                  <div className="overflow-x-auto overflow-y-hidden">
                    {activeTab === "creators" && (
                      <DataTable type="creators" data={creators} fetchCreatorsData={fetchCreatorsData} />
                    )}
                    {activeTab === "brands" && (
                      <DataTable type="brands" data={brands} fetchBrandsData={fetchBrandsData} />
                    )}
                    {activeTab === "collaborations" && (
                      <DataTable
                        type="collaborations"
                        data={collaborations} // Pass collaborations data to the DataTable component
                        fetchCollaborationsData={fetchCollaborationsData} // Pass fetch function for collaborations
                      />
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
