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
    const currPlayerBudget = Number(url.searchParams.get('currPlayerBudget'));

    if (!actualUser) {
        return new Error;
    }

    if (!leagueId || typeof leagueId !== 'string') {
        throw new Error('Invalid leagueId');
    }

    const tournament = await prisma.tournament.findFirst({
        where: {
            active: true
        }
    });
 
    const userTeam = await prisma.team.findFirst({
        where: {
            userId: actualUser.id,
            leagueId: leagueId,
            tournamentId: tournament?.id,
        }
    });
    if (!userTeam) {
        throw new Error('User team not found');
    }
    const userBudget = userTeam.budget + currPlayerBudget;

    const userTeamPlayers = await prisma.playerTeam.findMany({
        where: {
            teamId: userTeam?.id,
        }
    });


    const players = await prisma.tournamentPlayer.findMany({
        where: {
            tournamentId: tournament?.id,
            id: {
                not: {
                    in: userTeamPlayers.map(player => player.playerId)
                }
            }
        },
    });

    const validPlayers = players.filter(player => player.elo <= userBudget);
    validPlayers.sort((a, b) => b.elo - a.elo);
    
    return NextResponse.json(validPlayers);
};
