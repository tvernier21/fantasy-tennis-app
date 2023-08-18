import prisma from "@/app/libs/prismadb";

export default async function getPlayers() {
    try {
        const players = await prisma.player.findMany({
            orderBy: {
                rank: 'asc'
            },
        });

        return players;
    } catch (error: any) {
        throw new Error(error);
    }
}