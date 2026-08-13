import { useTranslation } from "react-i18next";
import type { TestExecutionOverview } from "@entities/test";
import { Typography } from "@shared/ui/typography";
import { TestExecutionOverviewUsersTable } from "@widgets/TestExecutionOverviewUsersTable";

interface TestManageParticipantsProps {
	testOverview: TestExecutionOverview;
}

export const TestManageParticipants = ({ testOverview }: TestManageParticipantsProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-baseline justify-between gap-3">
				<Typography variant="subtitle1" className="text-foreground">
					{t("test_manage.participants_title")}
				</Typography>
				<Typography variant="caption">{t("test_manage.participants_count", { count: testOverview.registered_users.length })}</Typography>
			</div>
			<TestExecutionOverviewUsersTable testOverview={testOverview} />
		</div>
	);
};
