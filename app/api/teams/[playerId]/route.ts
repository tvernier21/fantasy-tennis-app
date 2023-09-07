import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { select } from '@nextui-org/theme';

interface IParams{
    playerId?: string;
}

export async function POST(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.error();
    }

    const { playerId } = params;
    if (!playerId || typeof playerId !== 'string') {
        throw new Error('invalid player');
    }

    const { leagueId } = await request.json();
    if (!leagueId || typeof leagueId !== 'string') {
        throw new Error('invalid league');
    }

    const Team = await prisma.team.findFirst({
        where: {
            userId: currentUser.id,
            leagueId: leagueId,
        },
        select: {
            id: true
        }
    });
    if (!Team) {
        throw new Error('Team not found');
    }
    const teamId = Team?.id;
            

    const playerTeam = await prisma.playerTeam.create({
        data: {
            teamId: teamId,
            playerId: playerId
        },
    });

    const tournament = await prisma.team.findFirst({
        where: {
            id: teamId
        },
        select: {
            tournamentId: true
        }
    });
    const tournamentId = tournament?.tournamentId;

    const player = await prisma.tournamentPlayer.findFirst({
        where: {
            id: playerId,
            tournamentId: tournamentId
        },
        select: {
            elo: true
        }
    });
    const playerElo = player?.elo;

    const updatedteam = await prisma.team.update({
        where: {
            id: teamId
        },
        data: {
            budget: {
                decrement: playerElo
            },
            updatedAt: new Date()
        }
    })

    return NextResponse.json(playerTeam);
}
