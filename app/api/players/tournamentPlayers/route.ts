import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function GET(
    request: Request
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    //get leagueid
    // get team associated with league and user
    // get budget
    // get all tournament Players
    // filter players over the current budget
    
    
    
    
    // const league = await prisma.league.findFirst({

    // return NextResponse.json(league);
}
