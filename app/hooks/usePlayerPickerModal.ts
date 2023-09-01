import { create } from 'zustand';

interface PlayerPickerModalState {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const usePlayerPickerModal = create<PlayerPickerModalState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default usePlayerPickerModal;