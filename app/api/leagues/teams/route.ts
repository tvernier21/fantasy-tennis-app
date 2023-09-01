import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';
import getCurrentUser from "@/app/actions/getCurrentUser";


export async function GET(
    request: Request
) {
    const url = new URL(request.url);

    // Get the leagueId and currentUser from the URL's search parameters
    const leagueId = url.searchParams.get('leagueId');
    const currentUser = url.searchParams.get('currentUser');

    const actualUser = await getCurrentUser();


    if (!leagueId || typeof leagueId !== 'string') {
        throw new Error('Invalid leagueId');
    }

    if (!currentUser || typeof currentUser !== 'string' || currentUser !== actualUser?.id) {
        throw new Error('Invalid user');
    }

    const league = await prisma.league.findUnique({
        where: {
            id: leagueId
        }
    })

    if (!league) {
        throw new Error('League not found');
    }

    const leagueusers = await prisma.userLeague.findMany({
        where: {
            leagueId: leagueId
        }
    });

    let isUserInLeague = false;
    // for users, check currentUser is in users
    for (const leagueuser of leagueusers) {
        if (leagueuser.userId === currentUser) {
            isUserInLeague = true;
            break;
        }
    }
    if (!isUserInLeague) {
        throw new Error('User not in league');
    }

    const currTournament = await prisma.tournament.findFirst({
        where: {
            active: true
        }
    });

    const teams = await prisma.team.findMany({
        where: {
            leagueId: leagueId,
            tournamentId: currTournament?.id
        }
    });

    const playersTeams = await prisma.playerTeam.findMany({
        where: {
            teamId: {
                in: teams.map(team => team.id)
            }
        }
    });

    const users = await prisma.user.findMany({
        where: {
            id: {
                in: leagueusers.map(user => user.userId)
            }
        }
    });

    const tournamentPlayers = await prisma.tournamentPlayer.findMany({
        where: {
            tournamentId: currTournament?.id
        }
    });

    // create an object, mapping users.name to teams
    const userTeams = {};
    for (const team of teams) {
        const user = users.find(user => user.id === team.userId);
        const playersTeam = playersTeams.filter(playerTeam => playerTeam.teamId === team.id);
        const players = tournamentPlayers.filter(tournamentPlayer => 
                                                    playersTeam.find(playerTeam => 
                                                        playerTeam.playerId === tournamentPlayer.playerId));

        // sort players on elo, high to low
        players.sort((a, b) => b.elo - a.elo);
        userTeams[user.name] = players;
    }

    return NextResponse.json(userTeams);
}