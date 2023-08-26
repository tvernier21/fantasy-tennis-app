'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import SidebarItem from './SidebarItem';

interface SidebarListProps {
    data: any;
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
                    {data?.map((player, i) => (
                        <div className="mb-2 ml-2 mr-2" key={i}>
                            <SidebarItem 
                                id={player.id}
                                title={player.name}
                                category={category}
                                description={player.rank.toString()}
                                secondaryText={player.elo.toString()}
                                selected={selected === player.name}
                                showBookmark
                            />
                        </div>
                    ))}
                </div>
            )}
            {category === 'tournaments' && (
                <div>
                    {data?.map((tournament, i) => (
                        <div className="mb-2 ml-2 mr-2" key={i}>
                            <SidebarItem 
                                id={tournament.id}
                                title={tournament.name}
                                category={category}
                                description={tournament.date.toLocaleDateString()}
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
};

export default SidebarList;