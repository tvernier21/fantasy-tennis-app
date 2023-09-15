'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Field, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input, Select, SelectItem } from "@nextui-org/react";

import useLeagueModal from '../../hooks/useLeagueModal';
import Modal from './Modal';
import Heading from '../Heading';

const leagueTypes = [
    { value: 'default', label: 'Default' },
    { value: 'auction', label: 'Auction' },
];

const LoginModal = () => {
    const router = useRouter();
    const leagueModal = useLeagueModal();
    const [isLoading, setIsLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [leagueName, setLeagueName] = useState("");
    const [leagueType, setLeagueType] = React.useState<Set<string>>(new Set());

    const handleLeagueTypeChange = (e: any) => {
        setLeagueType(new Set([e.target.value]));
    };

    useEffect(() => {
        // Check if leagueType has any values
        const hasLeagueType = leagueType.size > 0;
    
        if (leagueName !== "" && hasLeagueType) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [leagueName, leagueType]);

    const { 
        handleSubmit,
        formState: {
          errors,
        },
      } = useForm<FieldValues>({
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (buttonDisabled) return;
        
        // Construct the data to send
        const postData = {
            ...data,
            name: leagueName,
            format: Array.from(leagueType)[0]  // Convert Set to Array and get the first value
        };
        setIsLoading(true);

        axios.post('/api/leagues', postData)
        .then(() => {
            toast.success('League Created!');
            router.refresh();
            // reset();  // Uncomment if you have the reset function defined
            leagueModal.onClose();
        })
        .catch(() => {
            toast.error('Something went wrong.');
        })
        .finally(() => {
            setIsLoading(false);
        });
    }



    const bodyContent = (
        <div className=" flex flex-col gap-4">
            <Heading 
                title="Create a league to start Playing!"
            />
            <Input
                className='bg-background/50 rounded-xl'
                label="League Name"
                placeholder="Enter a League Name"
                value={leagueName}
                onValueChange={setLeagueName}
                color='default'
                radius='sm'
                isRequired
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
}

export default LoginModal