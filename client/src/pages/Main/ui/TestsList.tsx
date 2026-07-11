import { TestCard, useGetTestes } from "@entities/test";

export const TestsList = () => {
	const { tests } = useGetTestes();

	return <div className="flex h-full w-full flex-wrap content-start gap-5">{!!tests && tests.map((test) => <TestCard key={test.id} {...test} />)}</div>;
};
