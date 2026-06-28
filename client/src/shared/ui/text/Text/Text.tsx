import { cn } from "@shared/lib/utils";

const variantClasses = {
	h1: "text-4xl font-semibold tracking-tight",
	h2: "text-3xl font-semibold tracking-tight",
	h3: "text-2xl font-semibold tracking-tight",
	h4: "text-2xl font-semibold tracking-tight",
	h5: "text-xl font-semibold tracking-tight",
	h6: "text-lg font-semibold tracking-tight",
	body1: "text-base",
	body2: "text-sm",
	subtitle1: "text-base font-medium",
	subtitle2: "text-sm font-medium",
	caption: "text-xs text-muted-foreground",
	overline: "text-xs uppercase tracking-wide text-muted-foreground",
} as const;

const alignClasses = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
	justify: "text-justify",
} as const;

type TTextVariant = keyof typeof variantClasses;
type TTextAlign = keyof typeof alignClasses;
type THeadingVariant = Extract<TTextVariant, "h1" | "h2" | "h3" | "h4" | "h5" | "h6">;

const isHeadingVariant = (variant: TTextVariant): variant is THeadingVariant => variant === "h1" || variant === "h2" || variant === "h3" || variant === "h4" || variant === "h5" || variant === "h6";

type TDefaultTextProps = {
	children: React.ReactNode;
	variant?: TTextVariant;
	component?: keyof React.JSX.IntrinsicElements;
	className?: string;
	align?: TTextAlign;
	color?: "inherit" | "error" | "primary" | "secondary";
};

const Text = ({ children, variant = "body1", component, className, align, color }: TDefaultTextProps) => {
	const Component: keyof React.JSX.IntrinsicElements = component ?? (isHeadingVariant(variant) ? variant : "p");

	return (
		<Component
			className={cn(
				"text-muted-foreground text-foreground",
				variantClasses[variant],
				align && alignClasses[align],
				color === "error" && "text-destructive",
				color === "primary" && "text-primary",
				color === "secondary" && "text-secondary-foreground",
				className,
			)}
		>
			{children}
		</Component>
	);
};

export default Text;
