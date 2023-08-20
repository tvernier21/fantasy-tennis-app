'use client';

import React from "react"
import { useSearchParams } from 'next/navigation';

import HomePage from "./HomePage"
import SideBar from "./SideBar"
import DataPage from "./DataPage"

interface ContentsProps {
    players?: {
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
    }[] | null | undefined;
    tournaments?: null | undefined;
}

const Contents: React.FC<ContentsProps> = ({
    players,
    tournaments
}) => {
    const params = useSearchParams();
    const category = params?.get('category');

    const [data, setData] = React.useState<null | {
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
    }[] | undefined>(null);;

    React.useEffect(() => {
        if (category === 'Players') {
            setData(players);
        } else if (category === 'Tournaments') {
            setData(tournaments);
        } else {
            setData(null);
        }
    }, [category, players, tournaments]);
  
    if (!category) {
        return (
            <div className=" pt-3 h-full">
                <HomePage />
            </div>
        )
    }

    return (
        <div className="flex flex-col md:flex-row pt-3">
          <div className="md:w-1/4 w-full justify-center h-screen overflow-y-auto pr-3 bg-white">
            <SideBar data={data} category={category}/>
          </div>
          <div className="md:w-3/4 w-full bg-white">
            <DataPage />
          </div>
        </div>
    )   
}

export default Contents;