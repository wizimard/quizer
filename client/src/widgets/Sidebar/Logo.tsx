import { Link } from "react-router-dom";
import { cn } from "@shared/lib/utils";
import { Typography } from "@shared/ui/typography";

type TLogoProps = {
	className?: string;
};

export const Logo = ({ className }: TLogoProps) => {
	return (
		<Link to="/" aria-label="Tester" className={cn("flex items-center gap-2 transition-opacity hover:opacity-80", className)}>
			<svg aria-hidden="true" className="size-7 shrink-0 text-green-600" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect width="28" height="28" rx="7" fill="currentColor" />
				<path d="M9.25 6.75h9.5A1.25 1.25 0 0 1 20 8v12a1.25 1.25 0 0 1-1.25 1.25h-9.5A1.25 1.25 0 0 1 8 20V8a1.25 1.25 0 0 1 1.25-1.25z" fill="white" />
				<path d="M11 11h6M11 14h6M11 17h3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
				<circle cx="18.75" cy="17.25" r="4.35" fill="currentColor" />
				<path d="M16.85 17.25l1.25 1.25 2.55-2.65" stroke="white" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
			<Typography variant="subtitle1" component="span" className="font-semibold tracking-tight text-green-600">
				Tester
			</Typography>
		</Link>
	);
};
