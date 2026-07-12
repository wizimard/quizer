import { Button } from "@shared/ui/kit/button";
import { Spinner } from "@shared/ui/kit/spinner";
import { cn } from "@shared/lib/utils";

type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "destructive" | "link" | "contained" | "outlined" | "text";

const variantMap: Record<ButtonVariant, React.ComponentProps<typeof Button>["variant"]> = {
	default: "default",
	contained: "default",
	outlined: "outline",
	outline: "outline",
	secondary: "secondary",
	ghost: "ghost",
	text: "ghost",
	destructive: "destructive",
	link: "link",
};

export type DefaultButtonProps = Omit<React.ComponentProps<typeof Button>, "variant"> & {
	children: React.ReactNode;
	isLoading?: boolean;
	variant?: ButtonVariant;
};

const DefaultButton = ({ children, type = "button", isLoading, variant = "outline", className, disabled, ...props }: DefaultButtonProps) => {
	return (
		<Button type={type} variant={variantMap[variant]} className={cn(className)} disabled={disabled || isLoading} {...props}>
			{isLoading ? <Spinner className="size-4" /> : children}
		</Button>
	);
};

export default DefaultButton;
