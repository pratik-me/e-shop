"use client";
import useSeller from "apps/seller-ui/src/hooks/useSeller";
import useSidebar from "apps/seller-ui/src/hooks/useSidebar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { Box } from "../box";
import Link from "next/link";
import { Sidebar } from "./sidebar.styles";
import SidebarItem from "./sidebar.item";
import SidebarMenu from "./sidebar.menu";
import {
  BellPlusIcon,
  BellRing,
  CalendarPlusIcon,
  ListOrderedIcon,
  LogOut,
  MailIcon,
  PackageSearchIcon,
  ReceiptIndianRupeeIcon,
  Settings,
  SquarePlusIcon,
  TicketPercentIcon,
} from "lucide-react";
import HomeIcon from "apps/seller-ui/src/assets/svgs/HomeIcon";
import ShopIcon from "apps/seller-ui/src/assets/svgs/logo-icon";

const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();
  const { seller } = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#0085ff" : "#969696";


  return (
    <Box
      $styles={{
        height: "100vh",
        zIndex: "202",
        position: "sticky",
        padding: "8px",
        top: "0",
        overflowY: "scroll",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header>
        <Box>
          <Link href={"/"} className="flex justify-center text-center gap-2 ">
            <ShopIcon />
            <Box>
              <h3 className="text-xl font-medium text-[#ecedee]">
                {seller?.shop?.name}
              </h3>

              <h5 className="font-medium text-xs text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px] pl-2">
                {seller?.shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>
      <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
          <SidebarItem
            title="Dashboard"
            icon={<HomeIcon />}
            isActive={activeSidebar === "/dashboard"}
            href={"/dashboard"}
          />
          <div className="mt-2 block">
            <SidebarMenu title="Main Menu">
              <SidebarItem
                isActive={activeSidebar === "/orders"}
                title="Orders"
                href="/dashboard/orders"
                icon={<ListOrderedIcon />}
              />
              <SidebarItem
                isActive={activeSidebar === "/dashboard/payments"}
                title="Payments"
                href="/dashboard/payments"
                icon={
                  <ReceiptIndianRupeeIcon
                    color={getIconColor("/dashboard/payments")}
                  />
                }
              />
            </SidebarMenu>

            <SidebarMenu title="Products">
              <SidebarItem
                isActive={activeSidebar === "/dashboard/create-product"}
                title="Create Product"
                href="/dashboard/create-product"
                icon={<SquarePlusIcon />}
              />
              <SidebarItem
                isActive={activeSidebar === "/dashboard/all-products"}
                title="All Products"
                href="/dashboard/all-products"
                icon={<PackageSearchIcon />}
              />
            </SidebarMenu>

            <SidebarMenu title="Events">
              <SidebarItem
                isActive={activeSidebar === "/dashboard/create-event"}
                title="Create Event"
                href="/dashboard/create-event"
                icon={<CalendarPlusIcon color={getIconColor("/dashboard/create-event")}/>}
              />
              <SidebarItem
                isActive={activeSidebar === "/dashboard/all-events"}
                title="All Events"
                href="/dashboard/all-events"
                icon={<BellPlusIcon />}
              />
            </SidebarMenu>

            <SidebarMenu title="Controllers">
              <SidebarItem
                isActive={activeSidebar === "/dashboard/inbox"}
                title="Inbox"
                href="/dashboard/inbox"
                icon={<MailIcon />}
              />
              <SidebarItem
                isActive={activeSidebar === "/dashboard/settings"}
                title="Settings"
                href="/dashboard/settings"
                icon={<Settings />}
              />
              <SidebarItem
                isActive={activeSidebar === "/dashboard/notification"}
                title="Notifications"
                href="/dashboard/notifications"
                icon={<BellRing />}
              />
            </SidebarMenu>

            <SidebarMenu title="Extras">
              <SidebarItem
                isActive={activeSidebar === "/dashboard/discount-codes"}
                title="Discount Codes"
                href="/dashboard/discount-codes"
                icon={<TicketPercentIcon />}
              />
              <SidebarItem
                isActive={activeSidebar === "/logout"}
                title="Logout"
                href="/"
                icon={<LogOut />}
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SidebarWrapper;
