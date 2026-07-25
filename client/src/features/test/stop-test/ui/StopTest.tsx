import { type StoppableTest } from "../hooks/useStopTest";
import { StopTestDialog } from "./StopTestDialog";
import { DIALOG_KEYS, useOpenDialog } from "@shared/model";
import { ButtonTestStop } from "@entities/test";

export interface TestStopProps {
	test: StoppableTest;
}

export const StopTest = ({ test }: TestStopProps) => {
	const openDialog = useOpenDialog(DIALOG_KEYS.STOP_TEST);

	return (
		<>
			<ButtonTestStop onClick={openDialog} />
			<StopTestDialog test={test} />
		</>
	);
};
