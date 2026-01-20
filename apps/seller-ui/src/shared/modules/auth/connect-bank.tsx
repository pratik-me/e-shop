import StripeLogo from 'apps/seller-ui/src/assets/svgs/stripe-icon'
import axios from 'axios'
import React from 'react'

const ConnectBank = ({sellerId} : {sellerId: string}) => {
    const connectStripe = async() => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-stripe-link`, {sellerId})
            if(response.data.url) window.location.href = response.data.url;
        } catch (error) {
            console.log(`Stripe error: ${error}`)
        }
    }
    return (
        <div className='text-center'>
            <h3 className='text-2xl font-semibold mb-4'>Withdraw Method</h3>
            <br />
            <button className='w-full m-auto flex items-center justify-center gap-3 text-lg bg-[#334155] text-white py-2 rounded-lg' 
            onClick={connectStripe}>
                Connect Stripe <StripeLogo/>
            </button>
        </div>
    )
}

export default ConnectBank