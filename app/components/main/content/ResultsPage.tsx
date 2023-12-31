'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import {
    Table, 
    TableHeader, 
    TableColumn, 
    TableBody, 
    TableRow, 
    TableCell, 
    Pagination, 
    getKeyValue, 
    Spinner,
    Chip
} from "@nextui-org/react";


import EmptyState from '../../EmptyState';

interface MatchesPageProps {
    category: string | null | undefined;
};

const MatchesPage: React.FC<MatchesPageProps> = ({
    category
}) => {    
    const selected = useSearchParams()?.get("selected");
    const [isLoading, setIsLoading] = React.useState(false);
    const [matches, setMatches] = React.useState<any>(null);

    useEffect(() => {
        if (!selected) return;

        setIsLoading(true);
        setMatches(null);
        let endpoint = '';
        // Determine the endpoint based on the category
        if (category === 'tournaments') {
            endpoint = `/api/matches/tournaments/${selected}`;
        } else if (category === 'players') {
            endpoint = `/api/matches/players/${selected}`;
        } else {
            return;
        }
            
        // Fetch the data
        axios.get(endpoint)
            .then((res) => {
                setMatches(res.data);
            })
            .catch((error) => {
                toast.error("Something went wrong");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [selected, category]);

    // if (category === "tournaments") {
    let [page, setPage] = React.useState(1);
    let rowsPerPage = 25;

    let pages = (matches ? Math.ceil(matches.length / rowsPerPage) : 0);

    let items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return (matches ? matches.slice(start, end) : []);
    }, [page, matches, rowsPerPage]);
    // }

    return(
        <Table 
            bottomContent={
                <div className="flex w-full justify-center">
                    <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="secondary"
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                    />
                </div>
            }
            classNames={{
                base: "max-h-[1200px]",
                table: "min-h-[200px]"
            }}
        >
            <TableHeader>
                <TableColumn key="tournamentName" align='start'>Tournament</TableColumn>
                <TableColumn key="round" align='start'>Round</TableColumn>
                <TableColumn key="winner_name" align='start'>Winner</TableColumn>
                <TableColumn key="loser_name" align='start'>Loser</TableColumn>
                <TableColumn key="score" align='start'>Score</TableColumn>
            </TableHeader>
            <TableBody 
                isLoading={isLoading && !items.length}
                items={items}
                loadingContent={<Spinner />}
            >
                {(item: any) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>
                                            {columnKey === 'winner_name' && item.winnerId === selected ? (
                                                <Chip color="primary" size="sm">
                                                    {getKeyValue(item, columnKey)}
                                                </Chip>
                                            ) : columnKey === 'loser_name' && item.loserId === selected ? (
                                                <Chip color="danger" size="sm">
                                                    {getKeyValue(item, columnKey)}
                                                </Chip>
                                            ) : (
                                                getKeyValue(item, columnKey)
                                            )}
                                        </TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
};

export default MatchesPage;