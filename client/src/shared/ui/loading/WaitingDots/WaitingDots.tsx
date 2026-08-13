import { cn } from "@shared/lib/utils";

interface WaitingDotsProps {
	className?: string;
}

export const WaitingDots = ({ className }: WaitingDotsProps) => (
	<span className="inline-flex items-center gap-1" aria-hidden>
		{[0, 150, 300].map((delay) => (
			<span
				key={delay}
				className={cn("size-1.5 animate-bounce rounded-full", className)}
				style={{ animationDelay: `${delay}ms` }}
			/>
		))}
	</span>
);
