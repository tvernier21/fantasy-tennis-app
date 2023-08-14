'use client';

interface MenuItemProps {
    onClick: () => void;
    label: string;
}    

const MenuItem: React.FC<MenuItemProps> = ({
    onClick,
    label
}) => {
    return (
        <div
            onClick={onClick} 
            className="px-1 py-2 hover:bg-neutral-100 transition font-semibold">  
            {label}
        </div>
    )
}

export default MenuItem;