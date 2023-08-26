import prisma from "@/app/libs/prismadb";
import { addYears } from "date-fns";

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
            const currentDate = new Date();
            const maxDOB = addYears(currentDate, -ageMin); // The latest DOB for the minimum age
            const minDOB = addYears(currentDate, -ageMax); // The earliest DOB for the maximum age

            query = {
                ...query,
                dob: {
                    gte: minDOB,
                    lte: maxDOB
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