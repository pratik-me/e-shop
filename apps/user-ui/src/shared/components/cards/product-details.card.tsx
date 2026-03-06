import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Ratings from "../ratings";
import {
  Heart,
  MapPin,
  MessageCircleMore,
  ShoppingCart,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Params = {
  data: any;
  setOpen: (open: boolean) => void;
};

const ProductDetailsCard = ({ data, setOpen }: Params) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isSelected, setIsSelected] = useState(data?.colors?.[0] || "");
  const [isSizeSelected, setIsSizeSelected] = useState(data?.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);

  //! Static Data for now
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5)

  const router = useRouter();

  return (
    <div
      className="fixed flex items-center justify-center top-0 left-0 h-screen w-full bg-[#0000001d] z-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[90%] md:w-[70%] lg:w-[60%] max-h-[85vh] overflow-y-auto min-h-[70vh] p-6 md:p-8 bg-white shadow-xl rounded-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10">
          <X size={25} onClick={() => setOpen(false)} />
        </button>
        <div className="w-full flex flex-col md:flex-row gap-8 md:gap-0">
          {/* Image */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-4 border border-gray-100">
              <Image
                src={data?.images?.[activeImage]?.url}
                alt={data?.title || "Product Image"}
                width={400}
                height={400}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-thin">
              {data?.images?.map((image: any, index: number) => (
                <div
                  key={index}
                  className={`flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                    activeImage === index
                      ? "border-blue-600"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={image?.url}
                    alt={`Thumbnail ${index}`}
                    width={80}
                    height={80}
                    /* Used object-cover so thumbnail images fill the box perfectly */
                    className="w-16 h-16 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
            {/* Seller Info */}
            <div className="border-b pb-4 border-gray-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0 w-full">
                {/* Shop Logo */}
                <Image
                  src={
                    data?.Shop?.avatar ||
                    "https://ik.imagekit.io/aleph0/product-1772526247164_qMI01Mlqp.jpg"
                  }
                  alt="Shop Logo"
                  width={60}
                  height={60}
                  className="rounded-full w-[60px] h-[60px] min-w-[60px] object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/shop/${data?.Shop?.id}`}
                    className="text-lg font-medium truncate block w-full"
                  >
                    {data?.Shop?.name}
                  </Link>

                  {/* Shop Ratings */}
                  <span className="block mt-1">
                    <Ratings rating={data?.Shop?.ratings} />
                  </span>

                  {/* Shop Location */}
                  <div className="text-gray-600 mt-1 flex items-start gap-2">
                    <MapPin size={20} className="flex-shrink-0 mt-0.5" />
                    <p className="break-words min-w-0">
                      {data?.Shop?.address || "Location not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chatting with Seller Button */}
              <button
                className="flex-shrink-0 self-start lg:self-auto flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap"
                onClick={() => router.push(`/inbox?shopId=${data?.Shop?.id}`)}
              >
                <MessageCircleMore size={14} />
                <span>Chat with Seller</span>
              </button>
            </div>
            <h3 className="text-xl font-semibold mt-3 break-words">
              {data?.title}
            </h3>
            <p className="mt-2 text-gray-700 whitespace-pre-wrap w-full">
              {data?.short_description}
            </p>

            {/* Brand */}
            {data?.brand && (
              <p className="mt-2">
                <strong>Brand: </strong> {data.brand}
              </p>
            )}

            {/* Color and Size Selection */}
            <div className="flex flex-col md:flex-row items-start gap-5 mt-4">
              {/* Color Options */}
              {data?.colors?.length > 0 && (
                <div>
                  <strong>Color: </strong>
                  <div className="flex gap-2 mt-1">
                    {data.colors.map((color: string, index: number) => (
                      <button
                        key={index}
                        className={`w-8 h-8 cursor-pointer rounded-full border-2 transition ${
                          isSelected === color
                            ? "border-gray-400 scale-110 shadow-md"
                            : "border-transparent"
                        }`}
                        onClick={() => setIsSelected(color)}
                        style={{ background: color }}
                      ></button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Options */}
              {data?.sizes?.length > 0 && (
                <div>
                  <strong>Sizes: </strong>
                  <div className="flex gap-2 mt-1">
                    {data.sizes.map((size: string, index: number) => (
                      <button
                        key={index}
                        className={`px-4 py-1 cursor-pointer rounded-md transition ${
                          isSizeSelected === size
                            ? "bg-gray-800 text-white"
                            : "bg-gray-300 text-black"
                        }`}
                        onClick={() => setIsSizeSelected(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Options */}
            <div className="mt-5 flex items-center gap-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                ${data?.sale_price}
              </h3>
              {data?.regular_price !== data?.sale_price && (
                <h3 className="text-lg text-red-600 line-through">
                  ${data.regular_price}
                </h3>
              )}
            </div>

            <div className="mt-5 flex items-center gap-5">
              <div className="flex items-center rounded-md">
                <button
                  className="px-3 cursor-pointer py-1 bg-gray-300 hover:bg-gray-400 font-semibold rounded-l-md"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className="px-4 bg-gray-400 py-1">{quantity}</span>
                <button
                  className="px-3 py-1 cursor-pointer bg-gray-300 hover:bg-gray-400 font-semibold rounded-r-md"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#ff5722] hover:bg-[#e64a19] text-white font-medium rounded-lg transition">
                <ShoppingCart size={18} /> 
                <span>Add to Cart</span>
              </button>
              <button className="opacity-[.7] cursor-pointer">
                <Heart size={30} fill="red" color="transparent" />
              </button>
            </div>
            <div className="mt-3">
              {data.stock > 0 ? (
                <span className="text-green-600 font-semibold">In Stock</span>
              ) : (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              )}
            </div>
            <div className="mt-3 text-gray-600 text-sm">
                Estimated Delivery:
                <strong>{` ${estimatedDelivery.toDateString()}`}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
