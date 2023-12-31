import { create } from 'zustand';

interface LeagueModalState {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useLeagueModal = create<LeagueModalState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useLeagueModal;