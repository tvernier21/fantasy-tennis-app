'use client';

import React from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

import SidebarFilter from './SidebarFilter';
import SidebarList from './SidebarList';


interface SideBarProps {
    data?: {
        id: string; 
        name: string; 
        age: number | null; 
        rank: number; 
        elo: number;
        createdAt: Date; 
        updatedAt: Date; 
    }[] | {
        id: string; 
        name: string; 
        location: string;
        date: string;
        surface: string;
        difficulty: number;
        img?: string | null | undefined;
        link?: string | null | undefined;
        createdAt: Date; 
        updatedAt: Date; 
    }[] | null | undefined;
    category?: string | null;
}

const SideBar: React.FC<SideBarProps> = ({
    data,
    category
}) => {
    const numData = 5

    return (
        <div>
            <div className="w-full max-w-md mb-2">
                <SidebarFilter category={category} numData={numData} />
                <SidebarList data={data} category={category}/>
            </div>
        </div>
    )
}  

export default SideBar;