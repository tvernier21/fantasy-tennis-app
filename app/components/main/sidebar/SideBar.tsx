'use client';

import React from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

import SidebarFilter from './SidebarFilter';
import SidebarList from './SidebarList';


interface SideBarProps {
    data: any;
    category?: string | null;
}

const SideBar: React.FC<SideBarProps> = ({
    data,
    category
}) => {
    return (
        <div>
            <div className="w-full max-w-md mb-2 bg-gray-700">
                <SidebarFilter category={category} />
                <SidebarList data={data} category={category}/>
            </div>
        </div>
    )
}  

export default SideBar;