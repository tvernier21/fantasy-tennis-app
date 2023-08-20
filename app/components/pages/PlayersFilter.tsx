'use client';

import React, { useEffect, useState, useCallback } from 'react';

import MultiRangeSlider from '../Inputs/MultiRangeSlider';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';

const PlayersFilter = () => {
    // const [search, setSearch] = useState('');

    const params = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const handleElo = useCallback(({min, max}: {min: number, max: number}) => {
        let currentQuery = {};
        let basePath = '/'
        
        if (params) {
            currentQuery = qs.parse(params.toString())
        }
        if (pathname) {
            basePath = pathname.split('/')[1]
        }

        const updatedQuery: any = {
            ...currentQuery,
            eloMax: max,
            eloMin: min,
        }

        const url = qs.stringifyUrl({
            url: basePath,
            query: updatedQuery
        }, { skipNull: true });

        router.push(url);
    }, [router, params]);
    const handleAge = useCallback(({min, max}: {min: number, max: number}) => {
        let currentQuery = {};
        let basePath = '/'
        
        if (params) {
            currentQuery = qs.parse(params.toString())
        }
        if (pathname) {
            basePath = pathname.split('/')[1]
        }

        const updatedQuery: any = {
            ...currentQuery,
            ageMax: max,
            ageMin: min,
        }

        const url = qs.stringifyUrl({
            url: basePath,
            query: updatedQuery
        }, { skipNull: true });

        router.push(url);
    }, [router, params]);


    return (
        <div className='flex flex-col justify-center mb-4 mt-2'>
            {/* <div className="mb-2">
                <input 
                    className="peer w-full p-2 pt-2 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder='Search by name'
                    value = {search}
                    onChange = {(e) => {
                        setSearch(e.target.value);
                    }}
                />
            </div> */}
            <div className="flex flex-row mb-7">
                <label>Age: </label>
                <MultiRangeSlider
                    min={15}
                    max={40}
                    onChange={({min, max}: { min: number; max: number }) => {
                        handleAge({min, max});
                    }}
                />
            </div>
            <div className="flex flex-row mb-4">
                <label>Elo:  </label>
                <MultiRangeSlider
                    min={1200}
                    max={2500}
                    onChange={({ min, max }: { min: number; max: number }) =>
                        handleElo({min, max})
                    }
                />
            </div>
        </div>
    );
};

export default PlayersFilter;