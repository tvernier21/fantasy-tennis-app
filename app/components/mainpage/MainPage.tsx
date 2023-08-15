'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';

import Container from "../Container";
import { SafeUser } from "@/app/types";
import Home from "./Home";
import SideBar from "./components/Sidebar";


export const tounaments_fake = [
    {
        name: 'Australian Open',
        level: 'Grand Slam',
        location: 'Melbourne, Australia'
    },
    {
        name: 'Roland Garros',
        level: 'Grand Slam',
        location: 'Paris, France'
    },
    {
        name: 'Wimbledon',
        level: 'Grand Slam',
        location: 'London, England'
    },
    {
        name: 'US Open',
        level: 'Grand Slam',
        location: 'New York, USA'
    },
]

export const players_fake = [
    {
        name: 'Novak Djokovic',
        elo: [2800, 2700, 2600, 2500],
        yelo: [2700, 2600, 2500, 2400]
    },
    {
        name: 'Rafael Nadal',
        elo: [2700, 2600, 2500, 2400],
        yelo: [2600, 2500, 2400, 2300]
    },
    {
        name: 'Roger Federer',
        elo: [2600, 2500, 2400, 2300],
        yelo: [2500, 2400, 2300, 2200]
    },
]



interface MainPageProps {
    players: any;
    tournaments: any;
    currentUser?: SafeUser | null;
}

const MainPage: React.FC<MainPageProps> = ({
    currentUser,
    players,
    tournaments
}) => {
    const params = useSearchParams();
    const category = params?.get('category');
    const pathname = usePathname();

    const route = useRouter();

    if (category === null && pathname === '/') {
        return (
            <div>
                <Home />
            </div>
        )
    }

    return (
        <div>
            <Container>
                <div className="h-full">
                    <SideBar />
                </div>
            </Container>
        </div>
    )
}

export default MainPage;