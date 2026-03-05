import { Star } from 'lucide-react';
import React, { FC } from 'react'

type Props = {
    rating: number
}

const Ratings: FC<Props> = ({rating}) => {
    const stars = [];
    for(let i = 0; i <= 5; i++) {
        if(i <= rating) {
            stars.push(<Star color="#ffc107" fill="#ffc107" />)
        } else {
          stars.push(<Star color="#ccc" fill='none'/>)
        }
    }
  return (
    <div className='flex gap-1'>{stars}</div>
  );
}

export default Ratings