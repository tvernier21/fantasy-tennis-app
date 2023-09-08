'use client';

import React, { useEffect, useMemo, useState, useCallback } from "react"
import { useSearchParams } from 'next/navigation';
import {
    Card, 
    CardHeader, 
    CardFooter,
    CardBody, 
    Image, 
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner,
    Button
} from "@nextui-org/react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";

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
    const [players, setPlayers] = useState<any[]>([]);
    const [structuredPlayers, setStructuredPlayers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [playerRemoved, setPlayerRemoved] = useState(false);


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

    // Fetching each teams players
    useEffect(() => {
        if (!selected || !currentUser) return;

        if (playerPickerModal.isOpen) return;

        if (playerRemoved) return;

        setIsLoading(true);   
        let endpoint = '/api/leagues/teams/';
             
        // Fetch players, Maps (user.name => [{player1}, {player2}, ...]}])
        axios.get(
            endpoint, 
            {params: {
                leagueId: selected,
                currentUser: currentUser?.id
        }})
            .then((res) => {
                setPlayers(res.data.userPlayers);
                setTeams(res.data.userTeams);
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
    }, [selected, currentUser, playerPickerModal.isOpen, playerRemoved]);

    // Structuring the teams ==> TODO: merge with the first useeffect
    useEffect(() => {
        const tmpStructuredPlayers: any[] = [];

        Object.entries(players).forEach(([teamName, teamPlayers]) => {
            const teamMap: { [key: string]: any } = {};
            teamMap[columns[0].uid] = teamName;

            for (let i = 1; i < columns.length; i++) {
                if (i - 1 < teamPlayers.length) {
                    teamMap[columns[i].uid] = teamPlayers[i - 1];
                } else {
                    teamMap[columns[i].uid] = null;
                }
            }

            if (teamName === currentUser?.name) {
                tmpStructuredPlayers.unshift(teamMap);
            } else {
                tmpStructuredPlayers.push(teamMap);
            }
                
        });

        if (JSON.stringify(structuredPlayers) !== JSON.stringify(tmpStructuredPlayers)) {
            setStructuredPlayers(tmpStructuredPlayers);
            // setIsLoading(false);
        }
    }, [players, columns]);

    // Define the API call function
    const handlePlayerRemoval = useCallback((teamId: string, playerId: string) => {
        // Construct the data to send
        const postData = {
            teamId: teamId,
            playerId: playerId,
        };
    
        setPlayerRemoved(true);
        const endpoint = `/api/teams/removePlayer`;
        axios.post(endpoint, postData)
            .then(() => {
                toast.success('Player Removed!');
            })
            .catch(() => {
                toast.error('Something went wrong.');
            })
            .finally(() => {
                setPlayerRemoved(false);
        });
    }, []);


    const renderCell = useCallback((team: any, columnKey: React.Key) => {
        const cellValue = team[columnKey];
        const userTeam = team['user'] == currentUser?.name;
        const teamData = teams[team['user']];
    
        if (columnKey === "user") {
            return (
                <Card className="bg-gray-400 w-[150px]">
                    <CardBody className="overflow-visible p-0">
                        <Image
                            shadow="sm"
                            radius="lg"
                            width="100%"
                            alt="card background"
                            className="w-full object-cover h-[140px]"
                            src={currentUser?.image? currentUser.image : "/images/placeholder.png"}
                        />
                    </CardBody>
                    <CardFooter className="text-small justify-between">
                        <b>{cellValue}</b>
                        <p className="">{teamData.budget.toFixed(2)}</p>
                    </CardFooter>
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
                        onPress={userTeam ? () => playerPickerModal.onOpenWithPlayer(cellValue) : () => {}} 
                    >
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                            <p className="text-tiny uppercase font-bold text-left overflow-hidden whitespace-nowrap">{cellValue.name}</p>
                            <small className="text-default-500">{cellValue.elo.toFixed(2)}</small>
                            <h4 className="font-bold text-large">+{cellValue.points.toFixed(2)}</h4>
                        </CardHeader>
                        <CardBody className="overflow-visible py-2 pt-2 pb-2">
                            <Image
                                alt="Card background"
                                className="object-cover rounded-xl"
                                src="/images/tennis-player.png"
                                width={100}
                                height={100}
                            />
                        </CardBody>
                        <CardFooter className="flex justify-center pt-2">
                            <Button
                                radius="full"
                                size="sm"
                                onPress={() => handlePlayerRemoval(teamData.id, cellValue.id)}
                            >
                                Remove Player    
                            </Button>
                        </CardFooter>
                    </Card>
                )
            );
        } else {
            return cellValue;
        }
    }, [teams]);
    

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
                    items={structuredPlayers}
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