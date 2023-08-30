'use client';

import React, { useEffect } from "react"
import {Card, CardHeader, CardBody, Image} from "@nextui-org/react";

import { SafeUser } from "../../../types";
import Heading from "../../Heading";

interface LeagueHomeProps {
    currentUser?: SafeUser | null;
}

const LeagueTeam: React.FC<LeagueHomeProps> = ({
    currentUser,
}) => {
    const numTeams = 4;

    const gridClassName = `gap-2 grid grid-cols-${numTeams} grid-rows-8`
    const gridContainerStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${numTeams}, 1fr)`, // Adjust the number 3 based on how many columns you want
        gridAutoFlow: 'column',
        gap: '1rem' // Adjust the gap as needed
    };
    
    return (
        <div>
            <div style={gridContainerStyle} className="overflow-x-auto">
                <Card className="py-4" isPressable>
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <p className="text-tiny uppercase font-bold">Player Name</p>
                        <small className="text-defaul t-500">Value</small>
                        <h4 className="font-bold text-large">+21</h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                        <Image
                        alt="Card background"
                        className="object-cover rounded-xl"
                        src="/images/tennis-player.png"
                        width={270}
                        />
                    </CardBody>
                </Card>
            </div>
        </div>
    )
};

export default LeagueTeam;