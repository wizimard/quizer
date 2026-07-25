import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Typography } from "@shared/ui/typography";

interface TestLaunchOverviewProps {
	testId: string;
	launch_count: number;
	last_launch_date: Date | null;
}

export const TestLaunchOverview = ({ testId, launch_count, last_launch_date }: TestLaunchOverviewProps) => {
	const { t } = useTranslation();

	if (launch_count === 0) {
		return <Typography>{t("test.launch_overview.empty")}</Typography>;
	}

	const lastLaunchDate = last_launch_date ? format(last_launch_date, "dd.MM.yyyy HH:mm") : null;

	return (
		<Typography>
			{t("test.launch_overview.launches_count", { count: launch_count })}
			{lastLaunchDate ? (
				<>
					{" · "}
					{t("test.launch_overview.last_launch", { date: lastLaunchDate })}
				</>
			) : null}
			{" · "}
			<Link to={`/test-history/${testId}`}>{t("test.launch_overview.link")}</Link>
		</Typography>
	);
};
