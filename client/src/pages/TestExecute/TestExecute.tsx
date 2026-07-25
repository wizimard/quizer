import { useParams } from "react-router-dom";
import { TestExecuteContent } from "./ui/TestExecuteContent";
import { LoadingLayout } from "@shared/ui/layout";
import { useGetExecutionTest } from "@entities/test";

export const TestExecute = () => {
	const { id } = useParams();

	const { isLoading, error, test } = useGetExecutionTest(id as string);

	return (
		<LoadingLayout isLoading={isLoading} error={error}>
			{!!test && <TestExecuteContent test={test} />}
		</LoadingLayout>
	);
};
