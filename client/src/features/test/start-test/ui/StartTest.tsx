import { StartTestDialog } from "./StartTestDialog";
import { ButtonTestStart, type TestFull } from "@entities/test";
import { DIALOG_KEYS, useOpenDialog } from "@shared/model";

export interface StartTestProps {
	test: TestFull;
}

export const StartTest = ({ test }: StartTestProps) => {
	const openDialog = useOpenDialog(DIALOG_KEYS.START_TEST);

	return (
		<>
			<ButtonTestStart onClick={openDialog} disabled={test.questions.length === 0} />
			<StartTestDialog testId={test.id} />
		</>
	);
};
