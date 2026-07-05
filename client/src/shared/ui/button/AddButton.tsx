import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../kit/button";
import { cn } from "@shared/lib/utils";

export interface IAddButtonProps {
	onClick: () => void;
	label: string;
}

export const AddButton = ({ onClick, label }: IAddButtonProps) => {
	const { t } = useTranslation();

	return (
		<Button
			type="button"
			variant="outline"
			className={cn(
				"h-auto w-full gap-2 rounded-xl border-dashed py-3.5 shadow-none",
				"border-border/80 bg-muted/40 text-muted-foreground",
				"hover:border-foreground/20 hover:bg-muted hover:text-foreground",
			)}
			onClick={onClick}
		>
			<PlusIcon className="size-4" />
			<span>{t(label)}</span>
		</Button>
	);
};
