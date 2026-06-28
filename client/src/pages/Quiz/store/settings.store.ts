import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface IQuizSettingsState {
	isOpen: boolean;
	setIsOpen(isOpen: boolean): void;
}

export const useQuizSettings = create<IQuizSettingsState>()(
	immer((set) => ({
		isOpen: false,
		setIsOpen: (isOpen: boolean) => {
			set((state) => {
				state.isOpen = isOpen;
			});
		},
	})),
);
