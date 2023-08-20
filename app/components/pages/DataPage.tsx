'use client';

import React from "react"
import { useSearchParams } from 'next/navigation';

import Heading from "../Heading";

interface DataPageProps {
    category: string | null | undefined;
}

const DataPage: React.FC<DataPageProps> = ({
    category
}) => {
    // Get the current path name and fetch corresponding player or tournament data
    const params = useSearchParams();
    const selected = params?.get("selected");

    return (
        <div className="pt-22">
            <Heading 
                title={category}
                subtitle={selected}
            />
        </div>
    )
}

export default DataPage