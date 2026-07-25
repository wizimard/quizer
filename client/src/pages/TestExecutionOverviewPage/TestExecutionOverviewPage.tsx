import { useParams } from "react-router-dom";
import { TestManageHeader } from "./ui/TestManageHeader";
import { TestManageParticipants } from "./ui/TestManageParticipants";
import { useGetTestOverview } from "@entities/test";
import { Separator } from "@shared/ui/kit/separator";
import { LoadingLayout } from "@shared/ui/layout";
import { TestCurrentQuestionWidget } from "@widgets/TestCurrentQuestion";
import { TestExecutionOverviewResponseRunModeEnum } from "@shared/api/generated";

export const TestExecutionOverviewPage = () => {
	const { id } = useParams();

	const { isLoading, testOverview, error } = useGetTestOverview(id as string);

	return (
		<LoadingLayout isLoading={isLoading} error={error}>
			{!!testOverview && (
				<div className="flex min-h-a w-full shrink flex-col gap-4 bg-gradient-to-b from-muted/40 via-background to-background px-10 pt-5 pb-8">
					<TestManageHeader testOverview={testOverview} />
					<Separator />

					{testOverview.run_mode === TestExecutionOverviewResponseRunModeEnum.Manual && <TestCurrentQuestionWidget testOverview={testOverview} />}

					<TestManageParticipants testOverview={testOverview} />
				</div>
			)}
		</LoadingLayout>
	);
};
