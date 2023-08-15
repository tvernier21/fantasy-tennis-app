'use client';

import { useRouter } from 'next/navigation'

import Heading from './Heading';
import Button from './Button';

interface EmptyStateProps {
    title?: string
    subtitle?: string
    categorySelected?: string
    showReset?: boolean
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'No data to display',
    subtitle = 'Try adjusting your search or filter to find what you are looking for.',
    categorySelected,
    showReset
}) => {
    const router = useRouter()

    return (
        <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
            <Heading
                center
                title = {title}
                subtitle = {subtitle}
            />
            <div>
                {showReset && (
                    <Button
                        outline
                        label="Go to homepage"
                        onClick={() => router.push((categorySelected ? `/${categorySelected}` : '/'))}
                    />
                )}
            </div>
        </div>
    )
}

export default EmptyState