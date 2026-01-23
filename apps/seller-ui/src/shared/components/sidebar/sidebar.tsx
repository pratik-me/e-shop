'use client';
import useSeller from 'apps/seller-ui/src/hooks/useSeller';
import useSidebar from 'apps/seller-ui/src/hooks/useSidebar';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'
import { Box } from '../box';
import Link from 'next/link';
import { Sidebar } from './sidebar.styles';
import ShopLogo from 'apps/seller-ui/src/assets/svgs/shop-logo';
import SidebarItem from './sidebar.item';
import HomeIcon from 'apps/seller-ui/src/assets/svgs/HomeIcon';
import SidebarMenu from './sidebar.menu';
import { BellPlusIcon, BellRing, CalendarPlusIcon, Inbox, ListOrderedIcon, LogOut, Mail, MailIcon, PackageSearchIcon, ReceiptIndianRupeeIcon, Settings, SettingsIcon, SquarePlusIcon, TicketPercentIcon } from 'lucide-react';

const SidebarWrapper = () => {
  const {activeSidebar, setActiveSidebar} = useSidebar();
  const pathName = usePathname();
  const {seller} = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar])

  const getIconColor = (route: string) => activeSidebar === route ? "#0085ff" : "#969696";
  return (
    <Box $styles={{height: "100vh", zIndex: "202", position: "sticky", padding: "8px", top: "0", overflowY: "scroll", scrollbarWidth: "none",}} className='sidebar-wrapper'>
      <Sidebar.Header>
        <Box>
          <Link href={"/"} className='flex justify-center text-center gap-2 '>
            <ShopLogo/>
            <Box>
              <h3 className='text-xl font-medium text-[#ecedee]'>
                {seller?.shop?.name}
              </h3>

              <h5 className='font-medium text-xs text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px] pl-2'>
                {seller?.shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>
      <div className='block my-3 h-full'>
        <Sidebar.Body className='body sidebar'>\
          <SidebarItem title="Dashboard" icon={<HomeIcon/>} isActive={activeSidebar === "/dashboard"} href={"/dashboard"}/>
          <div className='mt-2 block'>

            <SidebarMenu title='Main Menu'>
              <SidebarItem isActive={activeSidebar === "/orders"} title="Orders" href='/dashboard/orders' icon={<ListOrderedIcon/>} />
              <SidebarItem isActive={activeSidebar === "/dashboard/payments"} title="Payments" href='/dashobard/payments' icon={<ReceiptIndianRupeeIcon/>} />
            </SidebarMenu>

            <SidebarMenu title='Products'>
              <SidebarItem isActive={activeSidebar === "/dashboard/create-product"} title="Create Product" href='/dashobard/create-product' icon={<SquarePlusIcon/>} />
              <SidebarItem isActive={activeSidebar === "/dashboard/all-products"} title="All Products" href='/dashobard/all-products' icon={<PackageSearchIcon/>} />
            </SidebarMenu>

            <SidebarMenu title='Events'>
              <SidebarItem isActive={activeSidebar === "/dashobard/create-event"} title='Create Event' href='/dashobard/create-event' icon={<CalendarPlusIcon />} />
              <SidebarItem isActive={activeSidebar === "/dashobard/all-events"} title='All Events' href='/dashobard/all-events' icon={<BellPlusIcon />} />
            </SidebarMenu>

            <SidebarMenu title='Controllers'>
              <SidebarItem isActive={activeSidebar === "/dashobard/inbox"} title='Inbox' href='/dashobard/inbox' icon={<MailIcon />} />
              <SidebarItem isActive={activeSidebar === "/dashobard/settings"} title='Settings' href='/dashobard/settings' icon={<Settings />} />
              <SidebarItem isActive={activeSidebar === "/dashobard/notification"} title='Notifications' href='/dashobard/notifications' icon={<BellRing/>} />
            </SidebarMenu>

            <SidebarMenu title='Extras'>
              <SidebarItem isActive={activeSidebar === "/dashobard/discount-codes"} title='Discount Codes' href='/dashobard/discount-codes' icon={<TicketPercentIcon/>} />
              <SidebarItem isActive={activeSidebar === "/logout"} title='Logout' href='/' icon={<LogOut/>} />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  )
}

export default SidebarWrapper