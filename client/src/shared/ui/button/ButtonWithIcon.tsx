import type { LucideIcon } from "lucide-react";
import { Button } from "@shared/ui/kit/button";
import { cn } from "@shared/lib/utils";

export type TButtonWithIconProps = React.ComponentProps<typeof Button> & {
	text: string;
	Icon: LucideIcon;
};

export const ButtonWithIcon = ({ text, Icon, className, variant = "outline", type = "button", ...props }: TButtonWithIconProps) => {
	return (
		<Button className={cn("flex h-9 items-center gap-1.5 text-inherit", className)} variant={variant} type={type} {...props}>
			<Icon className="size-4" />
			<span>{text}</span>
		</Button>
	);
};
