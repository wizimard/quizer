import { useState } from "react";
import type { Dialog } from "../kit/dialog";
import { dialogContext } from "./dialog-context";
import { DialogWithContext } from "./DialogWithContext";

export const BaseDialog = ({ children, ...props }: React.ComponentProps<typeof Dialog>) => {
	const [isLocked, setIsLocked] = useState(false);

	const lock = () => {
		setIsLocked(true);
	};

	const unlock = () => {
		setIsLocked(false);
	};

	return (
		<dialogContext.Provider value={{ isLocked, lock, unlock }}>
			<DialogWithContext {...props}>{children}</DialogWithContext>
		</dialogContext.Provider>
	);
};
