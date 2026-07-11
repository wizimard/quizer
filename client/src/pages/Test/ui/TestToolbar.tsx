import { TestSettingsDrawer } from "./TestSettingsDrawer";
import { SettingsDrawerButton } from "./SettingsDrawerButton";
import { Text } from "@shared/ui/text";
import { TestResponseStatusEnum } from "@shared/api/generated";
import { TestStatus, type TestFull } from "@entities/test";
import { StartTest } from "@features/test/start-test";
import { StopTest } from "@features/test/stop-test";

export interface TestToolbarProps {
	test: TestFull;
}

export const TestToolbar = ({ test }: TestToolbarProps) => {
	const isOpen = test.status === TestResponseStatusEnum.Open;

	return (
		<>
			<div className="flex w-full items-center gap-3">
				<Text component="h1" className="text-[1.4rem]">
					{test.title}
				</Text>
				<TestStatus status={test.status} className="ml-auto" />
				{isOpen ? <StopTest test={test} /> : <StartTest test={test} />}
				<SettingsDrawerButton />
			</div>
			<TestSettingsDrawer test={test} />
		</>
	);
};
