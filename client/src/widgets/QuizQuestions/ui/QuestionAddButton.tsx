import { createNewQuestion } from "@entities/question";
import type { TQuiz } from "@entities/quiz";
import { useQuestionDrawer } from "@widgets/QuizQuestions/store/question-drawer";
import { ButtonAddListItem } from "@shared/ui/button";

export interface IQuestionAddButtonProps {
	quiz: TQuiz;
}

export const QuestionAddButton = ({ quiz }: IQuestionAddButtonProps) => {
	const setIsOpen = useQuestionDrawer((state) => state.setIsOpen);
	const setQuestion = useQuestionDrawer((state) => state.setQuestion);

	const handleAddQuestion = () => {
		const newQuestion = createNewQuestion({ quizId: quiz.id, order: quiz.questions.length });

		setQuestion(newQuestion);
		setIsOpen(true);
	};

	return (
		<div className="mb-4 flex w-full gap-2.5 pr-9">
			<div className="w-7 shrink-0" aria-hidden />
			<ButtonAddListItem onClick={handleAddQuestion} label="quiz.add_question_button" />
		</div>
	);
};
