'use client';

import { useSearchParams, usePathname } from 'next/navigation';

import { TbTournament } from 'react-icons/tb';
import { MdOutlinePersonSearch } from 'react-icons/md';
import { RiTeamLine, RiOrganizationChart } from 'react-icons/ri';

import Container from '../Container';
import CategoryBox from './CategoryBox';

export const categories = [
    {
        label: 'Tournaments',
        pathname: '/tournaments',
        icon: TbTournament,
        description: "List of tournaments"
    },
    {
        label: 'Players',
        pathname: '/players',
        icon: MdOutlinePersonSearch,
        img: '/images/tennis-player-with-racket.png',
        description: "List of tournaments"
    },
    // {
    //     label: 'Teams',
    //     icon: RiTeamLine,
    //     description: "List of tournaments"
    // },
    {
        label: 'Leagues',
        pathname: '/leagues',
        icon: RiOrganizationChart,
        description: "List of tournaments"
    }
]

const Categories = () => {
    const pathname = usePathname();

    return (
        <Container>
            <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
                {categories.map((item) => (
                    <CategoryBox
                        key={item.label}
                        label={item.label}
                        pathname={item.pathname}
                        selected={pathname === item.pathname}
                        icon={item.icon}
                    />
                ))}
            </div>
        </Container>
    )
}

export default Categories;