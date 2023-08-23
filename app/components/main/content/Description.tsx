'use client';

import React from "react"

import Heading from "@/app/components/Heading"

interface DescriptionProps {
    data: any;
}

const Description: React.FC<DescriptionProps> = ({
    data
}) => {
    return(
        <div>
            <Heading 
                title={data?.name}
            />
        </div>
    )
}


export default Description;