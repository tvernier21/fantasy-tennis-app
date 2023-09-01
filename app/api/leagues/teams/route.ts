import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';


interface IParams{
    leagueId?: string;
    currentUser?: any;
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    const { leagueId, currentUser } = params;

    if (!leagueId || typeof leagueId !== 'string') {
        throw new Error('Invalid leagueId');
    }

    if (!currentUser || typeof currentUser !== 'object') {
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
    const userId = currentUser.id;
    for (const leagueuser of leagueusers) {
        if (leagueuser.userId === userId) {
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