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



interface DataTableProps {
  type: "creators" | "brands";
  data: any[];
}

const DataTable = ({ type, data }: DataTableProps) => {
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const openModal = (profile: any) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  // Open Image Modal
  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  // Close Image Modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };
  // Toggle dropdown for the action menu
  const toggleDropdown = (rowId: string) => {
    setDropdownOpen((prev) => (prev === rowId ? null : rowId));
  };

  // Close dropdown when clicking outside
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

  // Handle delete action
  const handleDelete = (id: string) => {
    console.log(`Deleting row with ID: ${id}`);
    // Add delete logic here (e.g., API call)
    setDropdownOpen(null);
  };

  interface VerifyAccountData {
    companyEmail: string;
  }

  const handleVerifyAccount = async (data: VerifyAccountData): Promise<void> => {
    const res = await api.get(`/brand/verify-brand/${data.companyEmail}`);
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
                      alt="Brand Logo"
                      className="w-12 h-12 rounded-full object-cover shadow-md cursor-pointer"
                      onClick={() => openImageModal(row.original.profileIcon)}
                    />
                  </div>
                ) : null,
            },
            { accessorKey: "name", header: "Name" },
            { accessorKey: "email", header: "Email" },
            { accessorKey: "isProfileCompleted", header: "Profile Completed" },
            { accessorKey: "isDeleted", header: "Deleted" },
            { accessorKey: "isEmailVerified", header: "Email Verified" },
            {
              accessorKey: "profile",
              header: "Profile Data",
              cell: ({ row }) =>
                row.original.profile && (
                  <button
                    onClick={() => openModal(row.original.profile)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-blue-700 active:scale-95 focus:ring focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="View Profile Details"
                  >
                    View Profile
                  </button>
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
                    <div
                      className={`dropdown-menu ${row.id} absolute top-0 right-10 w-28 bg-white border rounded-lg shadow-lg z-10 overflow-hidden`}
                    >
                      {/* Triangle Indicator */}
                      {/* <div className="absolute -right-2 top-3 w-4 h-4 rotate-45 bg-white border border-gray-300"></div> */}

                      <button
                        onClick={() => handleDelete(row.id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
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
                row.original.isAccountVerified ? (
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
                        onClick={() => handleDelete(row.id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ),
            },
          ],
    [dropdownOpen, type]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <table className="w-full border-collapse border border-gray-300">
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
      {/* Modal for Profile Data */}
      <ProfileModal
        profile={selectedProfile}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Image Modal for Enlarged Profile Picture */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
          onClick={closeImageModal}
        >
          <div className="relative p-2 rounded-lg">
            <button
              className="absolute top-[-2] right-0 text-gray-600 hover:text-gray-900 text-xl cursor-pointer leading-none"
              onClick={closeImageModal}
            >
              ✖
            </button>
            <Image
              src={selectedImage}
              width={300}
              height={300}
              alt="Enlarged Profile"
              className="rounded-lg object-cover max-w-full max-h-[80vh] mx-auto"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DataTable;
