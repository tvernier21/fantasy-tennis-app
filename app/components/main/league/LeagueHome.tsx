'use client';

import React, { useEffect } from "react"

import { SafeUser } from "../../../types";
import Heading from "../../Heading";

interface LeagueHomeProps {
    currentUser?: SafeUser | null;
}

const LeagueHome: React.FC<LeagueHomeProps> = ({
    currentUser,
}) => {
    return (
        <div>
            <Heading 
                title="League Home" 
                center
            />
        </div>
    )
};

export default LeagueHome;