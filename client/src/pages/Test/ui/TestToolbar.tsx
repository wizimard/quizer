import { Typography } from "@shared/ui/typography";
import { TestResponseStatusEnum } from "@shared/api/generated";
import { TestStatus, type TestFull } from "@entities/test";
import { StartTest } from "@features/test/start-test";
import { StopTest } from "@features/test/stop-test";
import { TestSettings } from "@widgets/TestSettings";

export interface TestToolbarProps {
	test: TestFull;
}

export const TestToolbar = ({ test }: TestToolbarProps) => {
	const isOpen = test.status === TestResponseStatusEnum.Open;

	return (
		<>
			<div className="flex w-full items-center gap-3">
				<Typography component="h1" className="text-[1.4rem] text-nowrap overflow-hidden text-ellipsis whitespace-nowrap">
					{test.title}
				</Typography>
				<TestStatus status={test.status} className="ml-auto" />
				{isOpen ? <StopTest test={test} /> : <StartTest test={test} />}
				<TestSettings test={test} />
			</div>
		</>
	);
};
