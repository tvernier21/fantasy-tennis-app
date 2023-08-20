'use client';

import React from "react"
import { usePathname } from 'next/navigation';

import HomePage from "./HomePage"
import SideBar from "./SideBar"
import DataPage from "./DataPage"

interface ContentsProps {
    data: {
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
}

const Contents: React.FC<ContentsProps> = ({
    data,
}) => {
    const pathname = usePathname();
    const category = pathname ? pathname.split('/')[1] : null;

    return (
        <div className="flex flex-col md:flex-row h-screen justify-center items-center"> {/* Added h-screen to fill height */}
            <div className="flex md:w-full w-full rounded-xl overflow-hidden"> {/* Added rounded corners */}
                <div className="md:w-1/4 w-full h-screen overflow-y-auto bg-white rounded-l-xl"> {/* Added rounded left corner */}
                    <SideBar data={data} category={category}/>
                </div>
                <div className="md:w-3/4 w-full h-screen bg-white rounded-r-xl"> {/* Added rounded right corner */}
                    <DataPage category={category}/>
                </div>
            </div>
        </div>
    )   
}

export default Contents;