import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();
    const { teamId, playerId } = body;

    const delPlayerTeam = await prisma.playerTeam.delete({
        where: {
            teamId_playerId: {
                teamId: teamId,
                playerId: playerId
            }
        }
    });

    const tournamentPlayer = await prisma.tournamentPlayer.findFirst({
        where: {
            id: playerId
        }
    });
    const tournamentPlayerCost = tournamentPlayer?.elo;

    const updatedTeam = await prisma.team.update({
        where: {
            id: teamId
        },
        data: {
            budget: {
                increment: tournamentPlayerCost
            },
            updatedAt: new Date()
        }
    });

    return NextResponse.json(delPlayerTeam);
}