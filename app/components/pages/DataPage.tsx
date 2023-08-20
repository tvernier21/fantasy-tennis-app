'use client';

import React from "react"
import { usePathname, useSearchParams } from 'next/navigation';

interface DataPageProps {
    category: string | null | undefined;
    name: string | undefined;
}

const DataPage: React.FC<DataPageProps> = ({
    name
}) => {
    // Get the current path name and fetch corresponding player or tournament data

    return (
        <div>
            {name}
        </div>
    )
}

export default DataPage