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
        <div className="flex flex-col md:flex-row h-screen justify-center items-center"> {/* Added h-screen to fill height */}
            <div className="flex md:w-full w-full rounded-xl overflow-hidden"> {/* Added rounded corners */}
                <div className="md:w-1/4 w-full h-screen overflow-y-auto bg-white rounded-l-xl"> {/* Added rounded left corner */}
                    <SideBar data={data} category={category}/>
                </div>
                <div className="md:w-3/4 w-full h-screen bg-white rounded-r-xl"> {/* Added rounded right corner */}
                    <DataPage />
                </div>
            </div>
        </div>
    )   
}

export default Contents;