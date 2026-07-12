import { TestSettingsDrawer } from "./TestSettingsDrawer";
import { SettingsDrawerButton } from "./SettingsDrawerButton";
import type { TestFull } from "@entities/test";

export interface TestSettingsProps {
	test: TestFull;
}
// TODO: translate
export const TestSettings = ({ test }: TestSettingsProps) => {
	return (
		<>
			<SettingsDrawerButton test={test} />
			<TestSettingsDrawer />
		</>
	);
};
