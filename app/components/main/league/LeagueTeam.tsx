'use client';

import React, { useEffect, useMemo, useState } from "react"
import { useSearchParams } from 'next/navigation';
import {
    Card, 
    CardHeader, 
    CardBody, 
    Image, 
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner
} from "@nextui-org/react";
import axios from "axios";
import { toast } from 'react-hot-toast';

import usePlayerPickerModal from "../../../hooks/usePlayerPickerModal";
import { SafeUser } from "../../../types";
import Heading from "../../Heading";
import { set } from "date-fns";

interface LeagueHomeProps {
    currentUser?: SafeUser | null;
}

const LeagueTeam: React.FC<LeagueHomeProps> = ({
    currentUser,
}) => {
    const playerPickerModal = usePlayerPickerModal();
    const selected = useSearchParams()?.get("selected");
    const numPlayers = 5;
    const [teams, setTeams] = useState<any>({});
    const [structuredTeams, setStructuredTeams] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    function createPlayerColumns(numPlayers: number): { name: string, uid: string }[] {
        const columns: { name: string, uid: string }[] = [];
        for (let i = 0; i <= numPlayers; i++) {
            if (i === 0) {
                columns.push({name: 'User', uid: 'user'});
            } else {
                columns.push({name: 'Player', uid: `player${i}`});
            }
        }
        return columns;
    }    
    const columns = useMemo(() => {
        return createPlayerColumns(numPlayers);
    }, [numPlayers]);

    // example teams data. instead call api to get this data
    useEffect(() => {
        if (!selected || !currentUser) return;

        if (playerPickerModal.isOpen) return;

        setIsLoading(true);   
        let endpoint = '/api/leagues/teams/';
            
        // Fetch the data
        axios.get(endpoint, {params: {
                                leagueId: selected,
                                currentUser: currentUser?.id
                            }})
            .then((res) => {
                setTeams(res.data);
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

    }, [selected, currentUser, playerPickerModal.isOpen]);

    useEffect(() => {
        const tmpStructuredTeams: any[] = [];

        Object.entries(teams).forEach(([teamName, teamMembers]) => {
            const teamMap: { [key: string]: any } = {};
            teamMap[columns[0].uid] = teamName;

            for (let i = 1; i < columns.length; i++) {
                if (i - 1 < teamMembers.length) {
                    teamMap[columns[i].uid] = teamMembers[i - 1];
                } else {
                    teamMap[columns[i].uid] = null;
                }
            }

            if (teamName === currentUser?.name) {
                tmpStructuredTeams.unshift(teamMap);
            } else {
                tmpStructuredTeams.push(teamMap);
            }
                
        });

        if (JSON.stringify(structuredTeams) !== JSON.stringify(tmpStructuredTeams)) {
            setStructuredTeams(tmpStructuredTeams);
            // setIsLoading(false);
        }
    }, [teams, columns]);


    const renderCell = React.useCallback((team: any, columnKey: React.Key) => {
        const cellValue = team[columnKey];
        const userTeam = team['user'] == currentUser?.name;
    
        if (columnKey === "user") {
            return (
                <Card className="py-4 bg-gray-400">
                    <CardHeader className="pb- px-4 flex-col items-center">
                        <h4 className="font-bold text-large justify-center">{cellValue}</h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2 flex-col items-center">
                        <Image
                            alt="Card background"
                            className="object-cover rounded-xl"
                            src={currentUser?.image? currentUser.image : "/images/placeholder.png"}
                            width={100}
                            height={100}
                        />
                    </CardBody>
                </Card>
            );
        } else if(typeof columnKey === 'string' && columnKey.startsWith("player")) {
            return (
                cellValue === null ? (
                    <Card
                        className="py-4 bg-gray-500" 
                        isPressable
                        onPress={userTeam ? playerPickerModal.onOpen : () => {}} 
                    >
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                            <p className="text-tiny uppercase font-bold text-left pb-2">Select Player</p>
                            <small className="text-default-500">--</small>
                            <h4 className="font-bold text-large">--</h4>
                        </CardHeader>
                        <CardBody className="overflow-visible py-2">
                            <Image
                                alt="Card background"
                                className="object-cover rounded-xl"
                                src="/images/tennis-player-gray.png"
                                width={100}
                                height={100}
                            />
                        </CardBody>
                    </Card>
                ) : (
                    <Card 
                        className="py-4 bg-gray-500" 
                        isPressable
                        onPress={userTeam ? playerPickerModal.onOpen : () => {}} 
                    >
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                            <p className="text-tiny uppercase font-bold text-left">{cellValue.name}</p>
                            <small className="text-default-500">{cellValue.elo.toFixed(2)}</small>
                            <h4 className="font-bold text-large">+{cellValue.points.toFixed(2)}</h4>
                        </CardHeader>
                        <CardBody className="overflow-visible py-2">
                            <Image
                                alt="Card background"
                                className="object-cover rounded-xl"
                                src="/images/tennis-player.png"
                                width={100}
                                height={100}
                            />
                        </CardBody>
                    </Card>
                )
            );
        } else {
            return cellValue;
        }
    }, []);
    

    return (
        <div className="overflow-y-auto">
            <Table 
                aria-label="Example table with custom cells, pagination and sorting"
                className="flex w-full justify-center"
                classNames={{
                    base: "max-h-[2200px]",
                    table: "min-h-[200px]",
                }}
                >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                        key={column.uid}
                        align="start"
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody 
                    isLoading={isLoading}
                    items={structuredTeams}
                    loadingContent={<Spinner />}
                    >
                    {(item) => (
                        <TableRow key={item.user}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
                    </div>
    )
};

export default LeagueTeam;