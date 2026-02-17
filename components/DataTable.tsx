"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import Image from "next/image";
import ProfileModal from "./ProfileModal";
import { BsThreeDotsVertical } from "react-icons/bs";
import { api } from "../utils/apiConfig";
import VideoModal from "./videosModal";
import CampaignModal from "./CampaignModal";
import CollaborationVideoModal from "./CollaborationVideoModal";
import React from "react";
import { current } from "@reduxjs/toolkit";

interface CreatorFilter {
  name?: string;
  email?: string;
  budget?: string;
  city?: string;
  createdAt?: string;
  page?: number
  profileFilter?: string;
}

interface BrandFilter {
  companyName: string,
  companyEmail: string
}

interface DataTableProps {
  type: "creators" | "brands" | "collaborations";
  data: any[];
  otherInfo?:
  {
    page: number,
    count: number,
    totalPages: number,
    totalCount: number,
    cities: string[],
  };
  fetchCreatorsData?: (filters?: CreatorFilter) => void;
  fetchBrandsData?: (filter?: BrandFilter) => void;
  fetchCollaborationsData?: () => void;
}

interface VerifyAccountData {
  companyEmail: string;
}

const DataTable = ({
  type,
  data,
  otherInfo,
  fetchCreatorsData,
  fetchBrandsData,
  fetchCollaborationsData,
}: DataTableProps) => {


  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isCollaborationVideModalOpen, setIsCollaborationVideoModalOpen] =
    useState(false);
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const [loadingPaymentId, setLoadingPaymentId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1)

  const [pageIndex, setPageIndex] = useState(0);


  // Compute unique cities and budget range for creators
  const cityOptions = useMemo(() => {
    if (type !== "creators") return [];
    const cities = data.map((item) => item.profile?.city).filter(Boolean);
    return Array.from(new Set(cities));
  }, [data, type]);

  // Filter state for creators and brands
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    budget: "",
    city: "",
    createdAt: "",
    companyName: "",
    companyEmail: "",
    profileFilter: "profiled",
  });


  const openModal = (profile: any) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };
  const openSocialVideoModal = (profile: any) => {
    setSelectedProfile(profile);
    setSelectedVideos(profile.socialVideos);
    setIsVideoModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };
  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideos(null);
    setSelectedProfile(null);
  };

  const openCampaignModal = (campaign: any, amount: number) => {
    setSelectedCampaign({ ...campaign, amount });
    setCampaignModalOpen(true);
  };

  const closeCampaignModal = () => {
    setCampaignModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleOpenModal = (video: any) => {
    setSelectedVideo(video);
    setIsCollaborationVideoModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCollaborationVideoModalOpen(false);
    setSelectedVideo(null);
  };
  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const toggleDropdown = (rowId: string) => {
    setDropdownOpen((prev) => (prev === rowId ? null : rowId));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownOpen &&
        !(event.target as HTMLElement).closest(
          ".dropdown-menu, .dropdown-button"
        )
      ) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);
  

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = async (id: string, userType: string) => {
    try {
      // Confirm deletion
      const isConfirmed = window.confirm(
        `Are you sure you want to delete this ${userType}?`
      );
      if (!isConfirmed) return;

      const response = await api.delete(`/admin/delete/${id}/${userType}`);

      if (response.status === 200) {
        console.log("✅ User deleted successfully");
        userType === "creator" ? fetchCreatorsData() : fetchBrandsData();
        alert("User deleted successfully"); // Show success alert
        setDropdownOpen(null); // Close dropdown after successful deletion
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error: any) {
      console.error("❌ Error deleting user:", error);

      // Show user-friendly error message
      alert(
        error.response?.data?.message ||
        "Failed to delete user. Please try again."
      );
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleVerifyAccount = async (
    data: VerifyAccountData
  ): Promise<void> => {
    try {
      const res = await api.get(`/brand/verify-brand/${data.companyEmail}`);

      if (res.status === 200) {
        alert(res.data.message || "✅ Verification email sent successfully!");
        console.log("✅ Account verification email sent:");
      } else {
        alert(res.data.message || "⚠️ Unexpected response");
        console.warn("⚠️ Unexpected response status:", res.status);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send verification email";
      alert(`❌ ${errorMessage}`);
      console.error(
        "❌ Error verifying account:",
        error.response?.data?.message
      );
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleVerifyAccountCreator = async (id: string) => {
    try {
      // Call the API to verify the account
      const response = await api.put(`/creator/verify-account/${id}`);

      // Optionally, trigger a re-fetch of data or update the row state
      alert(response.data.message || "Account verified successfully!");
      fetchCreatorsData();
    } catch (error: any) {
      console.error("Verification failed:", error);
      alert(
        `Failed to verify account: ${error.response?.data?.message || error.message
        }.`
      );
    }
  };

  const handlePaymentDone = useCallback(
    async (collaborationId: string, amount: number) => {
      const isConfirmed = window.confirm(
        `Are you sure that you have completed the payment of $${amount} to this creator?`
      );

      if (isConfirmed) {
        setLoadingPaymentId(collaborationId); // Disable the button

        try {
          await api.put(`/admin/collaboration/payment-done/${collaborationId}`);
          alert("Payment status updated successfully!");
          fetchCollaborationsData();
          // You might want to trigger a re-fetch here to update the UI
        } catch (error) {
          console.error("Payment update failed", error);
          alert("Failed to update payment status. Please try again.");
        } finally {
          setLoadingPaymentId(null); // Re-enable the button after response
        }
      }
    },
    [fetchCollaborationsData]
  );

  const hasPaymentStatus = data.some((item) => item.paymentStatus);
  

  const columns: ColumnDef<any>[] = useMemo(() => {
    if (type === "creators") {
      return [
        {
          accessorKey: "profileIcon",
          header: "Profile Photo",
          cell: ({ row }) =>
            row.original.profileIcon ? (
              <div className="flex justify-center">
                <Image
                  src={row.original.profileIcon}
                  width={50}
                  height={50}
                  alt="Profile"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-md cursor-pointer"
                  onClick={() => {
                    openImageModal(row.original.profileIcon);
                  }}
                  unoptimized
                />
              </div>
            ) : null,
        },
        {
          accessorKey: "name",
          header: "Name",
          cell: ({ row }) => (
            <div className="font-medium">{row.original.name}</div>
          ),
        },
        {
          accessorKey: "email",
          header: "Email",
          cell: ({ row }) => (
            <div className="text-sm md:text-base truncate w-full">
              {row.original.email}
            </div>
          ),
        },
        {
          accessorKey: "isAccountVerified",
          header: "Account Verified",
          cell: ({ row }) => {
            const isVerified = row.original.isAccountVerified === "Yes";

            return (
              <div className="flex items-center space-x-2 justify-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}
                >
                  {isVerified ? "Verified" : "Unverified"}
                </span>

                {!isVerified && (
                  <button
                    onClick={() => handleVerifyAccountCreator(row.original.id)}
                    className="cursor-pointer px-2 py-1 text-xs md:text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Verify
                  </button>
                )}
              </div>
            );
          },
        },

        {
          accessorKey: "isEmailVerified",
          header: "Email Verified",
          cell: ({ row }) => (
            <span
              className={`px-2 py-1 rounded-full text-xs md:text-sm ${row.original.isEmailVerified === "Yes"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
                }`}
            >
              {row.original.isEmailVerified}
            </span>
          ),
        },
        {
          accessorKey: "actions1",
          header: "Actions",
          cell: ({ row }) => {
            // Debug: log the profile object (remove or comment out in production)
            return (
              <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                {row.original.profile && Object.keys(row.original.profile).length > 0 && (
                  <button
                    onClick={() => {
                      openModal(row.original.profile)
                    }}
                    className="bg-blue-600 text-white px-3 py-1.5 text-xs md:text-sm rounded-lg transition-all duration-200 hover:bg-blue-700 active:scale-95 focus:ring cursor-pointer focus:ring-blue-300 w-full md:w-auto"
                  >
                    Profile
                  </button>
                )}
                {row.original.profile?.socialVideos?.length > 0 && (
                  <button
                    onClick={() => openSocialVideoModal(row.original.profile)}
                    className="bg-purple-600 text-white px-3 py-1.5 text-xs md:text-sm rounded-lg transition-all duration-200 hover:bg-purple-700 active:scale-95 focus:ring focus:ring-purple-300 w-full md:w-auto cursor-pointer"
                  >
                    Videos
                  </button>
                )}
              </div>
            );
          },
        },
        {
          accessorKey: "actions3",
          header: "Requested to Delete Account",
          cell: ({ row }) => (
            <span
              className={`px-2 py-1 rounded-full text-xs md:text-sm ${row.original.requestToDeleteAccount === "Yes"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
                }`}
            >
              {row.original.requestToDeleteAccount}
            </span>
          ),
        },
        {
          id: "action1",
          header: "",
          cell: ({ row }) => (
            <div className="relative flex justify-center">
              <button
                className="dropdown-button p-2 rounded-full hover:bg-gray-200 transition"
                aria-label="More options"
                onClick={() => toggleDropdown(row.id)}
              >
                <BsThreeDotsVertical className="text-xl text-gray-600 hover:text-gray-800" />
              </button>
              {dropdownOpen === row.id && (
                <div className="dropdown-menu absolute top-0 right-10 w-28 bg-white border rounded-lg shadow-lg z-10 overflow-hidden">
                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      if (
                        row.original.requestToDeleteAccount === "Yes" &&
                        row.original.id
                      ) {
                        handleDelete(row.original.id, "creator");
                      }
                    }}
                    className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 ${row.original.requestToDeleteAccount === "No"
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                      }`}
                    disabled={row.original.requestToDeleteAccount === "No"}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ),
        },
      ];
    } else if (type === "brands") {
      return [
        {
          accessorKey: "id",
          header: "S/N",
          cell: ({ row }) => Number(row.id) + 1,
        },
        { accessorKey: "companyName", header: "Brand Name" },
        { accessorKey: "companyEmail", header: "Email" },
        { accessorKey: "companyWebsite", header: "Company Website" },
        {
          accessorKey: "isAccountVerified",
          header: "Account Verified",
          cell: ({ row }) =>
            row.original.isAccountVerified === "Yes" ? (
              <span className="text-green-600 font-medium">Verified</span>
            ) : (
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded-lg transition-all duration-200 ease-in-out hover:bg-blue-700 active:scale-95 focus:ring focus:ring-blue-300 cursor-pointer"
                onClick={() => handleVerifyAccount(row.original)}
              >
                Verify
              </button>
            ),
        },
        {
          accessorKey: "actions4",
          header: "Requested to Delete Account",
          cell: ({ row }) => (
            <span
              className={`px-2 py-1 rounded-full text-xs md:text-sm ${row.original.requestToDeleteAccount === "Yes"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
                }`}
            >
              {row.original.requestToDeleteAccount}
            </span>
          ),
        },
        {
          id: "action2",
          header: "",
          cell: ({ row }) => (
            <div className="relative flex justify-center">
              <button
                className="dropdown-button p-2 rounded-full hover:bg-gray-200 transition"
                aria-label="More options"
                onClick={() => toggleDropdown(row.id)}
              >
                <BsThreeDotsVertical className="text-xl text-gray-600 hover:text-gray-800" />
              </button>
              {dropdownOpen === row.id && (
                <div
                  className={`dropdown-menu ${row.id} absolute top-0 right-10 w-28 bg-white border rounded-lg shadow-lg z-10 overflow-hidden`}
                >
                  {/* Triangle Indicator */}
                  {/* <div className="absolute -right-2 top-3 w-4 h-4 rotate-45 bg-white border border-gray-300"></div> */}

                  <button
                    onClick={() => {
                      if (
                        row.original.requestToDeleteAccount === "Yes" &&
                        row.original.id
                      ) {
                        handleDelete(row.original.id, "brand");
                      }
                    }}
                    className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 ${row.original.requestToDeleteAccount === "No"
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                      }`}
                    disabled={row.original.requestToDeleteAccount === "No"}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ),
        },
      ];
    } else {      
      return [
        {
          accessorKey: "id",
          header: "S/N",
          cell: ({ row }) => Number(row.id) + 1,
        },
        {
          accessorKey: "brandInfo",
          header: "Brand Info",
          cell: ({ row }) => (
            <div className="text-sm">
              <p className="font-medium">{row.original.brandName}</p>
              <p className="text-gray-600">{row.original.companyEmail}</p>
            </div>
          ),
        },
        { accessorKey: "companyWebsite", header: "Company Website" },
        {
          accessorKey: "campaign",
          header: "Campaign",
          cell: ({ row }) => (
            <button
              className="truncate max-w-[200px] cursor-pointer text-blue-600 underline"
              onClick={() =>
                openCampaignModal(row.original.campaign, row.original.amount)
              }
            >
              Details
            </button>
          ),
        },
        { accessorKey: "creatorName", header: "Creator Name" },
        { accessorKey: "creatorEmail", header: "Creator Email" },
        {
          accessorKey: "videos",
          header: "Collaboration Videos",
          cell: ({ row }) => (
            <div className="space-y-2">
              <button
                onClick={() => handleOpenModal(row.original.videos)}
                className="bg-blue-500 text-white px-3 py-1 cursor-pointer rounded hover:bg-blue-600 transition"
              >
                Videos
              </button>
            </div>
          ),
        },
        {
          accessorKey: "status",
          header: "Collaboration Status",
          cell: ({ row }) => (
            <span
              className={`px-2 py-1 rounded-full text-xs ${row.original.status === "Active"
                ? "bg-green-100 text-green-800"
                : row.original.status === "Completed"
                  ? "bg-blue-100 text-blue-800"
                  : row.original.status === "Cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
            >
              {row.original.status}
            </span>
          ),
        },
        ...(hasPaymentStatus
          ? [
            {
              accessorKey: "paymentStatus",
              header: "Payment Status",
              cell: ({ row }) => {
                const status = row.original.paymentStatus || "Pending";
                const statusClasses = {
                  Cancelled: "bg-red-100 text-red-800",
                  "Under Process": "bg-yellow-100 text-yellow-800",
                  Done: "bg-green-100 text-green-800",
                  Pending: "bg-gray-100 text-gray-800",
                };

                return (
                  <div className=" items-center gap-2">
                    {status !== "Pending" ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${statusClasses[status]}`}
                      >
                        {status}
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          handlePaymentDone(
                            row.original.id,
                            row.original.amount
                          )
                        }
                        disabled={loadingPaymentId === row.original.id}
                        className={`bg-blue-500 text-white px-2 py-1 rounded text-xs transition cursor-pointer ${loadingPaymentId === row.original.id
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-600"
                          }`}
                      >
                        {loadingPaymentId === row.original.id
                          ? "Processing..."
                          : `Make Payment ${row.original.campaign.budgetForCampaign}`}
                      </button>
                    )}
                  </div>
                );
              },
            },
          ]
          : []),
      ];
    }
  }, [
    dropdownOpen,
    handleDelete,
    handlePaymentDone,
    handleVerifyAccount,
    handleVerifyAccountCreator,
    hasPaymentStatus,
    loadingPaymentId,
    type,
  ]);

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const fetchFilteredData = useCallback(() => {
    setPageIndex(0);
    if (type === "creators") {
      fetchCreatorsData({
        name: filters.name,
        page: 1,
        email: filters.email,
        budget: filters.budget,
        city: filters.city,
        createdAt: filters.createdAt,
        profileFilter: filters.profileFilter,
      });
    } else if (type === "brands") {
      fetchBrandsData({
        companyName: filters.companyName,
        companyEmail: filters.companyEmail,
      });
    } else {
      fetchCollaborationsData?.();
    }
  }, [type, filters.name, filters.email, filters.budget, filters.city, filters.createdAt, filters.companyName, filters.companyEmail, filters.profileFilter, fetchCreatorsData, fetchBrandsData, fetchCollaborationsData, setPageIndex]);


  const handlePageChange = (page: number) => {
    if (type === "creators") {
      fetchCreatorsData({
        name: filters.name,
        page: page,
        email: filters.email,
        budget: filters.budget,
        city: filters.city,
        createdAt: filters.createdAt,
        profileFilter: filters.profileFilter,
      });
    } else if (type === "brands") {
      fetchBrandsData({
        companyName: filters.companyName,
        companyEmail: filters.companyEmail,
      });
    } else {
      fetchCollaborationsData?.();
    }
  }

  return (
    <div className="w-full">
      {/* Filter Section for Creators */}
      {type === "creators" && (
        <div className="flex flex-wrap gap-4 mb-6 bg-white p-6 rounded-xl shadow-sm items-end border border-gray-200">
          <div className="flex flex-col min-w-[160px]">
            <select
              value={filters.profileFilter}
              onChange={(e) => setFilters((f) => ({ ...f, profileFilter: e.target.value }))}
              className="font-bold border-3 border-purple-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 transition bg-purple-50 text-purple-800 cursor-pointer shadow-md hover:bg-purple-100 hover:border-purple-700"
              style={{ minHeight: '44px', fontSize: '1rem' }}
            >
              <option value="profiled" className="font-bold text-purple-700 bg-white">Profiled</option>
              <option value="non_profiled" className="font-bold text-purple-700 bg-white">Non-profiled</option>
            </select>
          </div>
          <div className="flex flex-col min-w-[160px]">
            <label className="block text-xs font-semibold text-gray-600 mb-2">Name</label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition placeholder:text-gray-400"
              placeholder="Search by name"
            />
          </div>
          <div className="flex flex-col min-w-[160px]">
            <label className="block text-xs font-semibold text-gray-600 mb-2">Email</label>
            <input
              type="email"
              value={filters.email}
              onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition placeholder:text-gray-400"
              placeholder="Search by email"
            />
          </div>
          {filters.profileFilter === "profiled" && <>
            <div className="flex flex-col min-w-[220px]">
              <label className="block text-xs font-semibold text-gray-600 mb-2">Budget Sort</label>
              <select
                value={filters.budget}
                onChange={(e) => setFilters((f) => ({ ...f, budget: e.target.value }))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition bg-white cursor-pointer"
              >
                <option value="">All</option>
                <option value="highest">Highest</option>
                <option value="lowest">Lowest</option>
              </select>
            </div>
            <div className="flex flex-col min-w-[160px]">
              <label className="block text-xs font-semibold text-gray-600 mb-2">City</label>
              <select
                value={filters.city}
                onChange={(e) => {
                  setFilters((f) => ({ ...f, city: e.target.value }))}}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition bg-white cursor-pointer"
              >
                <option value="">All</option>
                {otherInfo?.cities.map((city) => (
                  <option key={city.toLowerCase()} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </>
          }
          <div className="flex flex-col min-w-[140px]">
            <label className="block text-xs font-semibold text-gray-600 mb-2">Created At</label>
            <select
              value={filters.createdAt}
              onChange={(e) => setFilters((f) => ({ ...f, createdAt: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition bg-white cursor-pointer"
            >
              <option value="">All</option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <button
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition cursor-pointer"
            onClick={() => { fetchFilteredData() }}
          >
            Filter
          </button>
          <button
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition cursor-pointer"
            onClick={() => {
              // setCurrentPage(1)
              setFilters({
                name: "",
                email: "",
                budget: "",
                city: "",
                createdAt: "",
                companyName: "",
                companyEmail: "",
                profileFilter: "profiled",
              })
            }
            }
          >
            Reset
          </button>
        </div>
      )}
      {/* Filter Section for Brands */}
      {type === "brands" && (
        <div className="flex flex-wrap gap-4 mb-6 bg-white p-6 rounded-xl shadow-sm items-end border border-gray-200">
          <div className="flex flex-col min-w-[160px]">
            <label className="block text-xs font-semibold text-gray-600 mb-2">Brand Name</label>
            <input
              type="text"
              value={filters.companyName}
              onChange={(e) => setFilters((f) => ({ ...f, companyName: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition placeholder:text-gray-400"
              placeholder="Search by brand name"
            />
          </div>
          <div className="flex flex-col min-w-[160px]">
            <label className="block text-xs font-semibold text-gray-600 mb-2">Email</label>
            <input
              type="email"
              value={filters.companyEmail}
              onChange={(e) => setFilters((f) => ({ ...f, companyEmail: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition placeholder:text-gray-400"
              placeholder="Search by email"
            />
          </div>
          <button
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition cursor-pointer"
            onClick={() => {
              fetchFilteredData()
            }}
          >
            Filter
          </button>
          <button
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition cursor-pointer"
            onClick={() => {
              setCurrentPage(1)
              setFilters((f) => ({ ...f, companyName: '', companyEmail: '' }))
            }}
          >
            Reset
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 min-w-[750px]">
          <thead className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border p-3">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border p-3 text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center p-4 flex-wrap gap-2">
        <button
          onClick={() => {
            if (otherInfo?.page > 1) {
              setCurrentPage(otherInfo?.page - 1)
              handlePageChange(otherInfo?.page - 1)
            }
          }}
          disabled={otherInfo?.page === 1}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 cursor-pointer transition-colors"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {otherInfo?.page} of {otherInfo?.totalPages}
        </span>
        <button
          onClick={() => {
            // setPageIndex((prev) => Math.min(prev + 1, otherInfo?.totalPages - 1))
            setCurrentPage(otherInfo?.page + 1)
            handlePageChange(otherInfo?.page + 1)
          }
          }
          disabled={pageIndex === otherInfo?.totalPages - 1}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 cursor-pointer transition-colors"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {selectedProfile && (
        <ProfileModal
          profile={selectedProfile}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
      {selectedVideos && (
        <VideoModal
          videos={selectedVideos || []}
          isOpen={isVideoModalOpen}
          onClose={closeVideoModal}
          profileId={selectedProfile.creator}
          onStatusUpdate={() => {
            fetchCreatorsData();
            closeVideoModal();
          }}
        />
      )}
      {openCampaignModal && (
        <CampaignModal
          campaign={selectedCampaign}
          isOpen={openCampaignModal}
          onClose={closeCampaignModal}
        />
      )}
      {isCollaborationVideModalOpen && (
        <CollaborationVideoModal
          videos={selectedVideo}
          onClose={handleCloseModal}
          isOpen={isCollaborationVideModalOpen}
        />
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          onClick={closeImageModal}
        >
          <div className="relative bg-white p-2 rounded-lg max-w-[90vw] max-h-[90vh]">
            <button
              className="absolute -top-2 -right-2 bg-white rounded-full cursor-pointer w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-md"
              onClick={closeImageModal}
            >
              ✖
            </button>
            <Image
              src={selectedImage}
              width={300}
              height={300}
              alt="Enlarged Profile"
              className="rounded-lg object-cover max-w-full max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
