'use client';

import React, { useEffect, useState } from "react"
import { useElementSize } from 'usehooks-ts'

import {Tabs, Tab, Card, CardBody, CardHeader} from "@nextui-org/react";

import EmptyState from "../../EmptyState";
import ResultsPage from "./ResultsPage";
import { SafeUser } from "@/app/types";
import LeagueLeaderboard from "../league/LeagueLeaderboard";
import LeagueTeam from "../league/LeagueTeam";

interface DataPageProps {
    category: string | null | undefined;
    currentUser?: SafeUser | null;
    // add more data once its ready
};

const playerTabs = [
    {
        id: "results",
        value: "results",
        desc: `results tab`,
    },
    {
        id: "elo",
        value: "elo",
        desc: `We are still working on making this feature available`,
    }
];

const tournamentTabs = [
    {
        id: "results",
        value: "Results",
        desc: `results tab`,
    },
    {
        id: "draws",
        value: "draws",
        desc: `We are still working on making this feature available`,
    },
    {
        id: "live scores",
        value: "live scores",
        desc: `We are still working on making this feature available.`,
    }
];

const leagueTabs = [
    {
        id: "leaderboard",
        value: "Leaderboards",
        desc: `league home tab`,
    },
    {
        id: "teams",
        value: "Teams",
        desc: `each team in the league`,
    }
];


const DataPage: React.FC<DataPageProps> = ({
    category,
    currentUser,
}) => {
    const [tabs, setTabs] = React.useState<{
        id: string;
        value: string;
        desc: string;
    }[]>([{id: '', value: '', desc: ''}]);
    
    useEffect(() => {
        if (category === 'players') {
            setTabs(playerTabs);
        } else if (category === 'tournaments') {
            setTabs(tournamentTabs);
        } else if (category === 'leagues') {
            setTabs(leagueTabs);
        } else {
            setTabs([{id: '', value: '', desc: ''}]);
        }
    }, [category]);

    return (
        <div className="flex w-full flex-col pt-2 pl-2 pr-2">
            <Tabs 
                aria-label="tabs" 
                items={tabs}
                size="md"
                color="secondary"
                fullWidth={true}
            >
                {(item) => (
                    <Tab key={item.id} title={item.value}>
                        <Card>
                        <CardBody>
                            {item.id === "results" ? (
                                <ResultsPage
                                    category={category}
                                />
                            ) : item.id === "leaderboards" ? (
                                <LeagueLeaderboard currentUser={currentUser} />
                            ) : item.id === "teams" ? (
                                <LeagueTeam currentUser={currentUser} />
                            ) : (
                                <EmptyState 
                                    subtitle={item.desc}
                                />
                            )}  
                        </CardBody>
                        </Card>  
                    </Tab>
                    )}
                {/* <Tab key="result" title="Results">
                    <Card>
                        <CardBody>
                            <ResultsPage 
                                matches={matches}
                                isLoading={isLoading}
                            />
                        </CardBody>
                    </Card>  
                </Tab>
                <Tab key="elo" title="ELO">
                    <Card>
                        <CardBody>
                            <EmptyState 
                                title="Shits empty"
                            />
                        </CardBody>
                    </Card>  
                </Tab>*/}
           </Tabs> 
        </div>  
    );
};

export default DataPage;