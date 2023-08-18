'use client';

import React from "react"

import Thumbnail from "./Thumbnail"

interface SidebarItemProps {
    title: string;
    description: string;
    secondaryText?: string;
    img?: string | null | undefined;
    saved?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    title,
    description,
    secondaryText,
    img,
    saved
}) => {
    return (
        <div className="rounded-xl w-full relative overflow-hidden bg-gray-100 p-4 hover:bg-gray-200 transition-colors duration-300">
            <div className="flex items-center">
                <Thumbnail img={img} />
                <div className="ml-4">
                    <a href="#" className="block">
                        <h3 className="text-xl font-semibold mb-2">{title}</h3>
                        <p className="text-gray-600 mb-1">{description}</p>
                        {secondaryText && 
                            <p className="text-gray-500">{secondaryText}</p>
                        }
                    </a>
                </div>
            </div>
            {/* Uncomment the below line if you want to use the LikeButton */}
            {/* <LikeButton saved={saved} /> */}
        </div>
    );  
}

export default SidebarItem;