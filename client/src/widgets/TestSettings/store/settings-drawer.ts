import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface TestSettingsDrawerState {
	isOpen: boolean;
	setIsOpen(isOpen: boolean): void;
}

// TODO: rewrite to context
export const useTestSettingsDrawer = create<TestSettingsDrawerState>()(
	immer((set) => ({
		isOpen: false,
		setIsOpen: (isOpen: boolean) => {
			set((state) => {
				state.isOpen = isOpen;
			});
		},
	})),
);
