"use client";
import Link from "next/link";
import React from "react";
import { HeartIcon, Search, ShoppingCart, UserRound } from "lucide-react";
import HeaderBottom from "./header-bottom";
import useUser from "apps/user-ui/src/hooks/useUser";
import { SignInSection } from "../../components/sign-in-header";
import { useStore } from "apps/user-ui/src/store";

const Header = () => {
  const { user, isLoading } = useUser();
  const username = user ? user.name.split(" ")[0] : "Sign In";
  const isGuest = username === "Sign In";
  const targetHref = isGuest ? "/login" : "/profile";
  const wishlist = useStore((state) => state.wishlist);
  const cart = useStore((state) => state.cart);
  return (
    <div className="w-full bg-white">
      <div className="w-[80%] py-5 m-auto flex items-center justify-between">
        <div>
          <Link href={"/"}>
            <span className="text-3xl font-[500] ">Eshop</span>
          </Link>
        </div>
        <div className="w-[50%] relative mx-10">
          <input
            type="text"
            placeholder="Search for products... "
            className="w-full px-4 font-Poppins font-medium border-[2.5px] border-[#3489ff] outline-none h-[55px]"
          />
          <div className="w-[60px] cursor-pointer flex items-center justify-center h-[55px] bg-[#3489ff] absolute top-0 right-0">
            <Search color="white" />
          </div>
        </div>
        <div className="flex items-center gap-8 pb-2">
          <div className="flex items-center gap-2">
            {/* <SignInSection
              isLoading={isLoading}
              username={user ? user.name.split(" ")[0] : "Sign In"}
            /> */}
            <>
              <Link
                href={targetHref}
                className="border-2 w-[50px] h-[50px] flex-shrink-0 flex items-center justify-center rounded-full border-[#010f1c1a]"
              >
                <UserRound size={26} />
              </Link>

              <div className="w-[80px] flex flex-col gap-1">
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-3 w-10 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-sm font-medium leading-tight">
                      {isGuest ? "Welcome," : "Hello,"}
                    </div>
                    <Link
                      href={targetHref}
                      className="text-sm font-semibold text-gray-700 hover:text-blue-700 leading-tight truncate"
                    >
                      {username}
                    </Link>
                  </>
                )}
              </div>
            </>
          </div>
          <div className="flex items-center gap-5">
            <Link href={"/wishlist"} className="relative">
              <HeartIcon />
              <div className="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                <span className="text-white font-medium text-sm">
                  {wishlist.length}
                </span>
              </div>
            </Link>
            <Link href={"/cart"} className="relative">
              <ShoppingCart />
              <div className="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                <span className="text-white font-medium text-sm">
                  {cart.length}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className="border-b border-b-[#99999938]" />
        <HeaderBottom />
      </div>
    </div>
  );
};

export default Header;
