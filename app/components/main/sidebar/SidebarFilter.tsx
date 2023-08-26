'use client';

import React, { useState } from 'react';

import Heading from '../../Heading';
import PlayersFilter from './PlayersFilter';
import TournamentsFilter from './TournamentsFilter';

interface SidebarFilterProps {
    category?: string | null;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
    category,
}) => {
    
    return (
        <div className="rounded-xl w-full relative overflow-hidden bg-gray-500 p-10 cursor-pointer transition-colors mb-3">
            {category === "players" &&
                <PlayersFilter />
            }
            {category === "tournaments" &&
                <TournamentsFilter />
            }
        </div>
    )
}

export default SidebarFilter;