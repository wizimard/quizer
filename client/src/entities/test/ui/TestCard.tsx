import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import type { Test } from "../model/test.interface";
import { Card, CardContent } from "@shared/ui/kit/card";
import { Typography } from "@shared/ui/typography";

export const TestCard = ({ id, title, last_launch_date, launches_count, isOpen }: Test) => {
	const { t } = useTranslation();

	const lastLaunchDate = last_launch_date ? format(new Date(last_launch_date), "dd.MM.yyyy HH:mm") : null;

	return (
		<Card className="h-[auto] w-[500px] p-0">
			<Link to={`/test/${id}`} className="flex h-full w-full items-start justify-start gap-2.5 p-2.5 transition-colors hover:bg-muted/50">
				<CardContent className="flex h-full w-full min-w-0 flex-col gap-1 overflow-hidden p-0">
					<div className="flex min-w-0 items-baseline justify-between gap-2">
						<Typography component="span" variant="subtitle1" className="min-w-0 truncate">
							{title}
						</Typography>
						{isOpen ? (
							<span className="inline-flex shrink-0 items-center gap-1.5 text-green-600 dark:text-green-500">
								<span className="relative flex size-2.5" aria-hidden>
									<span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
									<span className="relative inline-flex size-2.5 rounded-full bg-green-500" />
								</span>
								<Typography variant="body2" className="text-inherit">
									{t("test.card.currently_open")}
								</Typography>
							</span>
						) : null}
					</div>
					{launches_count === 0 ? (
						<Typography variant="caption">{t("test.launch_overview.empty")}</Typography>
					) : (
						<>
							<Typography variant="caption">{t("test.launch_overview.launches_count", { count: launches_count })}</Typography>
							{lastLaunchDate ? <Typography variant="caption">{t("test.launch_overview.last_launch", { date: lastLaunchDate })}</Typography> : null}
						</>
					)}
				</CardContent>
			</Link>
		</Card>
	);
};
