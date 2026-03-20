import React from 'react'

type ShopCardProps = {
    shop: {
        id: string;
        name: string;
        description: string;
        avatar: string;
        coverBanner?: string;
        address?: string;
        followers?: [];
        rating?: number;
        category?: string;
    };
}

const ShopCard: React.FC<ShopCardProps> = ({shop}) => {
  return (
    <div>ShopCard</div>
  )
}

export default ShopCard