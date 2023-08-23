import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

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

    const tournament = await prisma.match.findMany({
        where: {
            OR: [
                { winnerId: playerId },
                { loserId: playerId }
            ]
        }
    });
    

    return NextResponse.json(tournament);
}