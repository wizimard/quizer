import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface ISettingsFormStore {
	deletedAvailablePeriods: Array<number>;
	addDeletedAvailablePeriod: (id: number) => void;
	clearDeletedAvailablePeriods: () => void;
}

export const useSettingsFormStore = create<ISettingsFormStore>()(
	immer((set) => ({
		deletedAvailablePeriods: [],
		addDeletedAvailablePeriod: (id: number) => {
			set((state) => {
				state.deletedAvailablePeriods.push(id);
			});
		},
		clearDeletedAvailablePeriods: () => {
			set((state) => {
				state.deletedAvailablePeriods = [];
			});
		},
	})),
);
