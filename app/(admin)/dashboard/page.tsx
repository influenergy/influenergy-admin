"use client";

import { useEffect } from "react";
import Sidebar from "../../../components/SideBar";
import Header from "../../../components/Header";
import Tabs from "../../../components/Tabs";
import DataTable from "../../../components/DataTable";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import { setActiveTab } from "../../../store/slices/tabSlice";
import { setCreators } from "../../../store/slices/creatorSlice";
import { setBrands } from "../../../store/slices/brandSlice";
import { api } from "../../../utils/apiConfig";

export default function Dashboard() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.tab.activeTab);
  const creators = useSelector((state: RootState) => state.creators.list);
  const brands = useSelector((state: RootState) => state.brands.list);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(activeTab, "Active Tab");
        let res: { data: { data: any[] } }, formattedData: any[];

        if (activeTab === "creators") {
          res = await api.get("/admin/get-creators");
          console.log(res.data, "Creators Data");

          formattedData = res.data.data?.map((creator: any) => ({
            id: creator._id,
            name: creator.fullName,
            email: creator.email,
            profileIcon: creator.profileIcon,
            isProfileCompleted: creator.isProfileCompleted ? "Yes" : "No",
            isAccountDeleted: creator.isAccountDeleted ? "Yes" : "No",
            isEmailVerified: creator.isEmailVerified ? "Yes" : "No",
            profile: creator.profile,
          }));

          dispatch(setCreators(formattedData));
        } else if (activeTab === "brands") {
          res = await api.get("/admin/get-brands");
          console.log(res.data, "Brands Data");

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
        console.error(`Error fetching ${activeTab}:`, err);
      }
    };

    fetchData();
  }, [activeTab, dispatch]);
  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />

        <div className="p-6">
          <div className="mt-6 bg-white rounded-lg p-4 shadow">
            {activeTab === "creators" && (
              <DataTable type="creators" data={creators} />
            )}
            {activeTab === "brands" && (
              <DataTable type="brands" data={brands} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
