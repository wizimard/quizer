import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TestToolbar } from "./ui/TestToolbar";
import { TestLaunchOverview } from "./ui/TestLaunchOverview";
import { LoadingLayout } from "@shared/ui/layout";
import { Separator } from "@shared/ui/kit/separator";
import { useGetFullTest } from "@entities/test";
import { QuestionsWidget } from "@widgets/TestQuestions";
import { Typography } from "@shared/ui/typography";

export const Test = () => {
	const { t } = useTranslation();
	const { id } = useParams();

	const { isLoading, isForbidden, test } = useGetFullTest(id as string);

	return (
		<LoadingLayout isLoading={isLoading} error={isForbidden ? new Error("test.errors.forbidden") : undefined}>
			<>
				{!!test && (
					<div className="flex min-h-a w-full shrink flex-col gap-2.5 px-10 pt-5 pb-2.5">
						<TestToolbar test={test} />
						<Separator />
						{test.isOpen && (
							<>
								<Typography>
									{t("test.execution_overview.text")} <Link to={`/test-execution-overview/${test.id}`}>{t("test.execution_overview.link")}</Link>.
								</Typography>
								<Separator />
							</>
						)}
						<TestLaunchOverview testId={test.id} launch_count={test.launches_count} last_launch_date={test.last_launch_date} />
						<Separator />
						<QuestionsWidget test={test} />
					</div>
				)}
			</>
		</LoadingLayout>
	);
};
