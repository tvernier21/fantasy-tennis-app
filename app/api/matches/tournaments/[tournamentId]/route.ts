import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

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

    return NextResponse.json(tournament);
}