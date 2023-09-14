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
    console.log("inviteCode", inviteCode)
    console.log("userId", userId)

    const currentUser = await getCurrentUser();

    console.log("attempting to register new user to league")
    
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

    return NextResponse.json(newUserLeague);
}
