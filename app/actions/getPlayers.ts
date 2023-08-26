import prisma from "@/app/libs/prismadb";

export interface PlayersParams {
    eloMin?: number;
    eloMax?: number;
    ageMin?: number;
    ageMax?: number;
}

export default async function getPlayers(
    params: PlayersParams
) {
    try {
        const { eloMin, eloMax, ageMin, ageMax } = params;
        let query: any = {};

        if (eloMin && eloMax) {
            query = {
                ...query,
                elo: {
                    gte: +eloMin,
                    lte: +eloMax
                }
            }
        }
        if (ageMin && ageMax) {
            query = {
                ...query,
                age: {
                    gte: +ageMin,
                    lte: +ageMax
                }
            }
        }

        const players = await prisma.player.findMany({
            where: {
                ...query,
                isActive: true,
                numMatches: {
                    gte: 30
                }
            },
            orderBy: {
                elo: 'desc'
            },
            take: 100
        });

        return players;
    } catch (error: any) {
        throw new Error(error);
    }
};