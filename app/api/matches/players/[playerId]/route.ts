import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

const rounds = [
    '1st Round Qualifying', 
    '2nd Round Qualifying', 
    '3rd Round Qualifying', 
    'Round Robin', 
    'Round of 128', 
    'Round of 64', 
    'Round of 32', 
    'Round of 16', 
    '3rd/4th Place Match', 
    'Quarterfinals', 
    'Quarter-Finals', 
    'Semi-Finals', 
    'Semifinals',
    'Olympic Bronze', 
    'Final', 
    'Finals'
];

interface IParams{
    playerId?: string;
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    const { playerId } = params;

    if (!playerId || typeof playerId !== 'string') {
        throw new Error('Invalid name');
    }

    let groupedMatches: any[] = [];

    const matches = await prisma.match.findMany({
        where: {
            OR: [
                { winnerId: playerId },
                { loserId: playerId }
            ]
        },
        orderBy: {
            date: 'desc'
        }
    });

    const groupedByTournament = matches.reduce((acc, match) => {
        if (!acc[match.tournamentId]) {
            acc[match.tournamentId] = [];
        }
        acc[match.tournamentId].push(match);
        return acc;
    }, {} as Record<string, typeof matches>);
    
    Object.values(groupedByTournament).forEach(tournamentMatches => {
        tournamentMatches.sort((a, b) => {
            const aRoundIndex = rounds.indexOf(a.round);
            const bRoundIndex = rounds.indexOf(b.round);
            return bRoundIndex - aRoundIndex;
        });
    });

    
    Object.keys(groupedByTournament).forEach(tournamentMatches => {
        groupedByTournament[tournamentMatches].forEach(match => {
            groupedMatches.push(match);
        })
    });    
    
    // return NextResponse.json(matches);
    return NextResponse.json(groupedMatches);
}