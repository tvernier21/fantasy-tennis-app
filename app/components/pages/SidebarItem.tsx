'use client';

import React, { useCallback } from "react"
import {useSearchParams, usePathname, useRouter } from "next/navigation";
import qs from "query-string";

import BookmarkButton from "../BookmarkButton"
import Thumbnail from "../Thumbnail"

interface SidebarItemProps {
    title: string;
    description: string;
    category: string;
    selected: boolean;
    secondaryText?: string;
    img?: string | null | undefined;
    showBookmark?: boolean;
    saved?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    title,
    description,
    selected,
    secondaryText,
    img,
    showBookmark,
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const handleClick = useCallback(() => {
        let currentQuery = {};
        let basePath = '/'
        
        if (params) {
            currentQuery = qs.parse(params.toString())
        }

        if (pathname) {
            basePath = pathname.split('/')[1]
        }

        const updatedQuery: any = {
            ...currentQuery,
            selected: title
        }

        const url = qs.stringifyUrl({
            url: basePath,
            query: updatedQuery
        }, { skipNull: true });

        router.push(url);
    }, [title, router, params]);

    return (
        <div 
            className={`
                rounded-xl w-full h-32 relative overflow-hidden bg-gray-100 p-3 cursor-pointer transition-colors duration-300
                hover:shadow-md hover:bg-gray-200
                ${selected ? 'bg-neutral-500/50' : ''}
            `}
            onClick={handleClick}        
        >
            <div className="flex items-center justify-between h-full">
                {/* Thumbnail */}
                <div className="flex-shrink-0" style={{flexBasis: showBookmark ? '20%' : '33.33%'}}>
                    <Thumbnail img={img} />
                </div>

    
                {/* Text */}
                <div className="ml-4 overflow-hidden" style={{flexBasis: showBookmark ? '60%' : '66.66%'}}>
                    <a href="#" className="block h-full overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-2 truncate">{title}</h3>
                        <p className="text-gray-600 mb-1 truncate">{description}</p>
                        {secondaryText && 
                            <p className="text-gray-500 truncate">{secondaryText}</p>
                        }
                    </a>
                </div>

    
                {/* Bookmark Button */}
                {showBookmark && (
                    <div className="flex-shrink-0" style={{flexBasis: '20%'}}>
                        <BookmarkButton saved={false}/>
                    </div>
                )}
            </div>
        </div>
    );    
}

export default SidebarItem;