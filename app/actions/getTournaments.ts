import prisma from "@/app/libs/prismadb";

export interface TournamentsParams {
    lvlMin?: number;
    lvlMax?: number;
}

export default async function getTournaments (
    params: TournamentsParams 
) {
    try {
        const { lvlMin, lvlMax } = params;
        let query: any = {};

        if (lvlMin && lvlMax) {
            query = {
                ...query,
                difficulty: {
                    gte: +lvlMin,
                    lte: +lvlMax
                }
            }
        }

        const tournaments = await prisma.tournament.findMany({
            where: query,
            orderBy: {
                createdAt: 'asc'
            },
        });

        return tournaments;
    } catch (error: any) {
        throw new Error(error);
    }
}