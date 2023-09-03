import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function GET(
    request: Request
) {
    const actualUser = await getCurrentUser();
    const url = new URL(request.url);

    // Get the leagueId and currentUser from the URL's search parameters
    const leagueId = url.searchParams.get('leagueId');
    const currentUser = url.searchParams.get('currentUser');

    if (!currentUser || type of currentUser !== "string" || currentUser !== actualUser?.id) {
        return NextResponse.error();
    };

    const tournamentId = await prisma.tournament.findFirst({
        where: {
            active: true
        },
        include: {
            id
        }
    });

    const userTeam = await prisma.team.findFirst({
        where: {
            userId: currentUser,
            leagueId: leagueId,
            tournamentId: tournamentId,
        }
    });
    const userBudget = userTeam.budget;


    const players = await prisma.tournamentPlayer.findMany({
        where: {
            tournamentId: tournamentId
        }
    });

    const validPlayers = players.filter(player => player.elo <= userBudget);
    
    return NextResponse.json(league);
};
