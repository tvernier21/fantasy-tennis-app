'use client';

import React from "react"
import { usePathname } from 'next/navigation';

import HomePage from "./HomePage"
import SideBar from "./sidebar/SideBar"
import Content from "./content/Contents"

interface MainPageProps {
    data: {
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
        date: Date; 
        surface: string; 
        difficulty: number; 
        img: string | null; 
        link: string | null; 
        createdAt: Date; 
        updatedAt: Date; }[]
}

const MainPage: React.FC<MainPageProps> = ({
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
                    <Content category={category}/>
                </div>
            </div>
        </div>
    )   
}

export default MainPage;