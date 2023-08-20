'use client';

import React from 'react';

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
    }[] | null;
    category?: string | null;
}

const SidebarList: React.FC<SidebarListProps> = ({
    data,
    category
}) => {
    return (
        <div>
            {category === 'Players' && (
                <div>
                    {data?.map((player) => (
                        <div className="mb-2 ml-2">
                            <SidebarItem 
                                key={player.id}
                                title={player.name}
                                description={player.elo[0].toString()}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SidebarList;