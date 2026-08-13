import { Timer } from "lucide-react";
import { cn } from "@shared/lib/utils";

export interface ElapsedTimerProps {
	elapsed: string;
	isRunning?: boolean;
	title?: string;
	className?: string;
}

export const ElapsedTimer = ({ elapsed, isRunning = false, title, className }: ElapsedTimerProps) => {
	return (
		<div
			className={cn(
				"flex items-center gap-2 rounded-lg border px-3 py-1.5 tabular-nums",
				isRunning
					? "border-emerald-500/25 bg-emerald-50/80 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-300"
					: "border-border bg-muted/40 text-muted-foreground",
				className,
			)}
			title={title}
		>
			<span className="relative flex size-2">
				{isRunning && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />}
				<span className={cn("relative inline-flex size-2 rounded-full", isRunning ? "bg-emerald-500" : "bg-muted-foreground/50")} />
			</span>
			<Timer className="size-3.5 shrink-0 opacity-70" aria-hidden />
			<span className="font-mono text-sm font-medium tracking-wide">{elapsed}</span>
		</div>
	);
};
