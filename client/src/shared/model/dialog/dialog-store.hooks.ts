import { useCallback } from "react";
import { useDialogStore } from "./dialog.store";

export const useDialog = (key: string) => {
	const { getDialog, setOpenDialog, setLockDialog } = useDialogStore();

	const dialog = getDialog(key);

	const openDialog = useCallback(() => {
		setOpenDialog(key, true);
	}, [key, setOpenDialog]);

	const closeDialog = useCallback(() => {
		setOpenDialog(key, false);
	}, [key, setOpenDialog]);

	const lockDialog = useCallback(() => {
		setLockDialog(key, true);
	}, [key, setLockDialog]);

	const unlockDialog = useCallback(() => {
		setLockDialog(key, false);
	}, [key, setLockDialog]);

	return {
		isOpen: dialog?.open ?? false,
		openDialog,
		closeDialog,
		lockDialog,
		unlockDialog,
	};
};

export const useSetOpenDialog = (key: string) => {
	const { setOpenDialog } = useDialogStore();

	return useCallback((open: boolean) => setOpenDialog(key, open), [key, setOpenDialog]);
};

export const useOpenDialog = (key: string) => {
	const { setOpenDialog } = useDialogStore();

	return useCallback(() => setOpenDialog(key, true), [key, setOpenDialog]);
};

export const useCloseDialog = (key: string) => {
	const { setOpenDialog } = useDialogStore();

	return useCallback(() => setOpenDialog(key, false), [key, setOpenDialog]);
};

export const useManageOpenDialog = (key: string) => {
	const { getDialog, setOpenDialog } = useDialogStore();

	const isOpen = getDialog(key)?.open ?? false;

	const openDialog = useCallback(() => {
		setOpenDialog(key, true);
	}, [key, setOpenDialog]);

	const closeDialog = useCallback(() => {
		setOpenDialog(key, false);
	}, [key, setOpenDialog]);

	return {
		isOpen,
		openDialog,
		closeDialog,
	};
};

export const useLockDialog = (key: string) => {
	const { setLockDialog } = useDialogStore();

	const lockDialog = useCallback(() => {
		setLockDialog(key, true);
	}, [key, setLockDialog]);

	const unlockDialog = useCallback(() => {
		setLockDialog(key, false);
	}, [key, setLockDialog]);

	return {
		lockDialog,
		unlockDialog,
	};
};

export const useGetDialogData = <T = unknown>(key: string): T | null => {
	const getDialog = useDialogStore((state) => state.getDialog);

	const data = getDialog(key)?.data as T | undefined;

	return data ?? null;
};

export const useSetDialogData = <T = unknown>(key: string) => {
	const setDialogData = useDialogStore((state) => state.setDialogData);

	return useCallback((data: T) => setDialogData(key, data), [key, setDialogData]);
};

export const useDialogData = <T = unknown>(key: string) => {
	return {
		data: useGetDialogData<T>(key),
		setData: useSetDialogData<T>(key),
	};
};
