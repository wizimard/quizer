import { QuestionListItemContainer, QuestionView } from "@entities/question";
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
						<QuestionView question={question} />
					</QuestionListItemContainer>
				</li>
			))}
		</ul>
	);
};
