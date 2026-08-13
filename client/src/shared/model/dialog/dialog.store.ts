import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Dialog<T = unknown> {
	open: boolean;
	lock: boolean;
	data: T;
}

export interface DialogStore {
	dialogs: Record<string, Dialog>;

	setOpenDialog: (key: string, open: boolean) => void;
	setLockDialog: (key: string, lock: boolean) => void;
	setDialogData: <T>(key: string, data: T) => void;
}

export const useDialogStore = create<DialogStore>()(
	immer((set, get) => ({
		dialogs: {},

		setOpenDialog: (key: string, open: boolean) => {
			if (open) {
				set((state) => {
					state.dialogs = {
						...state.dialogs,
						[key]: {
							open: true,
							lock: false,
							data: null,
						},
					};
				});
				return;
			}

			const dialog = get().dialogs[key];

			if (!dialog || dialog.lock) {
				return;
			}

			set((state) => {
				delete state.dialogs[key];
			});
		},
		setLockDialog: (key: string, lock: boolean) => {
			set((state) => {
				if (state.dialogs[key] && state.dialogs[key].open) {
					state.dialogs[key].lock = lock;
				}
			});
		},
		setDialogData: <T>(key: string, data: T) => {
			set((state) => {
				if (state.dialogs[key] && state.dialogs[key].open) {
					state.dialogs[key].data = data;
				}
			});
		},
	})),
);
