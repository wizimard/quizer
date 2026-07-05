import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface IQuizSettingsDrawerState {
	isOpen: boolean;
	setIsOpen(isOpen: boolean): void;
}

export const useQuizSettingsDrawer = create<IQuizSettingsDrawerState>()(
	immer((set) => ({
		isOpen: false,
		setIsOpen: (isOpen: boolean) => {
			set((state) => {
				state.isOpen = isOpen;
			});
		},
	})),
);
