import { cn } from "@shared/lib/utils";
import { Separator } from "@shared/ui/kit/separator";

export interface VerticalListItemCardProps {
	header?: React.ReactNode;
	content: React.ReactNode;
	className?: string;
}

export const VerticalListItemCard = ({ header, content, className }: VerticalListItemCardProps) => {
	const classes = cn("flex w-full min-w-0 flex-col gap-1 rounded-xl bg-transparent text-foreground ring-1 ring-foreground/10 transition-[background-color,box-shadow] duration-200", className ?? "");

	return (
		<div className={classes}>
			{header && (
				<>
					<div className="flex w-full min-w-0 p-4">{header}</div>
					<Separator />
				</>
			)}
			<div className="px-4 pb-4 pt-2">{content}</div>
		</div>
	);
};
