import { useTranslation } from "react-i18next";
import type { TestSessionOverview } from "@entities/test";
import { Typography } from "@shared/ui/typography";
import { TestExecutionOverviewUsersTable } from "@widgets/TestExecutionOverviewUsersTable";

interface TestSessionOverviewParticipantsProps {
	sessionOverview: TestSessionOverview;
}

export const TestSessionOverviewParticipants = ({ sessionOverview }: TestSessionOverviewParticipantsProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-baseline justify-between gap-3">
				<Typography variant="subtitle1" className="text-foreground">
					{t("test_session_overview.participants_title")}
				</Typography>
				<Typography variant="caption" className="text-muted-foreground">
					{t("test_session_overview.participants_count", { count: sessionOverview.registered_users.length })}
				</Typography>
			</div>
			<TestExecutionOverviewUsersTable testOverview={sessionOverview} emptyVariant="session" />
		</div>
	);
};
