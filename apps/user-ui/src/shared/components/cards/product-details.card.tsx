import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Ratings from "../ratings";
import { MapPin } from "lucide-react";

type Params = {
  data: any;
  setOpen: (open: boolean) => void;
};

const ProductDetailsCard = ({ data, setOpen }: Params) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div
      className="fixed flex items-center justify-center top-0 left-0 h-screen w-full bg-[#0000001d] z-50"
      onClick={() => setOpen(false)}
    >
      <div
      className="w-[90%] md:w-[70%] lg:w-[60%] max-h-[85vh] overflow-y-auto min-h-[70vh] p-4 md:p-6 bg-white shadow-md rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-full">
            <Image
              src={data?.images?.[activeImage]?.url}
              alt={data?.images?.[activeImage]?.url}
              width={400}
              height={400}
              className="w-full rounded-lg object-contain"
            />

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4">
              {data?.images?.map((image: any, index: number) => (
                <div
                  key={index}
                  className={`cursor-pointer border rounded-md ${
                    activeImage === index
                      ? "border-gray-500 pt-1"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={image?.url}
                    alt={`Thumbnail ${index}`}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
            {/* Seller Info */}
            <div className="border-b relative pb-3 border-gray-300 flex items-center justify-between">
              <div className="flex items-start gap-3">
                {/* Shop Logo */}
                <Image
                  src={
                    data?.Shop?.avatar ||
                    "https://ik.imagekit.io/aleph0/product-1772526247164_qMI01Mlqp.jpg"
                  }
                  alt="Shop Logo"
                  width={60}
                  height={60}
                  className="rounded-full w-[60px] h-[60px] object-cover"
                />
                <div>
                  <Link
                    href={`/shop/${data?.Shop?.id}`}
                    className="text-lg font-medium"
                  >
                    {data?.Shop?.name}
                  </Link>

                  {/* Shop Ratings */}
                  <span className="block mt-1">
                    <Ratings rating={data?.Shop?.ratings} />
                  </span>

                  {/* Shop Location */}
                  <p className="text-gray-600 mt-1 flex items-center gap-2">
                    <MapPin size={20} />
                    {data?.Shop?.address || "Location not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
