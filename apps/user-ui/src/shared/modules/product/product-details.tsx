"use client";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import Ratings from "../../components/ratings";
import Link from "next/link";
import { useStore } from "apps/user-ui/src/store";

const ProductDetails = ({ productDetails }: { productDetails: any }) => {
  const [currentImage, setCurrentImage] = useState(
    productDetails?.images[0]?.url
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSelected, setIsSelected] = useState(
    productDetails?.colors?.[0] || ""
  );
  const [isSizeSelected, setIsSizeSelected] = useState(
    productDetails?.sizes?.[0] || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [priceRange, setPriceRange] = useState([
    productDetails?.sale_price,
    1199,
  ]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const addToCart = useStore((state) => state.addToCart);
  const cart = useStore((state) => state.cart);
  const isInCart = cart.some((item) => item.id === productDetails.id);
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const wishlist = useStore((state) => state.wishlist);
  const isWishlisted = wishlist.some((item) => item.id === productDetails.id);

  const prevImage = () => {
    if (currentImage > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentImage(productDetails?.iamges[currentIndex - 1]);
    }
  };

  const nextImage = () => {
    if (currentIndex < productDetails?.images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentImage(productDetails?.images[currentIndex + 1]);
    }
  };

  const discountPercentage = Math.round(
    ((productDetails.regular_price - productDetails.sale_price) /
      productDetails.regular_price) *
      100
  );
  return (
    <div className="w-full bg-[#f5f5f5] py-5">
      <div className="w-[90%] bg-white lg:w-[80%] mx-auto pt-6 grid grid-cols-1 lg:grid-cols-[28%_44%_28%] gap-6 overflow-hidden">
        {/* Left column - Product Images */}
        <div className="p-4">
          <div className="relative w-full">
            {/* Main image with zoom */}
            <InnerImageZoom
              src={currentImage || ""}
              zoomSrc={currentImage || ""}
              zoomType="hover"
              zoomScale={1.5}
              hideHint={true}
              className="w-full"
            />
          </div>
          <div className="relative flex items-center gap-2 mt-4 overflow-hidden">
            {productDetails?.images?.length > 4 && (
              <button
                className="absolute left-0 bg-white p-2 rounded-full shadow-md z-10"
                disabled={currentIndex === 0}
                onClick={prevImage}
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <div className="flex gap-2 overflow-x-auto">
              {productDetails?.images?.map((img: any, index: number) => (
                <Image
                  key={index}
                  src={img?.url || ""}
                  alt="Thumbnail"
                  width={60}
                  height={60}
                  className={`cursor-pointer border rounded-lg p-1 ${
                    currentImage === img
                      ? "border-blue-500 "
                      : "border-blue-300"
                  }`}
                  onClick={() => {
                    setCurrentImage(img);
                    setCurrentIndex(index);
                  }}
                />
              ))}
            </div>
            {productDetails?.images.length > 4 && (
              <button
                className="absolute left-0 bg-white p-2 rounded-full shadow-md z-10"
                disabled={currentIndex === productDetails?.images.length - 1}
                onClick={nextImage}
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Middle Column - Product details */}
        <div className="p-4">
          <h1 className="text-xl mb-2 font-medium">{productDetails?.title}</h1>
          <div className="w-full flex items-center justify-between">
            <div className="flex gap-2 mt-2 text-yellow-500">
              <Ratings rating={productDetails?.rating} />
              <Link href={"#reviews"} className="text-blue-500 hover:underline">
                (0 Reviews)
              </Link>
            </div>
            <div>
              <Heart
                size={25}
                fill="red"
                className="cursor-pointer"
                color="transparent"
              />
            </div>
          </div>
          <div className="py-2 border-b border-gray-200">
            {productDetails?.brand && (
              <span className="text-gray-500">
                Brand:
                <span className="text-blue-500">
                  {` ${productDetails?.brand}`}
                </span>
              </span>
            )}
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-orange-500">
              ${productDetails?.sale_price}
            </span>
            <div className="flex gap-2 pb-2 text-lg border-b border-b-slate-200">
              <span className="text-gray-400 line-through">
                ${productDetails?.regular_price}
              </span>
              <span className="text-gray-500">-{discountPercentage}%</span>
            </div>
            <div className="mt-2">
              <div className="flex flex-col md:flex-row items-start gap-5 mt-4">
                {/* Color Options */}
                {productDetails?.colors?.length > 0 && (
                  <>
                    <strong>Color: </strong>
                    <div className="flex gap-2 mt-1">
                      {productDetails?.colors?.map(
                        (color: string, index: number) => (
                          <button
                            key={index}
                            className={`w-5 h-5 cursor-pointer rounded-full border-2 transition ${
                              isSelected === color
                                ? "border-gray-400 scale-110 shadow-md"
                                : "border-transparent"
                            }`}
                            onClick={() => setIsSelected(color)}
                            style={{ backgroundColor: color }}
                          />
                        )
                      )}
                    </div>
                  </>
                )}

                {/* Size Options */}
                {productDetails?.sizes?.length > 0 && (
                  <>
                    <strong>Size:</strong>
                    <div className="flex gap-2 mt-1">
                      {productDetails.sizes.map(
                        (size: string, index: number) => (
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
                        )
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-md">
                  <button
                    className="px-3 cursor-pointer py-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-l-md"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 bg-gray-100 py-1">{quantity}</span>
                  <button
                    className="px-3 py-1 cursor-pointer bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-r-md"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
                {productDetails?.stock > 0 ? (
                  <span className="text-green-600 font-semibold">
                    In Stock
                    <span className="text-gray-500 font-medium">
                      (Stock: {productDetails?.stock})
                    </span>
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
