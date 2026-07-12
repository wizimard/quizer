import { useCallback } from "react";
import { useDrawerStore } from "./drawer.store";

export const useIsOpenDrawer = (key: string) => {
	return useDrawerStore((state) => state.isOpen(key));
};

export const useSetOpenDrawer = (key: string) => {
	const setOpen = useDrawerStore((state) => state.setOpen);

	return useCallback(
		(open: boolean) => {
			setOpen(key, open);
		},
		[key, setOpen],
	);
};

export const useOpenDrawer = (key: string) => {
	const setOpen = useDrawerStore((state) => state.setOpen);
	const setData = useDrawerStore((state) => state.setData);

	return useCallback(
		<T>(data?: T) => {
			setOpen(key, true);
			setData(key, data);
		},
		[key, setOpen, setData],
	);
};

export const useCloseDrawer = (key: string) => {
	const setOpen = useDrawerStore((state) => state.setOpen);

	return useCallback(() => setOpen(key, false), [key, setOpen]);
};

export const useSetLockDrawer = (key: string) => {
	const setLock = useDrawerStore((state) => state.setLock);

	return useCallback(() => setLock(key, true), [key, setLock]);
};

export const useSetUnlockDrawer = (key: string) => {
	const setLock = useDrawerStore((state) => state.setLock);

	return useCallback(() => setLock(key, false), [key, setLock]);
};

export const useSetDataDrawer = (key: string) => {
	const setData = useDrawerStore((state) => state.setData);

	return useCallback((data: unknown) => setData(key, data), [key, setData]);
};

export const useGetDataDrawer = <T = unknown>(key: string): T | null => {
	const getData = useDrawerStore((state) => state.getData);

	return getData(key) as T | null;
};
