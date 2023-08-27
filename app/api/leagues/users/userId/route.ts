import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';


interface IParams{
    userId?: string;
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    const { userId } = params;

    if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid name');
    }

    const leagues = await prisma.league.findMany({
        where: {
            adminId: userId
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    return NextResponse.json(leagues);
}