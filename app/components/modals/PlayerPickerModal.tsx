'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Field, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input, Select, SelectItem } from "@nextui-org/react";

import usePlayerPickerModal from '../../hooks/usePlayerPickerModal';
import Modal from './Modal';
import Heading from '../Heading';


const PlayerPickerModal = () => {
    const router = useRouter();
    const selected = useSearchParams()?.get("selected");
    const playerPickerModal = usePlayerPickerModal();
    const [isLoading, setIsLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [playerId, setPlayerId] = useState("");

    useEffect(() => {
        if (playerId) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [playerId]);

    const { 
        handleSubmit,
        formState: {
          errors,
        },
      } = useForm<FieldValues>({
        defaultValues: {},
    });

    useEffect(() => {
        if (!playerPickerModal.isOpen) return;

        setIsLoading(true);
        let endpoint = '/api/players/tournamentPlayers';

        axios.get(endpoint, {params: {
                                leagueId: selected,
                                currentUser: currentUser?.id
                            }})
            .then((res) => {
                set(res.data);
            })
            .catch((error) => {
                            // Check for the status code in the error response
                if (error.response && error.response.status === 404) {
                    toast.error("Leagues not found for the user");
                } else {
                    toast.error("Something went wrong");
                }
            })
            .finally(() => {
                setIsLoading(false);
        });
    }, [playerPickerModal.isOpen]);


    // const onSubmit: SubmitHandler<FieldValues> = (data) => {
    //     if (buttonDisabled) return;
        
    //     // Construct the data to send
    //     const postData = {
    //         ...data,
    //         name: leagueName,
    //         format: Array.from(leagueType)[0]  // Convert Set to Array and get the first value
    //     };
    //     setIsLoading(true);

    //     axios.post('/api/leagues', postData)
    //     .then(() => {
    //         toast.success('League Created!');
    //         router.refresh();
    //         // reset();  // Uncomment if you have the reset function defined
    //         leagueModal.onClose();
    //     })
    //     .catch(() => {
    //         toast.error('Something went wrong.');
    //     })
    //     .finally(() => {
    //         setIsLoading(false);
    //     });
    // }



    const bodyContent = (
        <div className=" flex flex-col gap-4">
            <Heading 
                title="Create a league to start Playing!"
            />
            <Select
                label="League Format"
                variant="flat"
                radius='sm'
                placeholder="Select a league format"
                selectedKeys={leagueType}
                className="max-w-xs bg-background/30 rounded-xl"
                onChange={handleLeagueTypeChange}
                color='default'
                isRequired
            >
                {leagueTypes.map((league) => (
                    <SelectItem key={league.value} value={league.value}>
                        {league.label}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
        
    return(
        <div>
            <Modal 
                disabled={isLoading}
                isOpen={leagueModal.isOpen}
                title="Create League"
                actionLabel="Create"
                onClose={leagueModal.onClose}
                body={bodyContent}
                onSubmit={handleSubmit(onSubmit)}
                buttonDisabled={buttonDisabled}
            />
        </div>
    )
};

export default PlayerPickerModal;
