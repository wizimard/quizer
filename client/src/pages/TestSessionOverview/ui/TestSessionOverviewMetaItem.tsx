import type { LucideIcon } from "lucide-react";
import { Typography } from "@shared/ui/typography";

interface TestSessionOverviewMetaItemProps {
	icon: LucideIcon;
	label: string;
	value: string;
}

export const TestSessionOverviewMetaItem = ({ icon: Icon, label, value }: TestSessionOverviewMetaItemProps) => {
	return (
		<div className="flex min-w-0 flex-1 items-start gap-3 rounded-xl bg-card/60 px-4 py-3 ring-1 ring-foreground/10">
			<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
				<Icon className="size-4" aria-hidden />
			</div>
			<div className="min-w-0 flex-1">
				<Typography variant="caption" className="text-muted-foreground">
					{label}
				</Typography>
				<Typography variant="subtitle1" className="truncate font-medium text-foreground tabular-nums">
					{value}
				</Typography>
			</div>
		</div>
	);
};
