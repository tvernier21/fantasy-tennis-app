'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import { TbTournament } from 'react-icons/tb';
import { MdOutlinePersonSearch } from 'react-icons/md';
import { RiTeamLine, RiOrganizationChart } from 'react-icons/ri';

import Container from '../Container';
import CategoryBox from './CategoryBox';

export const categories = [
    {
        label: 'Tournaments',
        icon: TbTournament,
        description: "List of tournaments"
    },
    {
        label: 'Players',
        icon: MdOutlinePersonSearch,
        img: '/images/tennis-player-with-racket.png',
        description: "List of tournaments"
    },
    {
        label: 'Teams',
        icon: RiTeamLine,
        description: "List of tournaments"
    },
    {
        label: 'Leagues',
        icon: RiOrganizationChart,
        description: "List of tournaments"
    }
]

const Categories = () => {
    const params = useSearchParams();
    const category = params?.get('category');
    const pathname = usePathname();

    const isMainPage = pathname === '/';

    if (!isMainPage) {
        return null;
    }

    return (
        <Container>
            <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
                {categories.map((item) => (
                    <CategoryBox
                        key={item.label}
                        label={item.label}
                        selected={category === item.label}
                        icon={item.icon}
                    />
                ))}
            </div>
        </Container>
    )
}

export default Categories;