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
        query = {
            ...query,
            date: {
                // greater than 2021-01-01
                gt: new Date('2023-02-01'),
                lt: new Date('2023-08-30')
            }
        }

        const tournaments = await prisma.tournament.findMany({
            where: query,
            orderBy: {
                date: 'desc'
            },
            take: 100
        });

        return tournaments;
    } catch (error: any) {
        throw new Error(error);
    }
}