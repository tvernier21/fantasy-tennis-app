'use client';

import React, { useCallback } from "react"
import {useSearchParams, usePathname, useRouter } from "next/navigation";
import qs from "query-string";

import BookmarkButton from "../BookmarkButton"
import Thumbnail from "../Thumbnail"
import path from "path";

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
                rounded-xl w-full relative overflow-hidden bg-gray-100 p-3 cursor-pointer transition-colors duration-300
                hover:shadow-md hover:bg-gray-200
                ${selected ? 'bg-gray-200' : ''}
            `}
            onClick={handleClick}        
        >
            <div className="flex items-center justify-between">
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
                {showBookmark && (
                    <BookmarkButton saved={false}/>
                )}
            </div>
        </div>
    );  
}

export default SidebarItem;