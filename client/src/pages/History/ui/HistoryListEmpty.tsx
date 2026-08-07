import { useTranslation } from "react-i18next";
import { Typography } from "@shared/ui/typography";

export const HistoryListEmpty = () => {
	const { t } = useTranslation();

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
};
