'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import Description from "./Description";
import DataPage from "./DataPage";
import EmptyState from '../../EmptyState';

interface ContentProps {
    category: string | null | undefined;
}

const Content: React.FC<ContentProps> = ({
    category
}) => {
    // Get the current path name and fetch corresponding player or tournament data
    const selected = useSearchParams()?.get("selected");

    if (!selected) {
        return(
            <div>
                <EmptyState 
                    subtitle={`Select ${category} to view data`} 
                />
            </div>
        );
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Heading section */}
            <div className="w-full bg-gray-700 z-10 shadow-sm flex-shrink-0 h-1/5">
                    <Description
                        category={category}
                    />
                    {/* <Description data={descriptionData}/> */}
            </div>
    
            {/* Tabulated content section */}
            <div className="w-full h-4/5 overflow-y-auto">
                <DataPage 
                    category={category}
                />
            </div>
        </div>
    );
    
}

export default Content