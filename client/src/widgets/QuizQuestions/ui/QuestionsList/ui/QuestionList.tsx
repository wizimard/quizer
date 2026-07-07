import { QuestionListItemContainer, QuestionView } from "@entities/question";
import type { QuestionResponse } from "@shared/api/generated";
import { Text } from "@shared/ui/text";

export interface IQuestionListProps {
	question: QuestionResponse;
	index: number;
	isLast: boolean;
	handleClickUp: (question: QuestionResponse) => void;
	handleClickDown: (question: QuestionResponse) => void;
	handleClickEdit: (question: QuestionResponse) => void;
}

export const QuestionList = ({ question, index, isLast, handleClickEdit, handleClickUp, handleClickDown }: IQuestionListProps) => {
	return (
		<li key={question.id} className="flex w-full list-none gap-2.5">
			<Text className="w-7" align="right">
				{index + 1}
			</Text>
			<QuestionListItemContainer>
				<QuestionView
					question={question}
					handleClickEdit={handleClickEdit}
					handleClickUp={handleClickUp}
					handleClickDown={handleClickDown}
					isDisableDownButton={isLast}
					isDisableUpButton={index === 0}
				/>
			</QuestionListItemContainer>
		</li>
	);
};
