import { useStopTest, type StoppableTest } from "../hooks/useStopTest";
import { ButtonTestStop } from "@entities/test";

export interface TestStopProps {
	test: StoppableTest;
}

export const StopTest = ({ test }: TestStopProps) => {
	const { stopTest, isLoading } = useStopTest(test);

	const handleClick = () => {
		stopTest();
	};

	return <ButtonTestStop onClick={handleClick} isLoading={isLoading} />;
};
