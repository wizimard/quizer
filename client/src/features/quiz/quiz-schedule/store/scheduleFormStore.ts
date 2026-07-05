import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface IScheduleFormStore {
	deletedAvailablePeriods: Array<number>;
	addDeletedAvailablePeriod: (id: number) => void;
	clearDeletedAvailablePeriods: () => void;
}

export const useScheduleFormStore = create<IScheduleFormStore>()(
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
