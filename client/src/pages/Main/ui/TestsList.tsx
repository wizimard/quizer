import { TestCard, useGetTestes } from "@entities/test";
import { TestsListEmpty } from "./TestsListEmpty";

export const TestsList = () => {
	const { tests } = useGetTestes();

	if (!tests || tests.length === 0) {
		return <TestsListEmpty />;
	}

	return (
		<div className="flex h-full w-full flex-wrap content-start gap-5">
			{tests.map((test) => (
				<TestCard key={test.id} {...test} />
			))}
		</div>
	);
};
