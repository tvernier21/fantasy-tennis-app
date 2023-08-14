'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import qs from 'query-string';

import { IconType } from 'react-icons';

interface CategoryBoxProps {
    label: string;
    icon: IconType;
    selected?: boolean;
    description?: string;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    label,
    icon: Icon,
    selected
}) => {
    const router = useRouter();
    const params = useSearchParams();

    const handleClick = useCallback(() => {
        let currentQuery = {}; 

        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        const updatedQuery: any = {
            ...currentQuery,
            category: label
        }

        if (params?.get('category') === label) {
            return null
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, {skipNull: true});

        router.push(url);
    }, [label, params, router]);

    return (
        <div 
            className={`
                flex flex-col items-center justify0center gap-3 p-4 border-p-3 hover:text-neutral-800 transition cursor-pointer
                ${selected ? "border-b-neutral-800" : "text-neutral-500"}
                ${selected ? "text-neutral-800" : "text-neutral-500"}
            `}
            onClick={handleClick}
        >   
            <Icon size={24} />
            <div className="font-medium text-sm">
                {label}
            </div>
        </div>    
    )
}

export default CategoryBox