'use client';

import React, { useEffect, useState } from "react"
import axios from "axios";
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { Check, Copy } from "lucide-react";


import { useOrigin } from "../../../hooks/useOrigin";
import { SafeUser } from "../../../types";
import { Button } from "../../Inputs/NewButton";
import { Input } from "../../Inputs/NewInput";
import Heading from "../../Heading";

interface LeagueHomeProps {
    currentUser?: SafeUser | null;
}

const LeagueHome: React.FC<LeagueHomeProps> = ({
    currentUser,
}) => {
    const origin = useOrigin();
    const leagueId = useSearchParams()?.get("selected");
    const [league, setLeague] = useState(null);
    const [inviteUrl, setInviteUrl] = useState("");
    const [copied, setCopied] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
    
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      };

    useEffect(() => {
        if (!currentUser || !leagueId) return;

        // Fetch the data
        axios.get(`/api/leagues/${leagueId}`)
            .then((res) => {
                setLeague(res.data);
                setInviteUrl(`${origin}/invite/${res.data?.inviteCode}`);
            })
            .catch((error) => {
                // Check for the status code in the error response
                if (error.response && error.response.status === 404) {
                    toast.error("League not found");
                } else {
                    toast.error("Something went wrong");
                }
            });
    }, [currentUser, leagueId, origin]);    

    return (
        <div className="flex items-center mt-2 gap-x-2">
            Invite: 
            <Input
                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                value={inviteUrl}
            />
            <Button onClick={onCopy} size="icon">
              {copied 
                ? <Check className="w-4 h-4" /> 
                : <Copy className="w-4 h-4" />
              }
            </Button>
        </div>
    )
};

export default LeagueHome;
