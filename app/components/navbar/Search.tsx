'use client';

import Button from '@/app/components/Button';
import { BiSearch } from "react-icons/bi";

const Search = () => {
    return (
        <div className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
            <div className="flex flex-row items-center justify-between">
                <hr />
                <Button 
                    label="Tournaments"
                    outline
                    onClick={() => {}}
                />
                <Button 
                    label="Players"
                    outline
                    onClick={() => {}}
                />
                <Button 
                    label="Teams"
                    outline
                    onClick={() => {}}
                />
                <Button 
                    label="Leagues"
                    onClick={() => {}}
                />
                
                {/* <div className="text-sm font-semibold px-6">
                    <Button 
                        label="Tournaments"
                        onClick={() => {}}
                    />
                </div>
                <div className="hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center">
                    <Button 
                        label="Players"
                        onClick={() => {}}
                    />
                </div>
                <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
                    <div className="hidden sm:block">
                        Player Name
                    </div>
                    <div className="p-2 bg-rose-500 rounded-full text-white">
                        <BiSearch size={18} />
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Search;