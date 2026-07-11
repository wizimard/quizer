import { useParams } from "react-router-dom";
import { TestToolbar } from "./ui/TestToolbar";
import { LoadingLayout } from "@shared/ui/layout";
import { Separator } from "@shared/ui/kit/separator";
import { useGetTest } from "@entities/test";
import { QuestionsWidget } from "@widgets/TestQuestions";

export const Test = () => {
	const { id } = useParams();

	const { isLoading, isForbidden, test } = useGetTest(id as string);

	return (
		<LoadingLayout isLoading={isLoading} error={isForbidden ? new Error("test.errors.forbidden") : undefined}>
			<>
				{!!test && (
					<div className="flex min-h-a w-full shrink flex-col gap-2.5 px-10 pt-5 pb-2.5">
						<TestToolbar test={test} />
						<Separator />
						<QuestionsWidget test={test} />
					</div>
				)}
			</>
		</LoadingLayout>
	);
};
