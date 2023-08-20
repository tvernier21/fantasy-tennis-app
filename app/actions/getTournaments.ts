import prisma from "@/app/libs/prismadb";

export default async function getTournaments() {
    try {
        const tournaments = await prisma.tournament.findMany({
            orderBy: {
                createdAt: 'asc'
            },
        });

        return tournaments;
    } catch (error: any) {
        throw new Error(error);
    }
}