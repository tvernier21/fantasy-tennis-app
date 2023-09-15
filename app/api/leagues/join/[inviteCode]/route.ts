import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

interface IParams{
    inviteCode?: string;
}

export async function POST(
    request: Request,
    { params }: { params: IParams }
) {
    const { userId } = await request.json();
    const { inviteCode } = params;

    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
        return NextResponse.error();
    }
    if (!inviteCode || typeof inviteCode !== 'string') {
        throw new Error('invalid invite code');
    }
    if (!userId || typeof userId !== 'string') {
        throw new Error('invalid user');
    }
    if (userId !== currentUser.id) {
        throw new Error('invalid user');
    }

    const league = await prisma.league.findFirst({
        where: {
            inviteCode: inviteCode
        }
    });
    if (!league) {
        throw new Error('invalid invite code');
    }

    const newUserLeague = await prisma.userLeague.create({
        data: {
            userId: userId,
            leagueId: league.id
        }
    });

    // Check if tournament active, create team if active
    const tournament = await prisma.tournament.findFirst({
        where: {
            active: true
        }
    });
    if (tournament) {
        const newTeam = await prisma.team.create({
            data: {
                userId: currentUser.id,
                leagueId: league.id,
                tournamentId: tournament.id,
                name: currentUser.name ? currentUser.name : currentUser.username,
                points: 0,
                budget: 10000,
                teamCapacity: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
    }

    return NextResponse.json(newUserLeague);
}
