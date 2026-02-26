"use client";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "apps/seller-ui/src/utils/axiosInstance";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const {} = useQuery({
    queryKey: ["shop-discounts"],
    queryFn: async () => {
        const res = await axiosInstance.get("/product/api/get-discount-codes");
        return res?.data?.discount_codes || [];
    }
  })
  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex justify-center items-center mb-1">
        <h2 className="text-2xl text-white font-semibold">Discount Codes</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> Create Discount
        </button>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center text-white">
        <Link href={"/dashoboard"} className="text-[#80Deea] cursor-pointer">Dashoboard </Link>
        <ChevronRight size={20} className="opacity-[.8]" />
        <span>Discount Codes</span>
      </div>

      <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
            Your Discount Codes
        </h3>
      </div>
    </div>
  );
};

export default Page;
