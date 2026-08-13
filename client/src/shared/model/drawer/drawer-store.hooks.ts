import { useShallow } from "zustand/react/shallow";
import { useDrawerStore } from "./drawer.store";

export const useIsOpenDrawer = (key: string) => {
	const { open, _key } = useDrawerStore(
		useShallow((state) => ({
			open: state._open,
			_key: state._key,
		})),
	);

	return open && _key === key;
};

export const useSetOpenDrawer = (key: string) => {
	const setOpen = useDrawerStore((state) => state.setOpen);

	return (open: boolean) => {
		setOpen(key, open);
	};
};

export const useOpenDrawer = (key: string) => {
	const { setOpen, setData } = useDrawerStore(
		useShallow((state) => ({
			setOpen: state.setOpen,
			setData: state.setData,
		})),
	);

	return <T>(data?: T) => {
		setOpen(key, true);
		setData(key, data);
	};
};

export const useCloseDrawer = (key: string) => {
	const setOpen = useDrawerStore((state) => state.setOpen);

	return () => setOpen(key, false);
};

export const useSetLockDrawer = (key: string) => {
	const setLock = useDrawerStore((state) => state.setLock);

	return () => setLock(key, true);
};

export const useSetUnlockDrawer = (key: string) => {
	const setLock = useDrawerStore((state) => state.setLock);

	return () => setLock(key, false);
};

export const useSetDataDrawer = <T = unknown>(key: string) => {
	const setData = useDrawerStore((state) => state.setData);

	return (data: T | ((oldData: T | null) => T | null)) => setData(key, data);
};

export const useGetDataDrawer = <T = unknown>(key: string): T | null => {
	const getData = useDrawerStore((state) => state.getData);

	return getData(key) as T | null;
};
