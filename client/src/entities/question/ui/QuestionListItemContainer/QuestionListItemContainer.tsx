import type { ReactNode } from "react";
import { cn } from "@shared/lib/utils";

interface QuestionListItemContainerProps {
	children: ReactNode;
	isError?: boolean;
}

export const QuestionListItemContainer = ({ children, isError }: QuestionListItemContainerProps) => {
	return (
		<div
			className={cn(
				"flex w-full min-w-0 flex-col gap-1 rounded-xl bg-muted p-4 text-foreground ring-1 ring-foreground/10 transition-[background-color,box-shadow] duration-200",
				isError && "bg-destructive/5 ring-2 ring-destructive/30",
			)}
		>
			{children}
		</div>
	);
};
