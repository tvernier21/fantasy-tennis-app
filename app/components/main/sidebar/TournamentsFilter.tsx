'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';

import MultiRangeSlider from '../../Inputs/MultiRangeSlider';

const TournamentsFilter = () => {

    const params = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const handleLevel = useCallback(({min, max}: {min: number, max: number}) => {
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
            lvlMin: min,
            lvlMax: max,
        }

        const url = qs.stringifyUrl({
            url: basePath,
            query: updatedQuery
        }, { skipNull: true });

        router.push(url);
    }, [router, params, pathname]);


    return (
        <div className='flex flex-col justify-center mb-4 mt-2'>
            <div className="flex flex-row mb-7">
                <label>level: </label>
                <MultiRangeSlider
                    min={0}
                    max={5}
                    onChange={({min, max}: { min: number; max: number }) => {
                        handleLevel({min, max});
                    }}
                />
            </div>
        </div>
    );
};

export default TournamentsFilter;