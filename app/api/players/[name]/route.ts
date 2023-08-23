import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

interface IParams{
    name?: string;
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    const { name } = params;

    if (!name || typeof name !== 'string') {
        throw new Error('Invalid name');
    }

    const player = await prisma.player.findMany({
        where: {
            name: name
        }
    });

    return NextResponse.json(player);
}