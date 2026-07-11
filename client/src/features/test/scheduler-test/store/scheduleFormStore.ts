import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface ScheduleFormStore {
	deletedSchedulePeriods: Array<number>;
	addDeletedSchedulePeriod: (id: number) => void;
	clearDeletedSchedulePeriods: () => void;
}

export const useScheduleFormStore = create<ScheduleFormStore>()(
	immer((set) => ({
		deletedSchedulePeriods: [],
		addDeletedSchedulePeriod: (id: number) => {
			set((state) => {
				state.deletedSchedulePeriods.push(id);
			});
		},
		clearDeletedSchedulePeriods: () => {
			set((state) => {
				state.deletedSchedulePeriods = [];
			});
		},
	})),
);
