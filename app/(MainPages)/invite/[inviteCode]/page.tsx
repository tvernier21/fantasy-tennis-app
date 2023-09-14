import React from 'react';
import { redirect } from 'next/navigation';
import prisma from "../../../libs/prismadb";

import getCurrentUser from '../../../actions/getCurrentUser';
import LoginModal from '../../../components/modals/LoginModal';
import RegisterModal from '../../../components/modals/RegisterModal';
import ClientOnly from '../../../components/ClientOnly';
import Container from '../../../components/Container';
import JoinLeaguePage from '../../../components/main/JoinLeaguePage';

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
};

const InviteCodePage = async ({
    params
  }: InviteCodePageProps) => {
    const currentUser = await getCurrentUser();

    if (!params.inviteCode) {
        return redirect("/")
    }

    const league = await prisma.league.findFirst({
        where: {
            inviteCode: params.inviteCode
        }
    });
    if (!league) {
        return redirect("/")
    }

    if (currentUser) {
        const leagueUser = await prisma.userLeague.findFirst({
            where: {
                leagueId: league.id,
                userId: currentUser?.id
            }
        });

        if (leagueUser) {            
            return redirect(`/leagues?selected=${league.id}`)
        }
    };

    const numMembers = await prisma.userLeague.count({
        where: {
            leagueId: league.id
        }
    });

    return(
        <ClientOnly>
            <LoginModal />
            <RegisterModal />
            <Container>
                <JoinLeaguePage
                    currentUser={currentUser}
                    inviteCode={params.inviteCode}
                    leagueName={league.name}
                    leagueImg=''
                    numMembers={numMembers}
                />
            </Container>
        </ClientOnly>
    );
};

export default InviteCodePage;