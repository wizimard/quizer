import { useShallow } from "zustand/react/shallow";
import { useDialogStore } from "./dialog.store";

export const useDialog = (key: string) => {
	const { dialog, setOpenDialog, setLockDialog } = useDialogStore(
		useShallow((state) => ({
			dialog: state.dialogs[key],
			setOpenDialog: state.setOpenDialog,
			setLockDialog: state.setLockDialog,
		})),
	);

	const openDialog = () => setOpenDialog(key, true);

	const closeDialog = () => setOpenDialog(key, false);

	const lockDialog = () => setLockDialog(key, true);

	const unlockDialog = () => setLockDialog(key, false);

	return {
		isOpen: dialog?.open ?? false,
		openDialog,
		closeDialog,
		lockDialog,
		unlockDialog,
	};
};

export const useOpenDialog = (key: string) => {
	const setOpenDialog = useDialogStore((state) => state.setOpenDialog);

	return () => setOpenDialog(key, true);
};

export const useCloseDialog = (key: string) => {
	const setOpenDialog = useDialogStore((state) => state.setOpenDialog);

	return () => setOpenDialog(key, false);
};

export const useManageOpenDialog = (key: string) => {
	const { dialog, setOpenDialog } = useDialogStore(
		useShallow((state) => ({
			dialog: state.dialogs[key],
			setOpenDialog: state.setOpenDialog,
		})),
	);

	const openDialog = () => setOpenDialog(key, true);

	const closeDialog = () => setOpenDialog(key, false);

	return {
		isOpen: dialog?.open ?? false,
		openDialog,
		closeDialog,
	};
};

export const useLockDialog = (key: string) => {
	const setLockDialog = useDialogStore((state) => state.setLockDialog);

	const lockDialog = () => setLockDialog(key, true);

	const unlockDialog = () => setLockDialog(key, false);

	return {
		lockDialog,
		unlockDialog,
	};
};

export const useGetDialogData = <T = unknown>(key: string): T | null => {
	const dialog = useDialogStore((state) => state.dialogs[key]);

	const data = dialog?.data as T | undefined;

	return data ?? null;
};

export const useSetDialogData = <T = unknown>(key: string) => {
	const setDialogData = useDialogStore((state) => state.setDialogData);

	return (data: T) => setDialogData(key, data);
};

export const useDialogData = <T = unknown>(key: string) => {
	return {
		data: useGetDialogData<T>(key),
		setData: useSetDialogData<T>(key),
	};
};
