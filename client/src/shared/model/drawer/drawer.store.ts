import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface DrawerState<T = unknown> {
	_key: string;
	_open: boolean;
	isOpen: (key: string) => boolean;
	setOpen: (key: string, open: boolean) => void;
	lock: boolean;
	setLock: (key: string, lock: boolean) => void;

	_data: T | null;
	setData: (key: string, data: T | null) => void;
	getData: (key: string) => T | null;
}

export const useDrawerStore = create<DrawerState<unknown>>()(
	immer((set, get) => ({
		_key: "",
		_open: false,
		lock: false,
		isOpen: (key) => {
			return get()._key === key && get()._open;
		},
		setOpen: (key, open) => {
			const state: DrawerState = get();

			if (open && !state._key) {
				set((state: DrawerState) => {
					state._key = key;
					state._open = open;
				});
			}

			if (!open && state._key === key) {
				set((state: DrawerState) => {
					state._key = "";
					state._open = open;
				});
			}
		},
		setLock: (key, lock) => {
			const state: DrawerState = get();

			if (!state._open || state._key !== key) {
				return;
			}

			set((state: DrawerState) => {
				state.lock = lock;
			});
		},

		_data: null,
		setData: (key: string, data: unknown) => {
			const state: DrawerState = get();

			if (!state._open || state._key !== key) {
				return;
			}

			set((state: DrawerState) => {
				state._data = data;
			});
		},
		getData: <T>(key: string): T | null => {
			const state: DrawerState = get();

			if (!state._open || state._key !== key) {
				return null as T;
			}

			return state._data as T;
		},
	})),
);
