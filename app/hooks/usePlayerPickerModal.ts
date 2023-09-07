import { create } from 'zustand';

interface PlayerPickerModalState {
    isOpen: boolean;
    currPlayer: any;
    onOpen: () => void;
    onClose: () => void;
    onOpenWithPlayer: (player: any) => void;
}

const usePlayerPickerModal = create<PlayerPickerModalState>((set) => ({
    isOpen: false,
    currPlayer: null,
    onOpen: () => set({ isOpen: true, currPlayer: null }),
    onClose: () => set({ isOpen: false }),
    onOpenWithPlayer: (player: any) => set({ isOpen: true, currPlayer: player })
}));

export default usePlayerPickerModal;