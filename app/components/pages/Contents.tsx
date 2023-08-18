'use client';

import React, { useState } from "react"
import { usePathname, useSearchParams } from 'next/navigation';

import HomePage from "./HomePage"
import SidebarItem from "../SidebarItem"
import Heading from "../Heading"

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
    }[] | null;
    tournaments?: string;
}

const Contents: React.FC<ContentsProps> = ({
    players,
    tournaments
}) => {
    const params = useSearchParams();
    const category = params?.get('category');
  
    if (!category) {
        return (
            <div className="pb-24">
                <HomePage />
            </div>
        )
    }

    return (
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 w-full justify-center h-screen overflow-y-auto pr-3">
            {category === 'Players' &&
                <div className="w-full max-w-md">
                    <Heading
                        center
                        title = {category}
                    />
                    <div>
                        {players?.map((player) => (
                            <div className="mb-2">
                                <SidebarItem 
                                    key={player.id}
                                    title={player.name}
                                    description={player.elo[0].toString()}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            }
          </div>
          <div className="md:w-3/4 w-full">
            Right Side Content
          </div>
        </div>
    )   
}

export default Contents;