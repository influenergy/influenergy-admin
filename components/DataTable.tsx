"use client";

import { useEffect, useMemo, useState } from "react";
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

interface DataTableProps {
  type: "creators" | "brands";
  data: any[];
  fetchCreatorsData?: () => void;
  fetchBrandsData?: () => void;
}

const DataTable = ({
  type,
  data,
  fetchCreatorsData,
  fetchBrandsData,
}: DataTableProps) => {
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = useMemo(() => {
    return data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }, [data, pageIndex]);

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

  const openImageModal = (imageUrl: string) => {
    console.log(imageUrl, "Image URL");
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

  interface VerifyAccountData {
    companyEmail: string;
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleVerifyAccount = async (
    data: VerifyAccountData
  ): Promise<void> => {
    try {
      const res = await api.get(`/brand/verify-brand/${data.companyEmail}`);

      if (res.status === 200) {
        alert(res.data.message || "✅ Verification email sent successfully!");
        console.log("✅ Account verification email sent:", res.data);
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

  const columns: ColumnDef<any>[] = useMemo(
    () =>
      type === "creators"
        ? [
            {
              accessorKey: "profileIcon",
              header: "Profile",
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
                        console.log("clicked");
                        openImageModal(row.original.profileIcon);
                      }}
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
                <div className="text-sm md:text-base truncate max-w-[150px] md:max-w-[200px]">
                  {row.original.email}
                </div>
              ),
            },
            {
              accessorKey: "isProfileCompleted",
              header: "Profile",
              cell: ({ row }) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                    row.original.isProfileCompleted === "Yes"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {row.original.isProfileCompleted}
                </span>
              ),
            },
            {
              accessorKey: "isAccountDeleted",
              header: "Status",
              cell: ({ row }) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                    row.original.isAccountDeleted === "No"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {row.original.isAccountDeleted === "No"
                    ? "Active"
                    : "Deleted"}
                </span>
              ),
            },
            {
              accessorKey: "isEmailVerified",
              header: "Verified",
              cell: ({ row }) => (
                <span
                  className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                    row.original.isEmailVerified === "Yes"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {row.original.isEmailVerified}
                </span>
              ),
            },
            {
              accessorKey: "actions",
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                  {row.original.profile && (
                    <button
                      onClick={() => openModal(row.original.profile)}
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
              ),
            },
            {
              id: "action",
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
                            row.original.isAccountDeleted === "No" &&
                            row.original.id
                          ) {
                            handleDelete(row.original.id, "creator");
                          }
                        }}
                        className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 ${
                          row.original.isAccountDeleted === "Yes"
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }`}
                        disabled={row.original.isAccountDeleted === "Yes"}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ),
            },
          ]
        : [
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
            { accessorKey: "isAccountDeleted", header: "Account Deleted" },
            {
              id: "action",
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
                            row.original.isAccountDeleted === "No" &&
                            row.original.id
                          ) {
                            handleDelete(row.original.id, "brand");
                            // fetchBrandsData();
                          }
                        }}
                        className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 ${
                          row.original.isAccountDeleted === "Yes"
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }`}
                        disabled={row.original.isAccountDeleted === "Yes"}
                      >
                        {/* {console.log(row.original.isAccountDeleted)} */}
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ),
            },
          ],
    [dropdownOpen, handleDelete, handleVerifyAccount, type]
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-hidden">
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
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
          disabled={pageIndex === 0}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 cursor-pointer transition-colors"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {pageIndex + 1} of {totalPages}
        </span>
        <button
          onClick={() =>
            setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))
          }
          disabled={pageIndex === totalPages - 1}
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
