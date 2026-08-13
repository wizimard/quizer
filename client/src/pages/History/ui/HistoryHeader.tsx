import { useTranslation } from "react-i18next";
import { Typography } from "@shared/ui/typography";

interface HistoryHeaderProps {
	launchesCount: number;
}

export const HistoryHeader = ({ launchesCount }: HistoryHeaderProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-1">
			<Typography component="h1" className="text-[1.4rem] text-foreground">
				{t("history.title")}
			</Typography>
			<Typography variant="body2" className="text-muted-foreground">
				{t("history.launches_count", { count: launchesCount })}
			</Typography>
		</div>
	);
};
