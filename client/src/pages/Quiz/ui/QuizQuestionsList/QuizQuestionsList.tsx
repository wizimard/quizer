import { Question, QuestionListItemContainer } from "@features/question";
import { QUESTION_MODES } from "@features/question/ui/Question/Question.types";
import type { QuestionRequest } from "@shared/api/generated";
import { Text } from "@shared/ui/text";

export interface IQuizQuestionsListProps {
	questions: QuestionRequest[];
}

export const QuizQuestionsList = ({ questions }: IQuizQuestionsListProps) => {
	return (
		<ul className="m-0 flex h-full w-full list-none flex-col gap-4 p-0">
			{questions.map((question, index) => (
				<li key={question.id} className="flex w-full list-none gap-2.5">
					<Text className="w-7" align="right">
						{index + 1}
					</Text>
					<QuestionListItemContainer>
						<Question question={question} mode={QUESTION_MODES.VIEW} />
					</QuestionListItemContainer>
				</li>
			))}
		</ul>
	);
};
