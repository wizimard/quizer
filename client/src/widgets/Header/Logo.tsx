import { Link } from "react-router-dom";
import { cn } from "@shared/lib/utils";
import { Typography } from "@shared/ui/typography";

type TLogoProps = {
	className?: string;
};

export const Logo = ({ className }: TLogoProps) => {
	return (
		<Link to="/" aria-label="Quizer" className={cn("flex items-center gap-2 transition-opacity hover:opacity-80", className)}>
			<svg aria-hidden="true" className="size-7 shrink-0 text-green-600" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect width="28" height="28" rx="7" fill="currentColor" />
				<path d="M14 7.5c-2.76 0-5 2.01-5 4.5 0 1.54.82 2.9 2.06 3.68V18h5.88v-2.32c1.24-.78 2.06-2.14 2.06-3.68 0-2.49-2.24-4.5-5-4.5z" fill="white" />
				<circle cx="14" cy="20.5" r="1.5" fill="white" />
			</svg>
			<Typography variant="subtitle1" component="span" className="font-semibold tracking-tight text-green-600">
				Quizer
			</Typography>
		</Link>
	);
};
