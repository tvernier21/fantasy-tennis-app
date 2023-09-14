'use client';

import React, { useState, useEffect, use } from "react"
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from "axios";
import { useRouter } from 'next/navigation';
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Button,
    Image,
} from "@nextui-org/react";

import useLoginModal from "../../hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";
import Heading from "../../components/Heading";
import { SafeUser } from "../../types";

interface JoinLeaguePageProps {
    currentUser: SafeUser | null;
    inviteCode: string;
    leagueName: string;
    leagueImg: string;
    numMembers: number;
}

const JoinLeaguePage: React.FC<JoinLeaguePageProps> = ({
    currentUser,
    inviteCode,
    leagueName,
    leagueImg,
    numMembers
}) => {
    const router = useRouter();
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if (currentUser) {
            setDisabled(false);
        }
    }, [currentUser]);

    const { 
        handleSubmit,
        formState: {
          errors,
        },
    } = useForm<FieldValues>({
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<FieldValues> = () => {
        const postData = {
            userId: currentUser?.id,
        };

        const endpoint = `/api/leagues/join/${inviteCode}`;
        axios.post(endpoint, postData)
            .then(() => {
                toast.success('Joined League!');
            })
            .catch(() => {
                toast.error('Something went wrong.');
            })
            .finally(() => {
                router.push('/leagues')
        });
    }

    return (
        <div className='pt-12 pb-12 rounded-xl bg-gray-700 flex flex-col h-full'>
            <div className='flex flex-col justify-center items-center'>
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
                <div className="pt-5">
                    <Card className="h-[300px] w-[200px]">
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                            <h4>{leagueName}</h4>
                            <small>{numMembers} player(s) joined</small>
                        </CardHeader>
                        <CardBody className="overflow-visible py-2">
                            <Image
                                alt="League Image"
                                src={leagueImg ? leagueImg : "/images/court.png"}
                            />
                        </CardBody>
                        <CardFooter className="">
                            <Button
                                onPress={onSubmit}
                                color='secondary' 
                                isDisabled={disabled} 
                                fullWidth
                            >
                                Join
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
    
}

export default JoinLeaguePage;