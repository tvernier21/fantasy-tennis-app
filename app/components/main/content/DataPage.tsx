'use client';

import React, { useEffect, useState } from "react"
import { useElementSize } from 'usehooks-ts'

import {Tabs, Tab, Card, CardBody, CardHeader} from "@nextui-org/react";

import EmptyState from "../../EmptyState";
import ResultsPage from "./ResultsPage";

interface DataPageProps {
    category: string | null | undefined;
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
        id: "home",
        value: "home",
        desc: `league home tab`,
    },
    {
        id: "Teams",
        value: "Teams",
        desc: ``,
    }
];


const DataPage: React.FC<DataPageProps> = ({
    category
}) => {
    const [tabs, setTabs] = React.useState<{
        id: string;
        value: string;
        desc: string;
    }[]>([{id: '', value: '', desc: ''}]);
    
    useEffect(() => {
        if (category === 'players') {
            setTabs(playerTabs);
        } else {
            setTabs(tournamentTabs);
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