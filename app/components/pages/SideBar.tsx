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
    console.log(data)

    return (
        <div>
            <div className="w-full max-w-md">
                <SidebarHeader category={category} />
                <SidebarList data={data} category={category}/>
            </div>
        </div>
    )
}  

export default SideBar;