'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';


import Heading from "../../Heading";
import Thumbnail from "../../Thumbnail";

interface DescriptionProps {
    category?: string | null | undefined;
}

const Description: React.FC<DescriptionProps> = ({
    category
}) => {
    const selected = useSearchParams()?.get("selected");
    const [descriptionData, setDescriptionData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

        // Fetch the description data
    useEffect(() => {
        if (!selected) return;

        // Determine the endpoint based on the category
        let endpoint = '';
        if (category === 'tournaments') {
            endpoint = `/api/tournaments/${selected}`;
        } else if (category === 'players') {
            endpoint = `/api/players/${selected}`;
        } else {
            return;
        }

        // Fetch the data
        setIsLoading(true);
        axios.get(endpoint)
            .then((res) => {
                setDescriptionData(res.data);
            })
            .catch((error) => {
                toast.error("Something went wrong");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [selected, category]);

    return(
        <Heading 
            title="Bgak"
            subtitle="Oclock"
        />
    )
}


export default Description;