import prisma from "@/app/libs/prismadb";
import { Asap_Condensed } from "next/font/google";

export default async function getPlayers() {
    try {
        const players = await prisma.player.findMany({
            orderBy: {
                name: 'asc'
            },
        });

        return players;
    } catch (error: any) {
        throw new Error(error);
    }
}