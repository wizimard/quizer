import { ActiveQuestionView } from "./ActiveQuestionView";
import { WaitingToStartView } from "./WaitingToStartView";
import { NextQuestion, StartQuestions } from "@features/test/next-question";
import type { TestExecutionOverview } from "@entities/test";
import { TestExecutionOverviewResponseRunModeEnum } from "@shared/api/generated";

interface TestCurrentQuestionWidgetProps {
	testOverview: TestExecutionOverview;
}

export const TestCurrentQuestionWidget = ({ testOverview }: TestCurrentQuestionWidgetProps) => {
	if (testOverview.run_mode !== TestExecutionOverviewResponseRunModeEnum.Manual) {
		return null;
	}

	if (testOverview.current_question == null) {
		return <WaitingToStartView action={<StartQuestions testOverview={testOverview} />} />;
	}

	const questionIndex = testOverview.current_question_index ?? 0;
	const totalQuestions = testOverview.total_questions_count ?? testOverview.questions.length;

	return <ActiveQuestionView question={testOverview.current_question} questionIndex={questionIndex} totalQuestions={totalQuestions} action={<NextQuestion testOverview={testOverview} />} />;
};
