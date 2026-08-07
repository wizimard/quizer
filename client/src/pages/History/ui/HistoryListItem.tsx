import { format } from "date-fns";
import { ChevronRight, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { TestLaunchHistory } from "@entities/test";
import { Typography } from "@shared/ui/typography";
import { DotSeparator } from "@shared/ui/separator";
import { TestLaunchResponseRunModeEnum } from "@shared/api/generated";

interface HistoryListItemProps {
	launch: TestLaunchHistory;
}

export const HistoryListItem = ({ launch }: HistoryListItemProps) => {
	const { t } = useTranslation();

	const runModeLabel = launch.runMode === TestLaunchResponseRunModeEnum.Manual ? t("history.run_mode.manual") : t("history.run_mode.free");

	return (
		<li>
			<Link
				to={`/test-history/${launch.testId}/${launch.sessionId}`}
				className="group flex w-full items-center gap-4 rounded-xl bg-card/50 px-4 py-3.5 text-foreground ring-1 ring-foreground/10 transition-colors hover:bg-muted/50 hover:ring-foreground/15"
			>
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<Typography component="span" variant="subtitle1" className="truncate text-foreground">
						{launch.testTitle}
					</Typography>
					<div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
						<span>{format(launch.startedAt, "dd.MM.yyyy HH:mm")}</span>
						<DotSeparator />
						<span className="inline-block w-18 shrink-0">{runModeLabel}</span>
						<DotSeparator />
						<span className="inline-flex items-center gap-1">
							<Users className="size-3.5 shrink-0" aria-hidden />
							{t("history.participants", { count: launch.userRegisteredCount })}
						</span>
					</div>
				</div>
				<ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden />
			</Link>
		</li>
	);
};
