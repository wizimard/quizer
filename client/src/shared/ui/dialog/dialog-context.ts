import { createContext } from "react";

export interface IDialogContextValue {
	isLocked: boolean;
	lock(): void;
	unlock(): void;
}

const dialogContextDefaultValue: IDialogContextValue = {
	isLocked: false,
	lock: () => {},
	unlock: () => {},
};

export const dialogContext = createContext<IDialogContextValue>(dialogContextDefaultValue);
