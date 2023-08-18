'use client';

import React from "react"
import Image from 'next/image'


const Thumbnail: React.FC<{ img: string | null | undefined }> = ({ img }) => {
    return (
        <div>
            <Image
                width={50}
                height={50}
                alt="Player Image"
                src={img || "/images/user.png"}
                className="object-cover w-full h-full group-hover:scale-105"
            />
        </div>
    );
}

export default Thumbnail;