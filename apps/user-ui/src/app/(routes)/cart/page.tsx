import useDeviceTracking from 'apps/user-ui/src/hooks/useDeviceTracking';
import useLocationTracking from 'apps/user-ui/src/hooks/useLocationTracking';
import useUser from 'apps/user-ui/src/hooks/useUser';
import { useRouter } from 'next/navigation'
import React from 'react'

const CartPage = () => {
  const router = useRouter();
  const {user} = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();
  return (
    <div className='w-full bg-white'>
      <div className='md:w-[80%] w-[95%] mx-auto min-h-screen'>
        <div className="pb-[50px]">
          <h1 className='md:pt-[50px] font-medium text-[44px] leading-[1] mb-[16px] font-Poppins'></h1>
        </div>
      </div>
    </div>
  )
}

export default CartPage