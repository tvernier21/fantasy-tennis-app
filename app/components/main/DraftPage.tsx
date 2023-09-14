'use client';

import React, { useEffect } from "react"
import axios from "axios";
import { toast } from 'react-hot-toast';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button, Spinner } from "@nextui-org/react";

import useLeagueModal from "../../hooks/useLeagueModal";
import { SafeUser } from "../../types";
import HomePage from "./HomePage"
import SidebarList from "./sidebar/SidebarList";
import Heading from "../Heading";
import DataPage from "./content/DataPage";

interface DraftPageProps {
    currentUser?: SafeUser | null;
}

const DraftPage: React.FC<DraftPageProps> = ({
    currentUser,
}) => {
    const pathname = usePathname();
    const category = pathname ? pathname.split('/')[1] : null;
    const selected = useSearchParams()?.get("selected");
    const [isLoading, setIsLoading] = React.useState(false);
    const [leagues, setLeagues] = React.useState<any>(null);
    const leagueModal = useLeagueModal();

    useEffect(() => {
        if (!currentUser) return;

        setIsLoading(true);
        let endpoint = `/api/leagues/users/${currentUser.id}`;
            
        // Fetch the data
        axios.get(endpoint)
            .then((res) => {
                setLeagues(res.data);
            })
            .catch((error) => {
                            // Check for the status code in the error response
                if (error.response && error.response.status === 404) {
                    toast.error("Leagues not found for the user");
                } else {
                    toast.error("Something went wrong");
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [currentUser]);

    if (!currentUser) {
        return (
            <HomePage />
        )
    }

    return (
        <div className="flex flex-col md:flex-row h-screen justify-center items-center"> {/* Added h-screen to fill height */}
            <div className="flex md:w-full w-full rounded-xl overflow-hidden"> {/* Added rounded corners */}
                <div className="md:w-1/5 w-full h-screen overflow-y-auto bg-gray-700 rounded-l-xl"> {/* Added rounded left corner */}
                    <div className="pt-2 pr-2 pl-2 pb-2">
                        <Button 
                            color="secondary"
                            size="lg"
                            onClick={leagueModal.onOpen}
                            fullWidth
                        >
                            Create New League
                        </Button>
                        {isLoading ? (
                            <div className="pt-6 justify-center">
                                <Spinner 
                                    color="secondary"
                                    size="lg"
                                />
                            </div>
                        ) : leagues ? (
                            <div className="pt-5">
                                <SidebarList 
                                    data={leagues}
                                    category={category}
                                    currentUser={currentUser}
                                />
                            </div>
                        ) : (
                            <div className="pt-10">
                                <Heading 
                                    title="No Leagues Found"
                                    subtitle="Create a new league to get started"
                                    center
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="md:w-4/5 w-full h-screen bg-gray-700 rounded-r-xl overflow-y-auto"> {/* Added rounded right corner */}
                    {selected ? (
                        <DataPage    
                            category={category}
                            currentUser={currentUser}
                        />
                    ) : (
                        <div className="justify-center pt-10">
                            <Heading
                                title="Select a League"
                                subtitle="Select or Create league from the sidebar to get started"
                                center
                            />    
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
    
}

export default DraftPage;