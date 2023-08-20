'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import qs from 'query-string';

import { IconType } from 'react-icons';

interface CategoryBoxProps {
    label: string;
    pathname: string;
    icon: IconType;
    selected?: boolean;
    description?: string;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    label,
    pathname,
    selected,
    icon: Icon
}) => {
    const router = useRouter();

    return (
        <div 
            className={`
                flex flex-col items-center justify-center gap-3 p-4 border-p-3 hover:text-neutral-800 transition cursor-pointer
                ${selected ? "border-b-neutral-800" : "text-neutral-500"}
                ${selected ? "text-neutral-800" : "text-neutral-500"}
            `}
            onClick={() => router.push(pathname)}
        >   
            <Icon size={24} />
            <div className="font-medium text-sm">
                {label}
            </div>
        </div>    
    )
}

export default CategoryBox