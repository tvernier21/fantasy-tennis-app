'use client';

import React, { useEffect } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

import Description from "./Description";
import DataPage from "./DataPage";
import Heading from "../../Heading";

interface ContentProps {
    category: string | null | undefined;
}

const Content: React.FC<ContentProps> = ({
    category
}) => {
    // Get the current path name and fetch corresponding player or tournament data
    const params = useSearchParams();
    const selected = params?.get("selected");
    const [isLoading, setIsLoading] = React.useState(false);

    // update this to be tournament or player data, or null
    const [descriptionData, setDescriptionData] = React.useState<any>(null);
    const [matchesData, setMatchesData] = React.useState<any>(null);

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
            console.error("Invalid category");
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
    
    // Fetch Data matching the descriptionData
    useEffect(() => {
        if (!descriptionData) return;

        setIsLoading(true);

        let endpoint = '';
        // Determine the endpoint based on the category
        if (category === 'tournaments') {
            endpoint = `/api/matches/tournaments/${descriptionData[0].id}`;
        } else if (category === 'players') {
            endpoint = `/api/matches/players/${descriptionData[0].id}`;
        } else {
            console.error("Invalid category");
            return;
        }
            
        // Fetch the data
        axios.get(endpoint)
            .then((res) => {
                setMatchesData(res.data);
            })
            .catch((error) => {
                toast.error("Something went wrong");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [descriptionData, category]);
    
    if (!matchesData) console.log(matchesData);

    if (!selected) {
        return(
            <div className="">
                {/* Heading section */}
                <Heading title="BGAK" />
            </div>
        )
    };

    return (
        <div className="pt-22">
            {/* Heading section */}
            <div className="w-full bg-white z-10 shadow-sm">
                <div className="py-20 border-b-[1px]">
                    <Description data={descriptionData}/>
                </div>
            </div>

            {/* Tabulated content section */}
            <DataPage />
        </div>
    )
}

export default Content