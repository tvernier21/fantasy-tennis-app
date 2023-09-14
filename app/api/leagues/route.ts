import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();
    const { name, format } = body;

    const league = await prisma.league.create({
        data: {
            inviteCode: uuidv4(),
            name: name,
            format: format,
            img: "/images/court.png",
            adminId: currentUser.id,
            users: {
                create: {
                    userId: currentUser.id
                }
            }
        },
        include: {
            users: true,  // Include UserLeague entries in the response
        }
    });

    return NextResponse.json(league);
}
