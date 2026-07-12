import { useStartTest } from "../hooks/useStartTest";
import { ButtonTestStart, type TestFull } from "@entities/test";

export interface StartTestProps {
	test: TestFull;
}

export const StartTest = ({ test }: StartTestProps) => {
	const { startTest, isLoading } = useStartTest(test.id);

	const handleClick = () => {
		startTest();
	};

	return <ButtonTestStart onClick={handleClick} disabled={test.questions.length === 0} isLoading={isLoading} />;
};
