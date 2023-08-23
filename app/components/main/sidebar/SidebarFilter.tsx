'use client';

import React, { useState } from 'react';

import Heading from '../../Heading';
import PlayersFilter from './PlayersFilter';
import TournamentsFilter from './TournamentsFilter';

interface SidebarFilterProps {
    category?: string | null;
    numData?: number | null | undefined
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
    category,
    numData
}) => {
    
    return (
        <div className="rounded-xl w-full h-90 relative overflow-hidden bg-gray-100 p-4 cursor-pointer transition-colors mb-3">
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