import { useQuestionDrawer } from "../store/question-drawer";
import { createNewQuestion, type Question } from "@entities/question";
import { ButtonAddListItem } from "@shared/ui/button";
import type { TestFull } from "@entities/test";

export interface QuestionAddButtonProps {
	test: TestFull;
}

export const QuestionAddButton = ({ test }: QuestionAddButtonProps) => {
	const setIsOpen = useQuestionDrawer((state) => state.setIsOpen);
	const setQuestion = useQuestionDrawer((state) => state.setQuestion);

	const handleAddQuestion = () => {
		const newQuestion: Question = createNewQuestion({ testId: test.id, order: test.questions.length });

		setQuestion(newQuestion);
		setIsOpen(true);
	};

	return (
		<div className="mb-4 flex w-full gap-2.5 pr-9">
			<div className="w-7 shrink-0" aria-hidden />
			<ButtonAddListItem onClick={handleAddQuestion} label="test.add_question_button" />
		</div>
	);
};
