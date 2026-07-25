import { TestClosedScreen } from "./TestClosedScreen";
import { TestCompletedScreen } from "./TestCompletedScreen";
import { TestQuestionWaitingScreen } from "./TestQuestionWaitingScreen";
import { TestRegisterScreen } from "./TestRegisterScreen";
import { useTestExecutionStore, type TestExecution } from "@entities/test";
import { QuestionAnswerWidget } from "@widgets/QuestionAnswer";

interface TestExecuteContentProps {
	test: TestExecution;
}

export const TestExecuteContent = ({ test }: TestExecuteContentProps) => {
	const { status, currentQuestion, user } = useTestExecutionStore();

	if (status === "open" && !user) {
		return <TestRegisterScreen test={test} />;
	}

	if (status === "open" && user && currentQuestion) {
		return <QuestionAnswerWidget test={test} question={currentQuestion} />;
	}

	if (status === "question_waiting") {
		return <TestQuestionWaitingScreen test={test} />;
	}

	if (status === "completed") {
		return <TestCompletedScreen test={test} />;
	}

	return <TestClosedScreen test={test} />;
};
