import { cn } from "@shared/lib/utils";

type TCenterElementProps = {
	children: React.ReactNode;
	directory?: "column" | "column-reverse" | "row" | "row-reverse";
	className?: string;
};

const CenterElement = ({ children, directory = "column", className }: TCenterElementProps) => {
	return (
		<div
			className={cn(
				"flex h-full w-full items-center justify-center",
				directory === "column" && "flex-col",
				directory === "column-reverse" && "flex-col-reverse",
				directory === "row" && "flex-row",
				directory === "row-reverse" && "flex-row-reverse",
				className,
			)}
		>
			{children}
		</div>
	);
};

export default CenterElement;
