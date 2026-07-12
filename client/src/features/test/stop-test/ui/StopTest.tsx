import { useStopTest } from "../hooks/useStopTest";
import { ButtonTestStop, type Test } from "@entities/test";

export interface TestStopProps {
	test: Test;
}

export const StopTest = ({ test }: TestStopProps) => {
	const { stopTest, isLoading } = useStopTest(test);

	const handleClick = () => {
		stopTest();
	};

	return <ButtonTestStop onClick={handleClick} isLoading={isLoading} />;
};
