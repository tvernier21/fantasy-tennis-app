import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

interface IParams{
    leagueId?: string;
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    const { leagueId } = params;

    if (!leagueId || typeof leagueId !== 'string') {
        throw new Error('Invalid league ID');
    }

    const league = await prisma.league.findFirst({
        where: {
            id: leagueId
        },
    });

    return NextResponse.json(league);
}