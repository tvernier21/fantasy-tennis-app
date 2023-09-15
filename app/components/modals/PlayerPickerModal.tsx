'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectItem, SelectedItems, Selection } from "@nextui-org/react";

import usePlayerPickerModal from '../../hooks/usePlayerPickerModal';
import Modal from './Modal';
import Heading from '../Heading';


const PlayerPickerModal = () => {
    const router = useRouter();
    const selected = useSearchParams()?.get("selected");
    const playerPickerModal = usePlayerPickerModal();
    const [isLoading, setIsLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [value, setValue] = useState<Selection>(new Set([]));
    const [players, setPlayers] = useState([]);

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
        const endpoint = '/api/players/tournamentPlayers';
        const oldPlayerCost = playerPickerModal.currPlayer ? playerPickerModal.currPlayer.elo : 0;

        axios.get(endpoint, {params: {
                                leagueId: selected,
                                currPlayerBudget: oldPlayerCost
                            }})
            .then((res) => {
                setPlayers(res.data);
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
    }, [playerPickerModal.isOpen, playerPickerModal.currPlayer, selected]);


    useEffect(() => {
        if (!value || (value as Set<any>).size === 0) {
            setButtonDisabled(true);
        }
        else {
            setButtonDisabled(false);
        }
    }, [value]);


    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (buttonDisabled || !selected) return;

        const oldPlayerId = playerPickerModal.currPlayer ? playerPickerModal.currPlayer.id : "";
        const oldPlayerCost = playerPickerModal.currPlayer ? playerPickerModal.currPlayer.elo : 0
        
        // Check if value has the property currentKey
        if (typeof value !== "string" && "currentKey" in value) {
            // Construct the data to send
            const postData = {
                ...data,
                leagueId: selected,
                oldPlayerId: oldPlayerId,
                oldPlayerCost: oldPlayerCost,
            };
            setIsLoading(true);
            const endpoint = `/api/teams/${value.currentKey}`;
            axios.post(endpoint, postData)
                .then(() => {
                    toast.success('Player Added!');
                    router.refresh();
                    playerPickerModal.onClose();
                })
                .catch(() => {
                    toast.error('Something went wrong.');
                })
                .finally(() => {
                    setIsLoading(false);
            });
        } else {
            toast.error('Invalid selection.');
        }
    }

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading 
                title="Select a player to add to your team"
            />
            <Select
                items={players}
                label="Select player"
                selectedKeys={value}
                onSelectionChange={setValue}
                className="max-w-xs"
                classNames={{
                    label: "group-data-[filled=true]:-translate-y-5",
                    trigger: "min-h-unit-16",
                    listboxWrapper: "max-h-[400px]",
                }}
                listboxProps={{
                    itemClasses: {
                    base: [
                        "rounded-md",
                        "text-default-500",
                        "transition-opacity",
                        "data-[hover=true]:text-foreground",
                        "data-[hover=true]:bg-default-100",
                        "dark:data-[hover=true]:bg-default-50",
                        "data-[selectable=true]:focus:bg-default-50",
                        "data-[pressed=true]:opacity-70",
                        "data-[focus-visible=true]:ring-default-500",
                    ],
                    },
                }}
                popoverProps={{
                    classNames: {
                        base: "p-0 border-small border-divider bg-background",
                        arrow: "bg-default-200",
                    },
                }}
                renderValue={(players: SelectedItems<any>) => {
                    return players.map((player) => (
                        <div key={player.key} className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <span>{player.data.name}</span>
                                <span className="text-default-500 text-tiny">({player.data.elo.toFixed(2)})</span>
                            </div>
                        </div>
                    ));
                }}
            >
                {(player) => (
                    <SelectItem key={player.id} textValue={player.name}>
                        <div className="flex gap-2 items-center">
                            <div className="flex flex-col">
                                <span className="text-small">{player.name}</span>
                                <span className="text-tiny text-default-400">{player.elo.toFixed(2)}</span>
                            </div>
                        </div>
                    </SelectItem>
                )}
            </Select>
        </div>
    );
        
    return(
        <div>
            <Modal 
                disabled={isLoading}
                isOpen={playerPickerModal.isOpen}
                title="Pick a Player"
                actionLabel="PlayerPicker"
                onClose={playerPickerModal.onClose}
                body={bodyContent}
                onSubmit={handleSubmit(onSubmit)}
                buttonDisabled={buttonDisabled}
            />
        </div>
    )
};

export default PlayerPickerModal;
