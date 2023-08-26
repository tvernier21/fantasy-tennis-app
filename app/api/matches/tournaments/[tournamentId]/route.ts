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
]

interface IParams{
    tournamentId?: string;
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    const { tournamentId } = params;
    

    if (!tournamentId || typeof tournamentId !== 'string') {
        throw new Error('Invalid name');
    }
    
    const tournament = await prisma.match.findMany({
        where: {
            tournamentId: tournamentId
        }
    });

    tournament.sort((a, b) => {
        const indexA = rounds.indexOf(a.round);
        const indexB = rounds.indexOf(b.round);
        return indexB - indexA;
    });

    return NextResponse.json(tournament);
}