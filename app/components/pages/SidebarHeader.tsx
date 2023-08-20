'use client';

import React from 'react';

import Heading from '../Heading';

interface SidebarHeaderProps {
    category?: string | null;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
    category
}) => {
    return (
        <div className="mb-4 mt-4">
            <a>
                <Heading
                    center
                    title = {category}
                    subtitle='filters coming soon!'
                />  
            </a>
        </div>
    )
}

export default SidebarHeader;