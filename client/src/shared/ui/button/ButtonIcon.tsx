import { Button } from "@shared/ui/kit/button";
import { cn } from "@shared/lib/utils";

export type TButtonIconProps = Omit<React.ComponentProps<typeof Button>, "variant" | "size"> & {
	children: React.ReactNode;
};

export const ButtonIcon = ({ children, className, type = "button", ...props }: TButtonIconProps) => {
	return (
		<Button
			type={type}
			variant="ghost"
			className={cn("h-auto w-auto cursor-pointer border-none bg-transparent p-1 text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground", className)}
			{...props}
		>
			{children}
		</Button>
	);
};
