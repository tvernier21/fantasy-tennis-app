'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import Container from "../Container";
import { SafeUser } from "@/app/types";
import EmptyState from "../EmptyState";
import Home from "./Home";

interface MainPageProps {
    currentUser?: SafeUser | null;
}

const MainPage: React.FC<MainPageProps> = ({
    currentUser,
}) => {
    const params = useSearchParams();
    const category = params?.get('category');
    const pathname = usePathname();

    const isMainPage = pathname === '/';
    if (isMainPage) {
        return (
            <div>
                <Container>
                    <Home />
                </Container>
            </div>
        )
    }

    return (
        <div>
            <Container>
                <div className="pt-24">
                    {currentUser?.name}
                </div>
            </Container>
        </div>
    )
}

export default MainPage;