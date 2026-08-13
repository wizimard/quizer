import type { TestExecutionOverview } from "@entities/test";

export function resolveTargetQuestionId(testOverview: TestExecutionOverview): string | null {
	const { questions, current_question: currentQuestion } = testOverview;

	if (questions.length === 0) {
		return null;
	}

	if (currentQuestion == null) {
		return questions[0]?.id ?? null;
	}

	const currentIndex = questions.findIndex((question) => question.id === currentQuestion.id);

	if (currentIndex === -1) {
		return null;
	}

	return questions[currentIndex + 1]?.id ?? null;
}
