import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { now } from "next-auth/client/_utils";

export async function POST(
    request: Request
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();
    const {
        name,
        format,
    } = body;

    const league = await prisma.league.create({
        data: {
            adminId: currentUser.id,
            name: name,
            format: format,
            img: "/images/court.png"
        }
    });

    return NextResponse.json(league)
}