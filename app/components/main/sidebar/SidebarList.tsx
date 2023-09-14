'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import SidebarItem from './SidebarItem';
import { SafeUser } from '@/app/types';
import HomePage from '../HomePage';

interface SidebarListProps {
    data: any;
    category?: string | null;
    currentUser?: SafeUser | null;
}


const SidebarList: React.FC<SidebarListProps> = ({
    data,
    category,
    currentUser,
}) => {
    const params = useSearchParams();
    const selected = params?.get('selected');
    
    return (
        <div>
            {category === 'players' ? (
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
            ) : category === 'tournaments' ? (
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
            ) : category == "leagues" ? (
                <div>
                    {data?.map((league, i) => (
                        <div className="mb-2 ml-2 mr-2" key={i}>
                            <SidebarItem 
                                id={league.id}
                                title={league.name}
                                category={category}
                                selected={selected === league.name}
                                img={league.img}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <HomePage currentUser={currentUser}/>
                </div>
            )}
        </div>
    )
};

export default SidebarList;