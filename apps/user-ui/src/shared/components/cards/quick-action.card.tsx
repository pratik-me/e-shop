import { LucideIcon } from 'lucide-react'
import React from 'react'

type Props = {
    Icon: LucideIcon;
    title: string;
    description: string;
}

const QuickActionCard = ({Icon, title, description} : Props) => {
  return (
    <div className='bg-white p-4 rounded-md shadow-sm border border-gray-100 flex items-start gap-4'>
        <Icon className='w-6 h-6 text-blue-500 mt-1'/>
        <div>
            <h4 className='text-sm font-semibold text-gray-800 mb-1'>
                {title}
            </h4>
            <p className='text-xs text-gray-500'>
                {description}
            </p>
        </div>
    </div>
  )
}

export default QuickActionCard