import { useContext } from "react";
import { dialogContext } from "./dialog-context";
import { Dialog } from "@shared/ui/kit/dialog";

export const DialogWithContext = ({ children, onOpenChange, ...props }: React.ComponentProps<typeof Dialog>) => {
	const { isLocked } = useContext(dialogContext);

	const handleOpenChange = (open: boolean) => {
		if (isLocked) return;
		onOpenChange?.(open);
	};

	return (
		<Dialog {...props} onOpenChange={handleOpenChange}>
			{children}
		</Dialog>
	);
};
