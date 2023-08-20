'use client';

import React from 'react';

import Heading from "@/app/components/Heading";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";

const HomePage = () => {
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();

    return (
        <div className='pt-12 pb-12 bg-white flex flex-col h-full'>
            <div className='flex flex-col justify-center'>
                <Heading 
                    center
                    title="Welcome to SmashIt"
                    subtitle="SmashIt is a fantasy tennis game where you can create your own team of tennis players and compete against other players."
                />
                <div className="text-neutral-500 text-center mt-4 font-light">
                    <div className="justify-center flex flex-row items-center gap-2">
                        <div>
                            Get Started by
                        </div>
                        <div 
                            className="text-neutral-800 cursor-pointer hover:underline"
                            onClick={() => registerModal.onOpen()}
                        >
                            Registering  
                        </div>
                        <div>
                            or
                        </div>
                        <div 
                            className="text-neutral-800 cursor-pointer hover:underline"
                            onClick={() => loginModal.onOpen()}
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