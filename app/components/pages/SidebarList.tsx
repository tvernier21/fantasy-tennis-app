'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import SidebarItem from './SidebarItem';

interface SidebarListProps {
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

const SidebarList: React.FC<SidebarListProps> = ({
    data,
    category
}) => {
    const params = useSearchParams();
    const selected = params?.get('selected');
    
    return (
        <div>
            {category === 'players' && (
                <div>
                    {data?.map((player) => (
                        <div className="mb-2 ml-2 mr-2" key={player.id}>
                            <SidebarItem 
                                title={player.name}
                                category={category}
                                description={player.elo[0].toString()}
                                selected={selected === player.name}
                                showBookmark
                            />
                        </div>
                    ))}
                </div>
            )}
            {category === 'tournaments' && (
                <div>
                    {data?.map((tournament) => (
                        <div className="mb-2 ml-2 mr-2" key={tournament.id}>
                            <SidebarItem 
                                title={tournament.name}
                                category={category}
                                description={tournament.date}
                                secondaryText={tournament.location}
                                selected={selected === tournament.name}
                                img={tournament.img}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SidebarList;