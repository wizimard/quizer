import { useTranslation } from "react-i18next";
import { HistoryListItem } from "./HistoryListItem";
import type { TestLaunchHistory } from "@entities/test";
import { Typography } from "@shared/ui/typography";

interface HistoryListProps {
	launches: Array<TestLaunchHistory>;
}

export const HistoryList = ({ launches }: HistoryListProps) => {
	const { t } = useTranslation();

	if (launches.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-card/40 px-6 py-12 text-center ring-1 ring-foreground/10">
				<Typography variant="subtitle1" className="text-foreground">
					{t("history.empty")}
				</Typography>
				<Typography variant="body2" className="text-muted-foreground">
					{t("history.empty_description")}
				</Typography>
			</div>
		);
	}

	return (
		<ul className="flex flex-col gap-2">
			{launches.map((launch) => (
				<HistoryListItem key={launch.sessionId} launch={launch} />
			))}
		</ul>
	);
};
