'use client';

import React from 'react';

import Heading from "@/app/components/Heading";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { SafeUser } from '@/app/types';

interface HomePageProps {
    currentUser: SafeUser | null | undefined;
}

const HomePage: React.FC<HomePageProps> = ({
    currentUser
}) => {
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();

    return (
        <div className='pt-12 pb-12 rounded-xl bg-gray-700 flex flex-col h-full'>
            <div className='flex flex-col justify-center'>
                <Heading 
                    center
                    title="Welcome to BgakOClock Fantasy Tennis"
                    subtitle="BgakOClock is a fantasy tennis game where you draft a team of tennis players to compete against other players."
                />
                <div className="text-neutral-400 text-center mt-4 font-light">
                    <div className="justify-center flex flex-row items-center gap-2">
                        <div>
                            Get Started by
                        </div>
                        <div 
                            className={`text-neutral-300 ${currentUser ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:underline'}`}
                            onClick={currentUser ? undefined : () => registerModal.onOpen()}
                        >
                            Registering  
                        </div>
                        <div>
                            or
                        </div>
                        <div 
                            className={`text-neutral-300 ${currentUser ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:underline'}`}
                            onClick={currentUser ? undefined : () => loginModal.onOpen()}
                        >
                            Logging In  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;