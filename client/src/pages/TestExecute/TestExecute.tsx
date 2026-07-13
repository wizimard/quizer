import { useParams } from "react-router-dom";
import { TestClosedScreen } from "./ui/TestClosedScreen";
import { LoadingLayout } from "@shared/ui/layout";
import { useGetExecutionTest } from "@entities/test";
export const TestExecute = () => {
	const { id } = useParams();

	const { isLoading, error, test } = useGetExecutionTest(id as string);

	return (
		<LoadingLayout isLoading={isLoading} error={error}>
			{!!test && (test.isOpen ? <div>{test.title}</div> : <TestClosedScreen test={test} />)}
		</LoadingLayout>
	);
};
