'use client';

import React from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

import SidebarHeader from './SidebarHeader';
import SidebarList from './SidebarList';
import SidebarItem from './SidebarItem';
import Heading from '../Heading';


interface SideBarProps {
    data?: {
        id: string; 
        name: string; 
        age: number | null; 
        rank: number; 
        elo: number[]; 
        hard_elo: number[]; 
        clay_elo: number[]; 
        grass_elo: number[]; 
        createdAt: Date; 
        updatedAt: Date; 
    }[] | null;
    category?: string | null;
}

const SideBar: React.FC<SideBarProps> = ({
    data,
    category
}) => {
    const router = useRouter();

    //push first item of data to url

    return (
        <div>
            {category === 'Players' &&
                <div className="w-full max-w-md">
                    <SidebarHeader category={category} />
                    <SidebarList data={data} category={category}/>
                </div>
            }
        </div>
    )
}  

export default SideBar;